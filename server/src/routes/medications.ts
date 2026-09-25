import { Router, Request, Response } from 'express';
import { MongoMedicationRepository } from '../repositories/MedicationRepository.js';

const router = Router();
const medRepo = new MongoMedicationRepository();

// GET /api/medications
router.get('/', async (req: Request, res: Response) => {
  try {
    const patientId = req.query.patientId as string;
    const medications = patientId ? await medRepo.findByPatientId(patientId) : await medRepo.findAll();
    res.json({ success: true, data: medications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve medications', error: error.message });
  }
});

// GET /api/medications/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const med = await medRepo.findById(id);
    if (!med) {
      res.status(404).json({ success: false, message: 'Medication not found' });
      return;
    }
    res.json({ success: true, data: med });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve medication', error: error.message });
  }
});

// POST /api/medications
router.post('/', async (req: Request, res: Response) => {
  try {
    const medicationId = req.body.medicationId || req.body.id || `med_${Date.now()}`;
    const data = { ...req.body, medicationId };
    const med = await medRepo.upsert(medicationId, data);
    res.status(201).json({ success: true, data: med });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to create medication', error: error.message });
  }
});

// PUT /api/medications/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const med = await medRepo.update(id, req.body);
    if (!med) {
      res.status(404).json({ success: false, message: 'Medication not found' });
      return;
    }
    res.json({ success: true, data: med });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to update medication', error: error.message });
  }
});

// DELETE /api/medications/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await medRepo.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Medication not found' });
      return;
    }
    res.json({ success: true, message: 'Medication soft deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to delete medication', error: error.message });
  }
});

export default router;
