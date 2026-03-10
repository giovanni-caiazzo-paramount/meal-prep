/**
 * AI Menu Optimization Service
 * Uses OpenAI to suggest menu changes based on inventory
 */

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type {
  MenuItem,
  RecipeWithIngredients,
  InventoryItem,
  MenuOptimizationSuggestion,
  ShoppingListItem,
} from "./db/types";
import { calculateShoppingList } from "./calculations";

// Zod schema for AI response
const MenuSuggestionSchema = z.object({
  date: z.string().describe("Date in YYYY-MM-DD format"),
  diet_type: z
    .string()
    .describe("Diet type: vegetarisch, fleisch, or pescetarisch"),
  suggested_recipe_name: z.string().describe("Name of the suggested recipe"),
  suggested_recipe_id: z.number().describe("ID of the suggested recipe"),
  reasoning: z.string().describe("Why this recipe is suggested"),
  ingredients_that_use_inventory: z.array(
    z.object({
      ingredient_name: z.string(),
      amount_saved: z.number(),
    })
  ),
});

type MenuSuggestion = z.infer<typeof MenuSuggestionSchema>;

/**
 * Generate menu optimization suggestions using AI
 */
export async function generateMenuOptimizationSuggestions(
  startDate: string,
  endDate: string,
  currentMenu: MenuItem[],
  allRecipes: RecipeWithIngredients[],
  inventory: InventoryItem[],
  ingredientNames: Map<number, string>
): Promise<MenuSuggestion[]> {
  // Filter inventory items with significant quantities
  const significantInventory = inventory
    .filter((item) => item.quantity > 100) // Only show meaningful leftovers
    .map((item) => ({
      name: ingredientNames.get(item.ingredient_id) || "Unknown",
      quantity: item.quantity,
    }));

  if (significantInventory.length === 0) {
    return []; // No suggestions if inventory is low
  }

  // Get current menu items for the period
  const menuForPeriod = currentMenu.filter(
    (m) => m.date >= startDate && m.date <= endDate
  );

  // Build recipes list for context
  const recipesContext = allRecipes
    .map((r) => ({
      id: r.id,
      name: r.name,
      ingredients: r.ingredients
        .map((ri) => `${ri.ingredient.name} (${ri.amount_per_portion}g/ml)`)
        .join(", "),
    }))
    .slice(0, 20); // Limit to avoid token overflow

  try {
    const suggestions = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: z.array(MenuSuggestionSchema).max(3), // Max 3 suggestions
      prompt: `
        You are a smart catering optimization assistant. 
        
        Current inventory (leftovers):
        ${significantInventory.map((i) => `- ${i.name}: ${i.quantity}g/ml`).join("\n")}
        
        Current menu for ${startDate} to ${endDate}:
        ${menuForPeriod.map((m) => `- ${m.date} (${m.diet_type}): Some recipe`).join("\n")}
        
        Available recipes to choose from:
        ${recipesContext.map((r) => `- ${r.name} (ID: ${r.id}): ${r.ingredients}`).join("\n")}
        
        Suggest up to 3 menu replacements that would:
        1. Use the significant inventory items
        2. Still maintain dietary variety
        3. Be suitable for the Kita environment
        
        For each suggestion, provide:
        - The date and diet type to replace
        - Which recipe to suggest (must be from the available recipes)
        - Why this uses up inventory
        - Estimated savings in shopping list
        
        Return ONLY valid recipes that exist in the available recipes list above.
      `,
    });

    return suggestions.object;
  } catch (error) {
    console.error("Error generating menu optimization suggestions:", error);
    return [];
  }
}

/**
 * Validate a suggestion and calculate shopping list difference
 * (This would be called after user approves a suggestion)
 */
export async function validateAndCalculateSuggestion(
  originalRecipeId: number,
  suggestedRecipeId: number,
  date: string,
  dietType: string,
  allRecipes: Map<number, RecipeWithIngredients>
): Promise<{
  valid: boolean;
  error?: string;
  originalRecipe?: RecipeWithIngredients;
  suggestedRecipe?: RecipeWithIngredients;
}> {
  const originalRecipe = allRecipes.get(originalRecipeId);
  const suggestedRecipe = allRecipes.get(suggestedRecipeId);

  if (!suggestedRecipe) {
    return {
      valid: false,
      error: "Suggested recipe not found",
    };
  }

  return {
    valid: true,
    originalRecipe,
    suggestedRecipe,
  };
}
