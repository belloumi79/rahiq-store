-- ============================================================
-- RahiqStore — Schema Supabase
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type product_category as enum (
  'Miel',
  'Dérivés de la Ruche',
  'Coffrets',
  'Cires & Propolis'
);

create type order_status as enum (
  'pending',
  'confirmed',
  'preparing',
  'shipped',
  'delivered',
  'cancelled'
);

create type user_role as enum (
  'customer',
  'admin'
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  role user_role default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  category product_category not null,
  category_id uuid references public.categories(id),
  description text,
  short_description text,
  price numeric(10,3) not null default 0,
  image text,
  images text[] default '{}',
  producer text,
  origin text,
  weight text,
  is_organic boolean default false,
  is_artisanal boolean default true,
  is_featured boolean default false,
  is_available boolean default true,
  stock int default 0,
  rating numeric(2,1) default 0,
  reviews_count int default 0,
  benefits text[] default '{}',
  ingredients text[] default '{}',
  usage text,
  conservation text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  status order_status default 'pending',
  total numeric(10,3) not null default 0,
  delivery_fee numeric(10,3) default 0,
  delivery_address text,
  delivery_city text,
  delivery_phone text,
  delivery_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  product_image text,
  quantity int not null default 1,
  unit_price numeric(10,3) not null,
  total_price numeric(10,3) not null,
  created_at timestamptz default now()
);

-- ============================================================
-- REVIEWS
-- ============================================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- FAVORITES
-- ============================================================
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ============================================================
-- TRIGGERS
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at before update on public.orders
  for each row execute procedure public.handle_updated_at();

create trigger products_updated_at before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

-- Public read for products & categories
create policy "Public read products" on public.products for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read orders own" on public.orders for select using (auth.uid() = user_id);
create policy "Public read order_items own" on public.order_items for select using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));

-- Auth users manage their own profile
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own favorites" on public.favorites for all using (auth.uid() = user_id);
create policy "Users manage own orders" on public.orders for all using (auth.uid() = user_id);
create policy "Users manage own reviews" on public.reviews for all using (auth.uid() = user_id);

-- Admins full access
create policy "Admins full products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins full categories" on public.categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins full orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins full order_items" on public.order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins full reviews" on public.reviews for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins manage profiles" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- SEED DATA — Categories
-- ============================================================
insert into public.categories (name, slug, description, sort_order) values
  ('Miel', 'miel', 'Miels de cru 100% naturel, collectés dans les montagnes tunisiennes', 1),
  ('Dérivés de la Ruche', 'derivés', 'Propolis, gelée royale, pollen et cire d''abeille', 2),
  ('Coffrets', 'coffrets', 'Coffrets cadeaux pour toutes les occasions', 3),
  ('Cires & Propolis', 'cires-propolis', 'Propolis brute, cire pure et baumes naturels', 4);

-- ============================================================
-- SEED DATA — Products
-- ============================================================
insert into public.products (name, slug, category, description, short_description, price, image, producer, origin, weight, is_organic, is_artisanal, is_featured, stock, rating, reviews_count, benefits, ingredients, conservation) values

('Miel de Thym Sauvage', 'miel-thym-sauvage', 'Miel', 
'Notre miel de thym sauvage est récolté dans les collines de la Kroumirie et des Mogods, au nord-ouest de la Tunisie. Ce miel est reconnu pour sa couleur ambre foncé, son arôme puissant et ses nombreuses vertus thérapeutiques. Il est particulièrement apprécié pour ses propriétés antibactériennes et antioxydantes.',
'Miel de thym pur, récolté à la main dans les montagnes tunisiennes', 35.000,
'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop',
'Apiculteur Moncef, Kroumirie', 'Kroumirie, Jendouba', '250g',
true, true, true, 45, 4.8, 23,
'{"Antioxydant naturel","Propriétés antibactériennes","Renforce le système immunitaire","Bien-être général"}',
'{"100% Miel de Thym Sauvage"}',
'Conserver dans un endroit frais et sec, à l''abri de la lumière'),

('Miel de Romarin', 'miel-romarin', 'Miel',
'Le miel de romarin de RahiqStore provient des garrigues du cap Bon. Fluid and pale, it is recognized as one of the finest Tunisian honeys. Traditionally used to support liver function and digestion.',
'Miel de romarin fluide et délicat du Cap Bon', 28.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'Coopérative El Amel, Cap Bon', 'Cap Bon, Nabeul', '250g',
true, true, false, 30, 4.6, 15,
'{"Soutient la digestion","Propriétés hépatiques","Léger et fluide","Goût délicat"}',
'{"100% Miel de Romarin"}',
'Conserver à température ambiante, à l''abri de l''humidité'),

('Miel de Caroubier', 'miel-caroubier', 'Miel',
'Récolté dans les vergers de caroubiers du Sahel tunisien, ce miel sombre et onctueux est l''un des miels les plus riches en minéraux. Son goût caramélisé et sa texture épaisse en font un miel d''exception.',
'Miel de caroubier foncé et onctueux du Sahel', 32.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'Apiculteur Sami, Sfax', 'Sahel, Sfax', '250g',
true, true, true, 38, 4.9, 18,
'{"Très riche en fer et minéraux","Propriétés digestives","Texture épaisse et onctueuse","Goût caramélisé"}',
'{"100% Miel de Caroubier"}',
'Conserver dans un endroit frais et sec'),

('Miel de Djebba', 'miel-djebba', 'Miel',
'Le miel de Djebba est protégé par une AOC (Appellation d''Origine Contrôlée). Récolté dans les vergers de figues de Djebba, au pied dumont Boujnah, il possède un goût fin et légèrement fruité.',
'Miel AOC de Djebba, figue et fleurs sauvages', 45.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'Apiculteur Local, Djebba', 'Djebba, Béja', '200g',
true, true, true, 20, 5.0, 12,
'{"AOC protégée","Goût fin et fruité","Récolte limitée","Qualité exceptionnelle"}',
'{"100% Miel de Djebba"}',
'Conserver au réfrigérateur après ouverture'),

('Propolis Brune', 'propolis-brun', 'Dérivés de la Ruche',
'Notre propolis brute est récoltée et purifiée naturellement. Elle est reconnue comme l''un des抗菌 naturels les plus puissants. Nous la proposons en morceaux de 50g, prête à être mastiquée ou utilisée en infusion.',
'Propolis pure à 95%, récoltée sur les ruchers de Kroumirie', 18.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'Apiculteur Moncef, Kroumirie', 'Kroumirie, Jendouba', '50g',
true, true, false, 60, 4.7, 9,
'{"Antibactérien naturel","Renforce l''immunité","Anti-inflammatoire","Antiviral naturel"}',
'{"Propolis pure à 95%, résines d''arbres"}',
'Conserver au réfrigérateur'),

('Gelée Royale Fraîche', 'gelee-royale-fraiche', 'Dérivés de la Ruche',
'Notre gelée royale est récoltée à la main lors des journées printanières. Elle est conservée au froid immédiatement après récolte pour préserver toutes ses propriétés. Un superfood exceptionnel.',
'Gelée royale fraîche, conservation froide garantie', 55.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'Coopérative El Amel, Cap Bon', 'Cap Bon, Nabeul', '10g',
true, true, true, 15, 4.9, 7,
'{"Superfood naturel","Riches en vitamines B","Vitalité et énergie","Qualité premium"}',
'{"100% Gelée Royale Fraîche"}',
'Conserver au réfrigérateur à 2-4°C, consommer sous 7 jours'),

('Pollen de Fleurs Sauvages', 'pollen-fleurs-sauvages', 'Dérivés de la Ruche',
'Notre pollen est récolté grâce à des piège à pollen placés à l''entrée des ruches. Il provient de fleurs sauvages des montagnes du nord-ouest. Séchage naturel à l''ombre pour préserver les enzymes.',
'Pollen séché à l''ombre, fleurs sauvages de Kroumirie', 22.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'Apiculteur Moncef, Kroumirie', 'Kroumirie, Jendouba', '100g',
true, true, false, 40, 4.5, 11,
'{"Riche en protéines","Vitamines B et E","Renforce les défenses","Énergie naturelle"}',
'{"100% Pollen de Fleurs Sauvages"}',
'Conserver au réfrigérateur'),

('Hydromel Artisanal', 'hydromel-artisanal', 'Coffrets',
'Notre hydromel est préparé artisanalement selon une recette traditionnelle tunisienne. Fabriqué avec notre miel de thym et de l''eau de source, fermenté lentement pendant 6 mois.',
'Hydromel artisanal 12% vol., fermenté 6 mois', 48.000,
'https://images.unsplash.com/photo-1516550135210-8C816755e1cb?w=600&h=600&fit=crop',
'RahiqStore, Maison du Miel', 'Tunisie', '500ml',
true, true, true, 25, 4.8, 16,
'{"Fermentation artisanale 6 mois","12% alcool","Fabrication traditionnelle","Notes fleuries et miel"}',
'{"Miel de Thym 30%, Eau de source, Levures naturelles"}',
'Conserver horizontalement, à l''abri de la lumière'),

('Coffret Découverte', 'coffret-decouverte', 'Coffrets',
'Le coffret découverte RahiqStore contient 4 mini-pots de nos meilleurs miels : thym, romarin, caroubier et Djebba. Livré dans un coffret en bois élégant avec descriptions et origines.',
'4 mini-pots de 50g + coffret bois + carnet d''origines', 65.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'RahiqStore', 'Tunisie', '4x50g',
true, true, true, 30, 4.9, 20,
'{"4 origines différentes","Coffret bois élégant","Cadeau idéal","Descriptions détaillées"}',
'{"Miel de Thym, Romarin, Caroubier, Djebba"}',
'Conserver dans un endroit frais et sec'),

('Bonbons au Miel & Propolis', 'bonbons-miel-propolis', 'Dérivés de la Ruche',
'Sucettes naturels à sucer sans modération. Fabriqués avec du miel de thym et de la propolis pure, ces bonbons apaisent les gorges irritées et renforcent les défenses naturelles.',
'12 sucettes naturels miel + propolis, apaisants gorge', 12.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'RahiqStore, Maison du Miel', 'Tunisie', '12 unités',
true, true, false, 80, 4.6, 14,
'{"Apaise les gorges","100% naturel","Propice au，系统immune","Sans colorants"}',
'{"Miel de Thym 40%, Propolis 5%, Sucre de canne"}',
'Conserver dans un endroit frais et sec');
