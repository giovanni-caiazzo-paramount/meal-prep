/**
 * Kitchen Preparation Sheet Page
 */

import { Suspense } from "react";
import { Card } from "@/components/ui";
import { KitchenPrepSheet } from "@/components/features";
import KitchenPageClient from "@/components/features/KitchenPageClient";
import { getKitchenPrepSheetForDay } from "@/app/actions/calculations.actions";

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

interface KitchenPageProps {
  searchParams?: Promise<{
    date?: string;
  }>;
}

export default async function KitchenPage({ searchParams }: KitchenPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedDate = resolvedSearchParams?.date ?? getCurrentDate();

  return (
    <KitchenPageClient selectedDate={selectedDate}>
      <Suspense
        fallback={
          <Card>
            <p className="text-gray-500">Loading preparation sheet...</p>
          </Card>
        }
      >
        <KitchenPrepSheetContent date={selectedDate} />
      </Suspense>
    </KitchenPageClient>
  );
}
