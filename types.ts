export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  producer: string;
  benefits: string[];
  ingredients: string[];
  isOrganic: boolean;
  isArtisanal: boolean;
  rating: number;
  reviews: number;
}

export interface CategoryData {
  id?: string;
  name: string;
  image: string;
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
  ALL = 'Tous',
  HONEY = 'Miel',
  DERIVATIVES = 'Dérivés',
  COMBOS = 'Coffrets'
}
