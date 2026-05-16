-- Enable RLS for all critical tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com');

-- 2. Categories Policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com');

-- 3. Products Policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com');

-- 4. Orders Policies
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com');
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com');

-- 5. Order Items Policies
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com')
  )
);
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (auth.jwt() ->> 'email' = 'houdaboughalleb591@gmail.com');
