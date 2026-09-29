import { useState, useMemo } from 'react';
import { vehicleTypes, formatVND, type VehicleCategory } from '../data/mockData';

interface SearchPageProps {
  onNavigate: (page: string, data?: unknown) => void;
  initialParams?: { date?: string; startTime?: string; endTime?: string };
}

const categoryLabels: Record<VehicleCategory | 'all', string> = {
  all: 'All Types',
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
  minivan: 'Minivan',
  pickup: 'Pickup',
};

export default function SearchPage({ onNavigate, initialParams }: SearchPageProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialParams?.date || today);
  const [startTime, setStartTime] = useState(initialParams?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialParams?.endTime || '18:00');
  const [category, setCategory] = useState<VehicleCategory | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'seats'>('price');
  const [searched, setSearched] = useState(!!initialParams?.date);
  const [seats, setSeats] = useState(0);

  const durationHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? diff / 60 : 0;
  }, [startTime, endTime]);

  const filtered = useMemo(() => {
    if (!searched) return [];
    return vehicleTypes
      .filter(v => category === 'all' || v.category === category)
      .filter(v => v.pricePerHour <= maxPrice)
      .filter(v => seats === 0 || v.seats >= seats)
      .sort((a, b) => {
        if (sortBy === 'price') return a.pricePerHour - b.pricePerHour;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'seats') return a.seats - b.seats;
        return 0;
      });
  }, [searched, category, maxPrice, sortBy, seats]);

  const categories = ['all', 'sedan', 'suv', 'hatchback', 'minivan'] as const;

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Search Header */}
      <div className="bg-[#0d1b3e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-2xl text-white mb-5">Find Available Vehicles</h1>
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-[#6b7694] font-medium block mb-1.5">Date</label>
                <input
                  type="date" min={today} value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-[#d6dae8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8920a]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7694] font-medium block mb-1.5">Start Time</label>
                <input
                  type="time" value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full border border-[#d6dae8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8920a]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7694] font-medium block mb-1.5">End Time</label>
                <input
                  type="time" value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full border border-[#d6dae8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8920a]"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  onClick={() => setSearched(true)}
                  className="bg-[#e8920a] hover:bg-[#c4780a] text-white font-semibold py-2 rounded-xl text-sm transition-all"
                >
                  {durationHours > 0 ? `Search (${durationHours.toFixed(1)}h)` : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {!searched ? (
          <div className="text-center py-20 text-[#6b7694]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-medium">Select a date and time to search for available vehicles</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="lg:w-64 flex-shrink-0 space-y-5">
              <div className="bg-white rounded-2xl p-4 border border-[#d6dae8]">
                <h3 className="font-semibold text-[#0d1b3e] mb-3 text-sm">Vehicle Type</h3>
                <div className="space-y-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat
                          ? 'bg-[#0d1b3e] text-white font-medium'
                          : 'text-[#6b7694] hover:bg-[#f4f6f9]'
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#d6dae8]">
                <h3 className="font-semibold text-[#0d1b3e] mb-3 text-sm">Max Price/Hour</h3>
                <input
                  type="range" min={100000} max={500000} step={10000}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#e8920a]"
                />
                <div className="text-sm text-[#e8920a] font-semibold mt-1">{formatVND(maxPrice)}</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#d6dae8]">
                <h3 className="font-semibold text-[#0d1b3e] mb-3 text-sm">Min. Seats</h3>
                <div className="flex gap-2 flex-wrap">
                  {[0, 2, 4, 5, 7].map(s => (
                    <button
                      key={s}
                      onClick={() => setSeats(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        seats === s
                          ? 'bg-[#0d1b3e] text-white border-[#0d1b3e]'
                          : 'text-[#6b7694] border-[#d6dae8] hover:border-[#0d1b3e]'
                      }`}
                    >
                      {s === 0 ? 'Any' : `${s}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Sort + count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#6b7694]">
                  <span className="font-semibold text-[#0d1b3e]">{filtered.length}</span> vehicles found
                  {durationHours > 0 && (
                    <span> · <span className="text-[#e8920a] font-medium">{durationHours.toFixed(1)}h rental</span></span>
                  )}
                </p>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm border border-[#d6dae8] rounded-lg px-3 py-1.5 text-[#0d1b3e] focus:outline-none focus:border-[#e8920a] bg-white"
                >
                  <option value="price">Sort: Price ↑</option>
                  <option value="rating">Sort: Rating ↓</option>
                  <option value="seats">Sort: Seats ↑</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[#6b7694]">
                  <div className="text-4xl mb-3">😔</div>
                  <p>No vehicles match your filters.</p>
                  <button onClick={() => { setCategory('all'); setMaxPrice(500000); setSeats(0); }} className="mt-3 text-[#e8920a] font-medium text-sm">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map(v => (
                    <div
                      key={v.id}
                      className="bg-white rounded-2xl border border-[#d6dae8] hover:border-[#e8920a]/40 hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-52 h-40 sm:h-auto bg-[#eaecf2] flex-shrink-0">
                          <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#0d1b3e] text-base">{v.name}</h3>
                              {v.fuelType === 'electric' && (
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">EV</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#6b7694] mb-3">
                              <span className="capitalize">{v.category}</span>
                              <span>·</span>
                              <span>{v.seats} seats</span>
                              <span>·</span>
                              <span>{v.transmission}</span>
                              <span>·</span>
                              <span>{v.fuelType}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              <span className="text-sm font-medium text-[#0d1b3e]">{v.rating}</span>
                              <span className="text-xs text-[#6b7694]">({v.reviewCount})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {v.features.slice(0, 3).map(f => (
                                <span key={f} className="text-[11px] bg-[#f4f6f9] text-[#6b7694] px-2 py-0.5 rounded-full">{f}</span>
                              ))}
                              {v.features.length > 3 && (
                                <span className="text-[11px] text-[#6b7694]">+{v.features.length - 3} more</span>
                              )}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between sm:min-w-[140px] pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#d6dae8] sm:pl-4">
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#e8920a]">{formatVND(v.pricePerHour)}</div>
                              <div className="text-xs text-[#6b7694]">per hour</div>
                              {durationHours > 0 && (
                                <div className="text-sm font-semibold text-[#0d1b3e] mt-1">
                                  ≈ {formatVND(v.pricePerHour * durationHours)}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-medium mb-2 ${
                                v.available > 2 ? 'text-green-600' : v.available > 0 ? 'text-amber-600' : 'text-red-500'
                              }`}>
                                {v.available > 0 ? `${v.available} available` : 'Unavailable'}
                              </div>
                              <button
                                onClick={() => onNavigate('vehicle-detail', { vehicle: v, date, startTime, endTime })}
                                disabled={v.available === 0}
                                className="bg-[#0d1b3e] hover:bg-[#162550] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
