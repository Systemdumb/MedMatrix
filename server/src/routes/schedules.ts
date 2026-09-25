import { Router, Request, Response } from 'express';
import { MongoScheduleRepository } from '../repositories/ScheduleRepository.js';

const router = Router();
const scheduleRepo = new MongoScheduleRepository();

// GET /api/schedules
router.get('/', async (req: Request, res: Response) => {
  try {
    const { patientId, date } = req.query;
    let schedules;
    if (patientId && date) {
      schedules = await scheduleRepo.findByDate(patientId as string, date as string);
    } else if (patientId) {
      schedules = await scheduleRepo.findByPatientId(patientId as string);
    } else {
      schedules = await scheduleRepo.findAll();
    }
    res.json({ success: true, data: schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve schedules', error: error.message });
  }
});

// POST /api/schedules
router.post('/', async (req: Request, res: Response) => {
  try {
    const scheduleId = req.body.scheduleId || req.body.id || `sch_${Date.now()}`;
    const data = { ...req.body, scheduleId };
    const sch = await scheduleRepo.upsert(scheduleId, data);
    res.status(201).json({ success: true, data: sch });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to create schedule', error: error.message });
  }
});

// PUT /api/schedules/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const sch = await scheduleRepo.update(id, req.body);
    if (!sch) {
      res.status(404).json({ success: false, message: 'Schedule not found' });
      return;
    }
    res.json({ success: true, data: sch });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to update schedule', error: error.message });
  }
});

export default router;
