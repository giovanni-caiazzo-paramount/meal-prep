/**
 * Server Actions - Inventory Management
 */

"use server";

import { InventoryUpdateSchema } from "@/lib/db/schemas";
import * as inventoryService from "@/lib/db/services/inventory.service";
import type { InventoryItem } from "@/lib/db/types";

export async function updateInventory(formData: unknown) {
  try {
    const parsed = InventoryUpdateSchema.parse(formData);

    await inventoryService.upsertInventoryItem({
      ingredient_id: parsed.ingredient_id,
      quantity: parsed.quantity,
      updated_at: new Date().toISOString(),
    } as InventoryItem);

    return {
      success: true,
      message: "Inventory updated successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
    };
  }
}

export async function getInventory() {
  try {
    const inventory = await inventoryService.getInventory();

    return {
      success: true,
      data: inventory,
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

export async function deleteInventoryItem(ingredientId: number) {
  try {
    await inventoryService.deleteInventoryItem(ingredientId);

    return {
      success: true,
      message: "Inventory item deleted successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message,
    };
  }
}
