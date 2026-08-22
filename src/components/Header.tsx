import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User as UserIcon, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface HeaderProps {
  onQuoteClick: () => void;
  onAdminClick: () => void;
  currentTab: 'home' | 'tienda';
  onTabChange: (tab: 'home' | 'tienda') => void;
  cartItemsCount: number;
  onOpenCart: () => void;
  
  // Auth Integration props
  currentUser: User | null;
  onOpenAuth: () => void;
}

export default function Header({ 
  onQuoteClick, 
  onAdminClick, 
  currentTab, 
  onTabChange,
  cartItemsCount,
  onOpenCart,
  currentUser,
  onOpenAuth
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Inicio', href: '#inicio', tab: 'home' as const },
    { label: 'Servicios', href: '#servicios', tab: 'home' as const },
    { label: 'Nosotros', href: '#nosotros', tab: 'home' as const },
    { label: 'Testimonios', href: '#testimonios', tab: 'home' as const },
    { label: 'Contacto', href: '#contacto', tab: 'home' as const },
    { label: 'Tienda', href: '#tienda', tab: 'tienda' as const },
  ];

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof menuItems[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (item.tab !== currentTab) {
      onTabChange(item.tab);
      if (item.tab === 'home' && item.href !== '#inicio') {
        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (item.tab === 'home') {
        const element = document.querySelector(item.href);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-100'
            : 'bg-transparent py-4'
        }`}
        id="main-header"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Section */}
          <a 
            href="#inicio" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center" 
            id="logo-link"
          >
            <img
              src="https://i.postimg.cc/ZnZs8N5j/logoweb-tellex.png"
              alt="TELLEX logo"
              referrerPolicy="no-referrer"
              className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </a>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-8" id="desktop-nav">
            {menuItems.map((item) => {
              const isActive = (item.tab === currentTab && currentTab === 'tienda') || 
                               (currentTab === 'home' && item.tab === 'home' && item.label !== 'Tienda');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`font-medium text-sm transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#ca531a] after:transition-all hover:after:w-full ${
                    isActive 
                      ? 'text-[#ca531a] font-bold' 
                      : 'text-slate-700 hover:text-[#ca531a]'
                  }`}
                  id={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Shopping Cart Header Icon - Solid orange background with high-contrast, wiggling and jumping when items present */}
            <motion.button
              onClick={onOpenCart}
              className="bg-[#ca531a] hover:bg-[#ca531a]/95 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all relative cursor-pointer flex items-center justify-center"
              id="header-cart-icon-btn"
              title="Ver Carrito de Compras"
              animate={cartItemsCount > 0 ? {
                y: [0, -10, 0, -5, 0],
                rotate: [0, -8, 8, -8, 8, 0],
              } : {}}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#24411a] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs px-4.5 py-3 rounded-full transition-all cursor-pointer shadow-sm shrink-0"
                id="header-user-btn"
              >
                <div className="w-5.5 h-5.5 bg-[#ca531a] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                {currentUser.role === 'admin' && (
                  <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5 text-amber-700" /> ADM
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-full transition-all cursor-pointer shrink-0"
                id="header-login-btn"
              >
                Mi Cuenta
              </button>
            )}

            <button
              onClick={() => {
                onTabChange('home');
                setTimeout(() => {
                  const contactSec = document.querySelector('#contacto');
                  if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="bg-[#24411a] hover:bg-[#24411a]/90 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              id="header-cta-btn"
            >
              Cotiza Ahora
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Cart Trigger */}
            <motion.button
              onClick={onOpenCart}
              className="bg-[#ca531a] hover:bg-[#ca531a]/95 text-white p-2.5 rounded-full shadow relative flex items-center justify-center cursor-pointer"
              id="mobile-header-cart"
              animate={cartItemsCount > 0 ? {
                y: [0, -8, 0, -4, 0],
                rotate: [0, -6, 6, -6, 6, 0],
              } : {}}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            >
              <ShoppingCart className="w-4.5 h-4.5 text-white" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#24411a] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-800 hover:text-[#ca531a] transition-colors p-2"
              aria-label="Abrir menú"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] md:top-[88px] left-0 right-0 bg-white z-30 shadow-lg border-b border-slate-100 lg:hidden overflow-hidden"
            id="mobile-menu-drawer"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`font-medium text-base transition-colors py-2 border-b border-slate-50 ${
                    item.tab === currentTab ? 'text-[#ca531a] font-bold' : 'text-slate-800 hover:text-[#ca531a]'
                  }`}
                  id={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </a>
              ))}
              {currentUser ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-sm py-3.5 rounded-full transition-all w-full"
                  id="mobile-user-btn"
                >
                  <div className="w-5.5 h-5.5 bg-[#ca531a] text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{currentUser.name} (Mi Cuenta)</span>
                  {currentUser.role === 'admin' && (
                    <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200">
                      ADMIN
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3.5 rounded-full transition-all text-center w-full"
                  id="mobile-login-btn"
                >
                  Mi Cuenta / Iniciar Sesión
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onTabChange('home');
                  setTimeout(() => {
                    const contactSec = document.querySelector('#contacto');
                    if (contactSec) {
                      contactSec.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="bg-[#ca531a] hover:bg-[#ca531a]/90 text-white font-semibold text-center py-3.5 rounded-full mt-2 shadow-md hover:shadow-lg transition-all"
                id="mobile-header-cta-btn"
              >
                Cotiza Ahora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
