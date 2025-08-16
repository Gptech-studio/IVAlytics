'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon, 
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CodiceATECO } from '@/types';

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

// Nota: L'interfaccia SuggerimentoATECO è stata rimossa insieme al sistema di suggerimenti AI

export default function StepCodiceATECO({ data, onDataChange, onNext, onPrev }: Props) {
  const [ricercaLibera, setRicercaLibera] = useState('');
  const [ricercaDescrizione, setRicercaDescrizione] = useState('');
  const [codiceSelezionato, setCodiceSelezionato] = useState(data.codiceATECO?.codiceAteco || '');
  const [risultatiRicerca, setRisultatiRicerca] = useState<CodiceATECO[]>([]);
  const [risultatiDescrizione, setRisultatiDescrizione] = useState<CodiceATECO[]>([]);
  const [metodiCollapsed, setMetodiCollapsed] = useState(false);
  const [loadingRicerca, setLoadingRicerca] = useState(false);
  const [loadingDescrizione, setLoadingDescrizione] = useState(false);
  const [erroreRicerca, setErroreRicerca] = useState('');
  const [erroreDescrizione, setErroreDescrizione] = useState('');
  const [mostraConfermaScelta, setMostraConfermaScelta] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CodiceATECOForm>({
    resolver: zodResolver(codiceATECOSchema),
    defaultValues: {
      codiceAteco: data.codiceATECO?.codiceAteco || '',
      descrizioneAttivita: data.codiceATECO?.descrizioneAttivita || '',
      dataInizioAttivita: data.codiceATECO?.dataInizioAttivita || '',
    },
  });

  const watchedData = watch();

  // Auto-save mentre l'utente compila
  useEffect(() => {
    if (Object.keys(watchedData).length > 0) {
      const timeoutId = setTimeout(() => {
        onDataChange('codiceATECO', watchedData);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedData, onDataChange]);

  // Debounce per la ricerca libera
  useEffect(() => {
    if (ricercaLibera.length >= 3) {
      const timeoutId = setTimeout(() => {
        eseguiRicercaLibera(ricercaLibera);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setRisultatiRicerca([]);
    }
  }, [ricercaLibera]);

  // Ricerca libera tramite API
  const eseguiRicercaLibera = async (termine: string) => {
    setErroreRicerca('');
    
    if (termine.length >= 3) {
      setLoadingRicerca(true);
      try {
        const response = await fetch(`/api/ateco?q=${encodeURIComponent(termine)}&limit=20`);
        const result = await response.json();
        
        if (result.success) {
          setRisultatiRicerca(result.data || []);
        } else {
          setErroreRicerca('Errore durante la ricerca');
          setRisultatiRicerca([]);
        }
      } catch (error) {
        console.error('Errore ricerca ATECO:', error);
        setErroreRicerca('Errore di connessione');
        setRisultatiRicerca([]);
      } finally {
        setLoadingRicerca(false);
      }
    } else {
      setRisultatiRicerca([]);
    }
  };

  // Ricerca per descrizione tramite API
  const handleRicercaDescrizione = async () => {
    if (ricercaDescrizione.length < 10) {
      setErroreDescrizione('Inserisci almeno 10 caratteri');
      return;
    }

    setLoadingDescrizione(true);
    setErroreDescrizione('');
    
    try {
      // Prima prova con una ricerca generale
      const response = await fetch(`/api/ateco?q=${encodeURIComponent(ricercaDescrizione)}&limit=15`);
      const result = await response.json();
      
      if (result.success) {
        setRisultatiDescrizione(result.data || []);
        if (result.data.length === 0) {
          setErroreDescrizione('Nessun risultato trovato. Prova con termini più generici.');
        }
      } else {
        setErroreDescrizione('Errore durante la ricerca');
        setRisultatiDescrizione([]);
      }
    } catch (error) {
      console.error('Errore ricerca descrizione:', error);
      setErroreDescrizione('Errore di connessione');
      setRisultatiDescrizione([]);
    } finally {
      setLoadingDescrizione(false);
    }
  };

  // Selezione codice
  const selezionaCodice = (codice: CodiceATECO) => {
    setCodiceSelezionato(codice.codice);
    setValue('codiceAteco', codice.codice);
    setValue('descrizioneAttivita', codice.descrizione);
    setRisultatiRicerca([]);
    setRisultatiDescrizione([]);
    setRicercaLibera('');
    setRicercaDescrizione('');
    
    // Mostra feedback di conferma
    setMostraConfermaScelta(true);
    setTimeout(() => setMostraConfermaScelta(false), 3000);
  };

  const onSubmit = (formData: CodiceATECOForm) => {
    onDataChange('codiceATECO', {
      codiceAteco: formData.codiceAteco,
      descrizioneAttivita: formData.descrizioneAttivita,
      dataInizioAttivita: formData.dataInizioAttivita,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Notifica di conferma selezione */}
      {mostraConfermaScelta && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in duration-300">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="font-medium">Codice ATECO selezionato con successo!</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h2 id="ateco-title" className="text-3xl font-bold text-gray-900 mb-4">
          Seleziona il tuo Codice ATECO
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Il codice ATECO identifica la tua attività economica principale e determina imposte e contributi.
        </p>
      </div>

      {/* Metodi di ricerca */}
      <div id="ateco-header" className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Metodi di Ricerca</h3>
            <button
              onClick={() => setMetodiCollapsed(!metodiCollapsed)}
              className="text-blue-600 hover:text-blue-700"
            >
              {metodiCollapsed ? 'Espandi' : 'Comprimi'}
            </button>
          </div>

          {!metodiCollapsed && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ricerca Libera */}
              <div id="method-search" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Ricerca Libera</h4>
                </div>
                <input
                  type="text"
                  value={ricercaLibera}
                  onChange={(e) => setRicercaLibera(e.target.value)}
                  placeholder="Cerca per codice o parola chiave (es. consulenza informatica)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {loadingRicerca ? (
                  <div className="text-center py-4">
                    <p>Caricamento...</p>
                  </div>
                ) : erroreRicerca ? (
                  <div className="text-center py-4 text-red-600">
                    {erroreRicerca}
                  </div>
                ) : risultatiRicerca.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {risultatiRicerca.map((codice, index) => (
                      <div
                        key={index}
                        onClick={() => selezionaCodice(codice)}
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-mono text-sm font-medium text-blue-600">{codice.codice}</span>
                            <p className="text-sm text-gray-700 mt-1">{codice.descrizione}</p>
                            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                              {codice.categoria}
                            </span>
                          </div>
                          <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Inserisci almeno 3 caratteri per la ricerca libera.
                  </div>
                )}
              </div>

              {/* Ricerca per Descrizione */}
              <div id="method-description" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Ricerca per Descrizione</h4>
                </div>
                <textarea
                  value={ricercaDescrizione}
                  onChange={(e) => setRicercaDescrizione(e.target.value)}
                  placeholder="Descrivi la tua attività (es. Sviluppo siti web per aziende)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleRicercaDescrizione}
                  disabled={ricercaDescrizione.length < 10 || loadingDescrizione}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingDescrizione ? 'Ricerca in corso...' : 'Trova Codici Corrispondenti'}
                </button>
                {loadingDescrizione ? (
                  <div className="text-center py-4">
                    <p>Caricamento...</p>
                  </div>
                ) : erroreDescrizione ? (
                  <div className="text-center py-4 text-red-600">
                    {erroreDescrizione}
                  </div>
                ) : risultatiDescrizione.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {risultatiDescrizione.map((codice, index) => (
                      <div
                        key={index}
                        onClick={() => selezionaCodice(codice)}
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-mono text-sm font-medium text-blue-600">{codice.codice}</span>
                            <p className="text-sm text-gray-700 mt-1">{codice.descrizione}</p>
                            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                              {codice.categoria}
                            </span>
                          </div>
                          <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Inserisci almeno 10 caratteri per la ricerca per descrizione.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form dati */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dati del Codice ATECO</h3>
            {codiceSelezionato && (
              <div className="flex items-center space-x-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Codice selezionato</span>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="form-codice-ateco" className="block text-sm font-medium text-gray-700 mb-2">
                Codice ATECO
              </label>
              <div className="relative">
                <input
                  id="form-codice-ateco"
                  {...register('codiceAteco')}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 ${
                    codiceSelezionato 
                      ? 'border-green-300 bg-green-50 text-green-800' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Seleziona un codice sopra"
                />
                {codiceSelezionato && (
                  <CheckCircleIcon className="absolute right-3 top-2.5 w-5 h-5 text-green-600" />
                )}
              </div>
              {errors.codiceAteco && (
                <p className="mt-1 text-sm text-red-600">{errors.codiceAteco.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="form-data-inizio" className="block text-sm font-medium text-gray-700 mb-2">
                Data Inizio Attività
              </label>
              <input
                id="form-data-inizio"
                type="date"
                {...register('dataInizioAttivita')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.dataInizioAttivita && (
                <p className="mt-1 text-sm text-red-600">{errors.dataInizioAttivita.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="form-descrizione" className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione Attività
            </label>
            <div className="relative">
              <textarea
                id="form-descrizione"
                {...register('descrizioneAttivita')}
                readOnly
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 ${
                  codiceSelezionato 
                    ? 'border-green-300 bg-green-50 text-green-800' 
                    : 'border-gray-300'
                }`}
                placeholder="La descrizione apparirà automaticamente"
              />
              {codiceSelezionato && (
                <CheckCircleIcon className="absolute right-3 top-3 w-5 h-5 text-green-600" />
              )}
            </div>
            {errors.descrizioneAttivita && (
              <p className="mt-1 text-sm text-red-600">{errors.descrizioneAttivita.message}</p>
            )}
          </div>
        </div>

        {/* Informazioni utili */}
        <div id="info-ateco" className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <QuestionMarkCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Informazioni sui Codici ATECO</h4>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Il codice ATECO identifica la tua attività principale</li>
                <li>• Determina contributi INPS e regime fiscale applicabile</li>
                <li>• Puoi cambiarlo in caso di errore tramite comunicazione all'Agenzia delle Entrate</li>
                <li>• Se hai dubbi, consulta un commercialista</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigazione */}
        <div id="navigation-buttons" className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Indietro
          </button>
          <button
            type="submit"
            disabled={!codiceSelezionato}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Continua
          </button>
        </div>
      </form>
    </div>
  );
} 