import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Package, Settings, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { dir, t } = useLanguage();
    const navigate = useNavigate();

    if (!user) { navigate('/login'); return null; }

    const signOut = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div dir={dir} className="max-w-4xl mx-auto px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Profile Header */}
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-200">
                        <User size={64} />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{user?.email?.split('@')[0]}</h1>
                        <p className="text-slate-500 font-medium mb-6">{user?.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-bold">
                                <Package size={16} /> 12 {t('profile.orders')}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-bold">
                                <Settings size={16} /> {t('profile.active')}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => signOut()}
                        className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2"
                    >
                        <LogOut size={20} /> {t('profile.logout')}
                    </button>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-amber-600" /> {t('profile.details')}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                                <Mail className="text-slate-400" size={20} />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('profile.email')}</p>
                                    <p className="font-bold text-slate-700">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 opacity-50">
                                <Phone className="text-slate-400" size={20} />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('profile.phone')}</p>
                                    <p className="font-bold text-slate-700">{t('profile.notProvided')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <MapPin size={20} className="text-amber-600" /> {t('profile.address')}
                        </h2>
                        <div className="h-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-2xl">
                            <p className="text-slate-400 text-sm mb-4">{t('profile.noAddress')}</p>
                            <button className="text-amber-600 font-bold hover:underline">
                                + {t('profile.addAddress')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card rounded-3xl p-4">
                    <Link 
                        to="/orders" 
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-amber-50 group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Package size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{t('profile.viewOrders')}</h3>
                                <p className="text-xs text-slate-500">{t('profile.viewOrdersDesc')}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;