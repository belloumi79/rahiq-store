import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, Loader, MapPin, Phone, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: user?.name || '', phone: '', address: '', city: '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="px-4 pt-6 pb-20 min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-amber-900 mb-2">Connexion requise</h2>
        <p className="text-sm text-gray-500 mb-4">Veuillez vous connecter pour passer commande.</p>
        <button onClick={() => navigate('/login')} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold">Se connecter</button>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="px-4 pt-6 pb-20 min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 mb-4">Votre panier est vide.</p>
        <button onClick={() => navigate('/marketplace')} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold">Découvrir la boutique</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.full_name || !form.phone || !form.address || !form.city) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total_amount: cartTotal,
        status: 'pending',
        shipping_address: { full_name: form.full_name, phone: form.phone, address: form.address, city: form.city, email: form.email }
      };

      const { error: err } = await supabase.from('orders').insert(orderData);
      if (err) throw err;

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError('Erreur lors de la commande. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="px-4 pt-6 pb-20 min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Commande confirmée !</h2>
        <p className="text-gray-600 mb-2">Merci pour votre commande. Nous vous contacterons sous 24h.</p>
        <p className="text-sm text-amber-600 font-semibold mb-6">Total payé : {cartTotal.toFixed(3)} DT</p>
        <button onClick={() => navigate('/orders')} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold">
            Voir mes commandes
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-8 min-h-screen bg-amber-50">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={24} /></button>
            <h1 className="text-2xl font-serif font-bold text-amber-900">Finaliser la commande</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 mb-4">
            <h2 className="font-bold text-amber-900 mb-3">Récapitulatif</h2>
            <div className="space-y-2 mb-3">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-amber-800">{(item.price * item.quantity).toFixed(3)} DT</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between font-bold text-amber-900 pt-3 border-t border-amber-100">
                <span>Total</span>
                <span className="text-xl text-amber-700">{cartTotal.toFixed(3)} DT</span>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 space-y-4">
            <h2 className="font-bold text-amber-900">Informations de livraison</h2>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nom complet *</label>
                <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" placeholder="Votre nom et prénom" />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Phone size={12} /> Téléphone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" placeholder="+216 XX XXX XXX" />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><MapPin size={12} /> Adresse *</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" placeholder="Rue, appartement, quartier" />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ville *</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" placeholder="Tunis, Sfax, Sousse..." />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Mail size={12} /> Email (optionnel)</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" placeholder="votre@email.com" />
            </div>

            <button type="submit" disabled={loading}
                className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader className="animate-spin" size={18} /> Traitement...</> : 'Confirmer la commande'}
            </button>
        </form>
    </div>
  );
};

export default Checkout;