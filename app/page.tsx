import Link from "next/link";
import { Card, Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Karotte & Erbse</h1>
        <p className="text-white/80">
          Smart catering automation system for menu planning, shopping lists,
          and kitchen preparation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            📅 Menu Planning
          </h2>
          <p className="text-gray-600 text-sm mb-4 flex-1">
            Manage weekly menu plans for different diet types and age groups
          </p>
          <Link href="/menu">
            <Button variant="primary" className="w-full">
              Go to Menu
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            🛒 Shopping List
          </h2>
          <p className="text-gray-600 text-sm mb-4 flex-1">
            Generate automatic shopping lists based on menu and inventory
          </p>
          <Link href="/shopping">
            <Button variant="primary" className="w-full">
              View Shopping List
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">🧂 Inventory</h2>
          <p className="text-gray-600 text-sm mb-4 flex-1">
            Track ingredient inventory and leftover stock
          </p>
          <Link href="/inventory">
            <Button variant="primary" className="w-full">
              Manage Inventory
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            🍳 Kitchen Sheets
          </h2>
          <p className="text-gray-600 text-sm mb-4 flex-1">
            Daily preparation instructions per school with ingredient quantities
          </p>
          <Link href="/kitchen">
            <Button variant="primary" className="w-full">
              Kitchen Sheets
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            🤖 AI Optimization
          </h2>
          <p className="text-gray-600 text-sm mb-4 flex-1">
            Get AI suggestions for menu changes based on inventory
          </p>
          <Link href="/optimize">
            <Button variant="primary" className="w-full">
              View Suggestions
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">⚙️ Settings</h2>
          <p className="text-gray-600 text-sm mb-4 flex-1">
            Configure Kitas, recipes, age multipliers, and more
          </p>
          <Link href="/settings">
            <Button variant="secondary" className="w-full">
              Go to Settings
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="bg-muted border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          ℹ️ Getting Started
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            1. Start by configuring your Kitas and age multipliers in Settings
          </li>
          <li>2. Set up the menu plan for the week on the Menu page</li>
          <li>3. Log current inventory in the Inventory section</li>
          <li>4. View the automatic shopping list based on your menu</li>
          <li>
            5. Use AI suggestions to optimize your menu based on leftovers
          </li>
          <li>6. Print daily kitchen preparation sheets for the cook</li>
        </ul>
      </Card>
    </div>
  );
}
