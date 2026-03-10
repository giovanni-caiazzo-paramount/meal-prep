/**
 * System Settings Page
 */

import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            System Settings
          </h1>
          <p className="text-gray-600">
            Database, API keys, and integration configuration
          </p>
        </div>
        <Link href="/settings">
          <Button variant="ghost">&larr; Back to Settings</Button>
        </Link>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Environment Variables
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          These values are configured via{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code>.
          Restart the dev server after making changes.
        </p>
        <div className="space-y-3">
          {[
            {
              key: "NEXT_PUBLIC_SUPABASE_URL",
              label: "Supabase URL",
              hint: "Found in your Supabase project settings under API",
            },
            {
              key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
              label: "Supabase Anon Key",
              hint: "Public anon key from Supabase project API settings",
            },
            {
              key: "SUPABASE_SERVICE_ROLE_KEY",
              label: "Service Role Key",
              hint: "Used server-side only — never expose this to the client",
            },
            {
              key: "LMSTUDIO_BASE_URL",
              label: "LM Studio Base URL",
              hint: "Local OpenAI-compatible endpoint URL (default: http://127.0.0.1:1234)",
            },
            {
              key: "LMSTUDIO_MODEL",
              label: "LM Studio Model",
              hint: "Model identifier loaded in LM Studio",
            },
            {
              key: "LMSTUDIO_API_KEY",
              label: "LM Studio API Key",
              hint: "Any non-empty value accepted by local endpoint",
            },
          ].map(({ key, label, hint }) => (
            <div
              key={key}
              className="p-3 bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {label}
                </span>
                <code className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded border">
                  {key}
                </code>
              </div>
              <p className="text-xs text-gray-500">{hint}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-l-4 border-l-amber-400">
        <h2 className="font-semibold text-gray-900 mb-2">⚠️ Setup Checklist</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>☐ Configure Supabase connection (check .env.local)</li>
          <li>☐ Run database migrations (schema.sql)</li>
          <li>☐ Import initial data (Kitas, recipes, ingredients)</li>
          <li>☐ Set portion counts for each Kita</li>
          <li>☐ Verify age multipliers are set</li>
          <li>☐ Test menu planning workflow</li>
          <li>☐ Configure LM Studio connection for AI optimization</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Database Schema
        </h2>
        <p className="text-sm text-gray-600">
          Run{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded">
            lib/db/schema.sql
          </code>{" "}
          in the Supabase SQL editor to create all required tables.
        </p>
      </Card>
    </div>
  );
}
