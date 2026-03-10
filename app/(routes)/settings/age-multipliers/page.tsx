/**
 * Age Multipliers Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getAgeMultipliers } from "@/app/actions/data.actions";

export default async function AgeMultipliersPage() {
  const result = await getAgeMultipliers();
  const multipliers = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Age Multipliers
          </h1>
          <p className="text-gray-600">
            Portion size adjustments per age group and ingredient category
          </p>
        </div>
        <Link href="/settings">
          <Button variant="ghost">&larr; Back to Settings</Button>
        </Link>
      </div>

      {!result.success && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800">{result.message}</p>
        </Card>
      )}

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 font-semibold text-gray-700">
                Age Group
              </th>
              <th className="text-left p-2 font-semibold text-gray-700">
                Ingredient Category
              </th>
              <th className="text-right p-2 font-semibold text-gray-700">
                Multiplier
              </th>
            </tr>
          </thead>
          <tbody>
            {multipliers.map((m, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2 font-medium text-gray-900">{m.age_group}</td>
                <td className="p-2 text-gray-600">{m.ingredient_category}</td>
                <td className="p-2 text-right tabular-nums text-gray-700">
                  {m.multiplier}×
                </td>
              </tr>
            ))}
            {multipliers.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No multipliers found. Add data via Supabase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          Multipliers adjust ingredient amounts per age group. A value of{" "}
          <strong>1.0</strong> means the standard portion. <strong>0.9</strong>{" "}
          means 90% of the standard portion, and so on.
        </p>
      </Card>
    </div>
  );
}
