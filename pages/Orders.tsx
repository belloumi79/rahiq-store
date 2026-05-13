import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Phone, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';

const Orders: React.FC = () => {
    const { user } = useAuth();
    const { dir, t } = useLanguage();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetchOrders = async () => {
            const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if (data) setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, [user]);

    const statusColor = (s: string) => ({
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    }[s] || 'bg-gray-100 text-gray-700');

    return (
        <div className="min-h-screen py-12 px-4 bg-slate-50 relative overflow-hidden" dir={dir}>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">{t('orders.title')}</h1>
                        <p className="text-slate-500 font-bold">{orders.length} commandes au total</p>
                    </div>
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100">
                        <Package size={32} />
                    </div>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 glass-card rounded-[3rem]"
                    >
                        <ShoppingBag size={80} className="mx-auto text-amber-200 mb-6" />
                        <p className="text-slate-800 font-black text-2xl mb-2">{t('orders.empty')}</p>
                        <p className="text-slate-500 font-medium mb-10">{t('orders.emptySub')}</p>
                        <button onClick={() => navigate('/marketplace')} className="btn-premium px-10 py-4">
                            {t('orders.discover')}
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div 
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border border-white/50 group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                                <Calendar size={12} />
                                                {new Date(order.created_at).toLocaleDateString(dir === 'rtl' ? 'ar-TN' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-full shadow-sm ${statusColor(order.status)}`}>
                                            {t(`admin.status.${order.status}` as any) || order.status}
                                        </span>
                                        <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                    <div className="space-y-2">
                                        {order.phone && (
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                                                {order.phone}
                                            </div>
                                        )}
                                        {order.delivery_address && (
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                                <span className="truncate">{order.delivery_address}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end justify-center">
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                            <CreditCard size={12} /> Total de la commande
                                        </div>
                                        <p className="text-2xl font-black text-amber-700">
                                            {parseFloat(order.total || 0).toFixed(2)} <span className="text-sm font-bold">{t('common.currency')}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;