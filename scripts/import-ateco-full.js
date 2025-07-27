const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Schema CodiceATECO
const CodiceATECOSchema = new mongoose.Schema({
  codice: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descrizione: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  sottocategoria: {
    type: String,
    trim: true
  },
  sezione: {
    type: String,
    trim: true
  },
  divisione: {
    type: String,
    trim: true
  },
  gruppo: {
    type: String,
    trim: true
  },
  classe: {
    type: String,
    trim: true
  },
  attivo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const CodiceATECO = mongoose.model('CodiceATECO', CodiceATECOSchema);

// Funzione per determinare la categoria da una descrizione
function determinaCategoria(descrizione, codice) {
  const desc = descrizione.toLowerCase();
  
  // Mappa categorie basata su keywords
  const mappaCategorie = {
    'Informatica': [
      'software', 'informatica', 'tecnologie dell\'informatica', 'elaborazione elettronica',
      'programmazione', 'sviluppo software', 'sistemi informativi', 'banche dati',
      'telecomunicazioni', 'internet', 'web', 'digitale', 'tecnologie dell\'informazione'
    ],
    'Consulenza': [
      'consulenza', 'advisory', 'studi professionali', 'servizi professionali',
      'consulenza aziendale', 'consulenza gestionale', 'consulenza fiscale', 'consulenza legale',
      'consulenza tecnica', 'servizi di consulenza'
    ],
    'Commercio': [
      'commercio al dettaglio', 'vendita al dettaglio', 'commercio all\'ingrosso',
      'vendita all\'ingrosso', 'negozi', 'punti vendita', 'retail', 'distribuzione commerciale'
    ],
    'E-commerce': [
      'commercio elettronico', 'vendita via internet', 'vendita online', 'e-commerce',
      'commercio via web', 'vendita per corrispondenza'
    ],
    'Manifattura': [
      'fabbricazione', 'produzione', 'manifattura', 'industria manifatturiera',
      'lavorazione', 'trasformazione', 'assemblaggio', 'montaggio'
    ],
    'Edilizia': [
      'costruzione', 'edilizia', 'lavori di costruzione', 'cantieri',
      'opere edili', 'ristrutturazione', 'manutenzione edifici'
    ],
    'Trasporti': [
      'trasporto', 'spedizioni', 'logistica', 'movimentazione', 'consegne',
      'corriere', 'autotrasporto', 'trasporto merci', 'trasporto persone'
    ],
    'Ristorazione': [
      'ristorazione', 'ristoranti', 'bar', 'trattorie', 'pizzerie',
      'catering', 'mense', 'servizi di ristorazione'
    ],
    'Turismo': [
      'turismo', 'alberghi', 'hotel', 'agenzie di viaggio', 'tour operator',
      'strutture ricettive', 'bed and breakfast', 'agriturismo'
    ],
    'Sanità': [
      'sanitarie', 'mediche', 'paramediche', 'assistenza sanitaria',
      'servizi medici', 'cure mediche', 'terapie'
    ],
    'Formazione': [
      'istruzione', 'formazione', 'insegnamento', 'corsi', 'scuole',
      'università', 'formazione professionale', 'educazione'
    ],
    'Servizi Professionali': [
      'servizi professionali', 'attività professionali', 'libere professioni',
      'studi professionali', 'servizi alle imprese'
    ],
    'Arte e Spettacolo': [
      'artistiche', 'spettacolo', 'intrattenimento', 'cinema', 'teatro',
      'musica', 'arte', 'creatività', 'design'
    ],
    'Agricoltura': [
      'agricoltura', 'coltivazione', 'allevamento', 'pesca', 'forestale',
      'produzione agricola', 'attività agricole'
    ],
    'Immobiliare': [
      'immobiliare', 'compravendita immobili', 'locazione immobili',
      'gestione immobiliare', 'amministrazione condominiale'
    ],
    'Finanziario': [
      'finanziarie', 'bancarie', 'assicurazioni', 'credito', 'investimenti',
      'servizi finanziari', 'intermediazione finanziaria'
    ]
  };
  
  // Cerca la categoria più appropriata
  for (const [categoria, keywords] of Object.entries(mappaCategorie)) {
    if (keywords.some(keyword => desc.includes(keyword))) {
      return categoria;
    }
  }
  
  // Fallback basato sul codice ATECO
  const sezioneCode = codice.charAt(0);
  const sezioniMap = {
    'A': 'Agricoltura',
    'B': 'Estrazione',
    'C': 'Manifattura',
    'D': 'Energia',
    'E': 'Servizi Ambientali',
    'F': 'Edilizia',
    'G': 'Commercio',
    'H': 'Trasporti',
    'I': 'Turismo',
    'J': 'Informatica',
    'K': 'Finanziario',
    'L': 'Immobiliare',
    'M': 'Servizi Professionali',
    'N': 'Servizi alle Imprese',
    'O': 'Pubblica Amministrazione',
    'P': 'Formazione',
    'Q': 'Sanità',
    'R': 'Arte e Spettacolo',
    'S': 'Altri Servizi',
    'T': 'Servizi Domestici',
    'U': 'Organizzazioni Internazionali'
  };
  
  return sezioniMap[sezioneCode] || 'Altri Servizi';
}

// Funzione per determinare la sezione, divisione, gruppo, classe
function analizzaCodiceATECO(codice) {
  // Formato codice ATECO: XX.XX.XX (6 cifre con punti)
  const parts = codice.replace(/\./g, '');
  
  if (parts.length >= 2) {
    const sezione = parts.substring(0, 2);
    const divisione = parts.length >= 3 ? parts.substring(0, 3) : null;
    const gruppo = parts.length >= 4 ? parts.substring(0, 4) : null;
    const classe = parts.length >= 6 ? parts.substring(0, 6) : null;
    
    return { sezione, divisione, gruppo, classe };
  }
  
  return { sezione: null, divisione: null, gruppo: null, classe: null };
}

// Funzione per leggere file CSV
function leggiCSV(filePath) {
  const csv = require('csv-parser');
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Funzione per leggere file JSON
function leggiJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

// Funzione per leggere file Excel
function leggiExcel(filePath) {
  const XLSX = require('xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Funzione per leggere file PDF
async function leggiPDF(filePath) {
  const pdfParse = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  
  const data = await pdfParse(buffer);
  const testo = data.text;
  
  // Patterns per trovare codici ATECO nel testo (aggiornati per il formato specifico del PDF)
  const patterns = [
    // Pattern per formato "XX.XX.XXDescrizione" (attaccato)
    /(\d{2}\.\d{2}\.\d{2})([A-Za-z][^\n\r]+)/g,
    // Pattern standard con separatori
    /(\d{2}\.\d{2}\.\d{2})\s*[-–]\s*([^\n\r]+)/g,
    /(\d{2}\.\d{2}\.\d{2})\s+([^\n\r\t]+)/g,
    // Pattern per formato "XXXXXX Descrizione"
    /(\d{6})\s*[-–]?\s*([A-Za-z][^\n\r]+)/g,
    // Pattern con spazi
    /(\d{2}\s+\d{2}\s+\d{2})\s*[-–]?\s*([^\n\r]+)/g
  ];
  
  const codiciTrovati = [];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(testo)) !== null) {
      let codice = match[1];
      const descrizione = match[2].trim();
      
      // Normalizza il codice al formato standard XX.XX.XX
      if (codice.length === 6 && !codice.includes('.')) {
        // Formato 011110 -> 01.11.10
        codice = `${codice.slice(0,2)}.${codice.slice(2,4)}.${codice.slice(4,6)}`;
      } else if (codice.includes(' ')) {
        // Formato "01 11 10" -> "01.11.10"
        codice = codice.replace(/\s+/g, '.');
      }
      
      // Filtra descrizioni troppo corte o che sembrano intestazioni
      if (descrizione.length > 10 && 
          !descrizione.toLowerCase().includes('sezione') &&
          !descrizione.toLowerCase().includes('divisione') &&
          !descrizione.toLowerCase().includes('gruppo') &&
          !descrizione.toLowerCase().includes('classe') &&
          !descrizione.toLowerCase().includes('codice') &&
          !descrizione.toLowerCase().includes('ateco')) {
        
        codiciTrovati.push({
          codice: codice,
          descrizione: descrizione
        });
      }
    }
  }
  
  // Rimuovi duplicati basandosi sul codice
  const codiciUnici = [];
  const codiciVisti = new Set();
  
  for (const item of codiciTrovati) {
    if (!codiciVisti.has(item.codice)) {
      codiciVisti.add(item.codice);
      codiciUnici.push(item);
    }
  }
  
  console.log(`📄 Estratti ${codiciUnici.length} codici ATECO dal PDF`);
  
  if (codiciUnici.length === 0) {
    console.log('⚠️ Testo PDF estratto (primi 500 caratteri):');
    console.log(testo.substring(0, 500));
    console.log('\n💡 Prova a convertire il PDF in CSV o Excel per risultati migliori');
  }
  
  return codiciUnici;
}

// Funzione principale per processare i dati
function processaDati(rawData, formato) {
  const codiciProcessati = [];
  
  for (const row of rawData) {
    try {
      let codice, descrizione;
      
      // Determina le colonne in base al formato e ai nomi
      if (formato === 'pdf') {
        // I dati dal PDF hanno già la struttura corretta
        codice = row.codice;
        descrizione = row.descrizione;
      } else if (formato === 'standard') {
        // Prova diverse combinazioni di nomi colonna
        codice = row.codice || row.Codice || row.CODICE || 
                row.code || row.Code || row.CODE ||
                row['Codice ATECO'] || row['ATECO'] ||
                Object.values(row)[0]; // Prima colonna come fallback
                
        descrizione = row.descrizione || row.Descrizione || row.DESCRIZIONE ||
                     row.description || row.Description || row.DESCRIPTION ||
                     row['Descrizione attività'] || row['Attività'] ||
                     Object.values(row)[1]; // Seconda colonna come fallback
      }
      
      if (!codice || !descrizione) {
        console.warn('Riga saltata - dati mancanti:', row);
        continue;
      }
      
      // Pulisci e normalizza il codice
      codice = codice.toString().trim();
      descrizione = descrizione.toString().trim();
      
      // Determina categoria e struttura
      const categoria = determinaCategoria(descrizione, codice);
      const { sezione, divisione, gruppo, classe } = analizzaCodiceATECO(codice);
      
      codiciProcessati.push({
        codice,
        descrizione,
        categoria,
        sezione,
        divisione,
        gruppo,
        classe,
        attivo: true
      });
      
    } catch (error) {
      console.warn('Errore processando riga:', row, error.message);
    }
  }
  
  return codiciProcessati;
}

// Funzione principale di importazione
async function importaCodiciATECO(filePath, options = {}) {
  try {
    console.log('🚀 Inizio importazione codici ATECO da:', filePath);
    
    // Connetti al database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ivalytics';
    console.log('📡 Connessione a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connesso a MongoDB');
    
    // Determina il formato del file
    const ext = path.extname(filePath).toLowerCase();
    let rawData;
    
    console.log('📖 Lettura file...');
    switch (ext) {
      case '.csv':
        rawData = await leggiCSV(filePath);
        break;
      case '.json':
        rawData = leggiJSON(filePath);
        break;
      case '.xlsx':
      case '.xls':
        rawData = leggiExcel(filePath);
        break;
      case '.pdf':
        rawData = await leggiPDF(filePath);
        break;
      default:
        throw new Error(`Formato file non supportato: ${ext}. Formati supportati: .csv, .json, .xlsx, .xls, .pdf`);
    }
    
    console.log(`📊 Trovati ${rawData.length} record nel file`);
    
    // Processa i dati
    console.log('⚙️ Processamento dati...');
    const formato = ext === '.pdf' ? 'pdf' : 'standard';
    const codiciProcessati = processaDati(rawData, formato);
    console.log(`✅ Processati ${codiciProcessati.length} codici ATECO validi`);
    
    if (codiciProcessati.length === 0) {
      throw new Error('Nessun codice ATECO valido trovato nel file');
    }
    
    // Pulisci il database se richiesto
    if (options.pulisci !== false) {
      console.log('🧹 Pulizia database esistente...');
      await CodiceATECO.deleteMany({});
    }
    
    // Inserisci i dati in batch per migliorare le performance
    console.log('💾 Inserimento dati nel database...');
    const batchSize = 100;
    let inseriti = 0;
    
    for (let i = 0; i < codiciProcessati.length; i += batchSize) {
      const batch = codiciProcessati.slice(i, i + batchSize);
      try {
        await CodiceATECO.insertMany(batch, { ordered: false });
        inseriti += batch.length;
        console.log(`📈 Inseriti ${inseriti}/${codiciProcessati.length} codici...`);
      } catch (error) {
        // Gestisci duplicati e altri errori di inserimento
        console.warn(`⚠️ Alcuni record del batch ${i}-${i+batchSize} hanno errori:`, error.message);
        inseriti += batch.length; // Approssimazione
      }
    }
    
    // Statistiche finali
    const totaleInserito = await CodiceATECO.countDocuments();
    console.log(`✅ Importazione completata! ${totaleInserito} codici ATECO nel database`);
    
    // Mostra statistiche per categoria
    const stats = await CodiceATECO.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 15
      }
    ]);
    
    console.log('\n📊 Top 15 categorie:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} codici`);
    });
    
    return { 
      success: true, 
      inseriti: totaleInserito,
      stats 
    };
    
  } catch (error) {
    console.error('❌ Errore durante l\'importazione:', error);
    return { 
      success: false, 
      error: error.message 
    };
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnesso da MongoDB');
  }
}

// Comando CLI
if (require.main === module) {
  const filePath = process.argv[2];
  const pulisci = process.argv[3] !== '--no-clean';
  
  if (!filePath) {
    console.log(`
Uso: node import-ateco-full.js <file-path> [--no-clean]

 Formati supportati:
   - CSV (.csv)
   - JSON (.json) 
   - Excel (.xlsx, .xls)
   - PDF (.pdf) - estrazione automatica del testo
 
 Esempi:
   node import-ateco-full.js data/ateco-2025.pdf
   node import-ateco-full.js ateco2025.csv
   node import-ateco-full.js codici-ateco.xlsx --no-clean
  
Il file dovrebbe avere colonne come:
  - codice/Codice/CODICE
  - descrizione/Descrizione/DESCRIZIONE
    `);
    process.exit(1);
  }
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File non trovato: ${filePath}`);
    process.exit(1);
  }
  
  importaCodiciATECO(filePath, { pulisci })
    .then(result => {
      if (result.success) {
        console.log('🎉 Importazione completata con successo!');
        process.exit(0);
      } else {
        console.error('❌ Importazione fallita:', result.error);
        process.exit(1);
      }
    });
}

module.exports = { importaCodiciATECO, CodiceATECO }; 