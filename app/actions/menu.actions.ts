/**
 * Server Actions - Menu Plan Management
 */

"use server";

import { MenuItemFormSchema } from "@/lib/db/schemas";
import * as menuService from "@/lib/db/services/menu-plan.service";
import type { MenuItem } from "@/lib/db/types";

export async function updateMenuItem(formData: unknown) {
  try {
    const parsed = MenuItemFormSchema.parse(formData);

    await menuService.upsertMenuItem({
      date: parsed.date,
      diet_type: parsed.diet_type,
      recipe_id: parsed.recipe_id,
    } as MenuItem);

    return {
      success: true,
      message: "Menu item updated successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
    };
  }
}

export async function getMenuPlanForWeek(weekStartDate: string) {
  try {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    const menu = await menuService.getMenuPlanByDateRangeWithRecipes(
      weekStartDate,
      weekEndDate.toISOString().split("T")[0]
    );

    return {
      success: true,
      data: menu,
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

export async function deleteMenuItem(date: string, dietType: string) {
  try {
    await menuService.deleteMenuItem(date, dietType);

    return {
      success: true,
      message: "Menu item deleted successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
    };
  }
}
