import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ShoppingBag, Eye, X } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export interface ProductCatalogProps {
  products: Product[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'newest'

  // Debounce search query to optimize performance without library
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Extract unique categories present in the active products list
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(unique)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Status filter (only show active)
        if (product.status !== 'active') return false;

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        // Search text filter
        const query = debouncedQuery.toLowerCase().trim();
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
          case 'featured':
          default:
            // Standard/Featured sorts back by createdAt or stock level
            return b.stock - a.stock;
        }
      });
  }, [products, debouncedQuery, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  return (
    <section id="catalogue" className="py-8 px-6 sm:px-8 max-w-7xl mx-auto rounded-2xl bg-[#16213e] border border-white/5 shadow-xl text-white my-10">
      {/* Search & Filter Bar Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-6 mb-8 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Text Search Input */}
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
              <Search className="h-5 w-5" />
            </span>
            <input
              id="input-catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-11 pr-10 py-2.5 bg-[#1a1a2e] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#e94560] transition-all duration-300"
            />
            {searchQuery && (
              <button
                id="btn-clear-search-text"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters Selects */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category selection */}
            <div className="relative flex-grow sm:flex-initial">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Filter className="h-4 w-4" />
              </span>
              <select
                id="select-catalog-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#1a1a2e] border border-white/10 text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#e94560] appearance-none cursor-pointer w-full text-gray-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1a1a2e] text-white">
                    {cat === 'All' ? 'Toutes catégories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting selection */}
            <div className="relative flex-grow sm:flex-initial">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <select
                id="select-catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1a1a2e] border border-white/10 text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#e94560] appearance-none cursor-pointer w-full text-gray-300"
              >
                <option value="featured" className="bg-[#1a1a2e] text-white">
                  Prix : Par défaut
                </option>
                <option value="price-asc" className="bg-[#1a1a2e] text-white">
                  Prix : Croissant
                </option>
                <option value="price-desc" className="bg-[#1a1a2e] text-white">
                  Prix : Décroissant
                </option>
                <option value="newest" className="bg-[#1a1a2e] text-white">
                  Nouveautés
                </option>
              </select>
            </div>
          </div>

        </div>

        {/* Categories Pills Quick Navigation (Visual Enhancement) */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-gray-850">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mr-1">Filtres :</span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`pill-category-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#e94560] to-[#e94560]/80 text-white shadow-md shadow-[#e94560]/20'
                  : 'bg-black/30 text-gray-400 border border-gray-800/80 hover:text-white hover:border-gray-700'
              }`}
            >
              {cat === 'All' ? 'Tout' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-sm text-gray-400">
          <span className="font-extrabold text-[#ffd700] text-base mr-1">
            {filteredProducts.length}
          </span>
          produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </p>
        
        {(selectedCategory !== 'All' || searchQuery || sortBy !== 'featured') && (
          <button
            id="btn-reset-filters"
            onClick={handleResetFilters}
            className="text-xs font-bold text-[#e94560] hover:text-[#ff5a77] hover:underline cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Grid Display */}
      {filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-gray-800 bg-[#1a1a2e]/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 border border-gray-850 text-gray-500 mb-4">
            <Eye className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Aucun produit ne correspond</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6">
            Essayez de modifier vos filtres ou effectuez une autre recherche pour trouver ce que vous cherchez.
          </p>
          <button
            id="btn-fallback-reset"
            onClick={handleResetFilters}
            className="rounded-lg bg-[#e94560] hover:bg-[#ff5a77] text-white font-semibold py-2.5 px-5 text-sm transition-all shadow-md shadow-[#e94560]/10"
          >
            Afficher tous les produits
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
            <p>Affichage de {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} sur {products.length}</p>
            <p>Dernière mise à jour : il y a 10 min</p>
          </div>
        </>
      )}
    </section>
  );
};
