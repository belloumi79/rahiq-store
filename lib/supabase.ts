import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fcvyhztkhvswwbbzqdrr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YaAVfzljrzLDCpX4r0sbVQ_Yjv3b7xt';

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null { return this.map.get(key) || null; }
  setItem(key: string, value: string): void { this.map.set(key, value); }
  removeItem(key: string): void { this.map.delete(key); }
}

let isFallbackMode = false;

const getSafeStorage = () => {
  if (typeof window === 'undefined') return new MemoryStorage();
  try {
    const storage = window.localStorage;
    const testKey = '__rahiq_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch (e) {
    console.warn('Mode strict détecté — Fallback MemoryStorage');
    isFallbackMode = true;
    return new MemoryStorage();
  }
};

const safeStorage = getSafeStorage();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const mapProductFromSupabase = (doc: any) => ({
    id: doc.id,
    name: doc.name,
    category: doc.categories?.name || doc.category || '',
    price: doc.price,
    image: doc.image,
    description: doc.description,
    producer: doc.producer,
    benefits: typeof doc.benefits === 'string' ? JSON.parse(doc.benefits) : (doc.benefits || []),
    ingredients: typeof doc.ingredients === 'string' ? JSON.parse(doc.ingredients) : (doc.ingredients || []),
    isOrganic: doc.is_organic ?? doc.isOrganic ?? false,
    isArtisanal: doc.is_artisanal ?? doc.isArtisanal ?? false,
    rating: doc.rating ?? 0,
    reviews: doc.reviews ?? []
});