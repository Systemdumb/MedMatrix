import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase, closeDatabase } from './config/database.js';
import { MongoPatientRepository } from './repositories/PatientRepository.js';
import { MongoMedicationRepository } from './repositories/MedicationRepository.js';
import { MongoScheduleRepository } from './repositories/ScheduleRepository.js';
import { MongoMedicationEventRepository } from './repositories/MedicationEventRepository.js';
import { MongoBarrierRepository } from './repositories/BarrierRepository.js';
import { MongoInterventionRepository } from './repositories/InterventionRepository.js';
import { MongoInterventionResponseRepository } from './repositories/InterventionResponseRepository.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const seedDatabase = async () => {
  console.log('🌱 Starting MedMatrix Database Seed Script...');
  try {
    await connectDatabase();

    const patientRepo = new MongoPatientRepository();
    const medRepo = new MongoMedicationRepository();
    const scheduleRepo = new MongoScheduleRepository();
    const eventRepo = new MongoMedicationEventRepository();
    const barrierRepo = new MongoBarrierRepository();
    const interventionRepo = new MongoInterventionRepository();
    const responseRepo = new MongoInterventionResponseRepository();

    const patientId = 'p1';

    // 1. Seed Fictional Patient
    console.log('👤 Seeding Demo Patient...');
    await patientRepo.upsert(patientId, {
      patientId: 'p1',
      name: 'Ramesh Sharma (Demo)',
      age: 64,
      gender: 'Male',
      city: 'Jaipur',
      preferredLanguage: 'hi',
      caregiver: {
        name: 'Sunita Sharma',
        phone: '+91 98765 43210',
        relation: 'Daughter',
      },
      chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
      adherenceScore: 78,
      adherenceProfile: {
        score: 78,
        vulnerableTimeWindow: 'Evening (20:00)',
        primaryBarrier: 'Evening Forgetfulness',
        effectiveIntervention: 'Hindi Voice Call',
      },
      adherenceFingerprint: {
        vulnerableTime: '20:00 - 21:00',
        vulnerableDays: 'Fri, Sat',
        topProbableBarrier: 'forgetfulness',
        secondaryBarrier: 'schedule_disruption',
        mostEffectiveIntervention: 'voice_reminder',
        caregiverResponsiveness: 'High',
      },
    });

    // 2. Seed Medications
    console.log('💊 Seeding Demo Medications...');
    await medRepo.upsert('m1', {
      medicationId: 'm1',
      patientId: 'p1',
      name: 'Metformin 500mg',
      dosage: '500mg',
      dosageUnit: 'mg',
      frequency: 'Twice daily',
      scheduledTimes: ['08:00', '20:00'],
      relationToFood: 'AFTER_FOOD',
      startDate: '2026-01-01',
      prescribedQuantity: 60,
      remainingQuantity: 18,
      refillThreshold: 10,
      active: true,
      category: 'Diabetes',
      instructions: 'Take one tablet after breakfast and dinner',
    });

    await medRepo.upsert('m2', {
      medicationId: 'm2',
      patientId: 'p1',
      name: 'Amlodipine 5mg',
      dosage: '5mg',
      dosageUnit: 'mg',
      frequency: 'Once daily',
      scheduledTimes: ['08:00'],
      relationToFood: 'BEFORE_FOOD',
      startDate: '2026-01-01',
      prescribedQuantity: 30,
      remainingQuantity: 8,
      refillThreshold: 5,
      active: true,
      category: 'Hypertension',
      instructions: 'Take one tablet in the morning before food',
    });

    // 3. Seed Today's Schedules
    console.log('📅 Seeding Schedules...');
    const TODAY = new Date().toISOString().split('T')[0];

    await scheduleRepo.upsert('s1', {
      scheduleId: 's1',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledDate: TODAY,
      scheduledTime: '08:00',
      status: 'COLLECTED',
      actualTime: '08:12',
      notes: 'Taken on time after breakfast',
      doseQuantity: 1,
    });

    await scheduleRepo.upsert('s2', {
      scheduleId: 's2',
      patientId: 'p1',
      medicationId: 'm2',
      scheduledDate: TODAY,
      scheduledTime: '08:00',
      status: 'COLLECTED',
      actualTime: '08:10',
      notes: 'Taken with water',
      doseQuantity: 1,
    });

    await scheduleRepo.upsert('s3', {
      scheduleId: 's3',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledDate: TODAY,
      scheduledTime: '20:00',
      status: 'SCHEDULED',
      notes: 'Evening dose pending',
      doseQuantity: 1,
    });

    // 4. Seed Medication Events covering required states
    console.log('⚡ Seeding Medication Events (COMPLETED, DELAYED, MISSED, UNCERTAIN, FAILED)...');

    const demoEvents = [
      {
        eventId: 'evt_101',
        patientId: 'p1',
        medicationId: 'm1',
        scheduledTime: `${TODAY} 08:00`,
        actualEventTime: `${TODAY} 08:12`,
        state: 'COMPLETED',
        source: 'hardware',
        evidence: ['sensor', 'dispensing', 'collection'],
        confidence: 'HIGH' as const,
        notes: 'ESP32 Smart Dispenser detected compartment opening at 08:12',
      },
      {
        eventId: 'evt_102',
        patientId: 'p1',
        medicationId: 'm1',
        scheduledTime: '2026-09-16 20:00',
        actualEventTime: '2026-09-16 21:15',
        state: 'DELAYED',
        source: 'manual',
        evidence: ['patient confirmation'],
        confidence: 'MEDIUM' as const,
        notes: 'Dose taken 1 hour 15 mins late due to evening guest visit',
      },
      {
        eventId: 'evt_103',
        patientId: 'p1',
        medicationId: 'm2',
        scheduledTime: '2026-09-15 08:00',
        actualEventTime: null,
        state: 'MISSED',
        source: 'simulated',
        evidence: ['schedule', 'no collection detected'],
        confidence: 'HIGH' as const,
        notes: 'No compartment movement detected within 4-hour window',
      },
      {
        eventId: 'evt_104',
        patientId: 'p1',
        medicationId: 'm1',
        scheduledTime: '2026-09-14 20:00',
        actualEventTime: '2026-09-14 20:05',
        state: 'UNCERTAIN',
        source: 'hardware',
        evidence: ['sensor', 'unknown'],
        confidence: 'LOW' as const,
        notes: 'Compartment opened twice in 1 minute; confirmation unverified',
      },
      {
        eventId: 'evt_105',
        patientId: 'p1',
        medicationId: 'm1',
        scheduledTime: '2026-09-13 08:00',
        actualEventTime: null,
        state: 'FAILED',
        source: 'hardware',
        evidence: ['device failure', 'sensor'],
        confidence: 'HIGH' as const,
        notes: 'ESP32 solenoid jam alert safeguard triggered',
      },
    ];

    for (const evt of demoEvents) {
      await eventRepo.upsert(evt.eventId, evt);
    }

    // 5. Seed Probable Barriers
    console.log('🚧 Seeding Probable Barriers...');
    await barrierRepo.upsert('bar_101', {
      barrierId: 'bar_101',
      patientId: 'p1',
      medicationId: 'm1',
      medicationName: 'Metformin 500mg',
      barrierCategory: 'forgetfulness',
      confidence: 'HIGH',
      evidence: [
        'Repeat delayed doses observed during 20:00 evening window',
        'Patient reported watching news during evening medication time',
      ],
      frequency: 4,
      firstObserved: '2026-09-01',
      lastObserved: '2026-09-16',
      patientConfirmed: true,
      source: 'SYSTEM_INFERRED',
    });

    // 6. Seed Personalized Interventions
    console.log('📣 Seeding Personalized Interventions...');
    await interventionRepo.upsert('int_101', {
      interventionId: 'int_101',
      patientId: 'p1',
      medicationId: 'm1',
      medicationName: 'Metformin 500mg',
      barrierId: 'bar_101',
      barrierCategory: 'forgetfulness',
      evidence: ['High vulnerability score for evening 20:00 slot'],
      interventionType: 'voice_reminder',
      title: 'Multilingual Hindi Voice Call Prompt',
      reason: 'Patient responds 45% better to voice audio calls than text SMS during evening hours',
      priority: 'HIGH',
      confidence: 'HIGH',
      createdAtIso: new Date().toISOString(),
      message: {
        en: 'Namaste Ramesh ji, it is time for your evening Metformin dose.',
        hi: 'नमस्ते रमेश जी, आपकी शाम की मेटफॉर्मिन दवा का समय हो गया है।',
      },
      status: 'DELIVERED',
    });

    // 7. Seed Intervention Learning Response
    console.log('🧠 Seeding Intervention Learning Responses...');
    await responseRepo.upsert('res_101', {
      responseId: 'res_101',
      patientId: 'p1',
      medicationId: 'm1',
      medicationName: 'Metformin 500mg',
      interventionId: 'int_101',
      interventionType: 'voice_reminder',
      timestamp: new Date().toISOString(),
      response: 'responded',
      responseTime: 45,
      subsequentMedicationEvent: 'COMPLETED',
      outcome: 'successful',
      effectiveness: 92,
      contextWindow: 'Evening (20:00)',
      notes: 'Patient ingested dose within 2 minutes of receiving voice prompt',
    });

    console.log('✨ MedMatrix Database Seeded Successfully!');
  } catch (error: any) {
    console.error('❌ Database seed error:', error.message || error);
  } finally {
    await closeDatabase();
  }
};

seedDatabase();
