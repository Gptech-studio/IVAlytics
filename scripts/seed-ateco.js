const mongoose = require('mongoose');

// Schema CodiceATECO (replicato per lo script)
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
  attivo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const CodiceATECO = mongoose.model('CodiceATECO', CodiceATECOSchema);

// Dati di esempio
const codiciATECO = [
  // Informatica e Tecnologia
  {
    codice: '62.01.00',
    descrizione: 'Produzione di software non connesso all\'edizione',
    categoria: 'Informatica',
    sottocategoria: 'Software Development'
  },
  {
    codice: '62.02.00',
    descrizione: 'Consulenza nel settore delle tecnologie dell\'informatica',
    categoria: 'Informatica',
    sottocategoria: 'Consulenza IT'
  },
  {
    codice: '63.11.00',
    descrizione: 'Elaborazione elettronica di dati',
    categoria: 'Informatica',
    sottocategoria: 'Data Processing'
  },
  
  // Consulenza
  {
    codice: '69.20.30',
    descrizione: 'Attività di consulenza per la gestione dei tributi',
    categoria: 'Consulenza',
    sottocategoria: 'Consulenza Fiscale'
  },
  {
    codice: '70.22.00',
    descrizione: 'Consulenza imprenditoriale e altra consulenza amministrativo-gestionale',
    categoria: 'Consulenza',
    sottocategoria: 'Business Consulting'
  },
  {
    codice: '71.11.00',
    descrizione: 'Attività degli studi di architettura',
    categoria: 'Consulenza',
    sottocategoria: 'Architettura'
  },
  
  // E-commerce e Commercio
  {
    codice: '47.91.10',
    descrizione: 'Commercio al dettaglio di qualsiasi tipo di prodotto via internet',
    categoria: 'E-commerce',
    sottocategoria: 'Vendita Online'
  },
  {
    codice: '47.19.10',
    descrizione: 'Grandi magazzini',
    categoria: 'Commercio',
    sottocategoria: 'Retail'
  },
  {
    codice: '46.90.00',
    descrizione: 'Commercio all\'ingrosso non specializzato',
    categoria: 'Commercio',
    sottocategoria: 'Ingrosso'
  },
  
  // Formazione ed Educazione
  {
    codice: '85.59.20',
    descrizione: 'Corsi di formazione e corsi di aggiornamento professionale',
    categoria: 'Formazione',
    sottocategoria: 'Formazione Professionale'
  },
  {
    codice: '85.51.00',
    descrizione: 'Formazione culturale',
    categoria: 'Formazione',
    sottocategoria: 'Educazione Culturale'
  },
  {
    codice: '85.52.00',
    descrizione: 'Formazione tecnica superiore',
    categoria: 'Formazione',
    sottocategoria: 'Formazione Tecnica'
  },
  
  // Design e Arte
  {
    codice: '74.10.10',
    descrizione: 'Attività di design di moda e design industriale',
    categoria: 'Design',
    sottocategoria: 'Design Industriale'
  },
  {
    codice: '90.03.02',
    descrizione: 'Attività di artisti figurativi',
    categoria: 'Arte',
    sottocategoria: 'Arte Figurativa'
  },
  {
    codice: '58.11.00',
    descrizione: 'Edizione di libri',
    categoria: 'Arte',
    sottocategoria: 'Editoria'
  },
  
  // Edilizia e Costruzioni
  {
    codice: '41.20.00',
    descrizione: 'Costruzione di edifici residenziali e non residenziali',
    categoria: 'Edilizia',
    sottocategoria: 'Costruzioni'
  },
  {
    codice: '43.21.00',
    descrizione: 'Installazione di impianti elettrici',
    categoria: 'Edilizia',
    sottocategoria: 'Impianti Elettrici'
  },
  {
    codice: '43.22.00',
    descrizione: 'Installazione di impianti idraulici, di riscaldamento e di condizionamento',
    categoria: 'Edilizia',
    sottocategoria: 'Impianti Termoidraulici'
  },
  
  // Ristorazione e Turismo
  {
    codice: '56.10.11',
    descrizione: 'Ristorazione con somministrazione',
    categoria: 'Ristorazione',
    sottocategoria: 'Ristoranti'
  },
  {
    codice: '56.30.00',
    descrizione: 'Bar e altri esercizi simili senza cucina',
    categoria: 'Ristorazione',
    sottocategoria: 'Bar'
  },
  {
    codice: '79.11.00',
    descrizione: 'Attività delle agenzie di viaggio',
    categoria: 'Turismo',
    sottocategoria: 'Agenzie Viaggio'
  },
  
  // Sanità e Benessere
  {
    codice: '86.90.29',
    descrizione: 'Altre attività paramediche',
    categoria: 'Sanità',
    sottocategoria: 'Attività Paramediche'
  },
  {
    codice: '96.04.10',
    descrizione: 'Centri per il benessere fisico (esclusi quelli con fini terapeutici)',
    categoria: 'Benessere',
    sottocategoria: 'Centri Benessere'
  },
  {
    codice: '96.09.02',
    descrizione: 'Attività di tatuaggio e piercing',
    categoria: 'Benessere',
    sottocategoria: 'Estetica'
  },
  
  // Trasporti e Logistica
  {
    codice: '49.20.00',
    descrizione: 'Trasporto ferroviario di merci',
    categoria: 'Trasporti',
    sottocategoria: 'Trasporto Ferroviario'
  },
  {
    codice: '52.29.10',
    descrizione: 'Spedizionieri e agenzie di operazioni doganali',
    categoria: 'Logistica',
    sottocategoria: 'Spedizioni'
  },
  {
    codice: '53.10.00',
    descrizione: 'Attività postali con obbligo di servizio universale',
    categoria: 'Logistica',
    sottocategoria: 'Servizi Postali'
  }
];

async function seedDatabase() {
  try {
    // Connetti al database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ivalytics';
    console.log('Connessione a MongoDB:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connesso a MongoDB');
    
    // Pulisci i dati esistenti
    await CodiceATECO.deleteMany({});
    console.log('🧹 Database pulito');
    
    // Inserisci i nuovi dati
    const result = await CodiceATECO.insertMany(codiciATECO);
    console.log(`✅ Inseriti ${result.length} codici ATECO`);
    
    // Mostra statistiche
    const stats = await CodiceATECO.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('\n📊 Statistiche per categoria:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} codici`);
    });
    
    console.log('\n🎉 Seeding completato con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnesso da MongoDB');
  }
}

// Esegui il seeding se lo script viene chiamato direttamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, codiciATECO }; 