import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, Instagram, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-amber-600 text-white text-center py-1.5 text-sm">
        🍯 {t('nav.promo') || 'Livraison gratuite dès 100 TND de commande'}
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🍯</span>
              <span className="font-bold text-xl text-amber-700">Rahiq Store</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className={`flex items-center gap-1.5 text-sm font-medium ${location.pathname === '/' ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>
                <Home size={16} /> {t('nav.home')}
              </Link>
              <Link to="/marketplace" className={`flex items-center gap-1.5 text-sm font-medium ${location.pathname === '/marketplace' ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>
                <ShoppingBag size={16} /> {t('nav.marketplace')}
              </Link>
              <Link to="/cart" className={`flex items-center gap-1.5 text-sm font-medium ${location.pathname === '/cart' ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>
                <ShoppingCart size={16} /> {t('nav.cart')}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ⚙️ {t('nav.admin')}
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/errahik.gammoudi" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-pink-500">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@errahik27152001" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black">
                <span style={{fontSize: 20}}>🎵</span>
              </a>
              <LanguageSwitcher />
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-700">
              <Home size={16} /> {t('nav.home')}
            </Link>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-700">
              <ShoppingBag size={16} /> {t('nav.marketplace')}
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-700">
              <ShoppingCart size={16} /> {t('nav.cart')}
            </Link>
            {user ? (
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-700">
                <User size={16} /> {t('nav.profile')}
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-700">
                <User size={16} /> {t('nav.login')}
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>{children}</main>

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
