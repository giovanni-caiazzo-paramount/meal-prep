/**
 * Recipes Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getRecipes } from "@/app/actions/data.actions";
import SettingsRecipesClient from "@/components/features/SettingsRecipesClient";

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

      <SettingsRecipesClient initialRecipes={recipes} />
    </div>
  );
}
