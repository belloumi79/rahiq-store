import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, Instagram, Menu, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RahiqLogo } from './RahiqLogo';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-center py-2 text-sm font-medium shadow-md sticky top-0 z-[60]"
      >
        <span className="inline-block animate-pulse mr-2">🍯</span>
        {t('nav.promo') || 'Livraison gratuite dès 100 TND de commande'}
      </motion.div>

      {/* Navbar */}
      <nav className="sticky top-9 z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-3xl px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <RahiqLogo className="w-10 h-10" showText={false} size={40} />
              <span className="font-extrabold text-xl bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent">
                Rahiq Store
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { to: '/', label: t('nav.home'), icon: <Home size={18} /> },
                { to: '/marketplace', label: t('nav.marketplace'), icon: <ShoppingBag size={18} /> },
                { to: '/forum', label: t('forum.title') || 'Forum', icon: <MessageSquare size={18} /> },
                { to: '/cart', label: t('nav.cart'), icon: <ShoppingCart size={18} /> },
              ].map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className={`nav-link flex items-center gap-2 group ${location.pathname === link.to ? 'nav-link-active' : ''}`}
                >
                  <motion.span whileHover={{ y: -2 }} className="text-amber-500 group-hover:text-amber-600">
                    {link.icon}
                  </motion.span>
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all">
                  ⚙️ {t('nav.admin')}
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <motion.a whileHover={{ scale: 1.1 }} href="https://www.instagram.com/errahik.gammoudi" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors">
                  <Instagram size={20} />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1 }} href="https://www.tiktok.com/@errahik27152001" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-black transition-colors">
                  <span className="text-xl">🎵</span>
                </motion.a>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              
              {/* Auth Link */}
              <Link 
                to={user ? '/profile' : '/login'} 
                className={`nav-link flex items-center gap-2 group ${location.pathname === (user ? '/profile' : '/login') ? 'nav-link-active' : ''}`}
              >
                <motion.span whileHover={{ y: -2 }} className="text-amber-500 group-hover:text-amber-600">
                  <User size={18} />
                </motion.span>
                <span className="hidden lg:inline">{user ? t('nav.profile') : t('nav.login')}</span>
              </Link>

              <LanguageSwitcher />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)} 
                className="md:hidden p-2 rounded-xl bg-amber-50 text-amber-700"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2"
            >
              <div className="glass-card rounded-3xl p-4 space-y-2 shadow-2xl">
                {[
                  { to: '/', label: t('nav.home'), icon: <Home size={18} /> },
                  { to: '/marketplace', label: t('nav.marketplace'), icon: <ShoppingBag size={18} /> },
                  { to: '/forum', label: t('forum.title') || 'Forum', icon: <MessageSquare size={18} /> },
                  { to: '/cart', label: t('nav.cart'), icon: <ShoppingCart size={18} /> },
                  ...(user ? [{ to: '/profile', label: t('nav.profile'), icon: <User size={18} /> }] : [{ to: '/login', label: t('nav.login'), icon: <User size={18} /> }])
                ].map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    onClick={() => setMenuOpen(false)} 
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${location.pathname === link.to ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}
                  >
                    {link.icon} <span className="font-bold">{link.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main className="pt-4">{children}</main>

      {/* Premium Footer */}
      <footer className="relative mt-24 pb-12 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="glass-card rounded-[3rem] p-12 shadow-xl border-white/40 bg-white/30 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="space-y-6 lg:col-span-1">
                <Link to="/" className="flex items-center gap-2">
                  <RahiqLogo className="w-12 h-12" showText={false} size={48} />
                  <span className="font-black text-2xl bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent">
                    Rahiq Store
                  </span>
                </Link>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {t('footer.about')}
                </p>
                <div className="flex gap-4 pt-2">
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href="https://www.instagram.com/errahik.gammoudi" target="_blank" className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <Instagram size={20} />
                  </motion.a>
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href="https://www.tiktok.com/@errahik27152001" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <span className="text-lg">🎵</span>
                  </motion.a>
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-6">
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{t('footer.links')}</h4>
                <ul className="space-y-4">
                  {[
                    { to: '/', label: t('nav.home') },
                    { to: '/marketplace', label: t('nav.marketplace') },
                    { to: '/cart', label: t('nav.cart') },
                  ].map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-slate-500 hover:text-amber-600 font-bold text-sm transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-all" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Section */}
              <div className="space-y-6">
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{t('footer.support')}</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="tel:+216" className="text-slate-500 hover:text-amber-600 font-bold text-sm transition-colors">
                      {t('footer.contact')}
                    </a>
                  </li>
                  <li>
                    <p className="text-slate-400 text-xs font-bold mt-2 italic">Tunisia, 2025</p>
                  </li>
                </ul>
              </div>

              {/* Newsletter (Visual Only) */}
              <div className="space-y-6">
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">NEWSLETTER</h4>
                <div className="relative">
                  <input type="email" placeholder="Email..." className="w-full bg-white/50 border-2 border-amber-100 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-amber-400 transition-all" />
                  <button className="absolute right-2 top-2 bottom-2 px-4 bg-amber-600 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-200">OK</button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 pt-8 border-t border-amber-100/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-xs font-bold">
                © 2025 Rahiq Store. {t('footer.rights')}
              </p>
              <div className="flex gap-6">
                <span className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">MADE WITH 🍯 IN TUNISIA</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
