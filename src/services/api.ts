import { Vehicle, Detection, EntryExitLog, Alert, AnalyticsData, AlertStatus } from '../types';
import { INITIAL_VEHICLES, INITIAL_ALERTS, INITIAL_HISTORY, INITIAL_ANALYTICS } from './mockData';

class APIService {
  private isLiveBackend: boolean = true;
  private vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  private alerts: Alert[] = [...INITIAL_ALERTS];
  private history: EntryExitLog[] = [...INITIAL_HISTORY];
  private analytics: AnalyticsData = { ...INITIAL_ANALYTICS };
  private detections: Detection[] = [];

  constructor() {
    this.checkHealth();
  }

  public async checkHealth(): Promise<{ status: string; mode: string }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        this.isLiveBackend = true;
        return { status: 'healthy', mode: data.mode || 'live_backend' };
      }
    } catch {
      // Backend not running yet or in fallback mode
    }
    this.isLiveBackend = false;
    return { status: 'demo_fallback', mode: 'demo_simulation' };
  }

  public getBackendMode(): boolean {
    return this.isLiveBackend;
  }

  public isLive(): boolean {
    return this.isLiveBackend;
  }

  public setBackendMode(live: boolean) {
    this.isLiveBackend = live;
  }

  public setLiveMode(live: boolean) {
    this.isLiveBackend = live;
  }

  // Vehicles CRUD
  public async getVehicles(): Promise<Vehicle[]> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/vehicles');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to local store', err);
      }
    }
    return [...this.vehicles];
  }

  public async getVehicleByPlate(plate: string): Promise<Vehicle | null> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`/api/vehicle/${encodeURIComponent(plate)}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }
    const cleanPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return this.vehicles.find(v => v.plate_number.replace(/[^A-Z0-9]/g, '') === cleanPlate) || null;
  }

  public async addVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVehicle),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend POST failed, saving locally', err);
      }
    }

    this.vehicles.unshift(newVehicle);
    return newVehicle;
  }

  public async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle> {
    return this.addVehicle(vehicle);
  }

  public async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`/api/vehicles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend PUT failed, updating locally', err);
      }
    }

    const idx = this.vehicles.findIndex(v => v.id === id);
    if (idx !== -1) {
      this.vehicles[idx] = { ...this.vehicles[idx], ...updates };
      return this.vehicles[idx];
    }
    throw new Error('Vehicle not found');
  }

  public async deleteVehicle(id: string): Promise<boolean> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Backend DELETE failed, removing locally', err);
      }
    }

    this.vehicles = this.vehicles.filter(v => v.id !== id);
    return true;
  }

  // Alerts
  public async getAlerts(): Promise<Alert[]> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend alerts failed', err);
      }
    }
    return [...this.alerts];
  }

  public async updateAlertStatus(id: string, status: AlertStatus, resolution_notes?: string): Promise<Alert> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch(`/api/alerts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, resolution_notes }),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }

    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.alerts[idx] = { ...this.alerts[idx], status, resolution_notes };
      return this.alerts[idx];
    }
    throw new Error('Alert not found');
  }

  public async createAlert(alertData: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> {
    const newAlert: Alert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAlert),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }

    this.alerts.unshift(newAlert);
    return newAlert;
  }

  // History
  public async getHistory(): Promise<EntryExitLog[]> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/history');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }
    return [...this.history];
  }

  public async recordGateEvent(event: {
    type: 'entry' | 'exit';
    vehicle_id: string;
    plate_number: string;
    vehicle_type: any;
    company: string;
    driver_name?: string;
    camera_id: string;
    time: string;
    auth_status: any;
  }) {
    if (event.type === 'entry') {
      const newLog: EntryExitLog = {
        id: `log-${Date.now()}`,
        vehicle_id: event.vehicle_id,
        plate_number: event.plate_number,
        vehicle_type: event.vehicle_type,
        company: event.company,
        driver_name: event.driver_name || 'Driver on Duty',
        camera_id: event.camera_id,
        entry_time: event.time,
        exit_time: null,
        duration_minutes: null,
        authorization_status: event.auth_status,
        status: 'Currently Inside',
        date: new Date().toISOString().split('T')[0],
        ocr_confidence: 96,
      };
      this.history.unshift(newLog);
      this.analytics.currently_inside += 1;
      this.analytics.total_vehicles_today += 1;
    } else {
      const active = this.history.find(h => h.plate_number === event.plate_number && h.status === 'Currently Inside');
      if (active) {
        active.exit_time = event.time;
        active.status = 'Exited';
        active.duration_minutes = Math.floor(25 + Math.random() * 80);
        this.analytics.currently_inside = Math.max(0, this.analytics.currently_inside - 1);
      }
    }
  }

  // Analytics
  public async getAnalytics(): Promise<AnalyticsData> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }
    return { ...this.analytics };
  }

  // Detections
  public async getDetections(): Promise<Detection[]> {
    if (this.isLiveBackend) {
      try {
        const res = await fetch('/api/detections');
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }
    return [...this.detections];
  }

  public recordDetection(det: Detection) {
    this.detections.unshift(det);
    if (this.detections.length > 50) this.detections.pop();

    this.analytics.total_plate_detections += 1;
    if (det.ocr_confidence < 75) {
      this.analytics.low_confidence_ocr_detections += 1;
    }
  }

  // AI-Powered High-Precision ANPR & Multi-Vehicle Plate Detection
  public async runANPRDetection(
    imageData: string,
    cameraId: string = 'Gate-01',
    manualHint?: string,
    cropImage?: string
  ): Promise<{
    success: boolean;
    engine: string;
    plate_detected?: boolean;
    vehicles: any[];
    message?: string;
    raw_ocr?: string;
    enhanced_crop?: string;
    preprocessing_variant?: string;
  }> {
    try {
      const res = await fetch('/api/anpr-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          cropImage,
          cameraId,
          manualHint,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('Backend ANPR endpoint call failed', err);
    }

    // Fallback if network fails
    return {
      success: false,
      engine: 'network-fallback',
      plate_detected: false,
      message: 'ANPR service connection error. Please retry.',
      vehicles: [],
    };
  }
}

export const apiService = new APIService();
export const api = apiService;
