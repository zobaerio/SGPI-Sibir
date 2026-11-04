import React, { useState } from 'react';
import { searchRegistration } from '../services/storage';
import { StudentRegistration } from '../types';
import { RegistrationPass } from './RegistrationPass';
import { Search, Phone, QrCode, ArrowLeft, AlertCircle } from 'lucide-react';

interface CheckStatusModalProps {
  onBack: () => void;
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foundStudent, setFoundStudent] = useState<StudentRegistration | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('মোবাইল নম্বর বা রেজিস্ট্রেশন আইডি লিখুন।');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(false);

    try {
      const student = await searchRegistration(query.trim());
      setFoundStudent(student);
      setSearched(true);
    } catch (err: any) {
      setFoundStudent(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-green-800 hover:text-green-950 font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-green-200 transition"
      >
        <ArrowLeft className="w-4 h-4" /> হোম পেজে ফিরে যান
      </button>

      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-green-100 mb-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 text-green-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            রেজিস্ট্রেশন স্ট্যাটাস ও পাস খুঁজুন
          </h2>
          <p className="text-sm text-gray-600">
            আপনার মোবাইল নম্বর অথবা রেজিস্ট্রেশন আইডি দিয়ে স্ট্যাটাস যাচাই করুন এবং ডিজিটাল পাস ডাউনলোড করুন।
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="মোবাইল নম্বর (যেমন: 017XXXXXXXX) বা আইডি (যেমন: SGPI-2026-1001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" /> খুঁজুন
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>

      {searched && (
        <div>
          {foundStudent ? (
            <RegistrationPass registration={foundStudent} />
          ) : (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center text-amber-900">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold mb-1">কোনো রেজিস্ট্রেশন পাওয়া যায়নি</h3>
              <p className="text-sm">দয়া করে সঠিক মোবাইল নম্বর বা রেজিস্ট্রেশন আইডি দিয়ে আবার চেষ্টা করুন।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
