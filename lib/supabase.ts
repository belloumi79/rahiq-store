/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcvyhztkhvswwbbzqdrr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnloenh0a2h2c3d3YmJxZHFyciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM3Mjc0MTY2LCJleHAiOjE5NTI4NTAxNjZ9.dcl4-WRwq4LZuMmLihVoC1q0aG0vF5h0Y5J8hF6YQZ0';

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

export function mapProductFromSupabase(doc: any) {
  return {
    id: doc.id,
    name: doc.name ?? '',
    name_ar: doc.name_ar ?? doc.name ?? '',
    name_fr: doc.name_fr ?? '',
    name_en: doc.name_en ?? '',
    description: doc.description ?? '',
    description_ar: doc.description_ar ?? doc.description ?? '',
    description_fr: doc.description_fr ?? '',
    description_en: doc.description_en ?? '',
    price: doc.price ?? 0,
    image: doc.image || (doc.images && doc.images.length > 0 ? doc.images[0] : ''),
    images: doc.images || (doc.image ? [doc.image] : []),
    category: doc.category ?? doc.category_id ?? '',
    category_id: doc.category_id ?? '',
    origin: doc.origin ?? '',
    weight: doc.weight ?? '',
    isOrganic: doc.is_organic ?? false,
    isArtisanal: doc.is_artisanal ?? false,
    rating: doc.rating ?? 0,
    reviews: doc.reviews ?? [],
  };
}

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data?.map(mapProductFromSupabase) ?? [];
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data ?? [];
}
