import React, { useState } from 'react';
import { X, Search, Filter, Trash2, CheckCircle2, UserCheck, ShieldAlert, Plus, Download, Tag, ShoppingBag, Edit, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from '../lib/supabase';
import { Lead, Product } from '../types';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onDeleteLead: (id: string) => void;
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onAddDemoLeads: () => void;
  
  // Shared Catalog States
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: { [key: string]: string };
  setCategories: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export default function AdminDrawer({
  isOpen,
  onClose,
  leads,
  onDeleteLead,
  onUpdateStatus,
  onAddDemoLeads,
  products,
  setProducts,
  categories,
  setCategories,
}: AdminDrawerProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'categories'>('leads');
  
  // Leads filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPestFilter, setSelectedPestFilter] = useState<string>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');

  // Products States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  
  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOrigPrice, setProdOrigPrice] = useState<number | undefined>(undefined);
  const [prodCat, setProdCat] = useState('geles');
  const [prodImage, setProdImage] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodIsOffer, setProdIsOffer] = useState(false);
  const [prodIsNew, setProdIsNew] = useState(false);
  const [prodIsBest, setProdIsBest] = useState(false);
  const [prodFormError, setProdFormError] = useState('');

  // Categories States
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [editingCatKey, setEditingCatKey] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [catError, setCatError] = useState('');

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesPest =
      selectedPestFilter === 'todos' || lead.pestType === selectedPestFilter;
    const matchesStatus =
      selectedStatusFilter === 'todos' || lead.status === selectedStatusFilter;
    return matchesSearch && matchesPest && matchesStatus;
  });

  const exportLeads = () => {
    if (leads.length === 0) return;
    const headers = 'ID,Nombre,Telefono,Plaga,Nivel,Estado,Fecha\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      leads
        .map(
          (l) =>
            `"${l.id}","${l.name}","${l.phone}","${l.pestType}","${l.infestationLevel}","${l.status}","${l.createdAt}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_tellex_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PRODUCT MANAGEMENT ACTION HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice(0);
    setProdOrigPrice(undefined);
    setProdCat(Object.keys(categories).find(k => k !== 'todos') || 'geles');
    setProdImage('https://i.postimg.cc/3RcJGhhm/image.png');
    setProdInStock(true);
    setProdIsOffer(false);
    setProdIsNew(false);
    setProdIsBest(false);
    setProdFormError('');
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice);
    setProdCat(p.category);
    setProdImage(p.image);
    setProdInStock(p.inStock);
    setProdIsOffer(!!p.isOffer);
    setProdIsNew(!!p.isNew);
    setProdIsBest(!!p.isBestSeller);
    setProdFormError('');
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (!error) {
            setProducts(prev => prev.filter(p => p.id !== id));
          } else {
            console.error('Error deleting product from Supabase:', error);
            alert('Error al eliminar producto de la base de datos.');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem('tellex_products', JSON.stringify(updated));
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdFormError('');

    if (!prodName.trim() || !prodDesc.trim() || prodPrice <= 0) {
      setProdFormError('El nombre, descripción y precio son obligatorios.');
      return;
    }

    const prodId = editingProduct ? editingProduct.id : `prod_${Math.random().toString(36).substr(2, 9)}`;
    const savedProduct: Product = {
      id: prodId,
      name: prodName.trim(),
      description: prodDesc.trim(),
      price: Number(prodPrice),
      originalPrice: prodOrigPrice ? Number(prodOrigPrice) : undefined,
      category: prodCat as any,
      image: prodImage || 'https://i.postimg.cc/3RcJGhhm/image.png',
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      inStock: prodInStock,
      isOffer: prodIsOffer,
      isNew: prodIsNew,
      isBestSeller: prodIsBest
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbProductObj = {
          id: prodId,
          name: prodName.trim(),
          description: prodDesc.trim(),
          price: Number(prodPrice),
          original_price: prodOrigPrice ? Number(prodOrigPrice) : null,
          category: prodCat,
          image: prodImage || 'https://i.postimg.cc/3RcJGhhm/image.png',
          rating: editingProduct ? editingProduct.rating : 5.0,
          reviews_count: editingProduct ? editingProduct.reviewsCount : 1,
          in_stock: prodInStock,
          is_offer: prodIsOffer,
          is_new: prodIsNew,
          is_best_seller: prodIsBest
        };

        const { error } = await supabase.from('products').upsert(dbProductObj);
        if (!error) {
          if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? savedProduct : p));
          } else {
            setProducts(prev => [...prev, savedProduct]);
          }
          setIsProductFormOpen(false);
          setEditingProduct(null);
        } else {
          console.error('Error saving product to Supabase:', error);
          setProdFormError('Error al guardar el producto en la base de datos.');
        }
      } catch (err: any) {
        setProdFormError(err.message || 'Error de conexión con la base de datos.');
      }
    } else {
      let updated: Product[];
      if (editingProduct) {
        updated = products.map(p => p.id === editingProduct.id ? savedProduct : p);
      } else {
        updated = [...products, savedProduct];
      }

      setProducts(updated);
      localStorage.setItem('tellex_products', JSON.stringify(updated));
      setIsProductFormOpen(false);
      setEditingProduct(null);
    }
  };

  // --- CATEGORY MANAGEMENT ACTION HANDLERS ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');

    const formattedKey = newCatKey.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!formattedKey || !newCatName.trim()) {
      setCatError('Llave e identificador válidos son requeridos.');
      return;
    }

    if (categories[formattedKey]) {
      setCatError('Este identificador de categoría ya existe.');
      return;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('categories').insert({
          id: formattedKey,
          name: newCatName.trim()
        });

        if (!error) {
          const updated = {
            ...categories,
            [formattedKey]: newCatName.trim()
          };
          setCategories(updated);
          setNewCatKey('');
          setNewCatName('');
        } else {
          console.error('Error adding category in Supabase:', error);
          setCatError('Error al agregar categoría en la base de datos.');
        }
      } catch (err: any) {
        setCatError(err.message || 'Error de conexión.');
      }
    } else {
      const updated = {
        ...categories,
        [formattedKey]: newCatName.trim()
      };
      setCategories(updated);
      localStorage.setItem('tellex_categories', JSON.stringify(updated));
      setNewCatKey('');
      setNewCatName('');
    }
  };

  const handleStartEditCat = (key: string, name: string) => {
    setEditingCatKey(key);
    setEditingCatName(name);
  };

  const handleSaveCatEdit = async (key: string) => {
    if (!editingCatName.trim()) return;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('categories')
          .update({ name: editingCatName.trim() })
          .eq('id', key);

        if (!error) {
          const updated = {
            ...categories,
            [key]: editingCatName.trim()
          };
          setCategories(updated);
          setEditingCatKey(null);
        } else {
          console.error('Error editing category in Supabase:', error);
          alert('Error al actualizar la categoría en la base de datos.');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = {
        ...categories,
        [key]: editingCatName.trim()
      };
      setCategories(updated);
      localStorage.setItem('tellex_categories', JSON.stringify(updated));
      setEditingCatKey(null);
    }
  };

  const handleDeleteCategory = async (key: string) => {
    if (key === 'todos' || key === 'geles') {
      alert('Las categorías principales no se pueden eliminar.');
      return;
    }
    if (window.confirm(`¿Seguro que deseas eliminar la categoría "${categories[key]}"? Los productos en esta categoría deberán ser asignados a otra.`)) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('categories').delete().eq('id', key);
          if (!error) {
            const updated = { ...categories };
            delete updated[key];
            setCategories(updated);
          } else {
            console.error('Error deleting category from Supabase:', error);
            alert('Error al eliminar categoría de la base de datos.');
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const updated = { ...categories };
        delete updated[key];
        setCategories(updated);
        localStorage.setItem('tellex_categories', JSON.stringify(updated));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" id="admin-panel-overlay">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-100"
            id="admin-drawer-container"
          >
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#ca531a]" />
                  Consola Administrativa TELLEX
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Panel exclusivo de respuesta técnica, leads y gestión de inventario
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                id="close-admin-drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 text-sm font-semibold">
              <button
                onClick={() => { setActiveTab('leads'); setIsProductFormOpen(false); }}
                className={`py-3.5 px-4 relative transition-all ${activeTab === 'leads' ? 'text-[#ca531a]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Leads de Inspección y Pedidos ({leads.length})
                {activeTab === 'leads' && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ca531a]" />}
              </button>
              <button
                onClick={() => { setActiveTab('products'); setIsProductFormOpen(false); }}
                className={`py-3.5 px-4 relative transition-all ${activeTab === 'products' ? 'text-[#ca531a]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> Productos ({products.length})</span>
                {activeTab === 'products' && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ca531a]" />}
              </button>
              <button
                onClick={() => { setActiveTab('categories'); setIsProductFormOpen(false); }}
                className={`py-3.5 px-4 relative transition-all ${activeTab === 'categories' ? 'text-[#ca531a]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Categorías ({Object.keys(categories).length - 1})</span>
                {activeTab === 'categories' && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ca531a]" />}
              </button>
            </div>

            {/* TAB CONTENT: LEADS PANEL */}
            {activeTab === 'leads' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Quick Actions / Filters */}
                <div className="p-6 border-b border-slate-100 bg-white flex flex-col gap-4">
                  <div className="flex gap-2">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] focus:bg-white transition-colors"
                        id="lead-search"
                      />
                    </div>

                    {leads.length === 0 ? (
                      <button
                        onClick={onAddDemoLeads}
                        className="bg-[#24411a] hover:bg-[#24411a]/90 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                        id="load-demo-btn"
                      >
                        <Plus className="w-4 h-4" />
                        Cargar Demos
                      </button>
                    ) : (
                      <button
                        onClick={exportLeads}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                        id="export-leads-btn"
                      >
                        <Download className="w-4 h-4" />
                        CSV
                      </button>
                    )}
                  </div>

                  {/* Filters row */}
                  <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Filtrar:
                    </span>

                    <select
                      value={selectedPestFilter}
                      onChange={(e) => setSelectedPestFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#ca531a]"
                      id="filter-pest"
                    >
                      <option value="todos">Todas las plagas</option>
                      <option value="termitas">Termitas</option>
                      <option value="roedores">Roedores</option>
                      <option value="insectos">Insectos</option>
                      <option value="otros">Otros</option>
                    </select>

                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#ca531a]"
                      id="filter-status"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="contactado">Contactados</option>
                      <option value="inspeccionado">Inspeccionados</option>
                      <option value="completado">Completados</option>
                    </select>
                  </div>
                </div>

                {/* Leads List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar" id="leads-list-scroll">
                  {filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-slate-700 text-sm">No se encontraron leads</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        {leads.length === 0
                          ? 'Aún no se han capturado leads. Completa un formulario de contacto o haz un pedido en la tienda para verlos aquí.'
                          : 'Prueba cambiando los criterios de búsqueda o filtros.'}
                      </p>
                    </div>
                  ) : (
                    filteredLeads.map((lead) => {
                      const statusColors = {
                        pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
                        contactado: 'bg-blue-50 text-blue-700 border-blue-200',
                        inspeccionado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                        completado: 'bg-green-50 text-green-700 border-green-200',
                      };

                      const levelColors = {
                        bajo: 'bg-emerald-50 text-emerald-700',
                        medio: 'bg-amber-50 text-amber-700',
                        critico: 'bg-rose-50 text-rose-700',
                      };

                      return (
                        <div
                          key={lead.id}
                          className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all animate-fade-in"
                          id={`lead-card-${lead.id}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-slate-900 text-sm">{lead.name}</h4>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColors[lead.status]}`}>
                                  {lead.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium mt-1">
                                Tel: {lead.phone}
                              </p>
                            </div>

                            <button
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar lead"
                              id={`delete-lead-${lead.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {lead.orderItems ? (
                            <div className="mt-4 bg-orange-50/50 border border-orange-100 p-3.5 rounded-xl text-xs space-y-2 animate-fade-in">
                              <div className="flex justify-between items-center">
                                <span className="text-[#ca531a] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                                  🛒 PEDIDO ONLINE
                                </span>
                                <span className="text-slate-900 font-extrabold text-xs bg-white px-2.5 py-1 rounded-lg border border-orange-200">
                                  ${lead.orderTotal?.toLocaleString('es-MX')} MXN
                                </span>
                              </div>
                              <div className="text-slate-700">
                                <span className="text-slate-400 block font-medium">Artículos solicitados:</span>
                                <p className="font-semibold text-slate-800 leading-relaxed">{lead.orderItems}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-xl text-xs">
                              <div>
                                <span className="text-slate-400 block font-medium">Tipo de Plaga</span>
                                <span className="font-semibold text-slate-800 capitalize">{lead.pestType}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-medium">Amenaza / Infestación</span>
                                <span className={`font-semibold inline-block px-2 py-0.5 rounded text-[10px] uppercase mt-0.5 ${levelColors[lead.infestationLevel]}`}>
                                  {lead.infestationLevel}
                                </span>
                              </div>
                            </div>
                          )}

                          {lead.notes && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 font-medium">
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-1">Notas:</span>
                              {lead.notes}
                            </p>
                          )}

                          {/* Operations row */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400">
                              Ingresado: {lead.createdAt}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {lead.status !== 'completado' && (
                                <button
                                  onClick={() => {
                                    const nextStatus: Record<Lead['status'], Lead['status']> = {
                                      pendiente: 'contactado',
                                      contactado: 'inspeccionado',
                                      inspeccionado: 'completado',
                                      completado: 'completado',
                                    };
                                    onUpdateStatus(lead.id, nextStatus[lead.status]);
                                  }}
                                  className="text-[11px] font-semibold bg-slate-100 hover:bg-[#ca531a]/10 hover:text-[#ca531a] text-slate-700 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
                                  id={`update-status-${lead.id}`}
                                >
                                  <UserCheck className="w-3 h-3" />
                                  Avanzar Estado
                                </button>
                              )}
                              {lead.status === 'completado' && (
                                <span className="text-[10px] font-semibold text-green-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Atendido
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRODUCTS PANEL */}
            {activeTab === 'products' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {!isProductFormOpen ? (
                  <div className="flex flex-col h-full">
                    {/* Header bar */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                      <h3 className="font-extrabold text-slate-800 text-sm">Listado de Inventario de la Tienda</h3>
                      <button
                        onClick={handleOpenAddProduct}
                        className="bg-[#ca531a] hover:bg-[#ca531a]/90 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-4 h-4" /> Nuevo Producto
                      </button>
                    </div>

                    {/* Products scrolling list */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3.5 no-scrollbar">
                      {products.length === 0 ? (
                        <div className="text-center py-16">
                          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-slate-600">No hay productos en inventario.</p>
                          <button
                            onClick={handleOpenAddProduct}
                            className="mt-3 text-xs text-[#ca531a] font-bold hover:underline"
                          >
                            Añade tu primer producto hoy
                          </button>
                        </div>
                      ) : (
                        products.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex gap-4 items-center justify-between"
                          >
                            <div className="flex gap-3.5 items-center">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-14 h-14 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1"
                              />
                              <div>
                                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{p.name}</h4>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-xs font-extrabold text-[#ca531a]">
                                    ${p.price.toLocaleString('es-VE')} USD
                                  </span>
                                  {p.originalPrice && (
                                    <span className="text-[10px] text-slate-400 line-through">
                                      ${p.originalPrice.toLocaleString('es-VE')} USD
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
                                    {categories[p.category] || p.category}
                                  </span>
                                  {!p.inStock && (
                                    <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                                      Agotado
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
                                title="Editar producto"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  /* PRODUCT CREATE / EDIT FORM */
                  <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="font-extrabold text-slate-800 text-sm">
                        {editingProduct ? `Editar: ${editingProduct.name}` : 'Crear Nuevo Producto'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                      >
                        Cancelar
                      </button>
                    </div>

                    {prodFormError && (
                      <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium">
                        {prodFormError}
                      </p>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Nombre del Producto
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Gel Mata Cucarachas Ultra"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Precio Venta ($ USD)
                        </label>
                        <input
                          type="number"
                          placeholder="420"
                          value={prodPrice || ''}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Precio Original (Opcional)
                        </label>
                        <input
                          type="number"
                          placeholder="500"
                          value={prodOrigPrice || ''}
                          onChange={(e) => setProdOrigPrice(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Categoría
                      </label>
                      <select
                        value={prodCat}
                        onChange={(e) => setProdCat(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                      >
                        {Object.entries(categories)
                          .filter(([key]) => key !== 'todos')
                          .map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Descripción del Producto
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Escribe los beneficios, peso y modo de uso del insecticida o trampa profesional..."
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a] resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        URL de la Imagen (o foto de PostImage)
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                      />
                    </div>

                    {/* Checkboxes Row */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={prodInStock}
                          onChange={(e) => setProdInStock(e.target.checked)}
                          className="rounded text-[#ca531a] focus:ring-[#ca531a] w-4 h-4 accent-[#ca531a]"
                        />
                        <span>Disponible en Stock</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={prodIsOffer}
                          onChange={(e) => setProdIsOffer(e.target.checked)}
                          className="rounded text-[#ca531a] focus:ring-[#ca531a] w-4 h-4 accent-[#ca531a]"
                        />
                        <span>Mostrar como Oferta</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={prodIsNew}
                          onChange={(e) => setProdIsNew(e.target.checked)}
                          className="rounded text-[#ca531a] focus:ring-[#ca531a] w-4 h-4 accent-[#ca531a]"
                        />
                        <span>Mostrar como Nuevo</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={prodIsBest}
                          onChange={(e) => setProdIsBest(e.target.checked)}
                          className="rounded text-[#ca531a] focus:ring-[#ca531a] w-4 h-4 accent-[#ca531a]"
                        />
                        <span>Más Vendido (Bestseller)</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-bold py-3 px-4 rounded-xl shadow-lg text-sm mt-4 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Guardar Producto
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB CONTENT: CATEGORIES PANEL */}
            {activeTab === 'categories' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header/Add Form */}
                <form onSubmit={handleAddCategory} className="p-6 border-b border-slate-100 bg-white space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Crear Nueva Categoría</h3>
                  
                  {catError && (
                    <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium animate-fade-in">
                      {catError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Identificador (Clave única)
                      </label>
                      <input
                        type="text"
                        placeholder="ej. liquidos"
                        value={newCatKey}
                        onChange={(e) => setNewCatKey(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Nombre de Categoría
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ej. Insecticidas Líquidos"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ca531a]"
                        />
                        <button
                          type="submit"
                          className="bg-[#24411a] hover:bg-[#24411a]/95 text-white font-bold text-xs px-4 rounded-xl shadow-md"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Categories scrolling list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar bg-slate-50/30">
                  {Object.entries(categories)
                    .filter(([key]) => key !== 'todos')
                    .map(([key, name]) => (
                      <div
                        key={key}
                        className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex items-center justify-between"
                      >
                        {editingCatKey === key ? (
                          <div className="flex-1 flex gap-2 mr-4">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveCatEdit(key)}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs px-3 rounded-lg border border-emerald-200"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatKey(null)}
                              className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs px-3 rounded-lg"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">ID: {key}</span>
                            <span className="font-bold text-slate-800 text-sm">{name}</span>
                          </div>
                        )}

                        {editingCatKey !== key && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditCat(key, name)}
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(key)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
