import { MedicationEvent, EventSource, EventEvidence } from '../../types/events';

export type RawHardwareSignalType =
  | 'DISPENSE_SUCCESS'
  | 'COLLECTION_SUCCESS'
  | 'DISPENSE_FAILURE'
  | 'SENSOR_CONFLICT'
  | 'DOOR_OPENED'
  | 'DOOR_CLOSED'
  | 'DEVICE_OFFLINE'
  | 'DEVICE_RECONNECTED';

export interface RawHardwareSignal {
  id: string;
  deviceId: string;
  slotId: number;
  medicationId?: string;
  type: RawHardwareSignalType;
  timestamp: string;
  payload?: Record<string, any>;
}

export interface HardwareEventAdapter {
  connect(): Promise<boolean>;
  disconnect(): void;
  isConnected(): boolean;
  onHardwareSignal(callback: (signal: RawHardwareSignal) => void): void;
  simulateSignal(signalType: RawHardwareSignalType, medicationId?: string): RawHardwareSignal;
  getQueuedSignalsCount(): number;
}

export class SimulatedHardwareAdapter implements HardwareEventAdapter {
  private connected: boolean = true;
  private listeners: ((signal: RawHardwareSignal) => void)[] = [];
  private offlineQueue: RawHardwareSignal[] = [];

  constructor(private deviceId: string = 'ESP32_MEDMATRIX_DEV01') {}

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  disconnect(): void {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  onHardwareSignal(callback: (signal: RawHardwareSignal) => void): void {
    this.listeners.push(callback);
  }

  simulateSignal(signalType: RawHardwareSignalType, medicationId: string = 'm1'): RawHardwareSignal {
    const signal: RawHardwareSignal = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      deviceId: this.deviceId,
      slotId: 1,
      medicationId,
      type: signalType,
      timestamp: new Date().toISOString(),
      payload: { batteryLevel: 94, wifiRSSI: -58 },
    };

    if (signalType === 'DEVICE_OFFLINE') {
      this.connected = false;
    } else if (signalType === 'DEVICE_RECONNECTED') {
      this.connected = true;
      // Synchronize queued offline events
      const queued = [...this.offlineQueue];
      this.offlineQueue = [];
      queued.forEach((s) => this.emitSignal(s));
    }

    if (!this.connected && signalType !== 'DEVICE_RECONNECTED' && signalType !== 'DEVICE_OFFLINE') {
      // Queue offline events
      this.offlineQueue.push(signal);
    } else {
      this.emitSignal(signal);
    }

    return signal;
  }

  getQueuedSignalsCount(): number {
    return this.offlineQueue.length;
  }

  private emitSignal(signal: RawHardwareSignal): void {
    this.listeners.forEach((listener) => listener(signal));
  }

  /**
   * Translates raw hardware signals into strongly-typed MedicationEvent data
   */
  static convertSignalToMedicationEvent(
    signal: RawHardwareSignal,
    patientId: string = 'p1',
    scheduledTime: string = '20:00'
  ): Partial<MedicationEvent> {
    let state: MedicationEvent['state'] = 'READY';
    let source: EventSource = 'hardware';
    const evidence: EventEvidence[] = ['sensor'];
    let notes = '';
    let confidence: MedicationEvent['confidence'] = 'HIGH';

    switch (signal.type) {
      case 'DISPENSE_SUCCESS':
        state = 'DISPENSED';
        evidence.push('dispensing');
        notes = 'ESP32 optical infrared sensor confirmed pill dropped into drawer.';
        break;

      case 'COLLECTION_SUCCESS':
        state = 'COLLECTED';
        evidence.push('collection', 'patient confirmation');
        notes = 'Drawer capacitive proximity sensor registered cup removal.';
        break;

      case 'DISPENSE_FAILURE':
        state = 'FAILED';
        evidence.push('device failure');
        notes = 'ESP32 motor rotation completed but optical sensor detected no pill drop.';
        confidence = 'HIGH';
        break;

      case 'SENSOR_CONFLICT':
        state = 'UNCERTAIN';
        evidence.push('unknown');
        notes = 'Optical sensor registered multiple rapid pulses; status ambiguous.';
        confidence = 'LOW';
        break;

      case 'DEVICE_OFFLINE':
        state = 'UNCERTAIN';
        evidence.push('unknown');
        notes = 'Hardware device disconnected from Wi-Fi network. Event queued.';
        confidence = 'LOW';
        break;

      case 'DEVICE_RECONNECTED':
        state = 'READY';
        evidence.push('sensor');
        notes = 'Hardware reconnected. Synchronized queued offline telemetry.';
        break;
    }

    return {
      patientId,
      medicationId: signal.medicationId || 'm1',
      scheduledTime,
      actualEventTime: signal.timestamp,
      state,
      source,
      evidence,
      confidence,
      notes,
    };
  }
}
