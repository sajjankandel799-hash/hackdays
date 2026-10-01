import React, { useState } from 'react';
import { 
  BedDouble, 
  Plus, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  LogOut,
  Building,
  Heart
} from 'lucide-react';
import { WardRoom, Patient } from '../types/hospital';

interface WardsViewProps {
  rooms: WardRoom[];
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAdmitPatientToRoom: (roomId: string, patientId: string) => void;
  onDischargePatientFromRoom: (roomId: string, patientId: string) => void;
}

export const WardsView: React.FC<WardsViewProps> = ({
  rooms,
  patients,
  onSelectPatient,
  onAdmitPatientToRoom,
  onDischargePatientFromRoom
}) => {
  const [selectedRoomForAdmission, setSelectedRoomForAdmission] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const availableBeds = totalCapacity - totalOccupied;

  // Non-admitted patients for admission modal
  const eligiblePatients = patients.filter(p => p.status === 'Outpatient' || p.status === 'Discharged');

  const handleConfirmAdmission = (roomId: string) => {
    if (!selectedPatientId) return;
    onAdmitPatientToRoom(roomId, selectedPatientId);
    setSelectedRoomForAdmission(null);
    setSelectedPatientId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-teal-600" />
            <span>Ward &amp; Inpatient Bed Occupancy</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of critical care units, semi-private rooms, pediatric wards, and patient admissions.
          </p>
        </div>
        
        {/* Global Bed Census Banner */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
          <div>
            <span className="text-slate-500 block text-[10px]">Total Beds</span>
            <span className="font-bold text-slate-900 text-sm">{totalCapacity}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[10px]">Occupied</span>
            <span className="font-bold text-amber-700 text-sm">{totalOccupied}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 block text-[10px]">Available</span>
            <span className="font-bold text-emerald-700 text-sm">{availableBeds}</span>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const occupancyPercent = Math.round((room.occupied / room.capacity) * 100);
          const isFull = room.occupied >= room.capacity;
          const assignedPatients = patients.filter(p => room.currentPatientIds.includes(p.id));

          return (
            <div 
              key={room.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
            >
              <div>
                {/* Room Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-mono">
                      {room.roomNumber}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {room.department} • {room.type}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isFull 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : room.occupied === 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isFull ? 'Full' : `${room.capacity - room.occupied} Available`}
                  </span>
                </div>

                {/* Occupancy Meter */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-mono tabular-nums">
                    <span>Occupancy</span>
                    <span className="font-semibold text-slate-900">
                      {room.occupied} / {room.capacity} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-red-500' : occupancyPercent > 50 ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Admitted Patients List */}
                <div className="mt-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Current Occupants ({assignedPatients.length})
                  </span>
                  {assignedPatients.length === 0 ? (
                    <div className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No patients currently assigned to this room.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                      {assignedPatients.map((patient) => (
                        <div 
                          key={patient.id}
                          className="p-2.5 bg-white flex items-center justify-between gap-2 text-xs"
                        >
                          <div 
                            onClick={() => onSelectPatient(patient)}
                            className="cursor-pointer hover:text-teal-600 min-w-0"
                          >
                            <div className="font-semibold text-slate-900 truncate">
                              {patient.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {patient.id} • {patient.age}y • {patient.gender}
                            </div>
                          </div>
                          <button
                            onClick={() => onDischargePatientFromRoom(room.id, patient.id)}
                            title="Discharge patient from room"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Discharge</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Admission Drawer / Action */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                {selectedRoomForAdmission === room.id ? (
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Select Patient to Admit:
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white cursor-pointer"
                    >
                      <option value="">-- Choose registered patient --</option>
                      {eligiblePatients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.id}) - {p.gender}, {p.age}y
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleConfirmAdmission(room.id)}
                        disabled={!selectedPatientId}
                        className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded transition-colors cursor-pointer"
                      >
                        Confirm Admission
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoomForAdmission(null);
                          setSelectedPatientId('');
                        }}
                        className="py-1.5 px-3 text-xs text-slate-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedRoomForAdmission(room.id)}
                    disabled={isFull}
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isFull 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isFull ? 'Room Fully Occupied' : 'Admit Patient to Room'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
