import type { VehicleType, LicensePlate } from '../data/mockData';
import { formatVND } from '../data/mockData';

interface BookingSuccessPageProps {
  bookingId: string;
  vehicle: VehicleType;
  date: string;
  startTime: string;
  endTime: string;
  preferredPlate: LicensePlate | null;
  durationHours: number;
  finalTotal: number;
  depositAmount: number;
  promoCode?: string;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function BookingSuccessPage({
  bookingId, vehicle, date, startTime, endTime,
  preferredPlate, durationHours, finalTotal, depositAmount,
  promoCode, onNavigate,
}: BookingSuccessPageProps) {
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center px-4 py-10">
      {/* Success card */}
      <div className="bg-white rounded-3xl border border-[#d6dae8] shadow-xl w-full max-w-lg overflow-hidden">
        {/* Green header */}
        <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl text-white mb-1">Booking Confirmed!</h1>
          <p className="text-green-100 text-sm">Your deposit has been received</p>
        </div>

        {/* Booking ID */}
        <div className="bg-[#0d1b3e] px-6 py-3 flex items-center justify-between">
          <span className="text-white/60 text-xs font-medium">BOOKING REFERENCE</span>
          <span className="font-mono-data font-bold text-[#e8920a] text-lg tracking-widest">{bookingId}</span>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex gap-4 mb-5 pb-5 border-b border-[#d6dae8]">
            <img src={vehicle.images[0]} alt={vehicle.name} className="w-20 h-14 rounded-xl object-cover bg-[#eaecf2] flex-shrink-0" />
            <div>
              <div className="font-semibold text-[#0d1b3e]">{vehicle.name}</div>
              <div className="text-sm text-[#6b7694]">{vehicle.seats} seats · {vehicle.transmission}</div>
              {preferredPlate && (
                <div className="text-xs text-[#6b7694] mt-1">
                  Preferred plate: <span className="font-mono-data font-bold text-[#0d1b3e]">{preferredPlate.plate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Pickup Date', value: date },
              { label: 'Duration', value: `${durationHours.toFixed(1)} hours` },
              { label: 'Start Time', value: startTime },
              { label: 'Return Time', value: endTime },
            ].map(item => (
              <div key={item.label} className="bg-[#f4f6f9] rounded-xl p-3">
                <div className="text-xs text-[#6b7694] mb-0.5">{item.label}</div>
                <div className="text-sm font-semibold text-[#0d1b3e]">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Payment summary */}
          <div className="bg-[#0d1b3e]/5 rounded-xl p-4 mb-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7694]">Deposit paid</span>
              <span className="font-semibold text-green-700">✓ {formatVND(depositAmount)}</span>
            </div>
            {promoCode && (
              <div className="flex justify-between text-green-700 text-xs">
                <span>Promo applied ({promoCode})</span>
                <span>✓</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#d6dae8] pt-2">
              <span className="text-[#6b7694]">Remaining on return</span>
              <span className="font-bold text-[#0d1b3e]">{formatVND(finalTotal)}</span>
            </div>
          </div>

          {/* Pickup instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-amber-800 space-y-1.5">
            <div className="font-bold text-sm text-amber-900 mb-2">📋 Pickup Instructions</div>
            <div>📍 <strong>Location:</strong> 123 Đường Đinh Bộ Lĩnh, Phường 26, Bình Thạnh, TP.HCM</div>
            <div>🕐 <strong>Arrive by:</strong> {startTime} on {date}</div>
            <div>🪪 <strong>Bring:</strong> Government-issued ID + Driving License</div>
            <div>📞 <strong>Questions?</strong> Call 1800 6868</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('my-bookings')}
              className="flex-1 bg-[#0d1b3e] hover:bg-[#162550] text-white font-semibold py-3 rounded-xl text-sm transition-all"
            >
              View My Bookings
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 border border-[#d6dae8] hover:border-[#0d1b3e] text-[#0d1b3e] font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
