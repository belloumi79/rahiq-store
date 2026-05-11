import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader, Plus, Edit2, Trash2, Package, Users, BarChart3, Settings, Save, X, Phone, Mail, MapPin } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) { navigate('/'); return; }
        loadData();
    }, [user, isAdmin, authLoading]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [{ data: prods }, { data: cats }, { data: ords }] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('categories').select('*'),
                supabase.from('orders').select('*').order('created_at', { ascending: false })
            ]);
            setProducts(prods || []);
            setCategories(cats || []);
            setOrders(ords || []);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const updateOrderStatus = async (id: string, status: string) => {
        await supabase.from('orders').update({ status }).eq('id', id);
        loadData();
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Supprimer ce produit ?')) return;
        await supabase.from('products').delete().eq('id', id);
        loadData();
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Supprimer cette catégorie ?')) return;
        await supabase.from('categories').delete().eq('id', id);
        loadData();
    };

    const saveProduct = async (product: any) => {
        if (product.id) {
            await supabase.from('products').update(product).eq('id', product.id);
        } else {
            await supabase.from('products').insert({ ...product, id: undefined });
        }
        setShowProductForm(false);
        setEditingProduct(null);
        loadData();
    };

    const saveCategory = async (cat: any) => {
        if (cat.id) {
            await supabase.from('categories').update({ name: cat.name, image: cat.image }).eq('id', cat.id);
        } else {
            await supabase.from('categories').insert({ name: cat.name, image: cat.image });
        }
        setShowCategoryForm(false);
        setEditingCategory(null);
        loadData();
    };

    if (authLoading || loading) return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin text-amber-600" size={32} /></div>;

    return (
        <div className="px-4 pt-4 pb-20 min-h-screen bg-amber-50">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={24} /></button>
                <h1 className="text-2xl font-serif font-bold text-amber-900">Administration</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                {[
                    { key: 'products', label: 'Produits', icon: <Package size={16} /> },
                    { key: 'categories', label: 'Catégories', icon: <Settings size={16} /> },
                    { key: 'orders', label: 'Commandes', icon: <BarChart3 size={16} /> }
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${activeTab === tab.key ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 border border-amber-200'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
                <div className="space-y-4">
                    <button onClick={() => { setEditingProduct({}); setShowProductForm(true); }}
                        className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                        <Plus size={18} /> Ajouter un produit
                    </button>

                    {products.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex gap-4">
                            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-amber-50" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900">{p.name}</h3>
                                <p className="text-xs text-gray-500">{p.category} — {p.price.toFixed(3)} DT</p>
                                <div className="flex gap-1 mt-1">
                                    {p.isOrganic && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">BIO</span>}
                                    {p.isArtisanal && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Artisan</span>}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
                <div className="space-y-4">
                    <button onClick={() => { setEditingCategory({ name: '', image: '' }); setShowCategoryForm(true); }}
                        className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                        <Plus size={18} /> Ajouter une catégorie
                    </button>

                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-700">Catégories ({categories.length})</h3>
                        {categories.map(cat => (
                            <div key={cat.id} className="bg-white p-3 rounded-xl shadow-sm border border-amber-100 flex items-center gap-3">
                                <img src={cat.image || `https://ui-avatars.com/api/?name=${cat.name}&background=fde68a&color=92400e`} alt={cat.name}
                                    className="w-12 h-12 rounded-full bg-amber-50 object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${cat.name}&background=fde68a&color=92400e`; }} />
                                <div className="flex-1"><h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4></div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Commandes Clients</h2>
                    {orders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Aucune commande pour le moment.</div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                                <div className="flex justify-between items-start mb-4 border-b border-amber-50 pb-3">
                                    <div>
                                        <div className="font-bold text-lg text-amber-900">Cmd #{order.id.slice(0,6)}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.status === 'pending' ? 'En Attente' : order.status}
                                    </div>
                                </div>

                                <div className="mb-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <h4 className="font-bold text-xs uppercase text-amber-800 mb-3 flex items-center gap-2"><MapPin size={14} /> Infos Livraison</h4>
                                    <div className="text-sm space-y-2">
                                        <p className="font-bold text-gray-900">{order.shipping_address?.full_name}</p>
                                        <div className="flex items-center gap-2 text-gray-700"><Phone size={14} className="text-amber-600" />
                                            <a href={`tel:${order.shipping_address?.phone}`} className="hover:text-amber-700 font-medium">{order.shipping_address?.phone || "Non renseigné"}</a>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700"><Mail size={14} className="text-amber-600" />
                                            <a href={`mailto:${order.shipping_address?.email || ""}`} className="text-amber-800 font-bold hover:underline">{order.shipping_address?.email || "Email non disponible"}</a>
                                        </div>
                                        <div className="flex items-start gap-2 text-gray-700"><MapPin size={14} className="text-amber-600 mt-1" /><p>{order.shipping_address?.address}</p></div>
                                    </div>
                                </div>

                                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Articles</h4>
                                    <ul className="text-sm space-y-1">
                                        {order.items?.map((item: any, i: number) => (
                                            <li key={i} className="flex justify-between">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span className="font-medium">{(item.price * item.quantity).toFixed(3)} DT</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-amber-700">{order.total_amount?.toFixed(3)} DT</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Confirmer</button>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700">Marquer Livré</button>
                                    )}
                                    {(order.status === 'pending' || order.status === 'confirmed') && (
                                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">Annuler</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Product Form Modal */}
            {showProductForm && (
                <ProductFormModal product={editingProduct} onSave={saveProduct} onClose={() => { setShowProductForm(false); setEditingProduct(null); }} />
            )}

            {/* Category Form Modal */}
            {showCategoryForm && (
                <CategoryFormModal category={editingCategory} onSave={saveCategory} onClose={() => { setShowCategoryForm(false); setEditingCategory(null); }} />
            )}
        </div>
    );
};

// --- Product Form Modal ---
const ProductFormModal: React.FC<{ product: any; onSave: (p: any) => void; onClose: () => void }> = ({ product, onSave, onClose }) => {
    const [form, setForm] = useState(product || {});
    const save = () => {
        const p = {
            ...form,
            price: parseFloat(form.price) || 0,
            rating: parseFloat(form.rating) || 4.5,
            reviews: parseInt(form.reviews) || 0,
            isOrganic: !!form.isOrganic,
            isArtisanal: !!form.isArtisanal,
            benefits: form.benefits ? form.benefits.split(',').map((s: string) => s.trim()) : [],
            ingredients: form.ingredients ? form.ingredients.split(',').map((s: string) => s.trim()) : []
        };
        onSave(p);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-xl text-amber-900">{form.id ? 'Modifier' : 'Ajouter'} Produit</h2>
                    <button onClick={onClose} className="p-2 hover:bg-amber-50 rounded-full"><X size={20} /></button>
                </div>
                <div className="space-y-3">
                    {[
                        { key: 'name', label: 'Nom', type: 'text' },
                        { key: 'category', label: 'Catégorie (Miel, Dérivés, Coffrets)', type: 'text' },
                        { key: 'price', label: 'Prix (DT)', type: 'number' },
                        { key: 'producer', label: 'Producteur', type: 'text' },
                        { key: 'image', label: 'URL Image', type: 'text' },
                        { key: 'description', label: 'Description', type: 'textarea' },
                        { key: 'benefits', label: 'Bienfaits (séparés par virgule)', type: 'text' },
                        { key: 'ingredients', label: 'Ingrédients (séparés par virgule)', type: 'text' },
                        { key: 'rating', label: 'Note (1-5)', type: 'number' },
                        { key: 'reviews', label: 'Nombre d\'avis', type: 'number' }
                    ].map(field => (
                        <div key={field.key}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea value={form[field.key] || ''} onChange={e => setForm({...form, [field.key]: e.target.value})}
                                    className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 h-20" />
                            ) : (
                                <input type={field.type} value={form[field.key] || ''} onChange={e => setForm({...form, [field.key]: e.target.value})}
                                    className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            )}
                        </div>
                    ))}
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isOrganic} onChange={e => setForm({...form, isOrganic: e.target.checked})} /> Bio</label>
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isArtisanal} onChange={e => setForm({...form, isArtisanal: e.target.checked})} /> Artisan</label>
                    </div>
                </div>
                <button onClick={save} className="w-full mt-4 bg-amber-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Save size={18} /> Enregistrer</button>
            </div>
        </div>
    );
};

// --- Category Form Modal ---
const CategoryFormModal: React.FC<{ category: any; onSave: (c: any) => void; onClose: () => void }> = ({ category, onSave, onClose }) => {
    const [form, setForm] = useState(category || { name: '', image: '' });

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-xl text-amber-900">{form.id ? 'Modifier' : 'Ajouter'} Catégorie</h2>
                    <button onClick={onClose} className="p-2 hover:bg-amber-50 rounded-full"><X size={20} /></button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                            className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">URL Image</label>
                        <input type="text" value={form.image || ''} onChange={e => setForm({...form, image: e.target.value})}
                            className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                </div>
                <button onClick={() => onSave(form)} className="w-full mt-4 bg-amber-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Save size={18} /> Enregistrer</button>
            </div>
        </div>
    );
};

export default AdminDashboard;