import React, { useState, useEffect } from 'react';
import { Award, Calendar, Shield, Users, FileText, QrCode, LogOut, UserCheck } from 'lucide-react';
import { getCurrentAdmin, setCurrentAdmin, getStoredRegistrations } from '../services/storage';

interface NavbarProps {
  activeTab: 'register' | 'poster' | 'status' | 'admin';
  setActiveTab: (tab: 'register' | 'poster' | 'status' | 'admin') => void;
  onOpenAdminLogin: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAdminLogin, onLogout }) => {
  const [currentAdmin, setAdminState] = useState(getCurrentAdmin());
  const [totalRegs, setTotalRegs] = useState(getStoredRegistrations().length);

  useEffect(() => {
    const handleUpdate = () => {
      setAdminState(getCurrentAdmin());
      setTotalRegs(getStoredRegistrations().length);
    };
    window.addEventListener('sgpi_admin_updated', handleUpdate);
    window.addEventListener('sgpi_registrations_updated', handleUpdate);
    return () => {
      window.removeEventListener('sgpi_admin_updated', handleUpdate);
      window.removeEventListener('sgpi_registrations_updated', handleUpdate);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else { setCurrentAdmin(null); setActiveTab('register'); }
  };

  return (
    <header className="bg-gradient-to-r from-green-900 via-green-800 to-blue-950 text-white shadow-xl sticky top-0 z-40 no-print">
      {/* Top Banner Ticker */}
      <div className="bg-yellow-400 text-green-950 px-4 py-1 text-xs md:text-sm font-bold flex justify-between items-center shadow-inner">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-green-900 text-yellow-300 px-2 py-0.5 rounded text-[11px] animate-pulse">জরুরি ঘোষণা</span>
          <span className="animate-marquee">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউটের ২০২৫-২০২৬ শিক্ষাবর্ষের প্রথম সেমিস্টারের নবীন বরণ ২০২৬ - ১২ নভেম্বর ২০২৬, বৃহস্পতিবার!</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span>📅 ১২ নভেম্বর ২০২৬</span>
          <span>📍 সাতক্ষীরা শহর</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('register')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-green-600 flex items-center justify-center shadow-lg border-2 border-white/20">
              <Award className="w-7 h-7 text-green-950" />
            </div>
            <div>
              <div className="text-xs text-green-200 font-semibold tracking-wider">
                সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট
              </div>
              <h1 className="text-xl md:text-2xl font-black text-yellow-300 tracking-tight">
                নবীন বরণ ২০২৬
              </h1>
            </div>
          </div>

          {/* Navigation items / Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-yellow-400 text-green-950 shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> রেজিস্ট্রেশন ফর্ম
            </button>
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'poster'
                  ? 'bg-yellow-400 text-green-950 shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Calendar className="w-4 h-4" /> পোস্টার ও তথ্য
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'status'
                  ? 'bg-yellow-400 text-green-950 shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <QrCode className="w-4 h-4" /> আমার পাস / স্ট্যাটাস
            </button>

            {currentAdmin ? (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                    activeTab === 'admin'
                      ? 'bg-yellow-400 text-green-950 shadow-md font-bold'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" /> এডমিন ড্যাশবোর্ড
                </button>
                <button
                  onClick={handleLogout}
                  title="লগআউট"
                  className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile hamburger or quick buttons */}
          <div className="flex lg:hidden items-center gap-2">
            {currentAdmin ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-3 py-1.5 bg-yellow-400 text-green-950 text-xs font-bold rounded-lg"
              >
                ড্যাশবোর্ড
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2 border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'register' ? 'bg-yellow-400 text-green-950 font-bold' : 'bg-white/10 text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> ফর্ম
          </button>
          <button
            onClick={() => setActiveTab('poster')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'poster' ? 'bg-yellow-400 text-green-950 font-bold' : 'bg-white/10 text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> পোস্টার
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'status' ? 'bg-yellow-400 text-green-950 font-bold' : 'bg-white/10 text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> স্ট্যাটাস ও পাস
          </button>
          {currentAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'bg-yellow-400 text-green-950 font-bold' : 'bg-blue-600 text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> ড্যাশবোর্ড
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
