import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../useCart';
import { WhatsAppCheckout } from './WhatsAppCheckout';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchantPhoneNumber?: string; // e.g., "22890000000"
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  merchantPhoneNumber = '22890000000', // Default number if not specified
}) => {
  const { cart, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();
  const formatFCFA = (num: number) => new Intl.NumberFormat('fr-FR').format(num);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark overlay backdrop */}
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen max-w-md transform bg-[#1a1a2e] border-l border-white/10 text-white shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Main flex layout inside the panel */}
          <div className="flex h-full flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-6 sm:px-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#ffd700]" />
                <h2 className="text-lg font-bold text-white font-heading" id="slide-over-title">
                  Mon Panier
                </h2>
              </div>
              <button
                id="btn-close-cart"
                type="button"
                className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-[#16213e] hover:text-white transition-all"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 scrollbar-thin">
              {cart.length === 0 ? (
                /* Empty state */
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e94560]/10 text-[#e94560] mb-4">
                    <ShoppingCart className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Votre panier est vide</h3>
                  <p className="text-sm text-gray-400 max-w-xs mb-6">
                    Découvrez nos articles et ajoutez-les au panier pour commander facilement.
                  </p>
                  <button
                    id="btn-back-to-catalog"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 hover:text-[#ffd700]"
                  >
                    <span>Retour au catalogue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Items present */
                <div className="space-y-3">
                  {cart.map((item) => {
                    const itemSubtotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        id={`cart-item-${item.id}`}
                        className="flex items-center gap-3 bg-[#16213e] p-3 rounded-lg border border-white/5 shadow-md"
                      >
                        {/* Thumbnail */}
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-950 border border-white/5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col min-w-0">
                          <div className="flex justify-between gap-2">
                            <span className="text-xs font-bold text-white truncate">{item.name}</span>
                            <span className="text-xs font-bold text-[#ffd700] whitespace-nowrap">
                              {formatFCFA(itemSubtotal)} FCFA
                            </span>
                          </div>
                          
                          <span className="text-[10px] text-gray-500 mt-0.5">
                            Unit: {formatFCFA(item.price)} FCFA
                          </span>

                          {/* Controls & Delete */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5 bg-[#1a1a2e] border border-white/10 rounded p-0.5">
                              <button
                                id={`btn-decrease-qty-${item.id}`}
                                className="p-0.5 rounded text-gray-400 hover:bg-[#16213e] hover:text-white transition-all"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold leading-none">{item.quantity}</span>
                              <button
                                id={`btn-increase-qty-${item.id}`}
                                className="p-0.5 rounded text-gray-400 hover:bg-[#16213e] hover:text-white transition-all"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              id={`btn-remove-item-${item.id}`}
                              className="inline-flex items-center p-1 rounded text-gray-500 hover:text-[#e94560] hover:bg-[#e94560]/10 transition-all border border-transparent hover:border-[#e94560]/20"
                              onClick={() => removeItem(item.id)}
                              title="Retirer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

             {/* Footer with summary and Whatsapp Checkout */}
             {cart.length > 0 && (
               <div className="p-6 bg-[#0f0f1d] border-t border-white/10 space-y-4">
                 <div className="space-y-1.5">
                   <div className="flex justify-between text-xs text-gray-400">
                     <span>Produits ajoutés</span>
                     <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} articles</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-2.5">
                     <span>Total estimé</span>
                     <span className="text-[#ffd700] text-lg font-black font-heading">{formatFCFA(total)} FCFA</span>
                   </div>
                 </div>
 
                 <div className="flex flex-col gap-2">
                   <WhatsAppCheckout 
                     items={cart} 
                     phoneNumber={merchantPhoneNumber} 
                     onSuccess={() => {
                       // Optional: clear cart on successful redirect or keep it.
                     }}
                   />
                   <button
                     id="btn-clear-cart"
                     onClick={clearCart}
                     className="w-full text-center text-xs font-semibold text-gray-500 hover:text-[#e94560] transition-colors py-1.5 uppercase tracking-wider"
                   >
                     Vider le panier
                   </button>
                 </div>
                 
                 <p className="text-[10px] text-center text-gray-500 leading-normal px-2 italic uppercase tracking-wider font-semibold">
                   Paiement à la livraison
                 </p>
               </div>
             )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
