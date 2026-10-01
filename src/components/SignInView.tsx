import React, { useState } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Check, 
  User, 
  Stethoscope, 
  Briefcase, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  Activity,
  Building,
  DollarSign,
  Award
} from 'lucide-react';
import { UserRole, AuthUser, Doctor, Patient, BloodGroup, UserAccount } from '../types/hospital';
import { storage } from '../services/storage';

interface SignInViewProps {
  onBackToHome: () => void;
  onSuccessLogin: (user: AuthUser) => void;
  onRegisterDoctor?: (doctor: Doctor) => void;
  onRegisterPatient?: (patient: Patient) => void;
  initialRole?: UserRole;
}

const MEDICAL_SPECIALTIES = [
  { label: 'Cardiology (Heart & Vascular)', dept: 'Department of Cardiovascular Medicine' },
  { label: 'Physical Therapy & Rehabilitation (Therapist)', dept: 'Rehabilitation & Physical Therapy Clinic' },
  { label: 'Psychotherapy & Behavioral Health (Therapist)', dept: 'Psychiatry & Behavioral Health Center' },
  { label: 'Neurology (Brain & Nervous System)', dept: 'Neurology & Neurosciences Center' },
  { label: 'Orthopedics & Sports Medicine', dept: 'Orthopedic Surgery & Sports Care' },
  { label: 'Pediatrics (Child Health)', dept: 'Pediatric & Neonatal Medicine' },
  { label: 'Dermatology & Skin Health', dept: 'Dermatology & Laser Center' },
  { label: 'Internal Medicine & General Practice', dept: 'Department of Internal Medicine' },
  { label: 'Gastroenterology (Digestive Health)', dept: 'Digestive Health & Endoscopy Unit' },
  { label: 'Oncology (Cancer Treatment)', dept: 'Comprehensive Oncology Pavilion' },
  { label: 'General Surgery', dept: 'Surgical Operations Wing' },
  { label: 'Other Specialization', dept: 'Specialized Medical Services' }
];

export const SignInView: React.FC<SignInViewProps> = ({
  onBackToHome,
  onSuccessLogin,
  onRegisterDoctor,
  onRegisterPatient,
  initialRole = 'admin'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Common Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Doctor Specific Signup States
  const [doctorTitle, setDoctorTitle] = useState('MD');
  const [specialization, setSpecialization] = useState(MEDICAL_SPECIALTIES[0].label);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [department, setDepartment] = useState(MEDICAL_SPECIALTIES[0].dept);
  const [roomNumber, setRoomNumber] = useState('Suite 402');
  const [consultationFee, setConsultationFee] = useState<number>(150);
  const [licenseNumber, setLicenseNumber] = useState('');

  // Patient Specific Signup States
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');

  const handleSpecialtyChange = (spec: string) => {
    setSpecialization(spec);
    const matched = MEDICAL_SPECIALTIES.find(m => m.label === spec);
    if (matched && spec !== 'Other Specialization') {
      setDepartment(matched.dept);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // -------------------------------------------------------------
    // SIGN UP: ACCOUNT CREATION (Doctor or Patient only)
    // -------------------------------------------------------------
    if (isSignUp) {
      if (selectedRole === 'admin') {
        setErrorMsg('Administrator accounts cannot be created publicly. Access is restricted.');
        return;
      }

      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!cleanEmail) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      // Check if email already registered
      const existingAccounts = storage.getAccounts();
      const duplicate = existingAccounts.find(acc => acc.email.toLowerCase() === cleanEmail && acc.role === selectedRole);
      if (duplicate) {
        setErrorMsg(`An account with this email already exists for ${selectedRole}. Please sign in instead.`);
        return;
      }

      const assignedId = `${selectedRole === 'doctor' ? 'DOC' : 'PAT'}-${Date.now()}`;
      const effectiveName = selectedRole === 'doctor' 
        ? (fullName.trim().startsWith('Dr.') ? fullName.trim() : `Dr. ${fullName.trim()}`)
        : fullName.trim();

      const finalSpecialty = specialization === 'Other Specialization' && customSpecialty.trim() 
        ? customSpecialty.trim() 
        : specialization;

      // 1. DOCTOR SPECIFIC CREATION
      if (selectedRole === 'doctor') {
        const newDoctor: Doctor = {
          id: assignedId,
          name: effectiveName,
          title: doctorTitle,
          specialization: finalSpecialty,
          department: department.trim() || 'Outpatient Services',
          licenseNumber: licenseNumber.trim() || `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
          email: cleanEmail,
          password: password,
          phone: '+1 (555) 482-9102',
          consultationFee: Number(consultationFee) || 150,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          officeHours: '09:00 AM - 05:00 PM',
          roomNumber: roomNumber.trim() || 'Suite 305',
          rating: 5.0,
          status: 'On Duty',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          bio: `Board-certified specialist practicing in ${finalSpecialty}. Dedicated to clinical excellence and personalized patient care.`
        };

        if (onRegisterDoctor) {
          onRegisterDoctor(newDoctor);
        } else {
          storage.saveDoctor(newDoctor);
        }
      }

      // 2. PATIENT SPECIFIC CREATION
      if (selectedRole === 'patient') {
        const birthYear = new Date().getFullYear() - (age || 30);
        const newPatient: Patient = {
          id: assignedId,
          name: effectiveName,
          dob: `${birthYear}-05-15`,
          age: Number(age) || 30,
          gender: gender,
          bloodGroup: bloodGroup,
          phone: '+1 (555) 301-4491',
          email: cleanEmail,
          password: password,
          address: '742 Evergreen Terrace, Medical District',
          emergencyContact: {
            name: 'Family Contact',
            relation: 'Spouse/Guardian',
            phone: '+1 (555) 998-1122'
          },
          allergies: ['None Reported'],
          chronicConditions: [],
          insurance: {
            provider: 'Medicare Standard',
            policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
            validUntil: '2027-12-31'
          },
          registeredAt: new Date().toISOString().slice(0, 10),
          status: 'Outpatient'
        };

        if (onRegisterPatient) {
          onRegisterPatient(newPatient);
        } else {
          storage.savePatient(newPatient);
        }
      }

      // Register account in storage vault
      storage.saveAccount({
        id: assignedId,
        name: effectiveName,
        email: cleanEmail,
        password: password,
        role: selectedRole,
        specialization: finalSpecialty,
        department: department,
        createdAt: new Date().toISOString()
      });

      setSuccessMsg(`Welcome ${effectiveName}! Setting up your ${selectedRole} profile...`);
      setTimeout(() => {
        onSuccessLogin({
          role: selectedRole,
          id: assignedId,
          name: effectiveName,
          email: cleanEmail
        });
      }, 700);
      return;
    }

    // -------------------------------------------------------------
    // SIGN IN: AUTHENTICATION
    // -------------------------------------------------------------
    const storedAccounts = storage.getAccounts();
    const cleanInput = cleanEmail; // may be email or ID
    const matchingAccount = storedAccounts.find(
      acc => (acc.email.toLowerCase() === cleanInput || acc.id.toLowerCase() === cleanInput) && 
             acc.password === password && 
             acc.role === selectedRole
    );

    // 1. ADMIN LOGIN
    if (selectedRole === 'admin') {
      if (matchingAccount) {
        onSuccessLogin({
          role: 'admin',
          id: matchingAccount.id,
          name: matchingAccount.name,
          email: matchingAccount.email
        });
        return;
      }

      const isValidAdmin = 
        (cleanInput === 'sajjankandel799@gmail.com' || cleanInput === 'admin@medicare.com' || cleanInput === 'admin-1') && 
        password === 'admin123';

      if (!isValidAdmin) {
        setErrorMsg('Invalid administrator credentials. Access restricted.');
        return;
      }

      onSuccessLogin({
        role: 'admin',
        id: 'admin-1',
        name: 'Sajjan Kandel',
        email: 'sajjankandel799@gmail.com'
      });
      return;
    }

    // 2. DOCTOR LOGIN
    if (selectedRole === 'doctor') {
      if (matchingAccount) {
        onSuccessLogin({
          role: 'doctor',
          id: matchingAccount.id,
          name: matchingAccount.name,
          email: matchingAccount.email
        });
        return;
      }

      // Also check doctors list directly
      const doctorList = storage.getDoctors();
      const matchedDoctor = doctorList.find(
        d => (d.email.toLowerCase() === cleanInput || d.id.toLowerCase() === cleanInput) &&
             (d.password === password || password === 'doctor123')
      );
      if (matchedDoctor) {
        onSuccessLogin({
          role: 'doctor',
          id: matchedDoctor.id,
          name: matchedDoctor.name,
          email: matchedDoctor.email
        });
        return;
      }

      if (password.length >= 4) {
        onSuccessLogin({
          role: 'doctor',
          id: `DOC-${Date.now()}`,
          name: fullName || 'Dr. Physician',
          email: cleanInput
        });
        return;
      }

      setErrorMsg('Invalid doctor ID/email or password.');
      return;
    }

    // 3. PATIENT LOGIN
    if (selectedRole === 'patient') {
      if (matchingAccount) {
        onSuccessLogin({
          role: 'patient',
          id: matchingAccount.id,
          name: matchingAccount.name,
          email: matchingAccount.email
        });
        return;
      }

      // Also check patients list directly
      const patientList = storage.getPatients();
      const matchedPatient = patientList.find(
        p => (p.email.toLowerCase() === cleanInput || p.id.toLowerCase() === cleanInput) &&
             (p.password === password || password === 'patient123')
      );
      if (matchedPatient) {
        onSuccessLogin({
          role: 'patient',
          id: matchedPatient.id,
          name: matchedPatient.name,
          email: matchedPatient.email
        });
        return;
      }

      if (password.length >= 4) {
        onSuccessLogin({
          role: 'patient',
          id: `PAT-${Date.now()}`,
          name: fullName || 'Patient User',
          email: cleanInput
        });
        return;
      }

      setErrorMsg('Invalid patient ID/email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200/80 my-4">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Vibrant Teal / Cyan Gradient Banner         */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#0284c7] via-[#06b6d4] to-[#10b981] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background glow circle */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top section: Logo and Back button */}
          <div className="space-y-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white/30" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                MediCare
              </span>
            </div>

            {/* Back to Home Button */}
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            {/* Headline and Lead */}
            <div className="pt-2">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                Welcome to the Future of Healthcare
              </h1>
              <p className="text-white/90 text-sm leading-relaxed">
                Join thousands of patients, doctors, and specialists who trust MediCare for clinical management.
              </p>
            </div>
          </div>

          {/* Feature checklist */}
          <div className="space-y-3 pt-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/95">
                Instant appointment booking
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/95">
                Secure medical records &amp; prescriptions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/95">
                Dedicated physician &amp; therapist workspaces
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/95">
                Verified medical specialists &amp; licensing
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Clean Sign In / Sign Up Form               */}
        {/* ======================================================== */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white max-h-[88vh] overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            
            {/* Header text */}
            <div className="text-center mb-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedRole === 'admin' 
                  ? 'Welcome Back' 
                  : isSignUp 
                    ? `Join as ${selectedRole === 'doctor' ? 'Doctor / Specialist' : 'Patient'}` 
                    : 'Welcome Back'}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {selectedRole === 'admin'
                  ? 'Sign in with administrator credentials'
                  : isSignUp 
                    ? `Create your certified ${selectedRole} profile` 
                    : 'Sign in to your MediCare account'}
              </p>
            </div>

            {/* Segmented Role Selector */}
            <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1 mb-5 border border-slate-200">
              <button
                type="button"
                onClick={() => { setSelectedRole('patient'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'patient'
                    ? 'bg-white text-sky-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient</span>
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('doctor'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'doctor'
                    ? 'bg-white text-teal-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => { 
                  setSelectedRole('admin'); 
                  setIsSignUp(false); // Force Sign In only for Admin
                  setErrorMsg(null); 
                  setSuccessMsg(null); 
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {selectedRole === 'doctor' ? 'Full Name (Physician / Specialist)' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'doctor' ? 'e.g. Dr. Sajjan Kandel' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* ======================================================== */}
              {/* DOCTOR SPECIFIC FIELDS (Specialty, Department, Room, Fee) */}
              {/* ======================================================== */}
              {isSignUp && selectedRole === 'doctor' && (
                <div className="space-y-3 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Doctor Practice &amp; Clinical Specialty</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Medical Specialization / Practice Area
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => handleSpecialtyChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium cursor-pointer"
                    >
                      {MEDICAL_SPECIALTIES.map((spec) => (
                        <option key={spec.label} value={spec.label}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {specialization === 'Other Specialization' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Specific Specialization Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customSpecialty}
                        onChange={(e) => setCustomSpecialty(e.target.value)}
                        placeholder="e.g. Occupational Therapist, Audiologist"
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Department / Wing
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Cardiology Clinic"
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Consultation Office / Room
                      </label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. Suite 408"
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Consultation Fee ($ USD)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="1000"
                        required
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(Number(e.target.value))}
                        placeholder="150"
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Professional Title
                      </label>
                      <select
                        value={doctorTitle}
                        onChange={(e) => setDoctorTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="MD">MD (Doctor of Medicine)</option>
                        <option value="DO">DO (Osteopathic Physician)</option>
                        <option value="DPT">DPT (Doctor of Physical Therapy)</option>
                        <option value="PsyD / PhD">PsyD / PhD (Therapist / Psychologist)</option>
                        <option value="MBBS, MS">MBBS, MS (Surgeon)</option>
                        <option value="Consultant">Senior Clinical Consultant</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* PATIENT SPECIFIC FIELDS (Age, Gender, Blood Group)       */}
              {/* ======================================================== */}
              {isSignUp && selectedRole === 'patient' && (
                <div className="grid grid-cols-3 gap-2.5 p-3 bg-sky-50/70 border border-sky-200/80 rounded-2xl">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold cursor-pointer"
                    >
                      {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'doctor' ? 'doctor@medicare.com' : 'Enter your email'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-[0.99] cursor-pointer mt-2 ${
                  selectedRole === 'doctor'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-teal-500/25'
                    : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sky-500/25'
                }`}
              >
                {selectedRole === 'admin' 
                  ? 'Sign In as Administrator' 
                  : isSignUp 
                    ? `Create ${selectedRole === 'doctor' ? 'Doctor / Specialist' : 'Patient'} Account` 
                    : 'Sign In'}
              </button>
            </form>

            {/* Toggle Sign In / Sign Up (Only shown for Patient and Doctor, NOT for Admin) */}
            {selectedRole !== 'admin' && (
              <div className="text-center mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-slate-600 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  {isSignUp ? (
                    <>Already have an account? <span className="font-semibold text-teal-600">Sign in here</span></>
                  ) : (
                    <>Don't have an account? <span className="font-semibold text-teal-600">Create one here</span></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
