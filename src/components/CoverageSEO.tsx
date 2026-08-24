import React from 'react';
import { MapPin, Shield, CheckCircle2, ChevronRight, Sparkles, Building2, Anchor, Trees } from 'lucide-react';
import { motion } from 'motion/react';

export default function CoverageSEO() {
  const cities = [
    {
      name: 'Caracas (Distrito Capital & Miranda)',
      badge: 'Sede Central Metropolitana',
      icon: Building2,
      desc: 'Soluciones especializadas de fumigación en Caracas para zonas de alta densidad residencial y comercial. Combatimos chinches de cama en apartamentos, cucarachas en cocinas comerciales y control integral de roedores.',
      keyZones: [
        'Chacao & Altamira',
        'Las Mercedes & Baruta',
        'La Castellana & El Hatillo',
        'Sucre & Centro Histórico'
      ],
      specialty: 'Control molecular de chinches, fumigación de restaurantes, exclusión mecánica de roedores.'
    },
    {
      name: 'Lechería (Anzoátegui)',
      badge: 'Sucursal Oriente VIP',
      icon: Trees,
      desc: 'Fumigación de alta gama en Lechería, adaptada al ecosistema costero. Expertos en el tratamiento de comején (termitas) en condominios, villas y yates, así como la prevención activa del mosquito del dengue.',
      keyZones: [
        'Complejo Turístico El Morro',
        'Playa Mansa & Playa Lido',
        'Av. Principal de Lechería',
        'Cerro El Morro & Las Villas'
      ],
      specialty: 'Erradicación de termitas (comején) de madera, nebulización biológica de mosquitos, control de plagas marinas.'
    },
    {
      name: 'Puerto La Cruz (Anzoátegui)',
      badge: 'Cobertura Industrial y Portuaria',
      icon: Anchor,
      desc: 'Control integral de plagas en Puerto La Cruz, enfocado en comercios, hoteles, bodegas y zonas industriales cercanas a los puertos. Eliminamos vectores portadores de enfermedades y protegemos inventarios de alimentos.',
      keyZones: [
        'Paseo Colón & Casco Central',
        'Av. Municipal & Zona Industrial',
        'Guanta & Sector Las Garzas',
        'Pozuelos & Áreas Portuarias'
      ],
      specialty: 'Sanitización industrial, control biológico de larvas, desratización de almacenes.'
    }
  ];

  return (
    <section className="py-20 bg-[#24411a]/5 border-t border-b border-emerald-900/10" id="cobertura-seo">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight leading-tight mb-3">
            Servicio de Control de Plagas Certificado en <span className="font-semibold text-[#24411a]">Venezuela</span>
          </h2>
          <p className="text-[#ca531a] font-bold text-sm md:text-base uppercase tracking-wider mb-4">
            15 Años en el Mercado — Líderes en Fumigación de Chinches, Dengue, Insectos, Roedores y Termitas
          </p>
          <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed">
            TELLEX® ofrece cobertura sanitaria premium bajo estrictos estándares internacionales. Diseñamos planes específicos adaptados al microclima y exigencia de cada ciudad.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cities.map((city, idx) => {
            const IconComponent = city.icon;
            return (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:border-emerald-900/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ca531a] bg-[#ca531a]/10 px-2.5 py-1 rounded-full">
                      {city.badge}
                    </span>
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-[#24411a]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-[#ca531a] shrink-0" />
                    {city.name}
                  </h3>

                  <p className="text-xs text-slate-600 font-light leading-relaxed mb-6">
                    {city.desc}
                  </p>

                  {/* Key neighborhood / zone chips */}
                  <div className="mb-6">
                    <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2.5">
                      Sectores Clave de Atención Directa:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {city.keyZones.map((zone) => (
                        <span
                          key={zone}
                          className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-[#24411a] text-slate-700 px-2 py-1 rounded transition-colors"
                        >
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#ca531a] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Especialidad Localizada:
                      </p>
                      <p className="text-[11px] text-[#24411a] font-medium mt-0.5 leading-relaxed">
                        {city.specialty}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive SEO copy block */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <h3 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#24411a]" />
                ¿Por qué elegir TELLEX para la fumigación de tu hogar o comercio?
              </h3>
              <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                Nos diferenciamos por aplicar principios de ingeniería sanitaria avanzada de última generación. No inundamos tus ambientes de pesticidas ineficaces de olor fuerte; empleamos microencapsulaciones de liberación lenta, choque térmico ecológico para chinches de cama en Caracas y Lechería, y planes de control integrados contra vectores del Dengue en todo el oriente venezolano.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#24411a] shrink-0" />
                <span className="text-xs font-semibold text-emerald-950">Fórmulas Certificadas Inodoras</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold text-amber-950">Garantía Escrita de 5 Meses</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
