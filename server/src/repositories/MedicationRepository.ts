import { MedicationModel, IMedicationDocument } from '../models/Medication.js';

export interface IMedicationRepository {
  findById(medicationId: string): Promise<IMedicationDocument | null>;
  findByPatientId(patientId: string): Promise<IMedicationDocument[]>;
  findAll(): Promise<IMedicationDocument[]>;
  create(data: Partial<IMedicationDocument>): Promise<IMedicationDocument>;
  update(medicationId: string, data: Partial<IMedicationDocument>): Promise<IMedicationDocument | null>;
  delete(medicationId: string): Promise<boolean>;
  upsert(medicationId: string, data: Partial<IMedicationDocument>): Promise<IMedicationDocument>;
}

export class MongoMedicationRepository implements IMedicationRepository {
  async findById(medicationId: string): Promise<IMedicationDocument | null> {
    return MedicationModel.findOne({ medicationId }).exec();
  }

  async findByPatientId(patientId: string): Promise<IMedicationDocument[]> {
    return MedicationModel.find({ patientId, active: true }).exec();
  }

  async findAll(): Promise<IMedicationDocument[]> {
    return MedicationModel.find().exec();
  }

  async create(data: Partial<IMedicationDocument>): Promise<IMedicationDocument> {
    const med = new MedicationModel(data);
    return med.save();
  }

  async update(medicationId: string, data: Partial<IMedicationDocument>): Promise<IMedicationDocument | null> {
    return MedicationModel.findOneAndUpdate({ medicationId }, data, { new: true }).exec();
  }

  async delete(medicationId: string): Promise<boolean> {
    const res = await MedicationModel.findOneAndUpdate({ medicationId }, { active: false }).exec();
    return !!res;
  }

  async upsert(medicationId: string, data: Partial<IMedicationDocument>): Promise<IMedicationDocument> {
    return MedicationModel.findOneAndUpdate(
      { medicationId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
