export interface User {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  codiceFiscale?: string;
  partitaIva?: string;
  dataRegistrazione: Date;
}

export interface CodiceATECO {
  id?: string;
  codice: string;
  descrizione: string;
  categoria: string;
  sottocategoria?: string;
  sezione?: string;
  divisione?: string;
  gruppo?: string;
  classe?: string;
  attivo: boolean;
}

export interface AttivitaEconomica {
  codiceAteco: string;
  descrizioneAttivita: string;
  dataInizio: Date;
  dataFine?: Date;
  regime: RegimeFiscale;
}

export type RegimeFiscale = 
  | 'ordinario'
  | 'semplificato' 
  | 'forfettario'
  | 'agricoltura'
  | 'margine';

export interface DatiContribuente {
  id: string;
  userId: string;
  tipoSoggetto: 'persona_fisica' | 'persona_giuridica' | 'ente';
  denominazione: string;
  codiceFiscale: string;
  partitaIva?: string;
  residenza: {
    indirizzo: string;
    cap: string;
    comune: string;
    provincia: string;
    nazione: string;
  };
  attivitaEconomiche: AttivitaEconomica[];
  regimeFiscale: RegimeFiscale;
  dataInizioAttivita: Date;
  contatti?: {
    telefono?: string;
    email?: string;
    pec?: string;
  };
}

export interface ParametriCalcolo {
  periodoRiferimento: {
    dataInizio: Date;
    dataFine: Date;
  };
  ricavi: number;
  costi: number;
  costiDeducibili: number;
  aliquoteSpeciali?: {
    iva?: number;
    irpef?: number;
    addizionali?: {
      regionale?: number;
      comunale?: number;
    };
  };
  detrazioni?: {
    lavoro?: number;
    famiglia?: number;
    ristrutturazioni?: number;
    altre?: number;
  };
}

export interface RisultatoCalcolo {
  id: string;
  userId: string;
  dataCalcolo: Date;
  parametri: ParametriCalcolo;
  contribuente: DatiContribuente;
  
  // Risultati del calcolo
  imponibile: number;
  
  // IVA
  iva: {
    debito: number;
    credito: number;
    saldo: number;
    aliquota: number;
  };
  
  // Imposte dirette
  irpef?: {
    imponibile: number;
    imposta: number;
    aliquota: number;
    detrazioni: number;
    tipoImposta?: string;
    addizionali: {
      regionale: number;
      comunale: number;
    };
  };
  
  ires?: {
    imponibile: number;
    imposta: number;
    aliquota: number;
  };
  
  irap?: {
    imponibile: number;
    imposta: number;
    aliquota: number;
  };
  
  // Contributi
  contributi: {
    inps: number;
    inail: number;
    cassaProfessionale?: number;
    nomeCassa?: string;
    sconto?: number;
    totale: number;
  };
  
  // Totali
  totaleImposte: number;
  totaleContributi: number;
  totaleDovuto: number;
  
  // Scadenze
  scadenze: ScadenzaFiscale[];
}

export interface ScadenzaFiscale {
  id: string;
  tipo: 'iva' | 'irpef' | 'ires' | 'irap' | 'contributi' | 'dichiarazione';
  descrizione: string;
  dataScadenza: Date;
  importo: number;
  pagato: boolean;
  note?: string;
}

export interface SuggerimentoATECO {
  codice: string;
  descrizione: string;
  score: number;
  categoria: string;
  motivo: string;
}

export interface QuestionarioATECO {
  id: string;
  domanda: string;
  tipo: 'scelta_multipla' | 'testo_libero' | 'si_no';
  opzioni?: string[];
  obbligatoria: boolean;
  aiuto?: string;
}

export interface RispostaQuestionario {
  domandaId: string;
  risposta: string | string[];
}

// Utility types
export type StatusCalculation = 'draft' | 'calculating' | 'completed' | 'error';

export interface WizardStep {
  id: string;
  titolo: string;
  descrizione: string;
  completato: boolean;
  attivo: boolean;
  opzionale?: boolean;
} 