-- ============================================================
-- Migration : Champs multilingues pour catégories et produits
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- Colonnes multilingues pour les catégories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS name_fr text,
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS description_ar text,
  ADD COLUMN IF NOT EXISTS description_fr text,
  ADD COLUMN IF NOT EXISTS description_en text;

-- Colonnes multilingues pour les produits
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS name_fr text,
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS description_ar text,
  ADD COLUMN IF NOT EXISTS description_fr text,
  ADD COLUMN IF NOT EXISTS description_en text;

-- Initialiser name_fr avec la valeur name existante (supposée être en français)
UPDATE public.categories SET name_fr = name WHERE name_fr IS NULL;
UPDATE public.products SET name_fr = name WHERE name_fr IS NULL;
UPDATE public.products SET description_fr = description WHERE description_fr IS NULL;

-- Colonnes pour les commandes (si elles n'existent pas déjà)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS notes text;
