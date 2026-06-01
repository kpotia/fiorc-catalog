import { addItem } from '../cartStore';

const catalog = document.querySelector('[data-catalog]');
if (!catalog) {
  throw new Error('Product catalog root not found.');
}

const rawProducts = catalog.dataset.products || '[]';
const products = JSON.parse(rawProducts);

const searchInput = document.querySelector<HTMLInputElement>('[data-catalog-search]');
const categorySelect = document.querySelector<HTMLSelectElement>('[data-catalog-category]');
const sortSelect = document.querySelector<HTMLSelectElement>('[data-catalog-sort]');
const resetButtons = Array.from(document.querySelectorAll('[data-catalog-reset]')) as HTMLElement[];
const countLabel = document.querySelector<HTMLElement>('[data-catalog-count]');
const itemsContainer = document.querySelector<HTMLElement>('[data-catalog-items]');
const emptyState = document.querySelector<HTMLElement>('[data-catalog-empty]');

const formatPrice = (value: number) => new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';

const activeProducts = () => {
  const query = searchInput?.value.trim().toLowerCase() || '';
  const category = categorySelect?.value || 'Toutes catégories';
  const sortBy = sortSelect?.value || 'featured';

  return products
    .filter((product) => {
      const matchesCategory = category === 'Toutes catégories' || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.stock - a.stock;
      }
    });
};

const renderProducts = (items: any[]) => {
  if (!itemsContainer || !countLabel || !emptyState) return;

  countLabel.textContent = `${items.length} / ${products.length}`;
  itemsContainer.innerHTML = items
    .map((product) => {
      return `
        <article class="overflow-hidden rounded-[2rem] border border-white/10 bg-[#11131f] shadow-lg shadow-black/20 transition hover:-translate-y-1">
          <img src="${product.image}" alt="${product.name}" decoding="async" class="h-48 w-full object-cover" />
          <div class="p-4">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs uppercase tracking-[0.18em] text-[#ffd700]">${product.category}</p>
              <span class="text-xs text-gray-400">${product.stock} en stock</span>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-white">${product.name}</h3>
            <p class="mt-3 text-sm leading-relaxed text-gray-400 line-clamp-2">${product.description}</p>
            <div class="mt-5 flex items-center justify-between gap-3">
              <span class="text-base font-bold text-[#ffd700]">${formatPrice(product.price)}</span>
              <div class="flex items-center gap-2">
                <a href="/produit/${product.id}" class="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#ffd700]/15">Voir</a>
                <button
                  type="button"
                  data-add-to-cart
                  data-id="${product.id}"
                  data-name="${product.name}"
                  data-price="${product.price}"
                  data-image="${product.image}"
                  class="rounded-full bg-[#e94560] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#ff5a77]"
                >Ajouter</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  if (items.length === 0) {
    emptyState.classList.remove('hidden');
    itemsContainer.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    itemsContainer.classList.remove('hidden');
  }
};

const resetFilters = () => {
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'Toutes catégories';
  if (sortSelect) sortSelect.value = 'featured';
  renderProducts(activeProducts());
};

const handleAddToCart = (event: Event) => {
  const target = event.target as HTMLElement;
  const button = target.closest('[data-add-to-cart]') as HTMLElement | null;
  if (!button) return;

  const id = button.dataset.id;
  const name = button.dataset.name;
  const price = button.dataset.price ? Number(button.dataset.price) : 0;
  const image = button.dataset.image || '';

  if (!id || !name) return;

  addItem({ id, name, price, image });
};

const initCatalog = () => {
  renderProducts(activeProducts());

  searchInput?.addEventListener('input', () => renderProducts(activeProducts()));
  categorySelect?.addEventListener('change', () => renderProducts(activeProducts()));
  sortSelect?.addEventListener('change', () => renderProducts(activeProducts()));
  resetButtons.forEach((button) => button.addEventListener('click', resetFilters));
  itemsContainer?.addEventListener('click', handleAddToCart);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalog);
} else {
  initCatalog();
}
