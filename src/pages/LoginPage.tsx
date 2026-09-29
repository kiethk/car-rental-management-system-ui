import { useState } from 'react';
import { mockAccounts } from '../data/mockData';
import type { Customer } from '../data/mockData';

interface LoginPageProps {
  onLogin: (customer: Customer) => void;
  onNavigate: (page: string, data?: unknown) => void;
  redirectMessage?: string;
}

export default function LoginPage({ onLogin, onNavigate, redirectMessage }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const account = mockAccounts.find(
        a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
      );
      if (account) {
        onLogin(account);
      } else {
        setError('Incorrect email or password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  const handleDemoLogin = (account: Customer) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const licenseStatusBadge = (status?: string) => {
    const map: Record<string, { label: string; color: string }> = {
      approved: { label: 'Verified ✓', color: 'bg-green-100 text-green-700' },
      pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
      not_uploaded: { label: 'Not Uploaded', color: 'bg-[#f4f6f9] text-[#6b7694]' },
    };
    const s = map[status ?? 'not_uploaded'];
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
    );
  };

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

        {/* Redirect warning */}
        {redirectMessage && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
            <p className="text-sm text-amber-800">{redirectMessage}</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#d6dae8] shadow-sm p-7">
          <h1 className="font-display text-2xl text-[#0d1b3e] mb-1">Welcome back</h1>
          <p className="text-sm text-[#6b7694] mb-6">Sign in to your DriveNow account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#6b7694] block mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 text-sm text-[#0d1b3e] focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/15 transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#6b7694]">Password</label>
                <button type="button" className="text-xs text-[#e8920a] hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-[#d6dae8] rounded-xl px-4 py-3 pr-11 text-sm text-[#0d1b3e] focus:outline-none focus:border-[#e8920a] focus:ring-2 focus:ring-[#e8920a]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7694] hover:text-[#0d1b3e]"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8920a] hover:bg-[#c4780a] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#e8920a]/20"
            >
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-[#6b7694]">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} className="text-[#e8920a] font-semibold hover:underline">
              Create account
            </button>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 bg-white rounded-2xl border border-[#d6dae8] p-4">
          <p className="text-xs font-semibold text-[#6b7694] uppercase tracking-wider mb-3">Demo Accounts</p>
          <div className="space-y-2">
            {mockAccounts.map(account => (
              <button
                key={account.id}
                onClick={() => handleDemoLogin(account)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f4f6f9] transition-all text-left group"
              >
                <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-[#eaecf2]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0d1b3e] truncate">{account.name}</div>
                  <div className="text-xs text-[#6b7694] truncate">{account.email}</div>
                </div>
                {licenseStatusBadge(account.drivingLicense?.status)}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7694" strokeWidth="2" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#6b7694] mt-2 text-center">Password for all demo accounts: <span className="font-mono-data font-bold">password123</span></p>
        </div>
      </div>
    </div>
  );
}
