import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Construct the WhatsApp URL with the encoded message
    const formattedMessage = encodeURIComponent(message);
    const phoneNumber = '584142338654'; // Caracas, Venezuela
    const url = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;
    
    // Open in new window
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick message popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
            id="wa-popup"
          >
            {/* Header */}
            <div className="bg-[#24411a] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#24411a] rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Soporte TELLEX</h4>
                  <p className="text-xs text-green-200">En línea • Respuesta inmediata</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Cerrar soporte"
                id="close-wa-popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-slate-50 min-h-24">
              <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100 shadow-sm leading-relaxed">
                Hola 👋. ¿Has detectado indicios de termitas, roedores o insectos? Escríbenos y un experto te atenderá de inmediato.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe tu consulta aquí..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#ca531a] focus:ring-1 focus:ring-[#ca531a]"
                id="wa-input"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-[#ca531a] text-white p-2.5 rounded-xl hover:bg-[#ca531a]/90 transition-colors disabled:opacity-40 disabled:hover:bg-[#ca531a]"
                aria-label="Enviar mensaje"
                id="send-wa-message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pulse Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-[#ca531a] hover:bg-[#ca531a]/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
        id="wa-float-btn"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#ca531a]/30 animate-ping opacity-75"></span>
        <MessageSquare className="w-6 h-6 relative z-10" />
      </motion.button>
    </div>
  );
}
