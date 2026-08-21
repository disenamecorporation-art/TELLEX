import React from 'react';
import { Award, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function TrustBar() {
  const trusts = [
    {
      icon: Award,
      title: 'Fumigación Certificada',
      desc: 'Normas Sanitarias Federales',
    },
    {
      icon: Sparkles,
      title: '+10 Años de Experiencia',
      desc: 'Expertos de Alta Gama',
    },
    {
      icon: Leaf,
      title: '100% Biodegradable',
      desc: 'Seguro para Mascotas y Familias',
    },
    {
      icon: ShieldCheck,
      title: 'Garantía de 12 Meses',
      desc: 'Seguimiento Escrito Sin Costo',
    },
  ];

  return (
    <section className="bg-[#24411a] py-8 text-white border-y border-emerald-950 relative overflow-hidden" id="trust-bar">
      {/* Decorative subtle background overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-900/40 to-transparent opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center">
          {trusts.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-2 rounded-xl hover:bg-emerald-900/20 transition-all duration-300"
                id={`trust-item-${idx}`}
              >
                <div className="bg-[#ca531a] p-3 rounded-2xl shadow-md shrink-0 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base tracking-wide text-white uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-emerald-100/80 font-light mt-0.5 leading-snug">
                    {item.desc}
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
