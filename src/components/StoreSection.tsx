import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, Plus, Minus, Star, ChevronRight, 
  Check, Filter, Truck, ShieldCheck, X, Sparkles, ShoppingCart, HelpCircle
} from 'lucide-react';
import { Product, CartItem, Lead } from '../types';

// Dynamic pest control products list and categories mapping are passed as props from App state.

interface StoreSectionProps {
  onAddLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
  onGoHome: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Dynamic Catalog States passed from parent
  products: Product[];
  categories: { [key: string]: string };
}

export default function StoreSection({ 
  onAddLead, 
  onGoHome,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
  products,
  categories
}: StoreSectionProps) {
  // Store States
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Billing Form States
  const [billingName, setBillingName] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingNotes, setBillingNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Filter and Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;
    const matchesStock = !onlyInStock || product.inStock;
    return matchesCategory && matchesPrice && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating_desc') return b.rating - a.rating;
    return 0; // Default or popular
  });

  // Shopping Cart Actions
  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open cart automatically on first item added to give instant feedback
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingLimit = 1500;
  const shippingCost = cartSubtotal >= freeShippingLimit || cartSubtotal === 0 ? 0 : 180;
  const cartTotal = cartSubtotal + shippingCost;
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Handle Checkout Order Form
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Create description of order items
    const itemsDescription = cart.map((item) => 
      `${item.product.name} (x${item.quantity})`
    ).join(', ');

    // Register inside Leads console as an order-type lead
    onAddLead({
      name: billingName,
      phone: billingPhone,
      pestType: 'otros', // General
      infestationLevel: 'bajo',
      notes: `PEDIDO TIENDA ONLINE: ${itemsDescription}. Notas de entrega: ${billingNotes}. Correo: ${billingEmail}. Dirección: ${billingAddress}. Método de pago: ${paymentMethod}`,
      orderItems: itemsDescription,
      orderTotal: cartTotal
    });

    // Format professional WhatsApp summary
    const formattedItems = cart.map((item) => 
      `• *${item.product.name}* (Cant: ${item.quantity}) - $${(item.product.price * item.quantity).toLocaleString('es-VE')}`
    ).join('\n');
    
    const waMessage = `*NUEVO PEDIDO - TELLEX VENEZUELA* 🛒\n\n` +
      `*Cliente:* ${billingName}\n` +
      `*Teléfono:* ${billingPhone}\n` +
      `*Email:* ${billingEmail}\n` +
      `*Dirección de Entrega:* ${billingAddress}\n` +
      `*Método de Pago:* ${paymentMethod === 'efectivo' ? 'Efectivo al recibir 💵' : paymentMethod === 'transferencia' ? 'Transferencia Bancaria / Pago Móvil 🏦' : 'Tarjeta (Terminal en sitio) 💳'}\n` +
      `*Notas de entrega:* ${billingNotes || 'Ninguna'}\n\n` +
      `*PRODUCTOS ADQUIRIDOS:*\n${formattedItems}\n\n` +
      `*Subtotal:* $${cartSubtotal.toLocaleString('es-VE')} USD\n` +
      `*Costo de Envío:* ${shippingCost === 0 ? '¡Gratis! 🚚' : `$${shippingCost.toLocaleString('es-VE')} USD`}\n` +
      `*TOTAL DEL PEDIDO:* *$${cartTotal.toLocaleString('es-VE')} USD*`;

    const phoneNumber = '584142338654'; // Caracas, Venezuela
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Simulated Order ID
    const generatedOrderId = `TELLEX-VE-${Math.floor(100000 + Math.random() * 900000)}`;
    setCheckoutSuccess(generatedOrderId);
    
    // Clear cart and form
    setCart([]);
  };

  const resetCheckout = () => {
    setCheckoutSuccess(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setBillingName('');
    setBillingPhone('');
    setBillingEmail('');
    setBillingAddress('');
    setBillingNotes('');
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16" id="woocommerce-store-container">
      {/* Banner / Store Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-6 mb-8" id="store-hero-banner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="hover:text-[#ca531a] cursor-pointer" onClick={onGoHome}>Inicio</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-800 font-medium">Tienda de Productos Profesionales</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#ca531a]" />
              Tienda Oficial TELLEX
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Fórmulas y equipamiento de grado comercial utilizados por nuestros técnicos certificados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white border border-slate-200 hover:border-[#ca531a] px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-3 text-slate-800 relative cursor-pointer"
              id="cart-trigger-floating"
            >
              <ShoppingCart className="w-5 h-5 text-[#ca531a]" />
              <span className="font-semibold text-sm">Carrito</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#ca531a] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main WooCommerce Grid Layout */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - WooCommerce Filters */}
          <aside className="lg:col-span-1 space-y-6" id="woocommerce-sidebar">
            
            {/* Store Categories Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">
                Categorías de Productos
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {Object.entries(categories).map(([key, label]) => (
                  <li key={key}>
                    <button
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === key
                          ? 'bg-[#ca531a]/10 text-[#ca531a] font-bold'
                          : 'hover:bg-slate-50 hover:text-[#ca531a]'
                      }`}
                      id={`cat-filter-${key}`}
                    >
                      <span>{label}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full">
                        {key === 'todos' 
                          ? products.length 
                          : products.filter(p => p.category === key).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">
                Filtrar por Precio
              </h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="range"
                    min="100"
                    max="6000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#ca531a]"
                    id="price-range-slider"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
                    <span>Mín: $100 USD</span>
                    <span>Máx: ${maxPrice.toLocaleString('es-VE')} USD</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setMaxPrice(6000)}
                    className="text-xs text-slate-500 hover:text-[#ca531a] transition-colors py-1.5 px-3 bg-slate-50 rounded-lg w-full font-semibold border border-slate-100"
                  >
                    Restaurar
                  </button>
                </div>
              </div>
            </div>

            {/* Availability Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">
                Estado de Stock
              </h3>
              <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#ca531a] focus:ring-[#ca531a] w-4 h-4 accent-[#ca531a]"
                  id="stock-filter"
                />
                <span>Mostrar solo disponibles</span>
              </label>
            </div>

            {/* Professional Seal / WooCommerce Guarantee */}
            <div className="bg-[#24411a]/5 rounded-2xl border border-[#24411a]/15 p-5 text-center">
              <ShieldCheck className="w-8 h-8 text-[#24411a] mx-auto mb-2" />
              <h4 className="font-bold text-[#24411a] text-xs uppercase tracking-wider">Calidad Garantizada</h4>
              <p className="text-xs text-[#24411a]/80 mt-1">
                Todos nuestros productos químicos cuentan con registro sanitario y certificaciones ambientales correspondientes.
              </p>
            </div>

          </aside>

          {/* Right Area - WooCommerce Products Grid */}
          <main className="lg:col-span-3 space-y-6" id="woocommerce-products-grid">
            
            {/* Header controls (Sorting, items found) */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <p className="text-sm text-slate-600 font-medium">
                Mostrando <span className="font-bold text-[#ca531a]">{filteredProducts.length}</span> de <span className="font-bold text-slate-800">{products.length}</span> productos
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  Ordenar:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#ca531a] focus:bg-white transition-colors"
                  id="woocommerce-sort"
                >
                  <option value="default">Recomendados</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                  <option value="rating_desc">Más Calificados</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl py-16 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">No encontramos resultados</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  No hay productos que coincidan con tus filtros actuales. Intenta ampliando el rango de precio o cambiando de categoría.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('todos');
                    setMaxPrice(6000);
                    setOnlyInStock(false);
                  }}
                  className="mt-5 text-xs font-bold text-white bg-[#ca531a] px-5 py-2.5 rounded-full hover:bg-[#ca531a]/95 transition-all shadow-md"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group relative cursor-pointer"
                      id={`product-card-${product.id}`}
                      onClick={() => setSelectedProductForModal(product)}
                    >
                      {/* Product Badges (Offer, Best Seller, New) */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 text-[10px] font-bold">
                        {product.isOffer && (
                          <span className="bg-[#ca531a] text-white px-2 py-1 rounded-full uppercase shadow-sm flex items-center gap-1">
                            ¡Oferta!
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-[#24411a] text-white px-2 py-1 rounded-full uppercase shadow-sm flex items-center gap-1">
                            Destacado
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full uppercase shadow-sm flex items-center gap-1">
                            Nuevo
                          </span>
                        )}
                      </div>

                      {/* Product Visual Container (WooCommerce Box) */}
                      <div className="h-72 md:h-80 bg-slate-100 flex items-center justify-center text-6xl group-hover:scale-101 transition-transform duration-500 select-none relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none"></div>
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

                      {/* Product Specs */}
                      <div className="p-5 flex-1 flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#24411a] mb-1">
                          {categories[product.category] || product.category}
                        </span>
                        
                        <h4 className="font-extrabold text-slate-900 group-hover:text-[#ca531a] transition-colors text-xl md:text-2xl line-clamp-1">
                          {product.name}
                        </h4>

                        {/* Ratings */}
                        <div className="flex items-center gap-1.5 mt-1.5 mb-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(product.rating)
                                    ? 'fill-current'
                                    : 'text-slate-200'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-400 font-semibold">({product.reviewsCount})</span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {product.description}
                        </p>

                        {/* Price & Cart CTA */}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 line-through block font-medium">
                                ${product.originalPrice.toLocaleString('es-VE')}
                              </span>
                            )}
                            <span className="text-2xl md:text-3xl font-black text-[#ca531a]">
                              ${product.price.toLocaleString('es-VE')} <span className="text-xs font-normal text-slate-500">USD</span>
                            </span>
                          </div>

                          {product.inStock ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className="bg-[#ca531a] hover:bg-[#ca531a]/95 text-white p-2.5 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center cursor-pointer"
                              title="Añadir al carrito"
                            >
                              <ShoppingBag className="w-5 h-5" />
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl">
                              Agotado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cart Drawer / Slide-over (Right Side Panel) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="shopping-cart-overlay">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Cart Panel Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-200"
              id="shopping-cart-drawer"
            >
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#ca531a]" />
                    Tu Carrito de Compra
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ({totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'})
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ShoppingBag className="w-16 h-16 text-slate-200 mb-4 animate-bounce" />
                    <h4 className="font-bold text-slate-800 text-base">Tu carrito está vacío</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                      Explora la tienda y agrega los productos de grado profesional que necesites para el control de plagas en tu hogar u oficina.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 text-xs font-bold text-[#ca531a] hover:text-[#ca531a]/80"
                    >
                      Continuar comprando
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100"
                    >
                      <div className="w-12 h-12 bg-slate-200/60 rounded-xl select-none flex items-center justify-center overflow-hidden shrink-0">
                        {item.product.image.startsWith('http') ? (
                          <img src={item.product.image} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" alt={item.product.name} />
                        ) : (
                          <span className="text-2xl">{item.product.image}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-slate-800 font-extrabold text-xs block mt-0.5">
                          ${(item.product.price * item.quantity).toLocaleString('es-VE')} USD
                        </span>
                        
                        {/* Quantity adjust */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 bg-white hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 bg-white hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                  
                  {/* Shipping Indicator */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#ca531a] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      {cartSubtotal >= freeShippingLimit ? (
                        <p className="font-bold text-[#24411a]">
                          ¡Calificas para Envío Gratis!
                        </p>
                      ) : (
                        <p className="text-slate-600">
                          Agrega <span className="font-bold text-[#ca531a]">${(freeShippingLimit - cartSubtotal).toLocaleString('es-VE')}</span> más para obtener <span className="font-bold">Envío Gratis</span>.
                        </p>
                      )}
                      <p className="text-slate-400 mt-0.5 text-[10px]">
                        Entregas locales seguras en un lapso de 24 a 48 horas.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">${cartSubtotal.toLocaleString('es-VE')} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costo de Envío</span>
                      <span className="font-semibold text-slate-900">
                        {shippingCost === 0 ? 'Gratis' : `$${shippingCost} USD`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                      <span>Total</span>
                      <span className="text-lg text-[#ca531a]">${cartTotal.toLocaleString('es-VE')} USD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white py-3.5 rounded-full font-bold shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Finalizar Compra
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal Dialog (WooCommerce billing details Form) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="checkout-modal-overlay">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
              id="checkout-modal"
            >
              {checkoutSuccess ? (
                // Success screen
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-2xl">¡Pedido Recibido con Éxito!</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Tu pedido ha sido registrado con el identificador <span className="font-bold text-[#ca531a]">{checkoutSuccess}</span>. Un especialista técnico se pondrá en contacto a tu teléfono para agendar la entrega y recibir tu pago.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 mt-4">
                    <p className="text-slate-500 font-medium">RESUMEN DE CLIENTE:</p>
                    <p><span className="text-slate-400">Nombre:</span> <span className="font-semibold">{billingName}</span></p>
                    <p><span className="text-slate-400">Teléfono:</span> <span className="font-semibold">{billingPhone}</span></p>
                    <p><span className="text-slate-400">Total a Pagar:</span> <span className="font-extrabold text-[#ca531a]">${cartTotal.toLocaleString('es-VE')} USD</span></p>
                    <p><span className="text-slate-400">Método de Pago:</span> <span className="font-semibold capitalize">{paymentMethod}</span></p>
                  </div>

                  <button
                    onClick={resetCheckout}
                    className="mt-6 bg-[#24411a] hover:bg-[#24411a]/95 text-white font-bold py-3 px-8 rounded-full shadow transition-all cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              ) : (
                // Checkout Form
                <form onSubmit={handlePlaceOrder} className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">Detalles de Facturación y Entrega</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Estilo WooCommerce Checkout Seguro</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Fields */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    
                    {/* Summary widget */}
                    <div className="bg-[#ca531a]/5 border border-[#ca531a]/15 p-4 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="text-slate-500 block">Total del Pedido</span>
                        <span className="text-base font-extrabold text-[#ca531a]">${cartTotal.toLocaleString('es-VE')} USD</span>
                      </div>
                      <span className="bg-white text-[#ca531a] border border-[#ca531a]/20 font-bold px-3 py-1 rounded-full text-[10px]">
                        Pago a la entrega
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Roberto Palazuelos"
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:ring-1 focus:ring-[#ca531a]/25 transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Teléfono de Contacto *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Ej: 0414 123 4567"
                          value={billingPhone}
                          onChange={(e) => setBillingPhone(e.target.value)}
                          className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:ring-1 focus:ring-[#ca531a]/25 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ej: roberto@empresa.com"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:ring-1 focus:ring-[#ca531a]/25 transition-all"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Dirección Completa de Entrega *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Calle, Número, Colonia, Municipio, Código Postal"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:ring-1 focus:ring-[#ca531a]/25 transition-all resize-none"
                      />
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Método de Pago Preferido *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label className={`flex items-center gap-2 p-3 border rounded-xl text-xs cursor-pointer transition-all ${
                          paymentMethod === 'efectivo'
                            ? 'border-[#ca531a] bg-[#ca531a]/5 text-[#ca531a] font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}>
                          <input
                            type="radio"
                            name="payment_method"
                            checked={paymentMethod === 'efectivo'}
                            onChange={() => setPaymentMethod('efectivo')}
                            className="accent-[#ca531a] hidden"
                          />
                          <span>💵 Efectivo al recibir</span>
                        </label>

                        <label className={`flex items-center gap-2 p-3 border rounded-xl text-xs cursor-pointer transition-all ${
                          paymentMethod === 'transferencia'
                            ? 'border-[#ca531a] bg-[#ca531a]/5 text-[#ca531a] font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}>
                          <input
                            type="radio"
                            name="payment_method"
                            checked={paymentMethod === 'transferencia'}
                            onChange={() => setPaymentMethod('transferencia')}
                            className="accent-[#ca531a] hidden"
                          />
                          <span>🏦 Transf. SPEI</span>
                        </label>

                        <label className={`flex items-center gap-2 p-3 border rounded-xl text-xs cursor-pointer transition-all ${
                          paymentMethod === 'tarjeta'
                            ? 'border-[#ca531a] bg-[#ca531a]/5 text-[#ca531a] font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}>
                          <input
                            type="radio"
                            name="payment_method"
                            checked={paymentMethod === 'tarjeta'}
                            onChange={() => setPaymentMethod('tarjeta')}
                            className="accent-[#ca531a] hidden"
                          />
                          <span>💳 Tarjeta (Terminal)</span>
                        </label>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Notas Adicionales (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Indicaciones especiales de entrega o portón."
                        value={billingNotes}
                        onChange={(e) => setBillingNotes(e.target.value)}
                        className="w-full text-sm px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:ring-1 focus:ring-[#ca531a]/25 transition-all resize-none"
                      />
                    </div>

                  </div>

                  {/* Footer actions */}
                  <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm cursor-pointer text-center"
                    >
                      Realizar el Pedido (Pagar al Recibir)
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      Al confirmar, tu pedido será agendado de forma inmediata en nuestra consola de servicios.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Pop-up Modal */}
      <AnimatePresence>
        {selectedProductForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="product-detail-modal-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductForModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col"
              id="product-detail-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-all z-20 cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
                {/* Visual Header */}
                <div className="h-56 bg-slate-100 rounded-2xl flex items-center justify-center text-7xl select-none relative shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-200/40 to-transparent pointer-events-none"></div>
                  {selectedProductForModal.image.startsWith('http') ? (
                    <img src={selectedProductForModal.image} className="w-full h-full object-contain p-6" referrerPolicy="no-referrer" alt={selectedProductForModal.name} />
                  ) : (
                    selectedProductForModal.image
                  )}
                  
                  {/* Category badge */}
                  <span className="absolute bottom-4 left-4 text-[10px] font-extrabold uppercase tracking-widest text-white bg-[#24411a] px-3 py-1 rounded-full shadow">
                    {categories[selectedProductForModal.category] || selectedProductForModal.category}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {selectedProductForModal.name}
                    </h3>
                    
                    {/* Rating stars */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedProductForModal.rating)
                                ? 'fill-current'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">({selectedProductForModal.reviewsCount} opiniones)</span>
                    </div>
                  </div>

                  {/* Stock status indicator */}
                  <div>
                    {selectedProductForModal.inStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Check className="w-3.5 h-3.5" /> En Stock - Entrega Exprés en Caracas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                        <X className="w-3.5 h-3.5" /> Temporalmente Agotado
                      </span>
                    )}
                  </div>

                  {/* Pricing and description */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-baseline gap-2">
                      {selectedProductForModal.originalPrice && (
                        <span className="text-sm text-slate-400 line-through font-medium">
                          ${selectedProductForModal.originalPrice.toLocaleString('es-VE')}
                        </span>
                      )}
                      <span className="text-2xl font-black text-[#ca531a]">
                        ${selectedProductForModal.price.toLocaleString('es-VE')} <span className="text-xs font-normal text-slate-500">USD</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {selectedProductForModal.description}
                    </p>
                  </div>

                  {/* Specifications list */}
                  <div className="text-xs space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Especificaciones Técnicas:</h4>
                    <ul className="grid grid-cols-2 gap-2 text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                      <li>• Toxicidad: <span className="font-semibold text-slate-800">Bajo (Seguro)</span></li>
                      <li>• Efecto Residual: <span className="font-semibold text-slate-800">Hasta 12 meses</span></li>
                      <li>• Origen: <span className="font-semibold text-slate-800">Importado</span></li>
                      <li>• Registro Sanitario: <span className="font-semibold text-slate-800">Aprobado</span></li>
                    </ul>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="pt-2">
                  {selectedProductForModal.inStock ? (
                    <button
                      onClick={() => {
                        addToCart(selectedProductForModal);
                        setSelectedProductForModal(null);
                      }}
                      className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Añadir al Carrito
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-100 text-slate-400 py-4 rounded-full font-bold text-sm cursor-not-allowed"
                    >
                      Producto Agotado
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
