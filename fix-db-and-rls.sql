-- 1. CLEANUP RLS POLICIES (Remove redundant ones)
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('products', 'categories', 'orders', 'order_items')) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 2. RECREATE CLEAN RLS POLICIES
-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO public 
USING ((auth.jwt() ->> 'email'::text) = 'houdaboughalleb591@gmail.com'::text);

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO public 
USING ((auth.jwt() ->> 'email'::text) = 'houdaboughalleb591@gmail.com'::text);

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO public 
USING (auth.uid() = user_id OR (auth.jwt() ->> 'email'::text) = 'houdaboughalleb591@gmail.com'::text);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO public 
USING ((auth.jwt() ->> 'email'::text) = 'houdaboughalleb591@gmail.com'::text);

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT TO public 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR (auth.jwt() ->> 'email'::text) = 'houdaboughalleb591@gmail.com'::text)));

-- 3. DATA NORMALIZATION AND TRANSLATION
-- Move Arabic content to correct columns
UPDATE public.categories
SET 
    name_ar = CASE 
        WHEN id = '619facea-f52c-4c6b-910a-08a05c4b6ec8' THEN 'عسل طبيعي حر'
        WHEN id = '1d3921de-7904-46b1-9cea-d9e75f5f9fe1' THEN 'باقات هدايا'
        WHEN id = '5bd1bd8e-9f6f-4872-a0a7-6332279ab531' THEN 'منتوجات الخلية'
        ELSE COALESCE(name_ar, name_fr) 
    END,
    name_fr = CASE 
        WHEN id = '619facea-f52c-4c6b-910a-08a05c4b6ec8' THEN 'Miel Naturel Pur'
        WHEN id = '1d3921de-7904-46b1-9cea-d9e75f5f9fe1' THEN 'Coffrets Cadeaux'
        WHEN id = '5bd1bd8e-9f6f-4872-a0a7-6332279ab531' THEN 'Produits de la Ruche'
        ELSE name_fr
    END,
    name_en = CASE 
        WHEN id = '619facea-f52c-4c6b-910a-08a05c4b6ec8' THEN 'Pure Natural Honey'
        WHEN id = '1d3921de-7904-46b1-9cea-d9e75f5f9fe1' THEN 'Gift Boxes'
        WHEN id = '5bd1bd8e-9f6f-4872-a0a7-6332279ab531' THEN 'Beehive Products'
        WHEN id = 'c467f526-59a3-46f4-950f-f11748443865' THEN 'Hive Derivatives'
        WHEN id = '4c417b7f-4569-4fc7-aa69-21e89481a959' THEN 'Waxes & Propolis'
        ELSE name_en
    END;

UPDATE public.products
SET 
    name_ar = name_fr,
    description_ar = description_fr
WHERE name_fr ~ '[\u0600-\u06FF]';

UPDATE public.products
SET 
    name_fr = CASE 
        WHEN id = 'a77f37cd-0cf4-47a4-af59-007de20d8d4a' THEN 'Miel de Montagne'
        WHEN id = '93e4d4c1-c42f-400b-8997-6643dc7633b6' THEN 'Mélange Immunité'
        WHEN id = '59b999db-cf07-44dd-be44-de083a24bc10' THEN 'Mélange Allergie'
        WHEN id = '0cd40cde-f4e9-4ec9-9424-b9e0247df29b' THEN '100g Pollen'
        WHEN id = 'd76de96c-3fd9-4d43-8eb5-5a8dfd4bec71' THEN '10g Propolis'
        WHEN id = 'a13cfda0-2fa4-4792-bc63-567e08db5cba' THEN '100g Rayon de Miel'
        WHEN id = '8a1e3162-d0d6-4908-9ac2-8046c2dfcb93' THEN 'Miel de Forêt (Djebbah)'
        WHEN id = 'ae46b04d-f9b4-45ec-9f14-9b0851446bec' THEN '10g Gelée Royale'
        WHEN id = 'ce81e178-5abf-44f2-bdba-594671558a28' THEN 'Miel de Roquette'
        WHEN id = '076916b8-1ef8-48ff-8187-7632ed719920' THEN 'Miel de fleurs diverses'
        ELSE name_fr
    END,
    name_en = CASE 
        WHEN id = 'a77f37cd-0cf4-47a4-af59-007de20d8d4a' THEN 'Mountain Honey'
        WHEN id = '93e4d4c1-c42f-400b-8997-6643dc7633b6' THEN 'Immunity Blend'
        WHEN id = '59b999db-cf07-44dd-be44-de083a24bc10' THEN 'Allergy Blend'
        WHEN id = '0cd40cde-f4e9-4ec9-9424-b9e0247df29b' THEN '100g Bee Pollen'
        WHEN id = 'd76de96c-3fd9-4d43-8eb5-5a8dfd4bec71' THEN '10g Propolis'
        WHEN id = 'a13cfda0-2fa4-4792-bc63-567e08db5cba' THEN '100g Honeycomb'
        WHEN id = '8a1e3162-d0d6-4908-9ac2-8046c2dfcb93' THEN 'Forest Honey (Djebbah)'
        WHEN id = 'ae46b04d-f9b4-45ec-9f14-9b0851446bec' THEN '10g Royal Jelly'
        WHEN id = 'ce81e178-5abf-44f2-bdba-594671558a28' THEN 'Arugula Honey'
        WHEN id = '076916b8-1ef8-48ff-8187-7632ed719920' THEN 'Mixed Flowers Honey'
        ELSE name_en
    END,
    description_fr = CASE 
        WHEN id = 'a77f37cd-0cf4-47a4-af59-007de20d8d4a' THEN 'Naturel et Pur'
        WHEN id = '93e4d4c1-c42f-400b-8997-6643dc7633b6' THEN 'Mélange pour renforcer l''immunité'
        WHEN id = '59b999db-cf07-44dd-be44-de083a24bc10' THEN 'Mélange efficace contre les allergies'
        WHEN id = '0cd40cde-f4e9-4ec9-9424-b9e0247df29b' THEN 'Naturel de la ruche'
        WHEN id = 'd76de96c-3fd9-4d43-8eb5-5a8dfd4bec71' THEN 'Naturel du travail des abeilles'
        WHEN id = 'a13cfda0-2fa4-4792-bc63-567e08db5cba' THEN 'Rayon de miel pur'
        WHEN id = '8a1e3162-d0d6-4908-9ac2-8046c2dfcb93' THEN 'Miel bio 100% naturel'
        WHEN id = 'ae46b04d-f9b4-45ec-9f14-9b0851446bec' THEN 'Naturel de la ruche'
        WHEN id = 'ce81e178-5abf-44f2-bdba-594671558a28' THEN 'Naturel et Pur'
        WHEN id = '076916b8-1ef8-48ff-8187-7632ed719920' THEN 'Miel pur et naturel'
        ELSE description_fr
    END,
    description_en = CASE 
        WHEN id = 'a77f37cd-0cf4-47a4-af59-007de20d8d4a' THEN 'Natural and Pure'
        WHEN id = '93e4d4c1-c42f-400b-8997-6643dc7633b6' THEN 'Blend for immunity boost'
        WHEN id = '59b999db-cf07-44dd-be44-de083a24bc10' THEN 'Highly effective allergy relief blend'
        WHEN id = '0cd40cde-f4e9-4ec9-9424-b9e0247df29b' THEN 'Natural from the hive'
        WHEN id = 'd76de96c-3fd9-4d43-8eb5-5a8dfd4bec71' THEN 'Natural bee work'
        WHEN id = 'a13cfda0-2fa4-4792-bc63-567e08db5cba' THEN 'Pure honeycomb'
        WHEN id = '8a1e3162-d0d6-4908-9ac2-8046c2dfcb93' THEN '100% organic natural honey'
        WHEN id = 'ae46b04d-f9b4-45ec-9f14-9b0851446bec' THEN 'Natural from the hive'
        WHEN id = 'ce81e178-5abf-44f2-bdba-594671558a28' THEN 'Natural and Pure'
        WHEN id = '076916b8-1ef8-48ff-8187-7632ed719920' THEN 'Pure and natural honey'
        ELSE description_en
    END;
