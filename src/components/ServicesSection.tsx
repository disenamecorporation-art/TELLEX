import React, { useState } from 'react';
import { Home, Target, Bug, CheckCircle2, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Service } from '../types';

interface ServicesSectionProps {
  onSelectService: (pestType: 'termitas' | 'roedores' | 'insectos') => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeModal, setActiveModal] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: 'termitas',
      title: 'Control e Inyección de Termitas',
      description: 'Protegemos la integridad estructural de tu propiedad eliminando colonias subterráneas de manera silenciosa mediante inyección localizada y barreras de suelo.',
      fullDetails: 'Las termitas pueden comprometer seriamente los cimientos de madera y yeso de un edificio de forma invisible. Nuestro método de inyección de alta presión satura las galerías internas mientras creamos una barrera química perimetral indetectable para repeler futuras colonias de raíz.',
      benefits: [
        'Inyección directa de madera certificada',
        'Barreras perimetrales invisibles de largo alcance',
        'Garantía por escrito de integridad estructural',
        'Monitoreo activo mediante sensores de humedad'
      ],
      threatLevel: 'Crítico',
      duration: '4 - 8 Horas'
    },
    {
      id: 'roedores',
      title: 'Control y Blindaje de Roedores',
      description: 'Erradicación de plagas de ratas y ratones con exclusión física (sellado de grietas), trampas de captura humana y desinfección total de ductos.',
      fullDetails: 'Los roedores representan riesgos severos tanto para la salud como para la infraestructura eléctrica. Nuestro protocolo Premium no solo elimina la población activa, sino que localiza y sella mecánicamente cada punto de entrada potencial para un blindaje total permanente.',
      benefits: [
        'Sellado estructural de accesos menores a 1cm',
        'Trampas inteligentes no-crueles de monitoreo',
        'Desinfección biológica de focos infecciosos',
        'Cebos ecológicos resistentes a exteriores'
      ],
      threatLevel: 'Extremo',
      duration: '2 - 4 Horas'
    },
    {
      id: 'insectos',
      title: 'Fumigación de Insectos Rastrerosen',
      description: 'Control absoluto de cucarachas, hormigas, chinches y avispas utilizando termonebulización biodegradable de baja toxicidad para humanos y mascotas.',
      fullDetails: 'Los insectos comunes invaden cocinas, dormitorios y áreas de juegos con rapidez. Empleamos geles de atracción alimenticia y microencapsulados de liberación lenta, ideales para eliminar nidos enteros de cucarachas u hormigas sin evacuar la propiedad por días.',
      benefits: [
        'Geles inodoros sin necesidad de vaciar alacenas',
        'Termonebulización de amplio espectro',
        'Productos 100% seguros para niños y mascotas',
        'Eliminación de nidos y colonias completas'
      ],
      threatLevel: 'Alto',
      duration: '1 - 3 Horas'
    }
  ];

  return (
    <section className="py-24 bg-white relative" id="servicios">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-[#ca531a] mb-3"
            id="services-eyebrow"
          >
            Servicios de Alta Gama
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extralight tracking-tight text-slate-900"
            id="services-title"
          >
            Soluciones de <span className="font-semibold text-[#24411a]">Ingeniería Sanitaria</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-slate-500 font-light leading-relaxed"
            id="services-desc"
          >
            Cada plaga tiene un comportamiento biológico diferente. Desarrollamos tratamientos moleculares y barreras de exclusión específicas para erradicarlas de raíz.
          </motion.p>
        </div>

        {/* Services Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="services-grid">
          {services.map((service, idx) => {
            const isTermite = service.id === 'termitas';
            const isRodent = service.id === 'roedores';
            
            // Assign custom icons based on service id
            const IconComponent = isTermite ? Home : isRodent ? Target : Bug;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 hover:border-slate-200/80 hover:shadow-xl rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 group"
                id={`service-card-${service.id}`}
              >
                <div>
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-4 bg-slate-50 group-hover:bg-[#ca531a]/10 rounded-2xl transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-[#ca531a] transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    
                    {/* Level Badge */}
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      service.threatLevel === 'Crítico' 
                        ? 'bg-rose-50 text-rose-700' 
                        : service.threatLevel === 'Extremo' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      Riesgo: {service.threatLevel}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#24411a] transition-colors mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm font-light text-slate-500 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  {/* Stats list inside card */}
                  <div className="border-t border-slate-100 py-4 mb-6 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-light">Duración Promedio</span>
                      <span className="font-semibold text-slate-700">{service.duration}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-light">Seguridad Familiar</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Grado Verde
                      </span>
                    </div>
                  </div>

                  {/* Dual Action CTAs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveModal(service)}
                      className="border border-slate-200 hover:border-[#24411a] text-slate-700 hover:text-[#24411a] text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                      id={`btn-details-${service.id}`}
                    >
                      Saber más
                    </button>
                    
                    <button
                      onClick={() => onSelectService(service.id as any)}
                      className="bg-[#ca531a] hover:bg-[#ca531a]/90 text-white text-xs font-semibold py-3 rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      id={`btn-quote-${service.id}`}
                    >
                      Cotizar
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SERVICE DETAIL MODAL (Dynamic interaction) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="modal-backdrop"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl z-10 border border-slate-100"
              id="service-detail-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {activeModal.title}
              </h3>
              
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] font-bold uppercase bg-[#ca531a]/10 text-[#ca531a] px-3 py-1 rounded-full">
                  Riesgo {activeModal.threatLevel}
                </span>
                <span className="text-[10px] font-bold uppercase bg-[#24411a]/10 text-[#24411a] px-3 py-1 rounded-full">
                  {activeModal.duration}
                </span>
              </div>

              <p className="text-sm font-light text-slate-500 leading-relaxed mb-6">
                {activeModal.fullDetails}
              </p>

              <h4 className="font-semibold text-xs text-[#24411a] uppercase tracking-wider mb-4">
                Beneficios del Tratamiento
              </h4>
              
              <div className="space-y-3 mb-8">
                {activeModal.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#ca531a] shrink-0 mt-0.5" />
                    <span className="font-light text-slate-600">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    onSelectService(activeModal.id as any);
                    setActiveModal(null);
                  }}
                  className="flex-1 bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-center text-sm cursor-pointer"
                  id="modal-cta-quote"
                >
                  Agendar Inspección Gratis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
