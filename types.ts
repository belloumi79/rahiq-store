export interface CategoryData {
  id?: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  name_en?: string;
  slug: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  name_en?: string;
  category: string;
  category_id?: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  description_ar?: string;
  description_fr?: string;
  description_en?: string;
  producer: string;
  origin?: string;
  weight?: string;
  benefits: string[];
  ingredients: string[];
  isOrganic: boolean;
  isArtisanal: boolean;
  is_new?: boolean;
  rating: number;
  reviews: any[] | number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
}

export enum Category {
  HONEY = 'Miel',
  DERIVATIVES = 'Dérivés de la Ruche',
  BOXES = 'Coffrets'
}
