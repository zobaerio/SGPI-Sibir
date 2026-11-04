import React from 'react';
import { Shield, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

/**
 * Admin access is intentionally disabled until server-verified Supabase Auth
 * and role-based authorization are configured. Never authenticate admins
 * with client-side passwords or localStorage flags.
 */
export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-green-200 bg-white shadow-2xl">
      <button onClick={onClose} aria-label="বন্ধ করুন" className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white">
        <X className="h-6 w-6" />
      </button>
      <div className="bg-gradient-to-r from-green-900 to-blue-950 p-7 text-center text-white">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
          <Shield className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-yellow-300">এডমিন পোর্টাল</h2>
        <p className="mt-1 text-xs text-green-100">নবীন বরণ ২০২৬</p>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">নিরাপদ লগইন সেটআপ বাকি</p>
            <p className="mt-1 text-sm leading-relaxed">
              শিক্ষার্থীদের ব্যক্তিগত তথ্য সুরক্ষিত রাখতে সার্ভার-ভিত্তিক Supabase Authentication ও Admin Role যাচাই চালু না হওয়া পর্যন্ত এডমিন লগইন বন্ধ রাখা হয়েছে।
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          সেটআপ সম্পন্ন হলে নির্ধারিত Super Admin ইমেইল দিয়ে নিরাপদভাবে প্রবেশ করা যাবে। কোনো পাসওয়ার্ড এই ওয়েবসাইটের কোডে রাখা হবে না।
        </p>
        <button onClick={onClose} className="w-full rounded-xl bg-green-700 py-3 font-bold text-white transition hover:bg-green-800">ঠিক আছে</button>
      </div>
    </div>
  </div>
);
