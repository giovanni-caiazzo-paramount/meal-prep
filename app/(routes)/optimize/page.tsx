/**
 * AI Menu Optimization Page
 */

import OptimizeClient from "@/components/features/OptimizeClient";

export default function OptimizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Menu Optimization
        </h1>
        <p className="text-gray-600">
          Calculates this week&apos;s leftover inventory (after all planned
          meals across all Kitas) and asks your local LM Studio model which
          recipes would best use them up.
        </p>
      </div>

      <OptimizeClient />
    </div>
  );
}
