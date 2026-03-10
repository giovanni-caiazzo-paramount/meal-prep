/**
 * AI Suggestion Review Component
 * Allows users to accept or reject AI-generated recipe swap suggestions
 * before the shopping list is calculated (Option C flow).
 */

"use client";

import { useState, useTransition } from "react";
import { Card, Button } from "@/components/ui";
import {
  getAISuggestionsForWeek,
  applyMenuSuggestion,
} from "@/app/actions/ai-optimization.actions";

interface Suggestion {
  date: string;
  diet_type: string;
  suggested_recipe_name: string;
  suggested_recipe_id: number;
  reasoning: string;
  ingredients_that_use_inventory: { ingredient_name: string; amount_saved: number }[];
}

interface AISuggestionReviewProps {
  weekStartDate: string;
  onDone: () => void;
}

export function AISuggestionReview({ weekStartDate, onDone }: AISuggestionReviewProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [rejected, setRejected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isFetching, startFetch] = useTransition();
  const [isApplying, startApply] = useTransition();

  const fetchSuggestions = () => {
    startFetch(async () => {
      setError(null);
      const result = await getAISuggestionsForWeek(weekStartDate);
      if (!result.success) {
        setError(result.message ?? "Failed to fetch suggestions");
      } else {
        setSuggestions(result.data as Suggestion[]);
      }
    });
  };

  const handleAccept = (index: number, suggestion: Suggestion) => {
    startApply(async () => {
      const result = await applyMenuSuggestion(
        suggestion.date,
        suggestion.diet_type,
        suggestion.suggested_recipe_id
      );
      if (result.success) {
        setApplied((prev) => new Set(prev).add(index));
      } else {
        setError(result.message ?? "Failed to apply suggestion");
      }
    });
  };

  const handleReject = (index: number) => {
    setRejected((prev) => new Set(prev).add(index));
  };

  const allReviewed =
    suggestions !== null &&
    suggestions.every((_, i) => applied.has(i) || rejected.has(i));

  return (
    <Card className="border-l-4 border-l-purple-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              🤖 Step 1: AI Menu Optimization
            </h2>
            <p className="text-sm text-gray-500">
              Review AI suggestions to use leftover inventory before generating your shopping list.
            </p>
          </div>
          {suggestions === null && (
            <Button onClick={fetchSuggestions} disabled={isFetching}>
              {isFetching ? "Analysing..." : "Get AI Suggestions"}
            </Button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {suggestions !== null && suggestions.length === 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            ✅ No suggestions — inventory levels are fine. Proceed to generate your shopping list.
          </div>
        )}

        {suggestions !== null && suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((s, i) => {
              const isAccepted = applied.has(i);
              const isRejected = rejected.has(i);
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${
                    isAccepted
                      ? "bg-green-50 border-green-300"
                      : isRejected
                      ? "bg-gray-50 border-gray-200 opacity-50"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-gray-900">
                        📅 {s.date} — <span className="capitalize">{s.diet_type}</span>
                      </p>
                      <p className="text-sm text-gray-700">
                        Swap to: <strong>{s.suggested_recipe_name}</strong>
                      </p>
                      <p className="text-xs text-gray-500">{s.reasoning}</p>
                      {s.ingredients_that_use_inventory.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {s.ingredients_that_use_inventory.map((ing, j) => (
                            <span
                              key={j}
                              className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full"
                            >
                              {ing.ingredient_name}: {ing.amount_saved}g saved
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {!isAccepted && !isRejected && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          onClick={() => handleAccept(i, s)}
                          disabled={isApplying}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleReject(i)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {isAccepted && (
                      <span className="text-green-600 font-medium text-sm shrink-0">✅ Applied</span>
                    )}
                    {isRejected && (
                      <span className="text-gray-400 text-sm shrink-0">Skipped</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(suggestions !== null && (suggestions.length === 0 || allReviewed)) && (
          <div className="pt-2">
            <Button onClick={onDone}>
              → Generate Shopping List
            </Button>
          </div>
        )}

        {suggestions === null && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={onDone}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Skip AI step and go straight to shopping list
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
