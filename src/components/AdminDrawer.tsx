import React, { useState, useEffect } from 'react';
import { X, Search, Filter, Trash2, CheckCircle2, UserCheck, ShieldAlert, Plus, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead } from '../types';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onDeleteLead: (id: string) => void;
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onAddDemoLeads: () => void;
}

export default function AdminDrawer({
  isOpen,
  onClose,
  leads,
  onDeleteLead,
  onUpdateStatus,
  onAddDemoLeads,
}: AdminDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPestFilter, setSelectedPestFilter] = useState<string>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');

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
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#ca531a]" />
                  Consola de Leads TELLEX
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Administración y respuesta técnica para inspecciones solicitadas
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
                      ? 'Aún no se han capturado leads en el formulario de la landing page. Completa el formulario para verlos aquí.'
                      : 'Prueba cambiando los criterios de búsqueda o filtros.'}
                  </p>
                  {leads.length === 0 && (
                    <button
                      onClick={onAddDemoLeads}
                      className="mt-4 text-xs font-semibold text-[#ca531a] hover:text-[#ca531a]/80"
                      id="load-demo-text-btn"
                    >
                      Generar leads de prueba
                    </button>
                  )}
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
                      className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all"
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
                        <div className="mt-4 bg-orange-50/50 border border-orange-100 p-3.5 rounded-xl text-xs space-y-2">
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
                            <span className="text-slate-400 block">Tipo de Plaga</span>
                            <span className="font-medium text-slate-800 capitalize">{lead.pestType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Amenaza / Infestación</span>
                            <span className={`font-semibold inline-block px-2 py-0.5 rounded text-[10px] uppercase mt-0.5 ${levelColors[lead.infestationLevel]}`}>
                              {lead.infestationLevel}
                            </span>
                          </div>
                        </div>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
