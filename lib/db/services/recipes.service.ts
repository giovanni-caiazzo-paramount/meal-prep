/**
 * Recipes Service
 * Data access layer for Recipe entities
 */

import { createServerSupabaseClient } from "../client";
import type {
  Recipe,
  RecipeIngredient,
  Ingredient,
  RecipeWithIngredients,
} from "../types";
import {
  RecipeSchema,
  RecipeIngredientSchema,
  IngredientSchema,
} from "../schemas";

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching recipes:", error);
    throw new Error(`Failed to fetch recipes: ${error.message}`);
  }

  return data.map((recipe) => RecipeSchema.parse(recipe));
}

export async function getRecipe(id: number): Promise<Recipe> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching recipe:", error);
    throw new Error(`Failed to fetch recipe: ${error.message}`);
  }

  return RecipeSchema.parse(data);
}

export async function getRecipeWithIngredients(
  recipeId: number
): Promise<RecipeWithIngredients> {
  const supabase = createServerSupabaseClient();

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .single();

  if (recipeError) {
    console.error("Error fetching recipe:", recipeError);
    throw new Error(`Failed to fetch recipe: ${recipeError.message}`);
  }

  const { data: ingredients, error: ingredientsError } = await supabase
    .from("recipe_ingredients")
    .select("*, ingredients(*)")
    .eq("recipe_id", recipeId);

  if (ingredientsError) {
    console.error("Error fetching recipe ingredients:", ingredientsError);
    throw new Error(
      `Failed to fetch recipe ingredients: ${ingredientsError.message}`
    );
  }

  const parsedRecipe = RecipeSchema.parse(recipe);

  return {
    ...parsedRecipe,
    ingredients: ingredients.map((ri) => ({
      ingredient: IngredientSchema.parse(ri.ingredients),
      amount_per_portion: ri.amount_per_portion,
    })),
  };
}

export async function getRecipesWithIngredients(
  ids?: number[]
): Promise<RecipeWithIngredients[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase.from("recipes").select("*");

  if (ids && ids.length > 0) {
    query = query.in("id", ids);
  }

  const { data: recipes, error: recipeError } = await query;

  if (recipeError) {
    console.error("Error fetching recipes:", recipeError);
    throw new Error(`Failed to fetch recipes: ${recipeError.message}`);
  }

  // Fetch all recipe ingredients
  const { data: recipeIngredients, error: ingredientsError } = await supabase
    .from("recipe_ingredients")
    .select("*, ingredients(*)");

  if (ingredientsError) {
    console.error("Error fetching recipe ingredients:", ingredientsError);
    throw new Error(
      `Failed to fetch recipe ingredients: ${ingredientsError.message}`
    );
  }

  return recipes.map((recipe) => {
    const ingredients = recipeIngredients
      .filter((ri) => ri.recipe_id === recipe.id)
      .map((ri) => ({
        ingredient: IngredientSchema.parse(ri.ingredients),
        amount_per_portion: ri.amount_per_portion,
      }));

    return {
      ...RecipeSchema.parse(recipe),
      ingredients,
    };
  });
}

export async function createRecipe(
  input: Omit<Recipe, "id" | "created_at">
): Promise<Recipe> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("recipes")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating recipe:", error);
    throw new Error(`Failed to create recipe: ${error.message}`);
  }

  return RecipeSchema.parse(data);
}

export async function addIngredientToRecipe(
  recipeId: number,
  ingredientId: number,
  amountPerPortion: number
): Promise<RecipeIngredient> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("recipe_ingredients")
    .insert([
      {
        recipe_id: recipeId,
        ingredient_id: ingredientId,
        amount_per_portion: amountPerPortion,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding ingredient to recipe:", error);
    throw new Error(`Failed to add ingredient: ${error.message}`);
  }

  return RecipeIngredientSchema.parse(data);
}
