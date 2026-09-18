export type VehicleType = 'Truck' | 'Concrete Mixer' | 'Dump Truck' | 'Lorry' | 'Van' | 'Pickup' | 'Flatbed' | 'Car' | 'Other';

export type AuthorizationStatus = 'authorized' | 'unauthorized' | 'expired';

export type AlertType = 'unauthorized_vehicle' | 'expired_permit' | 'low_confidence_ocr' | 'unreadable_plate' | 'repeated_failed_ocr';

export type AlertStatus = 'new' | 'reviewed' | 'resolved';

export interface Vehicle {
  id: string;
  vehicle_id: string;
  plate_number: string;
  vehicle_type: VehicleType;
  company: string;
  driver_name: string;
  contact_number: string;
  authorization_status: AuthorizationStatus;
  permit_start_date: string;
  permit_expiry_date: string;
  notes?: string;
  created_at: string;
}

export interface FrameOCRDetail {
  frame_number: number;
  raw_text: string;
  confidence: number;
  blur_score: number;
  quality_status: 'Good' | 'Poor';
  timestamp: string;
  crop_data_url?: string;
}

export interface MultiFrameFusionResult {
  vehicle_id: string;
  frame_count: number;
  individual_frames: FrameOCRDetail[];
  fused_plate: string;
  fused_confidence: number;
  character_voting: {
    position: number;
    candidates: { char: string; votes: number; avg_conf: number }[];
    chosen_char: string;
  }[];
  algorithm: 'Multi-Frame Weighted Character Fusion';
}

export interface PlateQualityAssessment {
  blur_score: number; // 0 - 100 (Laplacian variance normalized)
  brightness: number; // 0 - 100
  contrast: number; // 0 - 100
  resolution_score: number; // 0 - 100
  overall_quality: number; // 0 - 100
  status: 'Good' | 'Poor';
  preprocessing_applied: string[];
  deskew_angle?: number; // Detected tilt angle in degrees (-15 to +15)
  laplacian_sharpness?: number; // Raw Laplacian variance metric
  syntax_valid?: boolean;
  positional_corrections?: string[];
  rto_code?: string;
  rto_district?: string;
}

export interface Detection {
  id: string;
  vehicle_id: string; // e.g. V023
  vehicle_type: VehicleType;
  plate_number: string;
  plate_detected: boolean;
  plate_confidence: number; // 0 - 100
  ocr_confidence: number; // 0 - 100
  camera_id: string;
  camera_name: string;
  timestamp: string;
  authorization_status: AuthorizationStatus;
  plate_quality: PlateQualityAssessment;
  multi_frame_fusion: MultiFrameFusionResult;
  bbox_vehicle: [number, number, number, number]; // x, y, width, height (normalized 0-1)
  bbox_plate?: [number, number, number, number];
  plate_crop_url?: string;
  gate_zone?: 'approaching' | 'entry_crossed' | 'exit_crossed' | 'on_site';
}

export interface EntryExitLog {
  id: string;
  vehicle_id: string;
  plate_number: string;
  vehicle_type: VehicleType;
  company: string;
  driver_name: string;
  camera_id: string;
  entry_time: string;
  exit_time?: string | null;
  duration_minutes?: number | null;
  authorization_status: AuthorizationStatus;
  status: 'Currently Inside' | 'Exited' | 'Departed' | 'Inside Perimeter' | 'Detained at Gate' | string;
  date: string;
  ocr_confidence: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  plate_number: string;
  vehicle_id?: string;
  camera_id: string;
  camera_name: string;
  timestamp: string;
  status: AlertStatus;
  severity?: 'high' | 'medium' | 'low';
  assigned_to?: string;
  resolution_notes?: string;
}

export interface CameraConfig {
  id: string;
  name: string;
  location: string;
  rtsp_url: string;
  fps: number;
  status: 'online' | 'offline' | 'calibrating';
  entry_line_y: number; // 0.0 - 1.0
  exit_line_y: number;
}

export interface AnalyticsData {
  total_vehicles_today: number;
  unique_vehicles: number;
  authorized_vehicles: number;
  unauthorized_vehicles: number;
  currently_inside: number;
  average_stay_duration_minutes: number;
  total_plate_detections: number;
  low_confidence_ocr_detections: number;
  vehicles_per_hour: { hour: string; count: number; authorized: number; unauthorized: number }[];
  vehicle_type_distribution: { type: VehicleType; count: number; percentage: number }[];
  daily_traffic: { date: string; day: string; count: number; authorized: number; unauthorized: number }[];
  average_stay_by_type: { type: VehicleType; duration_minutes: number }[];
  frequently_seen_vehicles: {
    plate_number: string;
    vehicle_type: VehicleType;
    company: string;
    visit_count: number;
    authorization_status: AuthorizationStatus;
    last_seen: string;
  }[];
  ocr_performance: {
    successful_ocr: number;
    low_confidence_ocr: number;
    unreadable_plates: number;
    success_rate: number;
  };
}

export interface UserSession {
  username: string;
  role: string;
  name: string;
  shift: string;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ANPRVehicleResult {
  vehicle_id: string;
  vehicle_type: VehicleType;
  plate_number: string;
  ocr_confidence: number;
  color?: string;
  authorization_status?: AuthorizationStatus;
  company?: string;
  bbox_vehicle?: [number, number, number, number];
  bbox_plate?: [number, number, number, number];
  plate_quality?: PlateQualityAssessment;
}

export interface ANPRDetectionResponse {
  success: boolean;
  engine: string;
  vehicles: ANPRVehicleResult[];
  error?: string;
}

