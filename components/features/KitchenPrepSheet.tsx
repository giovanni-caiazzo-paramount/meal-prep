/**
 * Kitchen Prep Sheet Component
 * Displays daily preparation instructions per Kita
 */

"use client";

import { Card } from "@/components/ui";
import type { KitchenPrepSheetRow } from "@/lib/db/types";

interface KitchenPrepSheetProps {
  date: string;
  sheetData: KitchenPrepSheetRow[];
}

export function KitchenPrepSheet({ date, sheetData }: KitchenPrepSheetProps) {
  // Group by kita
  const groupedByKita = sheetData.reduce(
    (acc, row) => {
      const kitaKey = `${row.kita_id}:${row.kita_name}`;
      if (!acc[kitaKey]) {
        acc[kitaKey] = [];
      }
      acc[kitaKey].push(row);
      return acc;
    },
    {} as Record<string, KitchenPrepSheetRow[]>
  );

  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card title={`Kitchen Preparation Sheet — ${dateStr}`}>
      <div className="space-y-8">
        {Object.entries(groupedByKita).map(([kitaKey, rows]) => {
          const [kitaId, kitaName] = kitaKey.split(":");

          return (
            <div key={kitaKey} className="border-b pb-8 last:border-b-0">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                {kitaName}
              </h3>

              {rows.length === 0 ? (
                <p className="text-gray-500">No recipes for this day</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-2 font-semibold text-gray-700">
                          Ingredient
                        </th>
                        <th className="text-right p-2 font-semibold text-gray-700">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="p-2 text-gray-900">
                            {row.ingredient_name}
                          </td>
                          <td className="text-right p-2 font-medium text-gray-700">
                            {row.quantity.toFixed(1)} {row.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(groupedByKita).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No preparation data for this date</p>
          </div>
        )}
      </div>
    </Card>
  );
}
