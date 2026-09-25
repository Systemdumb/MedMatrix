import { Schema, model, Document } from 'mongoose';

export interface IPatientDocument extends Document {
  patientId: string;
  name: string;
  age: number;
  gender?: string;
  city?: string;
  preferredLanguage: string;
  caregiver: {
    name: string;
    phone: string;
    relation: string;
  };
  chronicConditions: string[];
  adherenceScore?: number;
  adherenceProfile: {
    score: number;
    vulnerableTimeWindow: string;
    primaryBarrier: string;
    effectiveIntervention: string;
  };
  adherenceFingerprint?: {
    vulnerableTime: string;
    vulnerableDays: string;
    topProbableBarrier: string;
    secondaryBarrier: string;
    mostEffectiveIntervention: string;
    caregiverResponsiveness: 'High' | 'Medium' | 'Low';
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const PatientSchema = new Schema<IPatientDocument>(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String },
    city: { type: String },
    preferredLanguage: { type: String, required: true, default: 'en' },
    caregiver: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, required: true },
    },
    chronicConditions: [{ type: String }],
    adherenceScore: { type: Number },
    adherenceProfile: {
      score: { type: Number, required: true, default: 100 },
      vulnerableTimeWindow: { type: String, default: 'None' },
      primaryBarrier: { type: String, default: 'None' },
      effectiveIntervention: { type: String, default: 'Standard Reminders' },
    },
    adherenceFingerprint: {
      vulnerableTime: { type: String },
      vulnerableDays: { type: String },
      topProbableBarrier: { type: String },
      secondaryBarrier: { type: String },
      mostEffectiveIntervention: { type: String },
      caregiverResponsiveness: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    },
  },
  { timestamps: true }
);

export const PatientModel = model<IPatientDocument>('Patient', PatientSchema);
