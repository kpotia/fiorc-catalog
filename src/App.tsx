import { useState } from 'react';
import { CartProvider } from './CartProvider';
import { useCart } from './useCart';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { Product } from './types';
import productsData from './products.json';
import { MessageSquare, Settings, ArrowRight, CheckCircle2, RotateCcw, Link } from 'lucide-react';

const activeProducts = productsData.products.filter(
  (p) => p.status === 'active'
) as Product[];

function AppContent() {
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('22890000000');
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d1a] bg-radial-[at_top_right,_var(--tw-gradient-stops)] from-[#1a1a2e] via-[#0d0d1a] to-[#050510] font-sans antialiased selection:bg-[#e94560] selection:text-white pb-16">
      
      {/* Top Banner Alert (Simulates Integration Information for Astro) */}
      <div className="bg-gradient-to-r from-[#e94560]/20 via-[#ffd700]/10 to-[#1a1a2e] border-b border-gray-800 text-xs px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#ffd700]" />
            <span>
              <strong>Composant React Hydratable (Islands Astro) prêt !</strong> Conforme au pattern Astro <code>client:visible</code>.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex items-center gap-1 text-[#ffd700] hover:text-white transition-colors"
            >
              <Settings className="h-3 w-3" />
              <span>Simuler le numéro ({whatsappNumber})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Simulation Config Header Panel */}
      {showConfig && (
        <div className="bg-[#1a1a2e]/80 border-b border-gray-800 py-4 px-4 shadow-inner">
          <div className="max-w-md mx-auto space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
              Numéro de téléphone du marchand (format international sans le +) :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Ex. 22890000000"
                className="flex-grow px-4 py-2 bg-black border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#e94560]"
              />
              <button
                onClick={() => setWhatsappNumber('22890000000')}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">
              Ce numéro recevra le message de commande WhatsApp lorsque l'utilisateur cliquera sur le bouton de validation depuis le panier.
            </p>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header cartCount={getItemCount()} onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section (Introduction for showcase & styling context) */}
      <section className="relative overflow-hidden py-16 text-center border-b border-gray-900 bg-radial-[at_top] from-[#e94560]/10 via-[#0d0d1a] to-transparent">
        <div className="max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/5 px-3 py-1 text-xs text-[#ffd700] mb-6">
            <span>⚡ Astro & React Hybrid Island</span>
          </div>
          <h2 className="text-3xl font-black sm:text-5xl tracking-tight text-white leading-tight">
            Votre Boutique en ligne sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e94560] to-[#ffd700]">WhatsApp</span>
          </h2>
          <p className="mt-4 text-base text-gray-400 leading-relaxed">
            Consultez notre catalogue interactif, ajoutez des articles au panier et passez commande directement en un clic. Simple, rapide et sans frottement.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#catalogue"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#e94560] text-white hover:bg-[#ff5a77] px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#e94560]/10 hover:shadow-[#e94560]/20"
            >
              <span>Parcourir le catalogue</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Interactive Product Catalog */}
      <ProductCatalog products={activeProducts} />

      {/* Shopping Cart Sidebar Modal Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        merchantPhoneNumber={whatsappNumber}
      />

      {/* Explanation for developers */}
      <section id="about" className="max-w-4xl mx-auto mt-16 px-6">
        <div className="rounded-2xl border border-gray-800 bg-[#1a1a2e]/40 p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-[#ffd700] h-5 w-5" />
            <span>À propos de cette implémentation</span>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Ce template réutilisable est optimisé pour être importé comme une <strong>Astro Island</strong>. Les filtres, la sélection par catégorie, le panier d'achat ainsi que la synchronisation d'onglets fonctionnent exclusivement côté client sans nécessiter de serveur en arrière-plan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-black/40 border border-gray-850">
              <span className="font-extrabold text-[#e94560] block mb-1.5 uppercase tracking-wide">
                Intégration Astro
              </span>
              <p className="text-gray-400 leading-relaxed">
                Utilisez <code>client:visible</code> pour charger le catalogue dès qu'il entre dans l'écran, réduisant le JS initial au premier chargement.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-gray-850">
              <span className="font-extrabold text-[#ffd700] block mb-1.5 uppercase tracking-wide">
                Local State Sync
              </span>
              <p className="text-gray-400 leading-relaxed">
                Sauvegarde persistante dans le <code>localStorage</code> pour garder le panier en mémoire d'une page à l'autre avec synchronisation en temps réel multi-onglets.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
