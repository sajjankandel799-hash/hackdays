import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Activity, 
  Pill, 
  Calendar, 
  User, 
  Heart, 
  Thermometer, 
  Scale, 
  Trash2, 
  Printer,
  ChevronDown,
  ChevronUp,
  Stethoscope
} from 'lucide-react';
import { MedicalRecord, Patient, Doctor } from '../types/hospital';

interface MedicalRecordsViewProps {
  records: MedicalRecord[];
  patients: Patient[];
  doctors: Doctor[];
  onOpenNewRecordModal: () => void;
  onDeleteRecord: (id: string) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
  records,
  patients,
  doctors,
  onOpenNewRecordModal,
  onDeleteRecord,
  onSelectPatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(records[0]?.id || null);

  const filteredRecords = records.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(query) ||
      r.doctorName.toLowerCase().includes(query) ||
      r.diagnosis.toLowerCase().includes(query) ||
      r.chiefComplaint.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.prescriptions.some(p => p.medicine.toLowerCase().includes(query))
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedRecordId(expandedRecordId === id ? null : id);
  };

  const calculateBMI = (weightKg: number, heightCm: number) => {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    return bmi;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>Electronic Health Records (EHR) &amp; Clinical Encounters</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnostic encounters, clinical vitals, pharmacological prescriptions, and lab investigations.
          </p>
        </div>
        <button
          onClick={onOpenNewRecordModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Clinical Record</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by diagnosis, medication, patient, physician, or record ID (MED-...)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Records Accordion List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            No medical records found matching your query.
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isExpanded = expandedRecordId === record.id;
            const patient = patients.find(p => p.id === record.patientId);
            const bmi = calculateBMI(record.vitals.weightKg, record.vitals.heightCm);

            return (
              <div 
                key={record.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                {/* Accordion Summary Header */}
                <div 
                  onClick={() => toggleExpand(record.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {record.diagnosis}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                          {record.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (patient) onSelectPatient(patient);
                          }}
                          className="font-medium text-slate-900 hover:text-teal-600 transition-colors underline cursor-pointer"
                        >
                          {record.patientName}
                        </button>
                        <span>•</span>
                        <span>Attending: {record.doctorName}</span>
                        <span>•</span>
                        <span className="font-mono tabular-nums text-slate-500">Date: {record.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Badges & Controls */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                      <span>BP {record.vitals.bpSystolic}/{record.vitals.bpDiastolic}</span>
                      <span>•</span>
                      <span>HR {record.vitals.heartRate} bpm</span>
                      <span>•</span>
                      <span>SpO2 {record.vitals.oxygenSaturation}%</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.print();
                        }}
                        title="Print Clinical Record"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete medical record ${record.id}?`)) {
                            onDeleteRecord(record.id);
                          }
                        }}
                        title="Delete Record"
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-50/50 border-t border-slate-200 space-y-5 text-xs">
                    {/* Chief Complaint */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Chief Complaint &amp; Presenting Symptoms
                      </h4>
                      <p className="text-slate-800 text-xs font-medium">
                        "{record.chiefComplaint}"
                      </p>
                      {record.symptoms.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {record.symptoms.map((s, idx) => (
                            <span 
                              key={idx} 
                              className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Vitals Grid */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-teal-600" />
                        <span>Clinical Vitals &amp; Measurements</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {record.vitals.bpSystolic}/{record.vitals.bpDiastolic}
                          </span>
                          <span className="text-[10px] text-slate-400 block">mmHg</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">Heart Rate</span>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {record.vitals.heartRate}
                          </span>
                          <span className="text-[10px] text-slate-400 block">bpm</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">SpO2 Oxygen</span>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {record.vitals.oxygenSaturation}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">Normal &gt; 95%</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">Temperature</span>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {record.vitals.temperature}°
                          </span>
                          <span className="text-[10px] text-slate-400 block">Oral/Core</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">Respiratory</span>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {record.vitals.respiratoryRate}
                          </span>
                          <span className="text-[10px] text-slate-400 block">breaths/min</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">Weight / Height</span>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {record.vitals.weightKg} kg
                          </span>
                          <span className="text-[10px] text-slate-400 block">{record.vitals.heightCm} cm</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block">Body Mass Index</span>
                          <span className="font-mono font-bold text-teal-700 text-sm tabular-nums">
                            {bmi || 'N/A'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">kg/m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Prescriptions */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>Prescriptions &amp; Pharmacotherapy</span>
                      </h4>
                      {record.prescriptions.length === 0 ? (
                        <p className="text-slate-500 italic">No prescriptions issued for this encounter.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200">
                              <tr>
                                <th className="py-2 px-3">Medication</th>
                                <th className="py-2 px-3">Dosage</th>
                                <th className="py-2 px-3">Frequency</th>
                                <th className="py-2 px-3">Duration</th>
                                <th className="py-2 px-3">Instructions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {record.prescriptions.map((rx) => (
                                <tr key={rx.id}>
                                  <td className="py-2 px-3 font-semibold text-slate-900">{rx.medicine}</td>
                                  <td className="py-2 px-3 font-mono tabular-nums text-slate-700">{rx.dosage}</td>
                                  <td className="py-2 px-3 text-slate-700">{rx.frequency}</td>
                                  <td className="py-2 px-3 text-slate-700">{rx.duration}</td>
                                  <td className="py-2 px-3 text-slate-500 italic">{rx.instructions}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Clinical Notes & Labs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Clinical Notes */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Clinical Examination &amp; Physician Notes
                        </h4>
                        <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                          {record.clinicalNotes}
                        </p>
                        {record.followUpDate && (
                          <div className="mt-3 text-[11px] font-mono tabular-nums text-teal-700 font-semibold">
                            Recommended Follow-up: {record.followUpDate}
                          </div>
                        )}
                      </div>

                      {/* Lab Tests Ordered */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Diagnostic Lab Orders &amp; Investigations
                        </h4>
                        {record.labTestsOrdered.length === 0 ? (
                          <p className="text-slate-500 italic">No lab tests ordered.</p>
                        ) : (
                          <ul className="space-y-1.5 mt-2">
                            {record.labTestsOrdered.map((test, i) => (
                              <li key={i} className="flex items-center gap-2 text-slate-700 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                <span>{test}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
