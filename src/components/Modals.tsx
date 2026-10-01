import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  Stethoscope, 
  Pill, 
  Activity, 
  Plus, 
  Trash2, 
  AlertCircle, 
  FileText,
  Heart,
  Droplet,
  Phone,
  ShieldCheck,
  MapPin,
  DollarSign
} from 'lucide-react';
import { 
  Patient, 
  Doctor, 
  Appointment, 
  MedicalRecord, 
  BloodGroup, 
  PatientStatus, 
  AppointmentType,
  PrescriptionItem 
} from '../types/hospital';

// -------------------------------------------------------------
// 1. PATIENT MODAL (Create & Edit)
// -------------------------------------------------------------
interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  initialData?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('1990-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergiesStr, setAllergiesStr] = useState('');
  const [chronicStr, setChronicStr] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('BlueCross Premier');
  const [insurancePolicy, setInsurancePolicy] = useState('BC-109283');
  const [status, setStatus] = useState<PatientStatus>('Outpatient');
  const [roomNumber, setRoomNumber] = useState('');
  const [password, setPassword] = useState('patient123');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDob(initialData.dob);
      setGender(initialData.gender);
      setBloodGroup(initialData.bloodGroup);
      setPhone(initialData.phone);
      setEmail(initialData.email);
      setPassword(initialData.password || 'patient123');
      setAddress(initialData.address);
      setEmergencyName(initialData.emergencyContact.name);
      setEmergencyRelation(initialData.emergencyContact.relation);
      setEmergencyPhone(initialData.emergencyContact.phone);
      setAllergiesStr(initialData.allergies.join(', '));
      setChronicStr(initialData.chronicConditions.join(', '));
      setInsuranceProvider(initialData.insurance.provider);
      setInsurancePolicy(initialData.insurance.policyNumber);
      setStatus(initialData.status);
      setRoomNumber(initialData.roomNumber || '');
    } else {
      setName('');
      setDob('1992-06-15');
      setGender('Female');
      setBloodGroup('O+');
      setPhone('+1 (555) 392-1092');
      setEmail('');
      setPassword('patient123');
      setAddress('124 Medical Way, New York, NY 10001');
      setEmergencyName('Family Contact');
      setEmergencyRelation('Spouse');
      setEmergencyPhone('+1 (555) 392-1099');
      setAllergiesStr('');
      setChronicStr('');
      setInsuranceProvider('Aetna Health Advantage');
      setInsurancePolicy('AET-994821');
      setStatus('Outpatient');
      setRoomNumber('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculate age from dob
    const birthYear = new Date(dob).getFullYear() || 1990;
    const currentYear = 2026;
    const age = Math.max(1, currentYear - birthYear);

    const allergies = allergiesStr ? allergiesStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    const chronicConditions = chronicStr ? chronicStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const patient: Patient = {
      id: initialData?.id || `PAT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      name,
      dob,
      age,
      gender,
      bloodGroup,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@patient.stjude.org`,
      password: password.trim() || 'patient123',
      address,
      emergencyContact: {
        name: emergencyName || 'Primary Relative',
        relation: emergencyRelation || 'Family',
        phone: emergencyPhone || phone
      },
      allergies,
      chronicConditions,
      insurance: {
        provider: insuranceProvider,
        policyNumber: insurancePolicy,
        validUntil: '2028-12-31'
      },
      registeredAt: initialData?.registeredAt || new Date().toISOString(),
      status,
      roomNumber: roomNumber.trim() ? roomNumber.trim() : undefined
    };

    onSave(patient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Patient Information' : 'Register New Patient'}
            </h3>
            <p className="text-xs text-slate-500">
              Enter demographic, contact, and insurance details to register in local JSON storage.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: DOB & Blood Group & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono font-bold cursor-pointer"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clinical Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PatientStatus)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Outpatient">Outpatient</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Critical">Critical</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          {/* Row 3: Contact Phone & Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Portal Password</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="patient123"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Row 4: Address */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address, city, state, zip"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Row 5: Emergency Contact */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-700 block">Emergency Contact</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Contact Name"
                className="p-1.5 border border-slate-300 rounded bg-white"
              />
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                placeholder="Relationship"
                className="p-1.5 border border-slate-300 rounded bg-white"
              />
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="Emergency Phone"
                className="p-1.5 border border-slate-300 rounded bg-white font-mono"
              />
            </div>
          </div>

          {/* Row 6: Allergies & Chronic Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Known Drug/Food Allergies (comma-separated)
              </label>
              <input
                type="text"
                value={allergiesStr}
                onChange={(e) => setAllergiesStr(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Latex"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Chronic Medical Conditions (comma-separated)
              </label>
              <input
                type="text"
                value={chronicStr}
                onChange={(e) => setChronicStr(e.target.value)}
                placeholder="e.g. Hypertension, Type 2 Diabetes"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Row 7: Insurance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Insurance Provider</label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                placeholder="e.g. BlueCross BlueShield"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Policy Number</label>
              <input
                type="text"
                value={insurancePolicy}
                onChange={(e) => setInsurancePolicy(e.target.value)}
                placeholder="BC-88910"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. DOCTOR MODAL (Create & Edit)
// -------------------------------------------------------------
interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
  initialData?: Doctor | null;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [department, setDepartment] = useState('Cardiovascular Institute');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationFee, setConsultationFee] = useState<number>(180);
  const [officeHours, setOfficeHours] = useState('09:00 - 17:00');
  const [roomNumber, setRoomNumber] = useState('Suite 401');
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [status, setStatus] = useState<Doctor['status']>('On Duty');
  const [password, setPassword] = useState('doctor123');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTitle(initialData.title);
      setSpecialization(initialData.specialization);
      setDepartment(initialData.department);
      setLicenseNumber(initialData.licenseNumber);
      setEmail(initialData.email);
      setPassword(initialData.password || 'doctor123');
      setPhone(initialData.phone);
      setConsultationFee(initialData.consultationFee);
      setOfficeHours(initialData.officeHours);
      setRoomNumber(initialData.roomNumber);
      setAvailableDays(initialData.availableDays);
      setStatus(initialData.status);
    } else {
      setName('');
      setTitle('MD — Attending Physician');
      setSpecialization('Cardiology');
      setDepartment('Cardiovascular Center');
      setLicenseNumber(`MD-${Math.floor(Math.random() * 80000 + 10000)}-NY`);
      setEmail('');
      setPassword('doctor123');
      setPhone('+1 (555) 881-2091');
      setConsultationFee(175);
      setOfficeHours('09:00 - 16:30');
      setRoomNumber('Clinic Room 302');
      setAvailableDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      setStatus('On Duty');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const doctor: Doctor = {
      id: initialData?.id || `DOC-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      name,
      title,
      specialization,
      department,
      licenseNumber,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@stjudehospital.org`,
      password: password.trim() || 'doctor123',
      phone,
      consultationFee,
      availableDays: availableDays.length ? availableDays : ['Mon', 'Tue', 'Wed'],
      officeHours,
      roomNumber,
      rating: initialData?.rating || 4.9,
      status,
      avatar: initialData?.avatar
    };

    onSave(doctor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Physician Information' : 'Add New Physician to Roster'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure credentials, department, consulting rate, and scheduling availability.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Doctor Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alexander Wright"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="MD, FACC — Senior Cardiologist"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setDepartment(`${e.target.value} Department`);
                }}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Oncology">Oncology</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="MD-84910-NY"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Doctor Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@medicare.com"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Doctor Portal Password *</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="doctor123"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clinic Room</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Suite 304"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Office Hours</label>
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                placeholder="09:00 - 17:00"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Available Consulting Days</label>
            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                const active = availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium border transition-colors cursor-pointer ${
                      active 
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {initialData ? 'Update Profile' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. APPOINTMENT MODAL (Schedule New)
// -------------------------------------------------------------
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  patients: Patient[];
  doctors: Doctor[];
  preselectedPatientId?: string;
  preselectedDoctorId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  doctors,
  preselectedPatientId,
  preselectedDoctorId
}) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('2026-10-02');
  const [time, setTime] = useState('10:00 AM');
  const [type, setType] = useState<AppointmentType>('Routine Checkup');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (preselectedPatientId) {
      setPatientId(preselectedPatientId);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
    if (preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
    } else if (doctors.length > 0) {
      setDoctorId(doctors[0].id);
    }
  }, [isOpen, preselectedPatientId, preselectedDoctorId, patients, doctors]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);
    if (!patient || !doctor) return;

    const apt: Appointment = {
      id: `APT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      date,
      time,
      type,
      status: 'Scheduled',
      reason: reason || 'Comprehensive clinical consultation & review.',
      notes,
      fee: doctor.consultationFee,
      createdAt: new Date().toISOString()
    };

    onSave(apt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Schedule Clinic Appointment
            </h3>
            <p className="text-xs text-slate-500">
              Match patient with physician schedule and assign consultation parameters.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Patient *</label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) • {p.age}y • Blood: {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Attending Physician *</label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialization}) • ${d.consultationFee} • {d.roomNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Appointment Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono cursor-pointer"
              >
                <option value="08:30 AM">08:30 AM</option>
                <option value="09:15 AM">09:15 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:15 PM">02:15 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          {/* Visit Type */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Visit Classification</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AppointmentType)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Specialist Consultation">Specialist Consultation</option>
              <option value="Diagnostic Review">Diagnostic Review</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Primary Clinical Reason</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Hypertension management checkup and blood pressure review"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Internal Clinical Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for physician..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. MEDICAL RECORD MODAL (Create New EHR)
// -------------------------------------------------------------
interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MedicalRecord) => void;
  patients: Patient[];
  doctors: Doctor[];
  preselectedPatientId?: string;
  preselectedDoctorId?: string;
}

export const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  doctors,
  preselectedPatientId,
  preselectedDoctorId
}) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('2026-10-01');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptomsStr, setSymptomsStr] = useState('');

  // Vitals
  const [bpSystolic, setBpSystolic] = useState(120);
  const [bpDiastolic, setBpDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(72);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [temperature, setTemperature] = useState(98.6);
  const [oxygenSaturation, setOxygenSaturation] = useState(99);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);

  // Prescriptions builder
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-new-1',
      medicine: 'Amoxicillin',
      dosage: '500 mg',
      frequency: 'Every 8 hours with meals',
      duration: '7 days',
      instructions: 'Complete full course. Stay well hydrated.'
    }
  ]);
  const [labTestsStr, setLabTestsStr] = useState('Complete Blood Count (CBC), Basic Metabolic Panel');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-15');

  useEffect(() => {
    if (preselectedPatientId) {
      setPatientId(preselectedPatientId);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
    if (preselectedDoctorId) {
      setDoctorId(preselectedDoctorId);
    } else if (doctors.length > 0) {
      setDoctorId(doctors[0].id);
    }
  }, [isOpen, preselectedPatientId, preselectedDoctorId, patients, doctors]);

  if (!isOpen) return null;

  const addPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      {
        id: `rx-${Date.now()}`,
        medicine: '',
        dosage: '10 mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning.'
      }
    ]);
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescriptionRow = (index: number, field: keyof PrescriptionItem, val: string) => {
    const copy = [...prescriptions];
    copy[index] = { ...copy[index], [field]: val };
    setPrescriptions(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);
    if (!patient || !doctor || !diagnosis.trim()) return;

    const symptoms = symptomsStr ? symptomsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    const labTestsOrdered = labTestsStr ? labTestsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const record: MedicalRecord = {
      id: `MED-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      chiefComplaint: chiefComplaint || 'Routine medical examination and symptom assessment.',
      diagnosis,
      symptoms,
      vitals: {
        bpSystolic,
        bpDiastolic,
        heartRate,
        respiratoryRate,
        temperature,
        oxygenSaturation,
        weightKg,
        heightCm
      },
      prescriptions: prescriptions.filter(p => p.medicine.trim() !== ''),
      labTestsOrdered,
      clinicalNotes: clinicalNotes || 'Physical examination unremarkable. Patient instructed on treatment plan.',
      followUpDate,
      createdAt: new Date().toISOString()
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-6 shadow-xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              New Electronic Health Record (EHR Encounter)
            </h3>
            <p className="text-xs text-slate-500">
              Document patient clinical encounter, vital signs, formal diagnosis, and pharmacotherapy.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Patient and Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Patient *</label>
              <select
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Attending Physician *</label>
              <select
                required
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Encounter Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Chief Complaint & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Chief Complaint *</label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Sharp epigastric pain following meals"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Gastritis / Peptic Ulcer Disease"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Presenting Symptoms (comma-separated)</label>
            <input
              type="text"
              value={symptomsStr}
              onChange={(e) => setSymptomsStr(e.target.value)}
              placeholder="e.g. Nausea, Heartburn, Dyspepsia, Bloating"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Clinical Vitals Grid */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Vitals &amp; Biometric Telemetry</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 block">BP Systolic (mmHg)</label>
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">BP Diastolic (mmHg)</label>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Oxygen Saturation (%)</label>
                <input
                  type="number"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Resp. Rate (br/min)</label>
                <input
                  type="number"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Prescriptions Builder */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                <span>Prescriptions &amp; Medications</span>
              </span>
              <button
                type="button"
                onClick={addPrescriptionRow}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-white border border-teal-200 px-2 py-0.5 rounded hover:bg-teal-50 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Medication</span>
              </button>
            </div>
            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div key={rx.id} className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center bg-white p-2 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={rx.medicine}
                    onChange={(e) => updatePrescriptionRow(idx, 'medicine', e.target.value)}
                    className="sm:col-span-3 p-1.5 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={rx.dosage}
                    onChange={(e) => updatePrescriptionRow(idx, 'dosage', e.target.value)}
                    className="sm:col-span-2 p-1.5 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={rx.frequency}
                    onChange={(e) => updatePrescriptionRow(idx, 'frequency', e.target.value)}
                    className="sm:col-span-3 p-1.5 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={rx.duration}
                    onChange={(e) => updatePrescriptionRow(idx, 'duration', e.target.value)}
                    className="sm:col-span-3 p-1.5 border border-slate-200 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removePrescriptionRow(idx)}
                    className="sm:col-span-1 p-1 text-slate-400 hover:text-red-600 self-center justify-self-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Notes & Labs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clinical Notes &amp; Impression</label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Physician notes, differential diagnosis, patient instructions..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lab Investigations Ordered</label>
              <textarea
                rows={2}
                value={labTestsStr}
                onChange={(e) => setLabTestsStr(e.target.value)}
                placeholder="Diagnostic blood work, imaging, microbiology..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Electronic Health Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. PATIENT DOSSIER MODAL (Comprehensive 360 View)
// -------------------------------------------------------------
interface PatientDossierModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  records: MedicalRecord[];
  onBookAppointment: (patient: Patient) => void;
  onAddRecord: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
}

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({
  patient,
  isOpen,
  onClose,
  appointments,
  records,
  onBookAppointment,
  onAddRecord,
  onEditPatient
}) => {
  if (!isOpen || !patient) return null;

  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientRecords = records.filter(r => r.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full p-6 shadow-xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  patient.status === 'Inpatient' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {patient.status} {patient.roomNumber && `• ${patient.roomNumber}`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono mt-1">
                <span>{patient.id}</span>
                <span>•</span>
                <span>{patient.age} years ({patient.gender})</span>
                <span>•</span>
                <span className="text-red-700 font-bold">Blood {patient.bloodGroup}</span>
                <span>•</span>
                <span>DOB: {patient.dob}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookAppointment(patient)}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
            >
              Book Appt
            </button>
            <button
              onClick={() => onAddRecord(patient)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              Log Record
            </button>
            <button
              onClick={() => onEditPatient(patient)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demographics & Contact Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold block mb-1">Contact Information</span>
            <div className="text-slate-800 font-mono tabular-nums">{patient.phone}</div>
            <div className="text-slate-600 truncate">{patient.email}</div>
            <div className="text-slate-500 mt-1">{patient.address}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold block mb-1">Emergency Contact</span>
            <div className="text-slate-800 font-bold">{patient.emergencyContact.name}</div>
            <div className="text-slate-600">{patient.emergencyContact.relation}</div>
            <div className="text-slate-700 font-mono tabular-nums">{patient.emergencyContact.phone}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-semibold block mb-1">Insurance &amp; Clinical Flags</span>
            <div className="text-slate-800 font-medium">{patient.insurance.provider}</div>
            <div className="text-slate-500 font-mono">Policy: {patient.insurance.policyNumber}</div>
            {patient.allergies.length > 0 && (
              <div className="mt-1 text-red-700 font-semibold">
                Allergies: {patient.allergies.join(', ')}
              </div>
            )}
          </div>
          <div className="p-3 bg-sky-50/70 rounded-lg border border-sky-200">
            <span className="text-sky-800 font-bold block mb-1">Portal Login Access</span>
            <div className="text-[11px] text-slate-600 font-mono">ID: <span className="font-bold text-slate-900">{patient.id}</span></div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5">Password: <span className="font-bold text-sky-900 bg-white px-1.5 py-0.5 rounded border border-sky-200">{patient.password || 'patient123'}</span></div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Patient Portal Login:\nID: ${patient.id}\nEmail: ${patient.email}\nPassword: ${patient.password || 'patient123'}`);
                alert('Copied login credentials to clipboard!');
              }}
              className="mt-2 text-[10px] font-semibold text-sky-700 hover:underline block cursor-pointer"
            >
              📋 Copy Credentials
            </button>
          </div>
        </div>

        {/* Medical Records History */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Clinical Encounters &amp; Diagnoses ({patientRecords.length})</span>
          </h3>
          {patientRecords.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-200">
              No historical electronic health records logged for this patient yet.
            </p>
          ) : (
            <div className="space-y-3">
              {patientRecords.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rec.diagnosis}</span>
                    <span className="font-mono text-slate-500">{rec.date} • {rec.id}</span>
                  </div>
                  <p className="text-slate-600">Chief complaint: "{rec.chiefComplaint}"</p>
                  <div className="p-2 bg-slate-50 rounded font-mono text-[11px] text-slate-700 flex flex-wrap gap-4">
                    <span>BP: {rec.vitals.bpSystolic}/{rec.vitals.bpDiastolic} mmHg</span>
                    <span>HR: {rec.vitals.heartRate} bpm</span>
                    <span>SpO2: {rec.vitals.oxygenSaturation}%</span>
                    <span>Temp: {rec.vitals.temperature}°F</span>
                  </div>
                  {rec.prescriptions.length > 0 && (
                    <div className="pt-1">
                      <span className="font-semibold text-slate-700">Prescriptions:</span>
                      <ul className="list-disc list-inside mt-0.5 text-slate-600">
                        {rec.prescriptions.map(rx => (
                          <li key={rx.id}>{rx.medicine} {rx.dosage} - {rx.frequency} ({rx.duration})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments Timeline */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Scheduled Consultations &amp; Visits ({patientAppointments.length})</span>
          </h3>
          {patientAppointments.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-200">
              No appointments on record.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {patientAppointments.map(apt => (
                <div key={apt.id} className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{apt.reason}</div>
                    <div className="text-slate-500 text-[11px]">
                      With {apt.doctorName} ({apt.doctorSpecialization}) • {apt.date} at {apt.time}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
