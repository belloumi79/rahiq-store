import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchProducts, fetchCategories } from '../lib/supabase';
import { Filter, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const Marketplace: React.FC = () => {
  const { addToCart } = useCart();
  const { t, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        if (prodRes) setProducts(prodRes);
      } catch (e: any) {
        console.error('[Load error]', e.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCat = !selectedCategory || p.category === selectedCategory || p.category_id === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div dir={dir} className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-64 space-y-8">
          <div className="glass-card rounded-3xl p-6 sticky top-32">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={20} className="text-amber-600" />
              <h2 className="font-extrabold text-amber-900">{t('market.filters')}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('market.categories')}</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-all ${!selectedCategory ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-600 hover:bg-amber-50'}`}
                  >
                    {t('market.all')}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-600 hover:bg-amber-50'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search & Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t('market.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium pl-12 w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-amber-100 text-amber-900 font-bold"
            >
              <Filter size={20} /> {t('market.filterBtn')}
            </button>
          </div>

          {/* Mobile Filters Overlay */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] md:hidden bg-black/50 backdrop-blur-sm flex justify-end"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="w-80 bg-white h-full p-6 shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-amber-900">{t('market.filters')}</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-full bg-slate-100"><X size={20} /></button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('market.categories')}</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => { setSelectedCategory(''); setShowMobileFilters(false); }}
                          className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${!selectedCategory ? 'bg-amber-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                        >
                          {t('market.all')}
                        </button>
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.id); setShowMobileFilters(false); }}
                            className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${selectedCategory === cat.id ? 'bg-amber-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-3xl border border-dashed border-amber-200"
            >
              <ShoppingBag size={64} className="mx-auto text-amber-200 mb-4" />
              <h3 className="text-xl font-bold text-amber-900 mb-2">{t('market.noResults')}</h3>
              <p className="text-slate-500">{t('market.tryDifferent')}</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }} className="mt-6 text-amber-600 font-bold hover:underline">
                {t('market.resetFilters')}
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
