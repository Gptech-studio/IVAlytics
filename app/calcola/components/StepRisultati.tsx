'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentArrowDownIcon, 
  ShareIcon, 
  PrinterIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Props {
  data: any;
  onDataChange: (stepId: string, data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete?: () => void;
}

interface RisultatoCalcolo {
  imponibile: number;
  iva: {
    debito: number;
    credito: number;
    saldo: number;
    aliquota: number;
  };
  irpef: {
    imponibile: number;
    imposta: number;
    aliquota: number;
    detrazioni: number;
    tipoImposta?: string;
    addizionali?: {
      regionale: number;
      comunale: number;
    };
  };
  contributi: {
    inps: number;
    inail: number;
    cassaProfessionale: number;
    nomeCassa: string;
    sconto: number;
    totale: number;
  };
  agevolazioniApplicate?: {
    aliquotaForfettario?: string;
    scontoContributiPrimoAnno: boolean;
    scontoGestartigiani: boolean;
    agevolazioniTerritoriali: boolean;
    welfare: {
      fringeBenefit?: boolean;
      premiProduttivita?: boolean;
      detassazioneAffitti?: boolean;
    };
    scontoEffettivo: number;
    importoScontato: number;
  };
  totaleImposte: number;
  totaleContributi: number;
  totaleDovuto: number;
  scadenze: Array<{
    tipo: string;
    descrizione: string;
    dataScadenza: string;
    importo: number;
  }>;
}

export default function StepRisultati({ data, onComplete }: Props) {
  const [vistaAttiva, setVistaAttiva] = useState<'riepilogo' | 'dettaglio' | 'scadenze'>('riepilogo');
  const [risultato, setRisultato] = useState<RisultatoCalcolo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Esegue il calcolo reale chiamando l'API
  useEffect(() => {
    const calcolaImposte = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/calcolo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Errore nel calcolo');
        }

        const result = await response.json();
        setRisultato(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setIsLoading(false);
      }
    };

    calcolaImposte();
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-gray-900 mt-4">Calcolo in corso...</p>
          <p className="text-sm text-gray-600 mt-2">Stiamo elaborando i tuoi dati fiscali</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Errore nel calcolo</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!risultato) {
    return <div>Nessun risultato disponibile</div>;
  }

  // Usa direttamente i dati dall'API (risultato contiene già tutto)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const handleExportPDF = () => {
    // Implementazione export PDF
    console.log('Export PDF');
    onComplete?.();
  };

  const handleShare = () => {
    // Implementazione condivisione
    console.log('Condividi risultati');
    onComplete?.();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header con azioni */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Risultati del Calcolo
          </h2>
          <p className="text-gray-600 mt-1">
            Imposte e contributi per il periodo selezionato
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={handleExportPDF} className="btn-outline">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            PDF
          </button>
          <button onClick={handleShare} className="btn-outline">
            <ShareIcon className="w-4 h-4 mr-2" />
            Condividi
          </button>
          <button onClick={handlePrint} className="btn-outline">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Stampa
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'riepilogo', label: 'Riepilogo', icon: ChartBarIcon },
            { key: 'dettaglio', label: 'Dettaglio', icon: InformationCircleIcon },
            { key: 'scadenze', label: 'Scadenze', icon: CalendarDaysIcon }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setVistaAttiva(tab.key as any)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center
                ${vistaAttiva === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Vista Riepilogo */}
      {vistaAttiva === 'riepilogo' && (
        <div className="space-y-6">
          {/* Totali principali */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(risultato.totaleImposte)}
                </div>
                <div className="text-sm text-blue-700 mt-1">Totale Imposte</div>
              </div>
            </div>
            <div className="card bg-gradient-to-r from-green-50 to-green-100">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(risultato.totaleContributi)}
                </div>
                <div className="text-sm text-green-700 mt-1">Totale Contributi</div>
              </div>
            </div>
            <div className="card bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(risultato.totaleDovuto)}
                </div>
                <div className="text-sm text-purple-700 mt-1">Totale Dovuto</div>
              </div>
            </div>
          </div>

          {/* Breakdown imposte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-gray-900">Imposte</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">IVA ({risultato.iva.aliquota}%)</span>
                    <span className="font-semibold">{formatCurrency(risultato.iva.saldo)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {risultato.irpef.tipoImposta || 'IRPEF'} ({risultato.irpef.aliquota}%)
                    </span>
                    <span className="font-semibold">{formatCurrency(risultato.irpef.imposta)}</span>
                  </div>
                  {risultato.irpef.addizionali && (risultato.irpef.addizionali.regionale > 0 || risultato.irpef.addizionali.comunale > 0) && (
                    <>
                      {risultato.irpef.addizionali.regionale > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Addizionale Regionale</span>
                          <span className="font-semibold">{formatCurrency(risultato.irpef.addizionali.regionale)}</span>
                        </div>
                      )}
                      {risultato.irpef.addizionali.comunale > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Addizionale Comunale</span>
                          <span className="font-semibold">{formatCurrency(risultato.irpef.addizionali.comunale)}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Totale Imposte</span>
                      <span className="text-blue-600">{formatCurrency(risultato.totaleImposte)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold text-gray-900">Contributi</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {risultato.contributi.inps > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">INPS Gestione Separata</span>
                      <span className="font-semibold">{formatCurrency(risultato.contributi.inps)}</span>
                    </div>
                  )}
                  {risultato.contributi.cassaProfessionale > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{risultato.contributi.nomeCassa}</span>
                      <span className="font-semibold">{formatCurrency(risultato.contributi.cassaProfessionale)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">INAIL</span>
                    <span className="font-semibold">{formatCurrency(risultato.contributi.inail)}</span>
                  </div>
                  {risultato.contributi.sconto > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center text-green-700">
                        <span className="font-medium">Sconto {risultato.contributi.sconto}% (primo anno)</span>
                        <span className="font-semibold">-{formatCurrency((risultato.contributi.inps + risultato.contributi.cassaProfessionale) / (1 - risultato.contributi.sconto/100) * (risultato.contributi.sconto/100))}</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Agevolazione per nuove attività in regime forfettario
                      </p>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Totale Contributi</span>
                      <span className="text-green-600">{formatCurrency(risultato.totaleContributi)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Dettaglio */}
      {vistaAttiva === 'dettaglio' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Calcolo Dettagliato</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ricavi</span>
                  <span>{formatCurrency(data.datiEconomici?.ricavi || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Costi</span>
                  <span>-{formatCurrency(data.datiEconomici?.costi || 0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Imponibile</span>
                    <span>{formatCurrency(risultato.imponibile)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  * Calcolo basato su regime {data.datiPersonali?.regimeFiscale}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Scadenze */}
      {vistaAttiva === 'scadenze' && (
        <div className="space-y-4">
          {risultato.scadenze
            .filter(scadenza => scadenza.importo > 0)
            .map((scadenza, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{scadenza.descrizione}</h4>
                    <p className="text-sm text-gray-600">Scadenza: {formatDate(scadenza.dataScadenza)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(scadenza.importo)}
                    </div>
                    <div className="text-sm text-gray-500 uppercase">{scadenza.tipo}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sezione Agevolazioni Applicate */}
      {risultato.agevolazioniApplicate && (
        risultato.agevolazioniApplicate.scontoEffettivo > 0 || 
        risultato.agevolazioniApplicate.aliquotaForfettario ||
        Object.values(risultato.agevolazioniApplicate.welfare).some(Boolean)
      ) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                🎯 Agevolazioni Applicate al Tuo Calcolo
              </h3>
              <div className="mt-2 text-sm text-green-700 space-y-2">
                {risultato.agevolazioniApplicate.aliquotaForfettario && (
                  <div className="flex items-center">
                    <span className="font-medium">📊 Regime Forfettario:</span>
                    <span className="ml-2">Aliquota {risultato.agevolazioniApplicate.aliquotaForfettario}% applicata</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.scontoContributiPrimoAnno && (
                  <div className="flex items-center">
                    <span className="font-medium">💰 Sconto Primo Anno:</span>
                    <span className="ml-2">50% di riduzione sui contributi previdenziali</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.scontoGestartigiani && (
                  <div className="flex items-center">
                    <span className="font-medium">🔧 Gestione Artigiani:</span>
                    <span className="ml-2">35% di riduzione sui contributi</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.agevolazioniTerritoriali && (
                  <div className="flex items-center">
                    <span className="font-medium">🌅 Incentivi Sud:</span>
                    <span className="ml-2">Agevolazioni territoriali applicate</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.welfare.fringeBenefit && (
                  <div className="flex items-center">
                    <span className="font-medium">🎁 Fringe Benefit:</span>
                    <span className="ml-2">Beni e servizi aziendali esenti fino a €1.000-€2.000</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.welfare.premiProduttivita && (
                  <div className="flex items-center">
                    <span className="font-medium">🏆 Premi Produttività:</span>
                    <span className="ml-2">Tassazione al 5% sui premi di risultato</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.welfare.detassazioneAffitti && (
                  <div className="flex items-center">
                    <span className="font-medium">🏠 Detassazione Affitti:</span>
                    <span className="ml-2">€5.000 annui esenti per neo-assunti</span>
                  </div>
                )}
                
                {risultato.agevolazioniApplicate.scontoEffettivo > 0 && (
                  <div className="bg-green-100 p-2 rounded mt-3">
                    <div className="font-medium text-green-800">
                      💸 Risparmio Totale: €{risultato.agevolazioniApplicate.importoScontato.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600">
                      Sconto effettivo del {risultato.agevolazioniApplicate.scontoEffettivo}% applicato sui contributi
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sezione informativa su casse e sconti */}
      {(risultato.contributi.cassaProfessionale > 0 || risultato.contributi.sconto > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Informazioni su Casse e Sconti
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                {risultato.contributi.cassaProfessionale > 0 && (
                  <div className="mb-3">
                    <p className="font-medium mb-1">Cassa {risultato.contributi.nomeCassa}:</p>
                    <p className="text-xs">
                      I professionisti iscritti agli ordini professionali devono versare contributi alla propria cassa di previdenza 
                      invece o in aggiunta all'INPS Gestione Separata, a seconda della professione.
                    </p>
                  </div>
                )}
                {risultato.contributi.sconto > 0 && (
                  <div className="mb-3">
                    <p className="font-medium mb-1">Agevolazioni primo anno:</p>
                    <p className="text-xs">
                      Per i nuovi contribuenti in regime forfettario è previsto uno sconto del 50% sui contributi previdenziali 
                      per il primo anno di attività. L'agevolazione si applica automaticamente.
                    </p>
                  </div>
                )}
                <div className="bg-blue-100 p-2 rounded text-xs">
                  <p className="font-medium">Altre casse professionali principali:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>INARCASSA: Architetti e Ingegneri</li>
                    <li>Cassa Forense: Avvocati</li>
                    <li>ENPAM: Medici e Odontoiatri</li>
                    <li>CNPADC: Commercialisti</li>
                    <li>ENPACL: Consulenti del Lavoro</li>
                    <li>INPGI: Giornalisti</li>
                    <li>ENPAF: Farmacisti</li>
                    <li>ENPAP: Psicologi</li>
                    <li>ENASARCO: Agenti di Commercio</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-amber-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Importante
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Questi calcoli sono indicativi e basati sui dati forniti. 
                Per calcoli definitivi e adempimenti fiscali, consulta sempre un commercialista qualificato.
                Le aliquote e normative possono variare.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Azioni finali */}
      <div className="flex justify-center space-x-4">
        <Link href="/calcola" className="btn-outline">
          Nuovo Calcolo
        </Link>
        <Link href="/" className="btn-primary">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
} 