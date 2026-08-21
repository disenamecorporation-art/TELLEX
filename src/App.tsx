import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrustBar from './components/TrustBar';
import ServicesSection from './components/ServicesSection';
import WorkProcess from './components/WorkProcess';
import WhyTellex from './components/WhyTellex';
import TestimonialsSection from './components/TestimonialsSection';
import ImpactStats from './components/ImpactStats';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDrawer from './components/AdminDrawer';
import StoreSection from './components/StoreSection';
import FeaturedProducts from './components/FeaturedProducts';
import { Lead, CartItem, Product } from './types';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedPest, setPreselectedPest] = useState<'termitas' | 'roedores' | 'insectos' | 'otros'>('termitas');
  const [currentTab, setCurrentTab] = useState<'home' | 'tienda'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentTab]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('tellex_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('tellex_cart', JSON.stringify(cart));
  }, [cart]);

  // Load leads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tellex_leads');
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading leads from localStorage', e);
      }
    }
  }, []);

  // Sync leads to localStorage
  const saveLeads = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('tellex_leads', JSON.stringify(updatedLeads));
  };

  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pendiente',
      createdAt: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const updated = [newLead, ...leads];
    saveLeads(updated);
  };

  const handleAddToCart = (product: Product) => {
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
    setIsCartOpen(true);
    setCurrentTab('tienda');
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    saveLeads(updated);
  };

  const handleUpdateStatus = (id: string, status: Lead['status']) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    saveLeads(updated);
  };

  const handleAddDemoLeads = () => {
    const demoLeads: Lead[] = [
      {
        id: 'lead_demo1',
        name: 'Carlos Mendoza',
        phone: '0414 233 8654',
        pestType: 'termitas',
        infestationLevel: 'critico',
        status: 'pendiente',
        createdAt: '18 ago 2026, 14:35',
        notes: 'La viga de madera del salón principal tiene muestras de polilla activa. Requiere inspección.',
      },
      {
        id: 'lead_demo2',
        name: 'María Alejandra Silva',
        phone: '0412 876 5432',
        pestType: 'roedores',
        infestationLevel: 'medio',
        status: 'contactado',
        createdAt: '19 ago 2026, 09:12',
        notes: 'Se escuchan ruidos en los techos rasos por las noches. Posible nido de roedores.',
      },
      {
        id: 'lead_demo3',
        name: 'Dr. Hugo López',
        phone: '0416 121 3434',
        pestType: 'insectos',
        infestationLevel: 'bajo',
        status: 'completado',
        createdAt: '20 ago 2026, 11:22',
        notes: 'Fumigación regular preventiva para consultorio médico en Las Mercedes.',
      },
    ];
    saveLeads(demoLeads);
  };

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80; // height of the sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectService = (pestType: 'termitas' | 'roedores' | 'insectos') => {
    setPreselectedPest(pestType);
    scrollToSection('#contacto');
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#ca531a]/20 selection:text-[#ca531a]" id="app-wrapper">
      {/* Sticky Top Header */}
      <Header
        onQuoteClick={() => {
          setCurrentTab('home');
          setTimeout(() => scrollToSection('#contacto'), 100);
        }}
        onAdminClick={() => setIsAdminOpen(true)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartItemsCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => {
          setCurrentTab('tienda');
          setIsCartOpen(true);
        }}
      />

      {/* Main Content Modules */}
      <main id="app-main">
        {currentTab === 'home' ? (
          <>
            {/* 1. Hero Section with dynamic overlays */}
            <HeroSection
              onQuoteClick={() => scrollToSection('#contacto')}
              onWorkClick={() => scrollToSection('#nosotros')}
            />

            {/* 2. Trust Bar (Fondo #24411a) */}
            <TrustBar />

            {/* 3. Services Grid (Termitas, Roedores, Insectos) */}
            <ServicesSection onSelectService={handleSelectService} />

            {/* Productos Destacados */}
            <FeaturedProducts 
              onAddToCart={handleAddToCart} 
              onGoToStore={() => setCurrentTab('tienda')} 
            />

            {/* 4. Process Horizontal Timeline (4 pasos) */}
            <WorkProcess />

            {/* 5. Why TELLEX Section (Diferencia Tecnológica & Comparativa) */}
            <WhyTellex />

            {/* 6. Client Feedback Section (Carousel interactivo) */}
            <TestimonialsSection />

            {/* 7. Animated Counter Impact Stats */}
            <ImpactStats />

            {/* 8. Final CTA with Lead Catcher Form */}
            <FinalCTA onAddLead={handleAddLead} preselectedPest={preselectedPest} />
          </>
        ) : (
          <StoreSection
            onAddLead={handleAddLead}
            onGoHome={() => setCurrentTab('home')}
            cart={cart}
            setCart={setCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        )}
      </main>

      {/* 9. Premium Footer with Illustrated Coverage Map */}
      <Footer onTabChange={setCurrentTab} currentTab={currentTab} />

      {/* 10. WhatsApp Floating Interactive Support */}
      <WhatsAppButton />

      {/* 11. Leads Management Console (Admin drawer) */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        leads={leads}
        onDeleteLead={handleDeleteLead}
        onUpdateStatus={handleUpdateStatus}
        onAddDemoLeads={handleAddDemoLeads}
      />
    </div>
  );
}
