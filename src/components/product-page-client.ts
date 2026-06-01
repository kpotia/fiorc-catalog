import { addItem, openCart } from '../cartStore';
import type { CartItem } from '../types';

const handleAddToCart = (button: HTMLButtonElement) => {
  const id = button.dataset.id;
  const name = button.dataset.name;
  const price = button.dataset.price ? Number(button.dataset.price) : 0;
  const image = button.dataset.image || '';

  if (!id || !name) return;

  addItem({ id, name, price, image });
  openCart();
};

const initProductPageCart = () => {
  const addToCartButton = document.querySelector<HTMLButtonElement>('[data-add-to-cart]');
  if (!addToCartButton) return;

  addToCartButton.addEventListener('click', (event) => {
    event.preventDefault();
    handleAddToCart(addToCartButton);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductPageCart);
} else {
  initProductPageCart();
}
