import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import CodiceATECO from '@/lib/models/CodiceATECO';

interface RispostaQuestionario {
  tipo_attivita?: string;
  clienti_target?: string;
  dove_lavori?: string;
  settore_specifico?: string;
}

interface SuggerimentoATECO {
  codice: string;
  descrizione: string;
  categoria: string;
  score: number;
  motivo: string;
}

// POST - Genera suggerimenti ATECO basati sul questionario
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const risposte: RispostaQuestionario = body.risposte;
    
    if (!risposte || Object.keys(risposte).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nessuna risposta fornita' },
        { status: 400 }
      );
    }
    
    // Carica tutti i codici ATECO attivi
    const tuttiCodici = await CodiceATECO.find({ attivo: true });
    
    // Genera suggerimenti basati sulle risposte
    const suggerimenti = generaSuggerimenti(risposte, tuttiCodici);
    
    // Ordina per score decrescente e prendi i primi 8
    const miglioriSuggerimenti = suggerimenti
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    
    return NextResponse.json({
      success: true,
      data: miglioriSuggerimenti,
      count: miglioriSuggerimenti.length
    });
    
  } catch (error) {
    console.error('Errore generazione suggerimenti:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

function generaSuggerimenti(risposte: RispostaQuestionario, codici: any[]): SuggerimentoATECO[] {
  const suggerimenti: SuggerimentoATECO[] = [];
  
  // Mappa avanzata delle corrispondenze con più dettagli e keyword semantiche
  const mappaCorrispondenze = {
    // Tipo attività con keyword semantiche più ampie
    'Consulenza e servizi professionali': {
      categorie: ['Consulenza', 'Servizi professionali', 'Professioni'],
      codici: ['69.20.30', '62.02.00', '70.22.00', '71.11.00', '71.12.10'],
      keywords: ['consulenza', 'advisory', 'servizi professionali', 'expertise', 'consulente', 'professionale'],
      weight: 50
    },
    'Commercio e vendita': {
      categorie: ['E-commerce', 'Commercio', 'Vendita', 'Retail'],
      codici: ['47.91.10', '47.19.10', '46.90.00', '47.11.00', '47.52.10'],
      keywords: ['commercio', 'vendita', 'negozio', 'retail', 'shop', 'store', 'dettaglio', 'ingrosso'],
      weight: 50
    },
    'Tecnologia e informatica': {
      categorie: ['Informatica', 'Software', 'Tecnologia', 'IT'],
      codici: ['62.01.00', '62.02.00', '63.11.00', '58.21.00', '62.09.00'],
      keywords: ['software', 'informatica', 'tecnologia', 'sviluppo', 'programming', 'web', 'app', 'digitale', 'it'],
      weight: 50
    },
    'Produzione e manifattura': {
      categorie: ['Manifattura', 'Produzione', 'Industria', 'Fabbricazione'],
      codici: ['25.99.00', '32.99.00', '13.10.00', '15.20.00', '23.70.00'],
      keywords: ['produzione', 'manifattura', 'fabbricazione', 'industriale', 'laboratorio', 'industria'],
      weight: 50
    },
    'Ristorazione e turismo': {
      categorie: ['Ristorazione', 'Turismo', 'Hospitality', 'Alimentare'],
      codici: ['56.10.11', '56.30.00', '79.11.00', '55.10.00', '56.21.00'],
      keywords: ['ristorante', 'bar', 'catering', 'turismo', 'hotel', 'alimentare', 'cucina', 'hospitality'],
      weight: 50
    },
    'Educazione e formazione': {
      categorie: ['Formazione', 'Educazione', 'Insegnamento', 'Training'],
      codici: ['85.59.20', '85.51.00', '85.52.00', '85.32.00', '85.60.00'],
      keywords: ['formazione', 'educazione', 'corso', 'insegnamento', 'training', 'scuola', 'didattica'],
      weight: 50
    },
    'Edilizia e costruzioni': {
      categorie: ['Edilizia', 'Costruzioni', 'Architettura', 'Ingegneria'],
      codici: ['41.20.00', '43.21.00', '71.11.00', '43.32.00', '42.99.00'],
      keywords: ['edilizia', 'costruzioni', 'cantiere', 'architettura', 'ingegneria', 'immobiliare'],
      weight: 50
    },
    'Sanità e benessere': {
      categorie: ['Sanità', 'Benessere', 'Salute', 'Medicina', 'Wellness'],
      codici: ['86.90.29', '96.04.10', '96.09.02', '86.21.00', '96.09.09'],
      keywords: ['salute', 'benessere', 'medicina', 'terapia', 'cura', 'wellness', 'sanitario'],
      weight: 50
    },
    'Arte e intrattenimento': {
      categorie: ['Arte', 'Intrattenimento', 'Creatività', 'Spettacolo', 'Design'],
      codici: ['90.03.02', '58.11.00', '74.10.10', '74.20.11', '90.01.01'],
      keywords: ['arte', 'design', 'creatività', 'spettacolo', 'entertainment', 'grafica', 'artista'],
      weight: 50
    },
    'Trasporti e logistica': {
      categorie: ['Trasporti', 'Logistica', 'Spedizioni', 'Mobilità'],
      codici: ['49.20.00', '52.29.10', '53.10.00', '49.41.00', '52.10.00'],
      keywords: ['trasporti', 'logistica', 'spedizioni', 'corriere', 'mobilità', 'shipping'],
      weight: 50
    }
  };

  // Mappa dettagliata per clienti target
  const mappaClienti = {
    'Aziende e imprese': {
      keywords: ['consulenza', 'servizi alle imprese', 'b2b', 'business', 'aziende', 'imprese', 'societÃ '],
      categories: ['Consulenza', 'Informatica', 'Servizi professionali'],
      bonus: 25
    },
    'Privati cittadini': {
      keywords: ['al dettaglio', 'consumatori', 'privati', 'clienti', 'b2c', 'retail', 'vendita diretta'],
      categories: ['E-commerce', 'Commercio', 'Benessere', 'Formazione'],
      bonus: 25
    },
    'Enti pubblici': {
      keywords: ['pubblica amministrazione', 'enti pubblici', 'pa', 'pubblico', 'comunale', 'statale'],
      categories: ['Consulenza', 'Edilizia', 'Ingegneria'],
      bonus: 20
    },
    'Misto (privati e aziende)': {
      keywords: ['misto', 'versatile', 'consulenza', 'servizi'],
      categories: ['Consulenza', 'Formazione', 'Informatica'],
      bonus: 15
    }
  };

  // Mappa per luogo di lavoro
  const mappaLuoghi = {
    'Online/da remoto': {
      keywords: ['internet', 'software', 'online', 'digitale', 'web', 'remoto', 'telematico'],
      categories: ['Informatica', 'E-commerce', 'Consulenza'],
      bonus: 20
    },
    'In un negozio/locale': {
      keywords: ['commercio', 'negozio', 'vendita', 'retail', 'locale', 'punto vendita'],
      categories: ['Commercio', 'E-commerce', 'Ristorazione'],
      bonus: 20
    },
    'Presso i clienti': {
      keywords: ['consulenza', 'servizi', 'domicilio', 'cliente', 'mobile'],
      categories: ['Consulenza', 'Benessere', 'Edilizia'],
      bonus: 15
    },
    'Nel mio ufficio/studio': {
      keywords: ['professionale', 'studio', 'ufficio', 'consulenza'],
      categories: ['Consulenza', 'Servizi professionali', 'Formazione'],
      bonus: 15
    },
    'All\'aperto/cantieri': {
      keywords: ['cantiere', 'esterno', 'aperto', 'costruzioni', 'edilizia'],
      categories: ['Edilizia', 'Costruzioni', 'Ingegneria'],
      bonus: 20
    }
  };
  
  // Valuta ogni codice ATECO con algoritmo migliorato
  for (const codice of codici) {
    let score = 0;
    let motivi: string[] = [];
    let prioritÃ  = 0; // Per gestire l'ordinamento in caso di parità
    
    const descrizioneLC = codice.descrizione.toLowerCase();
    const categoriaLC = codice.categoria.toLowerCase();
    
    // 1. Controllo per tipo di attività (peso maggiore)
    if (risposte.tipo_attivita) {
      const corrispondenza = mappaCorrispondenze[risposte.tipo_attivita as keyof typeof mappaCorrispondenze];
      if (corrispondenza) {
        // Check match diretto del codice (priorità massima)
        if (corrispondenza.codici.includes(codice.codice)) {
          score += corrispondenza.weight * 1.8;
          motivi.push(`✅ Match perfetto per ${risposte.tipo_attivita}`);
          prioritÃ  += 10;
        }
        
        // Check categoria
        else if (corrispondenza.categorie.some(cat => 
          categoriaLC.includes(cat.toLowerCase())
        )) {
          score += corrispondenza.weight * 1.2;
          motivi.push(`🎯 Categoria corrispondente: ${risposte.tipo_attivita}`);
          prioritÃ  += 7;
        }
        
        // Check keywords semantiche nella descrizione
        const keywordMatches = corrispondenza.keywords.filter(keyword => 
          descrizioneLC.includes(keyword.toLowerCase())
        ).length;
        
        if (keywordMatches > 0) {
          score += (keywordMatches * 15) + (corrispondenza.weight * 0.8);
          motivi.push(`🔍 ${keywordMatches} keyword corrispondenti (${risposte.tipo_attivita})`);
          prioritÃ  += keywordMatches * 2;
        }
      }
    }
    
    // 2. Bonus per clienti target
    if (risposte.clienti_target) {
      const clienteInfo = mappaClienti[risposte.clienti_target as keyof typeof mappaClienti];
      if (clienteInfo) {
        // Check keywords specifiche
        const keywordMatches = clienteInfo.keywords.filter(keyword => 
          descrizioneLC.includes(keyword.toLowerCase())
        ).length;
        
        if (keywordMatches > 0) {
          score += clienteInfo.bonus + (keywordMatches * 8);
          motivi.push(`👥 Adatto a ${risposte.clienti_target.toLowerCase()}`);
          prioritÃ  += 3;
        }
        
        // Check categoria target
        if (clienteInfo.categories.some(cat => 
          categoriaLC.includes(cat.toLowerCase())
        )) {
          score += clienteInfo.bonus * 0.7;
          motivi.push(`📊 Categoria B2B/B2C appropriata`);
          prioritÃ  += 2;
        }
      }
    }
    
    // 3. Bonus per luogo di lavoro
    if (risposte.dove_lavori) {
      const luogoInfo = mappaLuoghi[risposte.dove_lavori as keyof typeof mappaLuoghi];
      if (luogoInfo) {
        // Check keywords del luogo
        const keywordMatches = luogoInfo.keywords.filter(keyword => 
          descrizioneLC.includes(keyword.toLowerCase())
        ).length;
        
        if (keywordMatches > 0) {
          score += luogoInfo.bonus + (keywordMatches * 5);
          motivi.push(`📍 Compatibile con lavoro ${risposte.dove_lavori.toLowerCase()}`);
          prioritÃ  += 1;
        }
        
        // Check categoria per luogo
        if (luogoInfo.categories.some(cat => 
          categoriaLC.includes(cat.toLowerCase())
        )) {
          score += luogoInfo.bonus * 0.6;
          prioritÃ  += 1;
        }
      }
    }
    
    // 4. Bonus aggiuntivi per migliorare la precisione
    
    // Bonus per codici molto specifici (descrizioni lunghe = più specifici)
    if (codice.descrizione.length > 60) {
      score += 5;
      prioritÃ  += 1;
    }
    
    // Bonus per categorie popolari/comuni
    const categorieComuni = ['Informatica', 'Consulenza', 'Commercio', 'Formazione'];
    if (categorieComuni.some(cat => categoriaLC.includes(cat.toLowerCase()))) {
      score += 3;
    }
    
    // Bonus per codici con sottocategoria (più dettagliati)
    if (codice.sottocategoria && codice.sottocategoria.length > 0) {
      score += 2;
    }
    
    // 5. Aggiungi suggerimento se ha uno score significativo
    if (score >= 10) { // Soglia minima più alta per qualità
      // Normalizza il punteggio e aggiungi variabilità basata sulla priorità
      const finalScore = Math.min(Math.round(score + (prioritÃ  * 2)), 98);
      
      suggerimenti.push({
        codice: codice.codice,
        descrizione: codice.descrizione,
        categoria: codice.categoria,
        score: finalScore,
        motivo: motivi.length > 0 ? motivi.join(' • ') : 'Corrispondenza generica'
      });
    }
  }
  
  return suggerimenti;
} 