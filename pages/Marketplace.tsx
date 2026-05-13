import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchProducts, fetchCategories } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const Marketplace: React.FC = () => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) setSelectedCategory(catFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        if (catRes) setCategories(catRes);
        if (prodRes) {
          console.log('[DB] products:', prodRes.length, prodRes);
          setProducts(prodRes);
        }
      } catch (e: any) {
        console.error('[Load error]', e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = products.filter(p => {
    // Support both old text category and new UUID category_id
    const matchCat = !selectedCategory || p.category === selectedCategory || p.category_id === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold">{t.nav.marketplace}</h1>
        <p className="text-amber-100 mt-1">🍯 {t.tagline}</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        <input
          type="text"
          placeholder={t.search?.placeholder || 'Rechercher un produit...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl text-sm"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${!selectedCategory ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {t.nav.all || 'Tous'}
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id === selectedCategory ? '' : c.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${c.id === selectedCategory || c.name === selectedCategory ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ShoppingBag size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">{t.marketplace?.noProducts || 'Aucun produit trouvé'}</p>
          <Link to="/" className="text-amber-600 text-sm mt-2 inline-block">← {t.nav.home}</Link>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
