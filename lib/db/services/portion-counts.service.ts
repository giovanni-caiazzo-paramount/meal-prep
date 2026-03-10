/**
 * Portion Counts Service
 * Data access layer for Portion Count entities
 */

import { createServerSupabaseClient } from "../client";
import type { PortionCount } from "../types";
import { PortionCountSchema } from "../schemas";

export async function getPortionCounts(): Promise<PortionCount[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("portion_counts")
    .select("*")
    .order("kita_id", { ascending: true })
    .order("age_group", { ascending: true });

  if (error) {
    console.error("Error fetching portion counts:", error);
    throw new Error(`Failed to fetch portion counts: ${error.message}`);
  }

  return data.map((item) => PortionCountSchema.parse(item));
}

export async function getPortionCountsByKita(
  kitaId: number
): Promise<PortionCount[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("portion_counts")
    .select("*")
    .eq("kita_id", kitaId)
    .order("age_group", { ascending: true });

  if (error) {
    console.error("Error fetching portion counts:", error);
    throw new Error(`Failed to fetch portion counts: ${error.message}`);
  }

  return data.map((item) => PortionCountSchema.parse(item));
}

export async function getPortionCountByKey(
  kitaId: number,
  ageGroup: string,
  dietType: string
): Promise<PortionCount | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("portion_counts")
    .select("*")
    .eq("kita_id", kitaId)
    .eq("age_group", ageGroup)
    .eq("diet_type", dietType)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching portion count:", error);
    throw new Error(`Failed to fetch portion count: ${error.message}`);
  }

  return data ? PortionCountSchema.parse(data) : null;
}

export async function upsertPortionCount(
  input: PortionCount
): Promise<PortionCount> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("portion_counts")
    .upsert([input], { onConflict: "kita_id,age_group,diet_type" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting portion count:", error);
    throw new Error(`Failed to save portion count: ${error.message}`);
  }

  return PortionCountSchema.parse(data);
}
