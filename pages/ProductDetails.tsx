import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Star, ShoppingCart, Leaf, Award, Truck, ShieldCheck, Plus, Minus, Check } from 'lucide-react';
import RahiqLogo from '../components/RahiqLogo';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    setProduct(found || null);
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center p-8">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RahiqLogo className="w-16 h-16 opacity-50" showText={false} />
            </div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">Produit introuvable</h2>
            <button onClick={() => navigate('/marketplace')} className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold">
                Retour à la boutique
            </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
        {/* Back Button */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-amber-100 shadow-sm">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-amber-50 rounded-full transition-colors">
                <ArrowLeft size={22} className="text-amber-800" />
            </button>
            <span className="font-semibold text-amber-900 truncate">{product.name}</span>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-72 bg-amber-100 flex items-center justify-center overflow-hidden">
            {!imgError ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
                <div className="opacity-40"><RahiqLogo className="w-32 h-32" showText={false} /></div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
                {product.isOrganic && <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">BIO</span>}
                {product.isArtisanal && <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Artisan</span>}
            </div>
        </div>

        <div className="px-4 -mt-6 relative z-10">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-amber-900 font-serif leading-tight mb-1">{product.name}</h1>
                            <p className="text-sm text-gray-500">{product.producer}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-bold">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviews})</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-bold text-amber-700 mb-4">{product.price.toFixed(3)} <span className="text-base font-medium">DT</span></div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>

                    {/* Benefits */}
                    <div className="mb-5">
                        <h3 className="font-bold text-xs uppercase text-amber-800 mb-2 flex items-center gap-1"><Leaf size={12} /> Bienfaits</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.benefits.map((b: string, i: number) => (
                                <span key={i} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">{b}</span>
                            ))}
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-5">
                        <h3 className="font-bold text-xs uppercase text-amber-800 mb-2 flex items-center gap-1"><Award size={12} /> Ingrédients</h3>
                        <p className="text-sm text-gray-600">{product.ingredients.join(', ')}</p>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 mb-5 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex flex-col items-center text-center gap-1">
                            <ShieldCheck size={20} className="text-green-600" />
                            <span className="text-[10px] text-gray-600 font-medium">Pur & Naturel</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1">
                            <Truck size={20} className="text-blue-600" />
                            <span className="text-[10px] text-gray-600 font-medium">Circuit Court</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1">
                            <Leaf size={20} className="text-amber-600" />
                            <span className="text-[10px] text-gray-600 font-medium">100% Tunisien</span>
                        </div>
                    </div>

                    {/* Quantity + Add */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-amber-200 rounded-xl overflow-hidden">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-amber-50 transition-colors text-amber-700"><Minus size={18} /></button>
                            <span className="px-4 font-bold text-amber-900 min-w-[48px] text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-amber-50 transition-colors text-amber-700"><Plus size={18} /></button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                        >
                            {added ? <><Check size={18} /> Ajouté !</> : <><ShoppingCart size={18} /> Ajouter au panier</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductDetails;