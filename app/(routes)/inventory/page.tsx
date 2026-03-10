/**
 * Inventory Management Page
 */

import { Suspense } from "react";
import { Card } from "@/components/ui";
import { InventoryManager } from "@/components/features";
import { getInventory } from "@/app/actions/inventory.actions";
import { getIngredients } from "@/app/actions/data.actions";

async function InventoryPageContent() {
  const [inventoryResult, ingredientsResult] = await Promise.all([
    getInventory(),
    getIngredients(),
  ]);

  if (!inventoryResult.success || !ingredientsResult.success) {
    return (
      <Card className="bg-red-50 border-red-200">
        <p className="text-red-800">
          Error loading data:{" "}
          {inventoryResult.success
            ? ingredientsResult.message
            : inventoryResult.message}
        </p>
      </Card>
    );
  }

  return (
    <InventoryManager
      inventory={inventoryResult.data}
      ingredients={ingredientsResult.data}
    />
  );
}

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600">
          Track ingredient inventory and update stock levels
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <p className="text-gray-500">Loading inventory...</p>
          </Card>
        }
      >
        <InventoryPageContent />
      </Suspense>

      <Card className="border-l-4 border-l-amber-500">
        <h2 className="font-semibold text-gray-900 mb-2">⚙️ Settings</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            • Update inventory regularly (e.g., every week after delivery)
          </li>
          <li>• Only record ingredients with significant quantities</li>
          <li>• Inventory helps reduce shopping list amounts automatically</li>
          <li>
            • Use leftover ingredients as input for AI optimization suggestions
          </li>
        </ul>
      </Card>
    </div>
  );
}
