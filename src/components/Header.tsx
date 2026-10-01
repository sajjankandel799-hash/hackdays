import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  BedDouble, 
  Terminal, 
  Database, 
  LayoutDashboard,
  Plus,
  Download,
  Heart,
  Activity,
  Home,
  ShieldCheck,
  User,
  Stethoscope,
  Briefcase,
  LogOut,
  LogIn
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/hospital';

export type ActiveTab = 
  | 'landing'
  | 'signin'
  | 'admin'
  | 'dashboard' 
  | 'patients' 
  | 'doctors' 
  | 'appointments' 
  | 'records' 
  | 'wards' 
  | 'cli' 
  | 'storage';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: AuthUser | null;
  onOpenSignIn: (role?: UserRole) => void;
  onSignOut: () => void;
  onOpenNewPatientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewRecordModal: () => void;
  onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenSignIn,
  onSignOut,
  onOpenNewPatientModal,
  onOpenNewAppointmentModal,
  onOpenNewRecordModal,
  onExportData
}) => {
  // Build role-tailored navigation items
  const role = currentUser?.role || 'admin';
  let navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [];

  if (role === 'admin') {
    navItems = [
      { id: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> },
      { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
      { id: 'doctors', label: 'Doctors', icon: <UserCheck className="w-4 h-4" /> },
      { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
      { id: 'records', label: 'EHR Records', icon: <FileText className="w-4 h-4" /> },
      { id: 'wards', label: 'Wards & Beds', icon: <BedDouble className="w-4 h-4" /> },
      { id: 'cli', label: 'CLI', icon: <Terminal className="w-4 h-4" /> },
      { id: 'storage', label: 'JSON Files', icon: <Database className="w-4 h-4" /> },
    ];
  } else if (role === 'doctor') {
    navItems = [
      { id: 'dashboard', label: 'Doctor Workspace', icon: <Stethoscope className="w-4 h-4 text-teal-400" /> },
      { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
      { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
      { id: 'records', label: 'EHR Records', icon: <FileText className="w-4 h-4" /> },
    ];
  } else {
    // Patient
    navItems = [
      { id: 'dashboard', label: 'My Health Portal', icon: <User className="w-4 h-4 text-sky-400" /> },
      { id: 'appointments', label: 'My Appointments', icon: <Calendar className="w-4 h-4" /> },
      { id: 'doctors', label: 'Doctors Directory', icon: <UserCheck className="w-4 h-4" /> },
      { id: 'records', label: 'My Medical Records', icon: <FileText className="w-4 h-4" /> },
    ];
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* MediCare Logo Wordmark */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 fill-white/20 text-white" />
                <Activity className="w-2.5 h-2.5 text-cyan-900 absolute" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-teal-600 tracking-tight text-lg leading-tight">
                MediCare
              </span>
              <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                {role.toUpperCase()} PORTAL
              </span>
            </div>
          </div>

          {/* Navigation Links / Segmented Tabs */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'landing'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? item.id === 'admin'
                        ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-xs font-bold'
                        : 'bg-slate-900 text-white shadow-xs'
                      : item.id === 'admin'
                        ? 'text-cyan-700 bg-cyan-50 hover:bg-cyan-100 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account Chip & Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <button
                onClick={onExportData}
                title="Download consolidated JSON backup"
                className="hidden sm:inline-flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenNewAppointmentModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Book Appointment</span>
            </button>

            {role === 'admin' && (
              <button
                onClick={onOpenNewPatientModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm shadow-sky-500/20 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Patient</span>
              </button>
            )}

            {/* Current User Role Chip and Switch Button */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div 
                  onClick={() => onOpenSignIn()}
                  title="Switch Role or Account"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer group"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                    currentUser.role === 'admin' ? 'bg-gradient-to-tr from-sky-500 to-teal-500' :
                    currentUser.role === 'doctor' ? 'bg-teal-600' :
                    'bg-sky-500'
                  }`}>
                    {currentUser.role === 'admin' ? <Briefcase className="w-3 h-3" /> : 
                     currentUser.role === 'doctor' ? <Stethoscope className="w-3 h-3" /> : 
                     <User className="w-3 h-3" />}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 capitalize leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenSignIn()}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs hover:bg-sky-100 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile / Narrow Nav Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-1 py-2 border-t border-slate-100 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'landing'
                ? 'bg-sky-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>Home</span>
          </button>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
