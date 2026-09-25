import { ScheduleModel, IScheduleDocument } from '../models/Schedule.js';

export interface IScheduleRepository {
  findById(scheduleId: string): Promise<IScheduleDocument | null>;
  findByPatientId(patientId: string): Promise<IScheduleDocument[]>;
  findByDate(patientId: string, date: string): Promise<IScheduleDocument[]>;
  findAll(): Promise<IScheduleDocument[]>;
  create(data: Partial<IScheduleDocument>): Promise<IScheduleDocument>;
  update(scheduleId: string, data: Partial<IScheduleDocument>): Promise<IScheduleDocument | null>;
  upsert(scheduleId: string, data: Partial<IScheduleDocument>): Promise<IScheduleDocument>;
}

export class MongoScheduleRepository implements IScheduleRepository {
  async findById(scheduleId: string): Promise<IScheduleDocument | null> {
    return ScheduleModel.findOne({ scheduleId }).exec();
  }

  async findByPatientId(patientId: string): Promise<IScheduleDocument[]> {
    return ScheduleModel.find({ patientId }).exec();
  }

  async findByDate(patientId: string, date: string): Promise<IScheduleDocument[]> {
    return ScheduleModel.find({ patientId, scheduledDate: date }).exec();
  }

  async findAll(): Promise<IScheduleDocument[]> {
    return ScheduleModel.find().exec();
  }

  async create(data: Partial<IScheduleDocument>): Promise<IScheduleDocument> {
    const sch = new ScheduleModel(data);
    return sch.save();
  }

  async update(scheduleId: string, data: Partial<IScheduleDocument>): Promise<IScheduleDocument | null> {
    return ScheduleModel.findOneAndUpdate({ scheduleId }, data, { new: true }).exec();
  }

  async upsert(scheduleId: string, data: Partial<IScheduleDocument>): Promise<IScheduleDocument> {
    return ScheduleModel.findOneAndUpdate(
      { scheduleId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }
}
