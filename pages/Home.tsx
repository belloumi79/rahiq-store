import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchCategories, fetchProducts } from '../lib/supabase';

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
      setCategories(cats || []);
      setProducts(prods || []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold">{t('home.heroTitle')}</h1>
        <p className="text-amber-100 mt-2">{t('home.heroSub')}</p>
        <Link to="/marketplace" className="inline-block mt-4 bg-white text-amber-600 px-6 py-2 rounded-full font-semibold text-sm hover:bg-amber-50 transition">
          {t('home.cta')}
        </Link>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('home.categories')}</h2>
        {categories.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('admin.noCategories')}</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {categories.map(c => (
              <Link key={c.id} to={`/marketplace?category=${c.id}`} className="bg-white rounded-2xl p-4 shadow-sm text-center hover:shadow-md transition">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-2 flex items-center justify-center text-2xl">
                    {c.name?.charAt(0) || '🍯'}
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('home.featured')}</h2>
        {products.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('admin.noProducts')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 6).map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                {p.image && (
                  <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                )}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{p.name}</h3>
                  <p className="text-amber-600 font-bold text-sm">{p.price} {t('common.currency')}</p>
                  <button
                    onClick={() => addToCart({ ...p, quantity: 1 })}
                    className="mt-2 w-full bg-amber-500 text-white text-xs py-1.5 rounded-lg font-medium"
                  >
                    {t('product.addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
