import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Trash2, HelpCircle } from 'lucide-react';
import { Patient, Doctor, Appointment, MedicalRecord } from '../types/hospital';
import { storage } from '../services/storage';

interface InteractiveCliProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  onRefreshData: () => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const InteractiveCli: React.FC<InteractiveCliProps> = ({
  patients,
  doctors,
  appointments,
  records,
  onRefreshData
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: 'system',
      text: '==========================================================\n  HOSPITAL MANAGEMENT SYSTEM - INTERACTIVE CLI CONSOLE  \n  File-Based JSON Persistence v1.0.0 (TypeScript)\n==========================================================\nType "help" to view the available commands or "stats" for overview.'
    }
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const newLogs: LogEntry[] = [...logs, { type: 'input', text: `hms> ${trimmed}` }];
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help                             Show this command reference
  stats                            Show hospital occupancy & metrics summary
  clear                            Clear the terminal screen
  patients                         List all registered patients
  patient <id>                     Display full patient dossier
  patient search <name>            Search patients by name
  patient add <name> <gender> <blood>  Quick register new patient (e.g. patient add "Jane Doe" Female O+)
  doctors                          List all physicians on roster
  doctor <id>                      Display doctor profile & schedule
  doctor dept <specialty>          Filter doctors by specialty (e.g. doctor dept Cardiology)
  appointments                     List all appointments & visits
  appointment <id>                 Display detailed appointment
  appointment status <id> <status> Update status (e.g. appointment status APT-1710003001-301 completed)
  records                          List all medical records
  record <id>                      View clinical record vitals & prescriptions
  ls [path]                        List files (e.g. ls data/patients)
  cat <filename>                   Inspect raw JSON file contents (e.g. cat data/patients/PAT-1710002001-841.json)`
        });
        break;

      case 'clear':
        setLogs([]);
        return;

      case 'stats': {
        const inpatients = patients.filter(p => p.status === 'Inpatient' || p.status === 'Critical').length;
        const outpatients = patients.filter(p => p.status === 'Outpatient').length;
        const onDuty = doctors.filter(d => d.status === 'On Duty').length;
        const upcoming = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length;
        newLogs.push({
          type: 'output',
          text: `HOSPITAL CLINICAL METRICS:
  -----------------------------------------------
  Total Patients Registered : ${patients.length} (${inpatients} Inpatient, ${outpatients} Outpatient)
  Doctors on Duty           : ${onDuty} of ${doctors.length} physicians
  Upcoming Appointments     : ${upcoming}
  Total Medical Records     : ${records.length} EHR files
  JSON Persistence Database : ACTIVE (data/patients/, data/doctors/, ...)`
        });
        break;
      }

      case 'patients':
        if (patients.length === 0) {
          newLogs.push({ type: 'output', text: 'No patients registered.' });
        } else {
          let output = 'ID                    NAME                   AGE/GEN   BLOOD  STATUS      PHONE\n';
          output += '----------------------------------------------------------------------------------\n';
          patients.forEach(p => {
            output += `${p.id.padEnd(22)} ${p.name.padEnd(22)} ${(p.age + 'y/' + p.gender[0]).padEnd(9)} ${p.bloodGroup.padEnd(6)} ${p.status.padEnd(11)} ${p.phone}\n`;
          });
          newLogs.push({ type: 'output', text: output });
        }
        break;

      case 'patient': {
        const subCmd = args[0]?.toLowerCase();
        if (!subCmd) {
          newLogs.push({ type: 'error', text: 'Usage: patient <id> OR patient search <name> OR patient add <name> <gender> <bloodGroup>' });
        } else if (subCmd === 'search') {
          const query = args.slice(1).join(' ').toLowerCase();
          const matches = patients.filter(p => p.name.toLowerCase().includes(query));
          if (matches.length === 0) {
            newLogs.push({ type: 'output', text: `No patients found matching "${query}".` });
          } else {
            let output = `Found ${matches.length} matching patient(s):\n`;
            matches.forEach(p => {
              output += `  ${p.id} - ${p.name} (${p.age}y ${p.gender}, Blood: ${p.bloodGroup}, Status: ${p.status})\n`;
            });
            newLogs.push({ type: 'output', text: output });
          }
        } else if (subCmd === 'add') {
          const name = args[1] || 'New Patient';
          const gender = (args[2] === 'Male' || args[2] === 'Female') ? args[2] : 'Other';
          const blood = (args[3] as any) || 'O+';
          const newPat: Patient = {
            id: `PAT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
            name,
            dob: '1990-01-01',
            age: 36,
            gender,
            bloodGroup: blood,
            phone: '+1 (555) 000-0000',
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            address: 'City Medical District, NY',
            emergencyContact: { name: 'Emergency Contact', relation: 'Family', phone: '+1 (555) 000-0001' },
            allergies: [],
            chronicConditions: [],
            insurance: { provider: 'Standard Health', policyNumber: 'SH-9910', validUntil: '2027-12-31' },
            registeredAt: new Date().toISOString(),
            status: 'Outpatient'
          };
          storage.savePatient(newPat);
          onRefreshData();
          newLogs.push({
            type: 'success',
            text: `[OK] Registered new patient:\n  ID: ${newPat.id}\n  Name: ${newPat.name}\n  Gender: ${newPat.gender} | Blood: ${newPat.bloodGroup}`
          });
        } else {
          const p = patients.find(pat => pat.id.toLowerCase() === subCmd.toLowerCase() || pat.id.endsWith(subCmd));
          if (!p) {
            newLogs.push({ type: 'error', text: `Patient not found with ID: ${subCmd}` });
          } else {
            newLogs.push({
              type: 'output',
              text: `PATIENT PROFILE: ${p.name} (${p.id})
------------------------------------------------------
Age / Gender      : ${p.age} years old • ${p.gender}
Blood Group       : ${p.bloodGroup}
Clinical Status   : ${p.status} ${p.roomNumber ? `(Room: ${p.roomNumber})` : ''}
Contact Phone     : ${p.phone}
Email Address     : ${p.email}
Residential Addr  : ${p.address}
Emergency Contact : ${p.emergencyContact.name} (${p.emergencyContact.relation}) - ${p.emergencyContact.phone}
Allergies         : ${p.allergies.length ? p.allergies.join(', ') : 'None documented'}
Chronic Conditions: ${p.chronicConditions.length ? p.chronicConditions.join(', ') : 'None'}
Insurance Policy  : ${p.insurance.provider} (Policy #${p.insurance.policyNumber})
Registration Date : ${p.registeredAt}`
            });
          }
        }
        break;
      }

      case 'doctors':
        if (doctors.length === 0) {
          newLogs.push({ type: 'output', text: 'No doctors in roster.' });
        } else {
          let output = 'ID                    NAME                 SPECIALTY             ROOM        STATUS\n';
          output += '------------------------------------------------------------------------------------\n';
          doctors.forEach(d => {
            output += `${d.id.padEnd(22)} ${d.name.padEnd(20)} ${d.specialization.padEnd(21)} ${d.roomNumber.padEnd(11)} ${d.status}\n`;
          });
          newLogs.push({ type: 'output', text: output });
        }
        break;

      case 'doctor': {
        const id = args[0];
        if (!id) {
          newLogs.push({ type: 'error', text: 'Usage: doctor <id> OR doctor dept <specialization>' });
        } else if (id.toLowerCase() === 'dept') {
          const specialty = args.slice(1).join(' ').toLowerCase();
          const matches = doctors.filter(d => d.specialization.toLowerCase().includes(specialty));
          if (matches.length === 0) {
            newLogs.push({ type: 'output', text: `No doctors found in department "${specialty}".` });
          } else {
            let output = `Doctors in ${specialty}:\n`;
            matches.forEach(d => {
              output += `  ${d.id} - ${d.name} (${d.title}) | Room: ${d.roomNumber} | Fee: $${d.consultationFee}\n`;
            });
            newLogs.push({ type: 'output', text: output });
          }
        } else {
          const doc = doctors.find(d => d.id.toLowerCase() === id.toLowerCase() || d.id.endsWith(id));
          if (!doc) {
            newLogs.push({ type: 'error', text: `Doctor not found with ID: ${id}` });
          } else {
            newLogs.push({
              type: 'output',
              text: `PHYSICIAN PROFILE: ${doc.name} (${doc.id})
------------------------------------------------------
Title & Credential: ${doc.title}
Specialization    : ${doc.specialization} (${doc.department})
License Number    : ${doc.licenseNumber}
Consultation Fee  : $${doc.consultationFee}
Current Status    : ${doc.status}
Consulting Room   : ${doc.roomNumber}
Office Hours      : ${doc.officeHours}
Available Days    : ${doc.availableDays.join(', ')}
Contact           : ${doc.email} • ${doc.phone}`
            });
          }
        }
        break;
      }

      case 'appointments':
        if (appointments.length === 0) {
          newLogs.push({ type: 'output', text: 'No appointments scheduled.' });
        } else {
          let output = 'ID                    DATE       TIME      PATIENT               DOCTOR              STATUS\n';
          output += '-------------------------------------------------------------------------------------------\n';
          appointments.forEach(a => {
            output += `${a.id.padEnd(22)} ${a.date} ${a.time.padEnd(9)} ${a.patientName.padEnd(21)} ${a.doctorName.padEnd(19)} ${a.status}\n`;
          });
          newLogs.push({ type: 'output', text: output });
        }
        break;

      case 'appointment': {
        const sub = args[0]?.toLowerCase();
        if (sub === 'status') {
          const aptId = args[1];
          const newStatus = args[2] as any;
          if (!aptId || !newStatus) {
            newLogs.push({ type: 'error', text: 'Usage: appointment status <id> <Scheduled|Confirmed|In-Progress|Completed|Cancelled>' });
          } else {
            const formattedStatus = (newStatus[0].toUpperCase() + newStatus.slice(1).toLowerCase()) as any;
            storage.updateAppointmentStatus(aptId, formattedStatus);
            onRefreshData();
            newLogs.push({ type: 'success', text: `[OK] Updated appointment ${aptId} status to: ${formattedStatus}` });
          }
        } else if (sub) {
          const apt = appointments.find(a => a.id.toLowerCase() === sub.toLowerCase() || a.id.endsWith(sub));
          if (!apt) {
            newLogs.push({ type: 'error', text: `Appointment not found: ${sub}` });
          } else {
            newLogs.push({
              type: 'output',
              text: `APPOINTMENT DETAILS: ${apt.id}
------------------------------------------------------
Patient           : ${apt.patientName} (${apt.patientId})
Physician         : ${apt.doctorName} (${apt.doctorId}) - ${apt.doctorSpecialization}
Date & Time       : ${apt.date} at ${apt.time}
Visit Type        : ${apt.type}
Status            : ${apt.status}
Consultation Fee  : $${apt.fee}
Reason for Visit  : ${apt.reason}
Physician Notes   : ${apt.notes || 'None'}`
            });
          }
        } else {
          newLogs.push({ type: 'error', text: 'Usage: appointment <id> OR appointment status <id> <status>' });
        }
        break;
      }

      case 'records':
        if (records.length === 0) {
          newLogs.push({ type: 'output', text: 'No medical records logged.' });
        } else {
          let output = 'ID                    DATE       PATIENT               DIAGNOSIS\n';
          output += '-------------------------------------------------------------------------------------------\n';
          records.forEach(r => {
            output += `${r.id.padEnd(22)} ${r.date} ${r.patientName.padEnd(21)} ${r.diagnosis}\n`;
          });
          newLogs.push({ type: 'output', text: output });
        }
        break;

      case 'record': {
        const id = args[0];
        if (!id) {
          newLogs.push({ type: 'error', text: 'Usage: record <id>' });
        } else {
          const rec = records.find(r => r.id.toLowerCase() === id.toLowerCase() || r.id.endsWith(id));
          if (!rec) {
            newLogs.push({ type: 'error', text: `Record not found: ${id}` });
          } else {
            let rxList = rec.prescriptions.map(rx => `    - ${rx.medicine} (${rx.dosage}, ${rx.frequency})`).join('\n');
            newLogs.push({
              type: 'output',
              text: `ELECTRONIC MEDICAL RECORD: ${rec.id}
------------------------------------------------------
Patient           : ${rec.patientName} (${rec.patientId})
Doctor            : ${rec.doctorName} (${rec.doctorId})
Date              : ${rec.date}
Diagnosis         : ${rec.diagnosis}
Chief Complaint   : ${rec.chiefComplaint}
Clinical Vitals   : BP ${rec.vitals.bpSystolic}/${rec.vitals.bpDiastolic} mmHg | HR ${rec.vitals.heartRate} bpm | Temp ${rec.vitals.temperature}°F | SpO2 ${rec.vitals.oxygenSaturation}%
Prescriptions     :\n${rxList || '    (None)'}
Clinical Notes    : ${rec.clinicalNotes}`
            });
          }
        }
        break;
      }

      case 'ls': {
        const targetPath = args[0] || 'data';
        const files = storage.getAllVirtualFiles();
        const filtered = files.filter(f => f.path.startsWith(targetPath));
        if (filtered.length === 0) {
          newLogs.push({ type: 'output', text: `Directory ${targetPath}/ is empty or not found.` });
        } else {
          let output = `Directory contents of ${targetPath}/ (${filtered.length} files):\n`;
          filtered.slice(0, 15).forEach(f => {
            output += `  ${f.path.padEnd(46)} (${f.sizeBytes} bytes)\n`;
          });
          if (filtered.length > 15) {
            output += `  ... and ${filtered.length - 15} more files. Use "cat <filepath>" to inspect.`;
          }
          newLogs.push({ type: 'output', text: output });
        }
        break;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename) {
          newLogs.push({ type: 'error', text: 'Usage: cat <filename> (e.g. cat data/patients/PAT-1710002001-841.json)' });
        } else {
          const files = storage.getAllVirtualFiles();
          const target = files.find(f => f.path.toLowerCase() === filename.toLowerCase() || f.filename.toLowerCase() === filename.toLowerCase());
          if (!target) {
            newLogs.push({ type: 'error', text: `File not found: ${filename}` });
          } else {
            newLogs.push({ type: 'output', text: `[Content of ${target.path}]:\n${target.content}` });
          }
        }
        break;
      }

      default:
        newLogs.push({
          type: 'error',
          text: `Command not recognized: "${command}". Type "help" to see available commands.`
        });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* CLI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-teal-600" />
            <span>Interactive Hospital Management CLI</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct console interface executing clinical file operations, patient searches, doctor lookups, and JSON data reads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCommand('help')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Help Guide</span>
          </button>
          <button
            onClick={() => setLogs([])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Screen</span>
          </button>
        </div>
      </div>

      {/* Terminal Shell Container */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-4 font-mono text-xs shadow-lg min-h-[480px] flex flex-col cursor-text"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="ml-2 text-slate-300 font-semibold">hospital-management-system: ~ npm run cli</span>
          </div>
          <span className="text-slate-500">hms-interactive-shell</span>
        </div>

        {/* Terminal Logs Output */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[550px] pr-2">
          {logs.map((log, index) => {
            if (log.type === 'input') {
              return (
                <div key={index} className="text-teal-400 font-semibold">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'error') {
              return (
                <div key={index} className="text-rose-400 whitespace-pre-wrap">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'success') {
              return (
                <div key={index} className="text-emerald-400 whitespace-pre-wrap">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'system') {
              return (
                <div key={index} className="text-slate-400 whitespace-pre-wrap">
                  {log.text}
                </div>
              );
            }
            return (
              <div key={index} className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {log.text}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Command Line Input */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <span className="text-teal-400 font-bold select-none">hms&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'patients', 'doctors', 'appointments', 'records', 'stats'..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
            autoFocus
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="text-slate-500 hover:text-teal-400 transition-colors p-1 cursor-pointer"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
