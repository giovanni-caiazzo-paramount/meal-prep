"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import type { Ingredient, IngredientUnit } from "@/lib/db/types";
import {
  createIngredientAction,
  deleteIngredientAction,
  updateIngredientAction,
} from "@/app/actions/settings.actions";

interface SettingsIngredientsClientProps {
  initialIngredients: Ingredient[];
}

interface EditableIngredient {
  name: string;
  unit: IngredientUnit;
}

const UNITS: IngredientUnit[] = ["g", "ml", "Stück"];

export default function SettingsIngredientsClient({
  initialIngredients,
}: SettingsIngredientsClientProps) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [newIngredient, setNewIngredient] = useState<EditableIngredient>({
    name: "",
    unit: "g",
  });
  const [draft, setDraft] = useState<EditableIngredient>(newIngredient);

  const refresh = () => {
    router.refresh();
  };

  const handleCreate = async () => {
    if (!newIngredient.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsSaving(true);
    const result = await createIngredientAction({
      name: newIngredient.name.trim(),
      unit: newIngredient.unit,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setNewIngredient({ name: "", unit: "g" });
      refresh();
    }
  };

  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setDraft({
      name: ingredient.name,
      unit: ingredient.unit,
    });
  };

  const handleUpdate = async (id: number) => {
    if (!draft.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsSaving(true);
    const result = await updateIngredientAction(id, {
      name: draft.name.trim(),
      unit: draft.unit,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setEditingId(null);
      setIngredients((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                name: draft.name.trim(),
                unit: draft.unit,
              }
            : item
        )
      );
      refresh();
    }
  };

  const handleDelete = async (id: number) => {
    setIsSaving(true);
    const result = await deleteIngredientAction(id);
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setIngredients((current) => current.filter((item) => item.id !== id));
      refresh();
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <Card className="bg-muted border-border py-3">
          <p className="text-sm text-foreground">{message}</p>
        </Card>
      )}

      <Card title="Add Ingredient">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            label="Name"
            value={newIngredient.name}
            onChange={(event) =>
              setNewIngredient((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <select
              value={newIngredient.unit}
              onChange={(event) =>
                setNewIngredient((current) => ({
                  ...current,
                  unit: event.target.value as IngredientUnit,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleCreate}
              loading={isSaving}
              className="w-full"
            >
              Create
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-left font-semibold text-gray-700">ID</th>
              <th className="p-2 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="p-2 text-left font-semibold text-gray-700">
                Unit
              </th>
              <th className="p-2 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => {
              const isEditing = editingId === ingredient.id;

              return (
                <tr key={ingredient.id} className="border-b border-gray-100">
                  <td className="p-2 text-gray-500">{ingredient.id}</td>
                  <td className="p-2">
                    {isEditing ? (
                      <Input
                        value={draft.name}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {ingredient.name}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <select
                        value={draft.unit}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            unit: event.target.value as IngredientUnit,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                      >
                        {UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-600">{ingredient.unit}</span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(ingredient.id)}
                            loading={isSaving}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => startEdit(ingredient)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(ingredient.id)}
                            loading={isSaving}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {ingredients.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No ingredients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
