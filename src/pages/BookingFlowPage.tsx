import { useState } from 'react';
import type { VehicleType, LicensePlate } from '../data/mockData';
import { licensePlates, formatVND } from '../data/mockData';

interface BookingFlowPageProps {
  vehicle: VehicleType;
  date: string;
  startTime: string;
  endTime: string;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function BookingFlowPage({
  vehicle, date, startTime, endTime, onNavigate,
}: BookingFlowPageProps) {
  const [step, setStep] = useState<'datetime' | 'plate'>('datetime');
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedStart, setSelectedStart] = useState(startTime);
  const [selectedEnd, setSelectedEnd] = useState(endTime);
  const [selectedPlate, setSelectedPlate] = useState<LicensePlate | null>(null);
  const [skipPlate, setSkipPlate] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const availablePlates = licensePlates.filter(
    p => p.vehicleTypeId === vehicle.id && p.status === 'available'
  );

  const durationHours = (() => {
    const [sh, sm] = selectedStart.split(':').map(Number);
    const [eh, em] = selectedEnd.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? diff / 60 : 0;
  })();

  const estimatedTotal = vehicle.pricePerHour * durationHours;

  const handleProceedToPlate = () => {
    if (durationHours <= 0) return;
    setStep('plate');
  };

  const handleProceedToCheckout = () => {
    onNavigate('checkout', {
      vehicle,
      date: selectedDate,
      startTime: selectedStart,
      endTime: selectedEnd,
      preferredPlate: skipPlate ? null : selectedPlate,
      durationHours,
      estimatedTotal,
    });
  };

  const formatPlateStatus = (status: LicensePlate['status']) => {
    if (status === 'available') return { label: 'Available', color: 'text-green-600 bg-green-50 border-green-200' };
    if (status === 'rented') return { label: 'Currently Rented', color: 'text-red-600 bg-red-50 border-red-200' };
    return { label: 'In Maintenance', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-white border-b border-[#d6dae8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => step === 'plate' ? setStep('datetime') : onNavigate('vehicle-detail', vehicle)}
            className="flex items-center gap-2 text-sm text-[#6b7694] hover:text-[#0d1b3e] mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {[
              { id: 'datetime', label: 'Date & Time' },
              { id: 'plate', label: 'License Plate' },
              { id: 'checkout', label: 'Checkout' },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    (step === 'datetime' && i === 0) || (step === 'plate' && i <= 1)
                      ? 'bg-[#0d1b3e] text-white'
                      : i === 2 ? 'border-2 border-[#d6dae8] text-[#6b7694]' : 'bg-[#e8920a] text-white'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${
                    (step === 'datetime' && i === 0) || (step === 'plate' && i === 1)
                      ? 'text-[#0d1b3e]' : 'text-[#6b7694]'
                  }`}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-8 sm:w-16 h-px bg-[#d6dae8] mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === 'datetime' && (
              <div className="bg-white rounded-2xl border border-[#d6dae8] p-6">
                <h2 className="font-display text-2xl text-[#0d1b3e] mb-1">Select Date & Time</h2>
                <p className="text-[#6b7694] text-sm mb-6">All rentals are picked up and returned at our Bình Thạnh warehouse.</p>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-[#0d1b3e] block mb-2">Pickup Date</label>
                    <input
                      type="date" min={today} value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#0d1b3e] block mb-2">Start Time</label>
                      <input
                        type="time" value={selectedStart}
                        onChange={e => setSelectedStart(e.target.value)}
                        className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0d1b3e] block mb-2">End Time</label>
                      <input
                        type="time" value={selectedEnd}
                        onChange={e => setSelectedEnd(e.target.value)}
                        className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/20"
                      />
                    </div>
                  </div>

                  {durationHours > 0 && (
                    <div className="bg-[#0d1b3e]/5 rounded-xl p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#6b7694]">Total duration</span>
                        <span className="font-bold text-[#0d1b3e]">{durationHours.toFixed(1)} hours</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6b7694]">Estimated rental cost</span>
                        <span className="font-bold text-[#e8920a]">{formatVND(estimatedTotal)}</span>
                      </div>
                    </div>
                  )}

                  {durationHours <= 0 && selectedStart && selectedEnd && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                      End time must be after start time.
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 space-y-1">
                    <p>🕐 <strong>Operating hours:</strong> 06:00 – 22:00 daily</p>
                    <p>📍 <strong>Pickup location:</strong> 123 Đường Đinh Bộ Lĩnh, Bình Thạnh</p>
                    <p>⏱️ <strong>Late return fee:</strong> {formatVND(vehicle.pricePerHour * 1.5)}/hour</p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPlate}
                  disabled={durationHours <= 0}
                  className="mt-6 w-full bg-[#0d1b3e] hover:bg-[#162550] disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all"
                >
                  Continue — Choose License Plate
                </button>
              </div>
            )}

            {step === 'plate' && (
              <div className="bg-white rounded-2xl border border-[#d6dae8] p-6">
                <h2 className="font-display text-2xl text-[#0d1b3e] mb-1">Preferred License Plate</h2>
                <p className="text-[#6b7694] text-sm mb-2">Optionally select a preferred vehicle. This is a request only — if unavailable at pickup, another vehicle of the same type will be assigned.</p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-6 flex gap-2">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <span>Preferred plate is <strong>not guaranteed</strong>. Vehicle condition may vary. All vehicles are regularly inspected.</span>
                </div>

                {/* Skip option */}
                <button
                  onClick={() => { setSkipPlate(true); setSelectedPlate(null); }}
                  className={`w-full text-left p-4 rounded-xl border-2 mb-3 transition-all ${
                    skipPlate
                      ? 'border-[#0d1b3e] bg-[#0d1b3e]/5'
                      : 'border-[#d6dae8] hover:border-[#0d1b3e]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${skipPlate ? 'border-[#0d1b3e] bg-[#0d1b3e]' : 'border-[#d6dae8]'}`}>
                      {skipPlate && <div className="w-2 h-2 rounded-full bg-white"/>}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0d1b3e] text-sm">No preference — Assign automatically</div>
                      <div className="text-xs text-[#6b7694]">We'll assign the best available vehicle of this type</div>
                    </div>
                  </div>
                </button>

                <div className="space-y-2">
                  {availablePlates.map(plate => {
                    const statusStyle = formatPlateStatus(plate.status);
                    const isSelected = selectedPlate?.id === plate.id && !skipPlate;
                    return (
                      <button
                        key={plate.id}
                        onClick={() => { setSelectedPlate(plate); setSkipPlate(false); }}
                        disabled={plate.status !== 'available'}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected ? 'border-[#e8920a] bg-[#e8920a]/5' : 'border-[#d6dae8] hover:border-[#e8920a]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#e8920a] bg-[#e8920a]' : 'border-[#d6dae8]'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white"/>}
                            </div>
                            <div>
                              <div className="font-mono-data font-bold text-[#0d1b3e] text-base tracking-wider">{plate.plate}</div>
                              <div className="text-xs text-[#6b7694]">{plate.color} · {plate.year} · {plate.odometer.toLocaleString()} km</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle.color}`}>
                              {statusStyle.label}
                            </span>
                            <div className="text-[10px] text-[#6b7694] mt-1">Inspection: {plate.inspectionExpiry}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="mt-6 w-full bg-[#e8920a] hover:bg-[#c4780a] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-[#e8920a]/20"
                >
                  Continue to Checkout
                </button>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-4 sticky top-20">
              <h3 className="font-semibold text-[#0d1b3e] mb-3">Booking Summary</h3>
              <div className="flex gap-3 mb-4 pb-4 border-b border-[#d6dae8]">
                <img src={vehicle.images[0]} alt={vehicle.name} className="w-16 h-12 rounded-lg object-cover bg-[#eaecf2]" />
                <div>
                  <div className="font-semibold text-[#0d1b3e] text-sm">{vehicle.name}</div>
                  <div className="text-xs text-[#6b7694] capitalize">{vehicle.category} · {vehicle.seats} seats</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7694]">Date</span>
                  <span className="font-medium text-[#0d1b3e]">{selectedDate || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7694]">Start</span>
                  <span className="font-medium text-[#0d1b3e]">{selectedStart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7694]">End</span>
                  <span className="font-medium text-[#0d1b3e]">{selectedEnd}</span>
                </div>
                {durationHours > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#6b7694]">Duration</span>
                      <span className="font-medium text-[#0d1b3e]">{durationHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between border-t border-[#d6dae8] pt-2 mt-2">
                      <span className="text-[#6b7694]">Rental cost</span>
                      <span className="font-bold text-[#e8920a]">{formatVND(estimatedTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7694]">Deposit</span>
                      <span className="font-medium text-[#0d1b3e]">{formatVND(vehicle.depositAmount)}</span>
                    </div>
                  </>
                )}
              </div>
              {step === 'plate' && (selectedPlate || skipPlate) && (
                <div className="mt-3 pt-3 border-t border-[#d6dae8] text-sm">
                  <span className="text-[#6b7694]">Preferred plate</span>
                  <div className="font-mono-data font-bold text-[#0d1b3e] text-base mt-0.5">
                    {skipPlate ? 'Auto-assigned' : selectedPlate?.plate}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
