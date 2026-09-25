import { Router, Request, Response } from 'express';
import { MongoInterventionRepository } from '../repositories/InterventionRepository.js';

const router = Router();
const interventionRepo = new MongoInterventionRepository();

// GET /api/interventions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;
    const interventions = patientId
      ? await interventionRepo.findByPatientId(patientId as string)
      : await interventionRepo.findAll();
    res.json({ success: true, data: interventions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve interventions', error: error.message });
  }
});

// POST /api/interventions
router.post('/', async (req: Request, res: Response) => {
  try {
    const interventionId = req.body.interventionId || req.body.id || `int_${Date.now()}`;
    const data = { ...req.body, interventionId };
    const intervention = await interventionRepo.upsert(interventionId, data);
    res.status(201).json({ success: true, data: intervention });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to store intervention', error: error.message });
  }
});

export default router;
