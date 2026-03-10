/**
 * Shopping List View Component
 * Displays the weekly shopping list with inventory deductions
 */

"use client";

import { Card } from "@/components/ui";
import type { ShoppingListItem } from "@/lib/db/types";

interface ShoppingListViewProps {
  items: ShoppingListItem[];
  weekStartDate: string;
}

export function ShoppingListView({
  items,
  weekStartDate,
}: ShoppingListViewProps) {
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const totalItems = items.length;
  const totalShoppingAmount = items.reduce(
    (sum, item) => sum + item.shopping_amount,
    0
  );

  // Group by ingredient category (optional)
  const groupedItems = items.reduce(
    (acc, item) => {
      const category = "Groceries"; // Can be enhanced with real categories
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, ShoppingListItem[]>
  );

  return (
    <Card
      title={`Shopping List (${weekStartDate} - ${weekEndDate.toISOString().split("T")[0]})`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold text-primary">{totalItems}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Shopping Amount</p>
            <p className="text-2xl font-bold text-green-600">
              {totalShoppingAmount.toFixed(0)}g
            </p>
          </div>
        </div>

        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {category}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 font-semibold text-gray-700">
                      Ingredient
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Required
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      Inventory
                    </th>
                    <th className="text-right p-2 font-semibold text-gray-700">
                      To Buy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryItems.map((item) => (
                    <tr
                      key={item.ingredient_id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-2 text-gray-900">
                        {item.ingredient_name}
                      </td>
                      <td className="text-right p-2 text-gray-700">
                        {item.required_amount.toFixed(1)} {item.unit}
                      </td>
                      <td className="text-right p-2 text-amber-600">
                        {item.inventory_amount.toFixed(1)} {item.unit}
                      </td>
                      <td className="text-right p-2 font-semibold text-green-600">
                        {item.shopping_amount.toFixed(1)} {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No items in shopping list</p>
          </div>
        )}
      </div>
    </Card>
  );
}
