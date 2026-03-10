/**
 * Ingredients Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getIngredients } from "@/app/actions/data.actions";

export default async function IngredientsPage() {
  const result = await getIngredients();
  const ingredients = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Ingredients</h1>
          <p className="text-gray-600">All ingredients available for recipes</p>
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
              <th className="text-left p-2 font-semibold text-gray-700">ID</th>
              <th className="text-left p-2 font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left p-2 font-semibold text-gray-700">
                Unit
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2 text-gray-500">{ingredient.id}</td>
                <td className="p-2 font-medium text-gray-900">
                  {ingredient.name}
                </td>
                <td className="p-2 text-gray-600">{ingredient.unit}</td>
              </tr>
            ))}
            {ingredients.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No ingredients found. Add data via Supabase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
