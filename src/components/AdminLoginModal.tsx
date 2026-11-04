import React, { useState } from 'react';
import { loginAdminApi, createAdminApi } from '../services/storage';
import { Shield, Lock, Mail, User, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await loginAdminApi(email.trim(), password);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !newName.trim()) {
      setError('সকল তথ্য পূরণ করুন।');
      return;
    }

    setSubmitting(true);
    try {
      await createAdminApi(email.trim(), newName.trim());
      alert('নতুন এডমিন সফলভাবে যোগ করা হয়েছে। এখন লগইন করুন।');
      setIsRegisterMode(false);
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'এডমিন তৈরি করা সম্ভব হয়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-green-200 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-r from-green-900 to-blue-950 text-white p-6 text-center">
          <div className="w-14 h-14 bg-yellow-400 text-green-950 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-yellow-300">
            {isRegisterMode ? 'নতুন এডমিন অ্যাকাউন্ট' : 'এডমিন পোর্টাল লগইন'}
          </h2>
          <p className="text-xs text-green-200 mt-1">
            সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট • নবীন বরণ ২০২৬
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isRegisterMode ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">এডমিন ইমেইল</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="zobaerhasan431@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> লগইন করুন
            </button>

            <div className="text-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError('');
                }}
                className="text-xs text-blue-700 hover:underline font-semibold"
              >
                সুপার এডমিন হিসেবে নতুন এডমিন অ্যাকাউন্ট তৈরি করুন
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">এডমিনের নাম</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="পূর্ণ নাম"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">এডমিন ইমেইল</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              এডমিন তৈরি করুন
            </button>

            <div className="text-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError('');
                }}
                className="text-xs text-green-700 hover:underline font-semibold"
              >
                লগইন পেজে ফিরে যান
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
