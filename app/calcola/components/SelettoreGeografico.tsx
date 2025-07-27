'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, MapPinIcon, InformationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { 
  regioniFiscali, 
  RegioneFiscale, 
  ProvinciaFiscale, 
  ComuneFiscale,
  calcolaAddizionaliTerritoriali 
} from '@/lib/data/fiscale-territoriale';

interface Props {
  value?: {
    regione?: RegioneFiscale;
    provincia?: ProvinciaFiscale;
    comune?: ComuneFiscale;
  };
  onChange: (selection: {
    regione?: RegioneFiscale;
    provincia?: ProvinciaFiscale;
    comune?: ComuneFiscale;
  }) => void;
  onSelectionChange?: (selection: {
    regione?: RegioneFiscale;
    provincia?: ProvinciaFiscale;
    comune?: ComuneFiscale;
  }) => void; // Callback per aggiornamenti dello stato interno senza auto-avanzamento
  required?: boolean;
  preventAutoAdvance?: boolean; // Previene auto-avanzamento del wizard
}

export default function SelettoreGeografico({ value, onChange, onSelectionChange, required = false, preventAutoAdvance = true }: Props) {
  const [step, setStep] = useState<'regione' | 'provincia'>('regione');
  const [selectedRegione, setSelectedRegione] = useState<RegioneFiscale | undefined>(value?.regione);
  const [selectedProvincia, setSelectedProvincia] = useState<ProvinciaFiscale | undefined>(value?.provincia);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (value) {
      setSelectedRegione(value.regione);
      setSelectedProvincia(value.provincia);
      
      // Solo imposta lo step alla prima inizializzazione
      if (!value.regione && !value.provincia) {
        setStep('regione');
      }
    }
  }, [value]);

  const handleRegioneSelect = (regione: RegioneFiscale) => {
    setSelectedRegione(regione);
    setSelectedProvincia(undefined);
    setSearchTerm(''); // Reset ricerca
    setStep('provincia');
    
    // Non chiamare onChange qui per evitare auto-avanzamento
  };

  const handleProvinciaSelect = (provincia: ProvinciaFiscale) => {
    setSelectedProvincia(provincia);
    setSearchTerm(''); // Reset ricerca
    
    // Crea automaticamente il comune virtuale con media provinciale
    const comuneMediaProvinciale: ComuneFiscale = {
      nome: 'Media provinciale',
      codiceIstat: '',
      addizionaleComunale: provincia.addizionaleComunaleMedia
    };
    
    const selectionData = {
      regione: selectedRegione,
      provincia,
      comune: comuneMediaProvinciale
    };
    
    // Sempre notifica il cambio di stato al parent
    onSelectionChange?.(selectionData);
    
    // Se preventAutoAdvance è true, NON chiamiamo onChange automaticamente
    // L'onChange verrà chiamato solo quando l'utente clicca "Avanti" o preme Invio
    if (!preventAutoAdvance) {
      onChange(selectionData);
    }
  };

  const resetToRegione = () => {
    setStep('regione');
    setSelectedRegione(undefined);
    setSelectedProvincia(undefined);
    setSearchTerm('');
    // Non chiamare onChange per evitare auto-avanzamento
  };

  const resetToProvincia = () => {
    setStep('provincia');
    setSelectedProvincia(undefined);
    setSearchTerm('');
    // Non chiamare onChange per evitare auto-avanzamento
  };

  // Funzioni di filtro
  const filteredRegioni = regioniFiscali.filter(regione =>
    regione.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProvince = selectedRegione?.province.filter(provincia =>
    provincia.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calcola anteprima addizionali se abbiamo i dati
  const anteprimaAddizionali = selectedRegione && selectedProvincia 
    ? calcolaAddizionaliTerritoriali(
        30000, // Esempio con 30k di imponibile
        selectedRegione,
        { nome: 'Media provinciale', codiceIstat: '', addizionaleComunale: selectedProvincia.addizionaleComunaleMedia }
      ) 
    : selectedRegione 
      ? calcolaAddizionaliTerritoriali(30000, selectedRegione, undefined)
      : null;

  return (
    <div className="space-y-6">
      {/* Header con descrizione */}
      <div className="flex items-start space-x-3">
        <MapPinIcon className="w-6 h-6 text-primary-600 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Localizzazione Fiscale
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Seleziona regione e provincia per calcoli precisi delle addizionali (useremo la media provinciale)
          </p>
        </div>
      </div>

      {/* Breadcrumb di selezione */}
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={resetToRegione}
          className={`px-3 py-1 rounded-lg transition-colors ${
            step === 'regione' 
              ? 'bg-primary-100 text-primary-700 font-medium' 
              : selectedRegione 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gray-50 text-gray-500'
          }`}
        >
          {selectedRegione ? selectedRegione.nome : 'Seleziona Regione'}
        </button>
        
        {selectedRegione && (
          <>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 -rotate-90" />
            <button
              onClick={resetToProvincia}
              className={`px-3 py-1 rounded-lg transition-colors ${
                step === 'provincia' 
                  ? 'bg-primary-100 text-primary-700 font-medium' 
                  : selectedProvincia 
                    ? 'bg-success-100 text-success-700 font-medium' 
                    : 'bg-gray-50 text-gray-500'
              }`}
            >
              {selectedProvincia ? selectedProvincia.nome : 'Seleziona Provincia'}
            </button>
          </>
        )}
      </div>

      {/* Barra di ricerca */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={
            step === 'regione' ? 'Cerca una regione...' : 'Cerca una provincia...'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Contenuto principale */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {step === 'regione' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Scegli la tua Regione
              {searchTerm && <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredRegioni.length} risultati)
              </span>}
            </h4>

            {/* Opzione "Non specificare" sempre visibile */}
            {!searchTerm && (
              <button
                onClick={() => {
                  const mediaNazionale = {
                    regione: {
                      codice: "XX",
                      nome: "Media nazionale",
                      addizionaleRegionale: { aliquotaBase: 1.73, aliquotaMax: 3.33, sogliaNonImponibile: 15000 },
                      irap: { aliquotaBase: 3.9 },
                      province: []
                    },
                    provincia: {
                      codice: "XXX",
                      nome: "Media nazionale",
                      regione: "Media nazionale",
                      addizionaleComunaleMedia: 0.6,
                      comuniPrincipali: []
                    },
                    comune: {
                      nome: "Media nazionale",
                      codiceIstat: "000000",
                      addizionaleComunale: 0.6
                    }
                  };
                  
                  // Aggiorna lo stato locale
                  setSelectedRegione(mediaNazionale.regione);
                  setSelectedProvincia(mediaNazionale.provincia);
                  
                  // Sempre notifica il cambio di stato al parent
                  onSelectionChange?.(mediaNazionale);
                  
                  // Chiama onChange solo se preventAutoAdvance è false
                  if (!preventAutoAdvance) {
                    onChange(mediaNazionale);
                  }
                }}
                className="w-full text-left p-4 mb-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">🏢</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">Non specificare / Non lo so ancora</div>
                    <div className="text-sm text-blue-700 mt-1">
                      Useremo valori medi nazionali per i calcoli fiscali
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Add. Regionale: 1.73% • Add. Comunale: 0.6% • IRAP: 3.9%
                    </div>
                  </div>
                </div>
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRegioni.map((regione) => (
                <button
                  key={regione.codice}
                  onClick={() => handleRegioneSelect(regione)}
                  onMouseEnter={() => setShowTooltip(regione.codice)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="relative text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <div className="font-medium text-gray-900">{regione.nome}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Add. Regionale: {regione.addizionaleRegionale.aliquotaBase}%
                  </div>
                  <div className="text-xs text-gray-500">
                    IRAP: {regione.irap.aliquotaBase}%
                  </div>
                  
                  {/* Tooltip */}
                  {showTooltip === regione.codice && (
                    <div className="absolute z-10 bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                      <div className="font-medium mb-1">Imposte in {regione.nome}</div>
                      <div>• Addizionale regionale: {regione.addizionaleRegionale.aliquotaBase}%</div>
                      <div>• IRAP: {regione.irap.aliquotaBase}%</div>
                      {regione.addizionaleRegionale.sogliaNonImponibile && (
                        <div>• Soglia esenzione: €{regione.addizionaleRegionale.sogliaNonImponibile.toLocaleString()}</div>
                      )}
                      <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {filteredRegioni.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nessuna regione trovata per "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {step === 'provincia' && selectedRegione && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Scegli la Provincia in {selectedRegione.nome}
              {searchTerm && <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProvince.length} risultati)
              </span>}
            </h4>
            <div className="text-sm text-gray-600 mb-4">
              Per semplificare il processo, useremo automaticamente la media provinciale per l'addizionale comunale.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProvince.map((provincia) => (
                <button
                  key={provincia.codice}
                  onClick={() => handleProvinciaSelect(provincia)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="font-medium text-gray-900">{provincia.nome}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Add. Comunale Media: {provincia.addizionaleComunaleMedia}%
                  </div>
                </button>
              ))}
            </div>
            {filteredProvince.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nessuna provincia trovata per "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messaggio di completamento */}
      {selectedProvincia && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800">
                Localizzazione completata!
              </div>
              <div className="text-xs text-green-600 mt-1">
                Hai selezionato: {selectedProvincia.nome}, {selectedRegione?.nome} (Media provinciale: {selectedProvincia.addizionaleComunaleMedia}%)
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProvincia(undefined);
                setStep('provincia');
              }}
              className="text-xs text-green-600 hover:text-green-800 underline"
            >
              Modifica
            </button>
          </div>
        </div>
      )}

      {/* Anteprima imposte */}
      {anteprimaAddizionali && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Anteprima Addizionali (su €30.000 di imponibile)
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div className="flex justify-between">
                  <span>Addizionale regionale:</span>
                  <span className="font-medium">€{anteprimaAddizionali.addizionaleRegionale.toFixed(2)}</span>
                </div>
                {selectedProvincia && (
                  <div className="flex justify-between">
                    <span>Addizionale comunale (media):</span>
                    <span className="font-medium">€{anteprimaAddizionali.addizionaleComunale.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-blue-300 pt-1 font-medium">
                  <span>Totale addizionali:</span>
                  <span>€{anteprimaAddizionali.totale.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 