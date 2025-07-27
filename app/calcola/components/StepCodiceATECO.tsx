'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon, 
  LightBulbIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  SparklesIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

// Import per i suggerimenti semplici
import ProgressiveHints from '@/lib/components/ProgressiveHints';
import { 
  stepCodiceATECOHints,
  useHintsPreferences,
  getIntelligentHints
} from '@/lib/data/step-hints';

const codiceATECOSchema = z.object({
  codiceAteco: z.string().min(1, 'Seleziona un codice ATECO'),
  descrizioneAttivita: z.string().min(10, 'Descrivi la tua attività (almeno 10 caratteri)'),
  dataInizioAttivita: z.string().min(1, 'Inserisci la data di inizio attività'),
});

type CodiceATECOForm = z.infer<typeof codiceATECOSchema>;

interface Props {
  data: any;
  onDataChange: (stepId: string, data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete?: () => void;
}

interface SuggerimentoATECO {
  codice: string;
  descrizione: string;
  categoria: string;
  score: number;
  motivo: string;
}

// Domande del questionario per suggerimenti ATECO
const domandeQuestionario = [
  {
    id: 'tipo_attivita',
    domanda: 'Che tipo di attività svolgi principalmente?',
    tipo: 'scelta_multipla',
    opzioni: [
      'Consulenza e servizi professionali',
      'Commercio e vendita',
      'Produzione e manifattura', 
      'Ristorazione e turismo',
      'Edilizia e costruzioni',
      'Trasporti e logistica',
      'Tecnologia e informatica',
      'Sanità e benessere',
      'Educazione e formazione',
      'Arte e intrattenimento'
    ]
  },
  {
    id: 'clienti_target',
    domanda: 'I tuoi clienti sono principalmente?',
    tipo: 'scelta_multipla',
    opzioni: [
      'Privati cittadini',
      'Aziende e imprese',
      'Enti pubblici',
      'Misto (privati e aziende)'
    ]
  },
  {
    id: 'dove_lavori',
    domanda: 'Dove svolgi principalmente la tua attività?',
    tipo: 'scelta_multipla',
    opzioni: [
      'Nel mio ufficio/studio',
      'Presso i clienti',
      'Online/da remoto',
      'In un negozio/locale',
      'All\'aperto/cantieri'
    ]
  }
];

// Simulazione database codici ATECO (in produzione verranno da MongoDB)
const codiciATECO = [
  { codice: '62.01.00', descrizione: 'Produzione di software non connesso all\'edizione', categoria: 'Informatica' },
  { codice: '62.02.00', descrizione: 'Consulenza nel settore delle tecnologie dell\'informatica', categoria: 'Informatica' },
  { codice: '69.20.30', descrizione: 'Attività di consulenza per la gestione dei tributi', categoria: 'Consulenza' },
  { codice: '74.10.10', descrizione: 'Attività di design di moda e design industriale', categoria: 'Design' },
  { codice: '47.91.10', descrizione: 'Commercio al dettaglio di qualsiasi tipo di prodotto via internet', categoria: 'E-commerce' },
  { codice: '85.59.20', descrizione: 'Corsi di formazione e corsi di aggiornamento professionale', categoria: 'Formazione' },
];

export default function StepCodiceATECO({ data, onDataChange, onNext, onPrev }: Props) {
  const [showQuestionario, setShowQuestionario] = useState(false);
  const [risposteQuestionario, setRisposteQuestionario] = useState<Record<string, string>>({});
  const [suggerimenti, setSuggerimenti] = useState<SuggerimentoATECO[]>([]);
  const [ricercaLibera, setRicercaLibera] = useState('');
  const [codiciRicerca, setCodiciRicerca] = useState<any[]>([]);
  const [loadingSuggerimenti, setLoadingSuggerimenti] = useState(false);
  const [loadingRicerca, setLoadingRicerca] = useState(false);
  const [erroreSuggerimenti, setErroreSuggerimenti] = useState<string>('');
  const [ricercaDescrizione, setRicercaDescrizione] = useState('');
  const [suggerimentiDescrizione, setSuggerimentiDescrizione] = useState<SuggerimentoATECO[]>([]);
  const [loadingDescrizione, setLoadingDescrizione] = useState(false);
  // Nuovo stato per gestire il collasso dei metodi di ricerca
  const [metodiCollapsed, setMetodiCollapsed] = useState(false);
  
  // Stati per i suggerimenti semplici
  const [showHints, setShowHints] = useState(false);
  
  // Hook per gestire le preferenze dei suggerimenti
  const {
    hasSeenHints,
    markHintsAsSeen,
    shouldShowHints
  } = useHintsPreferences();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CodiceATECOForm>({
    resolver: zodResolver(codiceATECOSchema),
    defaultValues: data.codiceATECO || {},
    mode: 'onChange',
  });

  const codiceSelezionato = watch('codiceAteco');
  const watchedData = watch();
  
  // Effetto per gestire il collasso automatico quando viene selezionato un codice
  useEffect(() => {
    if (codiceSelezionato) {
      setMetodiCollapsed(true);
    }
  }, [codiceSelezionato]);

  // Auto-save mentre l'utente digita (solo se i dati sono effettivamente cambiati)
  useEffect(() => {
    if (Object.keys(watchedData).length > 0 && JSON.stringify(watchedData) !== JSON.stringify(data.codiceATECO || {})) {
      const timeoutId = setTimeout(() => {
        onDataChange('codiceATECO', watchedData);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedData, onDataChange, data.codiceATECO]);

  // Gestione questionario intelligente
  const handleRispostaQuestionario = async (domandaId: string, risposta: string) => {
    const nuoveRisposte = { ...risposteQuestionario, [domandaId]: risposta };
    setRisposteQuestionario(nuoveRisposte);
    
    // Genera suggerimenti basati sulle risposte tramite API
    if (Object.keys(nuoveRisposte).length >= 2) {
      await generaSuggerimenti(nuoveRisposte);
    }
  };

  const generaSuggerimenti = async (risposte: Record<string, string>) => {
    setLoadingSuggerimenti(true);
    setErroreSuggerimenti('');
    
    try {
      const response = await fetch('/api/ateco/suggerimenti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ risposte }),
      });

      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuggerimenti(result.data || []);
      } else {
        throw new Error(result.error || 'Errore nella generazione dei suggerimenti');
      }
    } catch (error) {
      console.error('Errore generazione suggerimenti:', error);
      setErroreSuggerimenti('Errore nel caricamento dei suggerimenti. Riprova più tardi.');
      setSuggerimenti([]);
    } finally {
      setLoadingSuggerimenti(false);
    }
  };

  // Ricerca libera codici ATECO tramite API
  const handleRicercaLibera = async (termine: string) => {
    setRicercaLibera(termine);
    
    if (termine.length >= 3) {
      setLoadingRicerca(true);
      
      try {
        const response = await fetch(`/api/ateco?q=${encodeURIComponent(termine)}&limit=10`);
        
        if (!response.ok) {
          throw new Error(`Errore API: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setCodiciRicerca(result.data || []);
        } else {
          throw new Error(result.error || 'Errore nella ricerca');
        }
      } catch (error) {
        console.error('Errore ricerca ATECO:', error);
        setCodiciRicerca([]);
      } finally {
        setLoadingRicerca(false);
      }
    } else {
      setCodiciRicerca([]);
    }
  };

  // Ricerca intelligente basata su descrizione attività
  const ricercaPerDescrizione = async (descrizione: string) => {
    if (descrizione.length < 10) return;
    
    setLoadingDescrizione(true);
    try {
      // Estrai keywords dalla descrizione
      const keywords = descrizione.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5) // Prendi le prime 5 parole significative
        .join(' ');
      
      const response = await fetch(`/api/ateco?q=${encodeURIComponent(keywords)}&limit=6`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuggerimentiDescrizione(result.data || []);
        }
      }
    } catch (error) {
      console.error('Errore ricerca per descrizione:', error);
    } finally {
      setLoadingDescrizione(false);
    }
  };

  // Debounced search per descrizione attività
  useEffect(() => {
    const delayedDescriptionSearch = setTimeout(() => {
      if (ricercaDescrizione.length >= 10) {
        ricercaPerDescrizione(ricercaDescrizione);
      } else {
        setSuggerimentiDescrizione([]);
      }
    }, 500);

    return () => clearTimeout(delayedDescriptionSearch);
  }, [ricercaDescrizione]);

  // Debounced search per migliorare le performance
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (ricercaLibera.length >= 3) {
        handleRicercaLibera(ricercaLibera);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [ricercaLibera]);

  // Effetto per mostrare automaticamente i suggerimenti per i nuovi utenti
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShowHints('step-codice-ateco')) {
        setShowHints(true);
      }
    }, 2000); // Aspetta 2 secondi per permettere al contenuto di caricarsi

    return () => clearTimeout(timer);
  }, [shouldShowHints]);

  // Handler per i suggerimenti
  const handleCompleteHints = () => {
    markHintsAsSeen('step-codice-ateco');
    setShowHints(false);
  };

  const handleSkipHints = () => {
    markHintsAsSeen('step-codice-ateco');
    setShowHints(false);
  };

  const handleStartHints = () => {
    setShowHints(true);
  };

  const selezionaCodice = (codice: string, descrizione: string) => {
    setValue('codiceAteco', codice);
    setValue('descrizioneAttivita', descrizione);
    // Collassa automaticamente i metodi dopo la selezione
    setMetodiCollapsed(true);
  };

  const onSubmit = (formData: CodiceATECOForm) => {
    onDataChange('codiceATECO', formData);
    onNext();
  };

  const resetQuestionario = () => {
    setRisposteQuestionario({});
    setSuggerimenti([]);
    setErroreSuggerimenti('');
    setShowQuestionario(false);
  };

  const resetRicerche = () => {
    setRicercaLibera('');
    setCodiciRicerca([]);
    setRicercaDescrizione('');
    setSuggerimentiDescrizione([]);
  };

  // Hooks per suggerimenti (showHints è già dichiarato sopra)
  const hintsPrefs = useHintsPreferences();

  useEffect(() => {
    // Mostra automaticamente i suggerimenti per nuovi utenti
    if (hintsPrefs.shouldShowHints('codiceATECO')) {
      setShowHints(true);
    }
  }, []);

  const handleHintsComplete = () => {
    hintsPrefs.markHintsAsSeen('codiceATECO');
    setShowHints(false);
  };

  const handleHintsSkip = () => {
    hintsPrefs.markHintsAsSeen('codiceATECO');
    setShowHints(false);
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  return (
    <div>
      {/* Header con pulsante suggerimenti */}
      <div className="flex justify-between items-center mb-6">
        <div id="ateco-title">
          <h2 className="text-2xl font-bold text-gray-900">
            Selezione Codice ATECO
          </h2>
          <p className="text-gray-600 mt-1">
            Identifica la tua attività principale per il calcolo preciso
          </p>
        </div>
        <button
          type="button"
          onClick={toggleHints}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <LightBulbIcon className="w-4 h-4 mr-2" />
          Suggerimenti
        </button>
      </div>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Progress indicator per il questionario */}
      {showQuestionario && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Progresso Questionario</span>
            <button
              type="button"
              onClick={resetQuestionario}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Ricomincia
            </button>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(risposteQuestionario).length / domandeQuestionario.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {Object.keys(risposteQuestionario).length} di {domandeQuestionario.length} risposte completate
            {Object.keys(risposteQuestionario).length >= 2 && (
              <span className="ml-2">✨ Pronto per i suggerimenti!</span>
            )}
          </p>
        </div>
      )}

      {/* Intestazione metodi di ricerca con controllo collasso */}
      <div className="text-center mb-8" id="ateco-header">
        <div className="flex items-center justify-center space-x-4 mb-3">
          <h2 className="text-2xl font-bold text-gray-900" id="ateco-title">
            🔍 Trova il tuo Codice ATECO
          </h2>
          <div className="flex items-center space-x-2">
            {/* Pulsante per attivare i suggerimenti */}
            <button
              type="button"
              onClick={handleStartHints}
              className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-full transition-all duration-200 font-medium"
              title="Mostra suggerimenti"
            >
              <LightBulbIcon className="w-4 h-4 mr-1" />
              Suggerimenti
            </button>
            
            {codiceSelezionato && (
              <button
                type="button"
                onClick={() => setMetodiCollapsed(!metodiCollapsed)}
                className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-all duration-200"
              >
                {metodiCollapsed ? 'Mostra metodi' : 'Nascondi metodi'}
                <svg className={`ml-1 h-4 w-4 transition-transform ${metodiCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {!codiceSelezionato && (
          <>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Scegli uno dei metodi qui sotto per identificare il codice ATECO più adatto alla tua attività. 
              Ti consigliamo di iniziare con i <strong>Suggerimenti Intelligenti</strong> per risultati personalizzati.
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
              💡 <span className="ml-1">Puoi usare uno qualsiasi dei metodi - tutti portano allo stesso risultato</span>
            </div>
          </>
        )}
      </div>

      {/* Metodi di ricerca - Layout verticale per migliore usabilità con effetto collasso */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        metodiCollapsed ? 'max-h-20 opacity-60' : 'max-h-[5000px] opacity-100'
      }`}>
        {metodiCollapsed && codiceSelezionato && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
            <p className="text-sm text-green-700">
              ✅ <strong>Codice {codiceSelezionato} selezionato</strong> - I metodi di ricerca sono stati minimizzati per risparmiare spazio
            </p>
          </div>
        )}
        <div className={`space-y-8 ${metodiCollapsed ? 'pointer-events-none' : ''}`}>
        {/* Suggerimenti intelligenti */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden" id="method-smart">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-bold mr-2">1</span>
                    Suggerimenti Intelligenti
                  </h3>
                  <p className="text-sm text-gray-600">Metodo consigliato • AI-powered recommendations</p>
                </div>
              </div>
              {showQuestionario && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✨ AI
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Metodo consigliato:</strong> Rispondi a 3 semplici domande e il nostro AI analizzerà la tua attività 
              per suggerirti i codici ATECO più pertinenti con spiegazioni dettagliate.
            </p>
            
            {!showQuestionario ? (
              <button
                type="button"
                onClick={() => setShowQuestionario(true)}
                className="btn-outline w-full flex items-center justify-center group hover:bg-purple-50 hover:border-purple-300"
              >
                <LightBulbIcon className="w-4 h-4 mr-2 group-hover:text-purple-600" />
                Inizia Questionario Intelligente
              </button>
            ) : (
              <div className="space-y-6">
                {domandeQuestionario.map((domanda, index) => (
                  <div key={domanda.id} className="space-y-3">
                    <label className="form-label flex items-center text-base">
                      <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full mr-3 ${
                        risposteQuestionario[domanda.id] 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-primary-100 text-primary-600'
                      }`}>
                        {risposteQuestionario[domanda.id] ? '✓' : index + 1}
                      </span>
                      {domanda.domanda}
                    </label>
                    <select
                      className="form-input transition-all duration-200 focus:ring-2 focus:ring-primary-500 text-sm py-3"
                      value={risposteQuestionario[domanda.id] || ''}
                      onChange={(e) => handleRispostaQuestionario(domanda.id, e.target.value)}
                    >
                      <option value="">Seleziona un'opzione...</option>
                      {domanda.opzioni.map(opzione => (
                        <option key={opzione} value={opzione}>{opzione}</option>
                      ))}
                    </select>
                  </div>
                ))}
                
                {/* Loading state con animazione migliorata */}
                {loadingSuggerimenti && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                      <div className="flex space-x-1 mr-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-purple-700 font-medium">Sto analizzando le tue risposte...</span>
                    </div>
                  </div>
                )}
                
                {/* Errore con possibilità di retry */}
                {erroreSuggerimenti && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-red-600">{erroreSuggerimenti}</p>
                      <button
                        type="button"
                        onClick={() => generaSuggerimenti(risposteQuestionario)}
                        className="text-xs text-red-700 hover:text-red-900 underline"
                      >
                        Riprova
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Suggerimenti generati con layout migliorato */}
                {suggerimenti.length > 0 && !loadingSuggerimenti && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <SparklesIcon className="w-4 h-4 text-purple-500 mr-2" />
                        <h4 className="font-medium text-gray-900">Codici consigliati per te:</h4>
                      </div>
                      <span className="text-xs text-gray-500">Top {suggerimenti.length}</span>
                    </div>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {suggerimenti.map((suggerimento, index) => (
                        <div
                          key={suggerimento.codice}
                          className={`p-5 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                            codiceSelezionato === suggerimento.codice 
                              ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => selezionaCodice(suggerimento.codice, suggerimento.descrizione)}
                        >
                          <div className="space-y-3">
                            {/* Header con ranking e codice */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                  index === 1 ? 'bg-gray-100 text-gray-700' :
                                  index === 2 ? 'bg-orange-100 text-orange-700' :
                                  'bg-primary-100 text-primary-600'
                                }`}>
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </span>
                                <div>
                                  <div className="font-bold text-base text-gray-900">
                                    {suggerimento.codice}
                                  </div>
                                  <span className="text-sm text-gray-500">{suggerimento.categoria}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  suggerimento.score >= 80 ? 'bg-green-100 text-green-800' :
                                  suggerimento.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {suggerimento.score}%
                                </span>
                                {codiceSelezionato === suggerimento.codice && (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </div>
                            
                            {/* Descrizione completa - non troncata */}
                            <div className="text-sm text-gray-700 leading-relaxed">
                              {suggerimento.descrizione}
                            </div>
                            
                            {/* Motivo del suggerimento */}
                            <div className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
                              <span className="font-medium text-blue-700">💡 Perché è adatto:</span>
                              <span className="ml-1">{suggerimento.motivo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Messaggio se nessun suggerimento con suggerimenti alternativi */}
                {suggerimenti.length === 0 && Object.keys(risposteQuestionario).length >= 2 && !loadingSuggerimenti && !erroreSuggerimenti && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-2">Nessun suggerimento trovato per le tue risposte.</p>
                    <p className="text-xs text-gray-500">💡 Prova la ricerca libera o modifica qualche risposta</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

                  {/* Separatore */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-gray-50 rounded-full py-1">oppure</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Ricerca libera */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden" id="method-search">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
              </div>
                              <div className="ml-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-bold mr-2">2</span>
                    Ricerca Libera
                  </h3>
                  <p className="text-sm text-gray-600">Cerca direttamente per codice o parole chiave</p>
                </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Se conosci già il settore:</strong> Cerca direttamente inserendo il numero del codice ATECO 
              o parole chiave specifiche della tua attività (es. "62.01.00", "consulenza informatica").
            </p>
            
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Es. consulenza informatica, web design, commercio..."
                className="form-input pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                value={ricercaLibera}
                onChange={(e) => setRicercaLibera(e.target.value)}
              />
              {loadingRicerca && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Risultati ricerca con design migliorato */}
            {codiciRicerca.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {codiciRicerca.map(codice => (
                    <div
                      key={codice.codice}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 ${
                        codiceSelezionato === codice.codice 
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => selezionaCodice(codice.codice, codice.descrizione)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-base text-gray-900 flex items-center">
                            {codice.codice}
                            {codiceSelezionato === codice.codice && (
                              <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                            )}
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            📂 {codice.categoria}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {codice.descrizione}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Messaggi informativi migliorati */}
            {ricercaLibera.length > 0 && ricercaLibera.length < 3 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600">💡 Digita almeno 3 caratteri per iniziare la ricerca</p>
              </div>
            )}
            
            {ricercaLibera.length >= 3 && codiciRicerca.length === 0 && !loadingRicerca && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">Nessun risultato trovato.</p>
                <p className="text-xs text-gray-500 mt-1">Prova con termini diversi o usa il questionario intelligente</p>
              </div>
            )}
          </div>
        </div>

                  {/* Separatore */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-gray-50 rounded-full py-1">oppure</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Ricerca intelligente per descrizione attività */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden" id="method-description">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
              </div>
                              <div className="ml-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-bold mr-2">3</span>
                    Cerca per Descrizione
                  </h3>
                  <p className="text-sm text-gray-600">Analisi semantica del testo della tua attività</p>
                </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Descrizione libera:</strong> Scrivi liberamente cosa fai nella tua attività e il nostro 
              sistema analizzerà il testo per trovare i codici ATECO corrispondenti (minimo 10 caratteri).
            </p>
            
            <div className="relative">
              <textarea
                placeholder="Es. Sviluppo applicazioni web per piccole e medie imprese, consulenza digitale, progettazione siti internet, consulenza IT..."
                className="form-input min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary-500 resize-none text-sm leading-relaxed"
                value={ricercaDescrizione}
                onChange={(e) => setRicercaDescrizione(e.target.value)}
              />
              {loadingDescrizione && (
                <div className="absolute right-3 top-3">
                  <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Contatore caratteri */}
            <div className="mt-1 text-xs text-gray-500 text-right">
              {ricercaDescrizione.length}/500 caratteri
              {ricercaDescrizione.length >= 10 && ricercaDescrizione.length < 50 && (
                <span className="ml-1 text-yellow-600">📝 Più dettagli = risultati migliori</span>
              )}
            </div>
            
            {/* Risultati ricerca per descrizione */}
            {suggerimentiDescrizione.length > 0 && (
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Risultati trovati ({suggerimentiDescrizione.length})
                </h5>
                <div className="space-y-3">
                  {suggerimentiDescrizione.map(codice => (
                    <div
                      key={codice.codice}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 ${
                        codiceSelezionato === codice.codice 
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => selezionaCodice(codice.codice, codice.descrizione)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-base text-gray-900 flex items-center">
                            {codice.codice}
                            {codiceSelezionato === codice.codice && (
                              <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                            )}
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            📂 {codice.categoria}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {codice.descrizione}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Messaggi informativi per descrizione */}
            {ricercaDescrizione.length > 0 && ricercaDescrizione.length < 10 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">💡 Scrivi almeno 10 caratteri per una ricerca efficace</p>
              </div>
            )}
            
            {ricercaDescrizione.length >= 10 && suggerimentiDescrizione.length === 0 && !loadingDescrizione && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">Nessun risultato per questa descrizione.</p>
                <p className="text-xs text-gray-500 mt-1">Prova a essere più specifico o usa termini diversi</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>



      {/* Campi del form */}
      <div className="space-y-8">
        {/* Anteprima codice selezionato - Versione compatta */}
        {codiceSelezionato && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-green-800 text-base">{codiceSelezionato}</span>
                    {(codiciRicerca.find(c => c.codice === codiceSelezionato) || 
                      suggerimenti.find(s => s.codice === codiceSelezionato) ||
                      suggerimentiDescrizione.find(s => s.codice === codiceSelezionato)) && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        📂 {(codiciRicerca.find(c => c.codice === codiceSelezionato)?.categoria || 
                              suggerimenti.find(s => s.codice === codiceSelezionato)?.categoria ||
                              suggerimentiDescrizione.find(s => s.codice === codiceSelezionato)?.categoria)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-green-600 mt-1">✅ Codice ATECO selezionato</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue('codiceAteco', '');
                  setValue('descrizioneAttivita', '');
                  setMetodiCollapsed(false);
                }}
                className="text-xs text-green-700 hover:text-green-900 underline"
              >
                Cambia codice
              </button>
            </div>
          </div>
        )}

        {/* Codice ATECO selezionato - Versione compatta quando selezionato */}
        <div className={`bg-gray-50 rounded-xl border border-gray-200 ${codiceSelezionato ? 'p-4' : 'p-6'}`} id="form-codice-ateco">
          <label className="form-label text-base font-semibold">Codice ATECO Selezionato *</label>
          <input
            type="text"
            {...register('codiceAteco')}
            className={`form-input text-base ${codiceSelezionato ? 'py-2 bg-green-50 border-green-300 text-green-800 font-bold' : 'py-3 bg-gray-100'}`}
            placeholder="Seleziona un codice utilizzando uno dei metodi di ricerca sopra"
            readOnly
          />
          {errors.codiceAteco && <p className="form-error">{errors.codiceAteco.message}</p>}
          {!codiceSelezionato && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                ⚠️ Seleziona un codice ATECO per procedere al passo successivo
              </p>
            </div>
          )}
        </div>

        {/* Descrizione attività migliorata */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200" id="form-descrizione">
          <label className="form-label text-base font-semibold">Descrizione della tua attività *</label>
          {codiceSelezionato && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                🔒 La descrizione è stata impostata automaticamente dal codice ATECO selezionato e non può essere modificata.
                <button
                  type="button"
                  onClick={() => {
                    setValue('codiceAteco', '');
                    setValue('descrizioneAttivita', '');
                    setMetodiCollapsed(false);
                  }}
                  className="ml-2 text-amber-800 hover:text-amber-900 underline text-xs"
                >
                  Modifica codice
                </button>
              </p>
            </div>
          )}
          <div className="relative">
            <textarea
              {...register('descrizioneAttivita')}
              className={`form-input pr-20 text-sm leading-relaxed ${
                codiceSelezionato 
                  ? 'bg-gray-100 text-gray-700 cursor-not-allowed' 
                  : ''
              }`}
              rows={codiceSelezionato ? 3 : 5}
              placeholder={codiceSelezionato 
                ? "Descrizione automatica dal codice ATECO selezionato"
                : "Descrivi in dettaglio la tua attività principale: cosa fai, per chi, come e dove svolgi il lavoro. Più dettagli fornisci, più preciso sarà il calcolo delle imposte..."
              }
              readOnly={!!codiceSelezionato}
              onChange={(e) => {
                // Auto-sync con ricerca per descrizione se è vuota e non c'è un codice selezionato
                if (!ricercaDescrizione && e.target.value.length >= 20 && !codiceSelezionato) {
                  setRicercaDescrizione(e.target.value);
                }
              }}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white bg-opacity-80 px-2 py-1 rounded">
              {watch('descrizioneAttivita')?.length || 0}/500
            </div>
          </div>
          {errors.descrizioneAttivita && <p className="form-error">{errors.descrizioneAttivita.message}</p>}
          {!codiceSelezionato && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium mb-2">💡 Una descrizione accurata aiuta a:</p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Calcolare meglio le imposte e contributi
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Identificare eventuali agevolazioni fiscali
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Suggerire codici ATECO più specifici
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Data inizio attività - Versione compatta quando un codice è selezionato */}
        <div className={`bg-gray-50 rounded-xl border border-gray-200 ${codiceSelezionato ? 'p-4' : 'p-6'}`} id="form-data-inizio">
          <label className="form-label text-base font-semibold">Data Inizio Attività *</label>
          <input
            type="date"
            {...register('dataInizioAttivita')}
            className={`form-input text-base ${codiceSelezionato ? 'py-2' : 'py-3'}`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dataInizioAttivita && <p className="form-error">{errors.dataInizioAttivita.message}</p>}
          {!codiceSelezionato && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                La data di inizio attività influisce sul calcolo delle imposte e dei contributi per l'anno in corso
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info box migliorata */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm" id="info-ateco">
        <div className="flex">
          <div className="bg-amber-100 p-2 rounded-lg">
            <QuestionMarkCircleIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-bold text-amber-800 mb-3">
              💡 Informazioni utili sui codici ATECO
            </h3>
            <div className="text-sm text-amber-700 space-y-3">
              <p className="leading-relaxed">
                Il codice ATECO identifica la tua attività economica principale secondo la classificazione ISTAT. 
                È fondamentale per il calcolo delle imposte e dei contributi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    📋 Cosa sapere
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li>• Puoi modificarlo in seguito presso l'Agenzia delle Entrate</li>
                    <li>• Influisce sui codici tributo e aliquote INPS</li>
                    <li>• Determina le agevolazioni fiscali applicabili</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    🆘 Hai dubbi?
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li>• Consulta un commercialista</li>
                    <li>• Contatta l'Agenzia delle Entrate</li>
                    <li>• Usa i nostri suggerimenti intelligenti</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation migliorata */}
      <div className="mt-8 pt-6 border-t border-gray-200" id="navigation-buttons">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Indietro
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Passo 2 di 5
            </div>
            
            <button
              type="submit"
              disabled={!codiceSelezionato}
              className={`
                inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition-all duration-200 min-w-[120px] justify-center
                ${codiceSelezionato 
                  ? 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-105' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {codiceSelezionato ? (
                <>
                  Continua
                  <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                'Seleziona Codice'
              )}
            </button>
          </div>
        </div>
        
        {!codiceSelezionato && (
          <div className="mt-3 text-sm text-red-600 text-center">
            ⚠️ Seleziona un codice ATECO per continuare
          </div>
        )}
        
        {codiceSelezionato && (
          <div className="mt-3 text-sm text-green-600 text-center">
            ✅ Ottimo! Hai selezionato il codice {codiceSelezionato}
          </div>
        )}
      </div>

      {/* Suggerimenti progressivi */}
      </form>

      {/* Sistema di suggerimenti progressivi */}
      <ProgressiveHints
        hints={getIntelligentHints(data, 'codiceATECO')}
        isActive={showHints}
        onComplete={handleHintsComplete}
        onSkip={handleHintsSkip}
        stepId="codiceATECO"
      />
    </div>
  );
} 