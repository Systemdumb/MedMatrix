import { Schema, model, Document } from 'mongoose';

export interface IInterventionResponseDocument extends Document {
  responseId: string;
  patientId: string;
  medicationId?: string | null;
  medicationName?: string;
  interventionId: string;
  interventionType: string;
  timestamp: string;
  response: 'responded' | 'delayed_response' | 'no_response' | 'not_applicable';
  responseTime?: number;
  subsequentMedicationEvent: string;
  outcome: 'successful' | 'partially_successful' | 'unsuccessful' | 'unknown';
  effectiveness: number;
  contextWindow?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InterventionResponseSchema = new Schema<IInterventionResponseDocument>(
  {
    responseId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    medicationId: { type: String, default: null, index: true },
    medicationName: { type: String },
    interventionId: { type: String, required: true, index: true },
    interventionType: { type: String, required: true, index: true },
    timestamp: { type: String, required: true },
    response: {
      type: String,
      required: true,
      enum: ['responded', 'delayed_response', 'no_response', 'not_applicable'],
      default: 'responded',
    },
    responseTime: { type: Number },
    subsequentMedicationEvent: { type: String, required: true },
    outcome: {
      type: String,
      required: true,
      enum: ['successful', 'partially_successful', 'unsuccessful', 'unknown'],
      default: 'successful',
    },
    effectiveness: { type: Number, required: true, min: 0, max: 100 },
    contextWindow: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

InterventionResponseSchema.index({ patientId: 1, interventionId: 1 });

export const InterventionResponseModel = model<IInterventionResponseDocument>(
  'InterventionResponse',
  InterventionResponseSchema
);
