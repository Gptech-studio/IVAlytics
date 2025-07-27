'use client';

import { useState, useEffect } from 'react';
import { 
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';
import { 
  trovaCassaProfessionale,
  getAgevolazioniDisponibili,
  CassaProfessionale,
  AgevolazioneContributiva 
} from '@/lib/data/casse-professionali';

interface Props {
  codiceAteco: string;
  ordineProfessionale?: string;
  dataNascita?: string;
  dataInizioAttivita?: string;
  statusSpeciale?: string;
  agevolazioniSelezionate: string[];
  onAgevolazioniChange: (agevolazioni: string[]) => void;
}

export default function SelectoreAgevolazioniCasse({
  codiceAteco,
  ordineProfessionale,
  dataNascita,
  dataInizioAttivita,
  statusSpeciale,
  agevolazioniSelezionate,
  onAgevolazioniChange
}: Props) {
  const [cassaProfessionale, setCassaProfessionale] = useState<CassaProfessionale | null>(null);
  const [agevolazioniDisponibili, setAgevolazioniDisponibili] = useState<AgevolazioneContributiva[]>([]);
  const [mostraDettagli, setMostraDettagli] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Trova la cassa professionale appropriata
    const cassa = trovaCassaProfessionale(codiceAteco, undefined, ordineProfessionale);
    setCassaProfessionale(cassa);

    if (cassa) {
      // Calcola età del professionista
      let eta: number | undefined;
      if (dataNascita) {
        const oggi = new Date();
        const nascita = new Date(dataNascita);
        eta = oggi.getFullYear() - nascita.getFullYear();
        const meseDiff = oggi.getMonth() - nascita.getMonth();
        if (meseDiff < 0 || (meseDiff === 0 && oggi.getDate() < nascita.getDate())) {
          eta--;
        }
      }

      // Calcola anni di attività
      let anniAttivita: number | undefined;
      if (dataInizioAttivita) {
        const oggi = new Date();
        const inizio = new Date(dataInizioAttivita);
        anniAttivita = oggi.getFullYear() - inizio.getFullYear();
      }

      // Ottieni agevolazioni disponibili
      const agevolazioni = getAgevolazioniDisponibili(cassa, {
        eta,
        anniAttivita,
        statusSpeciale
      });

      setAgevolazioniDisponibili(agevolazioni);
    } else {
      setAgevolazioniDisponibili([]);
    }
  }, [codiceAteco, ordineProfessionale, dataNascita, dataInizioAttivita, statusSpeciale]);

  const toggleAgevolazione = (codiceAgevolazione: string) => {
    const nuoveAgevolazioni = agevolazioniSelezionate.includes(codiceAgevolazione)
      ? agevolazioniSelezionate.filter(a => a !== codiceAgevolazione)
      : [...agevolazioniSelezionate, codiceAgevolazione];
    
    onAgevolazioniChange(nuoveAgevolazioni);
  };

  const toggleDettagli = (codiceAgevolazione: string) => {
    setMostraDettagli(prev => ({
      ...prev,
      [codiceAgevolazione]: !prev[codiceAgevolazione]
    }));
  };

  if (!cassaProfessionale) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-600">
            Nessuna cassa professionale rilevata per il codice ATECO selezionato. 
            I contributi verranno calcolati secondo il regime INPS standard.
          </p>
        </div>
      </div>
    );
  }

  if (agevolazioniDisponibili.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Cassa Professionale Rilevata: {cassaProfessionale.nome}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Al momento non risultano agevolazioni contributive disponibili per il tuo profilo. 
              I contributi saranno calcolati secondo le aliquote standard della cassa.
            </p>
            <div className="mt-2">
              <a 
                href={cassaProfessionale.sitoweb} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 text-sm underline"
              >
                Visita il sito ufficiale per maggiori informazioni →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header della cassa */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">
              Cassa Professionale: {cassaProfessionale.nome}
            </h3>
            <p className="text-sm text-green-700 mt-1">
              {cassaProfessionale.nomeCompleto}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {cassaProfessionale.professioni.map((prof, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800"
                >
                  {prof}
                </span>
              ))}
            </div>
            <div className="mt-2">
              <a 
                href={cassaProfessionale.sitoweb} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-500 text-sm underline"
              >
                Informazioni ufficiali →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Agevolazioni disponibili */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          🎯 Agevolazioni Contributive Disponibili
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Seleziona le agevolazioni per cui soddisfi i requisiti. Il sistema calcolerà automaticamente 
          la riduzione contributiva applicabile.
        </p>
        
        <div className="space-y-4">
          {agevolazioniDisponibili.map((agevolazione) => (
            <div 
              key={agevolazione.codice}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                agevolazioniSelezionate.includes(agevolazione.codice)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={agevolazioniSelezionate.includes(agevolazione.codice)}
                    onChange={() => toggleAgevolazione(agevolazione.codice)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-medium text-gray-900">
                        {agevolazione.nome}
                      </h5>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                        -{agevolazione.percentualeSconto}%
                      </span>
                      {agevolazione.durataAnni && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                          <CalendarDaysIcon className="h-3 w-3 mr-1" />
                          {agevolazione.durataAnni} {agevolazione.durataAnni === 1 ? 'anno' : 'anni'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {agevolazione.descrizione}
                    </p>
                    
                    {/* Condizioni di accesso sempre visibili in forma compatta */}
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500">Requisiti:</span>
                        <div className="flex flex-wrap gap-1">
                          {agevolazione.condizioniAccesso.slice(0, 2).map((condizione, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {condizione}
                            </span>
                          ))}
                          {agevolazione.condizioniAccesso.length > 2 && (
                            <button
                              type="button"
                              onClick={() => toggleDettagli(agevolazione.codice)}
                              className="text-xs text-blue-600 hover:text-blue-500 underline"
                            >
                              +{agevolazione.condizioniAccesso.length - 2} altri
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dettagli estesi */}
                    {mostraDettagli[agevolazione.codice] && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <h6 className="text-xs font-medium text-gray-900 mb-2">
                          Tutti i requisiti di accesso:
                        </h6>
                        <ul className="space-y-1">
                          {agevolazione.condizioniAccesso.map((condizione, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {condizione}
                            </li>
                          ))}
                        </ul>
                        {!agevolazione.cumulabile && (
                          <div className="mt-2 flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="text-xs text-amber-700">
                              Non cumulabile con altre agevolazioni
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {agevolazione.condizioniAccesso.length <= 2 && !agevolazione.cumulabile && (
                      <div className="mt-2 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-xs text-amber-700">
                          Non cumulabile con altre agevolazioni
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => toggleDettagli(agevolazione.codice)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avviso importante */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">
              Importante
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Le agevolazioni contributive devono essere richieste alla cassa professionale 
              seguendo le procedure specifiche. Questo calcolatore fornisce solo una stima 
              indicativa. Consulta sempre il sito ufficiale della cassa per le procedure 
              di richiesta e i requisiti aggiornati.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 