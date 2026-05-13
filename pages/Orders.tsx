import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import { Package, ShoppingBag, Phone, MapPin } from 'lucide-react';

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
        <div className="px-4 py-4" dir={dir}>
            <h1 className="text-xl font-bold text-amber-900 mb-6">{t('orders.title')}</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <Package size={56} className="mx-auto text-amber-200 mb-4" />
                    <p className="text-amber-700 font-bold text-lg mb-2">{t('orders.empty')}</p>
                    <p className="text-amber-500 text-sm mb-6">{t('orders.emptySub')}</p>
                    <button onClick={() => navigate('/marketplace')} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors">
                        {t('orders.discover')}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-bold text-amber-900 text-sm">#{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                                    {t(`orders.status.${order.status}` as any) || order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{order.items}</p>
                            {order.phone && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Phone size={12} /> {order.phone}</div>
                            )}
                            {order.delivery_address && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2"><MapPin size={12} /> {order.delivery_address}</div>
                            )}
                            {order.total && (
                                <p className="text-right font-bold text-amber-800 text-sm mt-2">{parseFloat(order.total).toFixed(3)} TND</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;