import { useState } from 'react';
import type { VehicleType, Customer } from '../data/mockData';
import { formatVND } from '../data/mockData';
import LicenseGate from '../components/LicenseGate';

interface VehicleDetailPageProps {
  vehicle: VehicleType;
  preselectedDate?: string;
  preselectedStart?: string;
  preselectedEnd?: string;
  customer: Customer | null;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function VehicleDetailPage({
  vehicle,
  customer,
  preselectedDate,
  preselectedStart,
  preselectedEnd,
  onNavigate,
}: VehicleDetailPageProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(preselectedDate || today);
  const [startTime, setStartTime] = useState(preselectedStart || '09:00');
  const [endTime, setEndTime] = useState(preselectedEnd || '18:00');

  const durationHours = (() => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? diff / 60 : 0;
  })();

  const estimatedTotal = vehicle.pricePerHour * durationHours;

  const mockReviews = [
    { name: 'Trần Thị Bích', rating: 5, date: '2 weeks ago', comment: 'Excellent condition, very clean. Pickup was smooth and the staff were helpful. Would rent again!' },
    { name: 'Lê Minh Tuấn', rating: 4, date: '1 month ago', comment: 'Good car for city driving. Fuel consumption as advertised. Minor scratches on the bumper but noted in the inspection form.' },
    { name: 'Phạm Quỳnh Anh', rating: 5, date: '1 month ago', comment: 'Perfect for a day trip around Ho Chi Minh City. AC works great, car was spotless.' },
  ];

  const fuelIcon = vehicle.fuelType === 'electric' ? '⚡' : vehicle.fuelType === 'diesel' ? '🛢️' : '⛽';

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#d6dae8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-[#6b7694]">
            <button onClick={() => onNavigate('home')} className="hover:text-[#0d1b3e]">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('search')} className="hover:text-[#0d1b3e]">Search</button>
            <span>/</span>
            <span className="text-[#0d1b3e] font-medium">{vehicle.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#d6dae8]">
              <div className="relative h-64 sm:h-80 bg-[#eaecf2]">
                <img
                  src={vehicle.images[activeImage]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {vehicle.fuelType === 'electric' && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⚡ Electric Vehicle
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-3">
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImage === i ? 'border-[#e8920a]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info Tabs */}
            <div className="bg-white rounded-2xl border border-[#d6dae8]">
              <div className="flex border-b border-[#d6dae8]">
                {(['overview', 'specs', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'text-[#e8920a] border-b-2 border-[#e8920a]'
                        : 'text-[#6b7694] hover:text-[#0d1b3e]'
                    }`}
                  >
                    {tab} {tab === 'reviews' && `(${vehicle.reviewCount})`}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-[#6b7694] leading-relaxed mb-5">{vehicle.description}</p>
                    <h4 className="font-semibold text-[#0d1b3e] mb-3">Included Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vehicle.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-[#6b7694]">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Engine', value: vehicle.specs.engine, icon: '🔧' },
                      { label: 'Fuel / Consumption', value: `${fuelIcon} ${vehicle.specs.fuelConsumption}`, icon: '' },
                      { label: 'Max Speed', value: vehicle.specs.maxSpeed, icon: '🏎️' },
                      { label: 'Trunk Volume', value: vehicle.specs.trunkVolume, icon: '📦' },
                      { label: 'Seats', value: `${vehicle.seats} passengers`, icon: '💺' },
                      { label: 'Transmission', value: vehicle.transmission, icon: '⚙️' },
                    ].map(spec => (
                      <div key={spec.label} className="bg-[#f4f6f9] rounded-xl p-3">
                        <div className="text-xs text-[#6b7694] mb-1">{spec.label}</div>
                        <div className="text-sm font-semibold text-[#0d1b3e] capitalize">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-[#d6dae8]">
                      <div className="text-4xl font-bold text-[#0d1b3e]">{vehicle.rating}</div>
                      <div>
                        <div className="flex gap-0.5 mb-1">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.floor(vehicle.rating) ? '#f59e0b' : '#e2e6ef'}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm text-[#6b7694]">Based on {vehicle.reviewCount} reviews</div>
                      </div>
                    </div>
                    {mockReviews.map((r, i) => (
                      <div key={i} className="pb-4 border-b border-[#d6dae8] last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-[#0d1b3e] text-sm">{r.name}</div>
                          <div className="text-xs text-[#6b7694]">{r.date}</div>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= r.rating ? '#f59e0b' : '#e2e6ef'}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-[#6b7694]">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5 sticky top-20">
              <div className="mb-4">
                <h1 className="font-display text-2xl text-[#0d1b3e]">{vehicle.name}</h1>
                <div className="flex items-center gap-2 text-sm text-[#6b7694] mt-1">
                  <span className="capitalize bg-[#f4f6f9] px-2 py-0.5 rounded">{vehicle.category}</span>
                  <span>·</span>
                  <span>{vehicle.seats} seats</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {vehicle.rating}
                  </span>
                </div>
              </div>

              <div className="bg-[#f4f6f9] rounded-xl p-3 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#e8920a]">{formatVND(vehicle.pricePerHour)}</div>
                  <div className="text-xs text-[#6b7694]">per hour</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#6b7694]">Security deposit</div>
                  <div className="text-sm font-semibold text-[#0d1b3e]">{formatVND(vehicle.depositAmount)}</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-[#6b7694] block mb-1">Pickup Date</label>
                  <input
                    type="date" min={today} value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-[#d6dae8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8920a] focus:ring-1 focus:ring-[#e8920a]/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-[#6b7694] block mb-1">Start</label>
                    <input
                      type="time" value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full border border-[#d6dae8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8920a]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6b7694] block mb-1">End</label>
                    <input
                      type="time" value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full border border-[#d6dae8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8920a]"
                    />
                  </div>
                </div>
              </div>

              {durationHours > 0 && (
                <div className="bg-[#0d1b3e]/5 rounded-xl p-3 mb-4 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7694]">Duration</span>
                    <span className="font-medium text-[#0d1b3e]">{durationHours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7694]">Rental cost</span>
                    <span className="font-medium text-[#0d1b3e]">{formatVND(estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[#d6dae8] pt-1.5">
                    <span className="text-[#6b7694]">Deposit (refundable)</span>
                    <span className="font-medium text-[#0d1b3e]">{formatVND(vehicle.depositAmount)}</span>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800">
                <strong>Note:</strong> Preferred license plate is optional and not guaranteed. Another vehicle of the same type may be assigned at pickup.
              </div>

              <LicenseGate customer={customer} onNavigate={onNavigate}>
                <button
                  onClick={() => onNavigate('booking-flow', {
                    vehicle,
                    date,
                    startTime,
                    endTime,
                  })}
                  disabled={durationHours <= 0}
                  className="w-full bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-[#e8920a]/20"
                >
                  Continue to Booking
                </button>
              </LicenseGate>

              <div className="mt-4 space-y-2">
                {[
                  'Free cancellation up to 2h before pickup',
                  'Deposit fully refunded on return',
                  'Insurance included',
                ].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-[#6b7694]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
