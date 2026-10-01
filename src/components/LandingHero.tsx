import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Star, 
  PlayCircle, 
  Info, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Calendar,
  Users,
  BarChart3,
  Zap,
  Smartphone,
  Headphones,
  DollarSign,
  Globe,
  User,
  Stethoscope,
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Inbox,
  Send
} from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
  onOpenSignIn?: () => void;
  onOpenAppointmentModal: () => void;
  onOpenPatientModal: () => void;
  totalPatients: number;
  totalDoctors: number;
  appointmentsCount: number;
}

const TYPEWRITER_TEXTS = [
  "The most advanced hospital management system designed for modern healthcare. Connect patients, doctors, and administrators in one seamless platform.",
  "Streamline appointments, manage patient records, and enhance healthcare delivery with our comprehensive digital solution.",
  "Empowering healthcare providers with cutting-edge technology for better patient outcomes and operational efficiency."
];

const TARGET_EMAIL = 'sajjankandel799@gmail.com';

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGetStarted,
  onOpenSignIn,
  onOpenAppointmentModal,
  onOpenPatientModal,
  totalPatients,
  totalDoctors,
  appointmentsCount
}) => {
  // Typewriter effect state
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  // Gmail Modal State
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Scrolled header state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter loop
  useEffect(() => {
    const currentFullText = TYPEWRITER_TEXTS[textIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 35);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length - 1));
        }, 20);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Build Gmail URLs
  const getSubject = () => {
    return contactName 
      ? `MediCare Inquiry from ${contactName}` 
      : 'MediCare Hospital Management Inquiry';
  };

  const getBody = () => {
    return `Hello Sajjan,

Sender Name: ${contactName || 'Not specified'}
Sender Email: ${contactEmail || 'Not specified'}

Message:
${contactMsg || 'I would like to inquire about MediCare Hospital Management.'}

---
Sent via MediCare Portal`;
  };

  const getGmailWebComposeUrl = (customSubject?: string, customBody?: string) => {
    const su = encodeURIComponent(customSubject || getSubject());
    const body = encodeURIComponent(customBody || getBody());
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_EMAIL}&su=${su}&body=${body}`;
  };

  const getGmailAppUrl = (customSubject?: string, customBody?: string) => {
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const su = encodeURIComponent(customSubject || getSubject());
    const body = encodeURIComponent(customBody || getBody());

    if (isAndroid) {
      // Direct Android Gmail application intent
      return `intent:#Intent;action=android.intent.action.SENDTO;data=mailto:${TARGET_EMAIL}?subject=${su}&body=${body};package=com.google.android.gm;end`;
    }
    if (isIOS) {
      // iOS Google Gmail URL scheme
      return `googlegmail:///co?to=${TARGET_EMAIL}&subject=${su}&body=${body}`;
    }
    // Desktop / Default Mailto
    return `mailto:${TARGET_EMAIL}?subject=${su}&body=${body}`;
  };

  const getMailtoUrl = () => {
    const su = encodeURIComponent(getSubject());
    const body = encodeURIComponent(getBody());
    return `mailto:${TARGET_EMAIL}?subject=${su}&body=${body}`;
  };

  /**
   * Smart Gmail redirect handler:
   * 1. If on mobile, triggers the Gmail application intent
   * 2. Falls back to opening web Gmail compose in the browser
   */
  const handleRedirectToGmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // On Android, launch Gmail app via intent, and open web Gmail in background
      try {
        const intentUrl = getGmailAppUrl();
        window.location.href = intentUrl;
      } catch {
        window.location.href = getGmailWebComposeUrl();
      }
    } else if (isMobile) {
      // On iOS or other mobile
      try {
        window.location.href = getGmailAppUrl();
        setTimeout(() => {
          window.location.href = getGmailWebComposeUrl();
        }, 1200);
      } catch {
        window.location.href = getGmailWebComposeUrl();
      }
    } else {
      // Desktop: Open Gmail compose directly
      window.open(getGmailWebComposeUrl(), '_blank', 'noopener,noreferrer');
    }

    // Also open modal dialog for direct convenience & alternate options
    setIsGmailModalOpen(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(TARGET_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;

    setContactSubmitted(true);
    handleRedirectToGmail();
  };

  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Simply register as a patient, browse available doctors by specialty, and select your preferred time slot. You'll receive instant confirmation."
    },
    {
      q: "Is my medical data secure?",
      a: "Absolutely. We use bank-level encryption and are fully HIPAA compliant. Your data is stored securely and never shared without your consent."
    },
    {
      q: "Can I access my medical records?",
      a: "Yes! All your medical records are available 24/7 through your patient dashboard. You can view, download, and share them with healthcare providers."
    },
    {
      q: "What if I need to cancel an appointment?",
      a: "You can cancel or reschedule appointments directly from your dashboard. We recommend giving at least 24 hours notice when possible."
    },
    {
      q: "Do you offer support for healthcare providers?",
      a: "Yes! We provide dedicated support for doctors and administrators, including training, technical assistance, and best practices guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* ----------------------------------------------------------- */}
      {/* 1. FIXED GLASS HEADER                                       */}
      {/* ----------------------------------------------------------- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80' 
          : 'bg-white/75 backdrop-blur-md py-4 border-b border-white/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
                <Heart className="w-5 h-5 fill-white/20 text-white" />
                <Activity className="w-3 h-3 text-cyan-950 absolute" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
              MediCare
            </span>
          </div>

          {/* Navigation links with Lucide icons */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button 
              onClick={() => scrollTo('features')}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Star className="w-4 h-4 text-slate-400" />
              <span>Features</span>
            </button>
            <button 
              onClick={() => scrollTo('how-it-works')}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-slate-400" />
              <span>How It Works</span>
            </button>
            <button 
              onClick={() => scrollTo('benefits')}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About</span>
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Contact</span>
            </button>
          </nav>

          {/* Action buttons (Sign In, Get Started) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSignIn || onGetStarted}
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenSignIn || onGetStarted}
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl shadow-md shadow-sky-500/25 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>

      {/* ----------------------------------------------------------- */}
      {/* 2. HERO SECTION                                             */}
      {/* ----------------------------------------------------------- */}
      <section className="relative min-h-[640px] md:min-h-[720px] pt-28 pb-16 flex flex-col justify-between overflow-hidden">
        {/* Background with atmospheric medical tint */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#034d77] via-[#066598] to-[#0c82b9]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto pt-6">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-medium shadow-sm mb-6">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            <span>Trusted by 500+ Healthcare Providers</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Transform Your{' '}
            <span className="text-[#10b981] inline-block font-black">Healthcare</span>{' '}
            Experience
          </h1>

          {/* Dynamic Typewriter Subtitle */}
          <div className="min-h-[72px] sm:min-h-[56px] flex items-center justify-center mb-8">
            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl font-normal leading-relaxed">
              {displayText}
              <span className="inline-block w-0.5 h-5 bg-cyan-300 align-middle ml-1 animate-pulse" />
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-xl shadow-sky-500/35 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Get Started</span>
            </button>
            <button
              onClick={onOpenAppointmentModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-700" />
              <span>Create Appointment</span>
            </button>
          </div>
        </div>

        {/* Bottom Hero Metrics */}
        <div className="relative z-10 w-full border-t border-white/15 bg-black/15 backdrop-blur-xs py-6 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono tabular-nums">
                10,000+
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                Active Patients
              </div>
            </div>
            <div className="border-x border-white/20">
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono tabular-nums">
                500+
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                Healthcare Providers
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono tabular-nums">
                99.9%
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 3. KEY FEATURES                                             */}
      {/* ----------------------------------------------------------- */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Key Features
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Comprehensive tools and features designed to streamline hospital operations and improve patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Appointment Management
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Seamless booking and management of patient appointments with automated scheduling and reminders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Patient Records
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Secure digital health records and medical history management with easy access for healthcare providers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Instant notifications and status updates for appointments, treatments, and administrative tasks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Secure &amp; Private
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                HIPAA-compliant data protection and encryption ensuring patient privacy and data security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 4. HOW IT WORKS                                             */}
      {/* ----------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Getting quality healthcare has never been this simple and convenient. Follow these easy steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Create Account
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Sign up in seconds with your basic information. Choose whether you're a patient seeking care or a healthcare provider.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Find Your Doctor
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Browse our extensive network of qualified doctors. Filter by specialty, location, and availability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Book &amp; Confirm
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Select your preferred time slot and book instantly. Receive confirmation from your chosen healthcare provider.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Get Quality Care
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Attend your appointment and receive professional medical care. Access your records and follow-up instructions online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 5. TESTIMONIALS                                             */}
      {/* ----------------------------------------------------------- */}
      <section id="testimonials" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Real experiences from patients and healthcare providers using MediCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-amber-400 text-base mb-3 font-mono">★★★★★</div>
                <p className="text-slate-700 text-xs leading-relaxed italic mb-6">
                  "MediCare has revolutionized how I manage my appointments. The interface is intuitive and booking is incredibly easy. Highly recommended!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Sarah Johnson</div>
                  <div className="text-[11px] text-slate-500">Patient</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-amber-400 text-base mb-3 font-mono">★★★★★</div>
                <p className="text-slate-700 text-xs leading-relaxed italic mb-6">
                  "As a doctor, MediCare helps me stay organized and provide better care. The medical records system is comprehensive and secure."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Dr. Michael Chen</div>
                  <div className="text-[11px] text-slate-500">Cardiologist</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-amber-400 text-base mb-3 font-mono">★★★★★</div>
                <p className="text-slate-700 text-xs leading-relaxed italic mb-6">
                  "The admin dashboard gives us complete control over our hospital operations. It's powerful yet easy to use. Game changer!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">James Wilson</div>
                  <div className="text-[11px] text-slate-500">Hospital Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 6. LARGE STATS SECTION                                      */}
      {/* ----------------------------------------------------------- */}
      <section id="stats" className="py-16 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight">10,000+</div>
              <div className="text-xs sm:text-sm text-sky-100 font-medium mt-2">Active Patients</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight">500+</div>
              <div className="text-xs sm:text-sm text-sky-100 font-medium mt-2">Healthcare Providers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight">50,000+</div>
              <div className="text-xs sm:text-sm text-sky-100 font-medium mt-2">Appointments Booked</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight">99.9%</div>
              <div className="text-xs sm:text-sm text-sky-100 font-medium mt-2">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 7. WHY CHOOSE MEDICARE? (Benefits)                          */}
      {/* ----------------------------------------------------------- */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose MediCare?
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Comprehensive healthcare management designed for modern medical practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Lightning Fast</h3>
              <p className="text-slate-600 text-xs">Book appointments in seconds with our streamlined interface</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Bank-Level Security</h3>
              <p className="text-slate-600 text-xs">Your medical data is encrypted and HIPAA compliant</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Mobile Friendly</h3>
              <p className="text-slate-600 text-xs">Access your health records anywhere, anytime</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">24/7 Support</h3>
              <p className="text-slate-600 text-xs">Our team is always here to help you</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Cost Effective</h3>
              <p className="text-slate-600 text-xs">Reduce administrative costs by up to 40%</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Multi-Language</h3>
              <p className="text-slate-600 text-xs">Available in multiple languages worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 8. FAQ ACCORDION                                            */}
      {/* ----------------------------------------------------------- */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Everything you need to know about MediCare
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-sky-600" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 9. READY TO TRANSFORM CTA SECTION                           */}
      {/* ----------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of patients and healthcare providers who trust MediCare for their medical needs. Start your journey to better health today.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-sky-700 font-bold text-sm shadow-xl transition-all cursor-pointer"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 10. CONTACT US SECTION (With Direct Gmail Redirection)      */}
      {/* ----------------------------------------------------------- */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-semibold mb-3">
                <Mail className="w-3.5 h-3.5 text-red-600" />
                <span>Contact Us via Gmail</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Connect With MediCare &amp; Sajjan Kandel
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2">
                Click on Gmail to open directly in your Gmail app or Gmail web compose window.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Direct Contact & Social Links */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Contact &amp; Social Profiles</span>
                  <span className="text-[10px] text-red-600 font-semibold lowercase">click to open</span>
                </h3>

                {/* Gmail Card - Specifically enhanced for direct Gmail redirection */}
                <button
                  type="button"
                  onClick={handleRedirectToGmail}
                  className="w-full text-left flex items-center gap-3.5 p-4 rounded-2xl bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50/40 transition-all shadow-xs group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    {/* Authentic Gmail Logo Style Icon */}
                    <div className="relative">
                      <Mail className="w-6 h-6 stroke-[2.2]" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-red-500" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                        Gmail (Redirect to Compose)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                        Primary
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate block">
                      {TARGET_EMAIL}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Click to launch your Gmail &amp; send message
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/sajjan_kandelll/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Instagram
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate block">
                      @sajjan_kandelll
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors shrink-0" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/sajjankandel444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Facebook
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate block">
                      sajjankandel444
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://x.com/Sajjan_kandel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-100/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      X (Twitter)
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors truncate block">
                      @Sajjan_kandel
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                </a>
              </div>

              {/* Right Column: Inquiry Form that Redirects to Gmail */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Send an Inquiry
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-full">
                    <Mail className="w-3 h-3" />
                    <span>Redirects to Gmail</span>
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-4">
                  Fill in your details below and click send to compose directly in your Gmail.
                </p>

                {contactSubmitted ? (
                  <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Redirecting to Your Gmail!
                      </h4>
                      <p className="text-slate-600 text-xs mt-1">
                        Your message has been prepared for <strong className="text-slate-800">{TARGET_EMAIL}</strong>.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <a
                        href={getGmailAppUrl()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open in Gmail App (Mobile)</span>
                      </a>
                      <a
                        href={getGmailWebComposeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in Gmail Web Browser</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactName('');
                        setContactEmail('');
                        setContactMsg('');
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline block pt-2 mx-auto cursor-pointer"
                    >
                      ← Send another message
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={handleContactSubmit} 
                    className="space-y-3.5 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Your Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Message</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Your inquiry or collaboration note..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send via Gmail (Redirect to My Gmail)</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- */}
      {/* 11. GMAIL REDIRECT MODAL DIALOG                             */}
      {/* ----------------------------------------------------------- */}
      {isGmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Redirecting to Gmail</h3>
                  <p className="text-[11px] text-slate-500">{TARGET_EMAIL}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGmailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Choose how you would like to open Gmail on your device:
            </p>

            {/* Redirection Options */}
            <div className="space-y-2.5">
              {/* Option 1: Gmail App */}
              <a
                href={getGmailAppUrl()}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Open in Gmail App (Mobile)</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Option 2: Gmail Web Browser */}
              <a
                href={getGmailWebComposeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                  <span>Open in Gmail Web (Browser)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              {/* Option 3: Gmail Inbox Direct */}
              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-slate-500" />
                  <span>Go to My Gmail Inbox</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>

              {/* Option 4: Copy Email Address */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedEmail ? 'Email Copied to Clipboard!' : `Copy ${TARGET_EMAIL}`}</span>
                </div>
                <span className="text-[10px] text-slate-400">Copy</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsGmailModalOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 12. FOOTER                                                  */}
      {/* ----------------------------------------------------------- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Col 1: Logo & About */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <span className="font-extrabold text-white text-lg tracking-tight">MediCare</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Your trusted partner in healthcare, connecting patients with quality medical professionals worldwide.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://www.facebook.com/sajjankandel444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                  title="Facebook: sajjankandel444"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/Sajjan_kandel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
                  title="X (Twitter): @Sajjan_kandel"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/sajjan_kandelll/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors"
                  title="Instagram: @sajjan_kandelll"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                {/* Gmail direct redirect in footer */}
                <button
                  type="button"
                  onClick={handleRedirectToGmail}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Redirect to Gmail: sajjankandel799@gmail.com"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Product</h4>
              <p><button onClick={() => scrollTo('features')} className="hover:text-white transition-colors cursor-pointer">Features</button></p>
              <p><button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors cursor-pointer">How It Works</button></p>
              <p><button onClick={() => scrollTo('testimonials')} className="hover:text-white transition-colors cursor-pointer">Testimonials</button></p>
              <p><button onClick={() => scrollTo('faq')} className="hover:text-white transition-colors cursor-pointer">FAQ</button></p>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Company</h4>
              <p><button onClick={() => scrollTo('benefits')} className="hover:text-white transition-colors cursor-pointer">About Us</button></p>
              <p><button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">Contact</button></p>
              <p><button onClick={onGetStarted} className="text-sky-400 hover:underline cursor-pointer">Hospital Portal</button></p>
            </div>

            {/* Col 4: Legal */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Legal</h4>
              <p><span className="text-slate-400">Privacy Policy</span></p>
              <p><span className="text-slate-400">Terms of Service</span></p>
              <p><span className="text-slate-400">HIPAA Compliance</span></p>
              <p><span className="text-slate-400">Security</span></p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2026 MediCare. All rights reserved.</p>
            <p className="font-medium text-slate-400">
              Made by Sajjan Kandel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
