'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CurrencyEuroIcon,
  DocumentChartBarIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { loadWizardData, saveWizardData, saveWizardStep, loadWizardStep, clearWizardData, hasWizardData, autoSaveWizardData } from '@/lib/utils';

// Components per ogni step del wizard
import StepDatiPersonali from './components/StepDatiPersonali';
import StepCodiceATECO from './components/StepCodiceATECO';
import StepDatiEconomici from './components/StepDatiEconomici';
import StepRiepilogo from './components/StepRiepilogo';
import StepRisultati from './components/StepRisultati';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const steps: WizardStep[] = [
  {
    id: 'dati-personali',
    title: 'Dati Personali',
    description: 'Inserisci i tuoi dati anagrafici e fiscali',
    icon: UserIcon,
    component: StepDatiPersonali,
  },
  {
    id: 'codice-ateco',
    title: 'Attività Economica',
    description: 'Identifica il tuo codice ATECO',
    icon: BuildingOfficeIcon,
    component: StepCodiceATECO,
  },
  {
    id: 'dati-economici',
    title: 'Dati Economici',
    description: 'Inserisci ricavi, costi e periodo',
    icon: CurrencyEuroIcon,
    component: StepDatiEconomici,
  },
  {
    id: 'riepilogo',
    title: 'Riepilogo',
    description: 'Verifica i dati inseriti',
    icon: ClipboardDocumentListIcon,
    component: StepRiepilogo,
  },
  {
    id: 'risultati',
    title: 'Risultati',
    description: 'Imposte e contributi calcolati',
    icon: DocumentChartBarIcon,
    component: StepRisultati,
  },
];

export default function CalcolaPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    datiPersonali: {},
    codiceATECO: {},
    datiEconomici: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Carica i dati salvati all'avvio
  useEffect(() => {
    const savedData = loadWizardData();
    const savedStep = loadWizardStep();
    
    if (hasWizardData()) {
      setShowRestoreDialog(true);
      setFormData({
        datiPersonali: savedData.datiPersonali || {},
        codiceATECO: savedData.codiceATECO || {},
        datiEconomici: savedData.datiEconomici || {},
      });
      setCurrentStep(savedStep);
    }
    setDataLoaded(true);
  }, []);

  // Salva automaticamente i dati quando cambiano
  useEffect(() => {
    if (dataLoaded) {
      autoSaveWizardData({
        datiPersonali: formData.datiPersonali,
        codiceATECO: formData.codiceATECO,
        datiEconomici: formData.datiEconomici,
        lastStep: currentStep,
      });
    }
  }, [formData, currentStep, dataLoaded]);

  // Salva lo step quando cambia
  useEffect(() => {
    if (dataLoaded) {
      saveWizardStep(currentStep);
    }
  }, [currentStep, dataLoaded]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepData = (stepId: string, data: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [stepId]: data,
      };
      return newData;
    });
  };

  const handleRestoreData = () => {
    setShowRestoreDialog(false);
  };

  const handleStartOver = () => {
    clearWizardData();
    setFormData({
      datiPersonali: {},
      codiceATECO: {},
      datiEconomici: {},
    });
    setCurrentStep(0);
    setShowRestoreDialog(false);
  };

  const handleWizardComplete = () => {
    // Cancella i dati salvati quando il calcolo è completato
    clearWizardData();
  };

  const CurrentStepComponent = steps[currentStep].component;
  const CurrentStepIcon = steps[currentStep].icon;

  // Dialog per ripristino dati
  if (showRestoreDialog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-soft max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <ArrowPathIcon className="w-6 h-6 text-primary-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Dati Precedenti Trovati
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Abbiamo trovato un calcolo iniziato in precedenza. Vuoi continuare da dove avevi lasciato o iniziare un nuovo calcolo?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRestoreData}
              className="btn-primary flex-1"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Continua
            </button>
            <button
              onClick={handleStartOver}
              className="btn-secondary flex-1"
            >
              Nuovo Calcolo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold text-gradient">
                IVAlytics
              </Link>
              <p className="text-gray-600 mt-1">Calcolo Imposte e Contributi</p>
            </div>
            <div className="text-sm text-gray-500">
              Passo {currentStep + 1} di {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep;

              return (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex items-center">
                    <div
                      className={`
                        relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200
                        ${isCompleted 
                          ? 'bg-success-500 text-white' 
                          : isActive 
                            ? 'bg-primary-500 text-white ring-4 ring-primary-100' 
                            : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div 
                        className={`
                          flex-1 h-1 mx-4 transition-all duration-200
                          ${isCompleted ? 'bg-success-500' : 'bg-gray-200'}
                        `} 
                      />
                    )}
                  </div>
                  
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                    <p className={`text-xs font-medium ${isAccessible ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Indicatore auto-save */}
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
              I tuoi dati vengono salvati automaticamente
            </p>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                    <CurrentStepIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {steps[currentStep].title}
                    </h1>
                    <p className="text-gray-600">
                      {steps[currentStep].description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8">
                <CurrentStepComponent
                  data={formData}
                  onDataChange={handleStepData}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onComplete={handleWizardComplete}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Actions */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleStartOver}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Ricomincia da capo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 