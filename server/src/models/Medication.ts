import { Schema, model, Document } from 'mongoose';

export interface IMedicationDocument extends Document {
  medicationId: string;
  patientId: string;
  name: string;
  dosage: string;
  dosageUnit: string;
  frequency: string;
  scheduledTimes: string[];
  relationToFood: string;
  startDate: string;
  endDate?: string;
  prescribedQuantity: number;
  remainingQuantity: number;
  refillThreshold: number;
  active: boolean;
  category?: string;
  instructions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicationSchema = new Schema<IMedicationDocument>(
  {
    medicationId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    dosageUnit: { type: String, required: true },
    frequency: { type: String, required: true },
    scheduledTimes: [{ type: String }],
    relationToFood: { type: String, required: true, default: 'BEFORE_FOOD' },
    startDate: { type: String, required: true },
    endDate: { type: String },
    prescribedQuantity: { type: Number, required: true },
    remainingQuantity: { type: Number, required: true },
    refillThreshold: { type: Number, required: true, default: 5 },
    active: { type: Boolean, required: true, default: true, index: true },
    category: { type: String },
    instructions: { type: String },
  },
  { timestamps: true }
);

export const MedicationModel = model<IMedicationDocument>('Medication', MedicationSchema);
