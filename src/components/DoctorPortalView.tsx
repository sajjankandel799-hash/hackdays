import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Check, 
  AlertCircle,
  Pill,
  DollarSign
} from 'lucide-react';
import { Doctor, Patient, Appointment, MedicalRecord, DoctorStatus, AppointmentStatus } from '../types/hospital';

interface DoctorPortalViewProps {
  currentDoctor?: Doctor;
  patients: Patient[];
  appointments: Appointment[];
  records: MedicalRecord[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onUpdateDoctorStatus: (id: string, status: DoctorStatus) => void;
  onWriteRecord: (patientId: string, doctorId: string) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const DoctorPortalView: React.FC<DoctorPortalViewProps> = ({
  currentDoctor,
  patients,
  appointments,
  records,
  onUpdateAppointmentStatus,
  onUpdateDoctorStatus,
  onWriteRecord,
  onSelectPatient
}) => {
  // If no doctor passed, fallback to first doctor in list
  const doctor = currentDoctor;
  const docAppointments = doctor 
    ? appointments.filter(a => a.doctorId === doctor.id)
    : appointments;

  const docPatients = patients.filter(p => 
    docAppointments.some(a => a.patientId === p.id) || p.assignedDoctorId === doctor?.id
  );

  const completedCount = docAppointments.filter(a => a.status === 'Completed').length;
  const scheduledCount = docAppointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border-2 border-teal-400/40 flex items-center justify-center text-white shrink-0 shadow-md">
              {doctor?.avatar ? (
                <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Stethoscope className="w-8 h-8 text-teal-300" />
              )}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-300/30 text-teal-200 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                <span>Physician Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {doctor?.name || 'Dr. Medical Staff'}
              </h1>
              <p className="text-teal-100 text-xs sm:text-sm">
                {doctor?.specialization || 'Clinical Specialist'} • {doctor?.department || 'Outpatient Clinic'} • Room {doctor?.roomNumber || '301'}
              </p>
            </div>
          </div>

          {/* Status selector */}
          {doctor && (
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 space-y-1.5">
              <span className="text-[11px] font-bold text-teal-200 block uppercase tracking-wider">
                My Clinical Status:
              </span>
              <div className="flex items-center gap-1.5">
                {(['On Duty', 'In Consultation', 'On Break', 'Off Duty'] as DoctorStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateDoctorStatus(doctor.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      doctor.status === st 
                        ? 'bg-teal-400 text-slate-900 shadow-xs' 
                        : 'bg-white/10 hover:bg-white/20 text-white/90'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Today's Visits</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{scheduledCount}</span>
          <span className="text-[10px] text-sky-600 mt-0.5 block">Scheduled &amp; Confirmed</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Completed Consultations</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block font-mono">{completedCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Records archived</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Assigned Patients</span>
          <span className="text-2xl font-black text-teal-600 mt-1 block font-mono">{docPatients.length}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">In your patient roster</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Consultation Fee</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">${doctor?.consultationFee || 150}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Per appointment</span>
        </div>
      </div>

      {/* Main Doctor Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Appointment Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h2 className="font-bold text-base text-slate-900">Patient Appointment Queue</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{docAppointments.length} Total</span>
          </div>

          {docAppointments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No appointments scheduled for you right now.
            </div>
          ) : (
            <div className="space-y-3">
              {docAppointments.map(apt => {
                const patient = patients.find(p => p.id === apt.patientId);
                return (
                  <div key={apt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => patient && onSelectPatient(patient)}
                            className="font-bold text-sm text-slate-900 hover:text-teal-600 transition-colors cursor-pointer"
                          >
                            {patient?.name || 'Walk-in Patient'}
                          </button>
                          <span className="text-xs text-slate-500">
                            ({patient?.age || 30} yrs • {patient?.gender || 'N/A'})
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Reason: <span className="font-medium text-slate-800">{apt.reason}</span> ({apt.type})
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {apt.time}
                          </span>
                        </div>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Completed' ? 'bg-sky-100 text-sky-800' :
                          apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>

                        {apt.status === 'Scheduled' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'Confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}

                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Complete
                          </button>
                        )}

                        {patient && (
                          <button
                            onClick={() => onWriteRecord(patient.id, doctor?.id || apt.doctorId)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Write EHR</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Assigned Patients Roster */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-base text-slate-900">Patient Roster</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{docPatients.length}</span>
          </div>

          <div className="space-y-2.5">
            {docPatients.map(p => (
              <div 
                key={p.id} 
                onClick={() => onSelectPatient(p)}
                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-sky-300 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{p.phone} • Blood {p.bloodGroup}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
