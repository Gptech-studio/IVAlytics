'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon,
  BoltIcon,
  ClockIcon,
  StarIcon,
  XMarkIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { TourConfig } from '../data/guided-tours';

interface TourSelectorProps {
  tours: TourConfig[];
  isOpen: boolean;
  onSelectTour: (tour: TourConfig) => void;
  onClose: () => void;
  defaultTourId?: string;
}

export default function TourSelector({
  tours,
  isOpen,
  onSelectTour,
  onClose,
  defaultTourId
}: TourSelectorProps) {
  const [selectedTourId, setSelectedTourId] = useState(defaultTourId || tours[0]?.id);

  const selectedTour = tours.find(tour => tour.id === selectedTourId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'principiante':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'esperto':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'principiante':
        return <AcademicCapIcon className="w-4 h-4" />;
      case 'intermedio':
        return <StarIcon className="w-4 h-4" />;
      case 'esperto':
        return <BoltIcon className="w-4 h-4" />;
      default:
        return <AcademicCapIcon className="w-4 h-4" />;
    }
  };

  const handleStartTour = () => {
    if (selectedTour) {
      onSelectTour(selectedTour);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PlayIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Scegli la Tua Guida 🎯
                  </h2>
                  <p className="text-sm text-gray-600">
                    Seleziona il tour più adatto alle tue esigenze
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenuto */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {tours.map((tour) => (
                <motion.div
                  key={tour.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedTourId === tour.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTourId(tour.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(tour.difficulty)}`}>
                          {getDifficultyIcon(tour.difficulty)}
                          <span className="ml-1 capitalize">{tour.difficulty}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {tour.estimatedTime}
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {tour.steps.length} passaggi
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {tour.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {tour.description}
                      </p>
                    </div>
                    
                    <div className={`ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTourId === tour.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedTourId === tour.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Anteprima del tour selezionato */}
            {selectedTour && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200"
              >
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Anteprima: {selectedTour.name}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Durata stimata:</strong> {selectedTour.estimatedTime}</p>
                  <p><strong>Livello:</strong> {selectedTour.difficulty}</p>
                  <p><strong>Numero di passaggi:</strong> {selectedTour.steps.length}</p>
                </div>
                
                {/* Mostra i primi 3 passaggi come anteprima */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Primi passaggi:</p>
                  <div className="space-y-1">
                    {selectedTour.steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-center text-xs text-gray-600">
                        <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                          {index + 1}
                        </span>
                        {step.title}
                      </div>
                    ))}
                    {selectedTour.steps.length > 3 && (
                      <div className="text-xs text-gray-500 ml-6">
                        ...e altri {selectedTour.steps.length - 3} passaggi
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info generale */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="bg-amber-100 p-1.5 rounded-lg">
                  <StarIcon className="w-4 h-4 text-amber-600" />
                </div>
                <div className="ml-3 text-sm text-amber-700">
                  <p className="font-medium mb-1">💡 Consigli per la migliore esperienza:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Prendi il tuo tempo per leggere ogni suggerimento</li>
                    <li>• Usa le frecce ← → per navigare o clicca sui pulsanti</li>
                    <li>• Puoi uscire dalla guida premendo ESC in qualsiasi momento</li>
                    <li>• La guida si adatta automaticamente al tuo schermo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Azioni */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Non ora
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Salta guida
                </button>
                <button
                  onClick={handleStartTour}
                  disabled={!selectedTour}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Inizia Guida
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 