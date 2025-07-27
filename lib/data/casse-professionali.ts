// Sistema avanzato per la gestione delle casse professionali italiane

export interface FasciaContributiva {
  redditoMinimo: number;
  redditoMassimo: number;
  aliquotaBase: number;
  aliquotaIntegrativa?: number;
  contributoMinimo?: number;
  contributoMassimo?: number;
  note?: string;
}

export interface AgevolazioneContributiva {
  codice: string;
  nome: string;
  descrizione: string;
  percentualeSconto: number;
  durataAnni?: number;
  condizioniAccesso: string[];
  cumulabile: boolean;
}

export interface CassaProfessionale {
  codice: string;
  nome: string;
  nomeCompleto: string;
  sitoweb: string;
  
  // Mappatura ATECO dettagliata
  codiciAteco: {
    principali: string[];      // Codici ATECO principali
    secondari: string[];       // Codici ATECO secondari (opzionali)
    esclusioni: string[];      // Codici esplicitamente esclusi
  };
  
  // Professioni coperte
  professioni: string[];
  ordiniProfessionali: string[];
  
  // Struttura contributiva
  contribuzione: {
    sostituisceInps: boolean;
    aggiuntaInps: boolean;
    
    // Fasce contributive per diversi livelli di reddito
    fasceContributive: FasciaContributiva[];
    
    // Contributi fissi
    contributoFisso?: {
      importoAnnuale: number;
      descrizione: string;
    };
    
    // Aliquote speciali per regimi fiscali
    regimiFiscali: {
      ordinario: FasciaContributiva[];
      semplificato: FasciaContributiva[];
      forfettario: FasciaContributiva[];
    };
  };
  
  // Agevolazioni disponibili
  agevolazioni: AgevolazioneContributiva[];
  
  // Condizioni speciali
  condizioniSpeciali: {
    etaMinima?: number;
    etaMassima?: number;
    anniContribuzioneMinimi?: number;
    requisitiFormazione?: string[];
    limitiGeografici?: string[]; // Regioni/Province specifiche
  };
  
  // Scadenze specifiche
  scadenzeContributive: {
    frequenza: 'mensile' | 'trimestrale' | 'quadrimestrale' | 'annuale';
    giorniScadenza: number[];
    anticipi?: {
      percentuale: number;
      scadenza: string;
    };
  };
  
  // Informazioni aggiuntive
  dettagli: {
    tipoPensione: string;
    assicurazioneInvalidita: boolean;
    assicurazioneInfortuni: boolean;
    assistenzaSanitaria: boolean;
    fondoMaternita: boolean;
  };
}

// Database completo delle casse professionali italiane
export const casseProfessionali: CassaProfessionale[] = [
  {
    codice: 'INARCASSA',
    nome: 'INARCASSA',
    nomeCompleto: 'Cassa Nazionale di Previdenza ed Assistenza per gli Ingegneri ed Architetti Liberi Professionisti',
    sitoweb: 'https://www.inarcassa.it',
    
    codiciAteco: {
      principali: ['71.11.00', '71.12.10', '71.12.20', '74.10.11', '74.10.12', '74.10.21', '74.10.22'],
      secondari: ['71.20.10', '74.90.11', '74.90.12'],
      esclusioni: []
    },
    
    professioni: [
      'Architetto', 'Ingegnere', 'Pianificatore territoriale', 
      'Paesaggista', 'Conservatore'
    ],
    ordiniProfessionali: ['Ordine degli Architetti', 'Ordine degli Ingegneri'],
    
    contribuzione: {
      sostituisceInps: true,
      aggiuntaInps: false,
      
      fasceContributive: [
        {
          redditoMinimo: 0,
          redditoMassimo: 16000,
          aliquotaBase: 10,
          contributoMinimo: 1600,
          note: 'Aliquota ridotta per redditi bassi'
        },
        {
          redditoMinimo: 16001,
          redditoMassimo: 47000,
          aliquotaBase: 14.5,
          aliquotaIntegrativa: 1,
          contributoMassimo: 6815
        },
        {
          redditoMinimo: 47001,
          redditoMassimo: 100000,
          aliquotaBase: 14.5,
          aliquotaIntegrativa: 1,
          contributoMassimo: 14500
        },
        {
          redditoMinimo: 100001,
          redditoMassimo: Number.MAX_SAFE_INTEGER,
          aliquotaBase: 14.5,
          aliquotaIntegrativa: 1,
          contributoMassimo: 50000,
          note: 'Massimale elevato per redditi alti'
        }
      ],
      
      regimiFiscali: {
        ordinario: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 14.5, aliquotaIntegrativa: 1 }
        ],
        semplificato: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 14.5, aliquotaIntegrativa: 1 }
        ],
        forfettario: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 14.5, contributoMinimo: 1600 }
        ]
      }
    },
    
    agevolazioni: [
      {
        codice: 'GIOVANI_ARCHITETTI',
        nome: 'Agevolazione Giovani Professionisti',
        descrizione: 'Riduzione 50% contributi primi 3 anni per under 35',
        percentualeSconto: 50,
        durataAnni: 3,
        condizioniAccesso: ['Età inferiore a 35 anni', 'Prima iscrizione all\'ordine', 'Reddito inferiore a €30.000'],
        cumulabile: false
      },
      {
        codice: 'MATERNITA_PATERNITA',
        nome: 'Esonero Maternità/Paternità',
        descrizione: 'Esonero totale contributi durante congedo parentale',
        percentualeSconto: 100,
        durataAnni: 1,
        condizioniAccesso: ['Congedo parentale riconosciuto', 'Domanda entro 30 giorni'],
        cumulabile: true
      }
    ],
    
    condizioniSpeciali: {
      requisitiFormazione: ['Laurea in Architettura o Ingegneria', 'Abilitazione professionale', 'Iscrizione all\'ordine'],
      anniContribuzioneMinimi: 0
    },
    
    scadenzeContributive: {
      frequenza: 'quadrimestrale',
      giorniScadenza: [30, 31, 31], // Aprile, Agosto, Dicembre
      anticipi: {
        percentuale: 40,
        scadenza: '30-06'
      }
    },
    
    dettagli: {
      tipoPensione: 'Pensione di vecchiaia e anticipata',
      assicurazioneInvalidita: true,
      assicurazioneInfortuni: false,
      assistenzaSanitaria: true,
      fondoMaternita: true
    }
  },
  
  {
    codice: 'CASSA_FORENSE',
    nome: 'Cassa Forense',
    nomeCompleto: 'Cassa Nazionale di Previdenza e Assistenza Forense',
    sitoweb: 'https://www.cassaforense.it',
    
    codiciAteco: {
      principali: ['69.10.10', '69.10.90'],
      secondari: ['84.23.10'],
      esclusioni: []
    },
    
    professioni: ['Avvocato', 'Procuratore legale'],
    ordiniProfessionali: ['Ordine degli Avvocati'],
    
    contribuzione: {
      sostituisceInps: true,
      aggiuntaInps: false,
      
      fasceContributive: [
        {
          redditoMinimo: 0,
          redditoMassimo: 15000,
          aliquotaBase: 8,
          contributoMinimo: 1200
        },
        {
          redditoMinimo: 15001,
          redditoMassimo: 40000,
          aliquotaBase: 12,
          aliquotaIntegrativa: 2
        },
        {
          redditoMinimo: 40001,
          redditoMassimo: 100000,
          aliquotaBase: 14,
          aliquotaIntegrativa: 2
        },
        {
          redditoMinimo: 100001,
          redditoMassimo: Number.MAX_SAFE_INTEGER,
          aliquotaBase: 14,
          aliquotaIntegrativa: 2,
          contributoMassimo: 40000
        }
      ],
      
      contributoFisso: {
        importoAnnuale: 416,
        descrizione: 'Contributo soggettivo fisso annuale'
      },
      
      regimiFiscali: {
        ordinario: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 14, aliquotaIntegrativa: 2 }
        ],
        semplificato: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 14, aliquotaIntegrativa: 2 }
        ],
        forfettario: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 14, contributoMinimo: 1200 }
        ]
      }
    },
    
    agevolazioni: [
      {
        codice: 'PRATICANTI_AVVOCATI',
        nome: 'Agevolazione Praticanti',
        descrizione: 'Contributi ridotti durante il periodo di praticantato',
        percentualeSconto: 75,
        durataAnni: 2,
        condizioniAccesso: ['Iscrizione registro praticanti', 'Reddito professionale inferiore a €15.000'],
        cumulabile: false
      },
      {
        codice: 'UNDER_30',
        nome: 'Agevolazione Under 30',
        descrizione: 'Riduzione 50% contributi per avvocati under 30',
        percentualeSconto: 50,
        durataAnni: 3,
        condizioniAccesso: ['Età inferiore a 30 anni', 'Prima iscrizione all\'albo'],
        cumulabile: true
      }
    ],
    
    condizioniSpeciali: {
      requisitiFormazione: ['Laurea in Giurisprudenza', 'Praticantato biennale', 'Esame di stato', 'Iscrizione all\'albo'],
      anniContribuzioneMinimi: 0
    },
    
    scadenzeContributive: {
      frequenza: 'quadrimestrale',
      giorniScadenza: [30, 31, 28], // Aprile, Agosto, Febbraio
    },
    
    dettagli: {
      tipoPensione: 'Pensione di vecchiaia, anticipata e inabilità',
      assicurazioneInvalidita: true,
      assicurazioneInfortuni: false,
      assistenzaSanitaria: true,
      fondoMaternita: true
    }
  },
  
  {
    codice: 'ENPAM',
    nome: 'ENPAM',
    nomeCompleto: 'Ente Nazionale di Previdenza ed Assistenza Medici',
    sitoweb: 'https://www.enpam.it',
    
    codiciAteco: {
      principali: ['86.21.00', '86.22.00', '86.23.00', '75.00.00'],
      secondari: ['86.90.11', '86.90.12'],
      esclusioni: []
    },
    
    professioni: ['Medico chirurgo', 'Odontoiatra', 'Veterinario'],
    ordiniProfessionali: ['Ordine dei Medici', 'Ordine dei Veterinari'],
    
    contribuzione: {
      sostituisceInps: true,
      aggiuntaInps: false,
      
      fasceContributive: [
        {
          redditoMinimo: 0,
          redditoMassimo: 43000,
          aliquotaBase: 10,
          contributoMinimo: 1915
        },
        {
          redditoMinimo: 43001,
          redditoMassimo: 100000,
          aliquotaBase: 13,
          aliquotaIntegrativa: 2
        },
        {
          redditoMinimo: 100001,
          redditoMassimo: Number.MAX_SAFE_INTEGER,
          aliquotaBase: 15.5,
          aliquotaIntegrativa: 2,
          contributoMassimo: 60000
        }
      ],
      
      regimiFiscali: {
        ordinario: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 15.5, aliquotaIntegrativa: 2 }
        ],
        semplificato: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 15.5, aliquotaIntegrativa: 2 }
        ],
        forfettario: [
          { redditoMinimo: 0, redditoMassimo: Number.MAX_SAFE_INTEGER, aliquotaBase: 15.5, contributoMinimo: 1915 }
        ]
      }
    },
    
    agevolazioni: [
      {
        codice: 'MEDICI_GIOVANI',
        nome: 'Agevolazione Medici Giovani',
        descrizione: 'Riduzione contributi primi 4 anni per under 32',
        percentualeSconto: 66,
        durataAnni: 4,
        condizioniAccesso: ['Età inferiore a 32 anni', 'Prima iscrizione ENPAM'],
        cumulabile: false
      },
      {
        codice: 'SPECIALIZZANDI',
        nome: 'Esonero Specializzandi',
        descrizione: 'Esonero totale durante specializzazione',
        percentualeSconto: 100,
        condizioniAccesso: ['Iscrizione scuola specializzazione', 'Contratto specializzando'],
        cumulabile: false
      }
    ],
    
    condizioniSpeciali: {
      requisitiFormazione: ['Laurea in Medicina o Veterinaria', 'Abilitazione professionale', 'Iscrizione all\'ordine'],
      anniContribuzioneMinimi: 0
    },
    
    scadenzeContributive: {
      frequenza: 'trimestrale',
      giorniScadenza: [31, 30, 30, 31], // Marzo, Giugno, Settembre, Dicembre
    },
    
    dettagli: {
      tipoPensione: 'Pensione di vecchiaia, anticipata e inabilità',
      assicurazioneInvalidita: true,
      assicurazioneInfortuni: true,
      assistenzaSanitaria: true,
      fondoMaternita: true
    }
  }
];

// Funzione per trovare la cassa professionale appropriata
export function trovaCassaProfessionale(
  codiceAteco: string,
  professione?: string,
  ordineProfessionale?: string
): CassaProfessionale | null {
  
  // Cerca prima per codice ATECO principale
  let cassa = casseProfessionali.find(c => 
    c.codiciAteco.principali.some(codice => 
      codiceAteco.startsWith(codice.substring(0, 5))
    )
  );
  
  if (cassa) return cassa;
  
  // Cerca per codice ATECO secondario
  cassa = casseProfessionali.find(c => 
    c.codiciAteco.secondari.some(codice => 
      codiceAteco.startsWith(codice.substring(0, 5))
    )
  );
  
  if (cassa) return cassa;
  
  // Cerca per professione se specificata
  if (professione) {
    cassa = casseProfessionali.find(c => 
      c.professioni.some(prof => 
        prof.toLowerCase().includes(professione.toLowerCase())
      )
    );
  }
  
  // Cerca per ordine professionale se specificato
  if (ordineProfessionale) {
    cassa = casseProfessionali.find(c => 
      c.ordiniProfessionali.some(ordine => 
        ordine.toLowerCase().includes(ordineProfessionale.toLowerCase())
      )
    );
  }
  
  return cassa || null;
}

// Funzione per calcolare contributi avanzati
export function calcolaContributiAvanzati(
  cassa: CassaProfessionale,
  reddito: number,
  regimeFiscale: 'ordinario' | 'semplificato' | 'forfettario',
  datiProfessionista: {
    eta?: number;
    anniAttivita?: number;
    agevolazioniRichieste?: string[];
    statusSpeciale?: string; // es. 'praticante', 'specializzando'
  }
): {
  contributoBase: number;
  contributoIntegrativo: number;
  contributoFisso: number;
  contributoTotale: number;
  agevolazioniApplicate: AgevolazioneContributiva[];
  dettaglioCalcolo: string[];
} {
  
  const regimeCassa = cassa.contribuzione.regimiFiscali[regimeFiscale];
  const dettaglioCalcolo: string[] = [];
  
  // Trova la fascia contributiva appropriata
  const fasciaApplicabile = regimeCassa.find(fascia => 
    reddito >= fascia.redditoMinimo && reddito <= fascia.redditoMassimo
  ) || regimeCassa[regimeCassa.length - 1];
  
  // Calcolo contributo base
  let contributoBase = reddito * (fasciaApplicabile.aliquotaBase / 100);
  if (fasciaApplicabile.contributoMinimo) {
    contributoBase = Math.max(contributoBase, fasciaApplicabile.contributoMinimo);
  }
  if (fasciaApplicabile.contributoMassimo) {
    contributoBase = Math.min(contributoBase, fasciaApplicabile.contributoMassimo);
  }
  
  dettaglioCalcolo.push(`Contributo base: €${reddito.toLocaleString()} × ${fasciaApplicabile.aliquotaBase}% = €${contributoBase.toLocaleString()}`);
  
  // Calcolo contributo integrativo
  let contributoIntegrativo = 0;
  if (fasciaApplicabile.aliquotaIntegrativa) {
    contributoIntegrativo = reddito * (fasciaApplicabile.aliquotaIntegrativa / 100);
    dettaglioCalcolo.push(`Contributo integrativo: €${reddito.toLocaleString()} × ${fasciaApplicabile.aliquotaIntegrativa}% = €${contributoIntegrativo.toLocaleString()}`);
  }
  
  // Contributo fisso
  const contributoFisso = cassa.contribuzione.contributoFisso?.importoAnnuale || 0;
  if (contributoFisso > 0) {
    dettaglioCalcolo.push(`Contributo fisso: €${contributoFisso.toLocaleString()}`);
  }
  
  // Applica agevolazioni
  const agevolazioniApplicate: AgevolazioneContributiva[] = [];
  let scontoTotale = 0;
  
  for (const agevolazione of cassa.agevolazioni) {
    if (datiProfessionista.agevolazioniRichieste?.includes(agevolazione.codice)) {
      // Verifica condizioni di accesso (logica semplificata)
      let eligibile = true;
      
      // Verifica età se richiesta
      if (agevolazione.condizioniAccesso.some(c => c.includes('Età inferiore'))) {
        const etaRichiesta = parseInt(agevolazione.condizioniAccesso
          .find(c => c.includes('Età inferiore'))?.match(/\d+/)?.[0] || '0');
        if (!datiProfessionista.eta || datiProfessionista.eta >= etaRichiesta) {
          eligibile = false;
        }
      }
      
      if (eligibile) {
        agevolazioniApplicate.push(agevolazione);
        if (!agevolazione.cumulabile && scontoTotale > 0) {
          // Se non cumulabile, prendi solo il primo sconto
          continue;
        }
        scontoTotale += agevolazione.percentualeSconto;
        dettaglioCalcolo.push(`Agevolazione ${agevolazione.nome}: -${agevolazione.percentualeSconto}%`);
      }
    }
  }
  
  // Applica sconti
  const contributoTotalePreSconto = contributoBase + contributoIntegrativo + contributoFisso;
  const importoSconto = (contributoBase + contributoIntegrativo) * (scontoTotale / 100);
  const contributoTotale = contributoTotalePreSconto - importoSconto;
  
  if (importoSconto > 0) {
    dettaglioCalcolo.push(`Sconto totale: -€${importoSconto.toLocaleString()} (${scontoTotale}%)`);
  }
  
  return {
    contributoBase,
    contributoIntegrativo,
    contributoFisso,
    contributoTotale,
    agevolazioniApplicate,
    dettaglioCalcolo
  };
}

// Funzione per ottenere tutte le agevolazioni disponibili per una cassa
export function getAgevolazioniDisponibili(
  cassa: CassaProfessionale,
  datiProfessionista: {
    eta?: number;
    anniAttivita?: number;
    statusSpeciale?: string;
  }
): AgevolazioneContributiva[] {
  
  return cassa.agevolazioni.filter(agevolazione => {
    // Logica di filtro basata sui dati del professionista
    // Questo può essere esteso con logica più complessa
    
    if (agevolazione.condizioniAccesso.some(c => c.includes('Età inferiore'))) {
      const etaRichiesta = parseInt(agevolazione.condizioniAccesso
        .find(c => c.includes('Età inferiore'))?.match(/\d+/)?.[0] || '0');
      if (!datiProfessionista.eta || datiProfessionista.eta >= etaRichiesta) {
        return false;
      }
    }
    
    return true;
  });
} 