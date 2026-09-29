import { useState } from 'react';
import { vehicleTypes, formatVND } from '../data/mockData';

interface HomePageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchDate, setSearchDate] = useState('');
  const [searchStart, setSearchStart] = useState('');
  const [searchEnd, setSearchEnd] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    onNavigate('search', { date: searchDate, startTime: searchStart, endTime: searchEnd });
  };

  const stats = [
    { label: 'Vehicles Available', value: '40+', icon: '🚗' },
    { label: 'Happy Customers', value: '12,000+', icon: '😊' },
    { label: 'Districts Covered', value: 'All HCM', icon: '📍' },
    { label: 'Avg. Rating', value: '4.8 ★', icon: '⭐' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Search & Select',
      desc: 'Choose your vehicle type, select rental hours, and optionally pick a preferred license plate.',
    },
    {
      step: '02',
      title: 'Upload License & Pay Deposit',
      desc: 'Submit your driving license for verification and pay the refundable security deposit.',
    },
    {
      step: '03',
      title: 'Pick Up at Warehouse',
      desc: 'Come to our warehouse in Bình Thạnh District at your scheduled time to collect the vehicle.',
    },
    {
      step: '04',
      title: 'Drive & Return',
      desc: 'Enjoy your rental. Return the vehicle on time to avoid late fees. Final payment on return.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#0d1b3e] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=700&fit=crop&auto=format')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b3e] via-[#0d1b3e]/90 to-[#0d1b3e]/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#e8920a]/15 border border-[#e8920a]/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#e8920a] animate-pulse"></div>
              <span className="text-[#fbb03b] text-sm font-medium">Ho Chi Minh City — All Districts</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
              Drive the City
              <span className="block text-[#e8920a]">On Your Schedule</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Rent by the hour, pick up at our warehouse, return when you're done.
              No fixed schedules. No waiting. Just drive.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-3xl">
            <div className="text-sm font-semibold text-[#0d1b3e] mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8920a" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Check Vehicle Availability
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#6b7694] font-medium block mb-1.5">Pickup Date</label>
                <input
                  type="date"
                  min={today}
                  value={searchDate}
                  onChange={e => setSearchDate(e.target.value)}
                  className="w-full border border-[#d6dae8] rounded-lg px-3 py-2.5 text-sm text-[#0d1b3e] focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/20"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7694] font-medium block mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={searchStart}
                  onChange={e => setSearchStart(e.target.value)}
                  className="w-full border border-[#d6dae8] rounded-lg px-3 py-2.5 text-sm text-[#0d1b3e] focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/20"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7694] font-medium block mb-1.5">End Time</label>
                <input
                  type="time"
                  value={searchEnd}
                  onChange={e => setSearchEnd(e.target.value)}
                  className="w-full border border-[#d6dae8] rounded-lg px-3 py-2.5 text-sm text-[#0d1b3e] focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/20"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="mt-4 w-full bg-[#e8920a] hover:bg-[#c4780a] text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.99] shadow-md shadow-[#e8920a]/30"
            >
              Search Available Vehicles
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-[#e8920a] font-bold text-xl">{s.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Vehicle Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[#e8920a] text-sm font-semibold tracking-wider uppercase mb-2">Our Fleet</div>
            <h2 className="font-display text-3xl text-[#0d1b3e]">Popular Vehicle Types</h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#e8920a] font-medium hover:gap-2.5 transition-all"
          >
            View all <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicleTypes.slice(0, 6).map(v => (
            <button
              key={v.id}
              onClick={() => onNavigate('vehicle-detail', v)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#d6dae8] hover:border-[#e8920a]/50 hover:shadow-lg hover:shadow-[#0d1b3e]/8 transition-all text-left"
            >
              <div className="relative overflow-hidden h-44 bg-[#eaecf2]">
                <img
                  src={v.images[0]}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur text-[#0d1b3e] text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{v.category}</span>
                  {v.fuelType === 'electric' && (
                    <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">EV</span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    v.available > 2 ? 'bg-green-500/90 text-white' :
                    v.available > 0 ? 'bg-amber-500/90 text-white' :
                    'bg-red-500/90 text-white'
                  }`}>
                    {v.available > 0 ? `${v.available} available` : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-semibold text-[#0d1b3e] text-base">{v.name}</div>
                    <div className="text-sm text-[#6b7694]">{v.seats} seats · {v.transmission}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#e8920a] text-base">{formatVND(v.pricePerHour)}</div>
                    <div className="text-xs text-[#6b7694]">per hour</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-sm font-medium text-[#0d1b3e]">{v.rating}</span>
                  <span className="text-xs text-[#6b7694]">({v.reviewCount} reviews)</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-[#0d1b3e] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="text-[#e8920a] text-sm font-semibold tracking-wider uppercase mb-2">Simple Process</div>
            <h2 className="font-display text-3xl text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-white/10 z-0" style={{ width: 'calc(100% - 3rem)', left: '3rem' }} />
                )}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#e8920a]/15 border border-[#e8920a]/30 flex items-center justify-center mb-4">
                    <span className="font-mono-data text-[#e8920a] font-bold text-sm">{item.step}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-[#e8920a] text-sm font-semibold tracking-wider uppercase mb-2">Our Location</div>
            <h2 className="font-display text-3xl text-[#0d1b3e] mb-4">Pick Up & Return Warehouse</h2>
            <p className="text-[#6b7694] leading-relaxed mb-6">
              All vehicles are picked up and returned at our central warehouse in Bình Thạnh District — conveniently located near the heart of Ho Chi Minh City with easy access from all major routes.
            </p>
            <div className="space-y-3">
              {[
                { icon: '📍', label: 'Address', value: '123 Đường Đinh Bộ Lĩnh, Phường 26, Bình Thạnh, TP.HCM' },
                { icon: '🕐', label: 'Hours', value: 'Daily 06:00 – 22:00' },
                { icon: '📞', label: 'Hotline', value: '1800 6868 (Free)' },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="text-xs text-[#6b7694] font-medium">{item.label}</div>
                    <div className="text-[#0d1b3e] text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl h-64 lg:h-80 bg-[#eaecf2]">
            <img
              src="https://images.unsplash.com/photo-1486308510493-aa64833637bc?w=700&h=400&fit=crop&auto=format"
              alt="DriveNow warehouse location"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#e8920a] to-[#c4780a] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Ready to Hit the Road?</h2>
          <p className="text-white/80 mb-8">Choose your vehicle, set your hours, and be on your way. No long-term commitments required.</p>
          <button
            onClick={() => onNavigate('search')}
            className="bg-white text-[#e8920a] font-bold px-8 py-3.5 rounded-xl hover:bg-[#0d1b3e] hover:text-white transition-all shadow-lg"
          >
            Book Your Ride Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070f22] text-white/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm">
          <p>© 2025 DriveNow Ho Chi Minh City. All rights reserved.</p>
          <p className="mt-1 text-xs">Warehouse: 123 Đường Đinh Bộ Lĩnh, Phường 26, Bình Thạnh, TP.HCM</p>
        </div>
      </footer>
    </div>
  );
}
