-- ============================================================
-- RahiqStore — Seed Data & Admin Setup
-- (types et tables déjà créés — ne contient QUE les données)
-- ============================================================

-- Définir l'admin (remplace par le user_id de houdaboughalleb591)
update public.profiles
set role = 'admin'
where id = '377f3dad-8b89-471b-bcb5-7a7f592082b0';

-- Vider puis réinsérer les catégories
delete from public.categories;
insert into public.categories (name, slug, description, sort_order) values
  ('Miel', 'miel', 'Miels de cru 100% naturel, collectés dans les montagnes tunisiennes', 1),
  ('Dérivés de la Ruche', 'derivés', 'Propolis, gelée royale, pollen et cire d''abeille', 2),
  ('Coffrets', 'coffrets', 'Coffrets cadeaux pour toutes les occasions', 3),
  ('Cires & Propolis', 'cires-propolis', 'Propolis brute, cire pure et baumes naturels', 4);

-- Vider puis réinsérer les produits
delete from public.products;
insert into public.products (name, slug, category, description, short_description, price, image, producer, origin, weight, is_organic, is_artisanal, is_featured, stock, rating, reviews_count, benefits, ingredients, conservation) values

('Miel de Thym Sauvage', 'miel-thym-sauvage', 'Miel', 
'Notre miel de thym sauvage est récolté dans les collines de la Kroumirie et des Mogods, au nord-ouest de la Tunisie. Ce miel est reconnu pour sa couleur ambre foncé, son arôme puissant et ses nombreuses vertus thérapeutiques.',
'Miel de thym pur, récolté à la main dans les montagnes tunisiennes', 35.000,
'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop',
'Apiculteur Moncef, Kroumirie', 'Kroumirie, Jendouba', '250g',
true, true, true, 45, 4.8, 23,
'{"Antioxydant naturel","Propriétés antibactériennes","Renforce le système immunitaire","Bien-être général"}',
'{"100% Miel de Thym Sauvage"}',
'Conserver dans un endroit frais et sec, à l''abri de la lumière'),

('Miel de Romarin', 'miel-romarin', 'Miel',
'Le miel de romarin de RahiqStore provient des garrigues du cap Bon. Fluid and pale, recognized as one of the finest Tunisian honeys. Traditionally used to support liver function and digestion.',
'Miel de romarin fluide et délicat du Cap Bon', 28.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'Coopérative El Amel, Cap Bon', 'Cap Bon, Nabeul', '250g',
true, true, false, 30, 4.6, 15,
'{"Soutient la digestion","Propriétés hépatiques","Léger et fluide","Goût délicat"}',
'{"100% Miel de Romarin"}',
'Conserver à température ambiante, à l''abri de l''humidité'),

('Miel de Caroubier', 'miel-caroubier', 'Miel',
'Récolté dans les vergers de caroubiers du Sahel tunisien, ce miel sombre et onctueux est l''un des miels les plus riches en minéraux.',
'Miel de caroubier foncé et onctueux du Sahel', 32.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'Apiculteur Sami, Sfax', 'Sahel, Sfax', '250g',
true, true, true, 38, 4.9, 18,
'{"Très riche en fer et minéraux","Propriétés digestives","Texture épaisse et onctueuse","Goût caramélisé"}',
'{"100% Miel de Caroubier"}',
'Conserver dans un endroit frais et sec'),

('Miel de Djebba', 'miel-djebba', 'Miel',
'Le miel de Djebba est protégé par une AOC. Récolté dans les vergers de figues de Djebba, au pied du mont Boujnah, il possède un goût fin et légèrement fruité.',
'Miel AOC de Djebba, figue et fleurs sauvages', 45.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'Apiculteur Local, Djebba', 'Djebba, Béja', '200g',
true, true, true, 20, 5.0, 12,
'{"AOC protégée","Goût fin et fruité","Récolte limitée","Qualité exceptionnelle"}',
'{"100% Miel de Djebba"}',
'Conserver au réfrigérateur après ouverture'),

('Propolis Brune', 'propolis-brun', 'Dérivés de la Ruche',
'Notre propolis brute est récoltée et purifiée naturellement. L''un des antibactériens naturels les plus puissants.',
'Propolis pure à 95%, récoltée sur les ruchers de Kroumirie', 18.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'Apiculteur Moncef, Kroumirie', 'Kroumirie, Jendouba', '50g',
true, true, false, 60, 4.7, 9,
'{"Antibactérien naturel","Renforce l''immunité","Anti-inflammatoire","Antiviral naturel"}',
'{"Propolis pure à 95%, résines d''arbres"}',
'Conserver au réfrigérateur'),

('Gelée Royale Fraîche', 'gelee-royale-fraiche', 'Dérivés de la Ruche',
'Notre gelée royale est récoltée à la main lors des journées printanières. Conservée au froid immédiatement après récolte pour préserver toutes ses propriétés.',
'Gelée royale fraîche, conservation froide garantie', 55.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'Coopérative El Amel, Cap Bon', 'Cap Bon, Nabeul', '10g',
true, true, true, 15, 4.9, 7,
'{"Superfood naturel","Riches en vitamines B","Vitalité et énergie","Qualité premium"}',
'{"100% Gelée Royale Fraîche"}',
'Conserver au réfrigérateur à 2-4°C, consommer sous 7 jours'),

('Pollen de Fleurs Sauvages', 'pollen-fleurs-sauvages', 'Dérivés de la Ruche',
'Notre pollen est récolté grâce à des piège à pollen placés à l''entrée des ruches. Séché naturellement à l''ombre pour préserver les enzymes.',
'Pollen séché à l''ombre, fleurs sauvages de Kroumirie', 22.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'Apiculteur Moncef, Kroumirie', 'Kroumirie, Jendouba', '100g',
true, true, false, 40, 4.5, 11,
'{"Riche en protéines","Vitamines B et E","Renforce les défenses","Énergie naturelle"}',
'{"100% Pollen de Fleurs Sauvages"}',
'Conserver au réfrigérateur'),

('Hydromel Artisanal', 'hydromel-artisanal', 'Coffrets',
'Notre hydromel est préparé artisanalement selon une recette traditionnelle tunisienne. Fermenté lentement pendant 6 mois avec notre miel de thym.',
'Hydromel artisanal 12% vol., fermenté 6 mois', 48.000,
'https://images.unsplash.com/photo-1516550135210-8C816755e1cb?w=600&h=600&fit=crop',
'RahiqStore, Maison du Miel', 'Tunisie', '500ml',
true, true, true, 25, 4.8, 16,
'{"Fermentation artisanale 6 mois","12% alcool","Fabrication traditionnelle","Notes fleuries et miel"}',
'{"Miel de Thym 30%, Eau de source, Levures naturelles"}',
'Conserver horizontalement, à l''abri de la lumière'),

('Coffret Découverte', 'coffret-decouverte', 'Coffrets',
'Le coffret découverte contient 4 mini-pots de nos meilleurs miels : thym, romarin, caroubier et Djebba. Livré dans un coffret en bois élégant.',
'4 mini-pots de 50g + coffret bois + carnet d''origines', 65.000,
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
'RahiqStore', 'Tunisie', '4x50g',
true, true, true, 30, 4.9, 20,
'{"4 origines différentes","Coffret bois élégant","Cadeau idéal","Descriptions détaillées"}',
'{"Miel de Thym, Romarin, Caroubier, Djebba"}',
'Conserver dans un endroit frais et sec'),

('Bonbons au Miel et Propolis', 'bonbons-miel-propolis', 'Dérivés de la Ruche',
'Sucettes naturels à sucer sans modération. Fabriqués avec du miel de thym et de la propolis pure, ces bonbons apaisent les gorges irritées.',
'12 sucettes naturels miel + propolis, apaisants gorge', 12.000,
'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
'RahiqStore, Maison du Miel', 'Tunisie', '12 unités',
true, true, false, 80, 4.6, 14,
'{"Apaise les gorges","100% naturel","Renforce l''immunité","Sans colorants"}',
'{"Miel de Thym 40%, Propolis 5%, Sucre de canne"}',
'Conserver dans un endroit frais et sec');
