import { PatientModel, IPatientDocument } from '../models/Patient.js';

export interface IPatientRepository {
  findById(patientId: string): Promise<IPatientDocument | null>;
  findAll(): Promise<IPatientDocument[]>;
  create(data: Partial<IPatientDocument>): Promise<IPatientDocument>;
  update(patientId: string, data: Partial<IPatientDocument>): Promise<IPatientDocument | null>;
  upsert(patientId: string, data: Partial<IPatientDocument>): Promise<IPatientDocument>;
}

export class MongoPatientRepository implements IPatientRepository {
  async findById(patientId: string): Promise<IPatientDocument | null> {
    return PatientModel.findOne({ patientId }).exec();
  }

  async findAll(): Promise<IPatientDocument[]> {
    return PatientModel.find().exec();
  }

  async create(data: Partial<IPatientDocument>): Promise<IPatientDocument> {
    const patient = new PatientModel(data);
    return patient.save();
  }

  async update(patientId: string, data: Partial<IPatientDocument>): Promise<IPatientDocument | null> {
    return PatientModel.findOneAndUpdate({ patientId }, data, { new: true }).exec();
  }

  async upsert(patientId: string, data: Partial<IPatientDocument>): Promise<IPatientDocument> {
    return PatientModel.findOneAndUpdate(
      { patientId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
