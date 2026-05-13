import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart size={80} className="mx-auto text-amber-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-500 mb-6">{t('cart.emptyDesc')}</p>
          <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> {t('cart.continue')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingCart size={28} className="text-amber-600" />
          {t('cart.title')}
        </h1>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
              <img src={item.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&h=80&fit=crop'} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
                <p className="text-amber-600 font-bold text-sm">{item.price} TND</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-100 text-gray-600">
                    <Minus size={12} />
                  </button>
                  <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-amber-100 text-gray-600">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center text-lg font-bold mb-4">
            <span className="text-gray-600">{t('cart.total')}</span>
            <span className="text-amber-700 text-xl">{cartTotal} TND</span>
          </div>
          <div className="flex gap-3">
            <button onClick={clearCart} className="btn-outline flex-1 text-sm">{t('cart.clear')}</button>
            <button onClick={() => navigate('/checkout')} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {t('cart.checkout')} →
            </button>
          </div>
          <Link to="/marketplace" className="block text-center text-sm text-gray-500 mt-3 hover:text-amber-600 flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> {t('cart.continue')}
          </Link>
        </div>
      </div>
    </div>
  );
}
