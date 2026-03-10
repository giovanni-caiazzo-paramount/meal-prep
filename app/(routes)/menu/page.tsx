/**
 * Menu Planning Page
 */

import { Suspense } from "react";
import { Card, Button } from "@/components/ui";
import { MenuEditor } from "@/components/features";
import { getMenuPlanForWeek } from "@/app/actions/menu.actions";
import { getRecipes } from "@/app/actions/data.actions";

function getCurrentWeekStart() {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1; // Adjust to Monday
  const weekStart = new Date(today.setDate(first));
  return weekStart.toISOString().split("T")[0];
}

async function MenuPageContent() {
  const weekStartDate = getCurrentWeekStart();

  const [menuResult, recipesResult] = await Promise.all([
    getMenuPlanForWeek(weekStartDate),
    getRecipes(),
  ]);

  if (!menuResult.success || !recipesResult.success) {
    return (
      <Card className="bg-red-50 border-red-200">
        <p className="text-red-800">
          Error loading data:{" "}
          {menuResult.success ? recipesResult.message : menuResult.message}
        </p>
      </Card>
    );
  }

  return (
    <MenuEditor
      initialMenu={menuResult.data}
      recipes={recipesResult.data}
      weekStartDate={weekStartDate}
    />
  );
}

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Planning</h1>
        <p className="text-gray-600">
          Manage your weekly menu plan for each diet type
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <p className="text-gray-500">Loading menu...</p>
          </Card>
        }
      >
        <MenuPageContent />
      </Suspense>

      <Card className="border-l-4 border-l-primary">
        <h2 className="font-semibold text-gray-900 mb-2">💡 Tips</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Select recipes for each diet type for each day of the week</li>
          <li>• Changes are automatically saved</li>
          <li>• Your menu affects the shopping list and kitchen prep sheets</li>
        </ul>
      </Card>
    </div>
  );
}
