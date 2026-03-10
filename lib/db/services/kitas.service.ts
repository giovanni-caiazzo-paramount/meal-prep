/**
 * Kitas Service
 * Data access layer for Kita entities
 */

import { createServerSupabaseClient } from "../client";
import type { Kita } from "../types";
import { KitaSchema } from "../schemas";

export async function getKitas(): Promise<Kita[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("kitas")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching kitas:", error);
    throw new Error(`Failed to fetch kitas: ${error.message}`);
  }

  return data.map((kita) => KitaSchema.parse(kita));
}

export async function getKita(id: number): Promise<Kita> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("kitas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching kita:", error);
    throw new Error(`Failed to fetch kita: ${error.message}`);
  }

  return KitaSchema.parse(data);
}

export async function createKita(input: Omit<Kita, "id">): Promise<Kita> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("kitas")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating kita:", error);
    throw new Error(`Failed to create kita: ${error.message}`);
  }

  return KitaSchema.parse(data);
}

export async function updateKita(
  id: number,
  input: Partial<Omit<Kita, "id">>
): Promise<Kita> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("kitas")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating kita:", error);
    throw new Error(`Failed to update kita: ${error.message}`);
  }

  return KitaSchema.parse(data);
}
