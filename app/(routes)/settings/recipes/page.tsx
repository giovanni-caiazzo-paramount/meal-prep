/**
 * Recipes Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getRecipes } from "@/app/actions/data.actions";

export default async function RecipesPage() {
  const result = await getRecipes();
  const recipes = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Recipes</h1>
          <p className="text-gray-600">Dishes available for menu planning</p>
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
                Category
              </th>
              <th className="text-left p-2 font-semibold text-gray-700">
                Adjustment Category
              </th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2 text-gray-500">{recipe.id}</td>
                <td className="p-2 font-medium text-gray-900">{recipe.name}</td>
                <td className="p-2 text-gray-600">{recipe.category}</td>
                <td className="p-2 text-gray-600">
                  {recipe.portion_adjustment_category}
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No recipes found. Add data via Supabase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
