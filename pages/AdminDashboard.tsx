import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import supabase, { mapProductFromSupabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { t } from '../i18n';
import { Loader, Plus, Upload, Trash2, Edit2, Package, ShoppingBag, CheckCircle, FolderOpen, Mail, Phone, MapPin } from 'lucide-react';
import RahiqLogo from '../components/RahiqLogo';

const ADMIN_EMAIL = 'houdaboughalleb591@gmail.com';

interface CategoryData {
    id: string;
    name: string;
    name_ar?: string;
    name_fr?: string;
    name_en?: string;
    slug: string;
    image: string;
    created_at?: string;
}

interface ProductData {
    id: string;
    name: string;
    name_ar?: string;
    name_fr?: string;
    name_en?: string;
    category_id: string;
    price: number;
    description: string;
    description_ar?: string;
    description_fr?: string;
    description_en?: string;
    producer: string;
    is_organic: boolean;
    is_artisanal: boolean;
    image: string;
    images?: string[];
    benefits: string[];
    ingredients: string[];
    stock: number;
    created_at?: string;
}

const AdminDashboard: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const { dir, t } = useLanguage();
    const navigate = useNavigate();
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
    const [products, setProducts] = useState<ProductData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name_ar: '', name_fr: '', name_en: '',
        category_id: '', price: '',
        description_ar: '', description_fr: '', description_en: '',
        producer: '', isOrganic: false, isArtisanal: false, image: '', images: [] as string[]
    });

    const [catNameAr, setCatNameAr] = useState('');
    const [catNameFr, setCatNameFr] = useState('');
    const [catNameEn, setCatNameEn] = useState('');
    const [catSlug, setCatSlug] = useState('');
    const [catImage, setCatImage] = useState('');
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [formLang, setFormLang] = useState<'ar' | 'fr' | 'en'>('ar');

    const [uploading, setUploading] = useState(false);

    const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) navigate('/');
    }, [user, isAdmin, authLoading]);

    useEffect(() => {
        const load = async () => {
            try {
                if (activeTab === 'products') {
                    setIsLoading(true);
                    const [catRes, prodRes] = await Promise.all([
                        supabase.from('categories').select('*').order('name'),
                        supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
                    ]);
                    if (catRes.error) throw catRes.error;
                    if (prodRes.error) throw prodRes.error;
                    if (catRes.data) setCategories(catRes.data);
                    if (prodRes.data) setProducts(prodRes.data);
                } else if (activeTab === 'categories') {
                    setIsLoading(true);
                    const { data } = await supabase.from('categories').select('*').order('name');
                    if (data) setCategories(data);
                } else {
                    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                    if (data) setOrders(data);
                }
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        load();
    }, [activeTab]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'category') => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            setUploading(true);
            const files = Array.from(event.target.files) as File[];
            const options = { maxWidth: 1200, useWebWorker: true, toWebp: true, quality: 0.7 };
            
            const uploadPromises = files.map(async (file: File) => {
                const compressedFile = await imageCompression(file, options);
                const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.webp`;
                const { error: uploadError } = await supabase.storage.from('rahiq-store').upload(fileName, compressedFile, { contentType: 'image/webp' });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('rahiq-store').getPublicUrl(fileName);
                return data.publicUrl;
            });

            const newUrls = await Promise.all(uploadPromises);

            if (target === 'product') {
                setFormData(prev => ({ 
                    ...prev, 
                    images: [...(prev.images || []), ...newUrls],
                    image: prev.image || newUrls[0]
                }));
            } else {
                setCatImage(newUrls[0]);
            }
        } catch (error) { alert('Erreur upload image'); console.error(error); }
        finally { setUploading(false); }
    };

    const removeProductImage = (urlToRemove: string) => {
        setFormData(prev => {
            const newImages = (prev.images || []).filter(url => url !== urlToRemove);
            return {
                ...prev,
                images: newImages,
                image: prev.image === urlToRemove ? (newImages[0] || '') : prev.image
            };
        });
    };

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const productData = {
            name: formData.name_ar || formData.name_fr || formData.name_en,
            name_ar: formData.name_ar,
            name_fr: formData.name_fr,
            name_en: formData.name_en,
            category_id: formData.category_id || null,
            price: parseFloat(formData.price),
            description: formData.description_ar || formData.description_fr || formData.description_en,
            description_ar: formData.description_ar,
            description_fr: formData.description_fr,
            description_en: formData.description_en,
            producer: formData.producer,
            is_organic: formData.isOrganic,
            is_artisanal: formData.isArtisanal,
            image: formData.image,
            images: formData.images,
            benefits: [],
            ingredients: [],
            stock: 0
        };
        try {
            if (isEditing && editId) {
                const { error } = await supabase.from('products').update(productData).eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
            }
            setIsEditing(false); setEditId(null);
            setFormData({ 
                name_ar: '', name_fr: '', name_en: '', 
                category_id: '', price: '', 
                description_ar: '', description_fr: '', description_en: '', 
                producer: '', isOrganic: false, isArtisanal: false, image: '', images: []
            });
            setActiveTab(activeTab);
        } catch (error: any) { alert(`Erreur: ${error.message}`); }
        finally { setIsLoading(false); }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm(t('admin.deleteConfirm'))) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch { alert('Erreur lors de la suppression'); }
    };

    const startEdit = (product: ProductData) => {
        setIsEditing(true); setEditId(product.id);
        setFormData({
            name_ar: product.name_ar || product.name || '',
            name_fr: product.name_fr || '',
            name_en: product.name_en || '',
            category_id: product.category_id || '',
            price: product.price.toString(),
            description_ar: product.description_ar || product.description || '',
            description_fr: product.description_fr || '',
            description_en: product.description_en || '',
            producer: product.producer,
            isOrganic: product.is_organic,
            isArtisanal: product.is_artisanal,
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
            images: product.images || (product.image ? [product.image] : [])
        });
    };

    const cancelEdit = () => {
        setIsEditing(false); setEditId(null);
        setFormData({ 
            name_ar: '', name_fr: '', name_en: '', 
            category_id: '', price: '', 
            description_ar: '', description_fr: '', description_en: '', 
            producer: '', isOrganic: false, isArtisanal: false, image: '', images: []
        });
    };

    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const mainName = catNameAr || catNameFr || catNameEn;
        if (!mainName.trim()) { alert('Le nom est requis'); return; }
        setIsLoading(true);
        try {
            const data = { 
                name: mainName.trim(), 
                name_ar: catNameAr.trim(),
                name_fr: catNameFr.trim(),
                name_en: catNameEn.trim(),
                slug: catSlug || slugify(mainName), 
                image: catImage 
            };
            if (isEditingCategory && editCategoryId) {
                const { error } = await supabase.from('categories').update(data).eq('id', editCategoryId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert([data]);
                if (error) throw error;
            }
            setIsEditingCategory(false); setEditCategoryId(null);
            setCatNameAr(''); setCatNameFr(''); setCatNameEn(''); setCatSlug(''); setCatImage('');
            setActiveTab(activeTab);
        } catch (error: any) { alert(`Erreur: ${error.message}`); }
        finally { setIsLoading(false); }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm(t('admin.deleteConfirm'))) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
        } catch { alert('Erreur lors de la suppression'); }
    };

    const startEditCategory = (cat: CategoryData) => {
        setIsEditingCategory(true); setEditCategoryId(cat.id);
        setCatNameAr(cat.name_ar || cat.name || '');
        setCatNameFr(cat.name_fr || '');
        setCatNameEn(cat.name_en || '');
        setCatSlug(cat.slug);
        setCatImage(cat.image);
    };

    const updateOrderStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase.from('orders').update({ status }).eq('id', id);
            if (error) throw error;
            setActiveTab(activeTab);
        } catch { alert('Erreur mise à jour'); }
    };

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '—';
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    if (authLoading) return (
        <div dir={dir} className="flex items-center justify-center h-64">
            <Loader className="animate-spin text-amber-600" size={32} />
        </div>
    );

    return (
        <div dir={dir} className="min-h-screen bg-amber-50 p-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <RahiqLogo className="w-12 h-12" showText={false} />
                        <div>
                            <h1 className="text-xl font-bold text-amber-900">{t('admin.title')}</h1>
                            <p className="text-xs text-amber-600">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="text-sm text-amber-700 hover:underline">← {t('nav.home')}</button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-2xl p-1.5 mb-6 shadow-sm border border-amber-100 overflow-x-auto">
                    {[
                        { key: 'products', label: t('admin.tabProducts'), icon: <ShoppingBag size={16} /> },
                        { key: 'categories', label: t('admin.tabCategories'), icon: <FolderOpen size={16} /> },
                        { key: 'orders', label: t('admin.tabOrders'), icon: <Package size={16} /> },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ${activeTab === tab.key ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'}`}>
                            {tab.icon}{tab.label}
                        </button>
                    ))}
                </div>

                {/* === PRODUCTS TAB === */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        {/* Product Form */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
                            <h2 className="text-base font-bold text-amber-900 mb-4">
                                {isEditing ? t('admin.editProduct') : t('admin.addProduct')}
                            </h2>
                            <div className="flex gap-2 mb-4 bg-amber-50 p-1 rounded-xl w-fit">
                                {['ar', 'fr', 'en'].map((l) => (
                                    <button key={l} type="button" onClick={() => setFormLang(l as any)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${formLang === l ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-100'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.name')} (AR) *</label>
                                            <input value={formData.name_ar} onChange={e => setFormData(p => ({ ...p, name_ar: e.target.value }))} required dir="rtl" className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.name')} (FR)</label>
                                            <input value={formData.name_fr} onChange={e => setFormData(p => ({ ...p, name_fr: e.target.value }))} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.name')} (EN)</label>
                                            <input value={formData.name_en} onChange={e => setFormData(p => ({ ...p, name_en: e.target.value }))} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.description')} (AR)</label>
                                            <textarea value={formData.description_ar} onChange={e => setFormData(p => ({ ...p, description_ar: e.target.value }))} rows={2} dir="rtl" className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.description')} (FR)</label>
                                            <textarea value={formData.description_fr} onChange={e => setFormData(p => ({ ...p, description_fr: e.target.value }))} rows={2} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.description')} (EN)</label>
                                            <textarea value={formData.description_en} onChange={e => setFormData(p => ({ ...p, description_en: e.target.value }))} rows={2} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.image')} (Galerie)</label>
                                    <div className="flex flex-wrap gap-3 p-4 border-2 border-dashed border-amber-200 rounded-2xl bg-amber-50/30">
                                        {(formData.images || []).map((url, idx) => (
                                            <div key={idx} className="relative group w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-amber-100">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeProductImage(url)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                {formData.image === url && (
                                                    <div className="absolute bottom-0 inset-x-0 bg-amber-600 text-white text-[10px] font-bold text-center py-0.5">
                                                        Principale
                                                    </div>
                                                )}
                                                {formData.image !== url && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData(p => ({ ...p, image: url }))}
                                                        className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Définir principale
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <label className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:bg-amber-100 hover:border-amber-400 transition-all text-amber-600">
                                            <Upload size={20} />
                                            <span className="text-[10px] font-bold uppercase">{uploading ? '...' : t('admin.uploadImage')}</span>
                                            <input type="file" accept="image/*" multiple className="hidden"
                                                onChange={e => handleImageUpload(e, 'product')} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={formData.isOrganic}
                                            onChange={e => setFormData(p => ({ ...p, isOrganic: e.target.checked }))}
                                            className="w-4 h-4 accent-amber-600" />{t('admin.organic')}
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={formData.isArtisanal}
                                            onChange={e => setFormData(p => ({ ...p, isArtisanal: e.target.checked }))}
                                            className="w-4 h-4 accent-amber-600" />{t('admin.artisanal')}
                                    </label>
                                </div>
                                <div className="flex gap-2 md:col-span-2">
                                    <button type="submit" disabled={isLoading}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                                        {isLoading ? <Loader className="animate-spin" size={16} /> : <CheckCircle size={16} />}{t('admin.save')}
                                    </button>
                                    {isEditing && (
                                        <button type="button" onClick={cancelEdit}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-medium">
                                            {t('admin.cancel')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Products List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-amber-100">
                                <h3 className="font-semibold text-amber-900">{products.length} {t('admin.products').toLowerCase()}</h3>
                            </div>
                            {products.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">{t('admin.noProducts')}</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-amber-50">
                                            <tr>
                                                <th className="text-left px-5 py-3 font-semibold text-amber-800">{t('admin.image')}</th>
                                                <th className="text-left px-3 py-3 font-semibold text-amber-800">{t('admin.name')}</th>
                                                <th className="text-left px-3 py-3 font-semibold text-amber-800">{t('admin.category')}</th>
                                                <th className="text-left px-3 py-3 font-semibold text-amber-800">{t('admin.price')}</th>
                                                <th className="text-right px-5 py-3 font-semibold text-amber-800"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(products as any[]).map(p => (
                                                <tr key={p.id} className="border-t border-amber-50 hover:bg-amber-50/50">
                                                    <td className="px-5 py-3"><img src={p.image} alt={p.name} className="h-10 w-10 object-cover rounded-lg" /></td>
                                                    <td className="px-3 py-3 font-medium text-amber-900">{p.name}</td>
                                                    <td className="px-3 py-3 text-gray-600 text-xs">{p.categories?.name || '—'}</td>
                                                    <td className="px-3 py-3 font-semibold text-amber-800">{p.price} TND</td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex gap-1 justify-end">
                                                            <button onClick={() => startEdit(p as any)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"><Edit2 size={16} /></button>
                                                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === CATEGORIES TAB === */}
                {activeTab === 'categories' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
                            <h2 className="text-base font-bold text-amber-900 mb-4">{isEditingCategory ? t('admin.editCategory') : t('admin.addCategory')}</h2>
                            <div className="flex gap-2 mb-4 bg-amber-50 p-1 rounded-xl w-fit">
                                {['ar', 'fr', 'en'].map((l) => (
                                   <button key={l} type="button" onClick={() => setFormLang(l as any)}
                                       className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${formLang === l ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-100'}`}>
                                       {l}
                                   </button>
                                ))}
                            </div>
                            <form onSubmit={handleSubmitCategory} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.categoryName')} (AR) *</label>
                                        <input value={catNameAr} onChange={e => { setCatNameAr(e.target.value); if(!catSlug) setCatSlug(slugify(e.target.value)); }} required dir="rtl" className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.categoryName')} (FR)</label>
                                        <input value={catNameFr} onChange={e => setCatNameFr(e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('admin.categoryName')} (EN)</label>
                                        <input value={catNameEn} onChange={e => setCatNameEn(e.target.value)} className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Slug</label>
                                        <input value={catSlug} onChange={e => setCatSlug(e.target.value)} placeholder="slug-auto" className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-amber-50" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="cursor-pointer flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-sm font-medium">
                                            <Upload size={16} />{t('admin.selectImage')}
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'category')} />
                                        </label>
                                        {catImage && <img src={catImage} alt="" className="h-10 w-10 object-cover rounded-xl" />}
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                                            {isLoading ? <Loader className="animate-spin" size={16} /> : <CheckCircle size={16} />}{t('admin.save')}
                                        </button>
                                        {isEditingCategory && (
                                            <button type="button" onClick={() => { setIsEditingCategory(false); setCatNameAr(''); setCatNameFr(''); setCatNameEn(''); setCatSlug(''); setCatImage(''); }}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-medium">{t('admin.cancel')}</button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                            {categories.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">{t('admin.noCategories')}</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="bg-amber-50 rounded-2xl p-3 border border-amber-100">
                                            {cat.image && <img src={cat.image} alt={cat.name} className="w-full aspect-square object-cover rounded-xl mb-2" />}
                                            <p className="font-semibold text-amber-900 text-sm text-center">{cat.name}</p>
                                            <p className="text-xs text-gray-400 text-center mb-2">/{cat.slug}</p>
                                            <div className="flex justify-center gap-1 mt-2">
                                                <button onClick={() => startEditCategory(cat)} className="p-1.5 text-amber-600 hover:bg-amber-200 rounded-lg"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === ORDERS TAB === */}
                {activeTab === 'orders' && (
                    <div className="space-y-3">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-amber-100">{t('admin.noOrders')}</div>
                        ) : orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-amber-900 text-sm">{t('admin.orderFor')}: {order.full_name || order.customer_name}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Phone size={12} />{order.phone || order.customer_phone}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                            <MapPin size={12} />{order.delivery_address}
                                        </div>
                                        {order.notes && <p className="text-xs text-gray-400 mt-1 italic">"{order.notes}"</p>}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || statusColors.pending}`}>
                                            {t(`admin.status.${order.status}`) || order.status}
                                        </span>
                                        <span className="text-sm font-bold text-amber-800">{order.total} TND</span>
                                    </div>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-3 mb-3 text-xs text-gray-600">
                                    <p className="font-semibold mb-1 text-amber-800">#{order.id.slice(0, 8)} — {new Date(order.created_at).toLocaleDateString('fr-TN')}</p>
                                </div>
                                {order.items && (
                                    <div className="text-xs text-gray-600 mb-3">
                                        {(() => { try { const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; return items.map((item: any) => `${item.name} x${item.quantity}`).join(', '); } catch { return ''; } })()}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
                                        <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${order.status === s ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                                            {t(`admin.status.${s}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
