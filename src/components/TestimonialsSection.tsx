import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sofía Valenzuela',
      role: 'Directora de Operaciones, Hotel Casa Lomas',
      feedback: 'Teníamos un problema latente de termitas en las vigas históricas del hotel. El equipo técnico de TELLEX realizó un escaneo infrarrojo detallado y aplicó inyecciones moleculares con absoluta limpieza. El reporte técnico fue impecable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Ing. Carlos Mendoza',
      role: 'Gerente General, Logística del Norte',
      feedback: 'Para nuestras certificaciones sanitarias anuales, necesitábamos un blindaje total contra roedores y un reporte avalado ante las autoridades. TELLEX selló mecánicamente cada ducto y colocó trampas inteligentes. Aprobamos la auditoría con 100%.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Gabriela Ortiz',
      role: 'Residente, Fraccionamiento Las Jacarandas',
      feedback: 'Tengo dos bebés y tres gatos, por lo que me aterrorizaba usar venenos en el jardín. El biólogo de TELLEX me explicó detalladamente la nula toxicidad de su fórmula Grado Verde biodegradable. Fumigaron sin dejar olores desagradables.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="testimonios">
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-slate-100 rounded-full blur-2xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ca531a] mb-3" id="testimonials-eyebrow">
            Garantía de Satisfacción
          </p>
          <h2 className="text-3xl md:text-5xl font-extralight tracking-tight text-slate-900" id="testimonials-title">
            Testimonios de <span className="font-semibold text-[#24411a]">Confianza</span>
          </h2>
          <p className="mt-4 text-base text-slate-500 font-light" id="testimonials-desc">
            Nuestros clientes avalan la rigurosidad científica y profesionalismo con la que combatimos cada caso.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-slate-50 border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm" id="testimonials-carousel-box">
          
          {/* Quote mark ornament */}
          <div className="absolute top-8 right-12 text-[#ca531a]/10 pointer-events-none">
            <Quote className="w-20 h-20 rotate-180 fill-current" />
          </div>

          <div className="min-h-[220px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
                id={`testimonial-slide-${currentIndex}`}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#ca531a] text-[#ca531a]" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-lg md:text-xl font-light text-slate-700 leading-relaxed italic">
                  "{testimonials[currentIndex].feedback}"
                </p>

                {/* Profile detail */}
                <div className="flex items-center gap-4 pt-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-base">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-xs text-[#24411a] font-medium">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200/50">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-[#ca531a]' : 'w-2.5 bg-slate-300'
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                  id={`dot-nav-${index}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#ca531a] hover:text-[#ca531a] text-slate-500 bg-white transition-colors cursor-pointer"
                aria-label="Testimonio anterior"
                id="btn-prev-testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#ca531a] hover:text-[#ca531a] text-slate-500 bg-white transition-colors cursor-pointer"
                aria-label="Siguiente testimonio"
                id="btn-next-testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
