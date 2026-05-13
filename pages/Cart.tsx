import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
    const { t, dir } = useLanguage();
    const { items, cartTotal, removeItem, updateQuantity } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div dir={dir} className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-amber-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
                <p className="text-gray-400 text-sm mb-8 text-center">Découvrez nos produits naturels et passez votre première commande !</p>
                <Link to="/" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md">
                    Découvrir les produits
                </Link>
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-6 shadow-lg">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag size={24} />
                        Mon Panier
                    </h1>
                    <p className="text-amber-100 text-sm mt-1">{items.length} article{items.length > 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                {/* Cart Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 last:border-0">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl">🍯</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                                <p className="text-amber-700 font-bold text-sm mt-0.5">{item.price.toFixed(2)} {t.currency || 'TND'}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                                        <Minus size={12} className="text-gray-600" />
                                    </button>
                                    <span className="font-semibold text-gray-800 text-sm w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center justify-center transition-colors">
                                        <Plus size={12} className="text-amber-700" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button onClick={() => removeItem(item.id)}
                                    className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                                    <Trash2 size={14} className="text-red-500" />
                                </button>
                                <p className="font-black text-gray-900 text-sm">{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-5 flex items-center justify-between border border-amber-200">
                    <div>
                        <p className="text-gray-500 text-xs">Total</p>
                        <p className="text-xs text-gray-400">Livraison calculée à la commande</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-amber-700">{cartTotal.toFixed(2)}</p>
                        <p className="text-xs text-amber-600 font-medium">{t.currency || 'TND'}</p>
                    </div>
                </div>

                {/* Checkout Button */}
                <button onClick={() => navigate('/checkout')}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                    Passer la commande
                    <ArrowRight size={16} />
                </button>

                <Link to="/" className="block text-center text-amber-700 font-medium text-sm py-2">
                    ← Continuer mes achats
                </Link>
            </div>
        </div>
    );
};

export default Cart;
