import type { Customer } from '../data/mockData';
import { myBookings, vehicleTypes, formatVND } from '../data/mockData';

interface ProfilePageProps {
  customer: Customer;
  onNavigate: (page: string, data?: unknown) => void;
  onLogout: () => void;
}

const licenseStatusConfig = {
  not_uploaded: {
    label: 'Not Uploaded',
    sublabel: 'Upload your license to start booking',
    icon: '📄',
    bg: 'bg-[#f4f6f9]',
    border: 'border-[#d6dae8]',
    text: 'text-[#6b7694]',
    badge: 'bg-[#eaecf2] text-[#6b7694]',
    action: 'Upload License',
    actionStyle: 'bg-[#0d1b3e] text-white hover:bg-[#162550]',
  },
  pending: {
    label: 'Under Review',
    sublabel: 'Your license is being reviewed — usually within 24 hours',
    icon: '🕐',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700',
    action: 'View Status',
    actionStyle: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  approved: {
    label: 'Verified',
    sublabel: 'You can now book any vehicle',
    icon: '✅',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-700',
    action: 'View License',
    actionStyle: 'bg-green-600 text-white hover:bg-green-700',
  },
  rejected: {
    label: 'Rejected — Action Required',
    sublabel: 'Your submission was rejected. Please resubmit with correct documents.',
    icon: '❌',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-700',
    action: 'Resubmit License',
    actionStyle: 'bg-red-600 text-white hover:bg-red-700',
  },
} as const;

export default function ProfilePage({ customer, onNavigate, onLogout }: ProfilePageProps) {
  const status = customer.drivingLicense?.status ?? 'not_uploaded';
  const cfg = licenseStatusConfig[status];

  const customerBookings = myBookings.filter(b => b.customerId === 'cust-001'); // mock
  const completedCount = customerBookings.filter(b => b.status === 'completed').length;
  const totalSpent = customerBookings
    .filter(b => b.finalPaid)
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const menuItems = [
    { icon: '🔖', label: 'My Bookings', sublabel: `${customerBookings.length} total bookings`, action: () => onNavigate('my-bookings') },
    { icon: '🪪', label: 'Driving License', sublabel: cfg.label, action: () => onNavigate('driving-license') },
    { icon: '🔔', label: 'Notifications', sublabel: '3 unread notifications', action: () => {} },
    { icon: '🔒', label: 'Change Password', sublabel: 'Update your login credentials', action: () => {} },
    { icon: '💬', label: 'Support', sublabel: 'Get help from our team', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Profile hero */}
      <div className="bg-[#0d1b3e] pt-8 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#e8920a] bg-[#162550]"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0d1b3e] ${
              status === 'approved' ? 'bg-green-400' :
              status === 'pending' ? 'bg-amber-400' :
              status === 'rejected' ? 'bg-red-400' : 'bg-[#6b7694]'
            }`}/>
          </div>
          <h1 className="font-display text-2xl text-white">{customer.name}</h1>
          <p className="text-white/50 text-sm mt-1">{customer.email} · {customer.phone}</p>
          <p className="text-white/30 text-xs mt-1">Member since {new Date(customer.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-10 pb-10 space-y-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl border border-[#d6dae8] shadow-sm p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0d1b3e]">{customerBookings.length}</div>
            <div className="text-xs text-[#6b7694] mt-0.5">Total Trips</div>
          </div>
          <div className="text-center border-x border-[#d6dae8]">
            <div className="text-2xl font-bold text-[#0d1b3e]">{completedCount}</div>
            <div className="text-xs text-[#6b7694] mt-0.5">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#e8920a]">{totalSpent > 0 ? formatVND(totalSpent) : '—'}</div>
            <div className="text-xs text-[#6b7694] mt-0.5">Total Spent</div>
          </div>
        </div>

        {/* License status card */}
        <div className={`rounded-2xl border p-5 ${cfg.bg} ${cfg.border}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#0d1b3e] text-sm">Driving License</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                </div>
                <p className={`text-xs leading-relaxed ${cfg.text}`}>{cfg.sublabel}</p>
                {customer.drivingLicense?.status === 'approved' && (
                  <div className="mt-1.5 text-xs text-green-700 space-y-0.5">
                    <div>License No: <span className="font-mono-data font-bold">{customer.drivingLicense.licenseNumber}</span></div>
                    <div>Class {customer.drivingLicense.licenseClass} · Expires {customer.drivingLicense.expiryDate}</div>
                  </div>
                )}
                {customer.drivingLicense?.status === 'rejected' && customer.drivingLicense.rejectionReason && (
                  <div className="mt-2 text-xs text-red-700 bg-red-100 rounded-lg p-2">
                    <strong>Reason:</strong> {customer.drivingLicense.rejectionReason}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onNavigate('driving-license')}
              className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${cfg.actionStyle}`}
            >
              {cfg.action}
            </button>
          </div>
        </div>

        {/* Recent bookings preview */}
        {customerBookings.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#d6dae8] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#0d1b3e] text-sm">Recent Bookings</h3>
              <button onClick={() => onNavigate('my-bookings')} className="text-xs text-[#e8920a] font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {customerBookings.slice(0, 2).map(b => {
                const vt = vehicleTypes.find(v => v.id === b.vehicleTypeId);
                const statusColors: Record<string, string> = {
                  completed: 'text-[#6b7694] bg-[#f4f6f9]',
                  confirmed: 'text-blue-700 bg-blue-50',
                  pending_payment: 'text-amber-700 bg-amber-50',
                  active: 'text-green-700 bg-green-50',
                  cancelled: 'text-red-600 bg-red-50',
                };
                return (
                  <button
                    key={b.id}
                    onClick={() => onNavigate('booking-detail', b)}
                    className="w-full flex items-center gap-3 text-left hover:bg-[#f4f6f9] rounded-xl p-2 transition-all"
                  >
                    {vt && <img src={vt.images[0]} alt={vt.name} className="w-12 h-9 rounded-lg object-cover flex-shrink-0 bg-[#eaecf2]" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#0d1b3e] truncate">{vt?.name}</div>
                      <div className="text-xs text-[#6b7694]">{new Date(b.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[b.status]}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-[#d6dae8] overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#f4f6f9] transition-all border-b border-[#d6dae8] last:border-0 text-left"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#0d1b3e]">{item.label}</div>
                <div className="text-xs text-[#6b7694]">{item.sublabel}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7694" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={onLogout}
          className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
