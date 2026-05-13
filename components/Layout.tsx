import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, Instagram, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
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
              <motion.span 
                whileHover={{ rotate: 20, scale: 1.2 }}
                className="text-2xl"
              >
                🍯
              </motion.span>
              <span className="font-extrabold text-xl bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent">
                Rahiq Store
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { to: '/', label: t('nav.home'), icon: <Home size={18} /> },
                { to: '/marketplace', label: t('nav.marketplace'), icon: <ShoppingBag size={18} /> },
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

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-bold text-amber-50 text-lg mb-2">🍯 Rahiq Store</div>
              <p>{t('footer.about') || 'Votre miel 100% Tunisien, naturel et authentique.'}</p>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-2">{t('footer.links') || 'Liens'}</div>
              <div className="space-y-1">
                <Link to="/" className="block hover:text-white">{t('nav.home')}</Link>
                <Link to="/marketplace" className="block hover:text-white">{t('nav.marketplace')}</Link>
                <Link to="/cart" className="block hover:text-white">{t('nav.cart')}</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold text-amber-50 mb-2">{t('footer.follow') || 'Suivez-nous'}</div>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/errahik.gammoudi" target="_blank" rel="noreferrer" className="hover:text-pink-400">
                  <Instagram size={20} />
                </a>
                <a href="https://www.tiktok.com/@errahik27152001" target="_blank" rel="noreferrer" className="hover:text-white">
                  🎵 TikTok
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 pt-4 border-t border-amber-800 text-xs">
            © 2025 Rahiq Store. {t('footer.rights') || 'Tous droits réservés.'}
          </div>
        </div>
      </footer>
    </div>
  );
}
