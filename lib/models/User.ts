import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@/types';

export interface UserDocument extends Omit<User, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cognome: {
    type: String,
    required: true,
    trim: true
  },
  codiceFiscale: {
    type: String,
    sparse: true,
    uppercase: true,
    trim: true
  },
  partitaIva: {
    type: String,
    sparse: true,
    trim: true
  },
  dataRegistrazione: {
    type: Date,
    default: Date.now
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

// Indici per performance
UserSchema.index({ email: 1 });
UserSchema.index({ codiceFiscale: 1 });
UserSchema.index({ partitaIva: 1 });

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema); 