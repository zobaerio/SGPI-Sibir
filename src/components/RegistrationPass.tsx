import React from 'react';
import { StudentRegistration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  CalendarDays, MapPin, Phone, UserRound, Printer, X,
  ShieldCheck, GraduationCap, Sparkles, Hash, BadgeCheck
} from 'lucide-react';

interface RegistrationPassProps {
  registration: StudentRegistration;
  onClose?: () => void;
  onPrint?: () => void;
}

const departmentLabels: Record<string, string> = {
  'Civil Technology': 'সিভিল টেকনোলজি',
  'Electrical Technology': 'ইলেকট্রিক্যাল টেকনোলজি',
  'Mechanical Technology': 'মেকানিক্যাল টেকনোলজি',
  'Computer Science & Technology': 'কম্পিউটার সায়েন্স অ্যান্ড টেকনোলজি',
  'Electronics Technology': 'ইলেকট্রনিক্স টেকনোলজি',
  'অন্যান্য': 'অন্যান্য',
};

export const RegistrationPass: React.FC<RegistrationPassProps> = ({ registration, onClose, onPrint }) => {
  const handlePrint = () => {
    onPrint?.();
    window.print();
  };

  const approved = registration.status === 'approved';
  const qrPayload = `SGPI-2026-REG:${registration.id}`;

  return (
    <section className="mx-auto my-6 w-full max-w-6xl px-3 sm:px-5 print:my-0 print:max-w-none print:px-0">
      <article className="event-pass relative isolate overflow-hidden rounded-[26px] border border-emerald-200/90 bg-white shadow-[0_28px_90px_rgba(6,78,59,0.18)] print:rounded-[18px] print:border-2 print:border-emerald-800 print:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border-[34px] border-emerald-50/90" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-72 w-72 rounded-full border-[28px] border-lime-50/90" />

        <header className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-800 px-5 py-5 text-white sm:px-8 sm:py-6">
          <div className="pointer-events-none absolute -right-5 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-200/60 bg-gradient-to-br from-yellow-200 to-amber-400 text-emerald-950 shadow-lg">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-wide text-emerald-100 sm:text-sm">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</p>
                <h2 className="mt-0.5 text-2xl font-black tracking-tight text-white sm:text-3xl">নবীন বরণ ২০২৬</h2>
                <p className="mt-1 text-xs font-medium text-emerald-100 sm:text-sm">২০২৫-২০২৬ শিক্ষাবর্ষ <span className="px-1 text-emerald-300">•</span> প্রথম সেমিস্টার</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <span className="rounded-full border border-yellow-200/60 bg-yellow-300 px-4 py-2 text-[10px] font-black tracking-[0.16em] text-emerald-950 shadow-lg sm:text-xs">
                OFFICIAL ENTRY PASS
              </span>
              <span className="text-[10px] font-semibold text-emerald-100 sm:text-xs">বাংলাদেশ ইসলামী ছাত্রশিবির • সাতক্ষীরা শহর</span>
            </div>
          </div>
        </header>

        <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_172px] sm:gap-6 sm:p-6 lg:p-7">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold text-emerald-950">
                <Hash className="h-3.5 w-3.5" /> {registration.id}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-extrabold ring-1 ${approved ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-amber-50 text-amber-800 ring-amber-200'}`}>
                <BadgeCheck className="h-3.5 w-3.5" /> {approved ? 'অনুমোদিত' : 'রেজিস্ট্রেশন সম্পন্ন'}
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative h-36 w-32 shrink-0 self-center overflow-hidden rounded-2xl border-[3px] border-white bg-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.16)] ring-1 ring-emerald-200 sm:h-40 sm:w-32 sm:self-start">
                {registration.photoUrl ? (
                  <img src={registration.photoUrl} alt={registration.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-emerald-700">
                    <UserRound className="h-12 w-12" />
                    <span className="mt-2 text-[10px] font-bold">শিক্ষার্থীর ছবি</span>
                  </div>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-emerald-950/85 py-1 text-center text-[9px] font-bold tracking-wider text-white">STUDENT</span>
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Registered Student</p>
                <h3 className="mt-1 break-words text-2xl font-black leading-tight text-slate-950 sm:text-[28px]">{registration.fullName}</h3>
                <p className="mt-2 inline-flex max-w-full items-center rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-900">
                  <GraduationCap className="mr-1.5 h-4 w-4 shrink-0" />
                  {departmentLabels[registration.department] || registration.department}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 text-left sm:grid-cols-2">
                  <div className="min-w-0 border-l-2 border-emerald-200 pl-3">
                    <p className="text-[10px] font-bold text-slate-400">পিতার নাম</p>
                    <p className="break-words text-sm font-bold text-slate-800">{registration.fatherName}</p>
                  </div>
                  <div className="min-w-0 border-l-2 border-emerald-200 pl-3">
                    <p className="text-[10px] font-bold text-slate-400">মাতার নাম</p>
                    <p className="break-words text-sm font-bold text-slate-800">{registration.motherName}</p>
                  </div>
                  <div className="border-l-2 border-emerald-200 pl-3">
                    <p className="text-[10px] font-bold text-slate-400">মোবাইল নম্বর</p>
                    <p className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800"><Phone className="h-3.5 w-3.5 text-emerald-700" />{registration.mobile}</p>
                  </div>
                  <div className="border-l-2 border-emerald-200 pl-3">
                    <p className="text-[10px] font-bold text-slate-400">রোল নম্বর</p>
                    <p className="text-sm font-bold text-slate-800">{registration.rollNumber || 'উল্লেখ করা হয়নি'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-row items-center justify-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-slate-50 p-3 text-center sm:flex-col sm:gap-2 sm:p-4">
            <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <QRCodeSVG value={qrPayload} size={116} level="H" includeMargin />
            </div>
            <div className="min-w-0 text-left sm:text-center">
              <p className="text-[11px] font-black tracking-wider text-slate-900">QR PASS CODE</p>
              <p className="mt-1 break-all font-mono text-[10px] text-slate-500">{registration.id}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-600">প্রবেশের সময় QR কোডটি প্রদর্শন করুন</p>
            </div>
          </aside>
        </div>

        <footer className="relative grid gap-3 border-t border-emerald-100 bg-emerald-50/90 px-5 py-4 sm:grid-cols-3 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><CalendarDays className="h-4 w-4" /></span>
            <div><p className="text-[9px] font-bold text-slate-500">অনুষ্ঠানের তারিখ</p><p className="text-xs font-extrabold text-slate-900">১২ নভেম্বর ২০২৬ • বৃহস্পতিবার</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><MapPin className="h-4 w-4" /></span>
            <div><p className="text-[9px] font-bold text-slate-500">অনুষ্ঠানের স্থান</p><p className="text-xs font-extrabold text-slate-900">সাতক্ষীরা সরকারি পলিটেকনিক</p><p className="text-[10px] text-slate-600">সাতক্ষীরা শহর</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><Sparkles className="h-4 w-4" /></span>
            <div><p className="text-[9px] font-bold text-slate-500">বিশেষ আকর্ষণ</p><p className="text-xs font-extrabold text-emerald-900">থাকছে একগুচ্ছ উপহার।</p></div>
          </div>
        </footer>

        <div className="flex flex-col gap-2 border-t border-emerald-100 px-5 py-3 text-center sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-[9px] leading-relaxed text-slate-500">রেজিস্ট্রেশনের তারিখ: {new Date(registration.createdAt).toLocaleDateString('bn-BD')} • পাসটি প্রবেশের সময় প্রদর্শন করুন।</p>
          <p className="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-800"><ShieldCheck className="h-3 w-3" /> ব্যক্তিগত পাস • QR-এ শুধু Registration ID</p>
        </div>
      </article>

      <div className="no-print mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-900">
          <Printer className="h-4 w-4" /> প্রিন্ট / PDF ডাউনলোড
        </button>
        {onClose && <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"><X className="h-4 w-4" /> বন্ধ করুন</button>}
      </div>
    </section>
  );
};
