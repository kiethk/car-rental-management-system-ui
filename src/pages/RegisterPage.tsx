import { useState } from 'react';
import type { Customer } from '../data/mockData';

interface RegisterPageProps {
  onRegister: (customer: Customer) => void;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function RegisterPage({ onRegister, onNavigate }: RegisterPageProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(err => ({ ...err, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim() || !/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid Vietnamese phone number (e.g. 0901234567)';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const newCustomer: Customer = {
        id: 'cust-new-' + Date.now(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        joinedAt: new Date().toISOString().split('T')[0],
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format`,
      };
      onRegister(newCustomer);
    }, 700);
  };

  const fields: { key: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Nguyễn Văn An' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '0901 234 567' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
    { key: 'password', label: 'Password', type: showPassword ? 'text' : 'password', placeholder: 'Min. 8 characters' },
    { key: 'confirm', label: 'Confirm Password', type: showPassword ? 'text' : 'password', placeholder: 'Repeat your password' },
  ];

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-amber-400', width: '40%' };
    if (score <= 3) return { label: 'Good', color: 'bg-yellow-400', width: '60%' };
    if (score <= 4) return { label: 'Strong', color: 'bg-green-400', width: '80%' };
    return { label: 'Very Strong', color: 'bg-green-500', width: '100%' };
  })();

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-[#0d1b3e] rounded-2xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#e8920a">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="font-display text-xl text-[#0d1b3e]">DriveNow</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#d6dae8] shadow-sm p-7">
          <h1 className="font-display text-2xl text-[#0d1b3e] mb-1">Create your account</h1>
          <p className="text-sm text-[#6b7694] mb-6">Join DriveNow and start renting in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-[#6b7694] block mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={set(field.key)}
                    placeholder={field.placeholder}
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-[#0d1b3e] focus:outline-none transition-all ${
                      errors[field.key]
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-[#d6dae8] focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/15'
                    } ${field.key === 'password' || field.key === 'confirm' ? 'pr-11' : ''}`}
                  />
                  {(field.key === 'password' || field.key === 'confirm') && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7694] hover:text-[#0d1b3e]"
                    >
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  )}
                </div>
                {field.key === 'password' && passwordStrength && !errors.password && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-[#eaecf2] rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} rounded-full transition-all`} style={{ width: passwordStrength.width }} />
                    </div>
                    <span className="text-[10px] text-[#6b7694] mt-0.5 block">{passwordStrength.label}</span>
                  </div>
                )}
                {errors[field.key] && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              📋 After registering, you'll need to upload and verify your <strong>driving license</strong> before making a booking.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#e8920a]/20 mt-2"
            >
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg> Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-[#6b7694]">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-[#e8920a] font-semibold hover:underline">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
