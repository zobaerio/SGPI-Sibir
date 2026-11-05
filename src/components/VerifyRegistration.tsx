import React, { useEffect, useState } from 'react';
import { searchRegistration } from '../services/storage';
import { StudentRegistration } from '../types';
import { RegistrationPass } from './RegistrationPass';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

interface VerifyRegistrationProps {
  registrationId: string;
}

export const VerifyRegistration: React.FC<VerifyRegistrationProps> = ({ registrationId }) => {
  const [student, setStudent] = useState<StudentRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    searchRegistration(registrationId)
      .then((result) => { if (active) setStudent(result); })
      .catch(() => { if (active) setStudent(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [registrationId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : student ? <ShieldCheck className="h-7 w-7" /> : <AlertCircle className="h-7 w-7" />}
          </div>
          <h1 className="text-2xl font-black text-emerald-950">শিক্ষার্থী রেজিস্ট্রেশন যাচাই</h1>
          <p className="mt-1 text-sm text-slate-600">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট · নবীন বরণ ২০২৬</p>
        </div>
        {loading ? (
          <p className="py-12 text-center font-semibold text-emerald-900">রেজিস্ট্রেশন তথ্য যাচাই হচ্ছে…</p>
        ) : student ? (
          <>
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-100 p-4 text-center text-emerald-900">
              <p className="font-extrabold">রেজিস্ট্রেশন রেকর্ড পাওয়া গেছে</p>
              <p className="mt-1 text-sm">আইডি: {student.id} · স্ট্যাটাস: {student.status}</p>
            </div>
            <RegistrationPass registration={student} />
          </>
        ) : (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-7 text-center text-amber-950">
            <AlertCircle className="mx-auto mb-3 h-9 w-9 text-amber-600" />
            <h2 className="text-lg font-bold">রেজিস্ট্রেশন যাচাই করা যায়নি</h2>
            <p className="mt-2 text-sm">এই QR কোডের আইডি পাওয়া যায়নি। অনুগ্রহ করে আয়োজক/রেজিস্ট্রেশন কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন।</p>
            <p className="mt-3 text-xs text-amber-800">যাচাই আইডি: {registrationId}</p>
          </div>
        )}
        <div className="mt-8 text-center">
          <a href="/" className="font-bold text-emerald-800 underline underline-offset-4">মূল ওয়েবসাইটে ফিরে যান</a>
        </div>
      </div>
    </main>
  );
};
