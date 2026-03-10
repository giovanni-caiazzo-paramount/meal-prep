/**
 * AI Menu Optimization Service
 * Uses LM Studio (OpenAI-compatible local endpoint)
 */

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import env from "./env";
import type {
  MenuItem,
  RecipeWithIngredients,
  InventoryItem,
} from "./db/types";

const lmstudio = createOpenAI({
  baseURL: `${env.LMSTUDIO_BASE_URL}/v1`,
  apiKey: env.LMSTUDIO_API_KEY,
});

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
      model: lmstudio(env.LMSTUDIO_MODEL),
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

// ─── Leftover Analysis ────────────────────────────────────────────────────────

export interface LeftoverItem {
  ingredient_id: number;
  ingredient_name: string;
  leftover_amount: number;
  unit: string;
}

const LeftoverSuggestionSchema = z.object({
  recipe_id: z.number().describe("ID of the recipe from the available list"),
  recipe_name: z.string().describe("Name of the recipe"),
  suggestion_text: z
    .string()
    .describe("How and why this recipe uses up the leftover ingredients"),
  leftover_ingredients_used: z.array(
    z.object({
      ingredient_name: z.string(),
      estimated_amount: z
        .number()
        .describe("Estimated amount consumed in the recipe"),
      unit: z.string().describe("Unit: g, ml, or Stück"),
    })
  ),
});

export type LeftoverSuggestion = z.infer<typeof LeftoverSuggestionSchema>;

/**
 * Given leftover inventory items, suggest recipes that use them up.
 */
export async function generateLeftoverSuggestions(
  leftovers: LeftoverItem[],
  allRecipes: RecipeWithIngredients[]
): Promise<LeftoverSuggestion[]> {
  const recipesContext = allRecipes
    .map((r) => ({
      id: r.id,
      name: r.name,
      ingredients: r.ingredients
        .map(
          (ri) =>
            `${ri.ingredient.name} (${ri.amount_per_portion}${ri.ingredient.unit}/portion)`
        )
        .join(", "),
    }))
    .slice(0, 30); // Limit to avoid token overflow

  try {
    const result = await generateObject({
      model: lmstudio(env.LMSTUDIO_MODEL),
      schema: z.array(LeftoverSuggestionSchema).max(5),
      prompt: `
        You are a catering optimization assistant for a German Kita (daycare) meal service.

        The following ingredients will be LEFT OVER after this week's planned menu:
        ${leftovers.map((l) => `- ${l.ingredient_name}: ${l.leftover_amount} ${l.unit}`).join("\n")}

        Available recipes in the database:
        ${recipesContext.map((r) => `- [ID: ${r.id}] ${r.name}: uses ${r.ingredients}`).join("\n")}

        Suggest up to 5 recipes from the list above that would best use up these leftover ingredients.
        For each suggestion:
        - Only choose recipes that appear in the list above (use the exact ID and name)
        - Explain why this recipe is a good use of the leftovers
        - List which leftover ingredients would be consumed and estimate the amounts

        Prioritize recipes that consume the largest quantities of leftovers.
        Only return valid recipes from the provided list.
      `,
    });

    return result.object;
  } catch (error) {
    console.error("Error generating leftover suggestions:", error);
    return [];
  }
}

// ─── Menu Suggestion Validation ────────────────────────────────────────────────

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
