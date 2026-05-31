import React, { useState, useEffect } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../useCart';
import { Product } from '../types';

export interface ProductCardProps {
  product: Product;
}

const optimizeCloudinaryUrl = (url: string): string => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop';
  }
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/w_400,q_auto,f_webp/');
  }
  return url;
};

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price) + ' FCFA';
  const imageUrl = optimizeCloudinaryUrl(product.image);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    
    setAdded(true);
  };

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => {
      setAdded(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-[#1a1a2e] border border-white/5 shadow-lg transition-all duration-300 hover:border-white/10 hover:shadow-2xl ${
        isOutOfStock ? 'opacity-80' : ''
      }`}
      id={`product-card-${product.id}`}
    >
      {/* Target elements for styling and scripting need unique IDs */}
      {/* Category Badge & Availability */}
      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2">
        <span className="bg-[#e94560] text-[10px] px-2 py-1 rounded font-bold uppercase text-white tracking-wider">
          {product.category}
        </span>
        {!isOutOfStock && product.stock <= 3 && (
          <span className="rounded bg-[#ffd700] px-2 py-1 text-[10px] font-bold text-[#1a1a2e]">
            {product.stock} RESTANT{product.stock > 1 ? 'S' : ''}
          </span>
        )}
      </div>

      {/* Image Container with aspect ratio and overlay */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-950">
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center font-bold text-xs tracking-widest text-[#e94560] uppercase z-10 font-heading">
            Rupture de Stock
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Subtle shadow on top to read badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/40 to-transparent pointer-events-none" />
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-white group-hover:text-[#e94560] transition-colors duration-200 line-clamp-1 font-heading">
          {product.name}
        </h3>
        
        <p className="mt-1 text-xs text-gray-400 line-clamp-2 flex-grow min-h-[2rem]">
          {product.description}
        </p>

        {/* Price & Buy Button */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Prix</span>
            <span className="text-base font-bold text-[#ffd700] tracking-tight font-heading">{formattedPrice}</span>
          </div>

          <button
            id={`btn-add-to-cart-${product.id}`}
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-350 ${
              isOutOfStock
                ? 'cursor-not-allowed bg-gray-800 text-gray-500 border border-gray-700/50'
                : added
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                : 'bg-[#e94560] text-white hover:bg-[#ff4d6d] active:scale-95 shadow-lg shadow-[#e94560]/10 hover:shadow-[#e94560]/20'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4.5 w-4.5 animate-[scale_0.2s_ease-out]" />
                <span>Ajouté</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>Découvrir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
