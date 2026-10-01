import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  FileText, 
  Trash2,
  User,
  ArrowRight
} from 'lucide-react';
import { Appointment, AppointmentStatus, Patient, Doctor } from '../types/hospital';

interface AppointmentsViewProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onOpenNewAppointmentModal: () => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onCreateRecordFromAppointment: (appointment: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  patients,
  doctors,
  onOpenNewAppointmentModal,
  onUpdateStatus,
  onDeleteAppointment,
  onSelectPatient,
  onSelectDoctor,
  onCreateRecordFromAppointment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');

  const todayStr = '2026-10-01'; // Clinical system baseline date

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'Today') {
      matchesDate = apt.date === todayStr;
    } else if (dateFilter === 'Upcoming') {
      matchesDate = apt.date >= todayStr;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            <span>Appointment Scheduling &amp; Consultation Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book visits, manage waiting room flow, update consultation states, and link medical encounters.
          </p>
        </div>
        <button
          onClick={onOpenNewAppointmentModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, physician, reason, or appointment ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter appointments by schedule date"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 cursor-pointer"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today's Queue</option>
            <option value="Upcoming">Upcoming Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter appointments by status"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Appointment ID &amp; Date</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Doctor &amp; Specialty</th>
                <th className="py-3 px-4 font-semibold">Visit Type &amp; Reason</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Fee</th>
                <th className="py-3 px-4 font-semibold text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                    No appointments found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const patient = patients.find(p => p.id === apt.patientId);
                  const doctor = doctors.find(d => d.id === apt.doctorId);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID and Date/Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 font-mono tabular-nums">
                          {apt.time}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {apt.date} • {apt.id}
                        </div>
                      </td>

                      {/* Patient */}
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

                      {/* Doctor */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => doctor && onSelectDoctor(doctor)}
                          className="font-medium text-slate-900 hover:text-teal-600 text-left transition-colors cursor-pointer"
                        >
                          {apt.doctorName}
                        </button>
                        <div className="text-[11px] text-slate-500">
                          {apt.doctorSpecialization}
                        </div>
                      </td>

                      {/* Visit Type & Reason */}
                      <td className="py-3 px-4 max-w-xs">
                        <span className="inline-block text-[11px] font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mb-1">
                          {apt.type}
                        </span>
                        <p className="text-slate-600 text-[11px] line-clamp-1">
                          {apt.reason}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          apt.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : apt.status === 'In-Progress' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : apt.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : apt.status === 'Confirmed'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {apt.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {apt.status === 'In-Progress' && <Activity className="w-3 h-3 animate-pulse" />}
                          {apt.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                          {apt.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                          {apt.status === 'Cancelled' && <AlertCircle className="w-3 h-3" />}
                          {apt.status}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-800 font-semibold">
                        ${apt.fee}
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Confirm */}
                          {apt.status === 'Scheduled' && (
                            <button
                              onClick={() => onUpdateStatus(apt.id, 'Confirmed')}
                              className="px-2 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-50 rounded border border-teal-200 transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          {/* Start Consultation */}
                          {(apt.status === 'Scheduled' || apt.status === 'Confirmed') && (
                            <button
                              onClick={() => onUpdateStatus(apt.id, 'In-Progress')}
                              className="px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded border border-blue-200 transition-colors cursor-pointer"
                            >
                              Check-In
                            </button>
                          )}
                          {/* Complete */}
                          {apt.status === 'In-Progress' && (
                            <button
                              onClick={() => onUpdateStatus(apt.id, 'Completed')}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors cursor-pointer"
                            >
                              Finish Visit
                            </button>
                          )}
                          {/* Log EHR Record Button */}
                          <button
                            onClick={() => onCreateRecordFromAppointment(apt)}
                            title="Log Medical Record for this patient"
                            className="p-1 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {/* Cancel */}
                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <button
                              onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                              title="Cancel"
                              className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete appointment record ${apt.id}?`)) {
                                onDeleteAppointment(apt.id);
                              }
                            }}
                            title="Delete"
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
