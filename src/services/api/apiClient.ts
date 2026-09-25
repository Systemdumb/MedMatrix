/// <reference types="vite/client" />
import { Patient, Medication, MedicationSchedule } from '../../types';

const rawApiUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

class ApiClient {
  private isServerAvailable: boolean | null = null;
  private lastCheckTime = 0;
  private CHECK_INTERVAL = 10000; // 10 seconds

  public async checkHealth(): Promise<boolean> {
    const now = Date.now();
    if (this.isServerAvailable !== null && now - this.lastCheckTime < this.CHECK_INTERVAL) {
      return this.isServerAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isServerAvailable = data.status === 'ok';
      } else {
        this.isServerAvailable = false;
      }
    } catch {
      this.isServerAvailable = false;
    }

    this.lastCheckTime = now;
    return this.isServerAvailable;
  }

  // Patients
  public async getPatients(): Promise<Patient[] | null> {
    if (!(await this.checkHealth())) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/patients`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  public async savePatient(patient: Patient): Promise<Patient | null> {
    if (!(await this.checkHealth())) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  // Medications
  public async getMedications(patientId?: string): Promise<Medication[] | null> {
    if (!(await this.checkHealth())) return null;
    try {
      const url = patientId
        ? `${API_BASE_URL}/medications?patientId=${patientId}`
        : `${API_BASE_URL}/medications`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  public async saveMedication(medication: Medication): Promise<Medication | null> {
    if (!(await this.checkHealth())) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  public async deleteMedication(id: string): Promise<boolean> {
    if (!(await this.checkHealth())) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/medications/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Schedules
  public async getSchedules(patientId?: string, date?: string): Promise<MedicationSchedule[] | null> {
    if (!(await this.checkHealth())) return null;
    try {
      let url = `${API_BASE_URL}/schedules`;
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      if (date) params.append('date', date);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }

  public async saveSchedule(schedule: MedicationSchedule): Promise<MedicationSchedule | null> {
    if (!(await this.checkHealth())) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }
}

export const apiClient = new ApiClient();
