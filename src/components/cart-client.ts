import {
  cartItems,
  cartCount,
  cartTotal,
  cartUi,
  clearCart,
  closeCart,
  initCartStore,
  openCart,
  removeItem,
  updateQuantity,
} from '../cartStore';
import { buildWhatsAppUrl, formatPrice } from '../utils';
import type { CartItem } from '../types';

const CART_PHONE = '22890000000';

const select = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);

const formatCurrency = (value: number) => formatPrice(value);

const drawer = select('[data-cart-drawer]');
const overlay = select('[data-cart-overlay]');
const openButton = select('[data-cart-open]');
const closeButtons = Array.from(document.querySelectorAll('[data-cart-close]')) as HTMLElement[];
const cartCountBadge = select('[data-cart-count]');
const cartCountSummary = select('[data-cart-count-summary]');
const cartTotalLabel = select('[data-cart-total]');
const cartItemsContainer = select('[data-cart-items]');
const cartEmpty = select('[data-cart-empty]');
const cartSummary = select('[data-cart-summary]');
const checkoutAnchor = select<HTMLAnchorElement>('[data-whatsapp-checkout]');
const clearCartButton = select('[data-cart-clear]');

const createItemHtml = (item: CartItem) => {
  const subtotal = item.price * item.quantity;
  return `
    <div class="flex gap-3 rounded-3xl border border-white/10 bg-[#161a2f] p-4">
      <div class="h-16 w-16 overflow-hidden rounded-3xl bg-gray-950">
        <img src="${item.image}" alt="${item.name}" decoding="async" class="h-full w-full object-cover" />
      </div>
      <div class="flex flex-1 flex-col justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-white">${item.name}</p>
          <p class="mt-2 text-xs text-gray-400">${formatCurrency(item.price)} / unité</p>
        </div>
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 rounded-full bg-[#0f1221] px-2 py-1 text-sm text-gray-300">
            <button type="button" data-action="decrease" data-id="${item.id}" class="rounded-full p-1 text-gray-400 transition hover:bg-white/5 hover:text-white">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${item.id}" class="rounded-full p-1 text-gray-400 transition hover:bg-white/5 hover:text-white">+</button>
          </div>
          <button type="button" data-action="remove" data-id="${item.id}" class="rounded-full p-2 text-gray-400 transition hover:bg-white/5 hover:text-[#ffd700]">🗑️</button>
        </div>
        <p class="text-sm font-semibold text-[#ffd700]">${formatCurrency(subtotal)}</p>
      </div>
    </div>
  `;
};

const getWhatsAppUrl = (items: readonly CartItem[]) => buildWhatsAppUrl(CART_PHONE, items);

const updateCartDisplay = (items: readonly CartItem[]) => {
  if (!cartItemsContainer || !cartEmpty || !cartSummary || !checkoutAnchor || !cartCountBadge || !cartCountSummary || !cartTotalLabel) {
    return;
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  cartCountBadge.textContent = String(itemCount);
  cartCountSummary.textContent = String(itemCount);
  cartTotalLabel.textContent = formatCurrency(totalPrice);
  checkoutAnchor.href = items.length > 0 ? getWhatsAppUrl(items) : '#';
  checkoutAnchor.className = items.length === 0
    ? 'inline-flex w-full items-center justify-between gap-3 rounded-3xl px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] transition bg-[#0f101d] text-gray-500 border border-white/10 cursor-not-allowed'
    : 'inline-flex w-full items-center justify-between gap-3 rounded-3xl px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] transition bg-[#25d366] text-[#0f2a14] shadow-lg shadow-[#25d366]/20 hover:bg-[#1ebe57]';
  checkoutAnchor.setAttribute('aria-disabled', items.length === 0 ? 'true' : 'false');

  if (items.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartItemsContainer.classList.add('hidden');
    cartSummary.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    cartItemsContainer.classList.remove('hidden');
    cartSummary.classList.remove('hidden');
    cartItemsContainer.innerHTML = items.map(createItemHtml).join('');
  }
};

const handleCartAction = (event: Event) => {
  if (!cartItemsContainer) return;
  const target = event.target as HTMLElement;
  const button = target.closest('[data-action]') as HTMLElement | null;
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!action || !id) return;

  const items = cartItems.get();
  const item = items.find((entry) => entry.id === id);
  if (action === 'remove') {
    removeItem(id);
    return;
  }
  if (!item) return;
  if (action === 'increase') {
    updateQuantity(id, item.quantity + 1);
  }
  if (action === 'decrease') {
    updateQuantity(id, item.quantity - 1);
  }
};

let eventsBound = false;

const bindCartEvents = () => {
  if (eventsBound) return;
  eventsBound = true;

  openButton?.addEventListener('click', openCart);
  closeButtons.forEach((button) => button.addEventListener('click', closeCart));
  overlay?.addEventListener('click', closeCart);
  clearCartButton?.addEventListener('click', () => {
    clearCart();
  });
  cartItemsContainer?.addEventListener('click', handleCartAction);
};

const setDrawerVisibility = (state: { isOpen: boolean }) => {
  if (!drawer || !overlay) return;

  if (state.isOpen) {
    drawer.classList.remove('invisible', 'pointer-events-none');
    drawer.classList.add('visible');
    overlay.classList.add('opacity-100');
    drawer.querySelector('.translate-x-full')?.classList.remove('translate-x-full');
  } else {
    overlay.classList.remove('opacity-100');
    drawer.classList.remove('visible');
    drawer.classList.add('invisible', 'pointer-events-none');
    drawer.querySelector('.translate-x-0')?.classList.add('translate-x-full');
  }
};

const setup = () => {
  initCartStore();
  bindCartEvents();
  updateCartDisplay(cartItems.get());
  setDrawerVisibility(cartUi.get());
  cartItems.listen(updateCartDisplay);
  cartUi.listen(setDrawerVisibility);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
