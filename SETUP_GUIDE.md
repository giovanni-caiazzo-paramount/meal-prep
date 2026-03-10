# Karotte & Erbse — Catering Automation System

A complete Next.js application for automating catering operations, replacing the Excel workflow used by Katharina's catering company.

## 🎯 Features

✅ **Menu Planning** — Manage weekly menus for multiple diet types (vegetarisch, fleisch, pescetarisch)  
✅ **Automatic Shopping Lists** — Calculate ingredient requirements based on menu and portion data  
✅ **Inventory Management** — Track leftover ingredients and reduce shopping list accordingly  
✅ **Kitchen Preparation Sheets** — Generate daily cooking instructions per school  
✅ **AI Menu Optimization** — Get smart suggestions to use up inventory

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL on Supabase
- **Validation:** Zod for all schemas
- **Styling:** Tailwind CSS 4
- **AI Integration:** OpenAI API + Vercel AI SDK

### Project Structure

```
meal-prep/
├── app/
│   ├── layout.tsx                 # Root layout with header
│   ├── page.tsx                   # Dashboard/Home
│   ├── actions/                   # Server Actions
│   │   ├── menu.actions.ts        # Menu CRUD operations
│   │   ├── calculations.actions.ts # Shopping list & prep sheet calculations
│   │   ├── inventory.actions.ts   # Inventory management
│   │   └── data.actions.ts        # Data fetching
│   ├── (routes)/
│   │   ├── menu/page.tsx          # Menu planning page
│   │   ├── shopping/page.tsx      # Shopping list view
│   │   ├── inventory/page.tsx     # Inventory management
│   │   ├── kitchen/page.tsx       # Kitchen prep sheets
│   │   ├── optimize/page.tsx      # AI optimization
│   │   └── settings/page.tsx      # System settings
│   └── globals.css
├── components/
│   ├── ui/                        # Atomic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── index.ts
│   └── features/                  # Domain-specific components
│       ├── MenuEditor.tsx
│       ├── ShoppingListView.tsx
│       ├── InventoryManager.tsx
│       ├── KitchenPrepSheet.tsx
│       └── index.ts
├── lib/
│   ├── env.ts                     # Environment variables config
│   ├── calculations.ts            # Core calculation logic
│   ├── ai-optimization.ts         # AI menu optimization service
│   └── db/
│       ├── client.ts              # Supabase client initialization
│       ├── types.ts               # TypeScript type definitions
│       ├── schemas.ts             # Zod validation schemas
│       ├── schema.sql             # Database schema
│       └── services/              # Data access layer
│           ├── kitas.service.ts
│           ├── recipes.service.ts
│           ├── ingredients.service.ts
│           ├── menu-plan.service.ts
│           ├── portion-counts.service.ts
│           ├── age-multipliers.service.ts
│           └── inventory.service.ts
└── package.json
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account (free tier available)
- OpenAI API key (for AI optimization feature)

### 2. Installation

```bash
# Clone the repository
git clone <repo-url>
cd meal-prep

# Install dependencies
pnpm install
```

### 3. Database Setup

#### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for provisioning to complete
3. Copy your project URL and anon key

#### B. Set Up Database Schema

1. Go to Supabase SQL Editor
2. Create a new query and paste contents of `lib/db/schema.sql`
3. Run the migration to set up all tables

#### C. Import Initial Data

The database expects these tables to be pre-populated:

- `kitas` — Schools/kindergartens
- `recipes` — Dishes/recipes
- `ingredients` — Ingredient database
- `recipe_ingredients` — Recipe-ingredient relationships
- `menu_plan` — Weekly menu schedule
- `portion_counts` — Children counts per Kita
- `age_multipliers` — Portion adjustments by age

Import your data or use the Supabase UI to insert sample data.

### 4. Environment Configuration

Create `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI (required for AI optimization)
OPENAI_API_KEY=sk-...

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the dashboard.

## 📋 Usage Guide

### Workflow

1. **Setup (One-time)**
   - Configure Kitas in Settings
   - Define portion counts (children per Kita, age group, diet type)
   - Set age multipliers for each ingredient category
   - Create recipes with ingredients
   - Update inventory with current stock

2. **Weekly Process**
   - Go to Menu Planning
   - Select recipes for each diet type for each day
   - Use Shopping List to see what needs to be ordered
   - Update Inventory with new deliveries
   - Use Kitchen Prep Sheets to instruct the cook

3. **Optimization (Optional)**
   - If you have significant leftover ingredients
   - Visit AI Optimization page
   - Review suggestions
   - Approve or reject menu changes

### Core Calculations

The system follows this pipeline for shopping lists:

```
Menu Plan + Recipes + Portion Counts × Age Multipliers
↓
Total Ingredient Requirements per Kita
↓
Aggregate across all Kitas
↓
Subtract Inventory
↓
Shopping List
```

For kitchen prep sheets:

```
Menu Item for Day + Kita Portions × Age Multipliers
↓
Ingredient Quantities per Kita
↓
Kitchen Preparation Sheet (cook-friendly format)
```

## 🔒 Security & SOLID Principles

### SOLID Architecture

- **Single Responsibility:** Separated services (one per domain)
- **Open/Closed:** Component composition with flexible props
- **Liskov Substitution:** Consistent component interfaces
- **Interface Segregation:** Minimal prop passing
- **Dependency Inversion:** Service layer abstraction

### Security Features

- Zod validation on all inputs
- Server Actions for mutations (CSRF protection)
- Supabase Row-Level Security (RLS) ready
- Type-safe throughout TypeScript

## 📊 Data Model

### Key Relationships

```
Kita 1→* PortionCount
Kita 1→* Inventory

Recipe 1→* RecipeIngredient ←* Ingredient
Recipe 1→* MenuItem

MenuItem ←many Menu Plan

PortionCount references: Kita, AgeGroup, DietType
AgeMultiplier references: AgeGroup, IngredientCategory
```

## 🤖 AI Optimization Feature

Uses OpenAI GPT-4 to suggest menu changes that:

- Use leftover inventory efficiently
- Reduce shopping list costs
- Maintain nutritional balance
- Are appropriate for Kita environment

**Never applies changes automatically** — requires user approval.

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📝 Sample Data Structure

### Kitas Table

```sql
INSERT INTO kitas (name, city) VALUES
('Bad Homburg', 'Bad Homburg v.d.H.'),
('Brentano', 'Frankfurt');
```

### Portion Counts

```sql
INSERT INTO portion_counts (kita_id, age_group, diet_type, children_count) VALUES
(1, 'Krippe', 'vegetarisch', 8),
(1, 'Kita', 'vegetarisch', 20),
(1, 'Krippe', 'fleisch', 5);
```

### Age Multipliers

```sql
INSERT INTO age_multipliers (age_group, ingredient_category, multiplier) VALUES
('Krippe', 'Anders', 0.9),
('Kita', 'Anders', 1.0),
('Hort', 'Anders', 1.1);
```

## 🐛 Troubleshooting

### Database Connection Issues

- Check `.env.local` has correct Supabase URL and key
- Verify tables exist: `SELECT * FROM kitas;` in Supabase SQL Editor
- Check RLS policies if queries return no data

### Missing Data

- Ensure portal settings and portion counts are populated
- Verify age multipliers exist for all recipe categories
- Check menu plan has entries for target week

### AI Optimization Not Working

- Verify OpenAI API key in `.env.local`
- Check API key has sufficient credits
- Ensure inventory has significant quantities (>100g)

## 📚 API Documentation

### Server Actions

#### Menu Management

```typescript
updateMenuItem(formData); // Create/update menu item
getMenuPlanForWeek(weekStartDate); // Get week's menu
deleteMenuItem(date, dietType); // Remove menu item
```

#### Calculations

```typescript
getShoppingListForWeek(weekStartDate); // Weekly shopping list
getKitchenPrepSheetForDay(date); // Daily kitchen prep
```

#### Inventory

```typescript
updateInventory(formData); // Update ingredient stock
getInventory(); // Current inventory
deleteInventoryItem(ingredientId); // Remove from inventory
```

## 🤝 Contributing

This system is designed for production use. Follow these principles:

- Keep SOLID architecture
- Add TypeScript types for all new features
- Validate all inputs with Zod
- Write clear, documented code
- Test calculations thoroughly

## 📄 License

Private project for Karotte & Erbse.

## 🎓 Learning Resources

- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Zod Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel AI SDK](https://sdk.vercel.ai)

---

**Ready to use?** Start the development server and visit the dashboard!
