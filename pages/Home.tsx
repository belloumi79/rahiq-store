import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Star, ShieldCheck, Truck, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchCategories, fetchProducts } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
      setCategories(cats || []);
      setIsLoadingCategories(false);
      setProducts(prods || []);
      setIsLoadingProducts(false);
    };
    load();
  }, []);

  return (
    <div dir={dir} className="space-y-12 pb-12 overflow-hidden bg-[#FFFAF0]">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=2000" 
            alt="Honey background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-[#FFFAF0]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-6 shadow-sm">
              🍯 {t('home.heroBadge') || 'Miel 100% Naturel & Tunisien'}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-amber-900 mb-6 leading-tight">
              {t('home.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/marketplace" className="px-8 py-3 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all flex items-center gap-2 group w-full sm:w-auto">
                {t('home.shopNow')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-3 rounded-2xl bg-white border border-amber-100 text-amber-900 font-bold hover:bg-amber-50 transition-all w-full sm:w-auto shadow-sm">
                {t('home.learnMore')}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-amber-400"
        >
          <div className="w-6 h-10 border-2 border-amber-200 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-amber-400 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck size={32} />, title: t('home.feat1Title'), desc: t('home.feat1Desc'), color: 'bg-green-50 text-green-600' },
            { icon: <Award size={32} />, title: t('home.feat2Title'), desc: t('home.feat2Desc'), color: 'bg-amber-50 text-amber-600' },
            { icon: <Truck size={32} />, title: t('home.feat3Title'), desc: t('home.feat3Desc'), color: 'bg-blue-50 text-blue-600' },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl border border-amber-50 shadow-xl shadow-amber-900/5 transition-all"
            >
              <div className={`${feat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-amber-900 mb-2">{t('home.categoriesTitle')}</h2>
              <p className="text-slate-500">{t('home.categoriesSub')}</p>
            </div>
            <Link to="/marketplace" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
              {t('home.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
          
          {isLoadingCategories ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/marketplace?category=${cat.id}`)}
                >
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white font-bold text-xl mb-1">{cat.name}</h3>
                      <p className="text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {t('home.explore')} →
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-amber-900 mb-2">{t('home.productsTitle')}</h2>
            <p className="text-slate-500">{t('home.productsSub')}</p>
          </div>
          <Link to="/marketplace" className="px-6 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition flex items-center gap-2">
            {t('home.viewAll')}
          </Link>
        </div>
        
        {isLoadingProducts ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
