import { useState } from 'react';
import type { Customer } from '../data/mockData';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  customer: Customer | null;
}

export default function Header({ currentPage, onNavigate, customer }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const licenseStatus = customer?.drivingLicense?.status ?? (customer ? 'not_uploaded' : null);

  const licenseBadge = customer && {
    approved: { label: 'License Verified', color: 'bg-green-500/15 border-green-500/30 text-green-300', dot: 'bg-green-400' },
    pending: { label: 'License Pending', color: 'bg-amber-500/15 border-amber-400/30 text-amber-300', dot: 'bg-amber-400 animate-pulse' },
    rejected: { label: 'License Rejected', color: 'bg-red-500/15 border-red-400/30 text-red-300', dot: 'bg-red-400' },
    not_uploaded: { label: 'Upload License', color: 'bg-white/10 border-white/20 text-white/60', dot: 'bg-white/30' },
  }[licenseStatus!];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search Cars' },
    ...(customer ? [{ id: 'my-bookings', label: 'My Bookings' }] : []),
  ];

  return (
    <header className="bg-[#0d1b3e] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#e8920a] rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-base leading-tight tracking-wide">DriveNow</div>
              <div className="text-[10px] text-[#e8920a] font-medium tracking-wider uppercase leading-tight">Ho Chi Minh City</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a href="#/admin" className="text-xs font-medium text-white/60 hover:text-[#e8920a] transition-colors">
              Admin
            </a>
            {/* License badge — desktop */}
            {customer && licenseBadge && (
              <button
                onClick={() => onNavigate('driving-license')}
                className={`hidden sm:flex items-center gap-1.5 border rounded-full px-3 py-1 transition-all hover:opacity-80 ${licenseBadge.color}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${licenseBadge.dot}`}/>
                <span className="text-xs font-medium">{licenseBadge.label}</span>
              </button>
            )}

            {customer ? (
              /* Avatar dropdown */
              <div className="relative">
                <button
                  onClick={() => setAvatarOpen(v => !v)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#e8920a] bg-[#162550]"
                  />
                  <span className="hidden lg:block text-sm font-medium text-white/90">
                    {customer.name.split(' ').slice(-1)[0]}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className={`hidden lg:block transition-transform ${avatarOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {avatarOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)}/>
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#d6dae8] py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-[#d6dae8]">
                        <div className="text-sm font-semibold text-[#0d1b3e] truncate">{customer.name}</div>
                        <div className="text-xs text-[#6b7694] truncate">{customer.email}</div>
                      </div>
                      {[
                        { label: 'My Profile', icon: '👤', page: 'profile' },
                        { label: 'My Bookings', icon: '🔖', page: 'my-bookings' },
                        { label: 'Driving License', icon: '🪪', page: 'driving-license' },
                      ].map(item => (
                        <button
                          key={item.page}
                          onClick={() => { onNavigate(item.page); setAvatarOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0d1b3e] hover:bg-[#f4f6f9] transition-all text-left"
                        >
                          <span>{item.icon}</span>{item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Login/Register buttons */
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="text-sm font-semibold bg-[#e8920a] hover:bg-[#c4780a] text-white px-4 py-1.5 rounded-lg transition-all"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-white/70 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12"/>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentPage === item.id ? 'bg-white/10 text-white' : 'text-white/70'
                }`}
              >
                {item.label}
              </button>
            ))}
            {customer ? (
              <>
                <button onClick={() => { onNavigate('profile'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70">Profile</button>
                <button onClick={() => { onNavigate('driving-license'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70">Driving License</button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('login'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70">Sign In</button>
                <button onClick={() => { onNavigate('register'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70 font-semibold">Register</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
