import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { SignInView } from './components/SignInView';
import { AdminPanelView } from './components/AdminPanelView';
import { PatientPortalView } from './components/PatientPortalView';
import { DoctorPortalView } from './components/DoctorPortalView';
import { DashboardOverview } from './components/DashboardOverview';
import { PatientsView } from './components/PatientsView';
import { DoctorsView } from './components/DoctorsView';
import { AppointmentsView } from './components/AppointmentsView';
import { MedicalRecordsView } from './components/MedicalRecordsView';
import { WardsView } from './components/WardsView';
import { InteractiveCli } from './components/InteractiveCli';
import { StorageExplorer } from './components/StorageExplorer';
import { 
  PatientModal, 
  DoctorModal, 
  AppointmentModal, 
  MedicalRecordModal, 
  PatientDossierModal 
} from './components/Modals';
import { storage } from './services/storage';
import { 
  Patient, 
  Doctor, 
  Appointment, 
  MedicalRecord, 
  WardRoom, 
  DoctorStatus, 
  AppointmentStatus,
  AuthUser,
  UserRole
} from './types/hospital';

export default function App() {
  // Navigation tab state (starts on 'landing')
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  // Authenticated user state (Default logged in as Admin Sajjan Kandel)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    role: 'admin',
    id: 'admin-1',
    name: 'Sajjan Kandel',
    email: 'sajjankandel799@gmail.com'
  });

  // Core Data States
  const [patients, setPatients] = useState<Patient[]>(() => storage.getPatients());
  const [doctors, setDoctors] = useState<Doctor[]>(() => storage.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(() => storage.getAppointments());
  const [records, setRecords] = useState<MedicalRecord[]>(() => storage.getMedicalRecords());
  const [rooms, setRooms] = useState<WardRoom[]>(() => storage.getWardRooms());

  // Modal Visibility States
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [preselectedPatientId, setPreselectedPatientId] = useState<string | undefined>(undefined);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [dossierPatient, setDossierPatient] = useState<Patient | null>(null);

  const refreshAllData = () => {
    setPatients(storage.getPatients());
    setDoctors(storage.getDoctors());
    setAppointments(storage.getAppointments());
    setRecords(storage.getMedicalRecords());
    setRooms(storage.getWardRooms());
  };

  // Patients Actions
  const handleSavePatient = (patient: Patient) => {
    storage.savePatient(patient);
    refreshAllData();
    if (dossierPatient?.id === patient.id) {
      setDossierPatient(patient);
    }
  };

  const handleDeletePatient = (id: string) => {
    storage.deletePatient(id);
    refreshAllData();
    if (dossierPatient?.id === id) {
      setDossierPatient(null);
    }
  };

  // Doctors Actions
  const handleSaveDoctor = (doctor: Doctor) => {
    storage.saveDoctor(doctor);
    refreshAllData();
  };

  const handleDeleteDoctor = (id: string) => {
    storage.deleteDoctor(id);
    refreshAllData();
  };

  const handleUpdateDoctorStatus = (id: string, status: DoctorStatus) => {
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      storage.saveDoctor({ ...doc, status });
      refreshAllData();
    }
  };

  // Appointments Actions
  const handleSaveAppointment = (appointment: Appointment) => {
    storage.saveAppointment(appointment);
    refreshAllData();
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    storage.updateAppointmentStatus(id, status);
    refreshAllData();
  };

  const handleDeleteAppointment = (id: string) => {
    storage.deleteAppointment(id);
    refreshAllData();
  };

  // Medical Records Actions
  const handleSaveRecord = (record: MedicalRecord) => {
    storage.saveMedicalRecord(record);
    refreshAllData();
  };

  const handleDeleteRecord = (id: string) => {
    storage.deleteMedicalRecord(id);
    refreshAllData();
  };

  // Ward Admission / Discharge
  const handleAdmitPatientToRoom = (roomId: string, patientId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const patient = patients.find(p => p.id === patientId);
    if (!room || !patient) return;

    if (!room.currentPatientIds.includes(patientId)) {
      const updatedRoom: WardRoom = {
        ...room,
        occupied: room.occupied + 1,
        currentPatientIds: [...room.currentPatientIds, patientId]
      };
      storage.saveWardRoom(updatedRoom);

      const updatedPatient: Patient = {
        ...patient,
        status: 'Inpatient',
        roomNumber: room.roomNumber
      };
      storage.savePatient(updatedPatient);
      refreshAllData();
    }
  };

  const handleDischargePatientFromRoom = (roomId: string, patientId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const patient = patients.find(p => p.id === patientId);
    if (!room) return;

    const updatedRoom: WardRoom = {
      ...room,
      occupied: Math.max(0, room.occupied - 1),
      currentPatientIds: room.currentPatientIds.filter(id => id !== patientId)
    };
    storage.saveWardRoom(updatedRoom);

    if (patient) {
      const updatedPatient: Patient = {
        ...patient,
        status: 'Discharged',
        roomNumber: undefined
      };
      storage.savePatient(updatedPatient);
    }
    refreshAllData();
  };

  // Export JSON Backup
  const handleExportData = () => {
    const json = storage.exportConsolidatedJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare-hospital-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset Database to Demo
  const handleResetDatabase = () => {
    storage.resetToDefaults();
    refreshAllData();
  };

  // Quick Open Modal Handlers
  const openNewPatientModal = () => {
    setPatientToEdit(null);
    setIsPatientModalOpen(true);
  };

  const openEditPatientModal = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsPatientModalOpen(true);
  };

  const openNewDoctorModal = () => {
    setDoctorToEdit(null);
    setIsDoctorModalOpen(true);
  };

  const openEditDoctorModal = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsDoctorModalOpen(true);
  };

  const openNewAppointmentModal = (patientId?: string, doctorId?: string) => {
    setPreselectedPatientId(patientId);
    setPreselectedDoctorId(doctorId);
    setIsAppointmentModalOpen(true);
  };

  const openNewRecordModal = (patientId?: string, doctorId?: string) => {
    setPreselectedPatientId(patientId);
    setPreselectedDoctorId(doctorId);
    setIsRecordModalOpen(true);
  };

  // Identify current logged in patient/doctor if applicable
  const currentPatientUser = currentUser?.role === 'patient'
    ? patients.find(p => p.email.toLowerCase() === currentUser.email.toLowerCase() || p.id === currentUser.id) || {
        id: currentUser.id,
        name: currentUser.name,
        dob: '1995-04-12',
        age: 30,
        gender: 'Male' as const,
        bloodGroup: 'O+' as const,
        phone: '+1 (555) 234-5678',
        email: currentUser.email,
        address: 'Medical District',
        emergencyContact: {
          name: 'Emergency Contact',
          relation: 'Family',
          phone: '+1 (555) 998-1122'
        },
        allergies: ['No Known Drug Allergies (NKDA)'],
        chronicConditions: [],
        insurance: {
          provider: 'MediCare Standard',
          policyNumber: 'POL-109283',
          validUntil: '2027-12-31'
        },
        registeredAt: new Date().toISOString().slice(0, 10),
        status: 'Outpatient' as const
      }
    : undefined;

  const currentDoctorUser = currentUser?.role === 'doctor'
    ? doctors.find(d => d.email.toLowerCase() === currentUser.email.toLowerCase() || d.id === currentUser.id) || {
        id: currentUser.id,
        name: currentUser.name.startsWith('Dr.') ? currentUser.name : `Dr. ${currentUser.name}`,
        title: 'MD',
        specialization: 'Cardiology & Healthcare',
        department: 'Department of Clinical Medicine',
        licenseNumber: 'MD-84920-CA',
        email: currentUser.email,
        phone: '+1 (555) 482-9102',
        consultationFee: 150,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        officeHours: '09:00 AM - 05:00 PM',
        roomNumber: 'Suite 402',
        rating: 5.0,
        status: 'On Duty' as const
      }
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. LANDING VIEW */}
      {activeTab === 'landing' && (
        <LandingHero
          onGetStarted={() => {
            if (currentUser) {
              setActiveTab(currentUser.role === 'admin' ? 'admin' : 'dashboard');
            } else {
              setActiveTab('signin');
            }
          }}
          onOpenSignIn={() => setActiveTab('signin')}
          onOpenAppointmentModal={() => openNewAppointmentModal()}
          onOpenPatientModal={openNewPatientModal}
          totalPatients={patients.length}
          totalDoctors={doctors.length}
          appointmentsCount={appointments.length}
        />
      )}

      {/* 2. SIGN IN VIEW */}
      {activeTab === 'signin' && (
        <SignInView
          onBackToHome={() => setActiveTab('landing')}
          onSuccessLogin={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin') {
              setActiveTab('admin');
            } else {
              setActiveTab('dashboard');
            }
          }}
          onRegisterDoctor={(newDoc) => {
            handleSaveDoctor(newDoc);
          }}
          onRegisterPatient={(newPat) => {
            handleSavePatient(newPat);
          }}
          initialRole={currentUser?.role || 'admin'}
        />
      )}

      {/* 3. PORTAL APPLICATION VIEWS (When not on landing or signin) */}
      {activeTab !== 'landing' && activeTab !== 'signin' && (
        <>
          {/* Top Bar Navigation */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onOpenSignIn={() => setActiveTab('signin')}
            onSignOut={() => {
              setCurrentUser(null);
              setActiveTab('signin');
            }}
            onOpenNewPatientModal={openNewPatientModal}
            onOpenNewAppointmentModal={() => openNewAppointmentModal()}
            onOpenNewRecordModal={() => openNewRecordModal()}
            onExportData={handleExportData}
          />

          {/* Main Hospital Management Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* ADMIN PANEL: Where admin can view, change, edit, and delete ALL data */}
            {activeTab === 'admin' && (
              <AdminPanelView
                patients={patients}
                doctors={doctors}
                appointments={appointments}
                records={records}
                rooms={rooms}
                onOpenNewPatientModal={openNewPatientModal}
                onEditPatient={openEditPatientModal}
                onDeletePatient={handleDeletePatient}
                onSelectPatient={(p) => setDossierPatient(p)}
                onOpenNewDoctorModal={openNewDoctorModal}
                onEditDoctor={openEditDoctorModal}
                onDeleteDoctor={handleDeleteDoctor}
                onUpdateDoctorStatus={handleUpdateDoctorStatus}
                onOpenNewAppointmentModal={() => openNewAppointmentModal()}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                onDeleteAppointment={handleDeleteAppointment}
                onOpenNewRecordModal={() => openNewRecordModal()}
                onDeleteRecord={handleDeleteRecord}
                onAdmitPatient={handleAdmitPatientToRoom}
                onDischargePatient={handleDischargePatientFromRoom}
                onExportData={handleExportData}
                onResetDatabase={handleResetDatabase}
              />
            )}

            {/* DASHBOARD: Differentiated by Role */}
            {activeTab === 'dashboard' && (
              <>
                {currentUser?.role === 'patient' ? (
                  <PatientPortalView
                    currentPatient={currentPatientUser}
                    doctors={doctors}
                    appointments={appointments}
                    records={records}
                    onBookAppointment={(docId) => openNewAppointmentModal(currentPatientUser?.id, docId)}
                    onOpenPatientDossier={(p) => setDossierPatient(p)}
                  />
                ) : currentUser?.role === 'doctor' ? (
                  <DoctorPortalView
                    currentDoctor={currentDoctorUser}
                    patients={patients}
                    appointments={appointments}
                    records={records}
                    onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                    onUpdateDoctorStatus={handleUpdateDoctorStatus}
                    onWriteRecord={(pId, docId) => openNewRecordModal(pId, docId)}
                    onSelectPatient={(p) => setDossierPatient(p)}
                  />
                ) : (
                  <DashboardOverview
                    patients={patients}
                    doctors={doctors}
                    appointments={appointments}
                    records={records}
                    rooms={rooms}
                    onSelectPatient={(p) => setDossierPatient(p)}
                    onSelectDoctor={() => setActiveTab('doctors')}
                    onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onOpenNewPatientModal={openNewPatientModal}
                    onOpenNewAppointmentModal={() => openNewAppointmentModal()}
                    onOpenNewRecordModal={() => openNewRecordModal()}
                  />
                )}
              </>
            )}

            {/* PATIENTS TABLE VIEW */}
            {activeTab === 'patients' && (
              <PatientsView
                patients={patients}
                appointments={appointments}
                records={records}
                onSelectPatient={(p) => setDossierPatient(p)}
                onOpenNewPatientModal={openNewPatientModal}
                onEditPatient={openEditPatientModal}
                onDeletePatient={handleDeletePatient}
                onBookAppointmentForPatient={(p) => openNewAppointmentModal(p.id)}
                onAddRecordForPatient={(p) => openNewRecordModal(p.id)}
              />
            )}

            {/* DOCTORS TABLE VIEW */}
            {activeTab === 'doctors' && (
              <DoctorsView
                doctors={doctors}
                appointments={appointments}
                onSelectDoctor={() => {}}
                onOpenNewDoctorModal={openNewDoctorModal}
                onEditDoctor={openEditDoctorModal}
                onDeleteDoctor={handleDeleteDoctor}
                onUpdateDoctorStatus={handleUpdateDoctorStatus}
                onBookAppointmentWithDoctor={(d) => openNewAppointmentModal(undefined, d.id)}
              />
            )}

            {/* APPOINTMENTS VIEW */}
            {activeTab === 'appointments' && (
              <AppointmentsView
                appointments={appointments}
                patients={patients}
                doctors={doctors}
                onOpenNewAppointmentModal={() => openNewAppointmentModal()}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onDeleteAppointment={handleDeleteAppointment}
                onSelectPatient={(p) => setDossierPatient(p)}
                onSelectDoctor={() => setActiveTab('doctors')}
                onCreateRecordFromAppointment={(apt) => openNewRecordModal(apt.patientId, apt.doctorId)}
              />
            )}

            {/* MEDICAL RECORDS VIEW */}
            {activeTab === 'records' && (
              <MedicalRecordsView
                records={records}
                patients={patients}
                doctors={doctors}
                onOpenNewRecordModal={() => openNewRecordModal()}
                onDeleteRecord={handleDeleteRecord}
                onSelectPatient={(p) => setDossierPatient(p)}
              />
            )}

            {/* WARDS VIEW */}
            {activeTab === 'wards' && (
              <WardsView
                rooms={rooms}
                patients={patients}
                onSelectPatient={(p) => setDossierPatient(p)}
                onAdmitPatientToRoom={handleAdmitPatientToRoom}
                onDischargePatientFromRoom={handleDischargePatientFromRoom}
              />
            )}

            {/* CLI TERMINAL */}
            {activeTab === 'cli' && (
              <InteractiveCli
                patients={patients}
                doctors={doctors}
                appointments={appointments}
                records={records}
                onRefreshData={refreshAllData}
              />
            )}

            {/* STORAGE EXPLORER */}
            {activeTab === 'storage' && (
              <StorageExplorer
                onRefreshData={refreshAllData}
              />
            )}

          </main>

          {/* Hospital Portal Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-teal-600">MediCare Hospital Suite</span>
                <span>•</span>
                <span>Role: {currentUser?.role.toUpperCase() || 'GUEST'}</span>
                <span>•</span>
                <span>JSON Persistence Active</span>
              </div>
              <div>
                <span>Made by Sajjan Kandel</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Universal Interactive Modals */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        initialData={patientToEdit}
      />

      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSave={handleSaveDoctor}
        initialData={doctorToEdit}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        patients={patients}
        doctors={doctors}
        preselectedPatientId={preselectedPatientId}
        preselectedDoctorId={preselectedDoctorId}
      />

      <MedicalRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveRecord}
        patients={patients}
        doctors={doctors}
        preselectedPatientId={preselectedPatientId}
        preselectedDoctorId={preselectedDoctorId}
      />

      <PatientDossierModal
        isOpen={!!dossierPatient}
        onClose={() => setDossierPatient(null)}
        patient={dossierPatient}
        appointments={appointments}
        records={records}
        onEditPatient={openEditPatientModal}
        onBookAppointment={(p) => openNewAppointmentModal(p.id)}
        onAddRecord={(p) => openNewRecordModal(p.id)}
      />

    </div>
  );
}
