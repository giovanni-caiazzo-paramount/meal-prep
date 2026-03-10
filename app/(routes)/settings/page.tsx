/**
 * Settings Page
 */

import Link from "next/link";
import { Card, Button } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure Kitas, recipes, age multipliers, and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">🏫 Kitas</h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Manage schools/kindergartens that receive catering
          </p>
          <Link href="/settings/kitas">
            <Button variant="primary">Manage Kitas</Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            🍽️ Recipes
          </h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Create and edit recipes with ingredients
          </p>
          <Link href="/settings/recipes">
            <Button variant="primary">Manage Recipes</Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            🧂 Ingredients
          </h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Maintain the ingredient database
          </p>
          <Link href="/settings/ingredients">
            <Button variant="primary">Manage Ingredients</Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            📊 Age Multipliers
          </h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Set portion size adjustments by age group
          </p>
          <Link href="/settings/age-multipliers">
            <Button variant="primary">Manage Multipliers</Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            👥 Portion Counts
          </h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Define how many children per Kita, age group, diet type
          </p>
          <Link href="/settings/portion-counts">
            <Button variant="primary">Manage Portions</Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ⚙️ System
          </h2>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            Database, API keys, and integration settings
          </p>
          <Link href="/settings/system">
            <Button variant="secondary">System Settings</Button>
          </Link>
        </Card>
      </div>

      <Card className="bg-muted border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          ℹ️ Database Status
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Connected:</strong> Supabase PostgreSQL
          </p>
          <p>
            <strong>Tables:</strong> kitas, recipes, ingredients,
            recipe_ingredients, menu_plan, portion_counts, age_multipliers,
            inventory
          </p>
          <div className="mt-4 p-3 bg-background rounded border border-border">
            <p className="text-xs text-gray-600">
              Tables are pre-populated from the backend. Verify connection by
              going to the Menu Planning page.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <h2 className="font-semibold text-gray-900 mb-2">⚠️ Setup Checklist</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>☐ Configure Supabase connection (check .env.local)</li>
          <li>☐ Run database migrations (schema.sql)</li>
          <li>☐ Import initial data (Kitas, recipes, ingredients)</li>
          <li>☐ Set portion counts for each Kita</li>
          <li>☐ Verify age multipliers are set</li>
          <li>☐ Test menu planning workflow</li>
          <li>☐ Configure OpenAI API key for AI optimization</li>
        </ul>
      </Card>
    </div>
  );
}
