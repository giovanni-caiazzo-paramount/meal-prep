/**
 * Server Actions - Shopping List & Calculations
 */

"use server";

import {
  calculateShoppingList,
  calculateKitchenPrepSheet,
} from "@/lib/calculations";
import * as kitasService from "@/lib/db/services/kitas.service";
import * as recipesService from "@/lib/db/services/recipes.service";
import * as ingredientsService from "@/lib/db/services/ingredients.service";
import * as menuService from "@/lib/db/services/menu-plan.service";
import * as portionService from "@/lib/db/services/portion-counts.service";
import * as ageMultipliersService from "@/lib/db/services/age-multipliers.service";
import * as inventoryService from "@/lib/db/services/inventory.service";

export async function getShoppingListForWeek(weekStartDate: string) {
  try {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const endDateStr = weekEndDate.toISOString().split("T")[0];

    // Fetch all necessary data in parallel
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

    // Build maps for efficient lookup
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
    const portionCountsPerKita = new Map<number, any[]>();
    for (const kita of kitas) {
      const kitaPortions = portionCounts.filter((pc) => pc.kita_id === kita.id);
      portionCountsPerKita.set(kita.id, kitaPortions);
    }

    // Calculate shopping list
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

    return {
      success: true,
      data: shoppingList,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error calculating shopping list:", message);
    return {
      success: false,
      message,
      data: [],
    };
  }
}

export async function getKitchenPrepSheetForDay(date: string) {
  try {
    // Fetch all necessary data
    const [menu, kitas, recipes, ingredients, portionCounts, ageMultipliers] =
      await Promise.all([
        menuService.getMenuPlanByDateRange(date, date),
        kitasService.getKitas(),
        recipesService.getRecipesWithIngredients(),
        ingredientsService.getIngredients(),
        portionService.getPortionCounts(),
        ageMultipliersService.getAgeMultipliers(),
      ]);

    // Build maps
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

    // Group portion counts by kita
    const portionCountsPerKita = new Map<number, any[]>();
    for (const kita of kitas) {
      const kitaPortions = portionCounts.filter((pc) => pc.kita_id === kita.id);
      portionCountsPerKita.set(kita.id, kitaPortions);
    }

    // Calculate prep sheet
    const prepSheet = await calculateKitchenPrepSheet(
      date,
      menu,
      kitasMap,
      kitaRecipes,
      portionCountsPerKita,
      ageMultipliersMap,
      ingredientsMap
    );

    return {
      success: true,
      data: prepSheet,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error calculating kitchen prep sheet:", message);
    return {
      success: false,
      message,
      data: [],
    };
  }
}
