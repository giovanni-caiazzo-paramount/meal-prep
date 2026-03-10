"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import type { Kita } from "@/lib/db/types";
import {
  createKitaAction,
  deleteKitaAction,
  updateKitaAction,
} from "@/app/actions/settings.actions";

interface SettingsKitasClientProps {
  initialKitas: Kita[];
}

interface EditableKita {
  name: string;
  city: string;
}

export default function SettingsKitasClient({
  initialKitas,
}: SettingsKitasClientProps) {
  const router = useRouter();
  const [kitas, setKitas] = useState(initialKitas);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newKita, setNewKita] = useState<EditableKita>({ name: "", city: "" });
  const [draft, setDraft] = useState<EditableKita>({ name: "", city: "" });
  const [message, setMessage] = useState<string>("");

  const refresh = () => {
    router.refresh();
  };

  const handleCreate = async () => {
    if (!newKita.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsSaving(true);
    const result = await createKitaAction({
      name: newKita.name.trim(),
      city: newKita.city.trim() || undefined,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setNewKita({ name: "", city: "" });
      refresh();
    }
  };

  const startEdit = (kita: Kita) => {
    setEditingId(kita.id);
    setDraft({ name: kita.name, city: kita.city ?? "" });
  };

  const handleUpdate = async (id: number) => {
    if (!draft.name.trim()) {
      setMessage("Name is required");
      return;
    }

    setIsSaving(true);
    const result = await updateKitaAction(id, {
      name: draft.name.trim(),
      city: draft.city.trim() || undefined,
    });
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setEditingId(null);
      setKitas((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                name: draft.name.trim(),
                city: draft.city.trim() || undefined,
              }
            : item
        )
      );
      refresh();
    }
  };

  const handleDelete = async (id: number) => {
    setIsSaving(true);
    const result = await deleteKitaAction(id);
    setIsSaving(false);

    setMessage(result.message);
    if (result.success) {
      setKitas((current) => current.filter((item) => item.id !== id));
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

      <Card title="Add Kita">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            label="Name"
            value={newKita.name}
            onChange={(event) =>
              setNewKita((current) => ({ ...current, name: event.target.value }))
            }
          />
          <Input
            label="City"
            value={newKita.city}
            onChange={(event) =>
              setNewKita((current) => ({ ...current, city: event.target.value }))
            }
          />
          <div className="flex items-end">
            <Button onClick={handleCreate} loading={isSaving} className="w-full">
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
              <th className="p-2 text-left font-semibold text-gray-700">Name</th>
              <th className="p-2 text-left font-semibold text-gray-700">City</th>
              <th className="p-2 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kitas.map((kita) => {
              const isEditing = editingId === kita.id;

              return (
                <tr key={kita.id} className="border-b border-gray-100">
                  <td className="p-2 text-gray-500">{kita.id}</td>
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
                      <span className="font-medium text-gray-900">{kita.name}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <Input
                        value={draft.city}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            city: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <span className="text-gray-600">{kita.city ?? "—"}</span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(kita.id)}
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
                            onClick={() => startEdit(kita)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(kita.id)}
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
            {kitas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No kitas found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
