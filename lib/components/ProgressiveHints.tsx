'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightBulbIcon,
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Hint {
  id: string;
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  stepId?: string;
}

interface ProgressiveHintsProps {
  hints: Hint[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
  delay?: number;
  stepId?: string;
}

export default function ProgressiveHints({
  hints,
  isActive,
  onComplete,
  onSkip,
  autoStart = true,
  delay = 2000,
  stepId
}: ProgressiveHintsProps) {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentHint = hints[currentHintIndex];

  // Auto-start dopo un delay
  useEffect(() => {
    if (isActive && autoStart && !hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true);
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isActive, autoStart, hasStarted, delay]);

  // Gestione tasti
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          handleSkip();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentHintIndex]);

  const handleNext = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const startHints = () => {
    setHasStarted(true);
    setIsVisible(true);
    setCurrentHintIndex(0);
  };

  // Pulsante per avviare i suggerimenti se non auto-start
  if (isActive && !autoStart && !hasStarted) {
    return (
      <button
        onClick={startHints}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-50 transform hover:scale-110"
        style={{ boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}
      >
        <LightBulbIcon className="w-6 h-6" />
      </button>
    );
  }

  if (!isActive || !isVisible || !currentHint) return null;

  return (
    <AnimatePresence>
      <HintTooltip
        hint={currentHint}
        currentIndex={currentHintIndex}
        totalHints={hints.length}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </AnimatePresence>
  );
}

interface HintTooltipProps {
  hint: Hint;
  currentIndex: number;
  totalHints: number;
  onNext: () => void;
  onSkip: () => void;
}

function HintTooltip({ hint, currentIndex, totalHints, onNext, onSkip }: HintTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const [hasInitialFocus, setHasInitialFocus] = useState(false); // Traccia se abbiamo già fatto il focus iniziale

  useEffect(() => {
    const positionTooltip = (shouldScroll: boolean = false) => {
      const targetElement = document.getElementById(hint.targetId);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 380; 
      const tooltipHeight = 160; 
      const margin = 20; // Aumentato da 16 per più spazio

      let top = 0;
      let left = 0;

      // Posizionamento intelligente con protezione contro taglio
      switch (hint.position) {
        case 'top':
          top = rect.top - tooltipHeight - margin;
          // Se va fuori schermo in alto, posiziona sotto
          if (top < 20) {
            top = rect.bottom + margin;
          }
          left = rect.left + (rect.width - tooltipWidth) / 2;
          break;
        case 'bottom':
          top = rect.bottom + margin;
          // Se va fuori schermo in basso, posiziona sopra
          if (top + tooltipHeight > window.innerHeight - 20) {
            top = rect.top - tooltipHeight - margin;
            // Se anche sopra va fuori, forza una posizione sicura
            if (top < 20) {
              top = 80; // Posizione fissa sicura dall'alto
            }
          }
          left = rect.left + (rect.width - tooltipWidth) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipHeight) / 2;
          left = rect.left - tooltipWidth - margin;
          // Se va fuori a sinistra, posiziona a destra
          if (left < 20) {
            left = rect.right + margin;
          }
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipHeight) / 2;
          left = rect.right + margin;
          // Se va fuori a destra, posiziona a sinistra
          if (left + tooltipWidth > window.innerWidth - 20) {
            left = rect.left - tooltipWidth - margin;
          }
          break;
        default:
          // Auto-posizionamento migliorato
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Priorità: sotto → sopra → destra → sinistra
          if (rect.bottom + tooltipHeight + margin + 40 < viewportHeight) {
            // Sotto con margine extra
            top = rect.bottom + margin;
            left = rect.left + (rect.width - tooltipWidth) / 2;
          } else if (rect.top - tooltipHeight - margin - 40 > 0) {
            // Sopra con margine extra
            top = rect.top - tooltipHeight - margin;
            left = rect.left + (rect.width - tooltipWidth) / 2;
          } else if (rect.right + tooltipWidth + margin + 20 < viewportWidth) {
            // Destra
            top = rect.top + (rect.height - tooltipHeight) / 2;
            left = rect.right + margin;
          } else {
            // Sinistra o posizione di sicurezza
            if (rect.left - tooltipWidth - margin > 20) {
              top = rect.top + (rect.height - tooltipHeight) / 2;
              left = rect.left - tooltipWidth - margin;
            } else {
              // Posizione di sicurezza centrata
              top = Math.max(80, Math.min(rect.top, viewportHeight - tooltipHeight - 80));
              left = (viewportWidth - tooltipWidth) / 2;
            }
          }
      }

      // Aggiustamenti finali per evitare bordi
      if (left < 20) left = 20;
      if (left + tooltipWidth > window.innerWidth - 20) {
        left = window.innerWidth - tooltipWidth - 20;
      }
      if (top < 20) top = 20;
      if (top + tooltipHeight > window.innerHeight - 20) {
        top = window.innerHeight - tooltipHeight - 20;
      }

      setPosition({ top, left });
      setIsPositioned(true);

      // Evidenzia il campo target con effetto più armonico e padding
      targetElement.style.boxShadow = '0 0 0 8px rgba(59, 130, 246, 0.15), 0 0 0 12px rgba(59, 130, 246, 0.08), 0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)';
      targetElement.style.borderColor = '#3B82F6';
      targetElement.style.transform = 'scale(1.02)';
      targetElement.style.transition = 'all 0.3s ease';
      targetElement.style.borderRadius = '8px';
      targetElement.style.margin = '16px'; // Aumentato da 8px a 16px per più respiro
      targetElement.style.zIndex = '999'; // Assicura che sia sopra altri elementi
      
      // Scrolla SOLO al primo caricamento se l'elemento non è visibile
      if (shouldScroll && !hasInitialFocus) {
        const elementRect = targetElement.getBoundingClientRect();
        const isVisible = (
          elementRect.top >= 0 &&
          elementRect.left >= 0 &&
          elementRect.bottom <= window.innerHeight &&
          elementRect.right <= window.innerWidth
        );
        
        // Scrolla solo se l'elemento non è completamente visibile
        if (!isVisible) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
        setHasInitialFocus(true);
      }
    };

    // Auto-avanzamento quando l'utente interagisce con il campo
    const handleFieldInteraction = (e: Event) => {
      // Aggiungi un piccolo delay per permettere all'utente di vedere il risultato
      setTimeout(() => {
        if (currentIndex < totalHints - 1) {
          onNext();
        }
      }, 800); // 800ms di delay
    };

    // Aggiornamento posizione senza scroll forzato
    const updatePositionOnly = () => {
      positionTooltip(false); // Non fare scroll quando l'utente scrolla
    };

    const targetElement = document.getElementById(hint.targetId);
    
    // Prima chiamata con scroll se necessario
    positionTooltip(true);
    
    // Listeners che NON forzano lo scroll
    window.addEventListener('resize', updatePositionOnly);
    window.addEventListener('scroll', updatePositionOnly, { passive: true }); // Scroll passivo per performance

    // Aggiungi listeners per auto-avanzamento
    if (targetElement) {
      targetElement.addEventListener('input', handleFieldInteraction);
      targetElement.addEventListener('change', handleFieldInteraction);
      targetElement.addEventListener('blur', handleFieldInteraction);
      
      // Per i select, aggiungi anche il click
      if (targetElement.tagName === 'SELECT') {
        targetElement.addEventListener('click', handleFieldInteraction);
      }
    }

    return () => {
      window.removeEventListener('resize', updatePositionOnly);
      window.removeEventListener('scroll', updatePositionOnly);
      
      // Rimuovi evidenziazione
      if (targetElement) {
        targetElement.style.boxShadow = '';
        targetElement.style.borderColor = '';
        targetElement.style.transform = '';
        targetElement.style.transition = '';
        targetElement.style.borderRadius = '';
        targetElement.style.margin = ''; // Rimuovi padding
        targetElement.style.zIndex = ''; // Rimuovi z-index
        
        // Rimuovi listeners
        targetElement.removeEventListener('input', handleFieldInteraction);
        targetElement.removeEventListener('change', handleFieldInteraction);
        targetElement.removeEventListener('blur', handleFieldInteraction);
        if (targetElement.tagName === 'SELECT') {
          targetElement.removeEventListener('click', handleFieldInteraction);
        }
      }
    };
  }, [hint.targetId, hint.position, currentIndex, totalHints, onNext, hasInitialFocus]);

  if (!isPositioned) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        width: '380px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)'
      }}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden"
    >
      {/* Header migliorato */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-1.5 rounded-full mr-3">
              <LightBulbIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-semibold text-white">{hint.title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-blue-100 bg-white/20 px-3 py-1 rounded-full font-medium">
              {currentIndex + 1}/{totalHints}
            </span>
            <button
              onClick={onSkip}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenuto migliorato */}
      <div className="p-5">
        <p className="text-base text-gray-700 mb-4 leading-relaxed font-medium">
          {hint.content}
        </p>

        {/* Azioni migliorate */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono mr-1">→</kbd>
            <span>o</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono mx-1">Invio</kbd>
            <span>per continuare</span>
          </div>
          <button
            onClick={onNext}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {currentIndex === totalHints - 1 ? (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Completato
              </>
            ) : (
              <>
                Continua
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 