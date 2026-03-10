/**
 * Ingredients Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getIngredients } from "@/app/actions/data.actions";
import SettingsIngredientsClient from "@/components/features/SettingsIngredientsClient";

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

      <SettingsIngredientsClient initialIngredients={ingredients} />
    </div>
  );
}
