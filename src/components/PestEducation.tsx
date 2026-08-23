import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Wind, HelpCircle, Activity, Flame, Bug, Check, AlertTriangle, ChevronRight, Waves } from 'lucide-react';

export default function PestEducation() {
  const [activeTab, setActiveTab] = useState<'chinches' | 'dengue'>('chinches');

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100" id="pest-education">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header section with top-grade typography */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ca531a] bg-[#ca531a]/10 px-3 py-1.5 rounded-full inline-block mb-4">
            Guía Técnica de Salud Pública
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight mb-6">
            Conoce el Control Científico de <span className="font-semibold text-[#24411a]">Chinches & Dengue</span>
          </h2>
          <p className="text-slate-600 font-light text-base md:text-lg">
            Aprende sobre los hábitos, riesgos sanitarios y la metodología especializada de grado sanitario que aplicamos en TELLEX para eliminarlos de manera infalible.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-200/60 p-2 rounded-2xl border border-slate-300/40 gap-3">
            <motion.button
              onClick={() => setActiveTab('chinches')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${
                activeTab === 'chinches'
                  ? 'bg-gradient-to-r from-[#ca531a] to-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-sm border border-slate-200/50'
              }`}
            >
              <Bug className={`w-4 h-4 ${activeTab === 'chinches' ? 'animate-bounce' : 'text-slate-500'}`} />
              Chinches de Cama (Tratamiento Térmico & ULV)
              {activeTab === 'chinches' && (
                <motion.div 
                  layoutId="active-indicator" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('dengue')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${
                activeTab === 'dengue'
                  ? 'bg-gradient-to-r from-[#24411a] to-emerald-700 text-white shadow-lg shadow-emerald-700/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-sm border border-slate-200/50'
              }`}
            >
              <Waves className={`w-4 h-4 ${activeTab === 'dengue' ? 'animate-pulse' : 'text-slate-500'}`} />
              Prevención de Dengue (Aedes aegypti)
              {activeTab === 'dengue' && (
                <motion.div 
                  layoutId="active-indicator" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* Dynamic Tab Panel */}
        <AnimatePresence mode="wait">
          {activeTab === 'chinches' ? (
            <motion.div
              key="chinches"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column: Visual & Treatment steps */}
              <div className="lg:col-span-5 relative">
                <div className="group overflow-hidden rounded-2xl shadow-xl border border-slate-200 relative">
                  <img
                    src="https://abiomed.es/wp-content/uploads/2023/11/picadura-de-chinches-1.jpg"
                    alt="Identificación de Picadura de Chinches"
                    className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none"></div>
                  
                  <div className="absolute top-4 left-4 bg-[#ca531a] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg z-10">
                    Guía de Síntomas
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Identificación Crítica</p>
                    <h4 className="text-lg font-bold">Patrón de Picadura de Chinches</h4>
                    <p className="text-xs text-slate-200 mt-1 font-light leading-relaxed">Suelen aparecer alineadas de tres en tres ("desayuno, almuerzo y cena") y causan picor intenso en la piel.</p>
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm">¿Sabías qué?</h4>
                    <p className="text-amber-800 text-xs mt-1 leading-relaxed font-light">
                      Las chinches de cama pueden sobrevivir meses sin alimentarse y son resistentes a insecticidas comunes del supermercado. El calor extremo por encima de los 60°C destruye sus proteínas al instante.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Explanatory Content */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-slate-900 mb-4">
                    Metodología de Erradicación de <span className="font-semibold text-[#24411a]">Triple Acción Térmica</span>
                  </h3>
                  <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed">
                    Las chinches de cama (<span className="italic">Cimex lectularius</span>) anidan en costuras de colchones, marcos de cama y grietas milimétricas. Nuestro protocolo elimina el problema en todas sus etapas de vida: huevo, ninfa y adulto.
                  </p>
                </div>

                {/* The 3 Pillars */}
                <div className="space-y-4">
                  <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 text-[#24411a] flex items-center justify-center shrink-0">
                      <Wind className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-950 text-base flex items-center gap-2">
                        1. Aspirado Industrial de Alta Potencia
                        <span className="text-[10px] uppercase font-bold text-[#ca531a] bg-[#ca531a]/10 px-2 py-0.5 rounded-full">
                          Fase Física
                        </span>
                      </h4>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed font-light">
                        Remoción por succión forzada en todos los pliegues y rendijas. Esto reduce mecánicamente el 80% de la población activa de manera inmediata antes de aplicar calor o químicos.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-950 text-base flex items-center gap-2">
                        2. Vapor a Alta Temperatura (180°C)
                        <span className="text-[10px] uppercase font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Choque Térmico
                        </span>
                      </h4>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed font-light">
                        Inyección directa de vapor seco sobrecalentado a presión. Penetra profundamente alfombras y madera eliminando instantáneamente los huevos resistentes a insecticidas comunes.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-950 text-base flex items-center gap-2">
                        3. Nebulización en Frío (ULV)
                        <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Efecto Residual
                        </span>
                      </h4>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed font-light">
                        Creación de una niebla ultra fina con microencapsulados ecológicos que se depositan en los rincones más inaccesibles, garantizando protección de largo plazo y el blindaje de la zona.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dengue"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Column: Visual & Prevention Tips */}
              <div className="lg:col-span-5 relative order-last lg:order-first">
                <div className="group overflow-hidden rounded-2xl shadow-xl border border-slate-200 relative">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJgr7cWK4EPiQRb6UO8X-FgMaO0WY_HvuxcFcNk1AP6xcSQqpFG-YVyKzJ&s=10"
                    alt="Mosquito Aedes aegypti vector del dengue"
                    className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none"></div>

                  <div className="absolute top-4 left-4 bg-[#24411a] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg z-10">
                    Control Epidemiológico
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Amenaza Sanitaria</p>
                    <h4 className="text-lg font-bold">Aedes aegypti (Vector del Dengue)</h4>
                    <p className="text-xs text-slate-200 mt-1 font-light leading-relaxed">Identificable por sus marcas blancas en las patas y el tórax. Se reproduce rápidamente en pequeños acumulaciones de agua limpia.</p>
                  </div>
                </div>

                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <h4 className="font-semibold text-emerald-900 text-sm mb-2">Estrategia Preventiva en el Hogar:</h4>
                  <ul className="space-y-2 text-xs text-emerald-800 font-light">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Evitar estancamiento de agua en envases abiertos.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Colocar mallas mosquiteras en ventanas y desagües.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Aplicar larvicidas ecológicos en tanques de almacenamiento.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Explanatory Content on Dengue */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-slate-900 mb-4">
                    Control Integral de <span className="font-semibold text-[#24411a]">Mosquitos del Dengue</span>
                  </h3>
                  <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed">
                    El mosquito <span className="italic">Aedes aegypti</span> es el principal vector transmisor de virus como el Dengue, Zika y Chikungunya. Su combate efectivo exige una combinación de eliminación de larvas y desinfección espacial de ejemplares adultos.
                  </p>
                </div>

                {/* Key Tactics */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                      <Wind className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-slate-950 text-sm mb-2">Termonebulización de Humo Caliente</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">
                      Especial para exteriores y jardines densos. Genera una densa nube térmica que penetra el follaje matando mosquitos adultos voladores al instante.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#24411a] flex items-center justify-center mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-slate-950 text-sm mb-2">Control Larvario Químico y Biológico</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">
                      Aplicamos reguladores de crecimiento y larvicidas específicos de efecto residual prolongado en depósitos de agua, impidiendo que maduren.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <Bug className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-slate-950 text-sm mb-2">Estudio Entomológico Local</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">
                      Nuestros técnicos mapean y clasifican posibles puntos de anidación alrededor de tu propiedad para erradicar futuros brotes.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-slate-950 text-sm mb-2">Garantía Certificada de Zona Segura</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">
                      Acompañamos cada servicio con recomendaciones sanitarias específicas y seguimiento por escrito garantizado de 5 meses.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
