'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserIcon, InformationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import SelettoreGeografico from './SelettoreGeografico';
import { RegioneFiscale, ProvinciaFiscale, ComuneFiscale } from '@/lib/data/fiscale-territoriale';

const datiPersonaliSchema = z.object({
  tipoSoggetto: z.enum(['persona_fisica', 'persona_giuridica'], {
    required_error: 'Seleziona il tipo di soggetto',
  }),
  nome: z.string().min(2, 'Il nome deve avere almeno 2 caratteri'),
  cognome: z.string().min(2, 'Il cognome deve avere almeno 2 caratteri'),
  codiceFiscale: z.string().regex(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/, {
    message: 'Inserisci un codice fiscale valido',
  }),
  partitaIva: z.string().regex(/^[0-9]{11}$/, {
    message: 'La partita IVA deve essere di 11 cifre',
  }).optional(),
  regimeFiscale: z.enum(['ordinario', 'semplificato', 'forfettario', 'agricoltura'], {
    required_error: 'Seleziona il regime fiscale',
  }),
  localizzazione: z.object({
    regione: z.any().optional(),
    provincia: z.any().optional(), 
    comune: z.any().optional(),
  }).optional(),
  email: z.string().email('Inserisci un email valida').optional(),
  // Nuovi campi per calcoli contributi avanzati
  dataNascita: z.string().optional(),
  ordineProfessionale: z.string().optional(),
  statusSpeciale: z.string().optional(),
  gestioneInps: z.string().optional(),
});

type DatiPersonaliForm = z.infer<typeof datiPersonaliSchema>;

interface Props {
  data: any;
  onDataChange: (stepId: string, data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete?: () => void;
}

const regimiFiscali = [
  {
    value: 'forfettario',
    label: 'Regime Forfettario',
    description: 'Per fatturati fino a €85.000. Tassazione agevolata al 5% o 15%.',
    icon: '💡',
  },
  {
    value: 'semplificato',
    label: 'Regime Semplificato',
    description: 'Per fatturati fino a €400.000. Contabilità semplificata.',
    icon: '📊',
  },
  {
    value: 'ordinario',
    label: 'Regime Ordinario',
    description: 'Senza limiti di fatturato. Contabilità ordinaria.',
    icon: '🏢',
  },
  {
    value: 'agricoltura',
    label: 'Regime Agricolo',
    description: 'Per attività agricole e agroalimentari.',
    icon: '🌾',
  },
];

export default function StepDatiPersonali({ data, onDataChange, onNext }: Props) {
  const [showPartitaIva, setShowPartitaIva] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [intentionalSubmit, setIntentionalSubmit] = useState(false);
  const [localizzazione, setLocalizzazione] = useState<{
    regione?: RegioneFiscale;
    provincia?: ProvinciaFiscale;
    comune?: ComuneFiscale;
  }>(data.datiPersonali?.localizzazione || {});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<DatiPersonaliForm>({
    resolver: zodResolver(datiPersonaliSchema),
    defaultValues: data.datiPersonali || {},
    mode: 'onChange',
  });

  const tipoSoggetto = watch('tipoSoggetto');
  const regimeFiscale = watch('regimeFiscale');

  // Auto-save mentre l'utente digita (solo se i dati sono effettivamente cambiati)
  // MA non avanzare automaticamente al prossimo step
  const watchedData = watch();
  useEffect(() => {
    // Escludiamo completamente la localizzazione dall'auto-save
    // La localizzazione viene gestita separatamente
    const currentDataForComparison = { ...watchedData };
    const previousDataForComparison = { ...(data.datiPersonali || {}) };
    delete currentDataForComparison.localizzazione;
    delete previousDataForComparison.localizzazione;
    
    if (Object.keys(watchedData).length > 0 && JSON.stringify(currentDataForComparison) !== JSON.stringify(previousDataForComparison) && !formSubmitted) {
      const timeoutId = setTimeout(() => {
        // NON includere la localizzazione nell'auto-save per evitare conflitti
        onDataChange('datiPersonali', watchedData);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedData, onDataChange, data.datiPersonali, formSubmitted]);

  // Funzione vuota - non deve fare nulla per evitare auto-avanzamento
  const handleLocalizzazioneChange = () => {
    // NON fare nulla - la localizzazione viene gestita tramite onSelectionChange
  };

  // Wrapper per gestire la localizzazione senza interferire con il form
  const handleSelectionChange = (newLocalizzazione: typeof localizzazione) => {
    // Aggiorna solo lo stato locale senza triggerare alcun effetto collaterale
    setLocalizzazione(newLocalizzazione);
  };

  useEffect(() => {
    setShowPartitaIva(tipoSoggetto === 'persona_giuridica' || regimeFiscale === 'ordinario');
  }, [tipoSoggetto, regimeFiscale]);

  const onSubmit = (formData: DatiPersonaliForm) => {
    setFormSubmitted(true);
    const dataWithLocalizzazione = { ...formData, localizzazione };
    onDataChange('datiPersonali', dataWithLocalizzazione);
    onNext();
  };

  // Previeni submit accidentali del form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo permettere submit se esplicitamente richiesto
    if (intentionalSubmit && !formSubmitted) {
      handleSubmit(onSubmit)(e);
      setIntentionalSubmit(false); // Reset del flag
    }
  };

  // Handler per il bottone "Avanti"
  const handleAvantiClick = () => {
    setIntentionalSubmit(true);
    // Trigger submit del form nel prossimo tick
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  return (
    <div id="step-dati-personali">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Dati Personali
        </h2>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Tipo Soggetto */}
        <div id="tipo-soggetto-section">
          <label className="form-label">Tipo di Soggetto</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="relative cursor-pointer">
              <input
                type="radio"
                value="persona_fisica"
                {...register('tipoSoggetto')}
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                <div className="flex items-center">
                  <UserIcon className="w-6 h-6 text-gray-600 peer-checked:text-primary-600" />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Persona Fisica</div>
                    <div className="text-sm text-gray-500">Libero professionista</div>
                  </div>
                </div>
              </div>
            </label>
            
            <label className="relative cursor-pointer">
              <input
                type="radio"
                value="persona_giuridica"
                {...register('tipoSoggetto')}
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                <div className="flex items-center">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Persona Giuridica</div>
                    <div className="text-sm text-gray-500">Società, Ente</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
          {errors.tipoSoggetto && (
            <p className="form-error">{errors.tipoSoggetto.message}</p>
          )}
        </div>

        {/* Dati Anagrafici */}
        <div id="dati-anagrafici-section" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Nome</label>
            <input
              type="text"
              {...register('nome')}
              className="form-input"
              placeholder="Mario"
            />
            {errors.nome && <p className="form-error">{errors.nome.message}</p>}
          </div>
          
          <div>
            <label className="form-label">Cognome</label>
            <input
              type="text"
              {...register('cognome')}
              className="form-input"
              placeholder="Rossi"
            />
            {errors.cognome && <p className="form-error">{errors.cognome.message}</p>}
          </div>
        </div>

        {/* Codice Fiscale */}
        <div id="codice-fiscale-field">
          <label className="form-label">Codice Fiscale</label>
          <input
            type="text"
            {...register('codiceFiscale')}
            className="form-input"
            placeholder="RSSMRA80A01H501A"
            style={{ textTransform: 'uppercase' }}
          />
          {errors.codiceFiscale && <p className="form-error">{errors.codiceFiscale.message}</p>}
          <p className="form-help">Il codice fiscale deve essere di 16 caratteri</p>
        </div>

        {/* Partita IVA (condizionale) */}
        {showPartitaIva && (
          <div id="partita-iva-field">
            <label className="form-label">Partita IVA</label>
            <input
              type="text"
              {...register('partitaIva')}
              className="form-input"
              placeholder="12345678901"
            />
            {errors.partitaIva && <p className="form-error">{errors.partitaIva.message}</p>}
            <p className="form-help">La partita IVA deve essere di 11 cifre</p>
          </div>
        )}

        {/* Regime Fiscale */}
        <div id="regime-fiscale-section">
          <label className="form-label">Regime Fiscale</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {regimiFiscali.map((regime) => (
              <label key={regime.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={regime.value}
                  {...register('regimeFiscale')}
                  className="sr-only peer"
                />
                <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all h-full">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{regime.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{regime.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{regime.description}</div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.regimeFiscale && (
            <p className="form-error">{errors.regimeFiscale.message}</p>
          )}
        </div>

        {/* Localizzazione Fiscale - mostra solo se regime fiscale selezionato e non forfettario */}
        {regimeFiscale && regimeFiscale !== 'forfettario' && (
          <div id="localizzazione-section" className="border-t border-gray-200 pt-6">
            <SelettoreGeografico
              value={localizzazione}
              onChange={handleLocalizzazioneChange}
              onSelectionChange={handleSelectionChange}
              required={false}
              preventAutoAdvance={true}
            />
          </div>
        )}

        {/* Email (opzionale) */}
        <div id="email-field">
          <label className="form-label">Email (opzionale)</label>
          <input
            type="email"
            {...register('email')}
            className="form-input"
            placeholder="mario.rossi@email.com"
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
          <p className="form-help">Utilizzata per inviare il riepilogo del calcolo</p>
        </div>

        {/* Campi aggiuntivi per calcolo contributi professionali */}
        <div id="dati-professionali-section" className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            📋 Dati Professionali (opzionali)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Questi dati ci aiutano a calcolare con maggiore precisione i contributi previdenziali 
            e identificare eventuali agevolazioni specifiche.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Data di nascita */}
            <div>
              <label className="form-label">Data di Nascita</label>
              <input
                type="date"
                {...register('dataNascita')}
                className="form-input"
                max={new Date().toISOString().split('T')[0]} // Non futuro
              />
              <p className="form-help">Utile per calcolare agevolazioni giovani professionisti</p>
            </div>

            {/* Gestione INPS (se non c'è cassa professionale) */}
            <div>
              <label className="form-label">Gestione INPS Specifica</label>
              <select
                {...register('gestioneInps')}
                className="form-input"
              >
                <option value="">-- Identificazione automatica --</option>
                <option value="gestione_separata">Gestione Separata (collaboratori, consulenti)</option>
                <option value="artigiani_commercianti">Gestione Artigiani e Commercianti</option>
                <option value="dipendenti">Gestione Lavoratori Dipendenti (rapporto subordinato)</option>
                <option value="autonoma_agricola">Gestione Autonoma Agricola</option>
              </select>
              <p className="form-help">Seleziona solo se diversa dall'identificazione automatica tramite ATECO</p>
            </div>

            {/* Ordine professionale */}
            <div>
              <label className="form-label">Ordine Professionale</label>
              <select
                {...register('ordineProfessionale')}
                className="form-input"
              >
                <option value="">-- Seleziona se applicabile --</option>
                <option value="Ordine degli Architetti">Ordine degli Architetti</option>
                <option value="Ordine degli Ingegneri">Ordine degli Ingegneri</option>
                <option value="Ordine degli Avvocati">Ordine degli Avvocati</option>
                <option value="Ordine dei Medici">Ordine dei Medici</option>
                <option value="Ordine dei Veterinari">Ordine dei Veterinari</option>
                <option value="Ordine dei Commercialisti">Ordine dei Commercialisti</option>
                <option value="Ordine dei Consulenti del Lavoro">Ordine dei Consulenti del Lavoro</option>
                <option value="Ordine dei Giornalisti">Ordine dei Giornalisti</option>
                <option value="Ordine dei Farmacisti">Ordine dei Farmacisti</option>
                <option value="Ordine degli Psicologi">Ordine degli Psicologi</option>
                <option value="Altro">Altro ordine professionale</option>
              </select>
              <p className="form-help">Se sei iscritto a un ordine professionale</p>
            </div>

            {/* Status speciale */}
            <div>
              <label className="form-label">Status Speciale</label>
              <select
                {...register('statusSpeciale')}
                className="form-input"
              >
                <option value="">-- Nessuno --</option>
                <option value="praticante">Praticante</option>
                <option value="specializzando">Specializzando</option>
                <option value="tirocinante">Tirocinante</option>
                <option value="neolaureato">Neolaureato (primo anno)</option>
                <option value="pensionato_attivo">Pensionato in attività</option>
              </select>
              <p className="form-help">Status particolari che possono dare diritto ad agevolazioni</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Informazioni sulla Privacy
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  I tuoi dati sono trattati in conformità al GDPR e utilizzati esclusivamente 
                  per il calcolo delle imposte. Non vengono condivisi con terze parti.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div id="step-navigation" className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {/* Non mostriamo "Indietro" nel primo step */}
            </div>
            
            <button
              type="button"
              onClick={handleAvantiClick}
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
    </div>
  );
} 