import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, Award, Heart, Plus, Minus, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import supabase, { mapProductFromSupabase } from '../lib/supabase';
import { Product } from '../types';

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const { dir, t } = useLanguage();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const { data } = await supabase
                    .from('products').select('*, categories(name,image,slug)')
                    .eq('id', id).single();
                if (data) {
                    const mapped = mapProductFromSupabase(data);
                    setProduct(mapped);
                    setSelectedImage(mapped.image);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({ ...product, quantity });
            navigate('/cart');
        }
    };

    if (loading) return (
        <div dir={dir} className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-amber-600" size={32} />
        </div>
    );

    if (!product) return (
        <div dir={dir} className="text-center py-16 text-gray-400">{t('marketplace.noProducts')}</div>
    );

    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div dir={dir} className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-amber-600 font-bold transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('common.back')}
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="relative group aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-amber-900/10 border border-amber-50 bg-white cursor-zoom-in">
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                src={selectedImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                        </AnimatePresence>
                        
                        {/* Status Badges Overlay */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                            {product.isOrganic && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="px-4 py-1.5 rounded-full bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-tighter shadow-lg border border-green-400/30"
                                >
                                    BIO
                                </motion.span>
                            )}
                            {product.isArtisanal && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="px-4 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-tighter shadow-lg border border-amber-400/30"
                                >
                                    ARTISANAL
                                </motion.span>
                            )}
                        </div>
                    </div>
                    
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-amber-600 ring-4 ring-amber-100 scale-95 shadow-lg' : 'border-slate-100 hover:border-amber-300 hover:scale-105 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    {selectedImage === img && (
                                        <motion.div 
                                            layoutId="activeThumb"
                                            className="absolute inset-0 bg-amber-600/10"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest">
                            {product.category || 'Miel'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                            <Star size={16} fill="currentColor" />
                            <span className="text-slate-900 font-bold">4.9</span>
                            <span className="text-slate-400 font-medium">(120+ {t('product.reviews')})</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-8">
                        <p className="text-4xl font-black text-amber-600">
                            {product.price} <span className="text-xl font-bold">{t('common.currency')}</span>
                        </p>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <p className="text-green-600 font-bold flex items-center gap-1">
                            <ShieldCheck size={18} /> {t('product.inStock')}
                        </p>
                    </div>

                    <p className="text-lg text-slate-600 leading-relaxed mb-10">
                        {product.description}
                    </p>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-amber-600 text-white rounded-2xl font-bold py-4 flex items-center justify-center gap-3 hover:bg-amber-700 transition-colors"
                            >
                                <ShoppingCart size={24} /> {t('product.addToCart')}
                            </button>

                            <button className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-pink-50 hover:border-pink-200 hover:text-pink-500 transition-all">
                                <Heart size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: <Award className="text-amber-600" />, title: t('product.feat1'), desc: t('product.feat1Desc') },
                            { icon: <Truck className="text-amber-600" />, title: t('product.feat2'), desc: t('product.feat2Desc') },
                        ].map((feat, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                                <div className="flex items-center gap-3 mb-2">
                                    {feat.icon}
                                    <h4 className="font-bold text-amber-900 text-sm">{feat.title}</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;
