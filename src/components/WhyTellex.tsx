import React from 'react';
import { Check, X, Shield, Cpu, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyTellex() {
  const comparisons = [
    {
      feature: 'Velocidad de respuesta',
      tellex: 'Atención prioritaria inmediata en menos de 2 horas.',
      traditional: 'Agendas saturadas con tiempos de espera de 2 a 3 días hábiles.',
      isBetter: true
    },
    {
      feature: 'Seguridad ambiental',
      tellex: 'Químicos biodegradables premium (Grado Verde) sin olor.',
      traditional: 'Fórmulas baratas de alta toxicidad y olores químicos agresivos.',
      isBetter: true
    },
    {
      feature: 'Diagnóstico técnico',
      tellex: 'Escaneo de humedad y sensores térmicos infrarrojos.',
      traditional: 'Fumigación indiscriminada basada en simple inspección ocular.',
      isBetter: true
    },
    {
      feature: 'Capacitación del personal',
      tellex: 'Técnicos e ingenieros de campo certificados.',
      traditional: 'Aplicadores temporales sin capacitación formal homologada.',
      isBetter: true
    },
    {
      feature: 'Garantía certificada',
      tellex: 'Póliza legal escrita con vigencia extendida por 12 meses.',
      traditional: 'Garantías únicamente verbales y cobros extra por reincidencia.',
      isBetter: true
    }
  ];

  const highlights = [
    {
      icon: Zap,
      title: 'Diagnóstico Infrarrojo',
      desc: 'Localizamos galerías de termitas ocultas tras el yeso con tecnología termo-gráfica avanzada.'
    },
    {
      icon: Shield,
      title: 'Salud Certificada',
      desc: 'Ingredientes de grado hospitalario inodoros y totalmente seguros para niños y mascotas.'
    },
    {
      icon: RefreshCw,
      title: 'Póliza de Blindaje',
      desc: 'Si una plaga vuelve a aparecer bajo los 12 meses de cobertura, volvemos a aplicar sin costo.'
    }
  ];

  return (
    <section className="bg-[#24411a] py-24 text-white relative overflow-hidden" id="nosotros-comparativa">
      {/* Subtle organic geometric overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ca531a]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ca531a] mb-3" id="why-eyebrow">
              Diferencia Tecnológica
            </p>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight text-white leading-tight" id="why-title">
              ¿Por qué elegir <br />
              <span className="font-semibold">TELLEX</span>?
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base md:text-lg text-emerald-100/80 font-light leading-relaxed" id="why-desc">
              No somos una empresa de fumigación tradicional. Abordamos cada caso desde una perspectiva científica, utilizando tecnología alemana y sistemas de exclusión mecánica para erradicar plagas de forma duradera y amigable con el medio ambiente.
            </p>
          </div>
        </div>

        {/* Comparison Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20" id="comparison-section">
          
          {/* Main comparative Table */}
          <div className="lg:col-span-8 bg-[#1b3114] border border-emerald-900/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between" id="comparison-table">
            <h3 className="text-lg font-semibold mb-6 tracking-wide uppercase text-slate-300">
              Análisis Comparativo del Servicio
            </h3>
            
            <div className="space-y-6">
              {comparisons.map((item, idx) => (
                <div key={item.feature} className="border-b border-emerald-950 pb-5 last:border-b-0 last:pb-0">
                  <span className="text-xs font-semibold text-[#ca531a] uppercase tracking-wider block mb-2">
                    {item.feature}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TELLEX */}
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-full bg-[#ca531a]/20 text-[#ca531a] shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-100">
                        {item.tellex}
                      </p>
                    </div>

                    {/* TRADITIONAL */}
                    <div className="flex items-start gap-2.5 opacity-55">
                      <div className="p-1 rounded-full bg-slate-900/40 text-slate-400 shrink-0 mt-0.5">
                        <X className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-light text-slate-300">
                        {item.traditional}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights sidebars cards */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="comparison-highlights">
            {highlights.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#1b3114] border border-emerald-900/80 rounded-3xl p-6 flex items-start gap-4 hover:border-emerald-700 transition-all duration-300"
                  id={`why-highlight-${idx}`}
                >
                  <div className="bg-[#ca531a] p-3.5 rounded-2xl shrink-0 flex items-center justify-center">
                    <IconComp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1.5 text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-emerald-100/70 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
