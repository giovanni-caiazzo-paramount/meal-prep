# Implementation Checklist

Complete this checklist to fully set up the Karotte & Erbse catering automation system.

## ✅ Phase 1: Environment Setup

- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Create Supabase account
- [ ] Create `.env.local` file
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Verify connection by running `pnpm dev`

## ✅ Phase 2: Database Setup

- [ ] Run schema migration from `lib/db/schema.sql`
- [ ] Verify all tables created:
  - [ ] `kitas`
  - [ ] `recipes`
  - [ ] `ingredients`
  - [ ] `recipe_ingredients`
  - [ ] `menu_plan`
  - [ ] `portion_counts`
  - [ ] `age_multipliers`
  - [ ] `inventory`

## ✅ Phase 3: Import Initial Data

- [ ] Populate `kitas` table (schools/kindergartens)
- [ ] Populate `ingredients` table (all available ingredients)
- [ ] Populate `recipes` table (dishes)
- [ ] Populate `recipe_ingredients` junction table (recipe compositions)
- [ ] Populate `portion_counts` (children per Kita, age group, diet type)
- [ ] Populate `age_multipliers` (portion adjustment factors)

## ✅ Phase 4: Verify Core Features

- [ ] Visit http://localhost:3000 and see dashboard
- [ ] Go to Menu Planning page
- [ ] Verify recipes load in dropdown
- [ ] Create a test menu entry for this week
- [ ] Go to Shopping List page
- [ ] Verify shopping list calculates (may be empty if no portions)
- [ ] Update a portion count in database
- [ ] Shopping list should now show items

## ✅ Phase 5: Inventory Setup

- [ ] Add some test ingredients to `inventory` table
- [ ] Go to Inventory Management page
- [ ] Verify inventory items display
- [ ] Edit an inventory item
- [ ] Shopping list should reflect inventory deductions

## ✅ Phase 6: Kitchen Prep Sheets

- [ ] Go to Kitchen Preparation Sheet page
- [ ] Select a date with menu items
- [ ] Verify ingredients display grouped by Kita
- [ ] Quantities should be calculated correctly

## ✅ Phase 7: Optional - AI Optimization

- [ ] Add `OPENAI_API_KEY` to `.env.local`
- [ ] Go to AI Optimization page
- [ ] Ensure inventory has significant quantities (>100g)
- [ ] Test suggestion generation (currently shows placeholder)
- [ ] Implement suggestion approval workflow

## 🔍 Validation Tests

### Test 1: Calculation Logic

```
1. Set up a simple recipe: Pasta (100g per portion)
2. Set portion count: 1 Kita × 1 age group × 1 diet type = 10 children
3. Add to menu plan for Monday
4. Check shopping list: Should show 1000g Pasta required
5. Add 500g Pasta to inventory
6. Shopping list should show 500g to buy
```

### Test 2: Multiple Kitas

```
1. Create 2 Kitas in database
2. Set different portion counts for each
3. Same recipe for same day, same diet type
4. Shopping list should sum across both Kitas
5. Kitchen prep sheet should show separate entries per Kita
```

### Test 3: Age Multipliers

```
1. Create recipe with adjustment category "Gemüse"
2. Set different multipliers: Krippe=0.9, Kita=1.0, Hort=1.2
3. Add menu item for one Kita with 10 children per age group
4. Shopping list should apply multipliers:
   - Krippe: 10 × 0.9 = 9 portions
   - Kita: 10 × 1.0 = 10 portions
   - Hort: 10 × 1.2 = 12 portions
   - Total: 31 portions
```

## 📋 Data Consistency Checks

- [ ] Every recipe in `recipe_ingredients` exists in `recipes`
- [ ] Every ingredient in `recipe_ingredients` exists in `ingredients`
- [ ] Every kita_id in `portion_counts` exists in `kitas`
- [ ] Every recipe_id in `menu_plan` exists in `recipes`
- [ ] Every ingredient_id in `inventory` exists in `ingredients`
- [ ] Age multipliers cover all combinations of age groups and categories
- [ ] No duplicate entries in junction tables

## 🚀 Production Readiness

- [ ] Test with realistic data volume (100+ recipes, 1000+ ingredients)
- [ ] Verify performance on shopping list calculation
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari)
- [ ] Set up proper error logging/monitoring
- [ ] Configure Supabase backups
- [ ] Document any customizations made
- [ ] Train users on system workflow
- [ ] Set up regular data backups

## 🎯 Features to Implement Later (Optional)

- [ ] User authentication (currently assumes single user)
- [ ] Multi-language support (currently German UI)
- [ ] PDF export for shopping lists and kitchen sheets
- [ ] Supplier/vendor management
- [ ] Cost tracking and reporting
- [ ] Nutritional analysis
- [ ] Allergen management
- [ ] Weekly recipe suggestions beyond AI
- [ ] Mobile app for kitchen staff
- [ ] Real-time collaboration

## 📞 Support

If you encounter issues:

1. Check SETUP_GUIDE.md for detailed instructions
2. Verify database schema with `lib/db/schema.sql`
3. Review environment variables in `.env.local`
4. Check Supabase logs for connection errors
5. Test calculations with known-good data

---

**Status:** Ready to begin Phase 1 ✨
