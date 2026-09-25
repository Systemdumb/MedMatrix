import { Schema, model, Document } from 'mongoose';

export interface IMedicationEventDocument extends Document {
  eventId: string;
  patientId: string;
  medicationId: string;
  scheduleId?: string;
  scheduledTime: string;
  actualEventTime?: string | null;
  state: string;
  source: string;
  evidence: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicationEventSchema = new Schema<IMedicationEventDocument>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    medicationId: { type: String, required: true, index: true },
    scheduleId: { type: String, index: true },
    scheduledTime: { type: String, required: true, index: true },
    actualEventTime: { type: String, default: null, index: true },
    state: {
      type: String,
      required: true,
      enum: [
        'SCHEDULED',
        'READY',
        'DISPENSING',
        'DISPENSED',
        'COLLECTED',
        'COMPLETED',
        'DELAYED',
        'MISSED',
        'FAILED',
        'UNCERTAIN',
      ],
      default: 'SCHEDULED',
      index: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['manual', 'simulated', 'hardware'],
      default: 'manual',
    },
    evidence: [{ type: String }],
    confidence: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index for querying event history by patient and time
MedicationEventSchema.index({ patientId: 1, scheduledTime: 1 });

export const MedicationEventModel = model<IMedicationEventDocument>(
  'MedicationEvent',
  MedicationEventSchema
);
