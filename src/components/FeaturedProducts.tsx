import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Sparkles, ChevronRight, X } from 'lucide-react';
import { Product } from '../types';

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
  onGoToStore: () => void;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'prod_fendona',
    name: 'Fendona Pro 60 SC',
    description: 'Insecticida concentrado de alto espectro y prolongado efecto residual. Excelente control de chinches, cucarachas y termitas.',
    price: 1450,
    originalPrice: 1800,
    category: 'geles',
    image: 'https://i.postimg.cc/LXX8hXrz/image.png',
    rating: 4.8,
    reviewsCount: 124,
    inStock: true,
    isOffer: true,
    isBestSeller: true
  },
  {
    id: 'prod_maxforce',
    name: 'Gel Maxforce Prime 30g',
    description: 'Cebo insecticida en jeringa de máxima atracción alimentaria. Erradicación total de colonias de cucarachas en cocinas y alacenas.',
    price: 420,
    originalPrice: 490,
    category: 'geles',
    image: 'https://i.postimg.cc/3RcJGhhm/image.png',
    rating: 4.9,
    reviewsCount: 89,
    inStock: true,
    isOffer: true,
    isNew: true
  }
];

export default function FeaturedProducts({ onAddToCart, onGoToStore }: FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleWhatsAppInquiry = (product: Product) => {
    const text = `Hola Tellex, estoy interesado en el producto destacado: *${product.name}* (Precio: $${product.price} USD). ¿Tienen disponibilidad y realizan envíos?`;
    window.open(`https://wa.me/584126107313?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden border-t border-slate-100" id="productos-destacados">
      {/* Decorative background hints */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#ca531a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#24411a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#ca531a] mb-3"
            >
              <Sparkles className="w-3.5 h-3.5" /> Equipamiento Profesional
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-extralight tracking-tight text-slate-900 leading-tight"
            >
              Productos <span className="font-semibold text-[#24411a]">Destacados</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-sm md:text-base text-slate-500 font-light max-w-xl"
            >
              Adquiere los mismos insumos de grado industrial que utilizan nuestros ingenieros certificados de Caracas en el campo de control.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={onGoToStore}
            className="inline-flex items-center gap-2 bg-[#24411a] hover:bg-[#24411a]/95 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 shrink-0 cursor-pointer self-start md:self-auto"
          >
            Ver catálogo completo
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {FEATURED_PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedProduct(product)}
              className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between group relative cursor-pointer"
            >
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 text-[9px] font-bold">
                {product.isBestSeller && (
                  <span className="bg-[#24411a] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Más Vendido
                  </span>
                )}
                {product.isOffer && (
                  <span className="bg-[#ca531a] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Oferta
                  </span>
                )}
              </div>

              <div>
                {/* Image / Emoji Wrapper */}
                <div className="h-72 md:h-80 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl mb-5 group-hover:scale-101 transition-transform duration-300 relative shadow-inner overflow-hidden select-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none" />
                  {product.image.startsWith('http') ? (
                    <img 
                      src={product.image} 
                      className="w-full h-full object-contain p-4 scale-120 group-hover:scale-135 transition-transform duration-500 ease-out" 
                      referrerPolicy="no-referrer" 
                      alt={product.name} 
                    />
                  ) : (
                    product.image
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">({product.reviewsCount})</span>
                </div>

                {/* Name & description */}
                <h3 className="font-black text-slate-900 group-hover:text-[#ca531a] transition-colors text-xl md:text-2xl leading-tight mb-2">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Price & Action row */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                <div>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through block font-medium">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl md:text-3xl font-black text-[#ca531a]">
                    ${product.price} <span className="text-xs font-normal text-slate-400">USD</span>
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="bg-[#ca531a] hover:bg-[#ca531a]/95 text-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer"
                  title="Añadir al carrito"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Pop-up Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="featured-product-modal-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col"
              id="featured-product-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-all z-20 cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
                {/* Visual Header */}
                <div className="h-72 md:h-80 bg-slate-50 rounded-2xl flex items-center justify-center text-7xl select-none relative shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-200/40 to-transparent pointer-events-none"></div>
                  {selectedProduct.image.startsWith('http') ? (
                    <img 
                      src={selectedProduct.image} 
                      className="w-full h-full object-contain p-6 scale-125" 
                      referrerPolicy="no-referrer" 
                      alt={selectedProduct.name} 
                    />
                  ) : (
                    selectedProduct.image
                  )}
                  
                  {/* Category badge */}
                  <span className="absolute bottom-4 left-4 text-[10px] font-extrabold uppercase tracking-widest text-white bg-[#24411a] px-3 py-1 rounded-full shadow">
                    Geles y Líquidos
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {selectedProduct.name}
                    </h3>
                    
                    {/* Rating stars */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {selectedProduct.rating} ({selectedProduct.reviewsCount} opiniones verificadas)
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2.5">
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        ${selectedProduct.originalPrice} USD
                      </span>
                    )}
                    <span className="text-3xl font-black text-[#ca531a]">
                      ${selectedProduct.price} <span className="text-sm font-normal text-slate-500">USD</span>
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-2" />

                  {/* Description */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Descripción del Insumo
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Features Bullets */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <span className="text-[#24411a] font-bold">✓</span> Grado Industrial
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <span className="text-[#24411a] font-bold">✓</span> Seguro p/ Mascotas
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <span className="text-[#24411a] font-bold">✓</span> Alta Resistencia
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <span className="text-[#24411a] font-bold">✓</span> Caracas Delivery
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-bold text-sm py-3 px-5 rounded-full shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Añadir al Carrito
                </button>
                <button
                  onClick={() => handleWhatsAppInquiry(selectedProduct)}
                  className="flex-1 bg-[#24411a] hover:bg-[#24411a]/95 text-white font-bold text-sm py-3 px-5 rounded-full shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Consultar WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

