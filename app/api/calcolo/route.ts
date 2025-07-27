import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import RisultatoCalcolo from '@/lib/models/RisultatoCalcolo';
import { 
  RegioneFiscale, 
  ProvinciaFiscale, 
  ComuneFiscale,
  calcolaAddizionaliTerritoriali,
  calcolaIRAP,
  getSSettorePerATECO 
} from '@/lib/data/fiscale-territoriale';
import { 
  trovaCassaProfessionale,
  calcolaContributiAvanzati,
  getAgevolazioniDisponibili,
  CassaProfessionale 
} from '@/lib/data/casse-professionali';

interface ParametriCalcolo {
  datiPersonali: {
    nome: string;
    cognome: string;
    codiceFiscale: string;
    partitaIva?: string;
    regimeFiscale: 'ordinario' | 'semplificato' | 'forfettario' | 'agricoltura';
    tipoSoggetto: 'persona_fisica' | 'persona_giuridica';
    localizzazione?: {
      regione?: RegioneFiscale;
      provincia?: ProvinciaFiscale;
      comune?: ComuneFiscale;
    };
    email?: string;
    // Nuovi campi per calcoli avanzati contributi
    dataNascita?: string;
    ordineProfessionale?: string;
    statusSpeciale?: string; // 'praticante', 'specializzando', etc.
    gestioneInps?: string; // 'gestione_separata', 'artigiani_commercianti', etc.
  };
  codiceATECO: {
    codiceAteco: string;
    descrizioneAttivita: string;
    dataInizioAttivita: string;
  };
  datiEconomici: {
    periodoRiferimento: {
      dataInizio: string;
      dataFine: string;
    };
    ricavi: number;
    costi: number;
    costiDeducibili: number;
    aliquoteSpeciali?: {
      iva?: number;
      irpef?: number;
    };
    detrazioni?: {
      lavoro?: number;
      famiglia?: number;
      ristrutturazioni?: number;
      altre?: number;
    };
    agevolazioni?: {
      aliquotaForfettario?: '5' | '15';
      scontoContributiPrimoAnno?: boolean;
      scontoGestartigiani?: boolean;
      agevolazioniTerritoriali?: boolean;
      agevolazioniCasseProfessionali?: string[]; // Lista codici agevolazioni richieste
      welfare?: {
        fringeBenefit?: boolean;
        premiProduttivita?: boolean;
        detassazioneAffitti?: boolean;
      };
    };
  };
}

// POST - Calcola imposte e contributi
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body: ParametriCalcolo = await request.json();
    
    // Validazione dati
    const validazione = validaDatiCalcolo(body);
    if (!validazione.valido) {
      return NextResponse.json(
        { success: false, error: validazione.errori },
        { status: 400 }
      );
    }
    
    // Esegui calcolo
    const risultato = calcolaImposteContributi(body);
    
    // Salva risultato nel database (opzionale)
    // const nuovoCalcolo = new RisultatoCalcolo(risultato);
    // await nuovoCalcolo.save();
    
    return NextResponse.json({
      success: true,
      data: risultato
    });
    
  } catch (error) {
    console.error('Errore calcolo imposte:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

function validaDatiCalcolo(dati: ParametriCalcolo) {
  const errori: string[] = [];
  
  // Validazione dati personali
  if (!dati.datiPersonali?.nome) errori.push('Nome obbligatorio');
  if (!dati.datiPersonali?.cognome) errori.push('Cognome obbligatorio');
  if (!dati.datiPersonali?.codiceFiscale) errori.push('Codice fiscale obbligatorio');
  if (!dati.datiPersonali?.regimeFiscale) errori.push('Regime fiscale obbligatorio');
  
  // Validazione codice ATECO
  if (!dati.codiceATECO?.codiceAteco) errori.push('Codice ATECO obbligatorio');
  if (!dati.codiceATECO?.descrizioneAttivita) errori.push('Descrizione attività obbligatoria');
  
  // Validazione dati economici
  if (!dati.datiEconomici?.periodoRiferimento?.dataInizio) errori.push('Data inizio periodo obbligatoria');
  if (!dati.datiEconomici?.periodoRiferimento?.dataFine) errori.push('Data fine periodo obbligatoria');
  if (typeof dati.datiEconomici?.ricavi !== 'number' || dati.datiEconomici.ricavi < 0) {
    errori.push('Ricavi devono essere un numero positivo');
  }
  if (typeof dati.datiEconomici?.costi !== 'number' || dati.datiEconomici.costi < 0) {
    errori.push('Costi devono essere un numero positivo');
  }
  
  return {
    valido: errori.length === 0,
    errori
  };
}

function calcolaImposteContributi(dati: ParametriCalcolo) {
  const { datiPersonali, datiEconomici } = dati;
  
  // Calcoli base
  const ricavi = datiEconomici.ricavi;
  const costi = datiEconomici.costi;
  const costiDeducibili = datiEconomici.costiDeducibili || 0;
  const imponibile = Math.max(0, ricavi - costi);
  const imponibileFiscale = Math.max(0, imponibile - costiDeducibili);
  
  // Calcolo IVA
  let aliquotaIva = datiEconomici.aliquoteSpeciali?.iva || 22;
  let debitoIva = 0;
  let creditoIva = 0;
  let saldoIva = 0;
  
  if (datiPersonali.regimeFiscale !== 'forfettario') {
    debitoIva = ricavi * (aliquotaIva / 100);
    creditoIva = costi * (aliquotaIva / 100);
    saldoIva = debitoIva - creditoIva;
  } else {
    aliquotaIva = 0; // Regime forfettario esente IVA
  }
  
  // Calcolo IRPEF/Imposta Sostitutiva
  let aliquotaIrpef: number;
  let impostaIrpef: number;
  let tipoImposta: string;
  
  switch (datiPersonali.regimeFiscale) {
    case 'forfettario':
      // Usa l'aliquota selezionata dall'utente o determina automaticamente
      const aliquotaSelezionata = datiEconomici.agevolazioni?.aliquotaForfettario;
      if (aliquotaSelezionata) {
        aliquotaIrpef = parseInt(aliquotaSelezionata);
      } else {
        // Determina automaticamente se è una nuova attività
        const dataInizio = new Date(dati.codiceATECO.dataInizioAttivita);
        const anniAttivita = new Date().getFullYear() - dataInizio.getFullYear();
        aliquotaIrpef = anniAttivita <= 5 ? 5 : 15; // 5% primi 5 anni, poi 15%
      }
      tipoImposta = 'Imposta Sostitutiva';
      break;
    case 'semplificato':
    case 'ordinario':
    default:
      // Aliquote IRPEF progressive
      if (imponibileFiscale <= 15000) aliquotaIrpef = 23;
      else if (imponibileFiscale <= 28000) aliquotaIrpef = 27;
      else if (imponibileFiscale <= 55000) aliquotaIrpef = 38;
      else if (imponibileFiscale <= 75000) aliquotaIrpef = 41;
      else aliquotaIrpef = 43;
      tipoImposta = 'IRPEF';
      break;
  }
  
  impostaIrpef = imponibileFiscale * (aliquotaIrpef / 100);
  
  // Detrazioni
  const detrazioniTotali = 
    (datiEconomici.detrazioni?.lavoro || 0) +
    (datiEconomici.detrazioni?.famiglia || 0) +
    (datiEconomici.detrazioni?.ristrutturazioni || 0) +
    (datiEconomici.detrazioni?.altre || 0);
  
  impostaIrpef = Math.max(0, impostaIrpef - detrazioniTotali);
  
  // Addizionali regionali e comunali (solo per regimi non forfettari)
  let addizionaleRegionale = 0;
  let addizionaleComunale = 0;
  let irap = 0;
  
  if (datiPersonali.regimeFiscale !== 'forfettario') {
    if (datiPersonali.localizzazione?.regione) {
      // Calcola addizionali reali basate sulla localizzazione
      const addizionali = calcolaAddizionaliTerritoriali(
        imponibileFiscale,
        datiPersonali.localizzazione.regione,
        datiPersonali.localizzazione.comune
      );
      addizionaleRegionale = addizionali.addizionaleRegionale;
      addizionaleComunale = addizionali.addizionaleComunale;
      
      // Calcola IRAP reale
      const settore = getSSettorePerATECO(dati.codiceATECO.codiceAteco);
      irap = calcolaIRAP(imponibileFiscale, datiPersonali.localizzazione.regione, settore);
    } else {
      // Fallback a valori medi nazionali
      addizionaleRegionale = imponibileFiscale * 0.019; // 1.9% media
      addizionaleComunale = imponibileFiscale * 0.008; // 0.8% media
      irap = imponibileFiscale * 0.039; // 3.9% media
    }
  }
  // Nel regime forfettario addizionali e IRAP rimangono a 0
  
  // Calcolo contributi INPS e casse professionali avanzato
  let contributiInps = 0;
  let contributiInail = 0;
  let contributiCassaProfessionale = 0;
  let contributiCassaProfessionaleIntegrativo = 0;
  let contributiCassaProfessionaleFisso = 0;
  let nomeCassaProfessionale = '';
  let scontoContributi = 0;
  let scontoPercentuale = 0;
  let dettaglioCalcoloCassa: string[] = [];
  let agevolazioniCassaApplicate: string[] = [];
  
  // Determina la cassa professionale con sistema avanzato
  const cassaProfessionale = trovaCassaProfessionale(
    dati.codiceATECO.codiceAteco,
    undefined, // Campo professione rimosso
    datiPersonali.ordineProfessionale
  );
  
  if (cassaProfessionale) {
    // Calcolo avanzato con cassa professionale
    nomeCassaProfessionale = cassaProfessionale.nome;
    
    // Calcola età del professionista se data nascita disponibile
    let eta: number | undefined;
    if (datiPersonali.dataNascita) {
      const oggi = new Date();
      const nascita = new Date(datiPersonali.dataNascita);
      eta = oggi.getFullYear() - nascita.getFullYear();
      const meseDiff = oggi.getMonth() - nascita.getMonth();
      if (meseDiff < 0 || (meseDiff === 0 && oggi.getDate() < nascita.getDate())) {
        eta--;
      }
    }
    
    // Calcola anni di attività
    let anniAttivita: number | undefined;
    if (dati.codiceATECO.dataInizioAttivita) {
      const oggi = new Date();
      const inizio = new Date(dati.codiceATECO.dataInizioAttivita);
      anniAttivita = oggi.getFullYear() - inizio.getFullYear();
    }
    
    // Utilizza il sistema avanzato di calcolo contributi
    const risultatoContributi = calcolaContributiAvanzati(
      cassaProfessionale,
      imponibileFiscale,
      datiPersonali.regimeFiscale === 'agricoltura' ? 'ordinario' : datiPersonali.regimeFiscale,
      {
        eta,
        anniAttivita,
        agevolazioniRichieste: datiEconomici.agevolazioni?.agevolazioniCasseProfessionali || [],
        statusSpeciale: datiPersonali.statusSpeciale
      }
    );
    
    contributiCassaProfessionale = risultatoContributi.contributoBase;
    contributiCassaProfessionaleIntegrativo = risultatoContributi.contributoIntegrativo;
    contributiCassaProfessionaleFisso = risultatoContributi.contributoFisso;
    dettaglioCalcoloCassa = risultatoContributi.dettaglioCalcolo;
    agevolazioniCassaApplicate = risultatoContributi.agevolazioniApplicate.map(a => a.nome);
    
    // Se la cassa sostituisce INPS, non calcolare contributi INPS
    if (cassaProfessionale.contribuzione.sostituisceInps) {
      contributiInps = 0;
    } else {
      // Altrimenti calcola contributi INPS standard
      if (datiPersonali.regimeFiscale !== 'forfettario') {
        contributiInps = imponibileFiscale * 0.25; // ~25% per autonomi
      } else {
        contributiInps = imponibileFiscale * 0.24; // Leggermente ridotti forfettario
      }
    }
    
    // INAIL sempre calcolato (se non coperto specificamente dalla cassa)
    if (!cassaProfessionale.dettagli.assicurazioneInfortuni) {
      if (datiPersonali.regimeFiscale !== 'forfettario') {
        contributiInail = imponibileFiscale * 0.0175; // ~1.75%
      } else {
        contributiInail = imponibileFiscale * 0.015;
      }
    }
    
  } else {
    // Nessuna cassa professionale - calcolo INPS con gestioni differenziate
    nomeCassaProfessionale = '';
    
    // Determina la gestione INPS appropriata
    const gestioneInps = determinaGestioneInps(
      dati.codiceATECO.codiceAteco, 
      datiPersonali.gestioneInps,
      datiPersonali.regimeFiscale
    );
    
    // Calcola contributi in base alla gestione INPS
    const { inps: contributiInpsCalcolati, inail: contributiInailCalcolati, dettaglio } = 
      calcolaContributiInps(imponibileFiscale, gestioneInps, datiPersonali.regimeFiscale);
    
    contributiInps = contributiInpsCalcolati;
    contributiInail = contributiInailCalcolati;
    dettaglioCalcoloCassa = dettaglio;
  }
  
  // Applica sconti sui contributi basati sulle agevolazioni selezionate
  const agevolazioni = datiEconomici.agevolazioni;
  
  if (agevolazioni?.scontoContributiPrimoAnno) {
    // Sconto 50% sui contributi per primo anno
    scontoPercentuale = 50;
    scontoContributi = (contributiInps + contributiCassaProfessionale) * 0.5;
    contributiInps *= 0.5;
    contributiCassaProfessionale *= 0.5;
  } else if (agevolazioni?.scontoGestartigiani && datiPersonali.regimeFiscale === 'forfettario') {
    // Sconto 35% per gestione artigiani e commercianti
    scontoPercentuale = 35;
    scontoContributi = (contributiInps + contributiCassaProfessionale) * 0.35;
    contributiInps *= 0.65;
    contributiCassaProfessionale *= 0.65;
  } else {
    // Calcola sconti normativi automatici (come prima per compatibilità)
    const dataInizio = new Date(dati.codiceATECO.dataInizioAttivita);
    const anniAttivita = new Date().getFullYear() - dataInizio.getFullYear();
    
    if (anniAttivita <= 1 && datiPersonali.regimeFiscale === 'forfettario') {
      // Sconto 50% sui contributi per primo anno regime forfettario (se non già applicato)
      scontoPercentuale = 50;
      scontoContributi = (contributiInps + contributiCassaProfessionale) * 0.5;
      contributiInps *= 0.5;
      contributiCassaProfessionale *= 0.5;
    }
  }
  
  // Applica agevolazioni territoriali se selezionate
  if (agevolazioni?.agevolazioniTerritoriali) {
    // Logica per agevolazioni territoriali (Sud Italia, etc.)
    // Questo dovrebbe essere implementato con dati specifici per regione
    const scontoTerritoriale = 0.25; // 25% di esempio
    contributiInps *= (1 - scontoTerritoriale);
    contributiCassaProfessionale *= (1 - scontoTerritoriale);
  }
  
  // Totali
  const totaleImposte = saldoIva + impostaIrpef + addizionaleRegionale + addizionaleComunale + irap;
  const totaleContributiCassa = contributiCassaProfessionale + contributiCassaProfessionaleIntegrativo + contributiCassaProfessionaleFisso;
  const totaleContributi = contributiInps + contributiInail + totaleContributiCassa;
  const totaleDovuto = totaleImposte + totaleContributi;
  
  // Genera scadenze
  const scadenze = generaScadenze(dati, {
    iva: saldoIva,
    irpef: impostaIrpef,
    irap: irap,
    contributi: totaleContributi
  });
  
  return {
    parametri: dati,
    dataCalcolo: new Date(),
    imponibile,
    iva: {
      debito: debitoIva,
      credito: creditoIva,
      saldo: saldoIva,
      aliquota: aliquotaIva
    },
    irpef: {
      imponibile: imponibileFiscale,
      imposta: impostaIrpef,
      aliquota: aliquotaIrpef,
      detrazioni: detrazioniTotali,
      tipoImposta: tipoImposta,
      addizionali: {
        regionale: addizionaleRegionale,
        comunale: addizionaleComunale
      }
    },
    irap: {
      imponibile: imponibileFiscale,
      imposta: irap,
      aliquota: datiPersonali.localizzazione?.regione ? 
        datiPersonali.localizzazione.regione.irap.aliquotaBase : 3.9,
      settore: getSSettorePerATECO(dati.codiceATECO.codiceAteco) || 'standard'
    },
    contributi: {
      inps: contributiInps,
      inail: contributiInail,
      cassaProfessionale: {
        base: contributiCassaProfessionale,
        integrativo: contributiCassaProfessionaleIntegrativo,
        fisso: contributiCassaProfessionaleFisso,
        totale: totaleContributiCassa,
        nome: nomeCassaProfessionale,
        dettaglioCalcolo: dettaglioCalcoloCassa,
        agevolazioniApplicate: agevolazioniCassaApplicate
      },
      gestioneInps: cassaProfessionale ? null : determinaGestioneInps(
        dati.codiceATECO.codiceAteco, 
        datiPersonali.gestioneInps,
        datiPersonali.regimeFiscale
      ),
      sconto: scontoPercentuale,
      totale: totaleContributi
    },
    agevolazioniApplicate: {
      aliquotaForfettario: datiEconomici.agevolazioni?.aliquotaForfettario,
      scontoContributiPrimoAnno: agevolazioni?.scontoContributiPrimoAnno || false,
      scontoGestartigiani: agevolazioni?.scontoGestartigiani || false,
      agevolazioniTerritoriali: agevolazioni?.agevolazioniTerritoriali || false,
      welfare: agevolazioni?.welfare || {},
      scontoEffettivo: scontoPercentuale,
      importoScontato: scontoContributi
    },
    totaleImposte,
    totaleContributi,
    totaleDovuto,
    scadenze
  };
}

function generaScadenze(dati: ParametriCalcolo, importi: any) {
  const scadenze = [];
  const annoCorrente = new Date().getFullYear();
  const isForfettario = dati.datiPersonali.regimeFiscale === 'forfettario';
  const tipoImposta = isForfettario ? 'Imposta Sostitutiva' : 'IRPEF';
  
  // IVA trimestrale
  if (importi.iva > 0) {
    scadenze.push({
      tipo: 'iva',
      descrizione: 'Liquidazione IVA Trimestrale',
      dataScadenza: new Date(annoCorrente, 3, 16), // 16 aprile
      importo: importi.iva,
      pagato: false
    });
  }
  
  // IRPEF/Imposta Sostitutiva - Acconto
  if (importi.irpef > 0) {
    scadenze.push({
      tipo: 'irpef',
      descrizione: `Acconto ${tipoImposta} (40%)`,
      dataScadenza: new Date(annoCorrente, 5, 17), // 17 giugno
      importo: importi.irpef * 0.4,
      pagato: false
    });
    
    scadenze.push({
      tipo: 'irpef',
      descrizione: `Saldo ${tipoImposta}`,
      dataScadenza: new Date(annoCorrente + 1, 5, 17), // 17 giugno anno successivo
      importo: importi.irpef * 0.6,
      pagato: false
    });
  }
  
  // IRAP
  if (importi.irap > 0) {
    scadenze.push({
      tipo: 'irap',
      descrizione: 'Acconto IRAP (40%)',
      dataScadenza: new Date(annoCorrente, 5, 17), // 17 giugno
      importo: importi.irap * 0.4,
      pagato: false
    });
    
    scadenze.push({
      tipo: 'irap',
      descrizione: 'Saldo IRAP',
      dataScadenza: new Date(annoCorrente + 1, 5, 17), // 17 giugno anno successivo
      importo: importi.irap * 0.6,
      pagato: false
    });
  }
  
  // Contributi INPS
  if (importi.contributi > 0) {
    scadenze.push({
      tipo: 'contributi',
      descrizione: 'Contributi INPS',
      dataScadenza: new Date(annoCorrente, 7, 20), // 20 agosto
      importo: importi.contributi,
      pagato: false
    });
  }
  
  return scadenze.sort((a, b) => a.dataScadenza.getTime() - b.dataScadenza.getTime());
} 

// La vecchia funzione determinaCassaProfessionale è stata sostituita 
// dal sistema avanzato in lib/data/casse-professionali.ts

// Funzione per determinare la gestione INPS appropriata
function determinaGestioneInps(
  codiceAteco: string, 
  gestioneSpecificata?: string,
  regimeFiscale?: string
): string {
  
  // Se l'utente ha specificato una gestione, usa quella
  if (gestioneSpecificata) {
    return gestioneSpecificata;
  }
  
  // Altrimenti determina automaticamente dal codice ATECO
  const codice = codiceAteco.substring(0, 2); // Prime due cifre
  
  // Mappatura codici ATECO -> gestioni INPS
  const mappaGestioni: Record<string, string> = {
    // Settori manifatturieri e artigianali
    '10': 'artigiani_commercianti', // Industrie alimentari
    '11': 'artigiani_commercianti', // Industria bevande  
    '13': 'artigiani_commercianti', // Industria tessile
    '14': 'artigiani_commercianti', // Confezione articoli abbigliamento
    '15': 'artigiani_commercianti', // Fabbricazione cuoio
    '16': 'artigiani_commercianti', // Industria legno
    '17': 'artigiani_commercianti', // Fabbricazione carta
    '18': 'artigiani_commercianti', // Stampa e riproduzione
    '20': 'artigiani_commercianti', // Fabbricazione prodotti chimici
    '22': 'artigiani_commercianti', // Fabbricazione gomma/plastica
    '23': 'artigiani_commercianti', // Fabbricazione prodotti vetro
    '24': 'artigiani_commercianti', // Metallurgia
    '25': 'artigiani_commercianti', // Fabbricazione prodotti metallo
    '31': 'artigiani_commercianti', // Fabbricazione mobili
    '32': 'artigiani_commercianti', // Altre industrie manifatturiere
    '33': 'artigiani_commercianti', // Riparazione/installazione macchine
    
    // Commercio
    '45': 'artigiani_commercianti', // Commercio veicoli
    '46': 'artigiani_commercianti', // Commercio all'ingrosso
    '47': 'artigiani_commercianti', // Commercio al dettaglio
    
    // Trasporti (spesso gestione separata)
    '49': 'gestione_separata', // Trasporto terrestre
    '50': 'gestione_separata', // Trasporto marittimo
    '51': 'gestione_separata', // Trasporto aereo
    '52': 'gestione_separata', // Magazzinaggio
    '53': 'gestione_separata', // Servizi postali
    
    // Servizi professionali (gestione separata)
    '58': 'gestione_separata', // Attività editoriali
    '59': 'gestione_separata', // Produzione cinematografica
    '60': 'gestione_separata', // Attività di programmazione radio-TV
    '61': 'gestione_separata', // Telecomunicazioni
    '62': 'gestione_separata', // Produzione software
    '63': 'gestione_separata', // Servizi informazione
    '68': 'gestione_separata', // Attività immobiliari
    '70': 'gestione_separata', // Attività direzione aziendale
    '71': 'gestione_separata', // Attività degli studi di architettura/ingegneria (se no cassa)
    '72': 'gestione_separata', // Ricerca e sviluppo
    '73': 'gestione_separata', // Pubblicità e ricerche di mercato
    '74': 'gestione_separata', // Altre attività professionali
    '77': 'gestione_separata', // Attività di noleggio
    '78': 'gestione_separata', // Attività di ricerca del personale
    '79': 'gestione_separata', // Attività agenzie viaggio
    '80': 'gestione_separata', // Servizi di vigilanza
    '81': 'gestione_separata', // Servizi per edifici e paesaggio
    '82': 'gestione_separata', // Attività di supporto per le imprese
    
    // Servizi alla persona (spesso gestione separata)
    '85': 'gestione_separata', // Istruzione 
    '90': 'gestione_separata', // Attività creative, artistiche
    '91': 'gestione_separata', // Attività biblioteche/musei
    '92': 'gestione_separata', // Attività di scommesse e giochi
    '93': 'gestione_separata', // Attività sportive/intrattenimento
    '95': 'gestione_separata', // Riparazione computer
    '96': 'gestione_separata', // Altre attività di servizi per la persona
  };
  
  // Cerca corrispondenza
  if (mappaGestioni[codice]) {
    return mappaGestioni[codice];
  }
  
  // Default: gestione separata per la maggior parte dei liberi professionisti
  return 'gestione_separata';
}

// Funzione per calcolare contributi INPS in base alla gestione
function calcolaContributiInps(
  imponibile: number, 
  gestione: string, 
  regimeFiscale: string
): { inps: number; inail: number; dettaglio: string[] } {
  
  const dettaglio: string[] = [];
  let contributiInps = 0;
  let contributiInail = 0;
  
  const isForfettario = regimeFiscale === 'forfettario';
  
  switch (gestione) {
    case 'gestione_separata':
      // Gestione Separata INPS (collaboratori, consulenti, professionisti)
      if (isForfettario) {
        contributiInps = imponibile * 0.24; // 24% forfettario
        dettaglio.push(`INPS Gestione Separata (forfettario): €${imponibile.toLocaleString()} × 24% = €${contributiInps.toLocaleString()}`);
      } else {
        contributiInps = imponibile * 0.2598; // 25.98% ordinario
        dettaglio.push(`INPS Gestione Separata: €${imponibile.toLocaleString()} × 25.98% = €${contributiInps.toLocaleString()}`);
      }
      
      // INAIL per gestione separata (solo alcune attività)
      contributiInail = imponibile * 0.007; // 0.7% circa
      dettaglio.push(`INAIL Gestione Separata: €${imponibile.toLocaleString()} × 0.7% = €${contributiInail.toLocaleString()}`);
      break;
      
    case 'artigiani_commercianti':
      // Gestione Artigiani e Commercianti
      if (isForfettario) {
        contributiInps = imponibile * 0.2179; // 20% + 1.79% forfettario ridotto
        dettaglio.push(`INPS Artigiani/Commercianti (forfettario): €${imponibile.toLocaleString()} × 21.79% = €${contributiInps.toLocaleString()}`);
      } else {
        contributiInps = imponibile * 0.2379; // 20% + 3.79% ordinario
        dettaglio.push(`INPS Artigiani/Commercianti: €${imponibile.toLocaleString()} × 23.79% = €${contributiInps.toLocaleString()}`);
      }
      
      // INAIL per artigiani/commercianti
      contributiInail = imponibile * 0.0175; // 1.75%
      dettaglio.push(`INAIL Artigiani/Commercianti: €${imponibile.toLocaleString()} × 1.75% = €${contributiInail.toLocaleString()}`);
      break;
      
    case 'dipendenti':
      // Gestione Lavoratori Dipendenti (per chi ha anche contratto subordinato)
      // Contributi ridotti in quanto già versa come dipendente
      if (isForfettario) {
        contributiInps = imponibile * 0.10; // 10% ridotto
        dettaglio.push(`INPS Dipendenti (forfettario): €${imponibile.toLocaleString()} × 10% = €${contributiInps.toLocaleString()}`);
      } else {
        contributiInps = imponibile * 0.12; // 12% ridotto
        dettaglio.push(`INPS Dipendenti: €${imponibile.toLocaleString()} × 12% = €${contributiInps.toLocaleString()}`);
      }
      
      // INAIL coperto dal datore di lavoro per dipendenti
      contributiInail = 0;
      dettaglio.push(`INAIL: €0 (coperto dal datore di lavoro)`);
      break;
      
    case 'autonoma_agricola':
      // Gestione Autonoma Agricola
      if (isForfettario) {
        contributiInps = imponibile * 0.20; // 20% forfettario
        dettaglio.push(`INPS Autonoma Agricola (forfettario): €${imponibile.toLocaleString()} × 20% = €${contributiInps.toLocaleString()}`);
      } else {
        contributiInps = imponibile * 0.22; // 22% ordinario
        dettaglio.push(`INPS Autonoma Agricola: €${imponibile.toLocaleString()} × 22% = €${contributiInps.toLocaleString()}`);
      }
      
      // INAIL agricolo
      contributiInail = imponibile * 0.015; // 1.5%
      dettaglio.push(`INAIL Agricolo: €${imponibile.toLocaleString()} × 1.5% = €${contributiInail.toLocaleString()}`);
      break;
      
    default:
      // Fallback a gestione separata
      contributiInps = imponibile * (isForfettario ? 0.24 : 0.2598);
      contributiInail = imponibile * 0.007;
      dettaglio.push(`INPS Gestione Separata (default): €${imponibile.toLocaleString()} × ${isForfettario ? '24%' : '25.98%'} = €${contributiInps.toLocaleString()}`);
      dettaglio.push(`INAIL: €${imponibile.toLocaleString()} × 0.7% = €${contributiInail.toLocaleString()}`);
  }
  
  return { inps: contributiInps, inail: contributiInail, dettaglio };
} 