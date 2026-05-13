import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const { dir, t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div dir={dir} className="px-4 py-4 pb-24">
            <h1 className="text-xl font-bold text-amber-900 mb-4">{t.cart.title}</h1>

            {items.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🍯</div>
                    <p className="text-amber-700 font-semibold text-lg">{t.cart.empty}</p>
                    <p className="text-gray-400 text-sm mt-1">{t.cart.emptySub}</p>
                    <button onClick={() => navigate('/marketplace')}
                        className="mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 mx-auto">
                        <ShoppingBag size={18} />{t.cart.continue}
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-amber-100">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-amber-900 text-sm truncate">{item.name}</p>
                                    <p className="text-amber-700 font-bold text-sm">{item.price} {t.cart.currency}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold hover:bg-amber-200">−</button>
                                        <span className="text-sm font-medium text-gray-700 w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold hover:bg-amber-200">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                    <span className="font-bold text-amber-800 text-sm">{(item.price * item.quantity).toFixed(2)} {t.cart.currency}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-amber-900">{t.cart.total}</span>
                            <span className="text-2xl font-bold text-amber-800">{total.toFixed(2)} {t.cart.currency}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button onClick={() => navigate('/checkout')}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                            {t.cart.checkout}
                        </button>
                        <button onClick={() => navigate('/marketplace')}
                            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
                            <ShoppingBag size={18} />{t.cart.continue}
                        </button>
                        <button onClick={clearCart} className="text-red-400 text-xs hover:underline text-center">
                            {t.cart.remove} {'panier'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;