import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import CodiceATECO from '@/lib/models/CodiceATECO';

// GET - Ricerca codici ATECO
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const categoria = searchParams.get('categoria');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let filter: any = { attivo: true };
    
    if (query) {
      filter.$or = [
        { codice: { $regex: query, $options: 'i' } },
        { descrizione: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (categoria) {
      filter.categoria = { $regex: categoria, $options: 'i' };
    }
    
    const codici = await CodiceATECO.find(filter)
      .limit(limit)
      .sort({ codice: 1 });
    
    return NextResponse.json({
      success: true,
      data: codici,
      count: codici.length
    });
    
  } catch (error) {
    console.error('Errore ricerca ATECO:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// POST - Crea nuovo codice ATECO (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { codice, descrizione, categoria, sottocategoria } = body;
    
    // Validazione
    if (!codice || !descrizione || !categoria) {
      return NextResponse.json(
        { success: false, error: 'Campi obbligatori mancanti' },
        { status: 400 }
      );
    }
    
    // Verifica se il codice esiste già
    const esistente = await CodiceATECO.findOne({ codice });
    if (esistente) {
      return NextResponse.json(
        { success: false, error: 'Codice ATECO già esistente' },
        { status: 409 }
      );
    }
    
    const nuovoCodice = new CodiceATECO({
      codice,
      descrizione,
      categoria,
      sottocategoria,
      attivo: true
    });
    
    await nuovoCodice.save();
    
    return NextResponse.json({
      success: true,
      data: nuovoCodice
    }, { status: 201 });
    
  } catch (error) {
    console.error('Errore creazione ATECO:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
} 