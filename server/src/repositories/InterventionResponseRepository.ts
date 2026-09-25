import { InterventionResponseModel, IInterventionResponseDocument } from '../models/InterventionResponse.js';

export interface IInterventionResponseRepository {
  findById(responseId: string): Promise<IInterventionResponseDocument | null>;
  findByPatientId(patientId: string): Promise<IInterventionResponseDocument[]>;
  findAll(): Promise<IInterventionResponseDocument[]>;
  create(data: Partial<IInterventionResponseDocument>): Promise<IInterventionResponseDocument>;
  update(responseId: string, data: Partial<IInterventionResponseDocument>): Promise<IInterventionResponseDocument | null>;
  upsert(responseId: string, data: Partial<IInterventionResponseDocument>): Promise<IInterventionResponseDocument>;
}

export class MongoInterventionResponseRepository implements IInterventionResponseRepository {
  async findById(responseId: string): Promise<IInterventionResponseDocument | null> {
    return InterventionResponseModel.findOne({ responseId }).exec();
  }

  async findByPatientId(patientId: string): Promise<IInterventionResponseDocument[]> {
    return InterventionResponseModel.find({ patientId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(): Promise<IInterventionResponseDocument[]> {
    return InterventionResponseModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(data: Partial<IInterventionResponseDocument>): Promise<IInterventionResponseDocument> {
    const res = new InterventionResponseModel(data);
    return res.save();
  }

  async update(responseId: string, data: Partial<IInterventionResponseDocument>): Promise<IInterventionResponseDocument | null> {
    return InterventionResponseModel.findOneAndUpdate({ responseId }, data, { new: true }).exec();
  }

  async upsert(responseId: string, data: Partial<IInterventionResponseDocument>): Promise<IInterventionResponseDocument> {
    return InterventionResponseModel.findOneAndUpdate(
      { responseId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
