/**
 * Calculations Utility
 * Core logic for shopping list and kitchen prep sheet calculations
 */

import Decimal from "decimal.js";
import type {
  ShoppingListItem,
  KitchenPrepSheetRow,
  MenuItem,
  RecipeWithIngredients,
  PortionCount,
  InventoryItem,
  AgeMultiplier,
  Ingredient,
} from "./db/types";

interface IngredientRequirement {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  amount: Decimal;
}

interface KitaRecipeRequirements {
  kitaId: number;
  kitaName: string;
  recipeId: number;
  recipeName: string;
  requirements: IngredientRequirement[];
}

/**
 * Calculate adjusted portions for a specific diet type across all age groups
 */
function calculateAdjustedPortions(
  portionCounts: PortionCount[],
  ageMultipliers: Map<string, AgeMultiplier>,
  ageGroup: string,
  dietType: string,
  recipeAdjustmentCategory: string
): Decimal {
  const count = portionCounts.find(
    (pc) => pc.age_group === ageGroup && pc.diet_type === dietType
  );

  if (!count) {
    return new Decimal(0);
  }

  const multiplierKey = `${ageGroup}:${recipeAdjustmentCategory}`;
  const multiplier = ageMultipliers.get(multiplierKey);

  if (!multiplier) {
    throw new Error(
      `No age multiplier found for ${ageGroup} / ${recipeAdjustmentCategory}`
    );
  }

  return new Decimal(count.children_count).times(multiplier.multiplier);
}

/**
 * Calculate total ingredient requirements for a recipe per Kita
 */
function calculateRecipeRequirements(
  recipe: RecipeWithIngredients,
  kitaPortionCounts: PortionCount[],
  ageMultipliers: Map<string, AgeMultiplier>,
  dietType: string
): IngredientRequirement[] {
  const ageGroups = ["Krippe", "Kita", "Hort"];
  let totalAdjustedPortions = new Decimal(0);

  // Sum adjusted portions across all age groups for this diet type
  for (const ageGroup of ageGroups) {
    const portions = calculateAdjustedPortions(
      kitaPortionCounts,
      ageMultipliers,
      ageGroup,
      dietType,
      recipe.portion_adjustment_category
    );
    totalAdjustedPortions = totalAdjustedPortions.plus(portions);
  }

  // Calculate ingredient amounts
  return recipe.ingredients.map((ri) => ({
    ingredientId: ri.ingredient.id,
    ingredientName: ri.ingredient.name,
    unit: ri.ingredient.unit,
    amount: new Decimal(ri.amount_per_portion).times(totalAdjustedPortions),
  }));
}

/**
 * Aggregate ingredient requirements across all Kitas
 */
function aggregateRequirements(
  requirements: IngredientRequirement[]
): Map<number, IngredientRequirement> {
  const aggregated = new Map<number, IngredientRequirement>();

  for (const req of requirements) {
    if (aggregated.has(req.ingredientId)) {
      const existing = aggregated.get(req.ingredientId)!;
      existing.amount = existing.amount.plus(req.amount);
    } else {
      aggregated.set(req.ingredientId, { ...req });
    }
  }

  return aggregated;
}

/**
 * Calculate weekly shopping list
 */
export async function calculateShoppingList(
  startDate: string,
  endDate: string,
  menuItems: MenuItem[],
  kitasMap: Map<number, { id: number; name: string }>,
  kitaRecipes: Map<number, RecipeWithIngredients>,
  portionCountsPerKita: Map<number, PortionCount[]>,
  ageMultipliers: Map<string, AgeMultiplier>,
  ingredientsMap: Map<number, Ingredient>,
  inventory: Map<number, InventoryItem>
): Promise<ShoppingListItem[]> {
  const aggregatedRequirements = new Map<number, Decimal>();

  // Process each menu item
  for (const menuItem of menuItems) {
    const recipe = kitaRecipes.get(menuItem.recipe_id);
    if (!recipe) continue;

    // For each Kita, calculate requirements
    for (const [kitaId, portions] of portionCountsPerKita) {
      try {
        const requirements = calculateRecipeRequirements(
          recipe,
          portions,
          ageMultipliers,
          menuItem.diet_type
        );

        for (const req of requirements) {
          const current =
            aggregatedRequirements.get(req.ingredientId) || new Decimal(0);
          aggregatedRequirements.set(
            req.ingredientId,
            current.plus(req.amount)
          );
        }
      } catch (error) {
        console.error(
          `Error calculating requirements for kita ${kitaId}, recipe ${recipe.id}:`,
          error
        );
      }
    }
  }

  // Convert to shopping list items
  const shoppingList: ShoppingListItem[] = [];

  for (const [ingredientId, requiredAmount] of aggregatedRequirements) {
    const ingredient = ingredientsMap.get(ingredientId);
    if (!ingredient) continue;

    const inventoryItem = inventory.get(ingredientId);
    const inventoryAmount = inventoryItem?.quantity ?? 0;

    let shoppingAmount = new Decimal(requiredAmount).minus(inventoryAmount);
    if (shoppingAmount.isNegative()) {
      shoppingAmount = new Decimal(0);
    }

    shoppingList.push({
      ingredient_id: ingredientId,
      ingredient_name: ingredient.name,
      unit: ingredient.unit,
      required_amount: Number(requiredAmount),
      inventory_amount: Number(inventoryAmount),
      shopping_amount: Number(shoppingAmount),
    });
  }

  return shoppingList.sort((a, b) =>
    a.ingredient_name.localeCompare(b.ingredient_name)
  );
}

/**
 * Calculate kitchen preparation sheet for a specific day
 */
export async function calculateKitchenPrepSheet(
  date: string,
  menuItems: MenuItem[],
  kitasMap: Map<number, { id: number; name: string }>,
  kitaRecipes: Map<number, RecipeWithIngredients>,
  portionCountsPerKita: Map<number, PortionCount[]>,
  ageMultipliers: Map<string, AgeMultiplier>,
  ingredientsMap: Map<number, Ingredient>
): Promise<KitchenPrepSheetRow[]> {
  const rows: KitchenPrepSheetRow[] = [];

  // Get menu items for this date
  const dayMenuItems = menuItems.filter((m) => m.date === date);

  // For each kita
  for (const [kitaId, kita] of kitasMap) {
    const kitaPortions = portionCountsPerKita.get(kitaId);
    if (!kitaPortions) continue;

    // For each menu item on this date
    for (const menuItem of dayMenuItems) {
      const recipe = kitaRecipes.get(menuItem.recipe_id);
      if (!recipe) continue;

      // Calculate requirements for this kita
      try {
        const requirements = calculateRecipeRequirements(
          recipe,
          kitaPortions,
          ageMultipliers,
          menuItem.diet_type
        );

        // Add each ingredient to the prep sheet
        for (const req of requirements) {
          const ingredient = ingredientsMap.get(req.ingredientId);
          if (!ingredient) continue;

          rows.push({
            kita_id: kitaId,
            kita_name: kita.name,
            ingredient_id: req.ingredientId,
            ingredient_name: req.ingredientName,
            unit: req.unit as any,
            quantity: Number(req.amount),
          });
        }
      } catch (error) {
        console.error(
          `Error calculating prep sheet for kita ${kitaId}, recipe ${recipe.id}:`,
          error
        );
      }
    }
  }

  // Sort by kita, then ingredient name
  return rows.sort((a, b) => {
    if (a.kita_id !== b.kita_id) {
      return a.kita_id - b.kita_id;
    }
    return a.ingredient_name.localeCompare(b.ingredient_name);
  });
}
