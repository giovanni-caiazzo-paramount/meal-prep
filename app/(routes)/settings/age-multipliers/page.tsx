/**
 * Age Multipliers Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getAgeMultipliers } from "@/app/actions/data.actions";
import SettingsAgeMultipliersClient from "@/components/features/SettingsAgeMultipliersClient";

export default async function AgeMultipliersPage() {
  const result = await getAgeMultipliers();
  const multipliers = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Age Multipliers
          </h1>
          <p className="text-gray-600">
            Portion size adjustments per age group and ingredient category
          </p>
        </div>
        <Link href="/settings">
          <Button variant="ghost">&larr; Back to Settings</Button>
        </Link>
      </div>

      {!result.success && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-800">{result.message}</p>
        </Card>
      )}

      <SettingsAgeMultipliersClient initialMultipliers={multipliers} />

      <Card className="bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          Multipliers adjust ingredient amounts per age group. A value of{" "}
          <strong>1.0</strong> means the standard portion. <strong>0.9</strong>{" "}
          means 90% of the standard portion, and so on.
        </p>
      </Card>
    </div>
  );
}
