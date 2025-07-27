export interface Hint {
  id: string;
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  stepId?: string; // Nuovo campo per identificare lo step
}

// Suggerimenti per il primo step - Dati Personali
export const stepDatiPersonaliHints: Hint[] = [
  {
    id: 'welcome-start',
    targetId: 'step-dati-personali',
    title: 'Benvenuto! 🎯',
    content: 'Ti guiderò passo passo nella compilazione. Iniziamo con i tuoi dati personali per identificarti fiscalmente.',
    position: 'right', // Cambiato da 'bottom' a 'right' per evitare che venga tagliato
    stepId: 'datiPersonali'
  },
  {
    id: 'tipo-soggetto',
    targetId: 'tipo-soggetto-section',
    title: 'Primo step importante 👤',
    content: 'Scegli se sei una Persona Fisica (libero professionista) o Persona Giuridica (società). Questo influenza tutto il calcolo!',
    position: 'bottom',
    stepId: 'datiPersonali'
  },
  {
    id: 'dati-anagrafici',
    targetId: 'dati-anagrafici-section',
    title: 'I tuoi dati 📝',
    content: 'Nome e cognome esattamente come sul documento d\'identità. Saranno utilizzati per il codice fiscale.',
    position: 'bottom',
    stepId: 'datiPersonali'
  },
  {
    id: 'codice-fiscale',
    targetId: 'codice-fiscale-field',
    title: 'Codice fiscale 🔢',
    content: 'Inserisci il tuo codice fiscale di 16 caratteri. È fondamentale per identificarti nel sistema fiscale italiano.',
    position: 'top',
    stepId: 'datiPersonali'
  },
  {
    id: 'regime-fiscale',
    targetId: 'regime-fiscale-section',
    title: 'Scegli il regime! 💼',
    content: 'Il regime fiscale determina come vengono calcolate le tue imposte. Il Forfettario è vantaggioso fino a €85.000.',
    position: 'bottom',
    stepId: 'datiPersonali'
  },
  {
    id: 'email-opzionale',
    targetId: 'email-field',
    title: 'Email per il riepilogo 📧',
    content: 'Opzionale ma consigliata: ti invieremo un riepilogo dettagliato del calcolo con tutti i risultati.',
    position: 'top',
    stepId: 'datiPersonali'
  },
  {
    id: 'dati-professionali',
    targetId: 'dati-professionali-section',
    title: 'Dati professionali 🎯',
    content: 'Questi dati aiutano a calcolare con precisione i contributi e identificare agevolazioni specifiche per te.',
    position: 'bottom',
    stepId: 'datiPersonali'
  }
];

// Suggerimenti per il secondo step - Selezione Codice ATECO
export const stepCodiceATECOHints: Hint[] = [
  {
    id: 'ateco-intro',
    targetId: 'ateco-title',
    title: 'Codice ATECO 🎯',
    content: 'Ora selezioniamo il codice ATECO della tua attività. È fondamentale per calcolare correttamente imposte e contributi.',
    position: 'bottom',
    stepId: 'codiceATECO'
  },
  {
    id: 'methods-overview',
    targetId: 'ateco-header',
    title: 'Tre metodi disponibili 🛠️',
    content: 'Puoi scegliere tra Suggerimenti AI (consigliato), Ricerca Libera o Ricerca per Descrizione. Tutti portano allo stesso risultato!',
    position: 'bottom',
    stepId: 'codiceATECO'
  },
  {
    id: 'smart-method',
    targetId: 'method-smart',
    title: 'Metodo consigliato ✨',
    content: 'Il questionario intelligente analizza 3 semplici risposte per suggerirti i codici più pertinenti. Ideale se non conosci ancora il tuo settore.',
    position: 'right',
    stepId: 'codiceATECO'
  },
  {
    id: 'search-method',
    targetId: 'method-search',
    title: 'Ricerca diretta 🔍',
    content: 'Se conosci già parole chiave del tuo settore o hai un\'idea del codice, cerca direttamente qui. Molto veloce!',
    position: 'right',
    stepId: 'codiceATECO'
  },
  {
    id: 'description-method',
    targetId: 'method-description',
    title: 'Descrizione libera 📝',
    content: 'Descrivi la tua attività con parole tue e il sistema analizzerà il testo per trovare i codici corrispondenti.',
    position: 'right',
    stepId: 'codiceATECO'
  },
  {
    id: 'form-codice',
    targetId: 'form-codice-ateco',
    title: 'Codice selezionato 📋',
    content: 'Dopo aver scelto un codice con uno dei metodi sopra, apparirà qui automaticamente. Non puoi modificarlo manualmente.',
    position: 'left',
    stepId: 'codiceATECO'
  },
  {
    id: 'form-descrizione',
    targetId: 'form-descrizione',
    title: 'Descrizione attività ✍️',
    content: 'Questo campo si compila automaticamente con la descrizione ufficiale del codice ATECO selezionato.',
    position: 'left',
    stepId: 'codiceATECO'
  },
  {
    id: 'data-inizio',
    targetId: 'form-data-inizio',
    title: 'Data importante 📅',
    content: 'Inserisci quando hai iniziato la tua attività. Influisce sul calcolo delle imposte per l\'anno in corso.',
    position: 'top',
    stepId: 'codiceATECO'
  },
  {
    id: 'info-utili',
    targetId: 'info-ateco',
    title: 'Informazioni utili 💡',
    content: 'Leggi questi consigli per evitare errori comuni nella scelta del codice ATECO. Molto importante!',
    position: 'top',
    stepId: 'codiceATECO'
  },
  {
    id: 'navigation',
    targetId: 'navigation-buttons',
    title: 'Vai al prossimo step ➡️',
    content: 'Una volta selezionato il codice e inserita la data, clicca "Continua" per passare ai dati economici.',
    position: 'top',
    stepId: 'codiceATECO'
  }
];

// Suggerimenti per step successivi (da implementare)
export const stepDatiEconomiciHints: Hint[] = [
  // TODO: Implementare per il terzo step
];

export const stepRiepilogoHints: Hint[] = [
  // TODO: Implementare per il quarto step
];

// Logica intelligente per determinare da dove iniziare
export const getIntelligentHints = (userData: any, currentStep: string) => {
  // Verifica quali dati sono già compilati
  const hasDatiPersonali = userData?.datiPersonali && 
    userData.datiPersonali.nome && 
    userData.datiPersonali.cognome && 
    userData.datiPersonali.codiceFiscale &&
    userData.datiPersonali.tipoSoggetto &&
    userData.datiPersonali.regimeFiscale;

  const hasCodiceATECO = userData?.codiceATECO && 
    userData.codiceATECO.codice && 
    userData.codiceATECO.dataInizio;

  const hasDatiEconomici = userData?.datiEconomici && 
    userData.datiEconomici.fatturatoAnnuo;

  // Determina i suggerimenti da mostrare in base allo step corrente e ai dati compilati
  switch (currentStep) {
    case 'datiPersonali':
      // Sempre mostra i suggerimenti del primo step se siamo nel primo step
      return stepDatiPersonaliHints;
      
    case 'codiceATECO':
      // Se i dati personali non sono completi, suggerisci di tornare indietro
      if (!hasDatiPersonali) {
                 return [
           {
             id: 'incomplete-dati-personali',
             targetId: 'step-navigation',
             title: 'Dati mancanti ⚠️',
             content: 'Sembra che i dati personali non siano completi. Ti consiglio di tornare al primo step per completarli.',
             position: 'top' as const,
             stepId: 'codiceATECO'
           },
           ...stepCodiceATECOHints
         ];
      }
      return stepCodiceATECOHints;
      
    case 'datiEconomici':
      // Se i passi precedenti non sono completi, suggerisci cosa manca
      const missingSteps = [];
      if (!hasDatiPersonali) missingSteps.push('Dati Personali');
      if (!hasCodiceATECO) missingSteps.push('Codice ATECO');
      
      if (missingSteps.length > 0) {
                 return [
           {
             id: 'incomplete-previous-steps',
             targetId: 'step-navigation',
             title: 'Step precedenti incompleti ⚠️',
             content: `Mancano: ${missingSteps.join(', ')}. Completa i passaggi precedenti per un calcolo accurato.`,
             position: 'top' as const,
             stepId: 'datiEconomici'
           },
           ...stepDatiEconomiciHints
         ];
      }
      return stepDatiEconomiciHints;
      
    default:
      return [];
  }
};

// Utility per gestire le preferenze dei suggerimenti
export const useHintsPreferences = () => {
  const hasSeenHints = (stepId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const seen = localStorage.getItem(`ivalytics-hints-seen-${stepId}`);
    return seen === 'true';
  };

  const markHintsAsSeen = (stepId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`ivalytics-hints-seen-${stepId}`, 'true');
  };

  const shouldShowHints = (stepId: string): boolean => {
    return !hasSeenHints(stepId);
  };

  const resetAllHints = () => {
    if (typeof window === 'undefined') return;
    ['datiPersonali', 'codiceATECO', 'datiEconomici', 'riepilogo'].forEach(stepId => {
      localStorage.removeItem(`ivalytics-hints-seen-${stepId}`);
    });
  };

  return {
    hasSeenHints,
    markHintsAsSeen,
    shouldShowHints,
    resetAllHints
  };
}; 