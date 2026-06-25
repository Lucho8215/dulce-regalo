import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = '573213175459';
const WHATSAPP_MESSAGE = 'Hola! Me interesa un regalo de Dulce Regalo 🎁';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 max-w-[220px]"
          >
            <span>¿Tienes dudas? ¡Escríbenos!</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* Ícono oficial de WhatsApp en SVG */}
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.77 1.8 6.77L2 30l7.43-1.77A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.4c-2.2 0-4.28-.6-6.07-1.63l-.43-.26-4.41 1.05 1.08-4.3-.28-.45A11.38 11.38 0 014.6 16C4.6 9.7 9.7 4.6 16 4.6S27.4 9.7 27.4 16 22.3 27.4 16 27.4zm6.27-8.57c-.34-.17-2.02-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.25-.74.08-.34-.17-1.43-.53-2.72-1.68-1.01-.9-1.69-2.01-1.88-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.54-.28-.67-.56-.58-.77-.59H9.8c-.2 0-.54.08-.82.4-.28.31-1.08 1.05-1.08 2.56 0 1.51 1.1 2.97 1.26 3.18.17.2 2.17 3.3 5.25 4.63.73.32 1.3.5 1.75.64.73.23 1.4.2 1.93.12.59-.09 1.81-.74 2.07-1.45.25-.71.25-1.32.17-1.45-.08-.12-.3-.2-.64-.37z" />
        </svg>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
