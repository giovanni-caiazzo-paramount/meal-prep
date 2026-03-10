/**
 * AI Menu Optimization Page
 */

import { Card, Button } from "@/components/ui";
import Link from "next/link";

export default function OptimizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Menu Optimization
        </h1>
        <p className="text-gray-600">
          Get AI suggestions to optimize your menu based on leftover inventory
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          🤖 How it Works
        </h2>
        <p className="text-blue-800 mb-4">
          This feature analyzes your current menu plan and inventory to suggest
          recipe changes that:
        </p>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Use leftover ingredients efficiently</li>
          <li>✓ Reduce overall shopping list cost</li>
          <li>✓ Maintain nutritional balance</li>
          <li>✓ Stay appropriate for Kita environment</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Setup Required
        </h2>
        <p className="text-gray-600 mb-4">
          To use AI optimization, you need to:
        </p>
        <ol className="space-y-2 text-sm text-gray-600 mb-6">
          <li>1. ✅ Create your menu plan (Menu Planning page)</li>
          <li>2. ✅ Record current inventory (Inventory page)</li>
          <li>3. ⚠️ Configure OpenAI API key in .env.local</li>
          <li>4. 📊 Generate suggestions and review them</li>
          <li>5. ✓ Approve or reject changes</li>
        </ol>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4">
          <p className="text-sm text-amber-900">
            <strong>Configuration:</strong> Add{" "}
            <code className="bg-white px-2 py-1 rounded">OPENAI_API_KEY</code>{" "}
            to your{" "}
            <code className="bg-white px-2 py-1 rounded">.env.local</code> file
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/inventory">
            <Button variant="secondary">Update Inventory First</Button>
          </Link>
          <Link href="/menu">
            <Button variant="secondary">Edit Menu</Button>
          </Link>
        </div>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <h2 className="font-semibold text-gray-900 mb-2">
          ✨ Example Suggestion
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Situation:</strong> You have 3kg carrots and 2kg potatoes in
            inventory
          </p>
          <p>
            <strong>Original Menu:</strong> Tuesday — Gnocchi with Tomato Sauce
          </p>
          <p>
            <strong>Suggestion:</strong> Carrot-Potato Stew (uses up inventory,
            saves 18kg gnocchi from shopping)
          </p>
          <p>
            <strong>You decide:</strong> Accept or reject (no automatic changes)
          </p>
        </div>
      </Card>
    </div>
  );
}
