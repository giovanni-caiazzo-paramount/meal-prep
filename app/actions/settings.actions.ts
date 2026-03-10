"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/db/client";

const KitaInputSchema = z.object({
  name: z.string().min(1),
  city: z.string().optional(),
});

const RecipeInputSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["Hauptspeise", "Nachtisch", "Rohkost"]),
  portion_adjustment_category: z.enum(["Anders", "Gemüse", "Suppe"]),
});

const IngredientInputSchema = z.object({
  name: z.string().min(1),
  unit: z.enum(["g", "ml", "Stück"]),
});

const AgeMultiplierInputSchema = z.object({
  age_group: z.string().min(1),
  ingredient_category: z.string().min(1),
  multiplier: z.number().positive(),
});

const PortionCountInputSchema = z.object({
  kita_id: z.number().int().positive(),
  age_group: z.enum(["Krippe", "Kita", "Hort"]),
  diet_type: z.enum(["vegetarisch", "fleisch", "pescetarisch"]),
  children_count: z.number().int().nonnegative(),
});

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

export async function createKitaAction(input: { name: string; city?: string }) {
  try {
    const payload = KitaInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("kitas").insert([
      {
        name: payload.name,
        city: payload.city?.trim() || null,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/kitas");
    revalidatePath("/settings/portion-counts");

    return { success: true, message: "Kita created" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateKitaAction(
  id: number,
  input: { name: string; city?: string }
) {
  try {
    const payload = KitaInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("kitas")
      .update({
        name: payload.name,
        city: payload.city?.trim() || null,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/kitas");
    revalidatePath("/settings/portion-counts");

    return { success: true, message: "Kita updated" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteKitaAction(id: number) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("kitas").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/kitas");
    revalidatePath("/settings/portion-counts");

    return { success: true, message: "Kita deleted" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function createRecipeAction(input: {
  name: string;
  category: "Hauptspeise" | "Nachtisch" | "Rohkost";
  portion_adjustment_category: "Anders" | "Gemüse" | "Suppe";
}) {
  try {
    const payload = RecipeInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("recipes").insert([payload]);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/recipes");
    revalidatePath("/menu");

    return { success: true, message: "Recipe created" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateRecipeAction(
  id: number,
  input: {
    name: string;
    category: "Hauptspeise" | "Nachtisch" | "Rohkost";
    portion_adjustment_category: "Anders" | "Gemüse" | "Suppe";
  }
) {
  try {
    const payload = RecipeInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("recipes")
      .update(payload)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/recipes");
    revalidatePath("/menu");

    return { success: true, message: "Recipe updated" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteRecipeAction(id: number) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/recipes");
    revalidatePath("/menu");

    return { success: true, message: "Recipe deleted" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function createIngredientAction(input: {
  name: string;
  unit: "g" | "ml" | "Stück";
}) {
  try {
    const payload = IngredientInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("ingredients").insert([payload]);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/ingredients");
    revalidatePath("/inventory");

    return { success: true, message: "Ingredient created" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateIngredientAction(
  id: number,
  input: {
    name: string;
    unit: "g" | "ml" | "Stück";
  }
) {
  try {
    const payload = IngredientInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("ingredients")
      .update(payload)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/ingredients");
    revalidatePath("/inventory");

    return { success: true, message: "Ingredient updated" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteIngredientAction(id: number) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("ingredients").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/ingredients");
    revalidatePath("/inventory");

    return { success: true, message: "Ingredient deleted" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function upsertAgeMultiplierAction(input: {
  age_group: string;
  ingredient_category: string;
  multiplier: number;
}) {
  try {
    const payload = AgeMultiplierInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("age_multipliers")
      .upsert([payload], { onConflict: "age_group,ingredient_category" });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/age-multipliers");

    return { success: true, message: "Age multiplier saved" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteAgeMultiplierAction(
  ageGroup: string,
  ingredientCategory: string
) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("age_multipliers")
      .delete()
      .eq("age_group", ageGroup)
      .eq("ingredient_category", ingredientCategory);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/age-multipliers");

    return { success: true, message: "Age multiplier deleted" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function upsertPortionCountAction(input: {
  kita_id: number;
  age_group: "Krippe" | "Kita" | "Hort";
  diet_type: "vegetarisch" | "fleisch" | "pescetarisch";
  children_count: number;
}) {
  try {
    const payload = PortionCountInputSchema.parse(input);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("portion_counts")
      .upsert([payload], { onConflict: "kita_id,age_group,diet_type" });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/portion-counts");

    return { success: true, message: "Portion count saved" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deletePortionCountAction(
  kitaId: number,
  ageGroup: "Krippe" | "Kita" | "Hort",
  dietType: "vegetarisch" | "fleisch" | "pescetarisch"
) {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("portion_counts")
      .delete()
      .eq("kita_id", kitaId)
      .eq("age_group", ageGroup)
      .eq("diet_type", dietType);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/settings/portion-counts");

    return { success: true, message: "Portion count deleted" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
