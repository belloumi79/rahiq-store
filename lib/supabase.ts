import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcvyhztkhvswwbbzqdrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnloentrLWh2c3d3YmJ6cWYiLCJyYW5kb20iOiJxdWFydHoiLCJpYXQiOjE2MzYwNzQ2MDAsImV4cCI6MTk1MTYzMDYwMH0.RAfWSo0O2IZXxJ9FS0G8z1H2pYcNvI3i2p1T3PkAX4o';

if (!supabaseKey) {
  console.warn('[Supabase] ⚠️ Clé API non configurée — les requêtes utiliseront le cache local uniquement');
}

export const supabase = createClient(supabaseUrl, supabaseKey || 'placeholder', {
  auth: { persistSession: false, autoRefreshToken: false }
});

class MemoryStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value; }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
  get length() { return Object.keys(this.store).length; }
  key(index: number) { return Object.keys(this.store)[index] || null; }
}

if (typeof window !== 'undefined' && !window.localStorage) {
  Object.defineProperty(window, 'localStorage', { value: new MemoryStorage(), writable: false });
}

export interface Product {
  id: string; name: string; description: string; price: number;
  image: string; category: string; subcategory?: string; stock: number;
  isOrganic: boolean; isArtisanal: boolean; rating: number; reviews: number[];
  producer?: string; weight?: string; origin?: string;
}

export function mapProductFromSupabase(doc: any): Product {
  return ({
    id: doc.id || String(Date.now()),
    name: doc.name || '—',
    description: doc.description || '',
    price: doc.price ?? 0,
    image: doc.image || doc.publicUrl || '',
    category: doc.category_id || doc.category || '',
    subcategory: doc.subcategory || '',
    stock: doc.stock ?? 99,
    isOrganic: doc.is_organic ?? false,
    isArtisanal: doc.is_artisanal ?? false,
    rating: doc.rating ?? 0,
    reviews: doc.reviews ?? []
  });
}
