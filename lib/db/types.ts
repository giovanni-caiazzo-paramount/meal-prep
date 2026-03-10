/**
 * Database Type Definitions
 * Represents the raw schema from Supabase
 */

// Enums
export type AgeGroup = "Krippe" | "Kita" | "Hort";
export type DietType = "vegetarisch" | "fleisch" | "pescetarisch";
export type RecipeCategory = "Hauptspeise" | "Nachtisch" | "Rohkost";
export type PortionAdjustmentCategory = "Anders" | "Gemüse" | "Suppe";
export type IngredientUnit = "g" | "ml";

// Database Models
export interface Kita {
  id: number;
  name: string;
  city?: string;
}

export interface Recipe {
  id: number;
  name: string;
  category: RecipeCategory;
  portion_adjustment_category: PortionAdjustmentCategory;
  created_at?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: IngredientUnit;
  created_at?: string;
}

export interface RecipeIngredient {
  recipe_id: number;
  ingredient_id: number;
  amount_per_portion: number; // decimal
  created_at?: string;
}

export interface MenuItem {
  date: string; // ISO date: YYYY-MM-DD
  diet_type: DietType;
  recipe_id: number;
  created_at?: string;
}

export interface PortionCount {
  kita_id: number;
  age_group: AgeGroup;
  diet_type: DietType;
  children_count: number;
}

export interface AgeMultiplier {
  age_group: AgeGroup;
  ingredient_category: PortionAdjustmentCategory;
  multiplier: number; // decimal
}

export interface InventoryItem {
  ingredient_id: number;
  quantity: number; // decimal
  updated_at: string; // timestamp
}

// Enriched/Computed Types
export interface RecipeWithIngredients extends Recipe {
  ingredients: Array<{
    ingredient: Ingredient;
    amount_per_portion: number;
  }>;
}

export interface MenuItemWithRecipe extends MenuItem {
  recipe: Recipe;
}

export interface ShoppingListItem {
  ingredient_id: number;
  ingredient_name: string;
  unit: IngredientUnit;
  required_amount: number;
  inventory_amount: number;
  shopping_amount: number;
}

export interface KitchenPrepSheetRow {
  kita_id: number;
  kita_name: string;
  ingredient_id: number;
  ingredient_name: string;
  unit: IngredientUnit;
  quantity: number;
}

export interface MenuOptimizationSuggestion {
  date: string;
  diet_type: DietType;
  original_recipe: Recipe;
  suggested_recipe: Recipe;
  inventory_usage: Array<{
    ingredient_name: string;
    amount_used: number;
    unit: IngredientUnit;
  }>;
  shopping_list_delta: {
    removed: ShoppingListItem[];
    added: ShoppingListItem[];
  };
}
