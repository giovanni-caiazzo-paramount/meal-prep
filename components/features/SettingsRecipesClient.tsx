"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import type { Recipe } from "@/lib/db/types";
import {
  createRecipeAction,
  deleteRecipeAction,
  updateRecipeAction,
} from "@/app/actions/settings.actions";

interface SettingsRecipesClientProps {
  initialRecipes: Recipe[];
}

type RecipeCategory = "Hauptspeise" | "Nachtisch" | "Rohkost";
type AdjustmentCategory = "Anders" | "Gemüse" | "Suppe";

interface EditableRecipe {
  name: string;
  category: RecipeCategory;
  portion_adjustment_category: AdjustmentCategory;
}

const RECIPE_CATEGORIES: RecipeCategory[] = [
  "Hauptspeise",
  "Nachtisch",
  "Rohkost",
];
const ADJUSTMENT_CATEGORIES: AdjustmentCategory[] = [
  "Anders",
  "Gemüse",
  "Suppe",
];

export default function SettingsRecipesClient({
  initialRecipes,
}: SettingsRecipesClientProps) {
  const router = useRouter();
  const [recipes, setRecipes] = useState(initialRecipes);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [newRecipe, setNewRecipe] = useState<EditableRecipe>({
    name: "",
    category: "Hauptspeise",
    portion_adjustment_category: "Anders",
  });
  const [draft, setDraft] = useState<EditableRecipe>(newRecipe);

  const refresh = () => {
    router.refresh();
  };

  const handleCreate = async () => {
    if (!newRecipe.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsSaving(true);
    const result = await createRecipeAction({
      name: newRecipe.name.trim(),
      category: newRecipe.category,
      portion_adjustment_category: newRecipe.portion_adjustment_category,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setNewRecipe({
        name: "",
        category: "Hauptspeise",
        portion_adjustment_category: "Anders",
      });
      refresh();
    }
  };

  const startEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setDraft({
      name: recipe.name,
      category: (recipe.category as RecipeCategory) ?? "Hauptspeise",
      portion_adjustment_category:
        (recipe.portion_adjustment_category as AdjustmentCategory) ?? "Anders",
    });
  };

  const handleUpdate = async (id: number) => {
    if (!draft.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsSaving(true);
    const result = await updateRecipeAction(id, {
      name: draft.name.trim(),
      category: draft.category,
      portion_adjustment_category: draft.portion_adjustment_category,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setEditingId(null);
      setRecipes((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                name: draft.name.trim(),
                category: draft.category,
                portion_adjustment_category: draft.portion_adjustment_category,
              }
            : item
        )
      );
      refresh();
    }
  };

  const handleDelete = async (id: number) => {
    setIsSaving(true);
    const result = await deleteRecipeAction(id);
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setRecipes((current) => current.filter((item) => item.id !== id));
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

      <Card title="Add Recipe">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input
            label="Name"
            value={newRecipe.name}
            onChange={(event) =>
              setNewRecipe((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={newRecipe.category}
              onChange={(event) =>
                setNewRecipe((current) => ({
                  ...current,
                  category: event.target.value as RecipeCategory,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {RECIPE_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Adjustment
            </label>
            <select
              value={newRecipe.portion_adjustment_category}
              onChange={(event) =>
                setNewRecipe((current) => ({
                  ...current,
                  portion_adjustment_category: event.target
                    .value as AdjustmentCategory,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {ADJUSTMENT_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
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
                Category
              </th>
              <th className="p-2 text-left font-semibold text-gray-700">
                Adjustment
              </th>
              <th className="p-2 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => {
              const isEditing = editingId === recipe.id;

              return (
                <tr key={recipe.id} className="border-b border-gray-100">
                  <td className="p-2 text-gray-500">{recipe.id}</td>
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
                        {recipe.name}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <select
                        value={draft.category}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            category: event.target.value as RecipeCategory,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                      >
                        {RECIPE_CATEGORIES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-600">{recipe.category}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <select
                        value={draft.portion_adjustment_category}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            portion_adjustment_category: event.target
                              .value as AdjustmentCategory,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                      >
                        {ADJUSTMENT_CATEGORIES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-600">
                        {recipe.portion_adjustment_category}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(recipe.id)}
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
                            onClick={() => startEdit(recipe)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(recipe.id)}
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
            {recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No recipes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
