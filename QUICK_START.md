# Quick Start Guide

## 🚀 5-Minute Setup

### 1. Install & Configure

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 2. Database Setup (Supabase)

1. Go to your Supabase project
2. Open SQL Editor
3. Paste content from `lib/db/schema.sql`
4. Run the migration

### 3. Import Sample Data

In Supabase, populate these tables:

```sql
-- Kitas
INSERT INTO kitas (name, city) VALUES
('Bad Homburg', 'Bad Homburg'),
('Brentano', 'Frankfurt');

-- Basic age multipliers
INSERT INTO age_multipliers (age_group, ingredient_category, multiplier) VALUES
('Krippe', 'Anders', 0.9),
('Kita', 'Anders', 1.0),
('Hort', 'Anders', 1.1),
('Krippe', 'Gemüse', 0.9),
('Kita', 'Gemüse', 1.0),
('Hort', 'Gemüse', 1.2),
('Krippe', 'Suppe', 0.8),
('Kita', 'Suppe', 1.0),
('Hort', 'Suppe', 1.0);

-- Portion counts (example: 10 children per age group)
INSERT INTO portion_counts (kita_id, age_group, diet_type, children_count) VALUES
(1, 'Krippe', 'vegetarisch', 10),
(1, 'Kita', 'vegetarisch', 20),
(1, 'Hort', 'vegetarisch', 15),
(1, 'Krippe', 'fleisch', 5),
(1, 'Kita', 'fleisch', 12),
(1, 'Hort', 'fleisch', 10),
(2, 'Krippe', 'vegetarisch', 8),
(2, 'Kita', 'vegetarisch', 18);
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000**

## 📍 First Steps

1. **Verify Connection**: Go to `/menu` — should load without errors
2. **Create Recipes**: Add ingredients and recipes via settings (or database)
3. **Create Menu**: Plan next week's menu on `/menu`
4. **Check Shopping List**: Go to `/shopping` — should show what to buy
5. **Kitchen Sheets**: Go to `/kitchen` — shows per-Kita ingredient quantities

## 🗂️ Project Structure

```
app/
├── page.tsx                 # Dashboard
├── (routes)/
│   ├── menu/page.tsx       # Menu Planning
│   ├── shopping/page.tsx   # Shopping List
│   ├── inventory/page.tsx  # Inventory Manager
│   ├── kitchen/page.tsx    # Kitchen Prep Sheets
│   ├── optimize/page.tsx   # AI Suggestions
│   └── settings/page.tsx   # System Config

components/
├── ui/                      # Atomic components (Button, Card, etc.)
└── features/               # Domain-specific (MenuEditor, ShoppingListView, etc.)

lib/
├── db/
│   ├── types.ts            # TypeScript interfaces
│   ├── schemas.ts          # Zod validation schemas
│   ├── client.ts           # Supabase client
│   └── services/           # Data access layer
├── calculations.ts         # Shopping list & prep sheet logic
└── ai-optimization.ts      # AI menu optimization
```

## 🎯 Core Workflow

```
1. Menu Plan (what to cook each day)
   ↓
2. Shopping List (automatic calculation)
   ↓
3. Kitchen Prep Sheet (how much per Kita)
   ↓
4. Inventory (track leftovers)
   ↓
5. AI Suggestions (use leftovers better)
```

## 🧪 Test the System

### Scenario: Calculate shopping list

1. Insert a recipe with ingredients:

```sql
INSERT INTO ingredients (name, unit) VALUES
('Pasta', 'g'),
('Tomato Sauce', 'g');

INSERT INTO recipes (name, category, portion_adjustment_category) VALUES
('Pasta with Sauce', 'Hauptspeise', 'Anders');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount_per_portion) VALUES
(1, 1, 100),  -- 100g pasta per portion
(1, 2, 150);  -- 150g sauce per portion

INSERT INTO menu_plan (date, diet_type, recipe_id) VALUES
('2026-03-10', 'vegetarisch', 1);
```

2. Go to `/shopping` with date range including 2026-03-10
3. Should show shopping list with pasta and sauce amounts

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anon key
- `OPENAI_API_KEY` — (Optional) For AI optimization

### Database Tables

Pre-loaded:

- `kitas` — Schools
- `recipes` — Dishes
- `ingredients` — Available ingredients
- `recipe_ingredients` — Recipe compositions
- `menu_plan` — Weekly menus
- `portion_counts` — Children counts

You create:

- `inventory` — Leftovers (auto-created by schema)

## 📚 Full Documentation

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed information

## ⚡ Common Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 🆘 Troubleshooting

**"Database connection error"**

- Check Supabase URL and key in `.env.local`
- Verify schema was created with `lib/db/schema.sql`

**"No shopping list items"**

- Ensure portion counts are populated
- Check menu plan has entries
- Verify recipes have ingredients

**"Build fails with environment error"**

- Create `.env.local` with Supabase credentials
- See `.env.example` for required variables

## 📞 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed docs
2. Review [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for setup validation
3. Check Supabase dashboard for data/connection issues
4. Review browser console for client-side errors

---

**You're ready to use Karotte & Erbse!** 🎉
