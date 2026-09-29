import { useState } from 'react';
import type { VehicleType, LicensePlate } from '../data/mockData';
import { formatVND } from '../data/mockData';

interface PaymentPageProps {
  vehicle: VehicleType;
  date: string;
  startTime: string;
  endTime: string;
  preferredPlate: LicensePlate | null;
  durationHours: number;
  estimatedTotal: number;
  discountAmount: number;
  finalTotal: number;
  promoCode?: string;
  notes?: string;
  onNavigate: (page: string, data?: unknown) => void;
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'momo', label: 'MoMo E-Wallet', icon: '📱' },
  { id: 'zalopay', label: 'ZaloPay', icon: '💚' },
  { id: 'vnpay', label: 'VNPay QR', icon: '🏦' },
  { id: 'transfer', label: 'Bank Transfer', icon: '🏛️' },
];

export default function PaymentPage({ vehicle, date, startTime, endTime, preferredPlate, durationHours, estimatedTotal, discountAmount, finalTotal, promoCode, notes, onNavigate }: PaymentPageProps) {
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onNavigate('booking-success', {
        bookingId: 'BK-' + Date.now().toString().slice(-6),
        vehicle, date, startTime, endTime,
        preferredPlate, durationHours, finalTotal,
        depositAmount: vehicle.depositAmount,
        promoCode, notes,
      });
    }, 1800);
  };

  const canPay = method !== 'card' || (cardNumber.replace(/\s/g,'').length === 16 && cardName && expiry.length === 5 && cvv.length === 3);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <div className="bg-white border-b border-[#d6dae8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => onNavigate('checkout', { vehicle, date, startTime, endTime, preferredPlate, durationHours, estimatedTotal })}
            className="flex items-center gap-2 text-sm text-[#6b7694] hover:text-[#0d1b3e] mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Checkout
          </button>
          <h1 className="font-display text-2xl text-[#0d1b3e]">Deposit Payment</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Method Selection */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-3">Payment Method</h3>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      method === m.id ? 'border-[#e8920a] bg-[#e8920a]/5' : 'border-[#d6dae8] hover:border-[#e8920a]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        method === m.id ? 'border-[#e8920a] bg-[#e8920a]' : 'border-[#d6dae8]'
                      }`}>
                        {method === m.id && <div className="w-2 h-2 rounded-full bg-white"/>}
                      </div>
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-sm font-medium text-[#0d1b3e]">{m.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card details */}
            {method === 'card' && (
              <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
                <h3 className="font-semibold text-[#0d1b3e] mb-4">Card Details</h3>

                {/* Card preview */}
                <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1e3a6e] rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"/>
                  <div className="text-xs text-white/50 mb-3">CREDIT CARD</div>
                  <div className="font-mono-data text-lg font-bold tracking-widest mb-4">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="text-[10px] text-white/50 uppercase">Cardholder</div>
                      <div className="font-medium">{cardName || 'YOUR NAME'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/50 uppercase">Expires</div>
                      <div className="font-medium">{expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#6b7694] block mb-1.5">Card Number</label>
                    <input
                      type="text" inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm font-mono-data tracking-widest focus:outline-none focus:border-[#e8920a]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6b7694] block mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN AN"
                      value={cardName}
                      onChange={e => setCardName(e.target.value.toUpperCase())}
                      className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm uppercase tracking-wide focus:outline-none focus:border-[#e8920a]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#6b7694] block mb-1.5">Expiry</label>
                      <input
                        type="text" inputMode="numeric"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                        className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm font-mono-data focus:outline-none focus:border-[#e8920a]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#6b7694] block mb-1.5">CVV</label>
                      <input
                        type="password" inputMode="numeric" maxLength={3}
                        placeholder="•••"
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm font-mono-data focus:outline-none focus:border-[#e8920a]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {method !== 'card' && (
              <div className="bg-white rounded-2xl border border-[#d6dae8] p-5 text-center">
                <div className="text-4xl mb-3">
                  {PAYMENT_METHODS.find(m => m.id === method)?.icon}
                </div>
                <p className="text-[#6b7694] text-sm">
                  You'll be redirected to {PAYMENT_METHODS.find(m => m.id === method)?.label} to complete your payment securely.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5 sticky top-20">
              <h3 className="font-semibold text-[#0d1b3e] mb-4">Order Summary</h3>

              <div className="flex gap-3 mb-4 pb-4 border-b border-[#d6dae8]">
                <img src={vehicle.images[0]} alt={vehicle.name} className="w-20 h-14 rounded-xl object-cover bg-[#eaecf2] flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#0d1b3e] text-sm">{vehicle.name}</div>
                  <div className="text-xs text-[#6b7694]">{date}</div>
                  <div className="text-xs text-[#6b7694]">{startTime} → {endTime} · {durationHours.toFixed(1)}h</div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[#6b7694]">Rental cost</span>
                  <span className="text-[#0d1b3e]">{formatVND(estimatedTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>− {formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t border-[#d6dae8] pt-2">
                  <span className="text-[#0d1b3e]">Rental total</span>
                  <span className="text-[#0d1b3e]">{formatVND(finalTotal)}</span>
                </div>
              </div>

              <div className="bg-[#0d1b3e] rounded-xl p-4 mb-4 text-white">
                <div className="text-xs text-white/60 mb-1">Amount to pay now</div>
                <div className="text-3xl font-bold">{formatVND(vehicle.depositAmount)}</div>
                <div className="text-xs text-white/60 mt-1">Security deposit (fully refundable)</div>
              </div>

              <button
                onClick={handlePay}
                disabled={!canPay || processing}
                className="w-full bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Pay {formatVND(vehicle.depositAmount)}
                  </>
                )}
              </button>
              <p className="text-xs text-center text-[#6b7694] mt-2">🔒 Secured by SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
