"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import type {
  AgeGroup,
  AgeMultiplier,
  PortionAdjustmentCategory,
} from "@/lib/db/types";
import {
  deleteAgeMultiplierAction,
  upsertAgeMultiplierAction,
} from "@/app/actions/settings.actions";

interface SettingsAgeMultipliersClientProps {
  initialMultipliers: AgeMultiplier[];
}

const AGE_GROUPS: AgeGroup[] = ["Krippe", "Kita", "Hort"];
const CATEGORIES: PortionAdjustmentCategory[] = ["Anders", "Gemüse", "Suppe"];

interface MultiplierForm {
  age_group: AgeGroup;
  ingredient_category: PortionAdjustmentCategory;
  multiplier: string;
}

export default function SettingsAgeMultipliersClient({
  initialMultipliers,
}: SettingsAgeMultipliersClientProps) {
  const router = useRouter();
  const [multipliers, setMultipliers] = useState(initialMultipliers);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<MultiplierForm>({
    age_group: "Krippe",
    ingredient_category: "Anders",
    multiplier: "1",
  });

  const sorted = useMemo(() => {
    return [...multipliers].sort((a, b) => {
      if (a.age_group !== b.age_group) {
        return a.age_group.localeCompare(b.age_group);
      }
      return String(a.ingredient_category).localeCompare(
        String(b.ingredient_category)
      );
    });
  }, [multipliers]);

  const handleSave = async () => {
    const parsedMultiplier = Number(form.multiplier);
    if (!Number.isFinite(parsedMultiplier) || parsedMultiplier <= 0) {
      setMessage("Multiplier must be a positive number");
      return;
    }

    setIsSaving(true);
    const result = await upsertAgeMultiplierAction({
      age_group: form.age_group,
      ingredient_category: form.ingredient_category,
      multiplier: parsedMultiplier,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setMultipliers((current) => {
        const next = current.filter(
          (item) =>
            !(
              item.age_group === form.age_group &&
              item.ingredient_category === form.ingredient_category
            )
        );

        return [
          ...next,
          {
            age_group: form.age_group,
            ingredient_category: form.ingredient_category,
            multiplier: parsedMultiplier,
          },
        ];
      });
      router.refresh();
    }
  };

  const handleDelete = async (
    ageGroup: AgeGroup,
    ingredientCategory: PortionAdjustmentCategory
  ) => {
    setIsSaving(true);
    const result = await deleteAgeMultiplierAction(ageGroup, ingredientCategory);
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setMultipliers((current) =>
        current.filter(
          (item) =>
            !(
              item.age_group === ageGroup &&
              item.ingredient_category === ingredientCategory
            )
        )
      );
      router.refresh();
    }
  };

  const fillForm = (item: AgeMultiplier) => {
    setForm({
      age_group: item.age_group,
      ingredient_category: item.ingredient_category as PortionAdjustmentCategory,
      multiplier: String(item.multiplier),
    });
  };

  return (
    <div className="space-y-4">
      {message && (
        <Card className="bg-muted border-border py-3">
          <p className="text-sm text-foreground">{message}</p>
        </Card>
      )}

      <Card title="Create / Update Multiplier">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Age Group</label>
            <select
              value={form.age_group}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  age_group: event.target.value as AgeGroup,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {AGE_GROUPS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.ingredient_category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  ingredient_category: event.target.value as PortionAdjustmentCategory,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Multiplier"
            type="number"
            min="0.01"
            step="0.01"
            value={form.multiplier}
            onChange={(event) =>
              setForm((current) => ({ ...current, multiplier: event.target.value }))
            }
          />

          <div className="flex items-end">
            <Button onClick={handleSave} loading={isSaving} className="w-full">
              Save
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-left font-semibold text-gray-700">Age Group</th>
              <th className="p-2 text-left font-semibold text-gray-700">Category</th>
              <th className="p-2 text-right font-semibold text-gray-700">Multiplier</th>
              <th className="p-2 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr
                key={`${item.age_group}:${item.ingredient_category}`}
                className="border-b border-gray-100"
              >
                <td className="p-2 font-medium text-gray-900">{item.age_group}</td>
                <td className="p-2 text-gray-600">{item.ingredient_category}</td>
                <td className="p-2 text-right text-gray-700">{item.multiplier}</td>
                <td className="p-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => fillForm(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleDelete(
                          item.age_group,
                          item.ingredient_category as PortionAdjustmentCategory
                        )
                      }
                      loading={isSaving}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No multipliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
