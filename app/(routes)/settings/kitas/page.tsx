/**
 * Kitas Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getKitas } from "@/app/actions/data.actions";
import SettingsKitasClient from "@/components/features/SettingsKitasClient";

export default async function KitasPage() {
  const result = await getKitas();
  const kitas = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Kitas</h1>
          <p className="text-gray-600">
            Manage schools and kindergartens that receive catering
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

      <SettingsKitasClient initialKitas={kitas} />
    </div>
  );
}
