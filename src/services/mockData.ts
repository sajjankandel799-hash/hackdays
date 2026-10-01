import { Patient, Doctor, Appointment, MedicalRecord, WardRoom } from '../types/hospital';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-1710001001-101',
    name: 'Dr. Sarah Chen',
    title: 'MD, FACP — Head of Internal Medicine',
    specialization: 'Internal Medicine',
    department: 'General & Preventive Medicine',
    licenseNumber: 'MD-89241-NY',
    email: 'sarah.chen@stjudehospital.org',
    password: 'doctor123',
    phone: '+1 (555) 234-8891',
    consultationFee: 150,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    officeHours: '08:30 - 16:30',
    roomNumber: 'Suite 302',
    rating: 4.9,
    status: 'On Duty',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: '15+ years in clinical diagnostics, preventative cardiology, and complex chronic disease management.'
  },
  {
    id: 'DOC-1710001002-102',
    name: 'Dr. Marcus Vance',
    title: 'MD, FACC — Chief of Cardiology',
    specialization: 'Cardiology',
    department: 'Cardiovascular Institute',
    licenseNumber: 'MD-74312-CA',
    email: 'marcus.vance@stjudehospital.org',
    password: 'doctor123',
    phone: '+1 (555) 345-9920',
    consultationFee: 220,
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    officeHours: '09:00 - 17:00',
    roomNumber: 'Cardio Wing 410',
    rating: 4.95,
    status: 'In Consultation',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Specialist in interventional cardiology, echocardiography, and heart failure rehabilitation protocols.'
  },
  {
    id: 'DOC-1710001003-103',
    name: 'Dr. Elena Rostova',
    title: 'MD, PhD — Senior Neurosurgeon',
    specialization: 'Neurology',
    department: 'Neuroscience Center',
    licenseNumber: 'MD-92105-MA',
    email: 'elena.rostova@stjudehospital.org',
    password: 'doctor123',
    phone: '+1 (555) 456-1188',
    consultationFee: 260,
    availableDays: ['Tue', 'Wed', 'Fri'],
    officeHours: '10:00 - 18:00',
    roomNumber: 'Neuro Suite 508',
    rating: 4.88,
    status: 'On Duty',
    avatar: 'https://images.unsplash.com/photo-1594824813572-c5132d733cf6?auto=format&fit=crop&q=80&w=400',
    bio: 'Specializes in neurovascular disorders, epilepsy surgery, and advanced migraine management protocols.'
  },
  {
    id: 'DOC-1710001004-104',
    name: 'Dr. Julian Thorne',
    title: 'MD, FAAOS — Orthopedic Surgeon',
    specialization: 'Orthopedics',
    department: 'Musculoskeletal Institute',
    licenseNumber: 'MD-55891-IL',
    email: 'julian.thorne@stjudehospital.org',
    password: 'doctor123',
    phone: '+1 (555) 567-2234',
    consultationFee: 180,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    officeHours: '08:00 - 15:30',
    roomNumber: 'Ortho Clinic 204',
    rating: 4.82,
    status: 'On Break',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    bio: 'Expert in arthroscopic joint reconstruction, sports medicine injuries, and spinal biomechanics.'
  },
  {
    id: 'DOC-1710001005-105',
    name: 'Dr. Amara Okafor',
    title: 'MD, FAAP — Pediatric Specialist',
    specialization: 'Pediatrics',
    department: 'Children & Adolescent Health',
    licenseNumber: 'MD-67219-TX',
    email: 'amara.okafor@stjudehospital.org',
    password: 'doctor123',
    phone: '+1 (555) 678-4455',
    consultationFee: 130,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    officeHours: '09:00 - 16:30',
    roomNumber: 'Pediatrics Wing 105',
    rating: 4.96,
    status: 'On Duty',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    bio: 'Dedicated to developmental pediatrics, childhood immunization schedules, and acute pediatric care.'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-1710002001-841',
    name: 'Eleanor Sterling',
    dob: '1974-05-18',
    age: 52,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+1 (555) 912-3841',
    email: 'eleanor.sterling@example.com',
    password: 'patient123',
    address: '742 Evergreen Terrace, North Wingfield, NY 10024',
    emergencyContact: {
      name: 'Robert Sterling',
      relation: 'Spouse',
      phone: '+1 (555) 912-3849'
    },
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Stage 1 Hypertension', 'Mild Osteoarthritis'],
    insurance: {
      provider: 'BlueCross BlueShield Premier',
      policyNumber: 'BCBS-8839210-A',
      validUntil: '2027-12-31'
    },
    registeredAt: '2025-01-14T09:30:00Z',
    status: 'Outpatient',
    assignedDoctorId: 'DOC-1710001002-102'
  },
  {
    id: 'PAT-1710002002-842',
    name: 'David K. Miller',
    dob: '1986-11-23',
    age: 39,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+1 (555) 482-1920',
    email: 'd.miller86@example.com',
    password: 'patient123',
    address: '1504 Pine Crest Ave, Brooklyn, NY 11201',
    emergencyContact: {
      name: 'Claire Miller',
      relation: 'Sister',
      phone: '+1 (555) 482-1928'
    },
    allergies: ['Latex'],
    chronicConditions: ['Type 2 Diabetes Mellitus'],
    insurance: {
      provider: 'Aetna Health Advantage',
      policyNumber: 'AET-4910284',
      validUntil: '2026-11-30'
    },
    registeredAt: '2025-02-02T11:15:00Z',
    status: 'Inpatient',
    roomNumber: 'Room 304-B',
    assignedDoctorId: 'DOC-1710001001-101'
  },
  {
    id: 'PAT-1710002003-843',
    name: 'Maya Lin Rodriguez',
    dob: '2018-09-04',
    age: 7,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+1 (555) 301-4478',
    email: 'rodriguez.family@example.com',
    password: 'patient123',
    address: '88 Riverview Drive, Queens, NY 11375',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relation: 'Father',
      phone: '+1 (555) 301-4470'
    },
    allergies: ['Peanuts', 'Amoxicillin'],
    chronicConditions: ['Childhood Asthma'],
    insurance: {
      provider: 'UnitedHealthcare Community',
      policyNumber: 'UHC-1092837',
      validUntil: '2027-06-30'
    },
    registeredAt: '2025-02-18T14:20:00Z',
    status: 'Outpatient',
    assignedDoctorId: 'DOC-1710001005-105'
  },
  {
    id: 'PAT-1710002004-844',
    name: 'Arthur Pendelton',
    dob: '1955-03-12',
    age: 71,
    gender: 'Male',
    bloodGroup: 'AB-',
    phone: '+1 (555) 782-9011',
    email: 'arthur.pendelton@example.com',
    password: 'patient123',
    address: '320 Oak Ridge Court, White Plains, NY 10605',
    emergencyContact: {
      name: 'Grace Pendelton',
      relation: 'Daughter',
      phone: '+1 (555) 782-9019'
    },
    allergies: ['Aspirin', 'Iodine Contrast'],
    chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia', 'Atrial Fibrillation'],
    insurance: {
      provider: 'Medicare Part B & C',
      policyNumber: 'MED-7749201-B',
      validUntil: '2028-01-01'
    },
    registeredAt: '2025-01-05T08:00:00Z',
    status: 'Inpatient',
    roomNumber: 'ICU-02',
    assignedDoctorId: 'DOC-1710001002-102'
  },
  {
    id: 'PAT-1710002005-845',
    name: 'Sophia Nicole Ward',
    dob: '1998-08-30',
    age: 27,
    gender: 'Female',
    bloodGroup: 'O-',
    phone: '+1 (555) 621-8840',
    email: 'sophia.ward@example.com',
    password: 'patient123',
    address: '422 Lexington St, Apt 4C, New York, NY 10017',
    emergencyContact: {
      name: 'Liam Ward',
      relation: 'Brother',
      phone: '+1 (555) 621-8849'
    },
    allergies: [],
    chronicConditions: ['Chronic Migraine with Aura'],
    insurance: {
      provider: 'Cigna Open Access Plus',
      policyNumber: 'CG-5591283',
      validUntil: '2026-10-15'
    },
    registeredAt: '2025-03-01T10:45:00Z',
    status: 'Outpatient',
    assignedDoctorId: 'DOC-1710001003-103'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1710003001-301',
    patientId: 'PAT-1710002001-841',
    patientName: 'Eleanor Sterling',
    doctorId: 'DOC-1710001002-102',
    doctorName: 'Dr. Marcus Vance',
    doctorSpecialization: 'Cardiology',
    date: '2026-10-01',
    time: '09:30 AM',
    type: 'Follow-up',
    status: 'Confirmed',
    reason: 'Hypertension maintenance review and 24-hr Holter monitor results evaluation.',
    notes: 'Patient advised to bring current medication log.',
    fee: 220,
    createdAt: '2026-09-25T14:00:00Z'
  },
  {
    id: 'APT-1710003002-302',
    patientId: 'PAT-1710002002-842',
    patientName: 'David K. Miller',
    doctorId: 'DOC-1710001001-101',
    doctorName: 'Dr. Sarah Chen',
    doctorSpecialization: 'Internal Medicine',
    date: '2026-10-01',
    time: '11:00 AM',
    type: 'Diagnostic Review',
    status: 'In-Progress',
    reason: 'Inpatient glycemic control stabilization & HbA1c review.',
    notes: 'Checking insulin sensitivity after steroid taper.',
    fee: 150,
    createdAt: '2026-09-28T09:15:00Z'
  },
  {
    id: 'APT-1710003003-303',
    patientId: 'PAT-1710002005-845',
    patientName: 'Sophia Nicole Ward',
    doctorId: 'DOC-1710001003-103',
    doctorName: 'Dr. Elena Rostova',
    doctorSpecialization: 'Neurology',
    date: '2026-10-01',
    time: '02:15 PM',
    type: 'Specialist Consultation',
    status: 'Scheduled',
    reason: 'Acute refractory migraine flare-up with visual scintillations.',
    notes: 'Consider CGRP receptor antagonist trial if triptans are ineffective.',
    fee: 260,
    createdAt: '2026-09-29T16:20:00Z'
  },
  {
    id: 'APT-1710003004-304',
    patientId: 'PAT-1710002003-843',
    patientName: 'Maya Lin Rodriguez',
    doctorId: 'DOC-1710001005-105',
    doctorName: 'Dr. Amara Okafor',
    doctorSpecialization: 'Pediatrics',
    date: '2026-10-02',
    time: '10:00 AM',
    type: 'Routine Checkup',
    status: 'Scheduled',
    reason: 'Seasonal asthma control action plan update and spirometry review.',
    fee: 130,
    createdAt: '2026-09-28T11:30:00Z'
  },
  {
    id: 'APT-1710003005-305',
    patientId: 'PAT-1710002004-844',
    patientName: 'Arthur Pendelton',
    doctorId: 'DOC-1710001002-102',
    doctorName: 'Dr. Marcus Vance',
    doctorSpecialization: 'Cardiology',
    date: '2026-09-30',
    time: '04:00 PM',
    type: 'Emergency',
    status: 'Completed',
    reason: 'Acute paroxysmal atrial fibrillation with chest tightness.',
    notes: 'Admitted to Cardiac Care ICU-02 for telemetry observation and IV beta-blocker infusion.',
    fee: 300,
    createdAt: '2026-09-30T15:30:00Z'
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'MED-1710004001-501',
    patientId: 'PAT-1710002001-841',
    patientName: 'Eleanor Sterling',
    doctorId: 'DOC-1710001002-102',
    doctorName: 'Dr. Marcus Vance',
    date: '2026-09-20',
    chiefComplaint: 'Intermittent morning palpitations and mild exertional dyspnea.',
    diagnosis: 'Essential Hypertension (Stage 1), well-controlled; benign sinus tachycardia.',
    symptoms: ['Palpitations', 'Mild headache', 'Occasional dizziness upon standing'],
    vitals: {
      bpSystolic: 134,
      bpDiastolic: 86,
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 98.4,
      oxygenSaturation: 99,
      weightKg: 68.5,
      heightCm: 165
    },
    prescriptions: [
      {
        id: 'rx-1',
        medicine: 'Lisinopril',
        dosage: '10 mg',
        frequency: 'Once daily (morning)',
        duration: '90 days',
        instructions: 'Take with or without food. Monitor blood pressure weekly.'
      },
      {
        id: 'rx-2',
        medicine: 'Amlodipine Besylate',
        dosage: '5 mg',
        frequency: 'Once daily (evening)',
        duration: '90 days',
        instructions: 'Report any peripheral ankle swelling.'
      }
    ],
    labTestsOrdered: ['Serum Electrolytes & Creatinine', 'Lipid Panel Fasting', '12-Lead ECG'],
    clinicalNotes: 'Cardiovascular examination demonstrated regular rate and rhythm with no murmurs, rubs, or gallops. S1 and S2 crisp. Lungs clear to auscultation bilaterally. Patient cautioned regarding sodium intake and encouraged to continue 30 min daily brisk walking.',
    followUpDate: '2026-10-01',
    createdAt: '2026-09-20T11:45:00Z'
  },
  {
    id: 'MED-1710004002-502',
    patientId: 'PAT-1710002002-842',
    patientName: 'David K. Miller',
    doctorId: 'DOC-1710001001-101',
    doctorName: 'Dr. Sarah Chen',
    date: '2026-09-28',
    chiefComplaint: 'Persistent polydipsia, peripheral tingling sensation in lower extremities, elevated fasting glucose (>210 mg/dL).',
    diagnosis: 'Type 2 Diabetes Mellitus with early peripheral sensorimotor neuropathy.',
    symptoms: ['Polyuria', 'Polydipsia', 'Nocturnal foot paresthesia', 'Fatigue'],
    vitals: {
      bpSystolic: 128,
      bpDiastolic: 82,
      heartRate: 74,
      respiratoryRate: 15,
      temperature: 98.6,
      oxygenSaturation: 98,
      weightKg: 89.2,
      heightCm: 180
    },
    prescriptions: [
      {
        id: 'rx-3',
        medicine: 'Metformin Hydrochloride XR',
        dosage: '1000 mg',
        frequency: 'Twice daily with meals',
        duration: '60 days',
        instructions: 'Take with dinner. Avoid alcohol.'
      },
      {
        id: 'rx-4',
        medicine: 'Empagliflozin (Jardiance)',
        dosage: '10 mg',
        frequency: 'Once daily (morning)',
        duration: '60 days',
        instructions: 'Ensure adequate fluid hydration throughout the day.'
      },
      {
        id: 'rx-5',
        medicine: 'Alpha-Lipoic Acid',
        dosage: '600 mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Supports diabetic neuropathy antioxidant defense.'
      }
    ],
    labTestsOrdered: ['HbA1c Glycated Hemoglobin', 'Urine Albumin-to-Creatinine Ratio (ACR)', 'Comprehensive Metabolic Panel'],
    clinicalNotes: 'Bilateral monofilament testing confirmed reduced vibratory and protective sensation across plantar surface of feet. Monitored in semi-private Room 304-B for glucose curve titration. Referred to hospital certified diabetes educator (CDE).',
    followUpDate: '2026-10-08',
    createdAt: '2026-09-28T14:30:00Z'
  },
  {
    id: 'MED-1710004003-503',
    patientId: 'PAT-1710002004-844',
    patientName: 'Arthur Pendelton',
    doctorId: 'DOC-1710001002-102',
    doctorName: 'Dr. Marcus Vance',
    date: '2026-09-30',
    chiefComplaint: 'Sudden onset rapid heart flutter, retrosternal chest fullness, diaphoresis while climbing stairs.',
    diagnosis: 'Paroxysmal Atrial Fibrillation with rapid ventricular response (RVR).',
    symptoms: ['Irregular heart rhythm', 'Chest pressure', 'Lightheadedness', 'Mild diaphoresis'],
    vitals: {
      bpSystolic: 142,
      bpDiastolic: 94,
      heartRate: 138,
      respiratoryRate: 20,
      temperature: 98.2,
      oxygenSaturation: 96,
      weightKg: 82.0,
      heightCm: 175
    },
    prescriptions: [
      {
        id: 'rx-6',
        medicine: 'Metoprolol Tartrate',
        dosage: '25 mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Check pulse before taking; do not take if pulse < 55 bpm.'
      },
      {
        id: 'rx-7',
        medicine: 'Apixaban (Eliquis)',
        dosage: '5 mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Oral anticoagulant for stroke prevention. Take consistently.'
      }
    ],
    labTestsOrdered: ['Troponin I High Sensitivity (q3h x 2)', 'D-Dimer', 'Coagulation Prothrombin Time (PT/INR)', 'Transthoracic Echocardiogram'],
    clinicalNotes: '12-lead ECG demonstrated irregularly irregular rhythm consistent with AFib RVR at 138 bpm. Negative acute ischemic changes. Administered IV Metoprolol in emergency bay with rate reduction to 88 bpm. Patient admitted to Cardiac Care Unit (ICU-02).',
    followUpDate: '2026-10-07',
    createdAt: '2026-09-30T17:15:00Z'
  }
];

export const INITIAL_ROOMS: WardRoom[] = [
  {
    id: 'room-1',
    roomNumber: 'Room 304-B',
    department: 'Internal Medicine',
    type: 'Semi-Private',
    capacity: 2,
    occupied: 1,
    currentPatientIds: ['PAT-1710002002-842']
  },
  {
    id: 'room-2',
    roomNumber: 'ICU-02',
    department: 'Critical & Cardiac Care',
    type: 'ICU',
    capacity: 1,
    occupied: 1,
    currentPatientIds: ['PAT-1710002004-844']
  },
  {
    id: 'room-3',
    roomNumber: 'Ward 102',
    department: 'Pediatrics',
    type: 'Pediatric Ward',
    capacity: 4,
    occupied: 0,
    currentPatientIds: []
  },
  {
    id: 'room-4',
    roomNumber: 'Room 205',
    department: 'Orthopedics',
    type: 'General Ward',
    capacity: 6,
    occupied: 2,
    currentPatientIds: []
  },
  {
    id: 'room-5',
    roomNumber: 'Cardiac 408',
    department: 'Cardiology',
    type: 'Cardiac Care',
    capacity: 2,
    occupied: 1,
    currentPatientIds: []
  }
];
