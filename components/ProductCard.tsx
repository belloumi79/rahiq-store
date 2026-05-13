import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

interface ProductCardProps { product: Product; }

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { t } = useLanguage();

    return (
        <motion.div 
            whileHover={{ y: -12 }}
            className="group relative flex flex-col h-full bg-white rounded-[2rem] border border-amber-50 shadow-xl shadow-amber-900/5 overflow-hidden transition-all duration-500"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <Link to={`/product/${product.id}`} className="block h-full">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                </Link>
                
                {/* Overlay actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-400 hover:text-pink-500"
                    >
                        <Heart size={20} />
                    </motion.button>
                </div>

                {/* Badge */}
                {product.is_new && (
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-amber-200">
                            {t('common.new')}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-1">(120+)</span>
                </div>
                
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                            {t('common.price')}
                        </span>
                        <p className="text-2xl font-black text-amber-600 flex items-center gap-1">
                            {product.price} <span className="text-sm font-bold">{t('common.currency')}</span>
                        </p>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart({ ...product, quantity: 1 })}
                        className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 hover:bg-amber-600 hover:shadow-amber-200 transition-all duration-300"
                    >
                        <ShoppingCart size={22} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;