import { InterventionModel, IInterventionDocument } from '../models/Intervention.js';

export interface IInterventionRepository {
  findById(interventionId: string): Promise<IInterventionDocument | null>;
  findByPatientId(patientId: string): Promise<IInterventionDocument[]>;
  findAll(): Promise<IInterventionDocument[]>;
  create(data: Partial<IInterventionDocument>): Promise<IInterventionDocument>;
  update(interventionId: string, data: Partial<IInterventionDocument>): Promise<IInterventionDocument | null>;
  upsert(interventionId: string, data: Partial<IInterventionDocument>): Promise<IInterventionDocument>;
}

export class MongoInterventionRepository implements IInterventionRepository {
  async findById(interventionId: string): Promise<IInterventionDocument | null> {
    return InterventionModel.findOne({ interventionId }).exec();
  }

  async findByPatientId(patientId: string): Promise<IInterventionDocument[]> {
    return InterventionModel.find({ patientId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(): Promise<IInterventionDocument[]> {
    return InterventionModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(data: Partial<IInterventionDocument>): Promise<IInterventionDocument> {
    const intervention = new InterventionModel(data);
    return intervention.save();
  }

  async update(interventionId: string, data: Partial<IInterventionDocument>): Promise<IInterventionDocument | null> {
    return InterventionModel.findOneAndUpdate({ interventionId }, data, { new: true }).exec();
  }

  async upsert(interventionId: string, data: Partial<IInterventionDocument>): Promise<IInterventionDocument> {
    return InterventionModel.findOneAndUpdate(
      { interventionId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
