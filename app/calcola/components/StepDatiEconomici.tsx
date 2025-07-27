'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CurrencyEuroIcon, 
  CalendarDaysIcon, 
  InformationCircleIcon,
  CalculatorIcon,
  // Icone per le detrazioni
  BriefcaseIcon,      // Lavoro
  HomeIcon,           // Famiglia  
  WrenchScrewdriverIcon, // Ristrutturazioni
  DocumentTextIcon,    // Altre
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import SelectoreAgevolazioniCasse from './SelectoreAgevolazioniCasse';

const datiEconomiciSchema = z.object({
  periodoRiferimento: z.object({
    dataInizio: z.string().min(1, 'Inserisci la data di inizio'),
    dataFine: z.string().min(1, 'Inserisci la data di fine'),
  }),
  ricavi: z.number().min(0, 'I ricavi non possono essere negativi'),
  costi: z.number().min(0, 'I costi non possono essere negativi'),
  costiDeducibili: z.number().min(0, 'I costi deducibili non possono essere negativi'),
  aliquoteSpeciali: z.object({
    iva: z.number().min(0).max(100).optional(),
    irpef: z.number().min(0).max(100).optional(),
  }).optional(),
  detrazioni: z.object({
    lavoro: z.number().min(0).optional(),
    famiglia: z.number().min(0).optional(),
    ristrutturazioni: z.number().min(0).optional(),
    altre: z.number().min(0).optional(),
  }).optional(),
  agevolazioni: z.object({
    aliquotaForfettario: z.enum(['5', '15']).optional(),
    scontoContributiPrimoAnno: z.boolean().optional(),
    scontoGestartigiani: z.boolean().optional(),
    agevolazioniTerritoriali: z.boolean().optional(),
    agevolazioniCasseProfessionali: z.array(z.string()).optional(),
    welfare: z.object({
      fringeBenefit: z.boolean().optional(),
      premiProduttivita: z.boolean().optional(),
      detassazioneAffitti: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

type DatiEconomiciForm = z.infer<typeof datiEconomiciSchema>;

interface Props {
  data: any;
  onDataChange: (stepId: string, data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete?: () => void;
}

const periodiPreimpostati = [
  {
    label: 'Anno corrente (2024)',
    dataInizio: '2024-01-01',
    dataFine: '2024-12-31'
  },
  {
    label: 'Anno precedente (2023)',
    dataInizio: '2023-01-01',
    dataFine: '2023-12-31'
  },
  {
    label: 'Primo trimestre 2024',
    dataInizio: '2024-01-01',
    dataFine: '2024-03-31'
  },
  {
    label: 'Secondo trimestre 2024',
    dataInizio: '2024-04-01',
    dataFine: '2024-06-30'
  },
  {
    label: 'Terzo trimestre 2024',
    dataInizio: '2024-07-01',
    dataFine: '2024-09-30'
  },
  {
    label: 'Ultimo trimestre 2024',
    dataInizio: '2024-10-01',
    dataFine: '2024-12-31'
  }
];

export default function StepDatiEconomici({ data, onDataChange, onNext, onPrev }: Props) {
  const [showDettagli, setShowDettagli] = useState(false);
  const [anteprima, setAnteprima] = useState<any>(null);
  const [mostraOpzioniAvanzate, setMostraOpzioniAvanzate] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<DatiEconomiciForm>({
    resolver: zodResolver(datiEconomiciSchema),
    defaultValues: data.datiEconomici || {
      periodoRiferimento: {
        dataInizio: '',
        dataFine: ''
      },
      ricavi: 0,
      costi: 0,
      costiDeducibili: 0,
      aliquoteSpeciali: {},
      detrazioni: {},
      agevolazioni: {}
    },
    mode: 'onChange',
  });

  const watchedValues = watch();
  const regimeFiscale = data.datiPersonali?.regimeFiscale;

  // Auto-save mentre l'utente digita (solo se i dati sono effettivamente cambiati)
  useEffect(() => {
    if (Object.keys(watchedValues).length > 0 && JSON.stringify(watchedValues) !== JSON.stringify(data.datiEconomici || {})) {
      const timeoutId = setTimeout(() => {
        onDataChange('datiEconomici', watchedValues);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, onDataChange, data.datiEconomici]);

  // Calcolo anteprima in tempo reale
  useEffect(() => {
    if (watchedValues.ricavi && watchedValues.costi >= 0) {
      const imponibile = Math.max(0, watchedValues.ricavi - watchedValues.costi);
      const costiDeducibili = watchedValues.costiDeducibili || 0;
      const imponibileFiscale = Math.max(0, imponibile - costiDeducibili);
      
      // Calcoli semplificati per anteprima
      let aliquotaIva = 22; // Standard
      let aliquotaIrpef = 23; // Prima aliquota
      let nomeImposta = 'IRPEF';
      
      if (regimeFiscale === 'forfettario') {
        // Usa l'aliquota selezionata dall'utente o default 15%
        const aliquotaSelezionata = watchedValues.agevolazioni?.aliquotaForfettario;
        aliquotaIrpef = aliquotaSelezionata ? parseInt(aliquotaSelezionata) : 15;
        aliquotaIva = 0; // Esente IVA
        nomeImposta = 'Imposta Sostitutiva';
      }
      
      const iva = regimeFiscale === 'forfettario' ? 0 : (imponibile * aliquotaIva) / 100;
      const irpef = (imponibileFiscale * aliquotaIrpef) / 100;
      let inps = imponibileFiscale * 0.25; // Circa 25%
      
      // Applica sconti contributivi se selezionati
      if (watchedValues.agevolazioni?.scontoContributiPrimoAnno) {
        inps *= 0.5; // Sconto 50% primo anno
      } else if (watchedValues.agevolazioni?.scontoGestartigiani && regimeFiscale === 'forfettario') {
        inps *= 0.65; // Sconto 35% per artigiani/commercianti
      }
      
      setAnteprima({
        imponibile,
        imponibileFiscale,
        iva,
        irpef,
        inps,
        totale: iva + irpef + inps,
        nomeImposta,
        aliquotaSelezionata: aliquotaIrpef,
        scontiApplicati: {
          contributiPrimoAnno: watchedValues.agevolazioni?.scontoContributiPrimoAnno || false,
          gestartigiani: watchedValues.agevolazioni?.scontoGestartigiani || false
        }
      });
    }
  }, [watchedValues, regimeFiscale]);

  const setPeriodoPreimpostato = (periodo: typeof periodiPreimpostati[0]) => {
    setValue('periodoRiferimento.dataInizio', periodo.dataInizio);
    setValue('periodoRiferimento.dataFine', periodo.dataFine);
  };

  const onSubmit = (formData: DatiEconomiciForm) => {
    onDataChange('datiEconomici', formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Periodo di riferimento */}
      <div>
        <label className="form-label">Periodo di Riferimento</label>
        
        {/* Periodi preimpostati */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">Scegli un periodo comune:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {periodiPreimpostati.map((periodo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPeriodoPreimpostato(periodo)}
                className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {periodo.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Date personalizzate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-sm">Data Inizio</label>
            <input
              type="date"
              {...register('periodoRiferimento.dataInizio')}
              className="form-input"
            />
            {errors.periodoRiferimento?.dataInizio && (
              <p className="form-error">{errors.periodoRiferimento.dataInizio.message}</p>
            )}
          </div>
          <div>
            <label className="form-label text-sm">Data Fine</label>
            <input
              type="date"
              {...register('periodoRiferimento.dataFine')}
              className="form-input"
            />
            {errors.periodoRiferimento?.dataFine && (
              <p className="form-error">{errors.periodoRiferimento.dataFine.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dati economici principali */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="form-label">Ricavi Totali</label>
          <div className="relative">
            <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('ricavi', { valueAsNumber: true })}
              className="form-input pl-10"
              placeholder="0,00"
            />
          </div>
          {errors.ricavi && <p className="form-error">{errors.ricavi.message}</p>}
        </div>

        <div>
          <label className="form-label">Costi Totali</label>
          <div className="relative">
            <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('costi', { valueAsNumber: true })}
              className="form-input pl-10"
              placeholder="0,00"
            />
          </div>
          {errors.costi && <p className="form-error">{errors.costi.message}</p>}
        </div>

        <div>
          <label className="form-label">Costi Deducibili</label>
          <div className="relative">
            <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('costiDeducibili', { valueAsNumber: true })}
              className="form-input pl-10"
              placeholder="0,00"
            />
          </div>
          {errors.costiDeducibili && <p className="form-error">{errors.costiDeducibili.message}</p>}
          <p className="form-help">Es. spese per attrezzature, formazione, ufficio</p>
        </div>
      </div>

      {/* Anteprima calcolo */}
      {anteprima && (
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="card-header">
            <div className="flex items-center">
              <CalculatorIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Anteprima Calcolo</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  €{anteprima.imponibile?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Imponibile</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  €{anteprima.iva?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">IVA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  €{anteprima.irpef?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">
                  {anteprima.nomeImposta}
                  {anteprima.aliquotaSelezionata && ` (${anteprima.aliquotaSelezionata}%)`}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  €{anteprima.inps?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">
                  Contributi INPS
                  {anteprima.scontiApplicati?.contributiPrimoAnno && ' (-50%)'}
                  {anteprima.scontiApplicati?.gestartigiani && ' (-35%)'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  €{anteprima.totale?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Totale</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Anteprima indicativa con sconti selezionati. Il calcolo finale sarà più preciso.
            </p>
          </div>
        </div>
      )}

      {/* Agevolazioni Fiscali - sempre visibili */}
      {regimeFiscale && (
        <div className="border-t border-gray-200 pt-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">🎯 Agevolazioni e Sconti Fiscali</h4>
            <p className="text-sm text-gray-600">
              Seleziona le agevolazioni applicabili alla tua situazione. Ogni sconto ha requisiti specifici.
            </p>
          </div>

          {regimeFiscale === 'forfettario' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-green-800 mb-3">Regime Forfettario</h5>
              
              {/* Selezione aliquota */}
              <div className="mb-4">
                <label className="form-label">Aliquota Imposta Sostitutiva</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      value="5"
                      {...register('agevolazioni.aliquotaForfettario')}
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">5% - Nuova Attività</div>
                          <div className="text-sm text-gray-500 mt-1">
                            ✅ Non hai svolto attività nei 3 anni precedenti<br/>
                            ✅ Non è prosecuzione di lavoro precedente<br/>
                            ✅ Primi 5 anni di attività
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">5%</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      value="15"
                      {...register('agevolazioni.aliquotaForfettario')}
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">15% - Attività Esistente</div>
                          <div className="text-sm text-gray-500 mt-1">
                            📊 Attività già svolta in precedenza<br/>
                            📊 Dopo i primi 5 anni al 5%<br/>
                            📊 Aliquota standard forfettario
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">15%</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sconti sui contributi */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('agevolazioni.scontoContributiPrimoAnno')}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label className="font-medium text-gray-900">
                      💰 Sconto 50% Contributi (Primo Anno)
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Per nuove attività in regime forfettario. Riduzione del 50% sui contributi previdenziali 
                      per il primo anno di attività (solo se mai esercitato attività prima).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('agevolazioni.scontoGestartigiani')}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label className="font-medium text-gray-900">
                      🔧 Sconto 35% Gestione Artigiani e Commercianti
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Per attività di commercio, artigianato e manifattura in regime forfettario. 
                      Riduzione del 35% sui contributi della gestione artigiani e commercianti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agevolazioni per tutti i regimi */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-blue-800 mb-3">Agevolazioni Welfare e Lavoro</h5>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('agevolazioni.welfare.fringeBenefit')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="font-medium text-gray-900">
                    🎁 Fringe Benefit (€1.000 - €2.000)
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Beni e servizi aziendali esenti da tasse fino a €1.000 annui 
                    (€2.000 per dipendenti con figli a carico). Include utenze, affitti, interessi mutuo.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('agevolazioni.welfare.premiProduttivita')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="font-medium text-gray-900">
                    🏆 Premi di Produttività al 5%
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Tassazione agevolata al 5% (invece del 10%) sui premi di risultato 
                    fino a €3.000 annui per redditi fino a €80.000.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('agevolazioni.welfare.detassazioneAffitti')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="font-medium text-gray-900">
                    🏠 Detassazione Affitti Neo-Assunti
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Per assunzioni 2025: €5.000 annui esenti per affitti, per 2 anni. 
                    Richiede trasferimento residenza +100km e reddito precedente max €35.000.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agevolazioni territoriali */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-3">Agevolazioni Territoriali</h5>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('agevolazioni.agevolazioniTerritoriali')}
                className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900">
                  🌅 Incentivi Sud Italia
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Sconti contributivi 25%-15% per aziende del Sud (Abruzzo, Basilicata, Calabria, 
                  Campania, Molise, Puglia, Sardegna, Sicilia) per contratti a tempo indeterminato.
                </p>
              </div>
            </div>
          </div>

          {/* Informazioni importanti */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">⚠️ Importante:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Ogni agevolazione ha requisiti specifici che devono essere verificati</li>
                  <li>Alcune agevolazioni non sono cumulabili tra loro</li>
                  <li>I calcoli sono indicativi e soggetti a verifica con un commercialista</li>
                  <li>Le normative possono variare, consulta sempre fonti ufficiali aggiornate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agevolazioni Casse Professionali */}
      {data.datiPersonali && data.codiceATECO?.codiceAteco && (
        <div className="border-t border-gray-200 pt-6">
          <SelectoreAgevolazioniCasse
            codiceAteco={data.codiceATECO.codiceAteco}
            ordineProfessionale={data.datiPersonali.ordineProfessionale}
            dataNascita={data.datiPersonali.dataNascita}
            dataInizioAttivita={data.codiceATECO.dataInizioAttivita}
            statusSpeciale={data.datiPersonali.statusSpeciale}
            agevolazioniSelezionate={watchedValues.agevolazioni?.agevolazioniCasseProfessionali || []}
            onAgevolazioniChange={(agevolazioni) => {
              setValue('agevolazioni.agevolazioniCasseProfessionali', agevolazioni);
            }}
          />
        </div>
      )}

      {/* Opzioni Avanzate - da nascondere */}
      <div className="border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => setMostraOpzioniAvanzate(!mostraOpzioniAvanzate)}
          className="flex items-center justify-between w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <CalculatorIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Opzioni Avanzate</span>
          </div>
          {mostraOpzioniAvanzate ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {mostraOpzioniAvanzate && (
          <div className="mt-4 space-y-6">
            {/* Aliquote Speciali */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Aliquote Speciali</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Aliquota IVA personalizzata (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    {...register('aliquoteSpeciali.iva', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="22"
                  />
                  <p className="form-help">Lascia vuoto per aliquota standard</p>
                </div>
                <div>
                  <label className="form-label">Aliquota IRPEF personalizzata (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    {...register('aliquoteSpeciali.irpef', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="23"
                  />
                  <p className="form-help">Lascia vuoto per calcolo automatico</p>
                </div>
              </div>
            </div>

            {/* Detrazioni con icone */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Detrazioni</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label flex items-center space-x-2">
                    <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                    <span>Detrazioni Lavoro (€)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('detrazioni.lavoro', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="0"
                  />
                  <p className="form-help">Detrazioni per redditi da lavoro</p>
                </div>
                <div>
                  <label className="form-label flex items-center space-x-2">
                    <HomeIcon className="h-4 w-4 text-green-600" />
                    <span>Detrazioni Famiglia (€)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('detrazioni.famiglia', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="0"
                  />
                  <p className="form-help">Detrazioni per familiari a carico</p>
                </div>
                <div>
                  <label className="form-label flex items-center space-x-2">
                    <WrenchScrewdriverIcon className="h-4 w-4 text-orange-600" />
                    <span>Detrazioni Ristrutturazioni (€)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('detrazioni.ristrutturazioni', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="0"
                  />
                  <p className="form-help">Bonus casa, superbonus, ecc.</p>
                </div>
                <div>
                  <label className="form-label flex items-center space-x-2">
                    <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                    <span>Altre Detrazioni (€)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('detrazioni.altre', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="0"
                  />
                  <p className="form-help">Spese mediche, donazioni, ecc.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info box regime fiscale */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Regime {regimeFiscale || 'Non specificato'}
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              {regimeFiscale === 'forfettario' && (
                <p>Con il regime forfettario hai tassazione agevolata e sei esente IVA per alcuni tipi di attività.</p>
              )}
              {regimeFiscale === 'semplificato' && (
                <p>Il regime semplificato prevede contabilità ridotta ma obblighi IVA standard.</p>
              )}
              {regimeFiscale === 'ordinario' && (
                <p>Regime ordinario con tutti gli obblighi fiscali e contabili standard.</p>
              )}
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
            type="submit"
            disabled={!isValid}
            className={`
              inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition-all duration-200
              ${isValid 
                ? 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Avanti
            <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {!isValid && Object.keys(errors).length > 0 && (
          <div className="mt-3 text-sm text-red-600">
            Completa tutti i campi obbligatori per continuare
          </div>
        )}
      </div>
    </form>
  );
} 