import { Patient, Doctor, Appointment, MedicalRecord, WardRoom, UserAccount, UserRole } from '../types/hospital';
import { INITIAL_PATIENTS, INITIAL_DOCTORS, INITIAL_APPOINTMENTS, INITIAL_MEDICAL_RECORDS, INITIAL_ROOMS } from './mockData';

const STORAGE_KEYS = {
  PATIENTS: 'hms_patients_v1',
  DOCTORS: 'hms_doctors_v1',
  APPOINTMENTS: 'hms_appointments_v1',
  RECORDS: 'hms_medical_records_v1',
  ROOMS: 'hms_ward_rooms_v1',
  ACCOUNTS: 'hms_accounts_v1',
};

export interface VirtualFile {
  path: string; // e.g., "data/patients/PAT-1710002001-841.json"
  category: 'patients' | 'doctors' | 'appointments' | 'medical-records' | 'system';
  filename: string;
  sizeBytes: number;
  lastModified: string;
  content: string; // Formatted JSON string
}

class StorageService {
  constructor() {
    this.initIfEmpty();
  }

  private initIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_MEDICAL_RECORDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      this.initDefaultAccounts();
    }
  }

  private initDefaultAccounts() {
    const defaultAccounts: UserAccount[] = [
      {
        id: 'admin-1',
        name: 'Sajjan Kandel',
        email: 'sajjankandel799@gmail.com',
        password: 'admin123',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00Z',
        department: 'Hospital Administration & Executive Command'
      },
      {
        id: 'admin-2',
        name: 'System Administrator',
        email: 'admin@medicare.com',
        password: 'admin123',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00Z',
        department: 'IT & Clinical Operations'
      }
    ];

    // Seed doctors into accounts
    INITIAL_DOCTORS.forEach(doc => {
      defaultAccounts.push({
        id: doc.id,
        name: doc.name,
        email: doc.email.toLowerCase(),
        password: doc.password || 'doctor123',
        role: 'doctor',
        createdAt: '2025-01-10T00:00:00Z',
        phone: doc.phone,
        specialization: doc.specialization,
        department: doc.department
      });
    });

    // Seed patients into accounts
    INITIAL_PATIENTS.forEach(pat => {
      defaultAccounts.push({
        id: pat.id,
        name: pat.name,
        email: pat.email.toLowerCase(),
        password: pat.password || 'patient123',
        role: 'patient',
        createdAt: pat.registeredAt || '2025-01-14T00:00:00Z',
        phone: pat.phone
      });
    });

    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(defaultAccounts));
  }

  // ACCOUNTS & CREDENTIALS
  getAccounts(): UserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (data) {
        return JSON.parse(data);
      }
      this.initDefaultAccounts();
      const fresh = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return fresh ? JSON.parse(fresh) : [];
    } catch {
      return [];
    }
  }

  saveAccount(account: UserAccount): void {
    const list = this.getAccounts();
    const cleanEmail = account.email.trim().toLowerCase();
    const index = list.findIndex(a => a.id === account.id || (a.email.toLowerCase() === cleanEmail && a.role === account.role));
    if (index >= 0) {
      list[index] = { ...list[index], ...account, email: cleanEmail };
    } else {
      list.push({ ...account, email: cleanEmail });
    }
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(list));
  }

  updatePassword(idOrEmail: string, newPass: string): boolean {
    const list = this.getAccounts();
    const target = idOrEmail.trim().toLowerCase();
    let found = false;

    // 1. Update in accounts list
    list.forEach(acc => {
      if (acc.id.toLowerCase() === target || acc.email.toLowerCase() === target) {
        acc.password = newPass;
        found = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(list));

    // 2. Also update in patients list if match
    const patients = this.getPatients();
    patients.forEach(p => {
      if (p.id.toLowerCase() === target || p.email.toLowerCase() === target) {
        p.password = newPass;
        found = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));

    // 3. Also update in doctors list if match
    const doctors = this.getDoctors();
    doctors.forEach(d => {
      if (d.id.toLowerCase() === target || d.email.toLowerCase() === target) {
        d.password = newPass;
        found = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));

    return found;
  }

  deleteAccount(id: string): void {
    const list = this.getAccounts().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(list));
  }

  // PATIENTS
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      const list: Patient[] = data ? JSON.parse(data) : INITIAL_PATIENTS;
      
      // Ensure password exists on every patient object
      const accounts = this.getAccounts();
      return list.map(p => {
        if (!p.password) {
          const acc = accounts.find(a => a.id === p.id || a.email.toLowerCase() === p.email.toLowerCase());
          p.password = acc?.password || 'patient123';
        }
        return p;
      });
    } catch {
      return INITIAL_PATIENTS;
    }
  }

  savePatient(patient: Patient): void {
    const list = this.getPatients();
    const effectivePassword = patient.password?.trim() || 'patient123';
    const patientWithPass: Patient = {
      ...patient,
      password: effectivePassword
    };

    const index = list.findIndex(p => p.id === patient.id);
    if (index >= 0) {
      list[index] = patientWithPass;
    } else {
      list.unshift(patientWithPass);
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(list));

    // Synchronize account vault
    this.saveAccount({
      id: patient.id,
      name: patient.name,
      email: patient.email.toLowerCase(),
      password: effectivePassword,
      role: 'patient',
      createdAt: patient.registeredAt || new Date().toISOString(),
      phone: patient.phone
    });
  }

  deletePatient(id: string): void {
    const list = this.getPatients().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(list));
    this.deleteAccount(id);
  }

  // DOCTORS
  getDoctors(): Doctor[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      const list: Doctor[] = data ? JSON.parse(data) : INITIAL_DOCTORS;

      // Ensure password exists on every doctor object
      const accounts = this.getAccounts();
      return list.map(d => {
        if (!d.password) {
          const acc = accounts.find(a => a.id === d.id || a.email.toLowerCase() === d.email.toLowerCase());
          d.password = acc?.password || 'doctor123';
        }
        return d;
      });
    } catch {
      return INITIAL_DOCTORS;
    }
  }

  saveDoctor(doctor: Doctor): void {
    const list = this.getDoctors();
    const effectivePassword = doctor.password?.trim() || 'doctor123';
    const doctorWithPass: Doctor = {
      ...doctor,
      password: effectivePassword
    };

    const index = list.findIndex(d => d.id === doctor.id);
    if (index >= 0) {
      list[index] = doctorWithPass;
    } else {
      list.unshift(doctorWithPass);
    }
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(list));

    // Synchronize account vault
    this.saveAccount({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email.toLowerCase(),
      password: effectivePassword,
      role: 'doctor',
      createdAt: new Date().toISOString(),
      phone: doctor.phone,
      specialization: doctor.specialization,
      department: doctor.department
    });
  }

  deleteDoctor(id: string): void {
    const list = this.getDoctors().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(list));
    this.deleteAccount(id);
  }

  // APPOINTMENTS
  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  }

  saveAppointment(appointment: Appointment): void {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      list[index] = appointment;
    } else {
      list.unshift(appointment);
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  }

  updateAppointmentStatus(id: string, status: Appointment['status']): void {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], status };
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    }
  }

  deleteAppointment(id: string): void {
    const list = this.getAppointments().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  }

  // MEDICAL RECORDS
  getMedicalRecords(): MedicalRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return data ? JSON.parse(data) : INITIAL_MEDICAL_RECORDS;
    } catch {
      return INITIAL_MEDICAL_RECORDS;
    }
  }

  saveMedicalRecord(record: MedicalRecord): void {
    const list = this.getMedicalRecords();
    const index = list.findIndex(r => r.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(list));
  }

  deleteMedicalRecord(id: string): void {
    const list = this.getMedicalRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(list));
  }

  // WARDS & ROOMS
  getWardRooms(): WardRoom[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
      return data ? JSON.parse(data) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  }

  saveWardRoom(room: WardRoom): void {
    const list = this.getWardRooms();
    const index = list.findIndex(r => r.id === room.id);
    if (index >= 0) {
      list[index] = room;
    } else {
      list.push(room);
    }
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(list));
  }

  // FILE SYSTEM MIRROR (Representing data/patients/*.json, etc.)
  getAllVirtualFiles(): VirtualFile[] {
    const files: VirtualFile[] = [];

    // Patients
    this.getPatients().forEach(p => {
      const content = JSON.stringify(p, null, 2);
      files.push({
        path: `data/patients/${p.id}.json`,
        category: 'patients',
        filename: `${p.id}.json`,
        sizeBytes: new Blob([content]).size,
        lastModified: p.registeredAt || new Date().toISOString(),
        content
      });
    });

    // Doctors
    this.getDoctors().forEach(d => {
      const content = JSON.stringify(d, null, 2);
      files.push({
        path: `data/doctors/${d.id}.json`,
        category: 'doctors',
        filename: `${d.id}.json`,
        sizeBytes: new Blob([content]).size,
        lastModified: new Date().toISOString(),
        content
      });
    });

    // Appointments
    this.getAppointments().forEach(a => {
      const content = JSON.stringify(a, null, 2);
      files.push({
        path: `data/appointments/${a.id}.json`,
        category: 'appointments',
        filename: `${a.id}.json`,
        sizeBytes: new Blob([content]).size,
        lastModified: a.createdAt || new Date().toISOString(),
        content
      });
    });

    // Medical Records
    this.getMedicalRecords().forEach(r => {
      const content = JSON.stringify(r, null, 2);
      files.push({
        path: `data/medical-records/${r.id}.json`,
        category: 'medical-records',
        filename: `${r.id}.json`,
        sizeBytes: new Blob([content]).size,
        lastModified: r.createdAt || new Date().toISOString(),
        content
      });
    });

    // Accounts Vault File
    const accountsContent = JSON.stringify(this.getAccounts(), null, 2);
    files.push({
      path: `data/system/user-accounts-vault.json`,
      category: 'system',
      filename: `user-accounts-vault.json`,
      sizeBytes: new Blob([accountsContent]).size,
      lastModified: new Date().toISOString(),
      content: accountsContent
    });

    return files;
  }

  // EXPORT / IMPORT / RESET
  exportConsolidatedJson(): string {
    const bundle = {
      hospital: 'St. Jude Clinical Hospital Management System',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      data: {
        accounts: this.getAccounts(),
        patients: this.getPatients(),
        doctors: this.getDoctors(),
        appointments: this.getAppointments(),
        medicalRecords: this.getMedicalRecords(),
        wardRooms: this.getWardRooms(),
      }
    };
    return JSON.stringify(bundle, null, 2);
  }

  importConsolidatedJson(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      if (Array.isArray(data.accounts)) {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(data.accounts));
      }
      if (Array.isArray(data.patients)) {
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(data.patients));
      }
      if (Array.isArray(data.doctors)) {
        localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(data.doctors));
      }
      if (Array.isArray(data.appointments)) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
      }
      if (Array.isArray(data.medicalRecords)) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(data.medicalRecords));
      }
      if (Array.isArray(data.wardRooms)) {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(data.wardRooms));
      }
      return { success: true, message: 'All hospital files and clinical records successfully imported.' };
    } catch (e) {
      return { success: false, message: `Failed to import JSON: ${(e as Error).message}` };
    }
  }

  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_MEDICAL_RECORDS));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    this.initDefaultAccounts();
  }
}

export const storage = new StorageService();
