import { Schema, model, Document } from 'mongoose';

export interface IInterventionDocument extends Document {
  interventionId: string;
  patientId: string;
  medicationId?: string | null;
  medicationName?: string;
  barrierId: string;
  barrierCategory: string;
  evidence: string[];
  interventionType: string;
  title: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAtIso: string;
  message: {
    en: string;
    hi: string;
  };
  status: 'RECOMMENDED' | 'DELIVERED' | 'ACTIONED' | 'DISMISSED';
  createdAt?: Date;
  updatedAt?: Date;
}

const InterventionSchema = new Schema<IInterventionDocument>(
  {
    interventionId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    medicationId: { type: String, default: null, index: true },
    medicationName: { type: String },
    barrierId: { type: String, required: true, index: true },
    barrierCategory: { type: String, required: true },
    evidence: [{ type: String }],
    interventionType: { type: String, required: true, index: true },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    priority: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    confidence: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    createdAtIso: { type: String, required: true },
    message: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: ['RECOMMENDED', 'DELIVERED', 'ACTIONED', 'DISMISSED'],
      default: 'RECOMMENDED',
      index: true,
    },
  },
  { timestamps: true }
);

InterventionSchema.index({ patientId: 1, status: 1 });

export const InterventionModel = model<IInterventionDocument>('Intervention', InterventionSchema);
