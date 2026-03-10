/**
 * Menu Editor Component
 * Allows editing the weekly menu plan
 */

"use client";

import { useState } from "react";
import { Card, Button, Select } from "@/components/ui";
import type { MenuItem, Recipe } from "@/lib/db/types";
import { updateMenuItem } from "@/app/actions/menu.actions";

interface MenuEditorProps {
  initialMenu: MenuItem[];
  recipes: Recipe[];
  weekStartDate: string;
}

const DIET_TYPES = ["vegetarisch", "fleisch", "pescetarisch"];

export function MenuEditor({
  initialMenu,
  recipes,
  weekStartDate,
}: MenuEditorProps) {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const generateWeekDays = () => {
    const days = [];
    const startDate = new Date(weekStartDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split("T")[0]);
    }

    return days;
  };

  const weekDays = generateWeekDays();

  const handleRecipeChange = async (
    date: string,
    dietType: string,
    recipeId: string
  ) => {
    setSaving(true);

    try {
      const numericRecipeId = parseInt(recipeId, 10);
      const result = await updateMenuItem({
        date,
        diet_type: dietType,
        recipe_id: numericRecipeId,
      });

      if (result.success) {
        const updated = menu.filter(
          (m) => !(m.date === date && m.diet_type === dietType)
        );
        updated.push({
          date,
          diet_type: dietType as any,
          recipe_id: numericRecipeId,
        });
        setMenu(updated);
        setMessage({ type: "success", text: result.message });
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

  const getRecipeForDay = (date: string, dietType: string) => {
    return menu.find((m) => m.date === date && m.diet_type === dietType)
      ?.recipe_id;
  };

  return (
    <Card title="Weekly Menu Plan">
      <div className="space-y-6">
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">
                  Date
                </th>
                {DIET_TYPES.map((diet) => (
                  <th
                    key={diet}
                    className="text-left p-3 font-semibold text-gray-700"
                  >
                    {diet}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDays.map((date) => (
                <tr
                  key={date}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 font-medium text-gray-900">
                    {new Date(date).toLocaleDateString("de-DE", {
                      weekday: "short",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </td>
                  {DIET_TYPES.map((dietType) => (
                    <td key={`${date}-${dietType}`} className="p-3">
                      <select
                        value={getRecipeForDay(date, dietType) || ""}
                        onChange={(e) =>
                          handleRecipeChange(date, dietType, e.target.value)
                        }
                        disabled={saving}
                        className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                      >
                        <option value="">Select recipe</option>
                        {recipes.map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
