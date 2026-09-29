import type { Customer } from '../data/mockData';

interface LicenseGateProps {
  customer: Customer | null;
  onNavigate: (page: string, data?: unknown) => void;
  children: React.ReactNode;
}

/**
 * Wraps any booking-initiation point.
 * If auth or license requirements aren't met, renders a blocking banner instead of children.
 */
export default function LicenseGate({ customer, onNavigate, children }: LicenseGateProps) {
  if (!customer) {
    return (
      <GateBanner
        icon="🔒"
        color="amber"
        title="Sign in to Book"
        message="You need to be signed in to book a vehicle. Create a free account or sign in."
        actions={[
          { label: 'Sign In', primary: true, onClick: () => onNavigate('login', { redirectMessage: 'Please sign in to continue with your booking.' }) },
          { label: 'Create Account', primary: false, onClick: () => onNavigate('register') },
        ]}
      />
    );
  }

  const status = customer.drivingLicense?.status ?? 'not_uploaded';

  if (status === 'not_uploaded') {
    return (
      <GateBanner
        icon="📄"
        color="blue"
        title="Driving License Required"
        message="You must upload and verify your driving license before making a booking. This is a one-time step that typically takes less than 24 hours."
        actions={[
          { label: 'Upload License Now', primary: true, onClick: () => onNavigate('driving-license') },
        ]}
      />
    );
  }

  if (status === 'pending') {
    return (
      <GateBanner
        icon="🕐"
        color="amber"
        title="License Under Review"
        message="Your driving license is currently being reviewed by our team. Bookings are enabled once your license is approved — usually within 24 hours."
        actions={[
          { label: 'Check Status', primary: true, onClick: () => onNavigate('driving-license') },
        ]}
      />
    );
  }

  if (status === 'rejected') {
    return (
      <GateBanner
        icon="❌"
        color="red"
        title="License Rejected — Resubmission Required"
        message="Your driving license was rejected. You must resubmit with corrected documents before you can book a vehicle."
        actions={[
          { label: 'Resubmit License', primary: true, onClick: () => onNavigate('driving-license') },
        ]}
      />
    );
  }

  // approved — render children normally
  return <>{children}</>;
}

interface GateBannerProps {
  icon: string;
  color: 'amber' | 'blue' | 'red';
  title: string;
  message: string;
  actions: { label: string; primary: boolean; onClick: () => void }[];
}

function GateBanner({ icon, color, title, message, actions }: GateBannerProps) {
  const palette = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100', iconStroke: '#d97706', title: 'text-amber-900', text: 'text-amber-800', primaryBtn: 'bg-[#e8920a] hover:bg-[#c4780a] text-white', secondaryBtn: 'border border-amber-300 text-amber-800 hover:bg-amber-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', iconStroke: '#2563eb', title: 'text-blue-900', text: 'text-blue-800', primaryBtn: 'bg-[#0d1b3e] hover:bg-[#162550] text-white', secondaryBtn: 'border border-blue-300 text-blue-800 hover:bg-blue-100' },
    red: { bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-100', iconStroke: '#dc2626', title: 'text-red-900', text: 'text-red-800', primaryBtn: 'bg-red-600 hover:bg-red-700 text-white', secondaryBtn: 'border border-red-300 text-red-800 hover:bg-red-100' },
  }[color];

  return (
    <div className={`rounded-2xl border p-5 ${palette.bg} ${palette.border}`}>
      <div className="flex gap-4 items-start">
        <div className={`w-12 h-12 rounded-xl ${palette.iconBg} flex items-center justify-center flex-shrink-0 text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-base mb-1 ${palette.title}`}>{title}</h3>
          <p className={`text-sm leading-relaxed mb-4 ${palette.text}`}>{message}</p>
          <div className="flex flex-wrap gap-2">
            {actions.map(a => (
              <button
                key={a.label}
                onClick={a.onClick}
                className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${a.primary ? palette.primaryBtn : palette.secondaryBtn}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
