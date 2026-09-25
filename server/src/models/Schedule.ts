import { Schema, model, Document } from 'mongoose';

export interface IScheduleDocument extends Document {
  scheduleId: string;
  patientId: string;
  medicationId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  actualTime?: string | null;
  notes?: string;
  daysOfWeek?: number[];
  doseQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ScheduleSchema = new Schema<IScheduleDocument>(
  {
    scheduleId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    medicationId: { type: String, required: true, index: true },
    scheduledDate: { type: String, required: true, index: true },
    scheduledTime: { type: String, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ['SCHEDULED', 'READY', 'COLLECTED', 'MISSED', 'DELAYED', 'DISPENSED', 'COMPLETED'],
      default: 'SCHEDULED',
      index: true,
    },
    actualTime: { type: String, default: null },
    notes: { type: String },
    daysOfWeek: [{ type: Number }],
    doseQuantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Compound index for querying schedules by patient and date
ScheduleSchema.index({ patientId: 1, scheduledDate: 1 });

export const ScheduleModel = model<IScheduleDocument>('Schedule', ScheduleSchema);
