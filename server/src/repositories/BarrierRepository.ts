import { BarrierModel, IBarrierDocument } from '../models/Barrier.js';

export interface IBarrierRepository {
  findById(barrierId: string): Promise<IBarrierDocument | null>;
  findByPatientId(patientId: string): Promise<IBarrierDocument[]>;
  findAll(): Promise<IBarrierDocument[]>;
  create(data: Partial<IBarrierDocument>): Promise<IBarrierDocument>;
  update(barrierId: string, data: Partial<IBarrierDocument>): Promise<IBarrierDocument | null>;
  upsert(barrierId: string, data: Partial<IBarrierDocument>): Promise<IBarrierDocument>;
}

export class MongoBarrierRepository implements IBarrierRepository {
  async findById(barrierId: string): Promise<IBarrierDocument | null> {
    return BarrierModel.findOne({ barrierId }).exec();
  }

  async findByPatientId(patientId: string): Promise<IBarrierDocument[]> {
    return BarrierModel.find({ patientId }).sort({ updatedAt: -1 }).exec();
  }

  async findAll(): Promise<IBarrierDocument[]> {
    return BarrierModel.find().sort({ updatedAt: -1 }).exec();
  }

  async create(data: Partial<IBarrierDocument>): Promise<IBarrierDocument> {
    const barrier = new BarrierModel(data);
    return barrier.save();
  }

  async update(barrierId: string, data: Partial<IBarrierDocument>): Promise<IBarrierDocument | null> {
    return BarrierModel.findOneAndUpdate({ barrierId }, data, { new: true }).exec();
  }

  async upsert(barrierId: string, data: Partial<IBarrierDocument>): Promise<IBarrierDocument> {
    return BarrierModel.findOneAndUpdate(
      { barrierId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
