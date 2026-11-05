import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { EventPosterHero } from './components/EventPosterHero';
import { EventPosterSection } from './components/EventPosterSection';
import { CheckStatusModal } from './components/CheckStatusModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FooterAdminAccess } from './components/FooterAdminAccess';
import { getCurrentAdmin, setCurrentAdmin } from './services/storage';
import { Award, MapPin, Calendar, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'poster' | 'status' | 'admin'>('register');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin-auth', { credentials: 'same-origin', cache: 'no-store' });
        if (response.ok) {
          const result = await response.json();
          if (result.ok && result.admin) {
            setCurrentAdmin({ ...result.admin, createdAt: new Date().toISOString() });
            if (window.location.pathname === '/admin') setActiveTab('admin');
          } else {
            setCurrentAdmin(null);
          }
        } else {
          setCurrentAdmin(null);
        }
      } catch {
        setCurrentAdmin(null);
      } finally {
        setCheckingSession(false);
        if (window.location.pathname === '/admin' && !getCurrentAdmin()) setShowAdminLogin(true);
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = () => {
    setCurrentAdmin({ email: 'zobaerhasan431@gmail.com', name: 'Super Admin', role: 'super_admin', createdAt: new Date().toISOString() });
    setShowAdminLogin(false);
    setActiveTab('admin');
    window.history.replaceState({}, '', '/admin');
  };

  const handleLogout = async () => {
    try { await fetch('/api/admin-auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'logout' }) }); } catch {}
    setCurrentAdmin(null);
    setActiveTab('register');
    window.history.replaceState({}, '', '/');
  };

  if (checkingSession) return <div className="flex min-h-screen items-center justify-center bg-emerald-50"><Loader2 className="h-8 w-8 animate-spin text-emerald-800" /><span className="ml-3 text-sm font-semibold text-emerald-900">নিরাপদ সেশন যাচাই হচ্ছে…</span></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50/30 to-blue-50/20 flex flex-col font-sans text-gray-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminLogin={() => { window.history.pushState({}, '', '/admin'); setShowAdminLogin(true); }}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {activeTab === 'register' && (
          <div>
            <EventPosterHero />
            <div id="register">
              <RegistrationForm onRegistrationSuccess={() => {}} />
            </div>
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
                <p className="text-sm text-gray-600 mb-6">এই পেজটি দেখার জন্য অনুমোদিত এডমিন হিসেবে লগইন করতে হবে।</p>
                <button onClick={() => setShowAdminLogin(true)} className="px-6 py-3 bg-green-700 text-white font-bold rounded-xl shadow transition">
                  এডমিন লগইন করুন
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <footer className="bg-gradient-to-r from-green-950 via-green-900 to-blue-950 text-white pt-12 pb-8 mt-16 border-t-4 border-yellow-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-green-950 flex items-center justify-center font-black"><Award className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-yellow-300">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</h3>
            </div>
            <p className="text-xs text-green-200 leading-relaxed">
              ২০২৬-২০২৭ শিক্ষাবর্ষের প্রথম সেমিস্টারের নবীন শিক্ষার্থীদের বরণ উপলক্ষে নবীন বরণ ২০২৬-এর রেজিস্ট্রেশন পোর্টাল।
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-yellow-300 uppercase tracking-wider mb-3">অনুষ্ঠানের বিবরণ</h4>
            <ul className="space-y-2 text-xs text-green-200">
              <li className="flex items-center gap-2"><Calendar className="w-4 h-4 text-yellow-400 shrink-0" /> তারিখ: ১২ নভেম্বর ২০২৬ (বৃহস্পতিবার)</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-yellow-400 shrink-0" /> স্থান: সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট, সাতক্ষীরা শহর</li>
              <li>বিশেষ আকর্ষণ: থাকছে একগুচ্ছ উপহার।</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-yellow-300 uppercase tracking-wider mb-3">আয়োজক</h4>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-sm font-bold text-yellow-200 mb-1">বাংলাদেশ ইসলামী ছাত্রশিবির</p>
              <p className="text-xs text-green-200">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</p>
              <p className="text-xs text-green-200">সাতক্ষীরা শহর</p>
            </div>
          </div>
        </div>
        <FooterAdminAccess onOpenAdmin={() => { window.history.pushState({}, '', '/admin'); setShowAdminLogin(true); }} />
      </footer>

      {showAdminLogin && (
        <AdminLoginModal onClose={() => { setShowAdminLogin(false); if (!getCurrentAdmin()) window.history.replaceState({}, '', '/'); }} onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
