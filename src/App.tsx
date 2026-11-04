import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { EventPosterSection } from './components/EventPosterSection';
import { CheckStatusModal } from './components/CheckStatusModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { getCurrentAdmin } from './services/storage';
import { Award, Heart, MapPin, Calendar, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'poster' | 'status' | 'admin'>('register');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLoginSuccess = () => {
    setActiveTab('admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50/30 to-blue-50/20 flex flex-col font-sans text-gray-900">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAdminLogin={() => setShowAdminLogin(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'register' && (
          <div>
            {/* Top quick banner highlighting poster / info */}
            <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white py-6 px-4 mb-6 shadow-md text-center">
              <div className="max-w-4xl mx-auto">
                <span className="bg-yellow-400 text-green-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  নবীন বরণ ২০২৬
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-yellow-300 mb-2">
                  সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট
                </h2>
                <p className="text-sm md:text-base text-green-100 max-w-2xl mx-auto mb-3">
                  ২৬-২৭ শিক্ষাবর্ষের প্রথম সেমিস্টারের নবীন শিক্ষার্থীদের নিয়ে আয়োজিত হচ্ছে বর্ণাঢ্য নবীন বরণ ও সংবর্ধনা।
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm font-semibold text-yellow-200">
                  <span className="flex items-center gap-1">📅 ১২ নভেম্বর ২০২৬</span>
                  <span className="flex items-center gap-1">🕒 বৃহস্পতিবার</span>
                  <span className="flex items-center gap-1">📍 সাতক্ষীরা শহর</span>
                  <span className="flex items-center gap-1">🎁 সাথে থাকছে একগুচ্ছ উপহার</span>
                </div>
              </div>
            </div>

            <RegistrationForm onRegistrationSuccess={() => {}} />
          </div>
        )}

        {activeTab === 'poster' && (
          <EventPosterSection onGotoRegister={() => setActiveTab('register')} />
        )}

        {activeTab === 'status' && (
          <CheckStatusModal onBack={() => setActiveTab('register')} />
        )}

        {activeTab === 'admin' && (
          getCurrentAdmin() ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto py-20 text-center px-4">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-2">অনুমোদন প্রয়োজন</h3>
                <p className="text-sm text-gray-600 mb-6">এই পেজটি দেখার জন্য এডমিন হিসেবে লগইন করতে হবে।</p>
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="px-6 py-3 bg-green-700 text-white font-bold rounded-xl shadow transition"
                >
                  এডমিন লগইন করুন
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-950 via-green-900 to-blue-950 text-white pt-12 pb-8 mt-16 border-t-4 border-yellow-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-green-950 flex items-center justify-center font-black">
                ন
              </div>
              <h3 className="text-lg font-bold text-yellow-300">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</h3>
            </div>
            <p className="text-xs text-green-200 leading-relaxed">
              ২৬-২৭ শিক্ষাবর্ষের প্রথম সেমিস্টারের নবীন শিক্ষার্থীদের বরণ উপলক্ষে আয়োজিত নবীন বরণ ২০২৬ এর অফিসিয়াল রেজিস্ট্রেশন পোর্টাল।
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-yellow-300 uppercase tracking-wider mb-3">অনুষ্ঠানের বিবরণ</h4>
            <ul className="space-y-2 text-xs text-green-200">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400 shrink-0" /> তারিখ: ১২ নভেম্বর ২০২৬ (বৃহস্পতিবার)
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" /> স্থান: সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট, সাতক্ষীরা শহর
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400 shrink-0" /> বিশেষ আকর্ষণ: সাথে থাকছে একগুচ্ছ উপহার
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-yellow-300 uppercase tracking-wider mb-3">আয়োজক</h4>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-sm font-bold text-yellow-200 mb-1">বাংলাদেশ ইসলামী ছাত্রশিবির</p>
              <p className="text-xs text-green-200">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট শাখা।</p>
              <p className="text-[11px] text-green-300 mt-2 italic">"আসুন, জ্ঞানের আলোয় গড়ে তুলি সুন্দর আগামী..."</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center border-t border-white/10 pt-6 text-xs text-green-300">
          <p>© ২০২৬ নবীন বরণ কমিটি, সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );
}
