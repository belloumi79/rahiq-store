import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Package, LogOut, Loader } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        if (!authLoading && !user) { navigate('/login'); return; }
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin text-amber-600" size={32} /></div>;
    }

    return (
        <div className="px-4 pt-4 pb-20 min-h-screen bg-amber-50">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={24} /></button>
                <h1 className="text-2xl font-serif font-bold text-amber-900">Mon Compte</h1>
            </div>

            {/* User Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 mb-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <User size={28} className="text-amber-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-amber-900">{user?.name}</h2>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><Mail size={14} /> {user?.email || 'Email non renseigné'}</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="space-y-3">
                <button onClick={() => navigate('/orders')} className="w-full bg-white rounded-xl shadow-sm border border-amber-100 p-4 flex items-center gap-4 hover:bg-amber-50 transition-colors text-left">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><Package size={20} /></div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-amber-900">Mes Commandes</h3>
                        <p className="text-xs text-gray-500">Suivi de mes achats</p>
                    </div>
                </button>

                <button onClick={async () => { await logout(); navigate('/login'); }}
                    className="w-full bg-white rounded-xl shadow-sm border border-red-100 p-4 flex items-center gap-4 hover:bg-red-50 transition-colors text-left">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500"><LogOut size={20} /></div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-red-600">Se déconnecter</h3>
                        <p className="text-xs text-gray-500">Déconnexion de mon compte</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Profile;