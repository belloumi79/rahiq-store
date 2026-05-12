import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { supabase, mapProductFromSupabase } from '../lib/supabase';
import { Product } from '../types';
import { ArrowLeft, ShoppingBag, Leaf, Award, CheckCircle, Loader } from 'lucide-react';

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const { dir, t } = useLanguage();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        supabase
            .from('products').select('*, categories(name,image,slug)')
            .eq('id', id).single()
            .then(({ data }) => { if (data) setProduct(mapProductFromSupabase(data)); })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div dir={dir} className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-amber-600" size={32} />
        </div>
    );

    if (!product) return (
        <div dir={dir} className="text-center py-16 text-gray-400">{t.marketplace.noProducts}</div>
    );

    return (
        <div dir={dir} className="min-h-screen bg-amber-50">
            <div className="max-w-4xl mx-auto px-3 py-4">
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-amber-700 text-sm font-medium mb-4 hover:underline">
                    <ArrowLeft size={16} />{t.common.back}
                </button>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-amber-100">
                    <div className="grid md:grid-cols-2">
                        <div className="aspect-square bg-amber-100">
                            {product.image ? (
                                <img src={product.image} alt={product.name}
                                    className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-amber-300">
                                    <ShoppingBag size={64} />
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex flex-col">
                            <div className="flex-1">
                                {product.category && (
                                    <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
                                        {(product as any).categories?.name || product.category}
                                    </span>
                                )}
                                <h1 className="text-2xl font-bold text-amber-900 mt-1 mb-3">{product.name}</h1>
                                {product.producer && (
                                    <p className="text-sm text-gray-500 mb-3">🏺 {product.producer}</p>
                                )}
                                <div className="flex gap-2 mb-4">
                                    {product.isOrganic && (
                                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                            <Leaf size={12} />{t.product.organic}
                                        </span>
                                    )}
                                    {product.isArtisanal && (
                                        <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                                            <Award size={12} />{t.product.artisanal}
                                        </span>
                                    )}
                                </div>
                                {product.description && (
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>
                                )}
                                {product.benefits && product.benefits.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-amber-800 mb-2">{t.product.benefits}</h3>
                                        <ul className="space-y-1">
                                            {product.benefits.map((b, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />{b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-amber-100 pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl font-bold text-amber-700">{product.price} <span className="text-lg">TND</span></span>
                                    <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-1">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-amber-700 font-bold text-lg hover:bg-amber-100 rounded-lg">−</button>
                                        <span className="w-8 text-center font-bold text-amber-900">{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-amber-700 font-bold text-lg hover:bg-amber-100 rounded-lg">+</button>
                                    </div>
                                </div>
                                <button onClick={() => { addItem({ ...product, quantity }); navigate('/cart'); }}
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <ShoppingBag size={18} />{t.product.addToCart}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
