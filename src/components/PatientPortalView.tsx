import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  AlertCircle, 
  Plus, 
  Heart, 
  Activity, 
  ShieldCheck, 
  Phone, 
  Pill, 
  Stethoscope, 
  CheckCircle2, 
  ChevronRight,
  Search
} from 'lucide-react';
import { Patient, Doctor, Appointment, MedicalRecord } from '../types/hospital';

interface PatientPortalViewProps {
  currentPatient?: Patient;
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  onBookAppointment: (doctorId?: string) => void;
  onOpenPatientDossier: (patient: Patient) => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  currentPatient,
  doctors,
  appointments,
  records,
  onBookAppointment,
  onOpenPatientDossier
}) => {
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Filter patient's appointments and records
  const myAppointments = currentPatient 
    ? appointments.filter(a => a.patientId === currentPatient.id)
    : appointments.slice(0, 3);

  const myRecords = currentPatient 
    ? records.filter(r => r.patientId === currentPatient.id)
    : records.slice(0, 3);

  // Doctors list
  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialization)))];
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Patient Welcome Header */}
      <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold">
              <User className="w-3.5 h-3.5" />
              <span>Patient Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {currentPatient?.name || 'Valued Patient'}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Access your upcoming clinical visits, verified prescription history, and connect with board-certified physicians.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onBookAppointment()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sky-700 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            {currentPatient && (
              <button
                onClick={() => onOpenPatientDossier(currentPatient)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>My Health Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Patient Key Metrics Cards */}
      {currentPatient && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Blood Group</span>
            <span className="text-xl font-black text-rose-600 mt-1 block font-mono">{currentPatient.bloodGroup}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Universal Compatibility</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Care Status</span>
            <span className="text-xl font-bold text-teal-600 mt-1 block">{currentPatient.status}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{currentPatient.roomNumber ? `Room: ${currentPatient.roomNumber}` : 'Outpatient Care'}</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Known Allergies</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block truncate">
              {currentPatient.allergies.length > 0 ? currentPatient.allergies.join(', ') : 'None Reported'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Verified by clinical staff</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Emergency Contact</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block truncate">
              {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relation})
            </span>
            <span className="text-[10px] text-sky-600 mt-0.5 block font-mono">{currentPatient.emergencyContact.phone}</span>
          </div>
        </div>
      )}

      {/* Two-column layout: Appointments & Medical Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-base text-slate-900">My Appointments</h2>
            </div>
            <button
              onClick={() => onBookAppointment()}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
            >
              + Book New
            </button>
          </div>

          {myAppointments.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No upcoming appointments. Schedule one with our doctors below!
            </div>
          ) : (
            <div className="space-y-3">
              {myAppointments.map(apt => {
                const doc = doctors.find(d => d.id === apt.doctorId);
                return (
                  <div key={apt.id} className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-sky-300 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {apt.type}
                        </h3>
                        <p className="text-slate-600 text-xs mt-0.5">
                          Doctor: <span className="font-semibold text-slate-800">{doc?.name || 'Assigned Physician'}</span> ({doc?.specialization})
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

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        apt.status === 'Completed' ? 'bg-sky-100 text-sky-700' :
                        apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Medical Records & Prescriptions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <h2 className="font-bold text-base text-slate-900">EHR Records &amp; Prescriptions</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{myRecords.length} records</span>
          </div>

          {myRecords.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No clinical records yet. Records appear here after doctor consultations.
            </div>
          ) : (
            <div className="space-y-3">
              {myRecords.map(rec => (
                <div key={rec.id} className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rec.diagnosis}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{rec.date}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    {rec.clinicalNotes}
                  </p>
                  {rec.prescriptions && rec.prescriptions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        Rx:
                      </span>
                      {rec.prescriptions.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-mono">
                          {p.medicine} ({p.dosage})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Doctors Directory for Patient */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-base text-slate-900">Book With Our Medical Specialists</h2>
            <p className="text-slate-500 text-xs">Filter by specialty and book directly with certified doctors.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Search doctors..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-200">
                  {doc.avatar ? (
                    <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{doc.name}</h3>
                  <p className="text-sky-600 text-xs font-semibold">{doc.specialization}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{doc.department} • Room {doc.roomNumber}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-900">${doc.consultationFee}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">Rating: ★ {doc.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {doc.availableDays.slice(0, 3).join(', ')}
                </span>
                <button
                  onClick={() => onBookAppointment(doc.id)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Book Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
