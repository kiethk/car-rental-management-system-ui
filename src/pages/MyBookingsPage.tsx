import { useState } from 'react';
import { myBookings, vehicleTypes, licensePlates, formatVND } from '../data/mockData';
import type { Booking } from '../data/mockData';

interface MyBookingsPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const statusConfig: Record<Booking['status'], { label: string; color: string; dot: string }> = {
  pending_payment: { label: 'Awaiting Payment', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  active: { label: 'Active', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500 animate-pulse' },
  completed: { label: 'Completed', color: 'bg-[#f4f6f9] text-[#6b7694] border-[#d6dae8]', dot: 'bg-[#6b7694]' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
};

export default function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const [filter, setFilter] = useState<'all' | Booking['status']>('all');

  const enriched = myBookings.map(b => ({
    ...b,
    vehicleType: vehicleTypes.find(v => v.id === b.vehicleTypeId),
    assignedPlate: licensePlates.find(p => p.id === b.assignedPlateId),
  }));

  const filtered = filter === 'all' ? enriched : enriched.filter(b => b.status === filter);

  const formatDateTime = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-[#0d1b3e] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl text-white mb-1">My Bookings</h1>
          <p className="text-white/50 text-sm">{enriched.length} total bookings</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {(['all', 'pending_payment', 'confirmed', 'active', 'completed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${
                filter === f
                  ? 'bg-[#0d1b3e] text-white border-[#0d1b3e]'
                  : 'bg-white text-[#6b7694] border-[#d6dae8] hover:border-[#0d1b3e]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'pending_payment' ? 'Awaiting Payment' : statusConfig[f].label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#6b7694]">
            <div className="text-5xl mb-4">📋</div>
            <p>No bookings found.</p>
            <button onClick={() => onNavigate('search')} className="mt-4 bg-[#e8920a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
              Book a Car
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => {
              const cfg = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  onClick={() => onNavigate('booking-detail', booking)}
                  className="bg-white rounded-2xl border border-[#d6dae8] hover:border-[#e8920a]/40 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-40 h-32 sm:h-auto bg-[#eaecf2] flex-shrink-0">
                      {booking.vehicleType && (
                        <img
                          src={booking.vehicleType.images[0]}
                          alt={booking.vehicleType.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                              {cfg.label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-[#0d1b3e] text-base">{booking.vehicleType?.name}</h3>
                          <div className="text-xs text-[#6b7694] font-mono-data">{booking.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#0d1b3e]">{formatVND(booking.totalAmount)}</div>
                          <div className="text-xs text-[#6b7694]">
                            {booking.depositPaid ? (
                              <span className="text-green-600">Deposit paid</span>
                            ) : (
                              <span className="text-amber-600">Deposit pending</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#6b7694]">
                        <div>
                          <span className="font-medium text-[#0d1b3e]">Start: </span>
                          {formatDateTime(booking.startTime)}
                        </div>
                        <div>
                          <span className="font-medium text-[#0d1b3e]">End: </span>
                          {formatDateTime(booking.endTime)}
                        </div>
                        {booking.assignedPlate && (
                          <div>
                            <span className="font-medium text-[#0d1b3e]">Plate: </span>
                            <span className="font-mono-data font-bold">{booking.assignedPlate.plate}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {booking.status === 'pending_payment' && (
                          <button
                            onClick={e => { e.stopPropagation(); onNavigate('payment', {}); }}
                            className="text-xs bg-[#e8920a] hover:bg-[#c4780a] text-white font-semibold px-4 py-1.5 rounded-lg transition-all"
                          >
                            Complete Payment
                          </button>
                        )}
                        {booking.status === 'completed' && !booking.review && (
                          <button
                            onClick={e => { e.stopPropagation(); onNavigate('booking-detail', booking); }}
                            className="text-xs bg-[#0d1b3e] hover:bg-[#162550] text-white font-semibold px-4 py-1.5 rounded-lg transition-all"
                          >
                            Leave Review
                          </button>
                        )}
                        {booking.status === 'completed' && booking.review && (
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= booking.review!.rating ? '#f59e0b' : '#e2e6ef'}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                            <span className="text-xs text-[#6b7694]">Reviewed</span>
                          </div>
                        )}
                        {(booking.status === 'pending_payment' || booking.status === 'confirmed') && (
                          <button
                            onClick={e => e.stopPropagation()}
                            className="text-xs border border-red-200 text-red-500 hover:bg-red-50 font-medium px-4 py-1.5 rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        )}
                        <button className="text-xs text-[#e8920a] font-medium ml-auto flex items-center gap-1 hover:gap-2 transition-all">
                          Details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
