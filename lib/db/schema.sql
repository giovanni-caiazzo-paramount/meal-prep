/**
 * Database Schema
 * 
 * Run this in Supabase SQL Editor to set up the initial schema.
 * Some tables (kitas, recipes, ingredients, etc.) may already be populated 
 * with data, so you may need to adapt this for your setup.
 */

-- 1. Kitas table
CREATE TABLE IF NOT EXISTS public.kitas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Hauptspeise', 'Nachtisch', 'Rohkost')),
  portion_adjustment_category TEXT NOT NULL CHECK (portion_adjustment_category IN ('Anders', 'Gemüse', 'Suppe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL CHECK (unit IN ('g', 'ml')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Recipe Ingredients junction table
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  amount_per_portion NUMERIC(8, 2) NOT NULL CHECK (amount_per_portion > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recipe_id, ingredient_id)
);

-- 5. Menu Plan table
CREATE TABLE IF NOT EXISTS public.menu_plan (
  date DATE NOT NULL,
  diet_type TEXT NOT NULL CHECK (diet_type IN ('vegetarisch', 'fleisch', 'pescetarisch')),
  recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (date, diet_type)
);

-- 6. Portion Counts table (children per kita, age group, diet type)
CREATE TABLE IF NOT EXISTS public.portion_counts (
  kita_id INTEGER NOT NULL REFERENCES public.kitas(id) ON DELETE CASCADE,
  age_group TEXT NOT NULL CHECK (age_group IN ('Krippe', 'Kita', 'Hort')),
  diet_type TEXT NOT NULL CHECK (diet_type IN ('vegetarisch', 'fleisch', 'pescetarisch')),
  children_count INTEGER NOT NULL CHECK (children_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kita_id, age_group, diet_type)
);

-- 7. Age Multipliers table
CREATE TABLE IF NOT EXISTS public.age_multipliers (
  age_group TEXT NOT NULL CHECK (age_group IN ('Krippe', 'Kita', 'Hort')),
  ingredient_category TEXT NOT NULL CHECK (ingredient_category IN ('Anders', 'Gemüse', 'Suppe')),
  multiplier NUMERIC(4, 2) NOT NULL CHECK (multiplier > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (age_group, ingredient_category)
);

-- 8. Inventory table (NEW - to be created)
CREATE TABLE IF NOT EXISTS public.inventory (
  ingredient_id INTEGER NOT NULL PRIMARY KEY REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_id ON public.recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_menu_plan_recipe_id ON public.menu_plan(recipe_id);
CREATE INDEX IF NOT EXISTS idx_menu_plan_date ON public.menu_plan(date);
CREATE INDEX IF NOT EXISTS idx_portion_counts_kita_id ON public.portion_counts(kita_id);
CREATE INDEX IF NOT EXISTS idx_portion_counts_diet_type ON public.portion_counts(diet_type);

-- Enable Row Level Security (RLS) for multi-tenancy if needed
ALTER TABLE public.kitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
