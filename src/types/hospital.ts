export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type PatientStatus = 'Outpatient' | 'Inpatient' | 'Discharged' | 'Critical';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  validUntil: string;
}

export interface Patient {
  id: string; // e.g. PAT-1710000000-842
  name: string;
  dob: string; // YYYY-MM-DD
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  password?: string; // Account login password
  address: string;
  emergencyContact: EmergencyContact;
  allergies: string[];
  chronicConditions: string[];
  insurance: InsuranceInfo;
  registeredAt: string;
  status: PatientStatus;
  roomNumber?: string;
  assignedDoctorId?: string;
}

export type DoctorStatus = 'On Duty' | 'In Consultation' | 'On Break' | 'Off Duty';

export interface Doctor {
  id: string; // e.g. DOC-1710000000-101
  name: string;
  title: string;
  specialization: string;
  department: string;
  licenseNumber: string;
  email: string;
  password?: string; // Account login password
  phone: string;
  consultationFee: number;
  availableDays: string[];
  officeHours: string;
  roomNumber: string;
  rating: number;
  status: DoctorStatus;
  avatar?: string;
  bio?: string;
}

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'In-Progress' | 'Completed' | 'Cancelled';
export type AppointmentType = 'Routine Checkup' | 'Follow-up' | 'Emergency' | 'Specialist Consultation' | 'Diagnostic Review';

export interface Appointment {
  id: string; // e.g. APT-1710000000-302
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  fee: number;
  createdAt: string;
}

export interface ClinicalVitals {
  bpSystolic: number; // mmHg
  bpDiastolic: number; // mmHg
  heartRate: number; // bpm
  respiratoryRate: number; // breaths/min
  temperature: number; // °F
  oxygenSaturation: number; // %
  weightKg: number;
  heightCm: number;
}

export interface PrescriptionItem {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalRecord {
  id: string; // e.g. MED-1710000000-501
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  chiefComplaint: string;
  diagnosis: string;
  symptoms: string[];
  vitals: ClinicalVitals;
  prescriptions: PrescriptionItem[];
  labTestsOrdered: string[];
  clinicalNotes: string;
  followUpDate?: string;
  createdAt: string;
}

export interface WardRoom {
  id: string;
  roomNumber: string;
  department: string;
  type: 'General Ward' | 'Semi-Private' | 'ICU' | 'Pediatric Ward' | 'Cardiac Care';
  capacity: number;
  occupied: number;
  currentPatientIds: string[];
}

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AuthUser {
  role: UserRole;
  id: string;
  name: string;
  email: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  phone?: string;
  specialization?: string;
  department?: string;
}
