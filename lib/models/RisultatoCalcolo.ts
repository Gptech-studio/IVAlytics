import mongoose, { Schema, Document } from 'mongoose';
import { RisultatoCalcolo } from '@/types';

export interface RisultatoCalcoloDocument extends Omit<RisultatoCalcolo, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ScadenzaSchema = new Schema({
  tipo: {
    type: String,
    enum: ['iva', 'irpef', 'ires', 'irap', 'contributi', 'dichiarazione'],
    required: true
  },
  descrizione: {
    type: String,
    required: true
  },
  dataScadenza: {
    type: Date,
    required: true
  },
  importo: {
    type: Number,
    required: true
  },
  pagato: {
    type: Boolean,
    default: false
  },
  note: String
});

const RisultatoCalcoloSchema = new Schema<RisultatoCalcoloDocument>({
  userId: {
    type: String,
    required: true
  },
  dataCalcolo: {
    type: Date,
    default: Date.now
  },
  parametri: {
    periodoRiferimento: {
      dataInizio: { type: Date, required: true },
      dataFine: { type: Date, required: true }
    },
    ricavi: { type: Number, required: true },
    costi: { type: Number, required: true },
    costiDeducibili: { type: Number, required: true },
    aliquoteSpeciali: {
      iva: Number,
      irpef: Number,
      addizionali: {
        regionale: Number,
        comunale: Number
      }
    },
    detrazioni: {
      lavoro: Number,
      famiglia: Number,
      ristrutturazioni: Number,
      altre: Number
    }
  },
  contribuente: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  // Risultati
  imponibile: { type: Number, required: true },
  
  iva: {
    debito: { type: Number, required: true },
    credito: { type: Number, required: true },
    saldo: { type: Number, required: true },
    aliquota: { type: Number, required: true }
  },
  
  irpef: {
    imponibile: Number,
    imposta: Number,
    aliquota: Number,
    detrazioni: Number,
    addizionali: {
      regionale: Number,
      comunale: Number
    }
  },
  
  ires: {
    imponibile: Number,
    imposta: Number,
    aliquota: Number
  },
  
  irap: {
    imponibile: Number,
    imposta: Number,
    aliquota: Number
  },
  
  contributi: {
    inps: { type: Number, required: true },
    inail: { type: Number, required: true },
    totale: { type: Number, required: true }
  },
  
  totaleImposte: { type: Number, required: true },
  totaleContributi: { type: Number, required: true },
  totaleDovuto: { type: Number, required: true },
  
  scadenze: [ScadenzaSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      (ret as any).id = ret._id;
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indici per performance
RisultatoCalcoloSchema.index({ userId: 1 });
RisultatoCalcoloSchema.index({ dataCalcolo: -1 });
RisultatoCalcoloSchema.index({ 'parametri.periodoRiferimento.dataInizio': 1 });

export default mongoose.models.RisultatoCalcolo || mongoose.model<RisultatoCalcoloDocument>('RisultatoCalcolo', RisultatoCalcoloSchema); 