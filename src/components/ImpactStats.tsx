import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function ImpactStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Custom states for counters
  const [homes, setHomes] = useState(0);
  const [effectiveness, setEffectiveness] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Animate homes to 5000
      let startHomes = 0;
      const endHomes = 5000;
      const durationHomes = 1500; // ms
      const stepHomes = Math.ceil(endHomes / (durationHomes / 16));
      
      const timerHomes = setInterval(() => {
        startHomes += stepHomes;
        if (startHomes >= endHomes) {
          setHomes(endHomes);
          clearInterval(timerHomes);
        } else {
          setHomes(startHomes);
        }
      }, 16);

      // Animate effectiveness to 99
      let startEff = 0;
      const endEff = 99;
      const durationEff = 1500; // ms
      const stepEff = Math.ceil(endEff / (durationEff / 16));

      const timerEff = setInterval(() => {
        startEff += stepEff;
        if (startEff >= endEff) {
          setEffectiveness(endEff);
          clearInterval(timerEff);
        } else {
          setEffectiveness(startEff);
        }
      }, 16);

      return () => {
        clearInterval(timerHomes);
        clearInterval(timerEff);
      };
    }
  }, [isInView]);

  const stats = [
    {
      value: `+${homes.toLocaleString()}`,
      label: 'Hogares Protegidos',
      description: 'Zonas residenciales y comerciales totalmente erradicadas.'
    },
    {
      value: `${effectiveness}%`,
      label: 'Efectividad Científica',
      description: 'Erradicación total desde la primera aplicación química.'
    },
    {
      value: '24/7',
      label: 'Emergencias Activas',
      description: 'Ingenieros de guardia listos para llamadas críticas de control.'
    },
    {
      value: '0',
      label: 'Reincidencias Año 1',
      description: 'Respaldado por nuestra póliza de garantía legal por escrito.'
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-slate-50 border-t border-b border-slate-100 overflow-hidden" 
      id="estadisticas"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center p-4"
              id={`stat-card-${idx}`}
            >
              {/* Ultra light Montserrat font size for numbers as requested */}
              <h3 className="text-5xl md:text-6xl font-extralight tracking-tight text-[#ca531a] mb-3 select-none">
                {stat.value}
              </h3>
              
              <h4 className="text-sm font-semibold text-[#24411a] uppercase tracking-wider mb-2">
                {stat.label}
              </h4>
              
              <p className="text-xs md:text-sm text-slate-400 font-light max-w-[240px] leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
