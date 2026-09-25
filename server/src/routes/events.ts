import { Router, Request, Response } from 'express';
import { MongoMedicationEventRepository } from '../repositories/MedicationEventRepository.js';

const router = Router();
const eventRepo = new MongoMedicationEventRepository();

// GET /api/events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;
    const events = patientId ? await eventRepo.findByPatientId(patientId as string) : await eventRepo.findAll();
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve medication events', error: error.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const event = await eventRepo.findById(id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Medication event not found' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Unable to retrieve medication event', error: error.message });
  }
});

// POST /api/events
router.post('/', async (req: Request, res: Response) => {
  try {
    const eventId = req.body.eventId || req.body.id || `evt_${Date.now()}`;
    const data = { ...req.body, eventId };
    const event = await eventRepo.upsert(eventId, data);
    res.status(201).json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to create medication event', error: error.message });
  }
});

// PUT /api/events/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const event = await eventRepo.update(id, req.body);
    if (!event) {
      res.status(404).json({ success: false, message: 'Medication event not found' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Unable to update medication event', error: error.message });
  }
});

export default router;
