import { Router, Request, Response } from 'express';
import { MongoInterventionResponseRepository } from '../repositories/InterventionResponseRepository.js';

const router = Router();
const responseRepo = new MongoInterventionResponseRepository();

// GET /api/intervention-responses
router.get('/', async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;
    const responses = patientId
      ? await responseRepo.findByPatientId(patientId as string)
      : await responseRepo.findAll();
    res.json({ success: true, data: responses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve intervention responses', error: error.message });
  }
});

// POST /api/intervention-responses
router.post('/', async (req: Request, res: Response) => {
  try {
    const responseId = req.body.responseId || req.body.id || `res_${Date.now()}`;
    const data = { ...req.body, responseId };
    const responseItem = await responseRepo.upsert(responseId, data);
    res.status(201).json({ success: true, data: responseItem });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to store intervention response', error: error.message });
  }
});

export default router;
