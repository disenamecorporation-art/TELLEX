import React, { useState } from 'react';
import { Search, ClipboardList, Shield, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function WorkProcess() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Inspección & Diagnóstico',
      description: 'Analizamos tu propiedad térmicamente para rastrear focos activos, galerías de termitas, nidos ocultos y factores de riesgo estructural.',
      detail: 'Utilizamos cámaras de detección térmica y escáneres de humedad para encontrar la plaga sin perforar tus paredes ni romper acabados.'
    },
    {
      number: 2,
      icon: ClipboardList,
      title: 'Plan Personalizado',
      description: 'Diseñamos una estrategia integral de ataque basada en el tipo de plaga, nivel de infestación y la seguridad de tu familia.',
      detail: 'Te entregamos una propuesta con tiempos exactos, técnicas certificadas a emplear y los químicos ecológicos de baja toxicidad seleccionados.'
    },
    {
      number: 3,
      icon: Shield,
      title: 'Aplicación Profesional',
      description: 'Nuestros ingenieros de campo ejecutan la fumigación utilizando trajes termo-sellados y rociadores de aspersión fina.',
      detail: 'Aplicamos barreras físicas perimetrales, geles de atracción molecular e inyecciones localizadas de alta presión en zonas vulnerables.'
    },
    {
      number: 4,
      icon: ShieldCheck,
      title: 'Garantía & Monitoreo',
      description: 'Monitoreamos la zona tratada para certificar la erradicación absoluta y emitimos tu póliza de protección por 12 meses.',
      detail: 'Realizamos visitas calendarizadas de seguimiento preventivo e instalamos estaciones de cebo centinela de respuesta pasiva.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="nosotros">
      {/* Decorative accent lines */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200/50 pointer-events-none hidden lg:block -translate-y-12"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-[#ca531a] mb-3"
            id="process-eyebrow"
          >
            Fórmula de Ingeniería
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extralight tracking-tight text-slate-900 leading-tight"
            id="process-title"
          >
            Método <span className="font-semibold text-[#24411a]">TELLEX™</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-slate-500 font-light leading-relaxed"
            id="process-desc"
          >
            Combinamos tecnología científica de mapeo con químicos biodegradables premium para garantizar que las amenazas nunca regresen.
          </motion.p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative" id="process-timeline-grid">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isHovered = activeStep === idx;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 flex flex-col justify-between group cursor-default relative"
                id={`process-card-${step.number}`}
              >
                {/* Step Connector Line for mobile (vertical) */}
                {idx < 3 && (
                  <div className="absolute left-1/2 bottom-[-32px] w-0.5 h-8 bg-[#ca531a]/30 lg:hidden -translate-x-1/2"></div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-8">
                    {/* Icon container with border radius and premium shadow */}
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#24411a]/10 transition-colors duration-300">
                      <IconComp className="w-8 h-8 text-[#ca531a] transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    {/* Step Number Circle */}
                    <span className="w-10 h-10 rounded-full bg-[#ca531a] text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-[#ca531a]/20">
                      0{step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[#24411a] transition-colors mb-4">
                    {step.title}
                  </h3>

                  <p className="text-sm font-light text-slate-500 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Micro-interaction expansion / detailed text inside */}
                <div className="mt-4 pt-4 border-t border-slate-100 min-h-12 flex items-center">
                  <p className="text-xs text-slate-400 font-light leading-relaxed group-hover:text-slate-600 transition-colors">
                    {isHovered ? step.detail : 'Pasa el cursor para ver detalles técnicos de ingeniería...'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
