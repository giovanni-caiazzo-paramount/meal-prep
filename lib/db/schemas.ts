/**
 * Zod Validation Schemas
 * Used for form input validation and API response parsing
 */

import { z } from "zod";

// Enum schemas for type safety
export const AgeGroupSchema = z.enum(["Krippe", "Kita", "Hort"]);
export const DietTypeSchema = z.enum([
  "vegetarisch",
  "fleisch",
  "pescetarisch",
]);
export const RecipeCategorySchema = z.string().nullable();
export const PortionAdjustmentCategorySchema = z.string().nullable();
export const IngredientUnitSchema = z.enum(["g", "ml", "Stück"]);

// Database model schemas
export const KitaSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  city: z.string().max(255).optional().nullable(),
});

export const RecipeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  category: RecipeCategorySchema,
  portion_adjustment_category: PortionAdjustmentCategorySchema,
  created_at: z.string().datetime().optional(),
});

export const IngredientSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  unit: IngredientUnitSchema,
  created_at: z.string().datetime().optional(),
});

export const RecipeIngredientSchema = z.object({
  recipe_id: z.number().int().positive(),
  ingredient_id: z.number().int().positive(),
  amount_per_portion: z.number().positive(),
  created_at: z.string().datetime().optional(),
});

export const MenuItemSchema = z.object({
  date: z.string().date(),
  diet_type: DietTypeSchema,
  recipe_id: z.number().int().positive(),
  created_at: z.string().datetime().optional(),
});

export const PortionCountSchema = z.object({
  kita_id: z.number().int().positive(),
  age_group: AgeGroupSchema,
  diet_type: DietTypeSchema,
  children_count: z.number().int().positive(),
});

export const AgeMultiplierSchema = z.object({
  age_group: AgeGroupSchema,
  ingredient_category: PortionAdjustmentCategorySchema,
  multiplier: z.number().positive(),
});

export const InventoryItemSchema = z.object({
  ingredient_id: z.number().int().positive(),
  quantity: z.number().nonnegative(),
  updated_at: z.string().datetime(),
});

// Form input schemas
export const MenuItemFormSchema = z.object({
  date: z.string().date("Invalid date format"),
  diet_type: DietTypeSchema,
  recipe_id: z.number().int().positive("Recipe is required"),
});

export const InventoryUpdateSchema = z.object({
  ingredient_id: z.number().int().positive(),
  quantity: z.number().nonnegative("Quantity cannot be negative"),
});

export const MenuOptimizationApprovalSchema = z.object({
  date: z.string().date(),
  diet_type: DietTypeSchema,
  recipe_id: z.number().int().positive(),
  approved: z.boolean(),
});

// Response schemas
export const ShoppingListItemSchema = z.object({
  ingredient_id: z.number().int().positive(),
  ingredient_name: z.string(),
  unit: IngredientUnitSchema,
  required_amount: z.number().nonnegative(),
  inventory_amount: z.number().nonnegative(),
  shopping_amount: z.number().nonnegative(),
});

export const ShoppingListResponseSchema = z.array(ShoppingListItemSchema);

export const KitchenPrepSheetRowSchema = z.object({
  kita_id: z.number().int().positive(),
  kita_name: z.string(),
  ingredient_id: z.number().int().positive(),
  ingredient_name: z.string(),
  unit: IngredientUnitSchema,
  quantity: z.number().positive(),
});
