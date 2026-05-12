import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Loader, CheckCircle } from 'lucide-react';

const Checkout: React.FC = () => {
    const { t } = useLanguage();
    const { dir } = useLanguage();
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', notes: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('orders').insert([{
                customer_name: form.fullName,
                customer_email: '',
                customer_phone: form.phone,
                delivery_address: form.address,
                city: form.city,
                notes: form.notes,
                items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))),
                total,
                status: 'pending'
            }]);
            if (error) throw error;
            setSuccess(true);
            clearCart();
        } catch (err: any) { alert(`Erreur: ${err.message}`); }
        finally { setLoading(false); }
    };

    if (success) return (
        <div dir={dir} className="flex flex-col items-center justify-center min-h-64 px-4">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-sm w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">{t.checkout.success}</h2>
                <p className="text-gray-500 text-sm mb-6">{t.checkout.successSub}</p>
                <button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold text-sm w-full">
                    {t.cart.continue}
                </button>
            </div>
        </div>
    );

    return (
        <div dir={dir} className="px-4 py-4 pb-8">
            <h1 className="text-xl font-bold text-amber-900 mb-6">{t.checkout.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{t.checkout.fullName}</label>
                    <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required
                        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{t.checkout.phone}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required
                        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{t.checkout.address}</label>
                    <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required
                        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{t.checkout.city}</label>
                    <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required
                        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{t.checkout.notes}</label>
                    <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                        className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white" />
                </div>
                <div className="bg-amber-50 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-900">{t.cart.total}</span>
                        <span className="text-2xl font-bold text-amber-800">{total.toFixed(2)} {t.common.TND}</span>
                    </div>
                </div>
                <button type="submit" disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <><Loader className="animate-spin" size={18} />{t.checkout.processing}</> : t.checkout.submit}
                </button>
            </form>
        </div>
    );
};

export default Checkout;