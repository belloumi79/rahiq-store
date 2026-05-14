import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import supabase from '../lib/supabase';

export default function Checkout() {
  const { t } = useLanguage();
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: 'Tunis', notes: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const { error: orderError } = await supabase.from('orders').insert({
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
        city: form.city,
        total: cartTotal,
        status: 'pending',
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
      });
      if (orderError) throw orderError;
      setStatus('success');
      clearCart();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Une erreur est survenue');
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto text-amber-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-4">{t('cart.empty')}</h2>
          <button onClick={() => navigate('/marketplace')} className="btn-primary">
            ← {t('cart.continue')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('checkout.success')}</h2>
          <p className="text-gray-600 mb-6">{t('checkout.successSub')}</p>
          <button onClick={() => navigate('/marketplace')} className="btn-primary">
            {t('nav.marketplace')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-1 text-gray-500 mb-4 hover:text-amber-600 text-sm">
          <ArrowLeft size={16} /> {t('cart.back')}
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('checkout.title')}</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">{t('checkout.summary')}</h2>
          <div className="space-y-2 mb-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=48&h=48&fit=crop'} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">× {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-amber-700">{item.price * item.quantity} TND</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-700">{t('cart.total')}</span>
            <span className="font-bold text-xl text-amber-700">{cartTotal} TND</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">{t('checkout.info')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.fullName')} *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Votre nom complet" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.phone')} *</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+216 XX XXX XXX" className="input-field" type="tel" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.address')} *</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required placeholder="Rue, quartier" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.city')}</label>
            <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-field">
              {['Tunis','Sfax','Sousse','Kairouan','Bizerte','Gabès','Ariana','Ben Arous','Mannouba','Nabeul'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.notes')}</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder={t('checkout.notes')} className="input-field" />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60">
            {status === 'loading' ? t('checkout.processing') : `🍯 ${t('checkout.submit')}`}
          </button>
        </form>
      </div>
    </div>
  );
}
