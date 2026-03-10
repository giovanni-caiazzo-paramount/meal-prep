/**
 * Server Actions - Leftover Analysis & AI Optimization
 */

"use server";

import { calculateShoppingList } from "@/lib/calculations";
import {
  generateLeftoverSuggestions,
  type LeftoverItem,
  type LeftoverSuggestion,
} from "@/lib/ai-optimization";
import * as menuService from "@/lib/db/services/menu-plan.service";
import * as kitasService from "@/lib/db/services/kitas.service";
import * as recipesService from "@/lib/db/services/recipes.service";
import * as ingredientsService from "@/lib/db/services/ingredients.service";
import * as portionService from "@/lib/db/services/portion-counts.service";
import * as ageMultipliersService from "@/lib/db/services/age-multipliers.service";
import * as inventoryService from "@/lib/db/services/inventory.service";
import type { PortionCount } from "@/lib/db/types";

export interface AnalyzeLeftoversResult {
  success: boolean;
  message?: string;
  leftovers: LeftoverItem[];
  suggestions: LeftoverSuggestion[];
}

export async function analyzeLeftoversAction(
  weekStartDate: string
): Promise<AnalyzeLeftoversResult> {
  try {
    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const endDateStr = weekEnd.toISOString().split("T")[0];

    // Fetch all required data in parallel
    const [
      menu,
      kitas,
      recipes,
      ingredients,
      portionCounts,
      ageMultipliers,
      inventory,
    ] = await Promise.all([
      menuService.getMenuPlanByDateRange(weekStartDate, endDateStr),
      kitasService.getKitas(),
      recipesService.getRecipesWithIngredients(),
      ingredientsService.getIngredients(),
      portionService.getPortionCounts(),
      ageMultipliersService.getAgeMultipliers(),
      inventoryService.getInventory(),
    ]);

    // Build lookup maps
    const kitasMap = new Map(
      kitas.map((k) => [k.id, { id: k.id, name: k.name }])
    );
    const kitaRecipes = new Map(recipes.map((r) => [r.id, r]));
    const ingredientsMap = new Map(ingredients.map((i) => [i.id, i]));
    const ageMultipliersMap = new Map(
      ageMultipliers.map((am) => [
        `${am.age_group}:${am.ingredient_category}`,
        am,
      ])
    );
    const inventoryMap = new Map(inventory.map((i) => [i.ingredient_id, i]));

    // Group portion counts by kita
    const portionCountsPerKita = new Map<number, PortionCount[]>();
    for (const kita of kitas) {
      portionCountsPerKita.set(
        kita.id,
        portionCounts.filter((pc) => pc.kita_id === kita.id)
      );
    }

    // Compute ingredient requirements vs inventory via shopping list
    const shoppingList = await calculateShoppingList(
      weekStartDate,
      endDateStr,
      menu,
      kitasMap,
      kitaRecipes,
      portionCountsPerKita,
      ageMultipliersMap,
      ingredientsMap,
      inventoryMap
    );

    const plannedIngredientIds = new Set(
      shoppingList.map((i) => i.ingredient_id)
    );
    const leftovers: LeftoverItem[] = [];

    // 1. Surplus from ingredients used in this week's menu
    for (const item of shoppingList) {
      if (item.inventory_amount > item.required_amount) {
        const surplus = Number(
          (item.inventory_amount - item.required_amount).toFixed(2)
        );
        leftovers.push({
          ingredient_id: item.ingredient_id,
          ingredient_name: item.ingredient_name,
          leftover_amount: surplus,
          unit: item.unit,
        });
      }
    }

    // 2. Inventory items not used by any recipe this week
    for (const invItem of inventory) {
      if (
        !plannedIngredientIds.has(invItem.ingredient_id) &&
        invItem.quantity > 0
      ) {
        const ingredient = ingredientsMap.get(invItem.ingredient_id);
        if (ingredient) {
          leftovers.push({
            ingredient_id: invItem.ingredient_id,
            ingredient_name: ingredient.name,
            leftover_amount: invItem.quantity,
            unit: ingredient.unit,
          });
        }
      }
    }

    if (leftovers.length === 0) {
      return {
        success: true,
        message:
          "No leftovers found for this week — inventory is being used efficiently!",
        leftovers: [],
        suggestions: [],
      };
    }

    // Ask AI for recipe suggestions that use the leftovers
    const suggestions = await generateLeftoverSuggestions(leftovers, recipes);

    return { success: true, leftovers, suggestions };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("analyzeLeftoversAction error:", message);
    return { success: false, message, leftovers: [], suggestions: [] };
  }
}
