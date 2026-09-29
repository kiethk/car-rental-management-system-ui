import { useState } from 'react';
import type { VehicleType, LicensePlate } from '../data/mockData';
import { formatVND, promotionCodes } from '../data/mockData';

interface CheckoutPageProps {
  vehicle: VehicleType;
  date: string;
  startTime: string;
  endTime: string;
  preferredPlate: LicensePlate | null;
  durationHours: number;
  estimatedTotal: number;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function CheckoutPage({
  vehicle, date, startTime, endTime,
  preferredPlate, durationHours, estimatedTotal, onNavigate,
}: CheckoutPageProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ discount: number; type: 'percent' | 'fixed'; description: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [notes, setNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const discountAmount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? Math.round(estimatedTotal * appliedPromo.discount / 100)
      : appliedPromo.discount
    : 0;

  const finalTotal = estimatedTotal - discountAmount;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (promotionCodes[code]) {
      setAppliedPromo(promotionCodes[code]);
    } else {
      setPromoError('Invalid or expired promotion code.');
    }
  };

  const handleProceedToPayment = () => {
    onNavigate('payment', {
      vehicle, date, startTime, endTime,
      preferredPlate, durationHours,
      estimatedTotal, discountAmount, finalTotal,
      promoCode: appliedPromo ? promoCode.toUpperCase() : undefined,
      notes,
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <div className="bg-white border-b border-[#d6dae8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => onNavigate('booking-flow', { vehicle, date, startTime, endTime })}
            className="flex items-center gap-2 text-sm text-[#6b7694] hover:text-[#0d1b3e] mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
          <h1 className="font-display text-2xl text-[#0d1b3e]">Review & Checkout</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left */}
          <div className="lg:col-span-3 space-y-5">
            {/* Booking details card */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-4">Rental Details</h3>
              <div className="flex gap-4 mb-4">
                <img src={vehicle.images[0]} alt={vehicle.name} className="w-24 h-16 rounded-xl object-cover bg-[#eaecf2] flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#0d1b3e]">{vehicle.name}</div>
                  <div className="text-sm text-[#6b7694] capitalize">{vehicle.category} · {vehicle.seats} seats · {vehicle.transmission}</div>
                  <div className="text-sm text-[#6b7694]">⛽ {vehicle.specs.fuelConsumption}</div>
                </div>
              </div>

              <div className="bg-[#f4f6f9] rounded-xl p-4 grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <div className="text-xs text-[#6b7694]">Pickup Date</div>
                  <div className="font-medium text-[#0d1b3e]">{date}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7694]">Duration</div>
                  <div className="font-medium text-[#0d1b3e]">{durationHours.toFixed(1)} hours</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7694]">Start Time</div>
                  <div className="font-medium text-[#0d1b3e]">{startTime}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7694]">End Time</div>
                  <div className="font-medium text-[#0d1b3e]">{endTime}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7694]">Preferred Plate</div>
                  <div className="font-mono-data font-bold text-[#0d1b3e]">
                    {preferredPlate ? preferredPlate.plate : 'Auto-assigned'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6b7694]">Pickup Location</div>
                  <div className="font-medium text-[#0d1b3e]">Bình Thạnh Warehouse</div>
                </div>
              </div>
            </div>

            {/* Driving license check */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-3">Driving License</h3>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-800">License Verified ✓</div>
                  <div className="text-xs text-green-700">B2-0123456789 · Expires 15/03/2028</div>
                </div>
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-3">Promotion Code</h3>
              {appliedPromo ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-green-800">{promoCode.toUpperCase()} applied!</div>
                    <div className="text-xs text-green-700">{appliedPromo.description} — saved {formatVND(discountAmount)}</div>
                  </div>
                  <button onClick={() => { setAppliedPromo(null); setPromoCode(''); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g. FIRST10)"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                    className="flex-1 border border-[#d6dae8] rounded-xl px-4 py-2.5 text-sm uppercase tracking-wider focus:outline-none focus:border-[#e8920a]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-[#0d1b3e] hover:bg-[#162550] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
              <p className="text-xs text-[#6b7694] mt-2">Try: FIRST10, WELCOME50, HCMC20, NEWUSER</p>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-3">Special Notes <span className="text-[#6b7694] font-normal text-sm">(optional)</span></h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requests or notes for the warehouse staff..."
                rows={3}
                className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#e8920a] text-[#0d1b3e] placeholder:text-[#6b7694]/60"
              />
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <label className="flex gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#e8920a]"
                />
                <span className="text-sm text-[#6b7694] leading-relaxed">
                  I agree to the <span className="text-[#0d1b3e] font-medium underline cursor-pointer">rental terms and conditions</span>, late return policy, and understand that preferred license plate is not guaranteed.
                </span>
              </label>
            </div>
          </div>

          {/* Right: Price breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5 sticky top-20">
              <h3 className="font-semibold text-[#0d1b3e] mb-4">Price Breakdown</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7694]">{formatVND(vehicle.pricePerHour)} × {durationHours.toFixed(1)}h</span>
                  <span className="text-[#0d1b3e] font-medium">{formatVND(estimatedTotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Promo ({promoCode.toUpperCase()})</span>
                    <span>− {formatVND(discountAmount)}</span>
                  </div>
                )}

                <div className="border-t border-[#d6dae8] pt-3 flex justify-between">
                  <span className="font-semibold text-[#0d1b3e]">Rental Total</span>
                  <span className="font-bold text-[#0d1b3e]">{formatVND(finalTotal)}</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="text-xs font-semibold text-amber-800 mb-1">Deposit Required Now</div>
                  <div className="text-2xl font-bold text-[#0d1b3e]">{formatVND(vehicle.depositAmount)}</div>
                  <div className="text-xs text-amber-700 mt-1">Fully refunded when you return the vehicle</div>
                </div>

                <div className="bg-[#f4f6f9] rounded-xl p-3 space-y-2 text-xs text-[#6b7694]">
                  <div className="flex justify-between">
                    <span>Due now (deposit)</span>
                    <span className="font-semibold text-[#0d1b3e]">{formatVND(vehicle.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due on return</span>
                    <span className="font-semibold text-[#0d1b3e]">{formatVND(finalTotal)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>Late fee (if applicable)</span>
                    <span>{formatVND(vehicle.pricePerHour * 1.5)}/hr</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!agreedTerms}
                className="mt-5 w-full bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#e8920a]/20"
              >
                Pay Deposit {formatVND(vehicle.depositAmount)}
              </button>
              <p className="text-xs text-center text-[#6b7694] mt-2">Secure payment · SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
