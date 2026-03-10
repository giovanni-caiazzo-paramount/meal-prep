/**
 * Inventory Manager Component
 * Allows viewing and updating inventory items
 */

"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import type { InventoryItem, Ingredient } from "@/lib/db/types";
import {
  updateInventory,
  deleteInventoryItem,
} from "@/app/actions/inventory.actions";

interface InventoryManagerProps {
  inventory: InventoryItem[];
  ingredients: Ingredient[];
}

export function InventoryManager({
  inventory,
  ingredients,
}: InventoryManagerProps) {
  const [items, setItems] = useState<InventoryItem[]>(inventory);
  const [editing, setEditing] = useState<{
    ingredientId: number;
    quantity: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const getIngredientName = (ingredientId: number) => {
    return ingredients.find((i) => i.id === ingredientId)?.name || "Unknown";
  };

  const getIngredientUnit = (ingredientId: number) => {
    return ingredients.find((i) => i.id === ingredientId)?.unit || "";
  };

  const handleEdit = (item: InventoryItem) => {
    setEditing({
      ingredientId: item.ingredient_id,
      quantity: item.quantity.toString(),
    });
  };

  const handleSave = async () => {
    if (!editing) return;

    setSaving(true);
    try {
      const result = await updateInventory({
        ingredient_id: editing.ingredientId,
        quantity: parseFloat(editing.quantity) || 0,
      });

      if (result.success) {
        const updated = items.map((item) =>
          item.ingredient_id === editing.ingredientId
            ? {
                ...item,
                quantity: parseFloat(editing.quantity) || 0,
              }
            : item
        );
        setItems(updated);
        setEditing(null);
        setMessage({ type: "success", text: "Inventory updated" });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ingredientId: number) => {
    if (!confirm("Delete this inventory item?")) return;

    setSaving(true);
    try {
      const result = await deleteInventoryItem(ingredientId);

      if (result.success) {
        setItems(items.filter((item) => item.ingredient_id !== ingredientId));
        setMessage({ type: "success", text: "Inventory item deleted" });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Inventory Management">
      <div className="space-y-4">
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No inventory items recorded
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 font-semibold text-gray-700">
                    Ingredient
                  </th>
                  <th className="text-right p-2 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-left p-2 font-semibold text-gray-700">
                    Updated
                  </th>
                  <th className="text-right p-2 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.ingredient_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2 text-gray-900">
                      {getIngredientName(item.ingredient_id)}
                    </td>
                    <td className="p-2 text-right">
                      {editing?.ingredientId === item.ingredient_id ? (
                        <input
                          type="number"
                          value={editing.quantity}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              quantity: e.target.value,
                            })
                          }
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                          disabled={saving}
                        />
                      ) : (
                        <span>
                          {item.quantity.toFixed(1)}{" "}
                          {getIngredientUnit(item.ingredient_id)}
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-gray-600 text-xs">
                      {new Date(item.updated_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="p-2 text-right space-x-2">
                      {editing?.ingredientId === item.ingredient_id ? (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleSave}
                            disabled={saving}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditing(null)}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(item)}
                            disabled={saving}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(item.ingredient_id)}
                            disabled={saving}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
