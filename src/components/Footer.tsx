import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onTabChange?: (tab: 'home' | 'tienda') => void;
  currentTab?: 'home' | 'tienda';
}

export default function Footer({ onTabChange, currentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, targetTab: 'home' | 'tienda' = 'home') => {
    e.preventDefault();
    
    if (onTabChange && currentTab !== targetTab) {
      onTabChange(targetTab);
      if (targetTab === 'home' && href !== '#inicio') {
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#24411a] text-white pt-20 pb-8 border-t border-emerald-950 relative overflow-hidden" id="footer">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-emerald-900/50">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <img
              src="https://i.postimg.cc/ZnZs8N5j/logoweb-tellex.png"
              alt="TELLEX Logo"
              referrerPolicy="no-referrer"
              className="h-16 w-auto object-contain brightness-100 contrast-125"
            />
            <p className="text-xs md:text-sm text-emerald-100/70 font-light leading-relaxed max-w-sm">
              Sistemas avanzados de ingeniería sanitaria y control molecular de plagas. Protegemos estructuras corporativas, industriales y hogares residenciales con garantía certificada por 12 meses.
            </p>
            {/* Social handles */}
            <div className="flex gap-3">
              <a href="https://instagram.com/fumigaciones.tellex" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-emerald-900/40 hover:bg-[#ca531a] transition-colors text-white" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <span className="text-xs text-emerald-100/60 flex items-center font-medium">@fumigaciones.tellex</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-emerald-100/80 font-light">
              <li>
                <a href="#inicio" onClick={(e) => handleLinkClick(e, '#inicio', 'home')} className="hover:text-[#ca531a] transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#servicios" onClick={(e) => handleLinkClick(e, '#servicios', 'home')} className="hover:text-[#ca531a] transition-colors">Servicios</a>
              </li>
              <li>
                <a href="#nosotros" onClick={(e) => handleLinkClick(e, '#nosotros', 'home')} className="hover:text-[#ca531a] transition-colors">Nosotros</a>
              </li>
              <li>
                <a href="#testimonios" onClick={(e) => handleLinkClick(e, '#testimonios', 'home')} className="hover:text-[#ca531a] transition-colors">Testimonios</a>
              </li>
              <li>
                <a href="#contacto" onClick={(e) => handleLinkClick(e, '#contacto', 'home')} className="hover:text-[#ca531a] transition-colors">Contacto</a>
              </li>
              <li>
                <a href="#tienda" onClick={(e) => handleLinkClick(e, '#tienda', 'tienda')} className="hover:text-[#ca531a] transition-colors font-semibold text-[#ca531a]">Tienda Online</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Contacto Técnico
            </h4>
            <ul className="space-y-3.5 text-xs md:text-sm text-emerald-100/80 font-light">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#ca531a] shrink-0 mt-0.5" />
                <span>+58 414-2338654</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#ca531a] shrink-0 mt-0.5" />
                <span className="break-all">Fumigacionestellex@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ca531a] shrink-0 mt-0.5" />
                <span>Caracas, Venezuela.</span>
              </li>
            </ul>
          </div>

          {/* Interactive coverage Map representation */}
          <div className="lg:col-span-3 space-y-4" id="coverage-map-box">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Cobertura Activa
            </h4>
            <p className="text-xs text-emerald-100/60 font-light mb-2">
              Caracas y Área Metropolitana con atención exprés.
            </p>
            {/* Minimalist Tech Vector Map */}
            <div className="relative w-full h-36 rounded-2xl bg-emerald-950/40 border border-emerald-900 overflow-hidden flex items-center justify-center p-2">
              <svg className="w-full h-full opacity-35" viewBox="0 0 200 100" fill="none">
                <path d="M10,80 Q50,40 100,80 T190,80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <path d="M30,20 Q80,90 120,30 T180,50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx="60" cy="50" r="30" fill="none" stroke="rgba(202, 83, 26, 0.15)" strokeWidth="1" />
                <circle cx="130" cy="40" r="45" fill="none" stroke="rgba(202, 83, 26, 0.1)" strokeWidth="1" />
              </svg>
              {/* Radar Pins */}
              <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ca531a] animate-pulse"></span>
                <span className="text-[8px] bg-slate-900/70 text-white px-1 rounded-sm mt-1 font-semibold">Caracas Norte</span>
              </div>
              <div className="absolute top-1/2 left-2/3 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[8px] bg-slate-900/70 text-white px-1 rounded-sm mt-1 font-semibold">Caracas Este</span>
              </div>
              <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ca531a] animate-pulse"></span>
                <span className="text-[8px] bg-slate-900/70 text-white px-1 rounded-sm mt-1 font-semibold">Caracas Oeste</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-100/50 font-light gap-4 border-t border-emerald-900/50">
          <p>
            © {currentYear} TELLEX. Todos los derechos reservados. | Hecho por{' '}
            <a 
              href="https://instagram.com/legaint.ve" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold underline text-white hover:text-[#ca531a] transition-colors"
            >
              Legaint Corporation
            </a>
          </p>
          <div className="flex gap-4">
            <a href="#privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</a>
            <span>•</span>
            <a href="#terminos" className="hover:text-white transition-colors">Términos del Servicio</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
