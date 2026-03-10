/**
 * Shopping List Page
 */

import { Suspense } from "react";
import { Card } from "@/components/ui";
import { ShoppingListView } from "@/components/features";
import { getShoppingListForWeek } from "@/app/actions/calculations.actions";

function getCurrentWeekStart() {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const weekStart = new Date(today.setDate(first));
  return weekStart.toISOString().split("T")[0];
}

async function ShoppingListPageContent() {
  const weekStartDate = getCurrentWeekStart();
  const result = await getShoppingListForWeek(weekStartDate);

  if (!result.success) {
    return (
      <Card className="bg-red-50 border-red-200">
        <p className="text-red-800">{result.message}</p>
      </Card>
    );
  }

  return <ShoppingListView items={result.data} weekStartDate={weekStartDate} />;
}

export default function ShoppingListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h1>
        <p className="text-gray-600">
          Automatic shopping list based on menu plan and current inventory
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <p className="text-gray-500">Loading shopping list...</p>
          </Card>
        }
      >
        <ShoppingListPageContent />
      </Suspense>

      <Card className="border-l-4 border-l-green-500">
        <h2 className="font-semibold text-gray-900 mb-2">📝 How it works</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            • Calculate required ingredients based on menu and portion counts
          </li>
          <li>• Subtract current inventory from requirements</li>
          <li>• Present items to buy with exact quantities</li>
          <li>• Update inventory regularly for accurate calculations</li>
        </ul>
      </Card>
    </div>
  );
}
