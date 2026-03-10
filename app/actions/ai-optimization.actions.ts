/**
 * Server Actions - AI Menu Optimization
 */

"use server";

import { generateMenuOptimizationSuggestions } from "@/lib/ai-optimization";
import * as recipesService from "@/lib/db/services/recipes.service";
import * as ingredientsService from "@/lib/db/services/ingredients.service";
import * as menuService from "@/lib/db/services/menu-plan.service";
import * as inventoryService from "@/lib/db/services/inventory.service";

export async function getAISuggestionsForWeek(weekStartDate: string) {
  try {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const endDateStr = weekEndDate.toISOString().split("T")[0];

    const [menu, recipes, ingredients, inventory] = await Promise.all([
      menuService.getMenuPlanByDateRange(weekStartDate, endDateStr),
      recipesService.getRecipesWithIngredients(),
      ingredientsService.getIngredients(),
      inventoryService.getInventory(),
    ]);

    const ingredientNames = new Map(ingredients.map((i) => [i.id, i.name]));

    const suggestions = await generateMenuOptimizationSuggestions(
      weekStartDate,
      endDateStr,
      menu,
      recipes,
      inventory,
      ingredientNames,
    );

    return { success: true, data: suggestions };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching AI suggestions:", message);
    return { success: false, message, data: [] };
  }
}

export async function applyMenuSuggestion(
  date: string,
  dietType: string,
  recipeId: number,
) {
  try {
    await menuService.upsertMenuItem({
      date,
      diet_type: dietType as any,
      recipe_id: recipeId,
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error applying menu suggestion:", message);
    return { success: false, message };
  }
}
