import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import RahiqLogo from '../components/RahiqLogo';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="px-4 pt-6 pb-20 min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={48} className="text-amber-300" />
        </div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Votre panier est vide</h2>
        <p className="text-sm text-gray-500 mb-6">Découvrez nos miels et produits de la ruche.</p>
        <button onClick={() => navigate('/marketplace')} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold">
          Découvrir la boutique
        </button>
        <button onClick={() => navigate('/')} className="mt-3 text-amber-600 text-sm font-medium flex items-center gap-1">
          <ArrowLeft size={16} /> Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-20 min-h-screen bg-amber-50">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white shadow-sm">
          <ArrowLeft size={20} className="text-amber-900" />
        </button>
        <h1 className="text-xl font-bold text-amber-900">Mon Panier</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {items.map((item, index) => (
          <div key={item.id} className={`p-4 flex items-center gap-3 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <img src={item.image || '/placeholder.png'} alt={item.name || 'Produit'} className="w-16 h-16 object-cover rounded-xl" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-amber-900 text-sm truncate">{item.name || 'Produit'}</h3>
              <p className="text-amber-700 font-bold text-sm">{item.price?.toFixed?.(2) ?? '0.00'} TND</p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-amber-100 text-amber-700 w-7 h-7 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold text-gray-700 w-8 text-center">{item.quantity ?? 1}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-amber-100 text-amber-700 w-7 h-7 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                <Trash2 size={16} />
              </button>
              <span className="font-bold text-amber-800 text-sm">{(item.price * (item.quantity || 1)).toFixed(2)} TND</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 text-sm">Nombre d'articles</span>
          <span className="font-semibold text-amber-900">{cartCount}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="font-bold text-amber-900 text-lg">Total</span>
          <span className="text-2xl font-bold text-amber-600">{cartTotal.toFixed(2)} TND</span>
        </div>
      </div>

      <button onClick={() => navigate('/checkout')} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors mb-3">
        <ShoppingBag size={18} /> Passer la commande
      </button>
      <button onClick={() => navigate('/marketplace')} className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
        <ShoppingBag size={18} /> Continuer mes achats
      </button>
      <button onClick={clearCart} className="w-full mt-3 text-red-400 hover:text-red-600 text-xs font-medium text-center py-2 transition-colors">
        Vider le panier
      </button>
    </div>
  );
};

export default Cart;
