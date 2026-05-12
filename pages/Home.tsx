import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase, mapProductFromSupabase } from '../lib/supabase';
import { Product } from '../types';
import { Star, ShoppingCart, Leaf, Award } from 'lucide-react';
import RahiqLogo from '../components/RahiqLogo';

const Home: React.FC = () => {
    const { addToCart } = useCart();
    const { isAdmin } = useAuth();
    const { dir, t } = useLanguage();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
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

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    const categoryEmoji: Record<string, string> = {
        'Miel': '🌻', 'miel': '🌻',
        'Dérivés': '🍯', 'Dérivés de la Ruche': '🍯', 'dérivés': '🍯',
        'Coffrets': '🎁', 'coffrets': '🎁',
    };

    return (
        <div dir={dir}>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 px-6 py-10 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-8 w-20 h-20 bg-amber-400 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 right-8 w-32 h-32 bg-orange-300 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <RahiqLogo className="w-32 h-32 mb-4" showText={false} />
                    <h1 className="text-3xl font-bold text-amber-900 mb-3 font-serif leading-tight whitespace-pre-line">{t.home.heroTitle}</h1>
                    <p className="text-amber-700 text-sm mb-6 max-w-xs mx-auto leading-relaxed">{t.home.heroSub}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => navigate('/marketplace')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors shadow-lg">
                            {t.home.cta}
                        </button>
                        {isAdmin && (
                            <button onClick={() => navigate('/admin')}
                                className="bg-amber-900 hover:bg-amber-950 text-amber-100 px-6 py-3 rounded-full font-semibold text-sm transition-colors">
                                {t.nav.admin}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                        <span className="flex items-center gap-1 text-xs text-amber-700 font-medium"><Leaf size={14} className="text-green-600" />{t.home.organic}</span>
                        <span className="flex items-center gap-1 text-xs text-amber-700 font-medium"><Award size={14} className="text-amber-600" />{t.home.fromTunisia}</span>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="px-4 py-6">
                <h2 className="text-lg font-bold text-amber-900 mb-4">{t.home.categories}</h2>
                {loading ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={`/marketplace?cat=${encodeURIComponent(cat.name)}`}
                                className="bg-white rounded-2xl overflow-hidden text-center shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-amber-50 overflow-hidden">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">{categoryEmoji[cat.name] || '🍯'}</div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <span className="text-xs font-semibold text-amber-800">{cat.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* All Products */}
            <section className="px-4 pb-8">
                <h2 className="text-lg font-bold text-amber-900 mb-4">{t.home.featured}</h2>
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>{t.marketplace.noProducts}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {products.map((product) => (
                            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-md transition-all cursor-pointer">
                                <div className="aspect-square bg-amber-50 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3">
                                    <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">{product.category}</span>
                                    <h3 className="font-semibold text-amber-900 text-sm mt-1 leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-amber-800">{product.price} TND</span>
                                        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                            className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-1.5 rounded-full transition-colors">
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
