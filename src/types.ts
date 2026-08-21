export interface Lead {
  id: string;
  name: string;
  phone: string;
  pestType: 'termitas' | 'roedores' | 'insectos' | 'otros';
  infestationLevel: 'bajo' | 'medio' | 'critico';
  status: 'pendiente' | 'contactado' | 'inspeccionado' | 'completado';
  createdAt: string;
  notes?: string;
  orderItems?: string; // Optional: description of purchased items if it's an order lead
  orderTotal?: number; // Optional: total of the store order
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'geles' | 'trampas' | 'aspersores' | 'proteccion';
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isOffer?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}


export interface Service {
  id: string;
  title: string;
  description: string;
  fullDetails: string;
  benefits: string[];
  threatLevel: 'Alto' | 'Extremo' | 'Crítico';
  duration: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  avatar: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  detail: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}
