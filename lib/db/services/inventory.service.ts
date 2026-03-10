/**
 * Inventory Service
 * Data access layer for Inventory entities
 */

import { createServerSupabaseClient } from "../client";
import type { InventoryItem } from "../types";
import { InventoryItemSchema } from "../schemas";

export async function getInventory(): Promise<InventoryItem[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("ingredient_id");

  if (error) {
    console.error("Error fetching inventory:", error);
    throw new Error(`Failed to fetch inventory: ${error.message}`);
  }

  return data.map((item) => InventoryItemSchema.parse(item));
}

export async function getInventoryItem(
  ingredientId: number
): Promise<InventoryItem | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("ingredient_id", ingredientId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching inventory item:", error);
    throw new Error(`Failed to fetch inventory item: ${error.message}`);
  }

  return data ? InventoryItemSchema.parse(data) : null;
}

export async function getInventoriesByIngredientIds(
  ingredientIds: number[]
): Promise<Map<number, InventoryItem>> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .in("ingredient_id", ingredientIds);

  if (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error(`Failed to fetch inventory items: ${error.message}`);
  }

  const map = new Map<number, InventoryItem>();
  for (const item of data) {
    map.set(item.ingredient_id, InventoryItemSchema.parse(item));
  }
  return map;
}

export async function upsertInventoryItem(
  input: InventoryItem
): Promise<InventoryItem> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("inventory")
    .upsert(
      [
        {
          ingredient_id: input.ingredient_id,
          quantity: input.quantity,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "ingredient_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting inventory item:", error);
    throw new Error(`Failed to save inventory item: ${error.message}`);
  }

  return InventoryItemSchema.parse(data);
}

export async function deleteInventoryItem(ingredientId: number): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("ingredient_id", ingredientId);

  if (error) {
    console.error("Error deleting inventory item:", error);
    throw new Error(`Failed to delete inventory item: ${error.message}`);
  }
}
