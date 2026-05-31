import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#1a1a2e] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Shop Name */}
        <div id="header-logo-group" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffd700] rounded-lg flex items-center justify-center text-[#1a1a2e] font-extrabold text-xl font-heading shadow-md shadow-[#ffd700]/10">
            W
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#ffd700] sm:text-xl font-heading uppercase">
              W-SHOP
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-0.5">WhatsApp Commerce</p>
          </div>
        </div>

        {/* Center / Navigation Info to match the Sleek Theme */}
        <nav id="header-navbar" className="hidden space-x-8 text-sm font-medium md:flex">
          <a href="#" className="text-gray-300 hover:text-[#ffd700] transition-colors">Vêtements</a>
          <a href="#catalogue" className="text-[#ffd700] transition-colors font-semibold">Produits</a>
          <a href="#about" className="text-gray-300 hover:text-[#ffd700] transition-colors">Aide</a>
        </nav>

        {/* Cart Trigger Button designed as the Sleek red interactive badge */}
        <button
          id="btn-open-cart"
          onClick={onCartClick}
          className="relative flex items-center gap-2 bg-[#e94560] hover:bg-[#ff4d6d] px-4 py-2 rounded-full cursor-pointer transition-all duration-300 active:scale-95 text-white font-bold shadow-lg shadow-[#e94560]/20"
          aria-label="Ouvrir le panier"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          <AnimatePresence mode="wait">
            <motion.span
              key={cartCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="font-bold text-sm min-w-[0.75rem] text-center"
            >
              {cartCount}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
};
