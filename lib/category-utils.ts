import { ShoppingBasket, Pill, Home, Wrench, Sparkles, ShoppingCart, Dog } from 'lucide-react';

export const getCategoryIcon = (categoryName: string | undefined) => {
  const lower = (categoryName || '').toLowerCase();
  if (lower.includes('aliment') || lower.includes('comida')) return ShoppingBasket;
  if (lower.includes('farmacia') || lower.includes('medicin')) return Pill;
  if (lower.includes('ferreter') || lower.includes('herramient')) return Wrench;
  if (lower.includes('limpieza') || lower.includes('aseo')) return Sparkles;
  if (lower.includes('hogar') || lower.includes('casa')) return Home;
  if (lower.includes('mascota') || lower.includes('perro') || lower.includes('gato')) return Dog;
  return ShoppingCart;
};

export const getCategoryLabel = (categoryValue: string | undefined) => {
  if (!categoryValue) return '';
  return categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
};
