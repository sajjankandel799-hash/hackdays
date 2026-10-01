import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  BedDouble, 
  Database, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  CheckCircle,
  Eye,
  EyeOff,
  Sliders,
  DollarSign,
  Activity,
  Layers,
  Key,
  Lock,
  Copy,
  Check,
  RefreshCw,
  X,
  Stethoscope,
  User,
  Briefcase
} from 'lucide-react';
import { 
  Patient, 
  Doctor, 
  Appointment, 
  MedicalRecord, 
  WardRoom, 
  DoctorStatus, 
  AppointmentStatus,
  UserAccount
} from '../types/hospital';
import { storage } from '../services/storage';

interface AdminPanelViewProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  rooms: WardRoom[];
  onOpenNewPatientModal: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenNewDoctorModal: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (id: string) => void;
  onUpdateDoctorStatus: (id: string, status: DoctorStatus) => void;
  onOpenNewAppointmentModal: () => void;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onOpenNewRecordModal: () => void;
  onDeleteRecord: (id: string) => void;
  onAdmitPatient: (roomId: string, patientId: string) => void;
  onDischargePatient: (roomId: string, patientId: string) => void;
  onExportData: () => void;
  onResetDatabase: () => void;
}

type AdminSection = 'patients' | 'doctors' | 'appointments' | 'records' | 'wards' | 'credentials';

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  patients,
  doctors,
  appointments,
  records,
  rooms,
  onOpenNewPatientModal,
  onEditPatient,
  onDeletePatient,
  onSelectPatient,
  onOpenNewDoctorModal,
  onEditDoctor,
  onDeleteDoctor,
  onUpdateDoctorStatus,
  onOpenNewAppointmentModal,
  onUpdateAppointmentStatus,
  onDeleteAppointment,
  onOpenNewRecordModal,
  onDeleteRecord,
  onAdmitPatient,
  onDischargePatient,
  onExportData,
  onResetDatabase
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Password & Credentials State
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [credentialsRoleFilter, setCredentialsRoleFilter] = useState<'all' | 'doctor' | 'patient' | 'admin'>('all');

  // Modal to edit/reset user password
  const [editingCredentials, setEditingCredentials] = useState<{
    id: string;
    name: string;
    role: 'patient' | 'doctor' | 'admin';
    email: string;
    currentPassword: string;
  } | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showNotice(`Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenPasswordReset = (id: string, name: string, role: 'patient' | 'doctor' | 'admin', email: string, currentPass: string) => {
    setEditingCredentials({ id, name, role, email, currentPassword: currentPass });
    setNewPasswordInput('');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredentials || !newPasswordInput.trim()) return;

    const trimmedPass = newPasswordInput.trim();
    if (trimmedPass.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }

    storage.updatePassword(editingCredentials.id, trimmedPass);
    showNotice(`Password successfully updated for ${editingCredentials.name} (${editingCredentials.id}) to "${trimmedPass}"`);
    setEditingCredentials(null);
    setNewPasswordInput('');
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(res);
  };

  // Helper to get password for any patient
  const getPatientPassword = (p: Patient) => {
    if (p.password) return p.password;
    const acc = storage.getAccounts().find(a => a.id === p.id || a.email.toLowerCase() === p.email.toLowerCase());
    return acc?.password || 'patient123';
  };

  // Helper to get password for any doctor
  const getDoctorPassword = (d: Doctor) => {
    if (d.password) return d.password;
    const acc = storage.getAccounts().find(a => a.id === d.id || a.email.toLowerCase() === d.email.toLowerCase());
    return acc?.password || 'doctor123';
  };

  // Patients Filter
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Doctors Filter
  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Appointments Filter
  const filteredAppointments = appointments.filter(a => {
    const p = patients.find(patient => patient.id === a.patientId);
    const d = doctors.find(doc => doc.id === a.doctorId);
    const search = searchQuery.toLowerCase();
    return (
      a.id.toLowerCase().includes(search) ||
      (p && p.name.toLowerCase().includes(search)) ||
      (d && d.name.toLowerCase().includes(search)) ||
      a.type.toLowerCase().includes(search)
    );
  });

  // Records Filter
  const filteredRecords = records.filter(r => {
    const p = patients.find(patient => patient.id === r.patientId);
    const search = searchQuery.toLowerCase();
    return (
      r.diagnosis.toLowerCase().includes(search) ||
      (p && p.name.toLowerCase().includes(search)) ||
      r.id.toLowerCase().includes(search)
    );
  });

  // Master Accounts Vault list
  const allAccounts = storage.getAccounts();
  const filteredAccounts = allAccounts.filter(acc => {
    const matchesRole = credentialsRoleFilter === 'all' || acc.role === credentialsRoleFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      acc.name.toLowerCase().includes(query) ||
      acc.id.toLowerCase().includes(query) ||
      acc.email.toLowerCase().includes(query) ||
      (acc.specialization && acc.specialization.toLowerCase().includes(query));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Admin Panel Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Full Administrative Control &amp; Data Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hospital Admin Management Panel
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Master control panel to view, change, edit, or delete all hospital data across patients, physicians, appointments, clinical records, and passwords.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setActiveSection('credentials');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>View User Passwords</span>
            </button>
            <button
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all data back to original demo values?")) {
                  onResetDatabase();
                  showNotice("Database reset to demo defaults successfully.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/80 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-black font-mono text-white">{patients.length}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Patients</div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-cyan-400">{doctors.length}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Doctors</div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-400">{appointments.length}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Appointments</div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-400">{allAccounts.length}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">ID &amp; Passwords</div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-purple-400">
              {rooms.reduce((acc, r) => acc + r.occupied, 0)}/{rooms.reduce((acc, r) => acc + r.capacity, 0)}
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Beds Occupied</div>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Section Switcher Tabs & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Admin Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setActiveSection('patients'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSection === 'patients'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patients ({patients.length})</span>
            </button>
            <button
              onClick={() => { setActiveSection('doctors'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSection === 'doctors'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Doctors ({doctors.length})</span>
            </button>
            <button
              onClick={() => { setActiveSection('credentials'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSection === 'credentials'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-700" />
              <span>User Passwords ({allAccounts.length})</span>
            </button>
            <button
              onClick={() => { setActiveSection('appointments'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSection === 'appointments'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments ({appointments.length})</span>
            </button>
            <button
              onClick={() => { setActiveSection('records'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSection === 'records'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EHR Records ({records.length})</span>
            </button>
            <button
              onClick={() => { setActiveSection('wards'); setSearchQuery(''); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSection === 'wards'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Wards &amp; Beds</span>
            </button>
          </div>

          {/* Search bar & Add Button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeSection}...`}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {activeSection === 'patients' && (
              <button
                onClick={onOpenNewPatientModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Patient</span>
              </button>
            )}
            {activeSection === 'doctors' && (
              <button
                onClick={onOpenNewDoctorModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Doctor</span>
              </button>
            )}
            {activeSection === 'credentials' && (
              <button
                onClick={() => setShowAllPasswords(!showAllPasswords)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                {showAllPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAllPasswords ? 'Mask All Passwords' : 'Reveal All Passwords'}</span>
              </button>
            )}
            {activeSection === 'appointments' && (
              <button
                onClick={onOpenNewAppointmentModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Appointment</span>
              </button>
            )}
            {activeSection === 'records' && (
              <button
                onClick={onOpenNewRecordModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. PATIENTS MANAGER TABLE WITH LOGIN ID & PASSWORD        */}
      {/* ========================================================= */}
      {activeSection === 'patients' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Registered Patients Database ({filteredPatients.length})</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Admin feature: View Patient ID and Portal Password below
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Patient Name &amp; ID</th>
                  <th className="p-3 bg-amber-50/70 text-amber-900 border-x border-amber-200/60">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Portal Credentials (ID &amp; Password)</span>
                    </div>
                  </th>
                  <th className="p-3">Demographics</th>
                  <th className="p-3">Contact &amp; Emergency</th>
                  <th className="p-3">Status / Ward</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredPatients.map(p => {
                  const pass = getPatientPassword(p);
                  const isVisible = showAllPasswords || visiblePasswords[p.id];
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & ID */}
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{p.id}</span>
                          <button
                            onClick={() => copyToClipboard(p.id, `id-${p.id}`)}
                            title="Copy Patient ID"
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {copiedKey === `id-${p.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Credentials (ID & Password) */}
                      <td className="p-3 bg-amber-50/30 border-x border-amber-200/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Login ID:</span>
                            <span className="font-mono text-slate-900 font-semibold">{p.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Password:</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {isVisible ? pass : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(p.id)}
                              title={isVisible ? "Hide Password" : "View Password"}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(pass, `pass-${p.id}`)}
                              title="Copy Password"
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                            >
                              {copiedKey === `pass-${p.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleOpenPasswordReset(p.id, p.name, 'patient', p.email, pass)}
                              title="Reset or Change Password"
                              className="p-1 rounded text-amber-700 hover:text-amber-900 hover:bg-amber-100 cursor-pointer"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="p-3">
                        <div>{p.age} yrs • {p.gender}</div>
                        <div className="text-[11px] text-rose-600 font-bold">Blood: {p.bloodGroup}</div>
                      </td>

                      {/* Contact */}
                      <td className="p-3">
                        <div className="font-mono text-slate-800">{p.phone}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{p.email}</div>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Inpatient' ? 'bg-amber-100 text-amber-800' :
                          p.status === 'Critical' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status} {p.roomNumber && `(${p.roomNumber})`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPatient(p)}
                            title="View Patient Dossier"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditPatient(p)}
                            title="Edit Patient Information"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete patient "${p.name}"? This cannot be undone.`)) {
                                onDeletePatient(p.id);
                                showNotice(`Patient ${p.name} deleted.`);
                              }
                            }}
                            title="Delete Patient Record"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DOCTORS MANAGER TABLE WITH LOGIN ID & PASSWORD         */}
      {/* ========================================================= */}
      {activeSection === 'doctors' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Physician Roster ({filteredDoctors.length})</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Admin feature: View Doctor ID and Portal Password below
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Doctor</th>
                  <th className="p-3 bg-amber-50/70 text-amber-900 border-x border-amber-200/60">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Doctor Portal Credentials (ID &amp; Password)</span>
                    </div>
                  </th>
                  <th className="p-3">Department &amp; Room</th>
                  <th className="p-3">Fee / Rating</th>
                  <th className="p-3">Duty Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredDoctors.map(d => {
                  const pass = getDoctorPassword(d);
                  const isVisible = showAllPasswords || visiblePasswords[d.id];
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-teal-200">
                            {d.avatar ? <img src={d.avatar} alt={d.name} className="w-full h-full object-cover rounded-xl" /> : 'DR'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{d.name}</div>
                            <div className="text-[11px] text-teal-700 font-semibold">{d.specialization}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{d.licenseNumber}</div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor Credentials */}
                      <td className="p-3 bg-amber-50/30 border-x border-amber-200/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Doctor ID:</span>
                            <span className="font-mono text-slate-900 font-semibold">{d.id}</span>
                            <button
                              onClick={() => copyToClipboard(d.id, `id-${d.id}`)}
                              title="Copy Doctor ID"
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              {copiedKey === `id-${d.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Email:</span>
                            <span className="font-mono text-slate-700 text-[11px]">{d.email}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Password:</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {isVisible ? pass : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(d.id)}
                              title={isVisible ? "Hide Password" : "View Password"}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(pass, `pass-${d.id}`)}
                              title="Copy Password"
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                            >
                              {copiedKey === `pass-${d.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleOpenPasswordReset(d.id, d.name, 'doctor', d.email, pass)}
                              title="Reset or Change Password"
                              className="p-1 rounded text-amber-700 hover:text-amber-900 hover:bg-amber-100 cursor-pointer"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div>{d.department}</div>
                        <div className="text-[11px] text-slate-500">Room: {d.roomNumber}</div>
                      </td>

                      <td className="p-3 font-mono">
                        <div className="font-bold text-slate-900">${d.consultationFee}</div>
                        <div className="text-[11px] text-amber-600">★ {d.rating}</div>
                      </td>

                      <td className="p-3">
                        <select
                          value={d.status}
                          onChange={(e) => {
                            onUpdateDoctorStatus(d.id, e.target.value as DoctorStatus);
                            showNotice(`Status updated to ${e.target.value} for ${d.name}`);
                          }}
                          className="p-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800 cursor-pointer"
                        >
                          <option value="On Duty">On Duty</option>
                          <option value="In Consultation">In Consultation</option>
                          <option value="On Break">On Break</option>
                          <option value="Off Duty">Off Duty</option>
                        </select>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditDoctor(d)}
                            title="Edit Doctor"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete doctor "${d.name}"?`)) {
                                onDeleteDoctor(d.id);
                                showNotice(`Doctor ${d.name} deleted.`);
                              }
                            }}
                            title="Delete Doctor"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DEDICATED USER CREDENTIALS & ACCESS VAULT             */}
      {/* ========================================================= */}
      {activeSection === 'credentials' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <span>Hospital User Credentials &amp; Access Vault</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect, search, copy, or reset passwords and login IDs for all patients, physicians, and administrative accounts.
              </p>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['all', 'doctor', 'patient', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setCredentialsRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    credentialsRoleFilter === r
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === 'all' ? `All (${allAccounts.length})` : 
                   r === 'doctor' ? `Doctors (${allAccounts.filter(a => a.role === 'doctor').length})` :
                   r === 'patient' ? `Patients (${allAccounts.filter(a => a.role === 'patient').length})` :
                   `Admins (${allAccounts.filter(a => a.role === 'admin').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts List / Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">User Role</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Login User ID</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3 bg-amber-50/80 text-amber-900 font-bold">Account Password</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map(acc => {
                  const isVisible = showAllPasswords || visiblePasswords[acc.id];
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Role Badge */}
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          acc.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          acc.role === 'doctor' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                          'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}>
                          {acc.role === 'admin' ? <Briefcase className="w-3 h-3" /> :
                           acc.role === 'doctor' ? <Stethoscope className="w-3 h-3" /> :
                           <User className="w-3 h-3" />}
                          <span>{acc.role}</span>
                        </span>
                      </td>

                      {/* Name */}
                      <td className="p-3 font-bold text-slate-900">
                        {acc.name}
                        {acc.specialization && (
                          <div className="text-[11px] text-teal-600 font-normal">{acc.specialization}</div>
                        )}
                      </td>

                      {/* User ID */}
                      <td className="p-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{acc.id}</span>
                          <button
                            onClick={() => copyToClipboard(acc.id, `vault-id-${acc.id}`)}
                            title="Copy ID"
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {copiedKey === `vault-id-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-3 font-mono text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>{acc.email}</span>
                          <button
                            onClick={() => copyToClipboard(acc.email, `vault-email-${acc.id}`)}
                            title="Copy Email"
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {copiedKey === `vault-email-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="p-3 bg-amber-50/40">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-xs shadow-2xs">
                            {isVisible ? acc.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(acc.id)}
                            title={isVisible ? "Hide Password" : "Show Password"}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                          >
                            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(acc.password, `vault-pass-${acc.id}`)}
                            title="Copy Password"
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                          >
                            {copiedKey === `vault-pass-${acc.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenPasswordReset(acc.id, acc.name, acc.role, acc.email, acc.password)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Key className="w-3 h-3" />
                            <span>Change Pass</span>
                          </button>
                          <button
                            onClick={() => {
                              const details = `MediCare ${acc.role.toUpperCase()} Login Credentials:\nName: ${acc.name}\nLogin ID: ${acc.id}\nEmail: ${acc.email}\nPassword: ${acc.password}`;
                              copyToClipboard(details, `full-${acc.id}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Copy All
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. APPOINTMENTS MANAGER TABLE                             */}
      {/* ========================================================= */}
      {activeSection === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              All Hospital Appointments ({filteredAppointments.length})
            </span>
            <span className="text-[11px] text-slate-500">
              Admin controls: Update status, reassign or cancel/delete appointment
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date &amp; Slot</th>
                  <th className="p-3">Reason / Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredAppointments.map(a => {
                  const patient = patients.find(p => p.id === a.patientId);
                  const doctor = doctors.find(d => d.id === a.doctorId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <button
                          onClick={() => patient && onSelectPatient(patient)}
                          className="font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer"
                        >
                          {patient?.name || 'Walk-in'}
                        </button>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        {doctor?.name || 'Assigned Doctor'}
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{a.date}</div>
                        <div className="text-slate-500">{a.time}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{a.type}</div>
                        <div className="text-[11px] text-slate-500">{a.reason}</div>
                      </td>
                      <td className="p-3">
                        <select
                          value={a.status}
                          onChange={(e) => {
                            onUpdateAppointmentStatus(a.id, e.target.value as AppointmentStatus);
                            showNotice(`Appointment status updated to ${e.target.value}.`);
                          }}
                          className="p-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800 cursor-pointer"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In-Progress">In-Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this appointment?")) {
                              onDeleteAppointment(a.id);
                              showNotice("Appointment deleted.");
                            }
                          }}
                          title="Delete Appointment"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EHR MEDICAL RECORDS TABLE                              */}
      {/* ========================================================= */}
      {activeSection === 'records' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Clinical EHR Records &amp; Diagnoses ({filteredRecords.length})
            </span>
            <span className="text-[11px] text-slate-500">
              Admin controls: Review clinical notes, ordered tests, and delete record
            </span>
          </div>
          <div className="divide-y divide-slate-200/80">
            {filteredRecords.map(r => {
              const patient = patients.find(p => p.id === r.patientId);
              const doctor = doctors.find(d => d.id === r.doctorId);
              return (
                <div key={r.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{r.diagnosis}</span>
                      <span className="text-[11px] font-mono text-slate-400">({r.date})</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {r.clinicalNotes}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Patient: <strong className="text-slate-800">{patient?.name || r.patientId}</strong></span>
                      <span>•</span>
                      <span>Physician: <strong className="text-slate-800">{doctor?.name || r.doctorId}</strong></span>
                      {r.prescriptions.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-teal-700 font-semibold">{r.prescriptions.length} Prescriptions</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this EHR clinical record?")) {
                        onDeleteRecord(r.id);
                        showNotice("EHR record deleted.");
                      }
                    }}
                    title="Delete Record"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. WARDS & BEDS MANAGER                                   */}
      {/* ========================================================= */}
      {activeSection === 'wards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-base text-slate-900">Room {room.roomNumber}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {room.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{room.department}</p>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Occupancy:</span>
                    <span className="font-mono font-bold text-slate-900">{room.occupied} / {room.capacity} beds</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        room.occupied >= room.capacity ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Admitted patients */}
                {room.currentPatientIds.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Admitted:</span>
                    {room.currentPatientIds.map(pId => {
                      const patient = patients.find(p => p.id === pId);
                      return (
                        <div key={pId} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50">
                          <span className="font-semibold text-slate-800">{patient?.name || pId}</span>
                          <button
                            onClick={() => onDischargePatient(room.id, pId)}
                            className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Discharge
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. ADMIN PASSWORD RESET MODAL DIALOG                      */}
      {/* ========================================================= */}
      {editingCredentials && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
                  <p className="text-[11px] text-slate-500 capitalize">{editingCredentials.role} account</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCredentials(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target User:</span>
                <span className="font-bold text-slate-900">{editingCredentials.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono font-semibold text-slate-800">{editingCredentials.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800 truncate max-w-[200px]">{editingCredentials.email}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Current Password:</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">{editingCredentials.currentPassword}</span>
              </div>
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-3.5 pt-1 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">New Password *</label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new secure password (min 4 chars)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono text-slate-900 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCredentials(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
