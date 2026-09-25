import { Schema, model, Document } from 'mongoose';

export interface IBarrierDocument extends Document {
  barrierId: string;
  patientId: string;
  medicationId?: string | null;
  medicationName?: string;
  barrierCategory: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string[];
  frequency: number;
  firstObserved: string;
  lastObserved: string;
  patientConfirmed: boolean;
  source: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BarrierSchema = new Schema<IBarrierDocument>(
  {
    barrierId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    medicationId: { type: String, default: null, index: true },
    medicationName: { type: String },
    barrierCategory: {
      type: String,
      required: true,
      index: true,
    },
    confidence: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    evidence: [{ type: String }],
    frequency: { type: Number, required: true, default: 1 },
    firstObserved: { type: String, required: true },
    lastObserved: { type: String, required: true },
    patientConfirmed: { type: Boolean, required: true, default: false },
    source: {
      type: String,
      required: true,
      enum: ['SYSTEM_INFERRED', 'PATIENT_REPORTED', 'HARDWARE_SENSOR'],
      default: 'SYSTEM_INFERRED',
    },
  },
  { timestamps: true }
);

BarrierSchema.index({ patientId: 1, barrierCategory: 1 });

export const BarrierModel = model<IBarrierDocument>('Barrier', BarrierSchema);
