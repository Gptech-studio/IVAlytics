import { TooltipStep } from '../components/GuidedTooltip';

// Tour guidato per il primo step - Selezione Codice ATECO
export const stepCodiceATECOTour: TooltipStep[] = [
  {
    id: 'welcome',
    target: '#ateco-title',
    title: 'Benvenuto nel Calcolo ATECO! 🎯',
    content: 'Ti guiderò passo dopo passo per trovare il codice ATECO più adatto alla tua attività. È fondamentale per calcolare correttamente imposte e contributi.',
    position: 'bottom',
    category: 'Introduzione',
    waitForElement: true
  },
  {
    id: 'overview',
    target: '#ateco-header',
    title: 'Tre Metodi Disponibili 🛠️',
    content: 'Hai 3 modi per trovare il tuo codice ATECO: Suggerimenti Intelligenti (consigliato), Ricerca Libera e Ricerca per Descrizione. Scegli quello che preferisci!',
    position: 'bottom',
    category: 'Panoramica'
  },
  {
    id: 'method-smart',
    target: '#method-smart',
    title: 'Metodo 1: Suggerimenti Intelligenti ✨',
    content: 'Questo è il metodo CONSIGLIATO! Rispondi a 3 semplici domande e la nostra AI analizzerà la tua attività per suggerirti i codici più pertinenti con spiegazioni dettagliate.',
    position: 'right',
    category: 'Metodi di Ricerca'
  },
  {
    id: 'smart-start',
    target: '.btn-outline',
    title: 'Inizia il Questionario 🚀',
    content: 'Clicca qui per iniziare il questionario intelligente. Ti faremo 3 domande mirate sulla tua attività per fornirti i suggerimenti più accurati.',
    position: 'top',
    category: 'Questionario AI',
    waitForElement: true
  },
  {
    id: 'method-search',
    target: '#method-search',
    title: 'Metodo 2: Ricerca Libera 🔍',
    content: 'Se già conosci il settore o hai un\'idea del codice, puoi cercare direttamente inserendo parole chiave o il numero del codice ATECO.',
    position: 'right',
    category: 'Metodi di Ricerca'
  },
  {
    id: 'search-input',
    target: 'input[placeholder*="consulenza"]',
    title: 'Campo di Ricerca 💭',
    content: 'Digita almeno 3 caratteri per iniziare la ricerca. Puoi cercare per codice (es. "62.01.00") o per parole chiave (es. "consulenza informatica").',
    position: 'bottom',
    category: 'Ricerca Libera',
    waitForElement: true
  },
  {
    id: 'method-description',
    target: '#method-description',
    title: 'Metodo 3: Ricerca per Descrizione 📝',
    content: 'Descrivi liberamente la tua attività e il nostro sistema analizzerà il testo per trovare i codici ATECO corrispondenti tramite analisi semantica.',
    position: 'right',
    category: 'Metodi di Ricerca'
  },
  {
    id: 'description-textarea',
    target: 'textarea[placeholder*="Sviluppo"]',
    title: 'Descrizione Libera ✍️',
    content: 'Scrivi almeno 10 caratteri descrivendo cosa fai. Più dettagli fornisci, migliori saranno i risultati. Non preoccuparti dello stile, usa le tue parole!',
    position: 'bottom',
    category: 'Descrizione Attività',
    waitForElement: true
  },
  {
    id: 'form-fields',
    target: '#form-codice-ateco',
    title: 'Campi del Form 📋',
    content: 'Dopo aver selezionato un codice ATECO, questi campi si compileranno automaticamente. Il codice e la descrizione sono collegati tra loro.',
    position: 'left',
    category: 'Compilazione Form'
  },
  {
    id: 'date-field',
    target: '#form-data-inizio',
    title: 'Data Inizio Attività 📅',
    content: 'Inserisci quando hai iniziato la tua attività. Questa data è importante per calcolare correttamente imposte e contributi per l\'anno in corso.',
    position: 'top',
    category: 'Dati Personali',
    waitForElement: true
  },
  {
    id: 'info-box',
    target: '#info-ateco',
    title: 'Informazioni Utili 💡',
    content: 'Qui trovi informazioni importanti sui codici ATECO, cosa sapere e dove trovare aiuto se hai dubbi. Leggile per evitare errori!',
    position: 'top',
    category: 'Informazioni'
  },
  {
    id: 'navigation',
    target: '#navigation-buttons',
    title: 'Navigazione del Wizard 🧭',
    content: 'Usa questi pulsanti per spostarti tra i passaggi. Il pulsante "Continua" si attiva solo quando hai selezionato un codice ATECO valido.',
    position: 'top',
    category: 'Navigazione'
  },
  {
    id: 'completion',
    target: 'button[type="submit"]',
    title: 'Completa il Passaggio ✅',
    content: 'Perfetto! Una volta selezionato il codice ATECO e compilato la data, clicca "Continua" per passare al prossimo step: i Dati Economici.',
    position: 'top',
    category: 'Completamento'
  }
];

// Tour breve per utenti esperti
export const stepCodiceATECOTourQuick: TooltipStep[] = [
  {
    id: 'welcome-quick',
    target: '#ateco-title',
    title: 'Selezione Codice ATECO 🎯',
    content: 'Seleziona il codice ATECO della tua attività usando uno dei tre metodi disponibili.',
    position: 'bottom',
    category: 'Quick Start'
  },
  {
    id: 'methods-quick',
    target: '#ateco-header',
    title: 'Tre Metodi di Ricerca 🛠️',
    content: 'Suggerimenti AI (consigliato), Ricerca Libera o Ricerca per Descrizione. Scegli quello che preferisci!',
    position: 'bottom',
    category: 'Quick Start'
  },
  {
    id: 'form-quick',
    target: '#form-codice-ateco',
    title: 'Compilazione Automatica 📋',
    content: 'I campi si compileranno automaticamente quando selezioni un codice. Aggiungi solo la data di inizio attività.',
    position: 'left',
    category: 'Quick Start'
  },
  {
    id: 'complete-quick',
    target: 'button[type="submit"]',
    title: 'Continua al Prossimo Step ➡️',
    content: 'Clicca "Continua" quando hai selezionato il codice e inserito la data per passare ai Dati Economici.',
    position: 'top',
    category: 'Quick Start'
  }
];

// Configurazioni per diversi tipi di tour
export interface TourConfig {
  id: string;
  name: string;
  description: string;
  steps: TooltipStep[];
  estimatedTime: string;
  difficulty: 'principiante' | 'intermedio' | 'esperto';
  autoStart?: boolean;
}

export const availableTours: TourConfig[] = [
  {
    id: 'ateco-complete',
    name: 'Guida Completa - Codice ATECO',
    description: 'Tour dettagliato per comprendere tutti i metodi di ricerca e le opzioni disponibili',
    steps: stepCodiceATECOTour,
    estimatedTime: '3-4 minuti',
    difficulty: 'principiante',
    autoStart: false
  },
  {
    id: 'ateco-quick',
    name: 'Guida Rapida - Codice ATECO',
    description: 'Tour veloce per utenti che hanno già familiarità con i codici ATECO',
    steps: stepCodiceATECOTourQuick,
    estimatedTime: '1-2 minuti',
    difficulty: 'esperto',
    autoStart: false
  }
];

// Hook per gestire le preferenze del tour
export const useTourPreferences = () => {
  const getTourPreference = (): string => {
    if (typeof window === 'undefined') return 'ateco-complete';
    return localStorage.getItem('ivanalytics-tour-preference') || 'ateco-complete';
  };

  const setTourPreference = (tourId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ivanalytics-tour-preference', tourId);
  };

  const hasSeenTour = (tourId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const seen = localStorage.getItem(`ivanalytics-tour-seen-${tourId}`);
    return seen === 'true';
  };

  const markTourAsSeen = (tourId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`ivanalytics-tour-seen-${tourId}`, 'true');
  };

  const shouldAutoShowTour = (): boolean => {
    if (typeof window === 'undefined') return false;
    const preference = getTourPreference();
    return !hasSeenTour(preference);
  };

  return {
    getTourPreference,
    setTourPreference,
    hasSeenTour,
    markTourAsSeen,
    shouldAutoShowTour
  };
}; 