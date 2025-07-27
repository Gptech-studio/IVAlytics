import mongoose, { Schema, Document } from 'mongoose';
import { CodiceATECO } from '@/types';

export interface CodiceATECODocument extends Omit<CodiceATECO, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const CodiceATECOSchema = new Schema<CodiceATECODocument>({
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
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indici per ricerca e performance
CodiceATECOSchema.index({ codice: 1 });
CodiceATECOSchema.index({ categoria: 1 });
CodiceATECOSchema.index({ descrizione: 'text' });
CodiceATECOSchema.index({ attivo: 1 });

export default mongoose.models.CodiceATECO || mongoose.model<CodiceATECODocument>('CodiceATECO', CodiceATECOSchema); 