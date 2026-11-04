import React, { useState } from 'react';
import { Shield, X, AlertCircle, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('zobaerhasan431@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'লগইন করা যায়নি।');
      setPassword('');
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'সার্ভারের সঙ্গে সংযোগ করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-2xl">
        <button onClick={onClose} aria-label="বন্ধ করুন" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
        <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 px-7 py-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200/40 bg-amber-300 text-emerald-950 shadow-xl"><Shield className="h-8 w-8" /></div>
          <p className="text-[10px] font-black tracking-[0.28em] text-emerald-200">RESTRICTED ACCESS</p>
          <h2 className="mt-2 text-2xl font-black text-white">সুপার অ্যাডমিন পোর্টাল</h2>
          <p className="mt-1 text-xs text-emerald-100">নবীন বরণ ২০২৬ • নিরাপদ প্রবেশ</p>
        </div>
        <form onSubmit={submit} className="space-y-4 p-6 sm:p-7">
          <div><label className="mb-1.5 block text-xs font-bold text-slate-700">অ্যাডমিন ইমেইল</label><input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></div>
          <div><label className="mb-1.5 block text-xs font-bold text-slate-700">পাসওয়ার্ড</label><div className="relative"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><button type="button" onClick={() => setShowPassword(v => !v)} aria-label="পাসওয়ার্ড দেখান বা লুকান" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div>
          {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
          <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}{loading ? 'যাচাই করা হচ্ছে…' : 'নিরাপদে লগইন করুন'}</button>
          <p className="text-center text-[10px] leading-relaxed text-slate-500">সেশন HttpOnly Cookie-তে থাকবে। পাসওয়ার্ড Frontend বা GitHub-এ রাখা হয় না।</p>
        </form>
      </div>
    </div>
  );
};
