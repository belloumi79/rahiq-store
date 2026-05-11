import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader } from 'lucide-react';
import { CATEGORIES as STATIC_CATEGORIES, MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';
import { supabase, mapProductFromSupabase } from '../lib/supabase';

const Marketplace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || Category.ALL;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([Category.ALL]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const initData = async () => {
        setLoading(true);
        try {
            const { data: catData } = await supabase.from('categories').select('name').order('name');
            if (catData && catData.length > 0) {
                setCategories([Category.ALL, ...catData.map((c: any) => c.name)]);
            } else {
                setCategories(STATIC_CATEGORIES);
            }

            let query = supabase.from('products').select('*');
            if (selectedCategory !== Category.ALL) query = query.eq('category', selectedCategory);
            if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

            const { data: prodData, error } = await query;
            if (error) throw error;

            if ((!prodData || prodData.length === 0) && !searchTerm && selectedCategory === Category.ALL) {
                 setProducts(MOCK_PRODUCTS);
            } else {
                 setProducts((prodData || []).map(mapProductFromSupabase));
            }
        } catch (error) {
            setCategories(STATIC_CATEGORIES);
            let localData = MOCK_PRODUCTS;
            if (selectedCategory !== Category.ALL) localData = localData.filter(p => p.category === selectedCategory);
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                localData = localData.filter(p => p.name.toLowerCase().includes(term));
            }
            setProducts(localData);
        } finally {
            setLoading(false);
        }
    };

    const timeoutId = setTimeout(initData, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="px-4 pt-2 pb-20 min-h-screen">
      <div className="sticky top-0 bg-amber-50 z-30 pb-4 pt-2">
        {/* Search Bar */}
        <div className="relative mb-4">
            <input
            type="text"
            placeholder="Rechercher : Miel de thym, Propolis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm bg-white text-gray-900 placeholder-gray-400"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
                <SlidersHorizontal size={18} />
            </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                        selectedCategory === cat
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader className="animate-spin text-amber-600" size={32} /></div>
      ) : (
        <>
          <div className="text-xs text-gray-500 mb-4">{products.length} produit{products.length !== 1 ? 's' : ''}</div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-amber-300" />
                </div>
                <h3 className="font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
                <p className="text-sm text-gray-500">Essayez une autre catégorie ou un autre mot-clé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;