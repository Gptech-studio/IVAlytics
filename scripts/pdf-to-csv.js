const fs = require('fs');
const path = require('path');

// Script per convertire PDF ATECO in CSV
async function convertPDFToCSV(pdfPath, csvPath) {
  try {
    console.log('🔄 Conversione PDF in CSV...');
    
    // Usa la stessa logica di estrazione del PDF dall'altro script
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(pdfPath);
    
    const data = await pdfParse(buffer);
    const testo = data.text;
    
    console.log('📄 Estrazione testo dal PDF...');
    
    // Patterns per trovare codici ATECO (aggiornati per il formato specifico del PDF)
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
        
        // Normalizza codice
        if (codice.length === 6 && !codice.includes('.')) {
          codice = `${codice.slice(0,2)}.${codice.slice(2,4)}.${codice.slice(4,6)}`;
        } else if (codice.includes(' ')) {
          codice = codice.replace(/\s+/g, '.');
        }
        
        // Filtra descrizioni valide
        if (descrizione.length > 10 && 
            !descrizione.toLowerCase().includes('sezione') &&
            !descrizione.toLowerCase().includes('divisione') &&
            !descrizione.toLowerCase().includes('gruppo') &&
            !descrizione.toLowerCase().includes('classe') &&
            !descrizione.toLowerCase().includes('codice') &&
            !descrizione.toLowerCase().includes('ateco')) {
          
          codiciTrovati.push({ codice, descrizione });
        }
      }
    }
    
    // Rimuovi duplicati
    const codiciUnici = [];
    const codiciVisti = new Set();
    
    for (const item of codiciTrovati) {
      if (!codiciVisti.has(item.codice)) {
        codiciVisti.add(item.codice);
        codiciUnici.push(item);
      }
    }
    
    console.log(`✅ Trovati ${codiciUnici.length} codici ATECO unici`);
    
    if (codiciUnici.length === 0) {
      console.log('❌ Nessun codice ATECO trovato nel PDF');
      console.log('📄 Primi 1000 caratteri del testo estratto:');
      console.log(testo.substring(0, 1000));
      return false;
    }
    
    // Crea CSV
    let csvContent = 'Codice,Descrizione\n';
    
    for (const item of codiciUnici) {
      // Escape virgole e virgolette nella descrizione
      let descrizioneCSV = item.descrizione.replace(/"/g, '""');
      if (descrizioneCSV.includes(',')) {
        descrizioneCSV = `"${descrizioneCSV}"`;
      }
      
      csvContent += `${item.codice},${descrizioneCSV}\n`;
    }
    
    // Salva file CSV
    fs.writeFileSync(csvPath, csvContent, 'utf8');
    
    console.log(`✅ File CSV creato: ${csvPath}`);
    console.log(`📊 ${codiciUnici.length} codici ATECO salvati`);
    
    // Mostra alcuni esempi
    console.log('\n📋 Primi 5 codici estratti:');
    codiciUnici.slice(0, 5).forEach(item => {
      console.log(`  ${item.codice} - ${item.descrizione.substring(0, 60)}...`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Errore durante la conversione:', error);
    return false;
  }
}

// Comando CLI
if (require.main === module) {
  const pdfPath = process.argv[2];
  const csvPath = process.argv[3] || pdfPath.replace('.pdf', '.csv');
  
  if (!pdfPath || !pdfPath.endsWith('.pdf')) {
    console.log(`
Uso: node pdf-to-csv.js <file.pdf> [output.csv]

Converte un PDF con codici ATECO in formato CSV.

Esempi:
  node pdf-to-csv.js data/ateco-2025.pdf
  node pdf-to-csv.js data/ateco-2025.pdf data/ateco-2025.csv
    `);
    process.exit(1);
  }
  
  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ File PDF non trovato: ${pdfPath}`);
    process.exit(1);
  }
  
  convertPDFToCSV(pdfPath, csvPath)
    .then(success => {
      if (success) {
        console.log('\n🎉 Conversione completata!');
        console.log(`💡 Ora puoi importare il CSV con:`);
        console.log(`   node import-ateco-full.js ${csvPath}`);
        process.exit(0);
      } else {
        console.log('\n❌ Conversione fallita. Prova a convertire manualmente il PDF in CSV.');
        process.exit(1);
      }
    });
}

module.exports = { convertPDFToCSV }; 