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
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 min-h-screen bg-amber-50">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={24} /></button>
            <h1 className="text-2xl font-serif font-bold text-amber-900">Mon Panier</h1>
            <span className="ml-auto bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">{cartCount}</span>
        </div>

        <div className="space-y-3 mb-4">
            {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 flex gap-4">
                    <div className="w-20 h-20 bg-amber-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-amber-900 text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{item.producer}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-amber-50 text-amber-700"><Minus size={14} /></button>
                                <span className="px-3 text-sm font-bold text-amber-900">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-amber-50 text-amber-700"><Plus size={14} /></button>
                            </div>
                            <span className="font-bold text-amber-700">{(item.price * item.quantity).toFixed(3)} DT</span>
                        </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1 self-start"><Trash2 size={18} /></button>
                </div>
            ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-5 mb-4">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-amber-100">
                <span className="text-gray-600 font-medium">Sous-total</span>
                <span className="font-bold text-lg text-amber-900">{cartTotal.toFixed(3)} DT</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Offerte</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-amber-100">
                <span className="font-bold text-amber-900">Total</span>
                <span className="text-2xl font-bold text-amber-700">{cartTotal.toFixed(3)} DT</span>
            </div>
        </div>

        <button onClick={() => navigate('/checkout')} className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors mb-2">
            Passer la commande
        </button>
        <button onClick={clearCart} className="w-full py-3 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors">
            Vider le panier
        </button>
    </div>
  );
};

export default Cart;