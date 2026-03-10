"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import {
  analyzeLeftoversAction,
  type AnalyzeLeftoversResult,
} from "@/app/actions/optimize.actions";
import type { LeftoverSuggestion } from "@/lib/ai-optimization";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMondayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday.toISOString().split("T")[0];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LeftoversTable({
  leftovers,
}: {
  leftovers: AnalyzeLeftoversResult["leftovers"];
}) {
  if (leftovers.length === 0) return null;

  return (
    <Card title="Leftover Ingredients This Week">
      <p className="text-sm text-gray-500 mb-4">
        These ingredients will remain after all planned meals across all Kitas.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="p-2 text-left font-semibold text-gray-700">
              Ingredient
            </th>
            <th className="p-2 text-right font-semibold text-gray-700">
              Surplus
            </th>
            <th className="p-2 text-right font-semibold text-gray-700">Unit</th>
          </tr>
        </thead>
        <tbody>
          {leftovers
            .sort((a, b) => b.leftover_amount - a.leftover_amount)
            .map((item) => (
              <tr
                key={item.ingredient_id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2 font-medium text-gray-900">
                  {item.ingredient_name}
                </td>
                <td className="p-2 text-right text-orange-600 font-semibold">
                  {item.leftover_amount.toLocaleString("de-DE", {
                    maximumFractionDigits: 1,
                  })}
                </td>
                <td className="p-2 text-right text-gray-500">{item.unit}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
}

function SuggestionCard({ suggestion }: { suggestion: LeftoverSuggestion }) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">
            {suggestion.recipe_name}
          </h3>
          <p className="text-xs text-gray-400">
            Recipe ID: {suggestion.recipe_id}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          AI Suggestion
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{suggestion.suggestion_text}</p>

      {suggestion.leftover_ingredients_used.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Leftovers used
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestion.leftover_ingredients_used.map((ing, i) => (
              <span
                key={i}
                className="rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs text-orange-800"
              >
                {ing.ingredient_name} — ~{ing.estimated_amount} {ing.unit}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OptimizeClient() {
  const [weekStart, setWeekStart] = useState(getMondayOfCurrentWeek);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeLeftoversResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const weekEnd = (() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  })();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeLeftoversAction(weekStart);
      if (!data.success) {
        setError(data.message ?? "Something went wrong");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card title="Select Week">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <Input
              label="Week start (Monday)"
              type="date"
              value={weekStart}
              onChange={(e) => {
                setWeekStart(e.target.value);
                setResult(null);
                setError(null);
              }}
            />
            <p className="mt-1 text-xs text-gray-400">
              Analysing:{" "}
              <span className="font-medium text-gray-600">
                {formatDate(weekStart)}
              </span>{" "}
              →{" "}
              <span className="font-medium text-gray-600">
                {formatDate(weekEnd)}
              </span>
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            loading={isLoading}
            className="sm:self-end"
          >
            {isLoading ? "Analysing…" : "Analyse Leftovers & Ask AI"}
          </Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
          {error.toLowerCase().includes("lmstudio") ||
          error.toLowerCase().includes("fetch") ? (
            <p className="mt-2 text-xs text-red-600">
              Make sure LM Studio is running at the configured base URL and the
              model is loaded.
            </p>
          ) : null}
        </Card>
      )}

      {/* Empty state */}
      {result && result.leftovers.length === 0 && (
        <Card className="bg-green-50 border-green-200">
          <p className="text-sm text-green-800 font-medium">
            ✓ No leftovers this week
          </p>
          <p className="text-sm text-green-700 mt-1">
            {result.message ??
              "Inventory is being used efficiently — nothing left over after all planned meals."}
          </p>
        </Card>
      )}

      {/* Leftovers table */}
      {result && result.leftovers.length > 0 && (
        <LeftoversTable leftovers={result.leftovers} />
      )}

      {/* AI suggestions */}
      {result && result.suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            AI Recipe Suggestions
          </h2>
          <p className="text-sm text-gray-500 -mt-2">
            Based on your leftover ingredients, the AI suggests these recipes
            from the database.
          </p>
          {result.suggestions.map((s) => (
            <SuggestionCard key={s.recipe_id} suggestion={s} />
          ))}
        </div>
      )}

      {/* No suggestions but had leftovers */}
      {result &&
        result.leftovers.length > 0 &&
        result.suggestions.length === 0 &&
        !isLoading && (
          <Card className="bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-800">
              The AI did not return any recipe suggestions. Check that LM Studio
              is running and the model supports structured output (JSON mode).
            </p>
          </Card>
        )}
    </div>
  );
}
