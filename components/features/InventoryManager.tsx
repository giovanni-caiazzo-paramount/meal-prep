/**
 * Inventory Manager Component
 * Allows viewing and updating inventory items
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(inventory);
  const [editing, setEditing] = useState<{
    ingredientId: number;
    quantity: string;
  } | null>(null);
  const [newIngredientId, setNewIngredientId] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<string>("0");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const availableIngredients = useMemo(() => {
    const existingIds = new Set(items.map((item) => item.ingredient_id));
    return ingredients.filter((ingredient) => !existingIds.has(ingredient.id));
  }, [ingredients, items]);

  const selectedIngredientId =
    newIngredientId ||
    (availableIngredients[0] ? String(availableIngredients[0].id) : "");

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
                quantity:
                  result.data?.quantity ?? (parseFloat(editing.quantity) || 0),
                updated_at: result.data?.updated_at ?? item.updated_at,
              }
            : item
        );
        setItems(updated);
        setEditing(null);
        setMessage({ type: "success", text: "Inventory updated" });
        router.refresh();
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

  const handleCreate = async () => {
    const ingredientId = parseInt(selectedIngredientId, 10);
    const quantity = parseFloat(newQuantity);

    if (!ingredientId) {
      setMessage({ type: "error", text: "Please select an ingredient" });
      return;
    }

    if (Number.isNaN(quantity) || quantity < 0) {
      setMessage({ type: "error", text: "Quantity must be 0 or higher" });
      return;
    }

    setSaving(true);
    try {
      const result = await updateInventory({
        ingredient_id: ingredientId,
        quantity,
      });

      if (!result.success || !result.data) {
        setMessage({
          type: "error",
          text: result.message || "Failed to create inventory item",
        });
        return;
      }

      setItems((current) => {
        const exists = current.some(
          (item) => item.ingredient_id === result.data!.ingredient_id
        );

        if (exists) {
          return current.map((item) =>
            item.ingredient_id === result.data!.ingredient_id
              ? result.data!
              : item
          );
        }

        return [...current, result.data!];
      });
      setNewIngredientId("");
      setNewQuantity("0");
      setMessage({ type: "success", text: "Inventory item created" });
      router.refresh();
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
        router.refresh();
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

        <Card title="Add Inventory Item">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Ingredient
              </label>
              <select
                value={selectedIngredientId}
                onChange={(event) => setNewIngredientId(event.target.value)}
                disabled={saving || availableIngredients.length === 0}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              >
                {availableIngredients.length === 0 ? (
                  <option value="">
                    All ingredients already have inventory rows
                  </option>
                ) : (
                  availableIngredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name} ({ingredient.unit})
                    </option>
                  ))
                )}
              </select>
            </div>

            <Input
              label="Quantity"
              type="number"
              min="0"
              step="0.1"
              value={newQuantity}
              onChange={(event) => setNewQuantity(event.target.value)}
              disabled={saving || availableIngredients.length === 0}
            />

            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={saving || availableIngredients.length === 0}
              >
                Add item
              </Button>
            </div>
          </div>
        </Card>

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
