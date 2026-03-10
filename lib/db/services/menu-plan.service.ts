/**
 * Menu Plan Service
 * Data access layer for Menu Plan entities
 */

import { createServerSupabaseClient } from "../client";
import type { MenuItem, MenuItemWithRecipe } from "../types";
import { MenuItemSchema, RecipeSchema } from "../schemas";

export async function getMenuPlanByDateRange(
  startDate: string,
  endDate: string
): Promise<MenuItem[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu_plan")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("diet_type", { ascending: true });

  if (error) {
    console.error("Error fetching menu plan:", error);
    throw new Error(`Failed to fetch menu plan: ${error.message}`);
  }

  return data.map((item) => MenuItemSchema.parse(item));
}

export async function getMenuPlanByDateRangeWithRecipes(
  startDate: string,
  endDate: string
): Promise<MenuItemWithRecipe[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu_plan")
    .select("*, recipes(*)")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true })
    .order("diet_type", { ascending: true });

  if (error) {
    console.error("Error fetching menu plan:", error);
    throw new Error(`Failed to fetch menu plan: ${error.message}`);
  }

  return data.map((item) => ({
    ...MenuItemSchema.parse(item),
    recipe: RecipeSchema.parse(item.recipes),
  }));
}

export async function getMenuItemByDateAndDietType(
  date: string,
  dietType: string
): Promise<MenuItem | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu_plan")
    .select("*")
    .eq("date", date)
    .eq("diet_type", dietType)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching menu item:", error);
    throw new Error(`Failed to fetch menu item: ${error.message}`);
  }

  return data ? MenuItemSchema.parse(data) : null;
}

export async function upsertMenuItem(input: MenuItem): Promise<MenuItem> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu_plan")
    .upsert([input], { onConflict: "date,diet_type" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting menu item:", error);
    throw new Error(`Failed to save menu item: ${error.message}`);
  }

  return MenuItemSchema.parse(data);
}

export async function deleteMenuItem(
  date: string,
  dietType: string
): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("menu_plan")
    .delete()
    .eq("date", date)
    .eq("diet_type", dietType);

  if (error) {
    console.error("Error deleting menu item:", error);
    throw new Error(`Failed to delete menu item: ${error.message}`);
  }
}
