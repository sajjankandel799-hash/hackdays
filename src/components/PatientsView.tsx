import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  FileText,
  Trash2,
  Edit,
  Heart,
  Droplet
} from 'lucide-react';
import { Patient, BloodGroup, PatientStatus, Appointment, MedicalRecord } from '../types/hospital';

interface PatientsViewProps {
  patients: Patient[];
  appointments: Appointment[];
  records: MedicalRecord[];
  onSelectPatient: (patient: Patient) => void;
  onOpenNewPatientModal: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onBookAppointmentForPatient: (patient: Patient) => void;
  onAddRecordForPatient: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  appointments,
  records,
  onSelectPatient,
  onOpenNewPatientModal,
  onEditPatient,
  onDeletePatient,
  onBookAppointmentForPatient,
  onAddRecordForPatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [bloodFilter, setBloodFilter] = useState<string>('All');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesBlood = bloodFilter === 'All' || p.bloodGroup === bloodFilter;

    return matchesSearch && matchesStatus && matchesBlood;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Patient Registry &amp; Health Records</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered patients directory with clinical histories, demographics, and insurance policies.
          </p>
        </div>
        <button
          onClick={onOpenNewPatientModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, ID (e.g. PAT-...), phone, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter patients by clinical status"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 w-full md:w-auto cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Inpatient">Inpatient</option>
            <option value="Critical">Critical</option>
            <option value="Discharged">Discharged</option>
          </select>

          {/* Blood Group Filter */}
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            aria-label="Filter patients by blood group"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 w-full md:w-auto cursor-pointer"
          >
            <option value="All">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Patient Information</th>
                <th className="py-3 px-4 font-semibold">Demographics</th>
                <th className="py-3 px-4 font-semibold">Blood Group</th>
                <th className="py-3 px-4 font-semibold">Contact &amp; Location</th>
                <th className="py-3 px-4 font-semibold">Clinical Status</th>
                <th className="py-3 px-4 font-semibold">Insurance &amp; Policy</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
                  const patientRecords = records.filter(r => r.patientId === patient.id);
                  return (
                    <tr 
                      key={patient.id} 
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectPatient(patient)}
                    >
                      {/* Name & ID & Password */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {patient.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-600 tabular-nums flex items-center gap-2 mt-0.5">
                          <span>ID: <strong className="text-slate-900">{patient.id}</strong></span>
                          <span>•</span>
                          <span>Pass: <strong className="text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">{patient.password || 'patient123'}</strong></span>
                        </div>
                        {patient.allergies.length > 0 && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[150px]">
                              Allergic: {patient.allergies.join(', ')}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Demographics */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-slate-800 font-medium font-mono tabular-nums">
                          {patient.age} yrs • {patient.gender}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          DOB: {patient.dob}
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                          <Droplet className="w-3 h-3 fill-red-500 text-red-600" />
                          {patient.bloodGroup}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-mono tabular-nums flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {patient.address}
                        </div>
                      </td>

                      {/* Clinical Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          patient.status === 'Inpatient'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : patient.status === 'Critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : patient.status === 'Discharged'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {patient.status}
                          {patient.roomNumber && ` (${patient.roomNumber})`}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono tabular-nums">
                          {patientRecords.length} Records • {patientAppointments.length} Appts
                        </div>
                      </td>

                      {/* Insurance */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[160px]">
                          {patient.insurance.provider}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                          {patient.insurance.policyNumber}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onBookAppointmentForPatient(patient)}
                            title="Book Appointment"
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAddRecordForPatient(patient)}
                            title="Add Medical Record"
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditPatient(patient)}
                            title="Edit Patient"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove patient ${patient.name}?`)) {
                                onDeletePatient(patient.id);
                              }
                            }}
                            title="Delete Patient"
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
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
