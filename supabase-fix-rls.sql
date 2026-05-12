-- ============================================================
-- RAHIQSTORE — FIX RLS (one-shot)
-- ============================================================

-- Désactiver RLS sur profiles (cause récursion infinie)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_for_authenticated" ON public.profiles;

-- Categories — accessible à tous (lecture) + auth (écriture)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories_select" ON public.categories;
DROP POLICY IF EXISTS "categories_insert" ON public.categories;
DROP POLICY IF EXISTS "categories_update" ON public.categories;
DROP POLICY IF EXISTS "categories_delete" ON public.categories;

CREATE POLICY "categories_public_read" ON public.categories FOR SELECT TO anon USING (true);
CREATE POLICY "categories_auth_write" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_auth_update" ON public.categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "categories_auth_delete" ON public.categories FOR DELETE TO authenticated USING (true);

-- Products — accessible à tous (lecture) + auth (écriture)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_select" ON public.products;
DROP POLICY IF EXISTS "products_insert" ON public.products;
DROP POLICY IF EXISTS "products_update" ON public.products;
DROP POLICY IF EXISTS "products_delete" ON public.products;

CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon USING (true);
CREATE POLICY "products_auth_write" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_auth_update" ON public.products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "products_auth_delete" ON public.products FOR DELETE TO authenticated USING (true);

-- Orders — accessible à tous (lecture) + auth (écriture)
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_select" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;

CREATE POLICY "orders_public_read" ON public.orders FOR SELECT TO anon USING (true);
CREATE POLICY "orders_auth_write" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "orders_auth_update" ON public.orders FOR UPDATE TO authenticated USING (true);

-- Order items
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert" ON public.order_items;

CREATE POLICY "order_items_public_read" ON public.order_items FOR SELECT TO anon USING (true);
CREATE POLICY "order_items_auth_write" ON public.order_items FOR INSERT TO authenticated WITH CHECK (true);
