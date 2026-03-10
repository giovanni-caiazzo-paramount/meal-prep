/**
 * Portion Counts Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getPortionCounts, getKitas } from "@/app/actions/data.actions";
import SettingsPortionCountsClient from "@/components/features/SettingsPortionCountsClient";

export default async function PortionCountsPage() {
  const [portionResult, kitasResult] = await Promise.all([
    getPortionCounts(),
    getKitas(),
  ]);

  const portions = portionResult.success ? portionResult.data : [];
  const kitas = kitasResult.success ? kitasResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Portion Counts
          </h1>
          <p className="text-gray-600">
            Number of children per Kita, age group, and diet type
          </p>
        </div>
        <Link href="/settings">
          <Button variant="ghost">&larr; Back to Settings</Button>
        </Link>
      </div>

      {(!portionResult.success || !kitasResult.success) && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800">
            {portionResult.success
              ? kitasResult.message
              : portionResult.message}
          </p>
        </Card>
      )}

      <SettingsPortionCountsClient initialPortions={portions} kitas={kitas} />
    </div>
  );
}
