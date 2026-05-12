import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Loader, Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import RahiqLogo from '../components/RahiqLogo';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { dir, t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }

        setLoading(true);
        try {
            if (mode === 'signup') {
                const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: email.split('@')[0] } } });
                if (err) throw err;
                setError("Check your email to confirm your account.");
            } else {
                const { error: err } = await supabase.auth.signInWithPassword({ email, password });
                if (err) throw err;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion.');
        } finally { setLoading(false); }
    };

    return (
        <div dir={dir} className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center px-4">
            <div className="absolute top-4 right-4"><LanguageSwitcher /></div>
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <RahiqLogo className="w-24 h-24 mb-4" showText={true} />
                    <h1 className="text-2xl font-bold text-amber-900">{t.login.welcome}</h1>
                    <p className="text-sm text-gray-500 mt-1">{t.login.loginSub}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="bg-amber-50 text-amber-700 text-sm p-3 rounded-lg border border-amber-200">{error}</div>}

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.login.email}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" placeholder="votre@email.com" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.login.password}</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 pr-10" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? <><Loader className="animate-spin" size={18} />{t.common.loading}</> : t.login.submit}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                            className="text-sm text-amber-600 hover:underline font-medium">
                            {mode === 'signin' ? t.login.noAccount : t.login.hasAccount}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;