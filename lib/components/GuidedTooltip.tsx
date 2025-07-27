'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  LightBulbIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

export interface TooltipStep {
  id: string;
  target: string; // CSS selector dell'elemento da evidenziare
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'focus' | 'none';
  waitForElement?: boolean; // Aspetta che l'elemento sia visibile
  category?: string; // Per raggruppare i tooltip
}

interface GuidedTooltipProps {
  steps: TooltipStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
  showProgress?: boolean;
  skipText?: string;
  completeText?: string;
  className?: string;
}

export default function GuidedTooltip({
  steps,
  isActive,
  onComplete,
  onSkip,
  autoStart = false,
  showProgress = true,
  skipText = "Salta guida",
  completeText = "Completato!",
  className = ""
}: GuidedTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(autoStart);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  // Trova e posiziona il tooltip sull'elemento target
  useEffect(() => {
    if (!isActive || !isStarted || !currentStepData) return;

    const findTarget = () => {
      const element = document.querySelector(currentStepData.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        calculatePosition(element);
        setIsVisible(true);
        // Scrolla per rendere visibile l'elemento se necessario
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      } else if (currentStepData.waitForElement) {
        // Riprova dopo un breve delay se l'elemento non è ancora disponibile
        setTimeout(findTarget, 100);
      }
    };

    findTarget();
  }, [isActive, isStarted, currentStep, currentStepData]);

  // Calcola la posizione del tooltip
  const calculatePosition = (element: HTMLElement) => {
    if (!tooltipRef.current) return;

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = 0;
    let left = 0;

    const position = currentStepData.position || 'bottom';

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 10;
        break;
      case 'center':
        top = (viewportHeight - tooltipRect.height) / 2;
        left = (viewportWidth - tooltipRect.width) / 2;
        break;
    }

    // Aggiusta se esce dal viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }

    setTooltipPosition({ top, left });
  };

  // Gestione tasti freccia
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || !isStarted) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
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
  }, [isActive, isStarted, currentStep]);

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setIsStarted(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    setIsStarted(false);
    onSkip();
  };

  const getHighlightStyle = () => {
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    return {
      position: 'fixed' as const,
      top: rect.top - 4,
      left: rect.left - 4,
      width: rect.width + 8,
      height: rect.height + 8,
      borderRadius: '8px',
      border: '3px solid #3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointerEvents: 'none' as const,
      zIndex: 9998,
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
    };
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay scuro */}
      <AnimatePresence>
        {isStarted && isVisible && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[9997]"
            onClick={handleSkip}
          />
        )}
      </AnimatePresence>

      {/* Highlight dell'elemento target */}
      <AnimatePresence>
        {isStarted && isVisible && targetElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={getHighlightStyle()}
            className="animate-pulse"
          />
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {isStarted && isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{ 
              position: 'fixed',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              zIndex: 9999,
            }}
            className={`bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm ${className}`}
          >
            {/* Header del tooltip */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <LightBulbIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="ml-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {currentStepData.title}
                    </h3>
                    {showProgress && (
                      <p className="text-xs text-gray-500">
                        Passo {currentStep + 1} di {steps.length}
                        {currentStepData.category && (
                          <span className="ml-1 text-blue-600">• {currentStepData.category}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenuto */}
            <div className="p-4">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {currentStepData.content}
              </p>

              {/* Progress bar */}
              {showProgress && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              )}

              {/* Navigazione */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    currentStep === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeftIcon className="w-3 h-3 mr-1" />
                  Indietro
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSkip}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    {skipText}
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    {currentStep === steps.length - 1 ? completeText : 'Avanti'}
                    {currentStep < steps.length - 1 && (
                      <ArrowRightIcon className="w-3 h-3 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Suggerimento tasti */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  💡 Usa ← → per navigare, ESC per uscire
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsante per avviare la guida */}
      <AnimatePresence>
        {!isStarted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleStart}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
          >
            <PlayIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Avvia guida
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
} 