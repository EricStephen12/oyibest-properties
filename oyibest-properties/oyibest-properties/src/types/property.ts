// @ts-nocheck
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'sale' | 'rent';
  features: string[];
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  contactPhone: string;
  contactWhatsapp: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyFilter = {
  type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
} 