import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import supabase from '../lib/supabase';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
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

    const handleLogin = async (e: React.FormEvent) => {
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
        <div dir={dir} className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <RahiqLogo className="w-20 h-20 mx-auto mb-6" showText={false} />
                    <h1 className="text-3xl font-black text-slate-900 mb-2">{t('login.title')}</h1>
                    <p className="text-slate-500 font-medium">{t('login.subtitle')}</p>
                </div>

                <div className="glass-card bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2"
                            >
                                <span className="text-lg">⚠️</span> {error}
                            </motion.div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{t('login.email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-4 text-slate-900 focus:ring-2 focus:ring-amber-500 transition-all"
                                        placeholder="votre@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{t('login.password')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-14 pr-4 text-slate-900 focus:ring-2 focus:ring-amber-500 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-600 text-white rounded-2xl py-4 font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t('login.submit')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                            className="text-sm text-amber-600 hover:underline font-bold">
                            {mode === 'signin' ? t('login.noAccount') : t('login.hasAccount')}
                        </button>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                            <ShieldCheck size={16} /> 100% SECURE CONNECTION
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;