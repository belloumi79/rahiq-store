# Rahiq Store — Boutique de Miel & Produits de la Ruche

<div align="center">
<img width="300" height="300" src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80" alt="Honey Store" />
</div>

**Rahiq Store** est une boutique en ligne tunisienne spécialisée dans la vente de miel et produits de la ruche 100% naturels. Propulsée par une IA et déployée sur Vercel.

## 🐝 Gamme de Produits

- **Miel** — Thym, Romarin, Caroubier, Djebba (BIO)
- **Dérivés** — Propolis, Gelée Royale, Pollen, Hydromel, Bonbons au Miel, Cire d'Abeille
- **Coffrets** — Idées cadeaux

## ✨ Fonctionnalités

- Catalogue produits avec filtres par catégorie
- Recherche en temps réel
- Panier avec persistence localStorage
- Authentification Supabase (email/mot de passe)
- Commandes avec adresses de livraison
- Espace client : historique des commandes
- Dashboard Admin : gestion produits, catégories, commandes

## 🚀 Lancer en local

```bash
cd RahiqStore
npm install
npm run dev
```

## 🌐 Déploiement

Cette app est prête à être déployée sur Vercel :

```bash
npm install -g vercel
vercel --prod
```

## 🛠️ Stack

- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS (CDN)
- **Routing** : React Router v7
- **Backend** : Supabase (Auth + PostgreSQL)
- **Icônes** : Lucide React
- **Fonts** : Google Fonts (Inter, Merriweather)