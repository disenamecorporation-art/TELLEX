import React, { useState } from 'react';
import { ShieldCheck, Calendar, Phone, AlertTriangle, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead } from '../types';

interface FinalCTAProps {
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
  preselectedPest: 'termitas' | 'roedores' | 'insectos' | 'otros';
}

export default function FinalCTA({ onAddLead, preselectedPest }: FinalCTAProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pestType, setPestType] = useState<'termitas' | 'roedores' | 'insectos' | 'otros'>(preselectedPest || 'termitas');
  const [infestationLevel, setInfestationLevel] = useState<'bajo' | 'medio' | 'critico'>('medio');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Sync preselected pest if it changes from parent interaction
  React.useEffect(() => {
    if (preselectedPest) {
      setPestType(preselectedPest);
    }
  }, [preselectedPest]);

  const validateForm = () => {
    const tempErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      tempErrors.name = 'El nombre completo es requerido.';
    } else if (name.trim().length < 3) {
      tempErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    }

    const phoneRegex = /^[0-9\s\-\+\(\)]{10,15}$/;
    if (!phone.trim()) {
      tempErrors.phone = 'El número de teléfono es requerido.';
    } else if (!phoneRegex.test(phone.trim())) {
      tempErrors.phone = 'Introduce un formato de teléfono válido (10 dígitos).';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const pestLabels = {
      termitas: 'Termitas',
      roedores: 'Roedores',
      insectos: 'Insectos/Rastreros',
      otros: 'Otro Tipo de Plaga'
    };
    
    const levelLabels = {
      bajo: 'Bajo (Preventivo)',
      medio: 'Medio (Avistamientos constantes)',
      critico: 'Crítico (Daños visibles / Emergencia)'
    };

    const text = `*SOLICITUD DE INSPECCIÓN GRATUITA - TELLEX VENEZUELA* 🛡️\n\n` +
      `*Cliente:* ${name.trim()}\n` +
      `*Teléfono:* ${phone.trim()}\n` +
      `*Plaga Detectada:* ${pestLabels[pestType] || pestType}\n` +
      `*Nivel de Infestación:* ${levelLabels[infestationLevel] || infestationLevel}\n\n` +
      `Por favor contáctenme para agendar la inspección gratuita de mis espacios.`;

    // Simulate tech network request and add to admin console
    setTimeout(() => {
      onAddLead({
        name: name.trim(),
        phone: phone.trim(),
        pestType,
        infestationLevel,
        notes: `Solicitado desde el formulario rápido de la Landing Page. WhatsApp abierto.`
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // Open WhatsApp in a new tab
      window.open(`https://wa.me/584126107313?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      
      // Reset Form fields
      setName('');
      setPhone('');
      setInfestationLevel('medio');
    }, 600);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="contacto">
      {/* Decorative vector grids */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[radial-gradient(#ca531a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main CTA wrapper with gradient as specified: ca531a to 24411a */}
        <div className="bg-gradient-to-br from-[#ca531a] to-[#24411a] rounded-[40px] shadow-2xl p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="final-cta-gradient-box">
          
          {/* Left Column - Headline copy */}
          <div className="lg:col-span-6 space-y-6" id="final-cta-left">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/15 px-3 py-1.5 rounded-full inline-block">
              Inspección Inicial de Obra Sin Costo
            </span>
            
            <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.15]" id="final-cta-title">
              ¿Detectaste una plaga? <br />
              <span className="font-semibold text-white">No esperes más.</span>
            </h2>
            
            <p className="text-sm md:text-base text-slate-100 font-light leading-relaxed" id="final-cta-desc">
              Las termitas destruyen madera silenciosamente 24/7 y los roedores contaminan ductos de ventilación esenciales. Solicita un diagnóstico técnico digital totalmente gratis hoy mismo.
            </p>

            {/* Quick list specs */}
            <div className="space-y-3 pt-4 border-t border-white/10" id="final-cta-list">
              <div className="flex items-center gap-3 text-xs md:text-sm font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>Análisis por termografía infrarroja incluido</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-medium">
                <Calendar className="w-5 h-5 text-emerald-300" />
                <span>Agendamiento flexible de lunes a domingo</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-medium">
                <Phone className="w-5 h-5 text-emerald-300" />
                <span>Asistencia técnica telefónica prioritaria</span>
              </div>
            </div>
          </div>

          {/* Right Column - Premium Lead Form Box */}
          <div className="lg:col-span-6" id="final-cta-right">
            <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden" id="form-container-box">
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    id="lead-capture-form"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Agenda tu inspección gratuita
                    </h3>
                    <p className="text-xs text-slate-400 font-light mb-6">
                      Completa los datos y un ingeniero te contactará en menos de 2 horas.
                    </p>

                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Ej. Sofía Valenzuela"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full text-sm pl-9 pr-4 py-3 bg-slate-50 border ${
                            errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#ca531a]'
                          } rounded-xl focus:outline-none focus:bg-white transition-all`}
                          id="form-input-name"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] text-rose-500 font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Número de Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="Ej. 0414 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full text-sm pl-9 pr-4 py-3 bg-slate-50 border ${
                            errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#ca531a]'
                          } rounded-xl focus:outline-none focus:bg-white transition-all`}
                          id="form-input-phone"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] text-rose-500 font-medium">{errors.phone}</p>
                      )}
                    </div>

                    {/* Pest dropdown */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Tipo de Plaga
                        </label>
                        <select
                          value={pestType}
                          onChange={(e) => setPestType(e.target.value as any)}
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                          id="form-select-pest"
                        >
                          <option value="termitas">Termitas</option>
                          <option value="roedores">Roedores</option>
                          <option value="insectos">Insectos</option>
                          <option value="otros">Otros</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Nivel Estimado
                        </label>
                        <select
                          value={infestationLevel}
                          onChange={(e) => setInfestationLevel(e.target.value as any)}
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:border-[#ca531a] focus:bg-white transition-all"
                          id="form-select-level"
                        >
                          <option value="bajo">Leve / Preventivo</option>
                          <option value="medio">Moderado</option>
                          <option value="critico">Urgente / Crítico</option>
                        </select>
                      </div>
                    </div>

                    {/* Action submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#ca531a] hover:bg-[#ca531a]/95 disabled:bg-slate-300 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                      id="form-submit-btn"
                    >
                      {isSubmitting ? 'Registrando...' : 'Confirmar Inspección Gratis'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center flex flex-col items-center justify-center space-y-4"
                    id="form-success-message"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-inner">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-950">
                      ¡Agendado Exitosamente!
                    </h3>
                    
                    <p className="text-sm text-slate-500 font-light max-w-sm leading-relaxed">
                      Tu solicitud de inspección ha ingresado con éxito en nuestra consola de ingenieros de campo. Un especialista técnico se comunicará contigo al teléfono provisto en menos de 2 horas.
                    </p>

                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl w-full text-xs text-emerald-800 text-left space-y-1">
                      <p><strong>Folio Técnico:</strong> TL-{Math.floor(1000 + Math.random() * 9000)}</p>
                      <p><strong>Tipo:</strong> Control Especializado de {pestType.toUpperCase()}</p>
                    </div>

                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-xs font-semibold text-[#ca531a] hover:text-[#ca531a]/80 pt-4"
                      id="reset-form-btn"
                    >
                      Registrar otra propiedad
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
