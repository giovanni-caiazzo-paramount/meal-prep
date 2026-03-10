"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import type { AgeGroup, DietType, Kita, PortionCount } from "@/lib/db/types";
import {
  deletePortionCountAction,
  upsertPortionCountAction,
} from "@/app/actions/settings.actions";

interface SettingsPortionCountsClientProps {
  initialPortions: PortionCount[];
  kitas: Kita[];
}

const AGE_GROUPS: AgeGroup[] = ["Krippe", "Kita", "Hort"];
const DIET_TYPES: DietType[] = ["vegetarisch", "fleisch", "pescetarisch"];

interface PortionForm {
  kita_id: string;
  age_group: AgeGroup;
  diet_type: DietType;
  children_count: string;
}

export default function SettingsPortionCountsClient({
  initialPortions,
  kitas,
}: SettingsPortionCountsClientProps) {
  const router = useRouter();
  const [portions, setPortions] = useState(initialPortions);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<PortionForm>({
    kita_id: kitas[0] ? String(kitas[0].id) : "",
    age_group: "Krippe",
    diet_type: "vegetarisch",
    children_count: "0",
  });

  const kitasById = useMemo(() => {
    return new Map(kitas.map((kita) => [kita.id, kita.name]));
  }, [kitas]);

  const sorted = useMemo(() => {
    return [...portions].sort((a, b) => {
      if (a.kita_id !== b.kita_id) {
        return a.kita_id - b.kita_id;
      }
      if (a.age_group !== b.age_group) {
        return a.age_group.localeCompare(b.age_group);
      }
      return a.diet_type.localeCompare(b.diet_type);
    });
  }, [portions]);

  const handleSave = async () => {
    const kitaId = Number(form.kita_id);
    const childrenCount = Number(form.children_count);

    if (!Number.isInteger(kitaId) || kitaId <= 0) {
      setMessage("Please select a Kita");
      return;
    }

    if (!Number.isInteger(childrenCount) || childrenCount < 0) {
      setMessage("Children count must be 0 or a positive integer");
      return;
    }

    setIsSaving(true);
    const result = await upsertPortionCountAction({
      kita_id: kitaId,
      age_group: form.age_group,
      diet_type: form.diet_type,
      children_count: childrenCount,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setPortions((current) => {
        const next = current.filter(
          (item) =>
            !(
              item.kita_id === kitaId &&
              item.age_group === form.age_group &&
              item.diet_type === form.diet_type
            )
        );

        return [
          ...next,
          {
            kita_id: kitaId,
            age_group: form.age_group,
            diet_type: form.diet_type,
            children_count: childrenCount,
          },
        ];
      });
      router.refresh();
    }
  };

  const fillForm = (item: PortionCount) => {
    setForm({
      kita_id: String(item.kita_id),
      age_group: item.age_group,
      diet_type: item.diet_type,
      children_count: String(item.children_count),
    });
  };

  const handleDelete = async (item: PortionCount) => {
    setIsSaving(true);
    const result = await deletePortionCountAction(
      item.kita_id,
      item.age_group,
      item.diet_type
    );
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setPortions((current) =>
        current.filter(
          (row) =>
            !(
              row.kita_id === item.kita_id &&
              row.age_group === item.age_group &&
              row.diet_type === item.diet_type
            )
        )
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <Card className="bg-muted border-border py-3">
          <p className="text-sm text-foreground">{message}</p>
        </Card>
      )}

      <Card title="Create / Update Portion Count">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Kita</label>
            <select
              value={form.kita_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, kita_id: event.target.value }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {kitas.map((kita) => (
                <option key={kita.id} value={kita.id}>
                  {kita.name}
                </option>
              ))}
            </select>
          </div>

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
            <label className="text-sm font-medium text-gray-700">Diet</label>
            <select
              value={form.diet_type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  diet_type: event.target.value as DietType,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            >
              {DIET_TYPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Children"
            type="number"
            min="0"
            step="1"
            value={form.children_count}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                children_count: event.target.value,
              }))
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
              <th className="p-2 text-left font-semibold text-gray-700">Kita</th>
              <th className="p-2 text-left font-semibold text-gray-700">Age Group</th>
              <th className="p-2 text-left font-semibold text-gray-700">Diet</th>
              <th className="p-2 text-right font-semibold text-gray-700">Children</th>
              <th className="p-2 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr
                key={`${item.kita_id}:${item.age_group}:${item.diet_type}`}
                className="border-b border-gray-100"
              >
                <td className="p-2 font-medium text-gray-900">
                  {kitasById.get(item.kita_id) ?? `Kita #${item.kita_id}`}
                </td>
                <td className="p-2 text-gray-600">{item.age_group}</td>
                <td className="p-2 text-gray-600">{item.diet_type}</td>
                <td className="p-2 text-right text-gray-700">{item.children_count}</td>
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
                      onClick={() => handleDelete(item)}
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
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No portion counts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
