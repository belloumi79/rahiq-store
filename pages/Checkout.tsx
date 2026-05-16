import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, AlertCircle, ArrowLeft, MapPin, Phone, User, MessageSquare, ShieldCheck, Banknote, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import supabase from '../lib/supabase';

// Validate Tunisian phone number (8 digits, optionally starting with +216 or 216)
const isValidTunisianPhone = (phone: string) => {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Accept: 8 digits, or +21698..., or 21698...
  return /^(\+216|216)?[2-9]\d{7}$/.test(cleaned);
};

export default function Checkout() {
  const { t, dir } = useLanguage();
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', notes: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneBlur = () => {
    if (form.phone && !isValidTunisianPhone(form.phone)) {
      setPhoneError(t('checkout.phoneInvalid'));
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;

    if (!isValidTunisianPhone(form.phone)) {
      setPhoneError(t('checkout.phoneInvalid'));
      return;
    }
    setPhoneError('');
    setStatus('loading');
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: orderError } = await supabase.from('orders').insert({
        full_name: form.name,
        phone: form.phone,
        delivery_address: `${form.address}${form.city ? ', ' + form.city : ''}`,
        delivery_city: form.city || null,
        delivery_phone: form.phone,
        total: cartTotal,
        status: 'pending',
        user_id: user?.id || null,
        notes: form.notes || null,
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
      });
      if (orderError) throw orderError;
      setStatus('success');
      clearCart();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || t('common.error'));
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{t('cart.empty')}</h2>
          <p className="text-slate-500 mb-8">{t('cart.emptySub')}</p>
          <button onClick={() => navigate('/marketplace')} className="btn-premium px-8">
            {t('nav.marketplace')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md glass-card rounded-[2.5rem] p-12 shadow-2xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-green-100"
          >
            <CheckCircle size={56} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">{t('checkout.success')}</h2>
          <p className="text-slate-600 font-medium mb-6 leading-relaxed">{t('checkout.successSub')}</p>
          {/* COD reminder on success */}
          <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-8">
            <Banknote size={20} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-700 text-sm font-bold">{t('checkout.codBadge')}</p>
          </div>
          <button onClick={() => navigate('/marketplace')} className="btn-premium w-full py-4">
            {t('nav.marketplace')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen py-12 px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/cart')} 
            className="flex items-center gap-2 text-slate-500 mb-8 hover:text-amber-600 font-bold text-sm transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> {t('common.back')}
        </motion.button>

        {/* COD Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-5 shadow-lg shadow-amber-200/50 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Banknote size={28} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg">{t('checkout.codBadge')}</p>
            <p className="text-white/80 text-sm font-medium">{t('checkout.codDesc')}</p>
          </div>
          <div className="ms-auto hidden sm:flex items-center gap-1 bg-white/20 rounded-xl px-3 py-1.5">
            <ShieldCheck size={16} className="text-white" />
            <span className="text-white text-xs font-bold">{t('checkout.secure')}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Form */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="glass-card rounded-[2.5rem] p-8 shadow-xl">
                    <h1 className="text-3xl font-black text-slate-900 mb-8">{t('checkout.title')}</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{t('checkout.fullName')}</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder={t('checkout.namePlaceholder')} className="input-premium pl-14" />
                                </div>
                            </div>

                            {/* Phone — highlighted as essential */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-amber-600 uppercase tracking-widest ml-4 flex items-center gap-1.5">
                                  <Phone size={12} />
                                  {t('checkout.phone')}
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                    <input
                                      value={form.phone}
                                      onChange={e => { setForm({ ...form, phone: e.target.value }); setPhoneError(''); }}
                                      onBlur={handlePhoneBlur}
                                      required
                                      placeholder={t('checkout.phonePlaceholder')}
                                      className={`input-premium pl-14 border-2 ${phoneError ? 'border-red-400 focus:border-red-400' : 'border-amber-300 focus:border-amber-500'}`}
                                      type="tel"
                                    />
                                </div>
                                {phoneError ? (
                                  <p className="text-xs font-bold text-red-500 ml-4 flex items-center gap-1">
                                    <AlertCircle size={12} /> {phoneError}
                                  </p>
                                ) : (
                                  <p className="text-xs text-amber-600 font-semibold ml-4 flex items-center gap-1">
                                    <Info size={12} /> {t('checkout.phoneHint')}
                                  </p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{t('checkout.address')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required placeholder={t('checkout.addressPlaceholder')} className="input-premium pl-14" />
                                </div>
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{t('checkout.city')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder={t('checkout.cityPlaceholder')} className="input-premium pl-14" />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{t('checkout.notes')}</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-5 top-5 text-slate-400" size={20} />
                                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder={t('checkout.notesPlaceholder')} className="input-premium pl-14 py-4" />
                                </div>
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2">
                                <AlertCircle size={20} /> {errorMsg}
                            </div>
                        )}

                        <button type="submit" disabled={status === 'loading' || !!phoneError} className="btn-premium w-full py-4 text-lg disabled:opacity-60 flex items-center justify-center gap-3">
                            {status === 'loading' ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>🍯 {t('checkout.submit')}</>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                        <ShieldCheck size={16} /> {t('checkout.secure')}
                    </div>
                </div>
            </motion.div>

            {/* Right Column: Summary */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:pt-4"
            >
                <div className="glass-card rounded-[2.5rem] p-8 shadow-xl bg-white/40 border-white/30 backdrop-blur-sm sticky top-8">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <ShoppingBag size={24} className="text-amber-600" />
                        {t('cart.title')}
                    </h2>
                    <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="relative">
                                <img src={item.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&h=80&fit=crop'} alt={item.name} className="w-16 h-16 object-cover rounded-2xl shadow-sm" />
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 font-bold">{item.price} {t('common.currency')}</p>
                            </div>
                            <p className="text-sm font-black text-amber-700">{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        ))}
                    </div>
                    <div className="space-y-3 pt-6 border-t border-slate-200">
                        <div className="flex justify-between text-slate-500 font-bold text-sm">
                            <span>{t('cart.subtotal')}</span>
                            <span>{cartTotal.toFixed(2)} {t('common.currency')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-bold text-sm">
                            <span>{t('cart.shipping')}</span>
                            <span className="text-green-600">{t('cart.free')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-bold text-sm">
                            <span>{t('checkout.codBadge')}</span>
                            <span className="text-amber-600 flex items-center gap-1"><Banknote size={14} /> Cash</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
                            <span className="text-lg font-black text-slate-800">{t('cart.total')}</span>
                            <span className="text-2xl font-black text-amber-600">{cartTotal.toFixed(2)} <span className="text-sm font-bold">{t('common.currency')}</span></span>
                        </div>
                    </div>
                </div>
            </motion.div>
            </div>
        </div>
    </div>
  );
}
