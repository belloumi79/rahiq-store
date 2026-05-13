import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, ShoppingBag, User, Search, ShoppingCart, LayoutDashboard, LogIn, LogOut, Package, Facebook, Instagram, MessageCircle, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import RahiqLogo from './RahiqLogo';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAdmin, user, logout } = useAuth();
  const { dir, t } = useLanguage();

  const isProductPage = location.pathname.startsWith('/product/');
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) { return <Outlet />; }

  const handleAuthAction = async () => {
    if (user) {
        if (confirm(t.nav.logout + ' ?')) { await logout(); navigate('/login'); }
    } else { navigate('/login'); }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-amber-50 max-w-2xl mx-auto md:max-w-4xl border-x border-amber-200 shadow-xl relative" dir={dir}>
      {!isProductPage && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-amber-100 shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <RahiqLogo className="w-14 h-14" showText={false} />
          </Link>

          <div className="flex items-center gap-3">
             <a href="https://www.facebook.com/share/1CVLvRC3BA/" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full transition-colors"
                title="Facebook">
                 <Facebook size={20} />
             </a>
             <LanguageSwitcher />

             {user && (
                 <span className="hidden sm:block text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full truncate max-w-[150px]">
                     {user.name}
                 </span>
             )}

             {isAdmin && (
                <button onClick={() => navigate('/admin')} className="text-amber-700 hover:text-amber-900 bg-amber-100 p-2 rounded-full" title={t.nav.admin}>
                    <LayoutDashboard size={20} />
                </button>
             )}

             {user && (
                <button onClick={() => navigate('/orders')} className="text-gray-500 hover:text-amber-700 relative" title={t.nav.orders}>
                    <Package size={24} />
                </button>
             )}

             <button onClick={() => navigate('/marketplace')} className="text-gray-500 hover:text-amber-700">
                <Search size={24} />
             </button>
             <button onClick={() => navigate('/cart')} className="relative text-gray-500 hover:text-amber-700">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
             </button>

             <button onClick={handleAuthAction}
                className={`p-2 rounded-full transition-colors ${user ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                title={user ? t.nav.logout : t.nav.login}>
                {user ? <LogOut size={20} /> : <LogIn size={20} />}
             </button>
          </div>
        </header>
      )}

      <main className={isProductPage ? '' : 'pt-2'}>
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-50 md:hidden">
        <NavLink to="/" icon={<Home size={24} />} label={t.nav.home} active={location.pathname === '/'} />
        <NavLink to="/marketplace" icon={<ShoppingBag size={24} />} label={t.nav.marketplace} active={location.pathname === '/marketplace'} />
        <div className="relative">
             <NavLink to="/cart" icon={<ShoppingCart size={24} />} label={t.nav.cart} active={location.pathname === '/cart'} />
             {cartCount > 0 && (
                  <span className="absolute top-0 right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
        </div>
        <NavLink to="/profile" icon={<User size={24} />} label={t.nav.account} active={location.pathname === '/profile'} />
      </nav>

      {/* Footer - always visible */}
      <footer className="bg-amber-900 text-amber-100 py-6 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="font-semibold text-amber-50">© 2026 Rahiq Store — Miel & Produits de la Ruche 100% Tunisiens</p>
          <div className="flex justify-center gap-4">
            <a href="https://www.facebook.com/share/1CVLvRC3BA/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Suivre
            </a>
            <a href="https://www.instagram.com/hamza.gammoudi.986?igsh=c3E1Y2NjZDQ3MTh3" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg">
              <Instagram size={18} />
              Instagram
            </a>
            <a href="https://www.tiktok.com/@errahik27152001"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-black to-gray-800 text-white rounded-full text-xs font-medium hover:opacity-90 transition">
              <Smartphone size={16} />
              TikTok
            </a>
            <a href="https://wa.me/21600000000" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-amber-600' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </Link>
);

export default Layout;