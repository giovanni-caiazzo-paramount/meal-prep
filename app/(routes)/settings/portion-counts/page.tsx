/**
 * Portion Counts Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getPortionCounts, getKitas } from "@/app/actions/data.actions";

export default async function PortionCountsPage() {
  const [portionResult, kitasResult] = await Promise.all([
    getPortionCounts(),
    getKitas(),
  ]);

  const portions = portionResult.success ? portionResult.data : [];
  const kitasById = new Map(
    (kitasResult.success ? kitasResult.data : []).map((k) => [k.id, k.name])
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Portion Counts
          </h1>
          <p className="text-gray-600">
            Number of children per Kita, age group, and diet type
          </p>
        </div>
        <Link href="/settings">
          <Button variant="ghost">&larr; Back to Settings</Button>
        </Link>
      </div>

      {(!portionResult.success || !kitasResult.success) && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800">
            {portionResult.success
              ? kitasResult.message
              : portionResult.message}
          </p>
        </Card>
      )}

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 font-semibold text-gray-700">
                Kita
              </th>
              <th className="text-left p-2 font-semibold text-gray-700">
                Age Group
              </th>
              <th className="text-left p-2 font-semibold text-gray-700">
                Diet Type
              </th>
              <th className="text-right p-2 font-semibold text-gray-700">
                Children
              </th>
            </tr>
          </thead>
          <tbody>
            {portions.map((p, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2 font-medium text-gray-900">
                  {kitasById.get(p.kita_id) ?? `Kita #${p.kita_id}`}
                </td>
                <td className="p-2 text-gray-600">{p.age_group}</td>
                <td className="p-2 text-gray-600">{p.diet_type}</td>
                <td className="p-2 text-right tabular-nums font-medium text-gray-700">
                  {p.children_count}
                </td>
              </tr>
            ))}
            {portions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No portion counts found. Add data via Supabase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
