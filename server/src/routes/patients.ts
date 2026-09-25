import { Router, Request, Response } from 'express';
import { MongoPatientRepository } from '../repositories/PatientRepository.js';

const router = Router();
const patientRepo = new MongoPatientRepository();

// GET /api/patients
router.get('/', async (_req: Request, res: Response) => {
  try {
    const patients = await patientRepo.findAll();
    res.json({ success: true, data: patients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve patients', error: error.message });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const patient = await patientRepo.findById(id);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }
    res.json({ success: true, data: patient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve patient', error: error.message });
  }
});

// POST /api/patients
router.post('/', async (req: Request, res: Response) => {
  try {
    const patientId = req.body.patientId || req.body.id || `pat_${Date.now()}`;
    const data = { ...req.body, patientId };
    const patient = await patientRepo.upsert(patientId, data);
    res.status(201).json({ success: true, data: patient });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to create or update patient', error: error.message });
  }
});

// PUT /api/patients/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const patient = await patientRepo.update(id, req.body);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }
    res.json({ success: true, data: patient });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to update patient', error: error.message });
  }
});

export default router;
