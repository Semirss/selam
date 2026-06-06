export interface Profile {
  id: string;
  role: 'client' | 'doctor' | 'agent';
  full_name: string;
  language: string;
  avatar_url?: string;
  blood_type?: string;
  phone: string;
  pin_hash: string;
  created_at: string;
}

export interface PatientRecord {
  id: string;
  user_id: string;
  qr_uid: string;
  blood_type?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  updated_at: string;
  profiles?: Profile;
  diagnoses?: Diagnosis[];
  emergency_contacts?: EmergencyContact[];
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  doctor_id: string;
  notes: string;
  diagnosis_code: string;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  blood_type?: string;
  relationship?: string;
}

export interface WellnessSession {
  id: string;
  user_id: string;
  type: 'ai' | 'live';
  anonymous: boolean;
  started_at: string;
  ended_at?: string;
}

export interface WellnessMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  score: number;
  notes?: string;
  created_at: string;
}

export interface AwarenessPost {
  id: string;
  author_id: string;
  category: string;
  title_en?: string;
  title_am?: string;
  title_ti?: string;
  title_om?: string;
  body_en?: string;
  body_am?: string;
  body_ti?: string;
  body_om?: string;
  published_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone?: string;
  type?: string;
  region?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium' | 'doctor';
  status: string;
  expires_at?: string;
}
