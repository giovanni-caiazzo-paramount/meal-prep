/**
 * Shopping List Page
 * Step 1: AI reviews menu and suggests swaps based on inventory (Option C)
 * Step 2: Shopping list is calculated using the (potentially updated) menu
 */

import { Card } from "@/components/ui";
import { ShoppingPageClient } from "@/components/features";

function getCurrentWeekStart() {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const weekStart = new Date(today.setDate(first));
  return weekStart.toISOString().split("T")[0];
}

export default function ShoppingListPage() {
  const weekStartDate = getCurrentWeekStart();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h1>
        <p className="text-gray-600">
          AI reviews your menu for inventory savings, then generates an accurate shopping list.
        </p>
      </div>

      <ShoppingPageClient weekStartDate={weekStartDate} />

      <Card className="border-l-4 border-l-green-500">
        <h2 className="font-semibold text-gray-900 mb-2">📝 How it works</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• AI suggests recipe swaps that use up leftover inventory</li>
          <li>• You approve or reject each suggestion</li>
          <li>• Shopping list is calculated on the approved menu</li>
          <li>• Inventory is subtracted from requirements automatically</li>
        </ul>
      </Card>
    </div>
  );
}
