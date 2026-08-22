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
import AuthModal from './components/AuthModal';
import { getSupabase } from './lib/supabase';
import { Lead, CartItem, Product, User } from './types';

const DEFAULT_PRODUCTS: Product[] = [
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

const DEFAULT_CATEGORIES = {
  todos: 'Todos los Productos',
  geles: 'Insecticidas y Geles',
  trampas: 'Raticidas y Trampas',
  aspersores: 'Equipamiento de Aspersión',
  proteccion: 'Protección y Seguridad'
};

const DEFAULT_USERS: User[] = [
  {
    id: 'admin_1',
    name: 'Administrador Tellex',
    email: 'admin@tellex.com',
    password: 'tellex123',
    role: 'admin',
    createdAt: '22/08/2026'
  },
  {
    id: 'user_1',
    name: 'Sofia Valenzuela',
    email: 'usuario@correo.com',
    password: 'tellex123',
    role: 'user',
    createdAt: '22/08/2026'
  }
];

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedPest, setPreselectedPest] = useState<'termitas' | 'roedores' | 'insectos' | 'otros'>('termitas');
  const [currentTab, setCurrentTab] = useState<'home' | 'tienda'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamic Catalog and Auth states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>(DEFAULT_CATEGORIES);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Load initial catalog, categories, users, session and listen to changes
  useEffect(() => {
    const supabase = getSupabase();

    async function loadData() {
      if (supabase) {
        try {
          // 1. Load Categories from Supabase
          const { data: dbCats, error: catErr } = await supabase.from('categories').select('*');
          if (dbCats && !catErr) {
            const catRecord: { [key: string]: string } = {};
            dbCats.forEach((item: any) => {
              catRecord[item.id] = item.name;
            });
            setCategories(catRecord);
          } else if (catErr) {
            console.error('Error loading categories from Supabase, using default:', catErr);
            setCategories(DEFAULT_CATEGORIES);
          }

          // 2. Load Products from Supabase
          const { data: dbProds, error: prodErr } = await supabase.from('products').select('*');
          if (dbProds && !prodErr) {
            const mappedProds: Product[] = dbProds.map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description || '',
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              category: p.category,
              image: p.image || 'https://i.postimg.cc/3RcJGhhm/image.png',
              rating: Number(p.rating || 5.0),
              reviewsCount: Number(p.reviews_count || 1),
              inStock: p.in_stock,
              isOffer: p.is_offer,
              isNew: p.is_new,
              isBestSeller: p.is_best_seller
            }));
            setProducts(mappedProds);
          } else if (prodErr) {
            console.error('Error loading products from Supabase, using default:', prodErr);
            setProducts(DEFAULT_PRODUCTS);
          }

          // 3. Load Leads from Supabase
          const { data: dbLeads, error: leadErr } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
          if (dbLeads && !leadErr) {
            const mappedLeads: Lead[] = dbLeads.map((db: any) => ({
              id: db.id,
              name: db.name,
              phone: db.phone,
              pestType: db.pest_type,
              infestationLevel: db.infestation_level,
              status: db.status || 'pendiente',
              createdAt: new Date(db.created_at).toLocaleString('es-VE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              notes: db.notes,
              orderItems: db.order_items,
              orderTotal: db.order_total,
            }));
            setLeads(mappedLeads);
          } else if (leadErr) {
            console.error('Error loading leads from Supabase:', leadErr);
          }

          // 4. Initial session check
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setCurrentUser({
              id: session.user.id,
              name: profile?.name || session.user.user_metadata?.name || 'Usuario',
              email: session.user.email || '',
              password: '',
              role: profile?.role || session.user.user_metadata?.role || 'user',
              createdAt: new Date(session.user.created_at).toLocaleDateString('es-VE')
            });
          }

          // Listen to Auth State changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              setCurrentUser({
                id: session.user.id,
                name: profile?.name || session.user.user_metadata?.name || 'Usuario',
                email: session.user.email || '',
                password: '',
                role: profile?.role || session.user.user_metadata?.role || 'user',
                createdAt: new Date(session.user.created_at).toLocaleDateString('es-VE')
              });
            } else {
              setCurrentUser(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (e) {
          console.error('Error loading data from Supabase, falling back to local:', e);
        }
      } else {
        // --- Fallback Local Mode if Supabase has not been set yet ---
        const storedProds = localStorage.getItem('tellex_products');
        if (storedProds) {
          try { setProducts(JSON.parse(storedProds)); } catch (e) { setProducts(DEFAULT_PRODUCTS); }
        } else {
          setProducts(DEFAULT_PRODUCTS);
          localStorage.setItem('tellex_products', JSON.stringify(DEFAULT_PRODUCTS));
        }

        const storedCats = localStorage.getItem('tellex_categories');
        if (storedCats) {
          try { setCategories(JSON.parse(storedCats)); } catch (e) { setCategories(DEFAULT_CATEGORIES); }
        } else {
          setCategories(DEFAULT_CATEGORIES);
          localStorage.setItem('tellex_categories', JSON.stringify(DEFAULT_CATEGORIES));
        }

        const storedUsers = localStorage.getItem('tellex_users');
        if (storedUsers) {
          try { setUsers(JSON.parse(storedUsers)); } catch (e) { setUsers(DEFAULT_USERS); }
        } else {
          setUsers(DEFAULT_USERS);
          localStorage.setItem('tellex_users', JSON.stringify(DEFAULT_USERS));
        }

        const storedSession = localStorage.getItem('tellex_current_user');
        if (storedSession) {
          try { setCurrentUser(JSON.parse(storedSession)); } catch (e) { setCurrentUser(null); }
        }

        const storedLeads = localStorage.getItem('tellex_leads');
        if (storedLeads) {
          try { setLeads(JSON.parse(storedLeads)); } catch (e) { setLeads([]); }
        }
      }
    }

    loadData();
  }, []);

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

  // Sync leads to localStorage
  const saveLeads = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('tellex_leads', JSON.stringify(updatedLeads));
  };

  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('leads').insert({
          name: newLeadData.name,
          phone: newLeadData.phone,
          pest_type: newLeadData.pestType,
          infestation_level: newLeadData.infestationLevel,
          notes: newLeadData.notes,
          order_items: newLeadData.orderItems,
          order_total: newLeadData.orderTotal,
          status: 'pendiente'
        }).select().single();

        if (!error && data) {
          const mapped: Lead = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            pestType: data.pest_type,
            infestationLevel: data.infestation_level,
            status: data.status || 'pendiente',
            createdAt: new Date(data.created_at).toLocaleString('es-VE', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            notes: data.notes,
            orderItems: data.order_items,
            orderTotal: data.order_total
          };
          setLeads(prev => [mapped, ...prev]);
        } else {
          console.error('Error inserting lead in Supabase:', error);
          // Fallback to local on error
          const fallbackLead: Lead = {
            ...newLeadData,
            id: `lead_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pendiente',
            createdAt: new Date().toLocaleDateString('es-VE'),
          };
          saveLeads([fallbackLead, ...leads]);
        }
      } catch (err) {
        console.error('Exception inserting lead:', err);
      }
    } else {
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
    }
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

  const handleDeleteLead = async (id: string) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (!error) {
          setLeads(prev => prev.filter(l => l.id !== id));
        } else {
          console.error('Error deleting lead from Supabase:', error);
        }
      } catch (e) {
        console.error('Exception deleting lead:', e);
      }
    } else {
      const updated = leads.filter((l) => l.id !== id);
      saveLeads(updated);
    }
  };

  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('leads').update({ status }).eq('id', id);
        if (!error) {
          setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        } else {
          console.error('Error updating status in Supabase:', error);
        }
      } catch (e) {
        console.error('Exception updating status:', e);
      }
    } else {
      const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
      saveLeads(updated);
    }
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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
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
              products={products}
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
            products={products}
            categories={categories}
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
        products={products}
        setProducts={setProducts}
        categories={categories}
        setCategories={setCategories}
      />

      {/* 12. Authentication & User Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
        setUsers={setUsers}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
