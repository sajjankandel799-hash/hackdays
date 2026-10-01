import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Clock, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  Edit, 
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { Doctor, DoctorStatus, Appointment } from '../types/hospital';

interface DoctorsViewProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onSelectDoctor: (doctor: Doctor) => void;
  onOpenNewDoctorModal: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (id: string) => void;
  onUpdateDoctorStatus: (id: string, status: DoctorStatus) => void;
  onBookAppointmentWithDoctor: (doctor: Doctor) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  appointments,
  onSelectDoctor,
  onOpenNewDoctorModal,
  onEditDoctor,
  onDeleteDoctor,
  onUpdateDoctorStatus,
  onBookAppointmentWithDoctor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const departments = ['All', ...Array.from(new Set(doctors.map(d => d.specialization)))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDepartment === 'All' || doc.specialization === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <span>Physicians &amp; Medical Staff Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active physician roster, departmental specializations, consultation hours, and schedule availability.
          </p>
        </div>
        <button
          onClick={onOpenNewDoctorModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Department Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor by name, specialty, room, or license..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Specialization Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-5 flex flex-col justify-between shadow-xs group"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-3">
                  {doc.avatar ? (
                    <img 
                      src={doc.avatar} 
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                      {doc.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 
                        onClick={() => onSelectDoctor(doc)}
                        className="text-sm font-bold text-slate-900 hover:text-teal-600 cursor-pointer truncate"
                      >
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500 font-mono text-xs tabular-nums shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-teal-700 font-medium truncate mt-0.5">
                      {doc.title}
                    </p>
                    <div className="text-[11px] font-mono text-slate-500 tabular-nums flex flex-wrap items-center gap-1.5 mt-1">
                      <span>ID: <strong className="text-slate-800">{doc.id}</strong></span>
                      <span>•</span>
                      <span>Pass: <strong className="text-teal-800 bg-teal-50 px-1 rounded border border-teal-200">{doc.password || 'doctor123'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher & Office info */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duty Status</span>
                    <select
                      value={doc.status}
                      aria-label="Update physician duty status"
                      onChange={(e) => onUpdateDoctorStatus(doc.id, e.target.value as DoctorStatus)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                        doc.status === 'On Duty'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : doc.status === 'In Consultation'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : doc.status === 'On Break'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="On Duty">On Duty</option>
                      <option value="In Consultation">In Consultation</option>
                      <option value="On Break">On Break</option>
                      <option value="Off Duty">Off Duty</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Location</span>
                    </span>
                    <span className="font-medium text-slate-800">{doc.roomNumber}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Hours</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-800">{doc.officeHours}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-400" />
                      <span>Consultation</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">${doc.consultationFee}</span>
                  </div>
                </div>

                {/* Days available */}
                <div className="mt-3 flex items-center gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                    const isAvail = doc.availableDays.includes(day);
                    return (
                      <span
                        key={day}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isAvail 
                            ? 'bg-slate-100 font-semibold text-slate-800 border border-slate-200' 
                            : 'text-slate-300'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onBookAppointmentWithDoctor(doc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
                <button
                  onClick={() => onEditDoctor(doc)}
                  title="Edit Profile"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${doc.name} from the medical roster?`)) {
                      onDeleteDoctor(doc.id);
                    }
                  }}
                  title="Delete Doctor"
                  className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
