# Karotte & Erbse — Catering Automation System

A modern, production-ready Next.js application that replaces Excel-based workflows for catering operations. Automates menu planning, shopping list generation, kitchen preparation, and inventory management for schools and kindergartens.

**Status:** ✅ Built and tested — ready for implementation

## 🎯 Features

- **📅 Menu Planning** — Manage weekly menus for multiple diet types (vegetarisch, fleisch, pescetarisch)
- **🛒 Automatic Shopping Lists** — Calculate exact ingredient requirements based on menu, portion counts, age groups, and inventory
- **🍳 Kitchen Preparation Sheets** — Generate daily cooking instructions with ingredient quantities per school
- **🧂 Inventory Management** — Track leftovers and reduce shopping lists accordingly
- **🤖 AI Menu Optimization** — Smart suggestions for menu changes using leftover ingredients (OpenAI integration)

## 📊 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via Supabase
- **Validation:** Zod for all schemas
- **Styling:** Tailwind CSS 4
- **AI:** OpenAI API + Vercel AI SDK
- **State:** Server Actions, no external state management needed

## 📁 Repository Structure

```
meal-prep/
├── app/
│   ├── layout.tsx              # Root layout with header
│   ├── page.tsx                # Dashboard home page
│   ├── globals.css             # Tailwind CSS
│   ├── actions/
│   │   ├── menu.actions.ts     # Menu CRUD server actions
│   │   ├── calculations.actions.ts # Shopping list & prep sheet
│   │   ├── inventory.actions.ts # Inventory management
│   │   └── data.actions.ts     # Data fetching actions
│   └── (routes)/
│       ├── menu/page.tsx       # Menu planning page
│       ├── shopping/page.tsx   # Shopping list view
│       ├── inventory/page.tsx  # Inventory management
│       ├── kitchen/
│       │   ├── page.tsx        # Kitchen prep sheets
│       │   └── client.tsx      # Client component
│       ├── optimize/page.tsx   # AI optimization page
│       └── settings/page.tsx   # System settings
│
├── components/
│   ├── ui/                     # Atomic UI components
│   │   ├── Button.tsx          # Reusable button component
│   │   ├── Card.tsx            # Container component
│   │   ├── Input.tsx           # Text input component
│   │   ├── Select.tsx          # Dropdown component
│   │   └── index.ts            # Barrel export
│   └── features/               # Domain-specific components
│       ├── MenuEditor.tsx      # Menu planning grid
│       ├── ShoppingListView.tsx # Shopping list display
│       ├── InventoryManager.tsx # Inventory CRUD
│       ├── KitchenPrepSheet.tsx # Kitchen prep display
│       └── index.ts            # Barrel export
│
├── lib/
│   ├── env.ts                  # Environment variables config
│   ├── calculations.ts         # Core calculation engine
│   │                           # - Shopping list calculation
│   │                           # - Kitchen prep sheet generation
│   ├── ai-optimization.ts      # AI menu optimization service
│   └── db/
│       ├── client.ts           # Supabase client initialization
│       ├── types.ts            # TypeScript type definitions
│       ├── schemas.ts          # Zod validation schemas
│       ├── schema.sql          # Database DDL migration
│       └── services/           # Data access layer
│           ├── kitas.service.ts
│           ├── recipes.service.ts
│           ├── ingredients.service.ts
│           ├── menu-plan.service.ts
│           ├── portion-counts.service.ts
│           ├── age-multipliers.service.ts
│           └── inventory.service.ts
│
├── public/                     # Static assets
├── .env.example                # Environment template
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind configuration
├── postcss.config.mjs          # PostCSS config
├── eslint.config.mjs           # ESLint rules
│
├── QUICK_START.md              # 5-minute setup guide
├── SETUP_GUIDE.md              # Comprehensive documentation
├── IMPLEMENTATION_CHECKLIST.md # Setup validation checklist
└── README.md                   # This file
```

## 🏗️ Architecture

### Data Flow

```
Menu Plan + Recipes + Portion Counts
           ↓
    Age Multipliers
           ↓
  Ingredient Requirements (per Kita)
           ↓
   Aggregate across Kitas
           ↓
  Subtract Inventory
           ↓
  Shopping List / Kitchen Prep Sheet
```

### Layer Structure

**1. Database Layer** (`lib/db/`)

- Type-safe interfaces for all entities
- Zod schemas for validation
- Service layer for data access
- Supabase client initialization

**2. Business Logic** (`lib/`)

- `calculations.ts` — Shopping list and kitchen prep sheet generation
- `ai-optimization.ts` — AI-powered menu suggestions
- Decimal.js for precision arithmetic

**3. Server Actions** (`app/actions/`)

- Form handling and mutations
- Data fetching and caching
- CSRF-protected operations

**4. UI Components** (`components/`)

- Atomic components (Button, Card, Input, Select)
- Feature components (domain-specific logic)
- Server/Client component split

**5. Pages** (`app/(routes)/`)

- Dashboard
- Menu Planning
- Shopping List
- Inventory Management
- Kitchen Prep Sheets
- AI Optimization
- Settings

## 💾 Database Schema

### Pre-loaded Tables

- **kitas** — Schools/kindergartens receiving catering
- **recipes** — Dishes with adjustment categories
- **ingredients** — Available ingredients with units
- **recipe_ingredients** — Recipe compositions (junction table)
- **menu_plan** — Weekly menu assignments
- **portion_counts** — Children counts per Kita/age/diet
- **age_multipliers** — Portion adjustments by age group

### Auto-created Tables

- **inventory** — Leftover ingredient tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- OpenAI API key (optional, for AI features)

### Quick Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env.local
   # Edit with your Supabase credentials
   ```

3. **Set up database:**
   - Run `lib/db/schema.sql` in Supabase SQL Editor
   - Import initial data

4. **Start development server:**

   ```bash
   pnpm dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** — 5-minute setup guide with sample data
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** — Comprehensive setup and architecture documentation
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** — Phase-by-phase implementation checklist

## 🧪 Key Files by Feature

### Menu Planning

- `components/features/MenuEditor.tsx` — UI component
- `app/actions/menu.actions.ts` — CRUD operations
- `lib/db/services/menu-plan.service.ts` — Data access

### Shopping List

- `components/features/ShoppingListView.tsx` — Display component
- `app/actions/calculations.actions.ts` — List generation
- `lib/calculations.ts` — Core calculation logic

### Kitchen Prep Sheets

- `components/features/KitchenPrepSheet.tsx` — Display component
- `lib/calculations.ts` — Calculation logic

### Inventory

- `components/features/InventoryManager.tsx` — UI component
- `app/actions/inventory.actions.ts` — CRUD operations
- `lib/db/services/inventory.service.ts` — Data access

### AI Optimization

- `app/(routes)/optimize/page.tsx` — UI page
- `lib/ai-optimization.ts` — OpenAI integration

## 🔒 Security & Quality

✅ **Type Safety** — Full TypeScript, no `any` types  
✅ **Input Validation** — Zod schemas on all inputs  
✅ **CSRF Protection** — Server Actions with built-in CSRF tokens  
✅ **Database Security** — Supabase Row-Level Security ready  
✅ **SOLID Principles** — Clean separation of concerns  
✅ **Precision Arithmetic** — Decimal.js for calculations

## 📋 Available Scripts

```bash
# Development
pnpm dev         # Start dev server

# Production
pnpm build       # Build for production
pnpm start       # Start production server

# Code Quality
pnpm lint        # Run ESLint
```

## 🗂️ Key Dependencies

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "typescript": "^5",
  "zod": "^3.22.4",
  "@supabase/supabase-js": "^2.38.0",
  "ai": "^3.0.0",
  "@ai-sdk/openai": "^0.0.44",
  "date-fns": "^3.0.0",
  "decimal.js": "^10.4.3",
  "tailwindcss": "^4"
}
```

## 🎯 Workflow Example

1. **Define Menu** — Select recipes for each day/diet type
2. **Generate List** — Automatic calculation accounts for:
   - Portion counts (e.g., 20 children per Kita)
   - Age multipliers (Krippe gets 0.9x, Hort gets 1.1x)
   - Multiple diet types (vegetarian, meat-based, pescatarian)
   - Current inventory (deducted from requirements)
3. **Kitchen Staff** — Receive prep sheet with ingredient quantities per Kita
4. **Track Inventory** — Log leftovers for next calculation
5. **AI Suggestions** — Optional: Get menu change recommendations based on stock

## 📞 Support & Documentation

- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Review [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) to validate setup
- Consult database schema in `lib/db/schema.sql`
- Review TypeScript types in `lib/db/types.ts`

## 🚀 Ready to Deploy

The system is production-ready:

- ✅ Full type safety
- ✅ Input validation
- ✅ Error handling
- ✅ Performance optimized
- ✅ Database migration included
- ✅ Documentation complete

Deploy to Vercel, Netlify, or your preferred Node.js hosting.

---

**Version:** 1.0.0  
**Last Updated:** March 10, 2026  
**Status:** Production Ready ✨
