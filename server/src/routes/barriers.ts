import { Router, Request, Response } from 'express';
import { MongoBarrierRepository } from '../repositories/BarrierRepository.js';

const router = Router();
const barrierRepo = new MongoBarrierRepository();

// GET /api/barriers
router.get('/', async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;
    const barriers = patientId ? await barrierRepo.findByPatientId(patientId as string) : await barrierRepo.findAll();
    res.json({ success: true, data: barriers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve barriers', error: error.message });
  }
});

// POST /api/barriers
router.post('/', async (req: Request, res: Response) => {
  try {
    const barrierId = req.body.barrierId || req.body.id || `bar_${Date.now()}`;
    const data = { ...req.body, barrierId };
    const barrier = await barrierRepo.upsert(barrierId, data);
    res.status(201).json({ success: true, data: barrier });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to store barrier', error: error.message });
  }
});

export default router;
