/**
 * Age Multipliers Service
 * Data access layer for Age Multiplier entities
 */

import { createServerSupabaseClient } from "../client";
import type {
  AgeMultiplier,
  AgeGroup,
  PortionAdjustmentCategory,
} from "../types";
import { AgeMultiplierSchema } from "../schemas";

export async function getAgeMultipliers(): Promise<AgeMultiplier[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("age_multipliers")
    .select("*")
    .order("age_group", { ascending: true })
    .order("ingredient_category", { ascending: true });

  if (error) {
    console.error("Error fetching age multipliers:", error);
    throw new Error(`Failed to fetch age multipliers: ${error.message}`);
  }

  return data.map((item) => AgeMultiplierSchema.parse(item));
}

export async function getAgeMultiplier(
  ageGroup: AgeGroup,
  ingredientCategory: PortionAdjustmentCategory
): Promise<AgeMultiplier> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("age_multipliers")
    .select("*")
    .eq("age_group", ageGroup)
    .eq("ingredient_category", ingredientCategory)
    .single();

  if (error) {
    console.error("Error fetching age multiplier:", error);
    throw new Error(
      `Failed to fetch age multiplier for ${ageGroup} / ${ingredientCategory}: ${error.message}`
    );
  }

  return AgeMultiplierSchema.parse(data);
}

export async function upsertAgeMultiplier(
  input: AgeMultiplier
): Promise<AgeMultiplier> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("age_multipliers")
    .upsert([input], { onConflict: "age_group,ingredient_category" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting age multiplier:", error);
    throw new Error(`Failed to save age multiplier: ${error.message}`);
  }

  return AgeMultiplierSchema.parse(data);
}
