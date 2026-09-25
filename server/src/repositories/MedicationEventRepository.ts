import { MedicationEventModel, IMedicationEventDocument } from '../models/MedicationEvent.js';

export interface IMedicationEventRepository {
  findById(eventId: string): Promise<IMedicationEventDocument | null>;
  findByPatientId(patientId: string): Promise<IMedicationEventDocument[]>;
  findAll(): Promise<IMedicationEventDocument[]>;
  create(data: Partial<IMedicationEventDocument>): Promise<IMedicationEventDocument>;
  update(eventId: string, data: Partial<IMedicationEventDocument>): Promise<IMedicationEventDocument | null>;
  upsert(eventId: string, data: Partial<IMedicationEventDocument>): Promise<IMedicationEventDocument>;
}

export class MongoMedicationEventRepository implements IMedicationEventRepository {
  async findById(eventId: string): Promise<IMedicationEventDocument | null> {
    return MedicationEventModel.findOne({ eventId }).exec();
  }

  async findByPatientId(patientId: string): Promise<IMedicationEventDocument[]> {
    return MedicationEventModel.find({ patientId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(): Promise<IMedicationEventDocument[]> {
    return MedicationEventModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(data: Partial<IMedicationEventDocument>): Promise<IMedicationEventDocument> {
    const event = new MedicationEventModel(data);
    return event.save();
  }

  async update(eventId: string, data: Partial<IMedicationEventDocument>): Promise<IMedicationEventDocument | null> {
    return MedicationEventModel.findOneAndUpdate({ eventId }, data, { new: true }).exec();
  }

  async upsert(eventId: string, data: Partial<IMedicationEventDocument>): Promise<IMedicationEventDocument> {
    return MedicationEventModel.findOneAndUpdate(
      { eventId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
