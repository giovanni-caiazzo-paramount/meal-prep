/**
 * Shopping Page Client Component
 * Orchestrates the two-step flow:
 *   Step 1 — AI Suggestion Review (Option C)
 *   Step 2 — Shopping List (calculated after any approved swaps)
 */

"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui";
import { AISuggestionReview } from "./AISuggestionReview";
import { ShoppingListView } from "./ShoppingListView";
import { getShoppingListForWeek } from "@/app/actions/calculations.actions";
import type { ShoppingListItem } from "@/lib/db/types";

interface ShoppingPageClientProps {
  weekStartDate: string;
}

export function ShoppingPageClient({ weekStartDate }: ShoppingPageClientProps) {
  const [step, setStep] = useState<"ai-review" | "shopping-list">("ai-review");
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startLoading] = useTransition();

  const handleAIDone = () => {
    startLoading(async () => {
      setError(null);
      const result = await getShoppingListForWeek(weekStartDate);
      if (!result.success) {
        setError(result.message ?? "Failed to calculate shopping list");
      } else {
        setShoppingItems(result.data);
        setStep("shopping-list");
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <p className="text-gray-500">⏳ Calculating shopping list...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <p className="text-red-800">{error}</p>
      </Card>
    );
  }

  if (step === "ai-review") {
    return <AISuggestionReview weekStartDate={weekStartDate} onDone={handleAIDone} />;
  }

  return <ShoppingListView items={shoppingItems ?? []} weekStartDate={weekStartDate} />;
}
