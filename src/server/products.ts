import productsData from '../products.json' assert { type: 'json' };
import type { Product } from '../types';

const products = (productsData.products ?? []) as Product[];

export function fetchProducts(): Product[] {
  return products;
}

export function activeProducts(productsList: Product[]): Product[] {
  return productsList.filter((product) => product.status === 'active');
}

export function fetchActiveProducts(): Product[] {
  return activeProducts(fetchProducts());
}

export function getProductById(productsList: Product[], id: string) {
  return productsList.find((product) => product.id === id);
}
