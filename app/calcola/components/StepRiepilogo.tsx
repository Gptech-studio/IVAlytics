'use client';

import { CheckCircleIcon, PencilIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  data: any;
  onDataChange: (stepId: string, data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete?: () => void;
}

export default function StepRiepilogo({ data, onNext, onPrev, isLoading, setIsLoading }: Props) {
  const { datiPersonali, codiceATECO, datiEconomici } = data;

  const handleCalcolo = async () => {
    setIsLoading(true);
    
    // Simula chiamata API per calcolo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onNext();
  };

  const formatCurrency = (value: number) => {
    // Gestisci valori non validi
    if (!value || isNaN(value) || !isFinite(value)) {
      value = 0;
    }
    
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non specificata';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Verifica i tuoi dati
        </h2>
        <p className="text-gray-600">
          Controlla che tutte le informazioni siano corrette prima di procedere con il calcolo
        </p>
      </div>

      {/* Dati Personali */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-success-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Dati Personali</h3>
            </div>
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              onClick={() => window.history.back()}
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Modifica
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome e Cognome</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {datiPersonali?.nome} {datiPersonali?.cognome}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo Soggetto</dt>
              <dd className="text-sm text-gray-900 mt-1 capitalize">
                {datiPersonali?.tipoSoggetto?.replace('_', ' ')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Codice Fiscale</dt>
              <dd className="text-sm text-gray-900 mt-1 font-mono">
                {datiPersonali?.codiceFiscale}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Regime Fiscale</dt>
              <dd className="text-sm text-gray-900 mt-1 capitalize">
                {datiPersonali?.regimeFiscale}
              </dd>
            </div>
            {datiPersonali?.partitaIva && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Partita IVA</dt>
                <dd className="text-sm text-gray-900 mt-1 font-mono">
                  {datiPersonali.partitaIva}
                </dd>
              </div>
            )}
            {datiPersonali?.email && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {datiPersonali.email}
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attività Economica */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-success-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Attività Economica</h3>
            </div>
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              onClick={() => window.history.back()}
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Modifica
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Codice ATECO</dt>
              <dd className="text-sm text-gray-900 mt-1 font-mono">
                {codiceATECO?.codiceAteco}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Descrizione Attività</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {codiceATECO?.descrizioneAttivita}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data Inizio Attività</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {formatDate(codiceATECO?.dataInizioAttivita)}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Dati Economici */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-success-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Dati Economici</h3>
            </div>
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              onClick={() => window.history.back()}
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Modifica
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Periodo di Riferimento</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {formatDate(datiEconomici?.periodoRiferimento?.dataInizio)} - {formatDate(datiEconomici?.periodoRiferimento?.dataFine)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ricavi Totali</dt>
              <dd className="text-sm text-gray-900 mt-1 font-semibold">
                {formatCurrency(datiEconomici?.ricavi || 0)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Costi Totali</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {formatCurrency(datiEconomici?.costi || 0)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Costi Deducibili</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {formatCurrency(datiEconomici?.costiDeducibili || 0)}
              </dd>
            </div>
          </div>

          {/* Imponibile calcolato */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-500">Imponibile Stimato</dt>
              <dd className="text-lg font-semibold text-gray-900">
                {formatCurrency(Math.max(0, (datiEconomici?.ricavi || 0) - (datiEconomici?.costi || 0)))}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Avvertenze */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Informazioni Importanti
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <ul className="list-disc list-inside space-y-1">
                <li>I calcoli sono indicativi e basati sulla normativa attuale</li>
                <li>Per calcoli definitivi, consulta sempre un commercialista</li>
                <li>Le aliquote possono variare in base alla situazione specifica</li>
                <li>Non consideriamo eventuali agevolazioni particolari</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-200">
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
          
          <button
            onClick={handleCalcolo}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calcolo in corso...
              </div>
            ) : (
              <div className="flex items-center">
                Calcola Imposte e Contributi
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 