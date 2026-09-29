import { useState } from 'react';
import type { Booking } from '../data/mockData';
import { vehicleTypes, licensePlates, formatVND } from '../data/mockData';

interface BookingDetailPageProps {
  booking: Booking;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function BookingDetailPage({ booking, onNavigate }: BookingDetailPageProps) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(!!booking.review);
  const [localReview, setLocalReview] = useState(booking.review ?? null);

  const vehicle = vehicleTypes.find(v => v.id === booking.vehicleTypeId);
  const assignedPlate = licensePlates.find(p => p.id === booking.assignedPlateId);
  const preferredPlate = licensePlates.find(p => p.id === booking.preferredPlateId);

  const statusConfig: Record<Booking['status'], { label: string; bg: string; text: string }> = {
    pending_payment: { label: 'Awaiting Payment', bg: 'bg-amber-50', text: 'text-amber-700' },
    confirmed: { label: 'Confirmed', bg: 'bg-blue-50', text: 'text-blue-700' },
    active: { label: 'Active — Vehicle Out', bg: 'bg-green-50', text: 'text-green-700' },
    completed: { label: 'Completed', bg: 'bg-[#f4f6f9]', text: 'text-[#6b7694]' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600' },
  };

  const sc = statusConfig[booking.status];

  const formatDateTime = (dt: string) => {
    return new Date(dt).toLocaleString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) return;
    const review = {
      id: 'rv-new',
      bookingId: booking.id,
      rating: reviewRating,
      comment: reviewText,
      createdAt: new Date().toISOString(),
    };
    setLocalReview(review);
    setReviewSubmitted(true);
  };

  const durationMs = new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-white border-b border-[#d6dae8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => onNavigate('my-bookings')}
            className="flex items-center gap-2 text-sm text-[#6b7694] hover:text-[#0d1b3e] mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            My Bookings
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl text-[#0d1b3e]">Booking Detail</h1>
              <div className="font-mono-data text-sm text-[#e8920a] font-bold">{booking.id}</div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${sc.bg} ${sc.text}`}>
              {sc.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Vehicle */}
        {vehicle && (
          <div className="bg-white rounded-2xl border border-[#d6dae8] overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-56 h-40 sm:h-auto bg-[#eaecf2] flex-shrink-0">
                <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1">
                <h2 className="font-display text-xl text-[#0d1b3e] mb-1">{vehicle.name}</h2>
                <div className="text-sm text-[#6b7694] capitalize mb-3">{vehicle.category} · {vehicle.seats} seats · {vehicle.transmission} · {vehicle.fuelType}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-[#6b7694]">Assigned Plate</div>
                    <div className="font-mono-data font-bold text-[#0d1b3e]">
                      {assignedPlate?.plate ?? 'Pending assignment'}
                    </div>
                  </div>
                  {preferredPlate && (
                    <div>
                      <div className="text-xs text-[#6b7694]">Preferred Plate</div>
                      <div className="font-mono-data font-medium text-[#6b7694]">{preferredPlate.plate}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
          <h3 className="font-semibold text-[#0d1b3e] mb-4">Rental Timeline</h3>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-[#d6dae8]"/>
            {[
              {
                time: formatDateTime(booking.createdAt),
                label: 'Booking Created',
                done: true,
              },
              {
                time: booking.depositPaid ? 'Paid' : 'Pending',
                label: 'Deposit Payment',
                done: booking.depositPaid,
                pending: !booking.depositPaid,
              },
              {
                time: formatDateTime(booking.startTime),
                label: 'Scheduled Pickup',
                done: ['active', 'completed'].includes(booking.status),
              },
              {
                time: booking.actualReturnTime ? formatDateTime(booking.actualReturnTime) : formatDateTime(booking.endTime),
                label: booking.actualReturnTime ? 'Actual Return' : 'Scheduled Return',
                done: booking.status === 'completed',
                late: booking.lateFee > 0,
              },
              {
                time: booking.finalPaid ? 'Paid' : (booking.status === 'completed' ? 'Pending' : '—'),
                label: 'Final Payment',
                done: booking.finalPaid,
                pending: booking.status === 'completed' && !booking.finalPaid,
              },
            ].map((item, i) => (
              <div key={i} className="relative flex gap-4 mb-5 last:mb-0">
                <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  item.done ? 'bg-green-500 border-green-500' :
                  item.pending ? 'bg-amber-400 border-amber-400' :
                  'bg-white border-[#d6dae8]'
                }`}>
                  {item.done && <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </div>
                <div>
                  <div className="font-medium text-[#0d1b3e] text-sm">{item.label}</div>
                  <div className="text-xs text-[#6b7694]">
                    {item.time}
                    {item.late && <span className="text-red-500 ml-2">(late — fee applied)</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
          <h3 className="font-semibold text-[#0d1b3e] mb-4">Payment Breakdown</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7694]">Rental ({durationHours.toFixed(1)}h × {formatVND(vehicle?.pricePerHour ?? 0)}/h)</span>
              <span className="text-[#0d1b3e] font-medium">{formatVND(booking.totalAmount + booking.discountAmount)}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount {booking.promotionCode && `(${booking.promotionCode})`}</span>
                <span>− {formatVND(booking.discountAmount)}</span>
              </div>
            )}
            {booking.lateFee > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Late return fee</span>
                <span>+ {formatVND(booking.lateFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t border-[#d6dae8] pt-2.5">
              <span className="text-[#0d1b3e]">Total Rental</span>
              <span className="text-[#0d1b3e]">{formatVND(booking.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[#6b7694]">
              <span>Deposit {booking.finalPaid ? '(refunded)' : '(held)'}</span>
              <span className={booking.finalPaid ? 'line-through' : ''}>{formatVND(booking.depositAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-[#d6dae8] pt-2.5 font-bold text-base">
              <span className="text-[#0d1b3e]">Deposit paid</span>
              <span className={`${booking.depositPaid ? 'text-green-600' : 'text-amber-600'}`}>
                {booking.depositPaid ? `✓ ${formatVND(booking.depositAmount)}` : `Pending ${formatVND(booking.depositAmount)}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span className="text-[#0d1b3e]">Balance on return</span>
              <span className={booking.finalPaid ? 'text-green-600' : 'text-[#0d1b3e]'}>
                {booking.finalPaid ? `✓ Paid` : formatVND(booking.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Review section */}
        {booking.status === 'completed' && (
          <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
            <h3 className="font-semibold text-[#0d1b3e] mb-4">
              {reviewSubmitted ? 'Your Review' : 'Leave a Review'}
            </h3>

            {reviewSubmitted && localReview ? (
              <div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= localReview.rating ? '#f59e0b' : '#e2e6ef'}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                {localReview.comment && (
                  <p className="text-sm text-[#6b7694] italic">"{localReview.comment}"</p>
                )}
                <div className="text-xs text-[#6b7694] mt-2">
                  {new Date(localReview.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ) : (
              <div>
                {/* Star rating */}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      onMouseEnter={() => setReviewHover(s)}
                      onMouseLeave={() => setReviewHover(0)}
                      onClick={() => setReviewRating(s)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={s <= (reviewHover || reviewRating) ? '#f59e0b' : '#e2e6ef'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                  {reviewRating > 0 && (
                    <span className="ml-2 text-sm text-[#6b7694] self-center">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                    </span>
                  )}
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Share your experience with this vehicle and our service..."
                  rows={3}
                  className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#e8920a] mb-3"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0}
                  className="bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* Status actions */}
        {booking.status === 'pending_payment' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-semibold text-amber-900 mb-2">Action Required</h3>
            <p className="text-sm text-amber-800 mb-4">Your booking is awaiting deposit payment. Complete payment to confirm your booking.</p>
            <button
              onClick={() => onNavigate('payment', {})}
              className="bg-[#e8920a] hover:bg-[#c4780a] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Complete Payment — {formatVND(booking.depositAmount)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
