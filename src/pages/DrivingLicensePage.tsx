import { useState, useRef } from 'react';
import type { Customer, DrivingLicense, LicenseClass } from '../data/mockData';

interface DrivingLicensePageProps {
  customer: Customer;
  onUpdateLicense: (license: DrivingLicense) => void;
  onNavigate: (page: string, data?: unknown) => void;
}

const LICENSE_CLASSES: { value: LicenseClass; label: string; desc: string }[] = [
  { value: 'A1', label: 'A1', desc: 'Motorcycles ≤ 175cc' },
  { value: 'A2', label: 'A2', desc: 'Motorcycles > 175cc, 3-wheelers' },
  { value: 'B1', label: 'B1', desc: 'Cars ≤ 9 seats (no commercial)' },
  { value: 'B2', label: 'B2', desc: 'Cars ≤ 9 seats (commercial use)' },
  { value: 'C', label: 'C', desc: 'Trucks ≤ 3,500kg' },
  { value: 'D', label: 'D', desc: 'Buses ≤ 29 seats' },
  { value: 'E', label: 'E', desc: 'Buses > 29 seats' },
  { value: 'F', label: 'F', desc: 'Trams / special vehicles' },
];

type FormState = {
  licenseNumber: string;
  licenseClass: LicenseClass | '';
  expiryDate: string;
  frontImageFile: File | null;
  frontImagePreview: string;
  backImageFile: File | null;
  backImagePreview: string;
};

export default function DrivingLicensePage({ customer, onUpdateLicense, onNavigate }: DrivingLicensePageProps) {
  const license = customer.drivingLicense;
  const status = license?.status ?? 'not_uploaded';
  const isEditable = status === 'not_uploaded' || status === 'rejected';
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showForm = isEditable || isResubmitting;

  const [form, setForm] = useState<FormState>({
    licenseNumber: isEditable ? (license?.licenseNumber ?? '') : '',
    licenseClass: isEditable ? (license?.licenseClass ?? '') : '',
    expiryDate: isEditable ? (license?.expiryDate ?? '') : '',
    frontImageFile: null,
    frontImagePreview: isEditable ? (license?.frontImageUrl ?? '') : '',
    backImageFile: null,
    backImagePreview: isEditable ? (license?.backImageUrl ?? '') : '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (side: 'front' | 'back') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (side === 'front') {
      setForm(f => ({ ...f, frontImageFile: file, frontImagePreview: preview }));
      setErrors(err => ({ ...err, frontImagePreview: undefined }));
    } else {
      setForm(f => ({ ...f, backImageFile: file, backImagePreview: preview }));
      setErrors(err => ({ ...err, backImagePreview: undefined }));
    }
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.licenseNumber.trim()) e.licenseNumber = 'License number is required';
    if (!form.licenseClass) e.licenseClass = 'License class is required';
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required';
    else if (new Date(form.expiryDate) <= new Date()) e.expiryDate = 'License has already expired';
    if (!form.frontImagePreview) e.frontImagePreview = 'Front image is required';
    if (!form.backImagePreview) e.backImagePreview = 'Back image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const newLicense: DrivingLicense = {
        licenseNumber: form.licenseNumber.trim().toUpperCase(),
        licenseClass: form.licenseClass as LicenseClass,
        expiryDate: form.expiryDate,
        frontImageUrl: form.frontImagePreview,
        backImageUrl: form.backImagePreview,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      onUpdateLicense(newLicense);
      setSubmitting(false);
      setSubmitted(true);
      setIsResubmitting(false);
    }, 1000);
  };

  const today = new Date().toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl border border-[#d6dae8] shadow-sm w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 className="font-display text-2xl text-[#0d1b3e] mb-2">License Submitted</h2>
          <p className="text-[#6b7694] text-sm mb-6">Your driving license is under review. This usually takes up to 24 hours. We'll notify you once it's approved.</p>
          <button onClick={() => onNavigate('profile')} className="w-full bg-[#0d1b3e] hover:bg-[#162550] text-white font-semibold py-3 rounded-xl text-sm transition-all">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-white border-b border-[#d6dae8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 text-sm text-[#6b7694] hover:text-[#0d1b3e] mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Profile
          </button>
          <h1 className="font-display text-2xl text-[#0d1b3e]">Driving License</h1>
          <p className="text-sm text-[#6b7694] mt-0.5">Required for booking any vehicle</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ─── APPROVED ─── */}
        {status === 'approved' && license && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <h2 className="font-semibold text-green-900 text-base">License Verified ✓</h2>
                <p className="text-green-700 text-sm mt-0.5">Your driving license has been approved. You can now book vehicles.</p>
                <div className="mt-2 text-xs text-green-800 space-y-0.5">
                  <div>Reviewed: {license.reviewedAt ? new Date(license.reviewedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-4">License Details</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'License Number', value: license.licenseNumber, mono: true },
                  { label: 'Class', value: `Class ${license.licenseClass}` },
                  { label: 'Expiry Date', value: license.expiryDate },
                  { label: 'Status', value: 'Approved' },
                ].map(item => (
                  <div key={item.label} className="bg-[#f4f6f9] rounded-xl p-3">
                    <div className="text-xs text-[#6b7694]">{item.label}</div>
                    <div className={`text-sm font-semibold text-[#0d1b3e] mt-0.5 ${item.mono ? 'font-mono-data tracking-wide' : ''}`}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <LicenseImageCard label="Front" src={license.frontImageUrl} />
                <LicenseImageCard label="Back" src={license.backImageUrl} />
              </div>
            </div>
          </>
        )}

        {/* ─── PENDING ─── */}
        {status === 'pending' && license && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h2 className="font-semibold text-amber-900 text-base">Under Review</h2>
                <p className="text-amber-700 text-sm mt-0.5">
                  Submitted on {new Date(license.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}. Review usually takes up to 24 hours.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-4">Submitted Details</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'License Number', value: license.licenseNumber, mono: true },
                  { label: 'Class', value: `Class ${license.licenseClass}` },
                  { label: 'Expiry Date', value: license.expiryDate },
                ].map(item => (
                  <div key={item.label} className="bg-[#f4f6f9] rounded-xl p-3">
                    <div className="text-xs text-[#6b7694]">{item.label}</div>
                    <div className={`text-sm font-semibold text-[#0d1b3e] mt-0.5 ${item.mono ? 'font-mono-data tracking-wide' : ''}`}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <LicenseImageCard label="Front" src={license.frontImageUrl} />
                <LicenseImageCard label="Back" src={license.backImageUrl} />
              </div>
            </div>

            {/* Review steps */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-4">Review Progress</h3>
              {[
                { label: 'Documents submitted', done: true },
                { label: 'Initial check (automated)', done: true },
                { label: 'Staff review', done: false, current: true },
                { label: 'Final approval', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done ? 'bg-green-500' : step.current ? 'bg-amber-400' : 'bg-[#eaecf2]'
                  }`}>
                    {step.done ? (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    ) : step.current ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                    ) : null}
                  </div>
                  <span className={`text-sm ${step.done ? 'text-green-700' : step.current ? 'text-amber-800 font-medium' : 'text-[#6b7694]'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── REJECTED ─── */}
        {status === 'rejected' && license && !isResubmitting && (
          <>
            <div className="bg-red-50 border border-red-300 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <div>
                  <h2 className="font-semibold text-red-900 text-base">Submission Rejected</h2>
                  <p className="text-red-700 text-sm mt-0.5">
                    Reviewed on {license.reviewedAt ? new Date(license.reviewedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>
              {license.rejectionReason && (
                <div className="mt-4 bg-red-100 border border-red-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-red-900 uppercase tracking-wide mb-1">Reason for Rejection</div>
                  <p className="text-sm text-red-800 leading-relaxed">{license.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-3">Previous Submission</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'License Number', value: license.licenseNumber, mono: true },
                  { label: 'Class', value: `Class ${license.licenseClass}` },
                  { label: 'Expiry Date', value: license.expiryDate },
                ].map(item => (
                  <div key={item.label} className="bg-[#f4f6f9] rounded-xl p-3">
                    <div className="text-xs text-[#6b7694]">{item.label}</div>
                    <div className={`text-sm font-semibold text-[#0d1b3e] mt-0.5 ${item.mono ? 'font-mono-data tracking-wide' : ''}`}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <LicenseImageCard label="Front (rejected)" src={license.frontImageUrl} rejected />
                <LicenseImageCard label="Back (rejected)" src={license.backImageUrl} rejected />
              </div>
              <button
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    licenseNumber: license.licenseNumber,
                    licenseClass: license.licenseClass,
                    expiryDate: license.expiryDate,
                    frontImagePreview: '',
                    backImagePreview: '',
                    frontImageFile: null,
                    backImageFile: null,
                  }));
                  setErrors({});
                  setIsResubmitting(true);
                }}
                className="w-full bg-[#0d1b3e] hover:bg-[#162550] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Resubmit License
              </button>
            </div>
          </>
        )}

        {/* ─── FORM (not_uploaded or resubmitting) ─── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {isResubmitting && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <strong>Resubmitting your license.</strong> Please ensure the new photos are clear, well-lit, and show all text legibly. Address the rejection reason above.
                </div>
              </div>
            )}

            {/* Image uploads */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5">
              <h3 className="font-semibold text-[#0d1b3e] mb-1">License Photos <span className="text-red-500">*</span></h3>
              <p className="text-xs text-[#6b7694] mb-4">Take clear photos in good lighting. All text must be readable. Accepted: JPG, PNG, HEIC.</p>
              <div className="grid grid-cols-2 gap-4">
                {(['front', 'back'] as const).map(side => {
                  const preview = side === 'front' ? form.frontImagePreview : form.backImagePreview;
                  const err = side === 'front' ? errors.frontImagePreview : errors.backImagePreview;
                  const inputRef = side === 'front' ? frontRef : backRef;
                  return (
                    <div key={side}>
                      <div className="text-xs font-semibold text-[#6b7694] mb-2 capitalize">{side} side</div>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                          err ? 'border-red-300 bg-red-50' : preview ? 'border-[#e8920a]' : 'border-[#d6dae8] hover:border-[#e8920a]/50 bg-[#f4f6f9] hover:bg-[#eaecf2]'
                        }`}
                      >
                        {preview ? (
                          <>
                            <img src={preview} alt={`${side} license`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">Change photo</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7694" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            <span className="text-xs text-[#6b7694] mt-1.5">Tap to upload</span>
                          </>
                        )}
                      </button>
                      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange(side)} />
                      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* License details */}
            <div className="bg-white rounded-2xl border border-[#d6dae8] p-5 space-y-4">
              <h3 className="font-semibold text-[#0d1b3e]">License Information</h3>

              <div>
                <label className="text-xs font-semibold text-[#6b7694] block mb-1.5">License Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.licenseNumber}
                  onChange={e => { setForm(f => ({ ...f, licenseNumber: e.target.value })); setErrors(err => ({ ...err, licenseNumber: undefined })); }}
                  placeholder="e.g. B2-0123456789"
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-mono-data tracking-wide focus:outline-none transition-all ${
                    errors.licenseNumber ? 'border-red-300 bg-red-50' : 'border-[#d6dae8] focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/15'
                  }`}
                />
                {errors.licenseNumber && <p className="text-xs text-red-600 mt-1">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6b7694] block mb-2">License Class <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {LICENSE_CLASSES.map(cls => (
                    <button
                      key={cls.value}
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, licenseClass: cls.value })); setErrors(err => ({ ...err, licenseClass: undefined })); }}
                      className={`p-2 rounded-xl border-2 text-center transition-all ${
                        form.licenseClass === cls.value
                          ? 'border-[#e8920a] bg-[#e8920a]/5'
                          : 'border-[#d6dae8] hover:border-[#e8920a]/40'
                      }`}
                      title={cls.desc}
                    >
                      <div className="font-bold text-[#0d1b3e] text-sm">{cls.label}</div>
                    </button>
                  ))}
                </div>
                {form.licenseClass && (
                  <p className="text-xs text-[#6b7694] mt-1.5">
                    {LICENSE_CLASSES.find(c => c.value === form.licenseClass)?.desc}
                  </p>
                )}
                {errors.licenseClass && <p className="text-xs text-red-600 mt-1">{errors.licenseClass}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6b7694] block mb-1.5">Expiry Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.expiryDate}
                  min={today}
                  onChange={e => { setForm(f => ({ ...f, expiryDate: e.target.value })); setErrors(err => ({ ...err, expiryDate: undefined })); }}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    errors.expiryDate ? 'border-red-300 bg-red-50' : 'border-[#d6dae8] focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/15'
                  }`}
                />
                {errors.expiryDate && <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 space-y-1.5">
              <div className="font-bold text-sm text-blue-900 mb-2">📋 Photo Guidelines</div>
              <div>✓ Both sides of the license must be clearly visible</div>
              <div>✓ All text (name, number, expiry) must be readable</div>
              <div>✓ No glare, shadows, or cropping of important areas</div>
              <div>✓ License must not be expired at time of submission</div>
              <div>✓ Only Vietnamese driving licenses are accepted</div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#e8920a]/20"
            >
              {submitting ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg> Submitting...</>
              ) : isResubmitting ? 'Resubmit for Review' : 'Submit for Verification'}
            </button>

            {isResubmitting && (
              <button
                type="button"
                onClick={() => setIsResubmitting(false)}
                className="w-full text-sm text-[#6b7694] hover:text-[#0d1b3e] py-2"
              >
                Cancel
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function LicenseImageCard({ label, src, rejected }: { label: string; src: string; rejected?: boolean }) {
  return (
    <div>
      <div className="text-xs font-medium text-[#6b7694] mb-1.5">{label}</div>
      <div className={`rounded-xl overflow-hidden border-2 h-28 bg-[#eaecf2] relative ${rejected ? 'border-red-200' : 'border-[#d6dae8]'}`}>
        <img src={src} alt={label} className={`w-full h-full object-cover ${rejected ? 'opacity-50' : ''}`} />
        {rejected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
