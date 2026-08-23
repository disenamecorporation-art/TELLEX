import React, { useState } from 'react';
import { Shield, Check, Play, ChevronRight, Activity, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  onQuoteClick: () => void;
  onWorkClick: () => void;
}

export default function HeroSection({ onQuoteClick, onWorkClick }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-white overflow-visible"
      id="inicio"
    >
      {/* Background image with low opacity (30%) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none z-0"
        style={{ backgroundImage: "url('/src/assets/images/residential_background_1787290508364.jpg')" }}
      ></div>

      {/* Semi-transparent elegant backdrop: high-opacity white on mobile for pristine text contrast, and beautiful custom gradient on desktop to fully reveal the residential area with 70% white transition */}
      <div className="absolute inset-0 bg-white/95 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/95 lg:via-white/70 lg:to-transparent pointer-events-none z-0"></div>

      {/* Dynamic graphic tech grids in background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ca531a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center overflow-visible">
          
          {/* Left Column - Headline & Persuasive Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center" id="hero-left-content">
            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#ca531a] bg-[#ca531a]/10 px-3 py-1.5 rounded-full inline-block w-fit mb-6"
              id="hero-badge"
            >
              15 Años en el Mercado — Líderes en Fumigación de Chinches y Dengue
            </motion.span>

            {/* Giant Title: Montserrat Light/ExtraLight for display feel */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl xl:text-6xl font-light text-slate-900 tracking-tight leading-[1.1] mb-6"
              id="hero-title"
            >
              Control de Plagas Certificado con <br />
              <span className="font-semibold text-[#24411a]">5 meses de garantía total</span>
            </motion.h1>

            {/* Quote attribution like Elon Musk reference */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pl-4 border-l-2 border-[#ca531a] mb-8"
              id="hero-quote-block"
            >
              <p className="text-slate-500 text-sm md:text-base font-light italic leading-relaxed">
                "Eliminación total y ecológica de chinches mediante nebulización, aspirado industrial y vapor a alta temperatura. Prevención activa contra el mosquito del dengue."
              </p>
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-2 block">
                — Ingeniería Sanitaria Certificada, TELLEX
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center"
              id="hero-ctas"
            >
              <button
                onClick={onQuoteClick}
                className="bg-[#ca531a] hover:bg-[#ca531a]/95 text-white font-semibold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                id="hero-cta-inspeccion"
              >
                Solicitar Inspección Gratis
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onWorkClick}
                className="group border-2 border-slate-200 hover:border-[#24411a] hover:bg-[#24411a]/5 text-[#24411a] font-semibold text-sm px-6 py-4 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer"
                id="hero-cta-video"
              >
                <div className="w-5 h-5 rounded-full bg-[#24411a] text-white flex items-center justify-center text-[10px] group-hover:scale-110 transition-transform">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                Ver cómo trabajamos
              </button>
            </motion.div>
          </div>

          {/* Right Column - Heroic Technician with Floating Glassmorphism Cards */}
          <div className="lg:col-span-6 relative flex justify-center h-[480px] lg:h-[580px] items-end overflow-visible" id="hero-right-visual">
            
            {/* Tech line vectors crossing behind/over */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 400" fill="none">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                d="M10 200 C 150 120, 250 280, 390 180"
                stroke="rgba(202, 83, 26, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
                d="M50 350 C 180 320, 280 80, 350 50"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Giant Technician cutout without background container, extending way above the Hero section top into the header space */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] lg:w-[170%] h-[135%] lg:h-[170%] pointer-events-none z-10 overflow-visible flex items-end justify-center"
              id="hero-technician-wrapper"
            >
              <img
                src="https://i.postimg.cc/Znd35sSc/asd22244.png"
                alt="Técnico fumigador profesional de TELLEX trabajando"
                referrerPolicy="no-referrer"
                className="w-auto h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] overflow-visible pointer-events-none"
              />
            </motion.div>

            {/* FLOAT CARD 1: "Zonas tratadas" with mini bar graph */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -right-4 top-[10%] z-25 p-4 rounded-2xl glass-overlay shadow-lg text-white w-48 border border-white/10"
              id="float-card-zones"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Zonas Tratadas</span>
                <Activity className="w-3.5 h-3.5 text-[#ca531a]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight">4,812</span>
                <span className="text-[9px] text-emerald-400 font-medium">+12% este mes</span>
              </div>
              {/* Mini bar graph */}
              <div className="flex items-end gap-1.5 h-7 mt-3">
                <div className="bg-white/20 w-full h-[40%] rounded-sm"></div>
                <div className="bg-white/20 w-full h-[65%] rounded-sm"></div>
                <div className="bg-[#ca531a] w-full h-[85%] rounded-sm"></div>
                <div className="bg-white/20 w-full h-[50%] rounded-sm"></div>
                <div className="bg-[#ca531a] w-full h-[100%] rounded-sm"></div>
              </div>
            </motion.div>

            {/* FLOAT CARD 2: "Nivel de infestación" with progress bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -left-4 bottom-[20%] z-25 p-4 rounded-2xl glass-overlay shadow-lg text-white w-52 border border-white/10"
              id="float-card-infestation"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Monitoreo de Amenazas</span>
              </div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium">Nivel de Plagas</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">Seguro</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[15%] rounded-full"></div>
              </div>
              <p className="text-[9px] text-slate-300 mt-2 font-light">Ecosistema libre de termitas e insectos.</p>
            </motion.div>

            {/* FLOAT CARD 3: Circular gauge for 99% effectiveness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute right-4 bottom-[4%] z-25 p-4 rounded-2xl glass-overlay shadow-lg text-white flex items-center gap-3 border border-white/10"
              id="float-card-gauge"
            >
              {/* Simulated circular gauge */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: '99, 100' }}
                    transition={{ duration: 1.2, delay: 1 }}
                    className="text-[#ca531a]"
                    strokeWidth="3.5"
                    strokeDasharray="99, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-[10px] font-bold">99%</div>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-white">Efectividad TELLEX</h5>
                <p className="text-[9px] text-slate-300">Eliminación garantizada.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* WAVE DECORATIVE DIVISION Below */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] z-20" id="hero-wave-separator">
        <svg className="relative block w-full h-[40px] md:h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ca531a" />
              <stop offset="100%" stopColor="#24411a" />
            </linearGradient>
          </defs>
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="url(#wave-grad)"></path>
        </svg>
      </div>
    </section>
  );
}
