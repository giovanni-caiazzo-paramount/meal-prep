/**
 * Ingredients Service
 * Data access layer for Ingredient entities
 */

import { createServerSupabaseClient } from "../client";
import type { Ingredient } from "../types";
import { IngredientSchema } from "../schemas";

export async function getIngredients(): Promise<Ingredient[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching ingredients:", error);
    throw new Error(`Failed to fetch ingredients: ${error.message}`);
  }

  return data.map((ingredient) => IngredientSchema.parse(ingredient));
}

export async function getIngredient(id: number): Promise<Ingredient> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching ingredient:", error);
    throw new Error(`Failed to fetch ingredient: ${error.message}`);
  }

  return IngredientSchema.parse(data);
}

export async function createIngredient(
  input: Omit<Ingredient, "id" | "created_at">
): Promise<Ingredient> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ingredients")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating ingredient:", error);
    throw new Error(`Failed to create ingredient: ${error.message}`);
  }

  return IngredientSchema.parse(data);
}

export async function updateIngredient(
  id: number,
  input: Partial<Omit<Ingredient, "id">>
): Promise<Ingredient> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ingredients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating ingredient:", error);
    throw new Error(`Failed to update ingredient: ${error.message}`);
  }

  return IngredientSchema.parse(data);
}
