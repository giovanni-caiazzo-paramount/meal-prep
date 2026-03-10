/**
 * Server Actions - Data Retrieval
 */

"use server";

import * as kitasService from "@/lib/db/services/kitas.service";
import * as recipesService from "@/lib/db/services/recipes.service";
import * as ingredientsService from "@/lib/db/services/ingredients.service";
import * as portionService from "@/lib/db/services/portion-counts.service";
import * as ageMultipliersService from "@/lib/db/services/age-multipliers.service";

export async function getKitas() {
  try {
    const kitas = await kitasService.getKitas();
    return {
      success: true,
      data: kitas,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: [],
    };
  }
}

export async function getRecipes() {
  try {
    const recipes = await recipesService.getRecipes();
    return {
      success: true,
      data: recipes,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: [],
    };
  }
}

export async function getRecipeWithIngredients(recipeId: number) {
  try {
    const recipe = await recipesService.getRecipeWithIngredients(recipeId);
    return {
      success: true,
      data: recipe,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: null,
    };
  }
}

export async function getIngredients() {
  try {
    const ingredients = await ingredientsService.getIngredients();
    return {
      success: true,
      data: ingredients,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: [],
    };
  }
}

export async function getPortionCounts() {
  try {
    const portionCounts = await portionService.getPortionCounts();
    return {
      success: true,
      data: portionCounts,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: [],
    };
  }
}

export async function getAgeMultipliers() {
  try {
    const multipliers = await ageMultipliersService.getAgeMultipliers();
    return {
      success: true,
      data: multipliers,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
      data: [],
    };
  }
}
