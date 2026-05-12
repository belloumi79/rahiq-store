-- ====================================================
-- Migration: Enum → FK categories
-- Exécuter dans Supabase SQL Editor
-- ====================================================

-- 1. Créer products_new avec FK
CREATE TABLE IF NOT EXISTS public.products_new (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    producer TEXT DEFAULT '',
    is_organic BOOLEAN DEFAULT false,
    is_artisanal BOOLEAN DEFAULT false,
    image TEXT DEFAULT '',
    benefits TEXT[] DEFAULT '{}',
    ingredients TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Migrer les données existantes (catégorie texte → UUID)
INSERT INTO public.products_new (id, name, price, description, producer, is_organic, is_artisanal, image, benefits, ingredients, created_at)
SELECT 
    p.id,
    p.name,
    p.price,
    p.description,
    p.producer,
    p.is_organic,
    p.is_artisanal,
    p.image,
    COALESCE(p.benefits, '{}'),
    COALESCE(p.ingredients, '{}'),
    COALESCE(p.created_at, now())
FROM public.products p;

-- 3. Remplacer l'ancienne table
DROP TABLE IF EXISTS public.products CASCADE;
ALTER TABLE public.products_new RENAME TO products;

-- 4. Ajouter les indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- 5. Supprimer l'enum (plus utilisé)
DROP TYPE IF EXISTS public.product_category;

-- ====================================================
-- Donner les droits admin à houdaboughalleb591
-- ====================================================
UPDATE public.profiles SET role = 'admin' WHERE email = 'houdaboughalleb591@gmail.com';

-- 6. Créer les catégories par défaut si vide
INSERT INTO public.categories (name, slug, image) 
SELECT 'Miel', 'miel', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'
WHERE NOT EXISTS (SELECT 1 FROM public.categories LIMIT 1);

INSERT INTO public.categories (name, slug, image) 
SELECT 'Dérivés de la Ruche', 'derivés-de-la-ruche', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600'
WHERE NOT EXISTS (SELECT 1 FROM public.categories OFFSET 1 LIMIT 1);

INSERT INTO public.categories (name, slug, image) 
SELECT 'Coffrets', 'coffrets', 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600'
WHERE NOT EXISTS (SELECT 1 FROM public.categories OFFSET 2 LIMIT 1);
