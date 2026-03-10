/**
 * Kitchen Preparation Sheet Page
 */

import { Suspense } from "react";
import { Card } from "@/components/ui";
import { KitchenPrepSheet } from "@/components/features";
import { getKitchenPrepSheetForDay } from "@/app/actions/calculations.actions";
import KitchenPageClient from "./client";

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

async function KitchenPrepSheetContent({ date }: { date: string }) {
  const result = await getKitchenPrepSheetForDay(date);

  if (!result.success) {
    return (
      <Card className="bg-red-50 border-red-200">
        <p className="text-red-800">{result.message}</p>
      </Card>
    );
  }

  return <KitchenPrepSheet date={date} sheetData={result.data} />;
}

export default function KitchenPage() {
  return (
    <KitchenPageClient>
      <Suspense
        fallback={
          <Card>
            <p className="text-gray-500">Loading preparation sheet...</p>
          </Card>
        }
      >
        <KitchenPrepSheetContent
          date={new Date().toISOString().split("T")[0]}
        />
      </Suspense>
    </KitchenPageClient>
  );
}
