import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import supabase from '../lib/supabase';
import { Loader, CheckCircle, ShoppingBag, MapPin, Phone, User, FileText } from 'lucide-react';

const Checkout: React.FC = () => {
    const { t } = useLanguage();
    const { dir } = useLanguage();
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', notes: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const { error } = await supabase.from('orders').insert([{
                customer_name: form.fullName,
                customer_email: '',
                customer_phone: form.phone,
                delivery_address: `${form.address}, ${form.city}`,
                city: form.city,
                notes: form.notes,
                items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))),
                total: cartTotal,
                status: 'pending'
            }]);
            if (error) throw error;
            setSuccess(true);
            clearCart();
        } catch (err: any) {
            setErrorMsg(err.message || t.checkout?.error || 'Erreur lors de la commande');
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div dir={dir} className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full border border-amber-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Commande confirmée ! 🎉</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">Merci pour votre commande. Nous vous contacterons bientôt pour confirmer les détails de livraison.</p>
                <button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl font-bold text-sm shadow-md transition-all">
                    Continuer mes achats
                </button>
            </div>
        </div>
    );

    return (
        <div dir={dir} className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-6 shadow-lg">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag size={24} />
                        Finaliser la commande
                    </h1>
                    <p className="text-amber-100 text-sm mt-1">{items.length} article{items.length > 1 ? 's' : ''} dans votre panier</p>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-medium">
                        ❌ {errorMsg}
                    </div>
                )}

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 text-sm">Récapitulatif</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <span className="text-lg">🍯</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900 text-sm">{(item.price * item.quantity).toFixed(2)} TND</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-4 flex items-center justify-between">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="text-2xl font-black text-amber-700">{cartTotal.toFixed(2)} TND</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden space-y-0">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-800 text-sm">Informations de livraison</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                <User size={12} /> Nom complet
                            </label>
                            <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required
                                placeholder="Entrez votre nom"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                <Phone size={12} /> Téléphone
                            </label>
                            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required
                                placeholder="+216 XX XXX XXX"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                <MapPin size={12} /> Adresse
                            </label>
                            <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required
                                placeholder="Rue, quartier..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                <MapPin size={12} /> Ville
                            </label>
                            <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required
                                placeholder="Votre ville"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                <FileText size={12} /> Notes (optionnel)
                            </label>
                            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                                placeholder="Instructions spéciales..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50 resize-none" />
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <button type="submit" disabled={loading || items.length === 0}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                            {loading ? <><Loader className="animate-spin" size={18} /> Traitement en cours...</> : '✅ Confirmer la commande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
