import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { supabase, mapProductFromSupabase } from '../lib/supabase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import RahiqLogo from '../components/RahiqLogo';

const Marketplace: React.FC = () => {
    const { dir, t } = useLanguage();
    const { addToCart } = useCart();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [catRes, prodRes] = await Promise.all([
                supabase.from('categories').select('*').order('name'),
                supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
            ]);
            if (catRes.data) setCategories(catRes.data);
            if (prodRes.data) setProducts(prodRes.data.map(mapProductFromSupabase));
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat) setSelectedCategory(decodeURIComponent(cat));
    }, [searchParams]);

    const filtered = products.filter(p => {
        const matchCat = !selectedCategory || p.category === selectedCategory;
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div dir={dir} className="min-h-screen bg-amber-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-amber-700 to-amber-500 text-white py-8 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t.nav.marketplace}</h1>
                        <p className="text-amber-100 text-sm mt-1">{t.marketplace.subtitle}</p>
                    </div>
                    <Link to="/">
                        <RahiqLogo className="w-10 h-10" showText={false} />
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={t.marketplace.search}
                        className="flex-1 border border-amber-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 bg-white shadow-sm" />
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                        className="border border-amber-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 bg-white shadow-sm">
                        <option value="">{t.marketplace.allCategories}</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-400">{t.common.loading}</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="mx-auto mb-3 text-gray-300" size={48} />
                        <p className="text-gray-400">{t.marketplace.noProducts}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map(p => (
                            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
