'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface TourCompletionToastProps {
  isVisible: boolean;
  onClose: () => void;
  tourName?: string;
  autoHideDelay?: number;
}

export default function TourCompletionToast({
  isVisible,
  onClose,
  tourName = "Guida",
  autoHideDelay = 5000
}: TourCompletionToastProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      
      if (autoHideDelay > 0) {
        const timer = setTimeout(() => {
          setIsShowing(false);
          setTimeout(onClose, 300); // Aspetta l'animazione di uscita
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoHideDelay, onClose]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[10001] max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-green-200 overflow-hidden">
            {/* Header con gradiente verde */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-green-900 text-sm">
                      🎉 Tour Completato!
                    </h3>
                    <p className="text-xs text-green-600">
                      {tourName} terminato con successo
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-green-400 hover:text-green-600 p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenuto */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <StarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Ottimo lavoro! Hai completato la guida e ora conosci tutti i passaggi 
                    per selezionare il codice ATECO più adatto alla tua attività.
                  </p>
                  
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-green-700 font-medium mb-1">
                      💡 Cosa fare ora:
                    </p>
                    <ul className="text-xs text-green-600 space-y-1">
                      <li>• Procedi con la selezione del tuo codice ATECO</li>
                      <li>• Completa i campi del form</li>
                      <li>• Continua al prossimo passaggio</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Barra di progresso per l'auto-hide */}
              {autoHideDelay > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-green-100 rounded-full h-1">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: autoHideDelay / 1000, ease: 'linear' }}
                      className="bg-green-500 h-1 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 