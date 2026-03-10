/**
 * Kitchen Page Client Component
 */

"use client";

import { ReactNode } from "react";
import { Card, Button, Input } from "@/components/ui";

interface KitchenPageClientProps {
  children: ReactNode;
}

export default function KitchenPageClient({
  children,
}: KitchenPageClientProps) {
  // For now, we'll just show a placeholder
  // State management for date selection can be added later

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kitchen Preparation Sheet
        </h1>
        <p className="text-gray-600">
          Daily cooking instructions with ingredient quantities per school
        </p>
      </div>

      {children}

      <Card className="border-l-4 border-l-purple-500">
        <h2 className="font-semibold text-gray-900 mb-2">👨‍🍳 How to use</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>1. Select the date for which you want to see the prep sheet</li>
          <li>2. View ingredient quantities per Kita</li>
          <li>3. Print this sheet and give it to the cook</li>
          <li>
            4. The cook uses it to portion meals into labeled boxes for each
            school
          </li>
          <li>
            5. Quantities are automatically calculated based on menu and age
            groups
          </li>
        </ul>
      </Card>
    </div>
  );
}
