import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  BedDouble, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Terminal,
  Activity
} from 'lucide-react';
import { Patient, Doctor, Appointment, MedicalRecord, WardRoom } from '../types/hospital';
import { ActiveTab } from './Header';

interface DashboardOverviewProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  rooms: WardRoom[];
  onSelectPatient: (p: Patient) => void;
  onSelectDoctor: (d: Doctor) => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewPatientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewRecordModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  patients,
  doctors,
  appointments,
  records,
  rooms,
  onSelectPatient,
  onSelectDoctor,
  onUpdateAppointmentStatus,
  onNavigate,
  onOpenNewPatientModal,
  onOpenNewAppointmentModal,
  onOpenNewRecordModal
}) => {
  // Statistics calculations
  const totalPatients = patients.length;
  const inpatients = patients.filter(p => p.status === 'Inpatient' || p.status === 'Critical').length;
  const outpatients = patients.filter(p => p.status === 'Outpatient').length;
  const onDutyDoctors = doctors.filter(d => d.status === 'On Duty' || d.status === 'In Consultation').length;

  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const pendingAppointments = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Clinical Operations &amp; Hospital Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Real-time management of patients, physician rosters, clinical appointments, electronic health records, and JSON persistent storage.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewPatientModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Patient</span>
          </button>
          <button
            onClick={onOpenNewAppointmentModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={onOpenNewRecordModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Log EHR Record</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div 
          onClick={() => onNavigate('patients')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Patients
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {totalPatients}
            </span>
            <span className="text-xs text-slate-500">
              ({inpatients} Inpatient • {outpatients} Outpatient)
            </span>
          </div>
          <div className="mt-2 text-xs text-teal-700 flex items-center gap-1">
            <span>View directory</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onNavigate('doctors')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Doctors on Roster
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {doctors.length}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {onDutyDoctors} Active on Duty
            </span>
          </div>
          <div className="mt-2 text-xs text-blue-700 flex items-center gap-1">
            <span>View roster &amp; schedule</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onNavigate('appointments')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Appointments
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {pendingAppointments.length}
            </span>
            <span className="text-xs text-slate-500">
              Upcoming ({completedAppointments.length} Done)
            </span>
          </div>
          <div className="mt-2 text-xs text-purple-700 flex items-center gap-1">
            <span>Schedule calendar</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onNavigate('wards')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bed Occupancy
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {occupancyRate}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {totalOccupied} / {totalCapacity} Beds
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-700 flex items-center gap-1">
            <span>Ward floor status</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Grid: Clinical Appointments Schedule + Quick Staff & System Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Clinical Consultations Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Scheduled Appointments &amp; Consultations
              </h2>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-teal-700 hover:text-teal-800 font-medium cursor-pointer"
            >
              View all ({appointments.length})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Doctor &amp; Department</th>
                  <th className="py-3 px-4 font-semibold">Time / Date</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {appointments.slice(0, 5).map((apt) => {
                  const patient = patients.find(p => p.id === apt.patientId);
                  const doctor = doctors.find(d => d.id === apt.doctorId);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => patient && onSelectPatient(patient)}
                          className="font-medium text-slate-900 hover:text-teal-600 text-left transition-colors cursor-pointer"
                        >
                          {apt.patientName}
                        </button>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {apt.patientId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => doctor && onSelectDoctor(doctor)}
                          className="font-medium text-slate-800 hover:text-teal-600 text-left transition-colors cursor-pointer"
                        >
                          {apt.doctorName}
                        </button>
                        <div className="text-[11px] text-slate-500">
                          {apt.doctorSpecialization}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{apt.time}</div>
                        <div className="text-[11px] text-slate-500">{apt.date}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700">{apt.type}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          apt.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : apt.status === 'In-Progress' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : apt.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {apt.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {apt.status === 'In-Progress' && <Activity className="w-3 h-3 animate-pulse" />}
                          {apt.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                          {apt.status === 'Cancelled' && <AlertCircle className="w-3 h-3" />}
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'Completed')}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors cursor-pointer"
                            >
                              Done
                            </button>
                          )}
                          {apt.status === 'Scheduled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'In-Progress')}
                              className="px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded border border-blue-200 transition-colors cursor-pointer"
                            >
                              Start
                            </button>
                          )}
                          {apt.status !== 'Cancelled' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'Cancelled')}
                              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Physicians on Duty & Fast CLI access */}
        <div className="space-y-6">
          {/* Doctors On Duty */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Medical Staff on Duty
              </h3>
              <button
                onClick={() => onNavigate('doctors')}
                className="text-xs text-teal-700 hover:underline cursor-pointer"
              >
                All doctors ({doctors.length})
              </button>
            </div>
            <div className="divide-y divide-slate-100 mt-2">
              {doctors.slice(0, 4).map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => onSelectDoctor(doc)}
                  className="py-3 flex items-center gap-3 hover:bg-slate-50/60 p-2 rounded-lg cursor-pointer transition-colors"
                >
                  {doc.avatar ? (
                    <img 
                      src={doc.avatar} 
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {doc.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {doc.name}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        doc.status === 'On Duty' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : doc.status === 'In Consultation' 
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {doc.specialization} • {doc.roomNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal / CLI Card & Storage shortcut */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-300">
                  CLI &amp; File-Based Storage
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-400">
                npm run cli
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hospital Management System supports full file-based JSON persistence. You can run interactive shell commands or inspect raw record files.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onNavigate('cli')}
                className="flex-1 px-3 py-2 text-xs font-mono font-medium bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-lg transition-colors text-center cursor-pointer"
              >
                Launch CLI Terminal
              </button>
              <button
                onClick={() => onNavigate('storage')}
                className="px-3 py-2 text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 text-center cursor-pointer"
              >
                JSON Files
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Medical Records / EHR Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Electronic Health Records (EHR)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('records')}
            className="text-xs text-teal-700 hover:underline font-medium cursor-pointer"
          >
            All records ({records.length})
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {records.slice(0, 3).map((rec) => (
            <div 
              key={rec.id}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-mono tabular-nums">{rec.id}</span>
                  <span className="font-mono tabular-nums">{rec.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  {rec.patientName}
                </h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-2">
                  Dx: {rec.diagnosis}
                </p>
                <div className="text-[11px] text-slate-500 line-clamp-2 italic mb-3">
                  "{rec.chiefComplaint}"
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>By {rec.doctorName}</span>
                <span className="font-mono tabular-nums">
                  BP: {rec.vitals.bpSystolic}/{rec.vitals.bpDiastolic} • HR {rec.vitals.heartRate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
