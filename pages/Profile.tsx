import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import { Loader, Check } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { dir, t } = useLanguage();
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', address: '', phone: '' });

    if (!user) { navigate('/login'); return null; }

    const handleSave = async () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="px-4 py-4" dir={dir}>
            <h1 className="text-xl font-bold text-amber-900 mb-6">{t('profile.title')}</h1>
            <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('profile.name')}</label>
                    <input className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('profile.email')}</label>
                    <input className="w-full border border-amber-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400" value={user.email} disabled />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('profile.phone')}</label>
                    <input className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t('profile.address')}</label>
                    <input className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
                <button onClick={handleSave} className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                    {saved ? <><Check size={16} /> {t('profile.saved')}</> : t('profile.save')}
                </button>
            </div>
        </div>
    );
};

export default Profile;