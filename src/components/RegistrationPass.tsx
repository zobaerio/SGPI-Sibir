import React from 'react';
import { StudentRegistration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  CalendarDays, MapPin, Phone, UserRound, Printer, X,
  ShieldCheck, GraduationCap, Sparkles, Hash, BadgeCheck, School, IdCard
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
  const handlePrint = () => { onPrint?.(); window.print(); };
  const approved = registration.status === 'approved';
  // Keep this payload stable: existing QR scanners depend on this exact format.
  const qrPayload = `SGPI-2026-REG:${registration.id}`;

  return (
    <section className="mx-auto my-7 w-full max-w-6xl px-3 sm:px-5 print:my-0 print:max-w-none print:px-0">
      <article className="event-pass relative isolate overflow-hidden rounded-[30px] border border-emerald-200 bg-white shadow-[0_30px_100px_rgba(6,78,59,.20)] print:rounded-2xl print:border-2 print:border-emerald-900 print:shadow-none">
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border-[34px] border-emerald-50"/>
        <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full border-[30px] border-amber-50"/>
        <header className="relative overflow-hidden bg-[#062f2b] px-5 py-6 text-white sm:px-9 sm:py-7">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 85% 15%, #facc15 0, transparent 25%), radial-gradient(circle at 10% 100%, #34d399 0, transparent 30%)'}}/>
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-200 to-yellow-500 text-emerald-950 shadow-xl">
                <School className="h-9 w-9"/>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[.12em] text-emerald-100 sm:text-sm">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">নবীন বরণ ২০২৬</h2>
                <p className="mt-1 text-xs font-semibold text-emerald-100 sm:text-sm">শিক্ষার্থী প্রবেশপত্র • ২০২৫–২০২৬ শিক্ষাবর্ষ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur">
                <p className="text-[9px] font-black tracking-[.22em] text-amber-200">OFFICIAL</p>
                <p className="text-sm font-black">STUDENT PASS</p>
                <p className="text-[10px] text-emerald-100">FIRST SEMESTER</p>
              </div>
            </div>
          </div>
          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4 text-[10px] font-semibold text-emerald-100 sm:text-xs">
            <span>বাংলাদেশ ইসলামী ছাত্রশিবির • সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</span>
            <span className="rounded-full bg-amber-300 px-3 py-1 font-black text-emerald-950">১২ নভেম্বর ২০২৬ • বৃহস্পতিবার</span>
          </div>
        </header>

        <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:gap-7 sm:p-7 lg:p-8">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 font-mono text-[11px] font-black text-white"><Hash className="h-3.5 w-3.5 text-amber-300"/>{registration.id}</span>
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-black ${approved ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}><BadgeCheck className="h-3.5 w-3.5"/>{approved ? 'অনুমোদিত' : 'রেজিস্ট্রেশন সম্পন্ন'}</span>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative h-40 w-32 shrink-0 self-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-xl ring-1 ring-emerald-200 sm:h-44 sm:w-36 sm:self-start">
                {registration.photoUrl ? <img src={registration.photoUrl} alt={registration.fullName} className="h-full w-full object-cover"/> : <div className="flex h-full flex-col items-center justify-center text-emerald-800"><UserRound className="h-14 w-14"/><span className="mt-2 text-[10px] font-bold">শিক্ষার্থীর ছবি</span></div>}
                <span className="absolute inset-x-0 bottom-0 bg-emerald-950/90 py-1.5 text-center text-[9px] font-black tracking-[.2em] text-white">STUDENT</span>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-[.24em] text-emerald-700">Registered Student</p>
                <h3 className="mt-1 break-words text-2xl font-black leading-tight text-slate-950 sm:text-[32px]">{registration.fullName}</h3>
                <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-950"><GraduationCap className="h-4 w-4 shrink-0"/>{departmentLabels[registration.department] || registration.department}</div>
                <div className="mt-5 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[9px] font-bold text-slate-400">পিতার নাম</p><p className="break-words text-sm font-bold text-slate-800">{registration.fatherName}</p></div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[9px] font-bold text-slate-400">মাতার নাম</p><p className="break-words text-sm font-bold text-slate-800">{registration.motherName}</p></div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[9px] font-bold text-slate-400">মোবাইল নম্বর</p><p className="flex items-center gap-1.5 text-sm font-bold text-slate-800"><Phone className="h-3.5 w-3.5 text-emerald-700"/>{registration.mobile}</p></div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"><p className="text-[9px] font-bold text-slate-400">রোল নম্বর</p><p className="text-sm font-bold text-slate-800">{registration.rollNumber || 'উল্লেখ করা হয়নি'}</p></div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-row items-center justify-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 sm:flex-col sm:gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-md"><QRCodeSVG value={qrPayload} size={128} level="H" includeMargin/></div>
            <div className="min-w-0 text-left sm:text-center">
              <div className="inline-flex items-center gap-1 text-[11px] font-black tracking-wider text-slate-900"><IdCard className="h-3.5 w-3.5 text-emerald-700"/> QR ENTRY CODE</div>
              <p className="mt-1 break-all font-mono text-[10px] text-slate-500">{registration.id}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-600">প্রবেশের সময় QR কোডটি স্ক্যান করান।</p>
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-emerald-800 ring-1 ring-emerald-100"><ShieldCheck className="h-3 w-3"/> Verified ID</p>
            </div>
          </aside>
        </div>

        <footer className="grid gap-3 border-t border-emerald-100 bg-[#f3faf6] px-5 py-4 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><CalendarDays className="h-4 w-4"/></span><div><p className="text-[9px] font-bold text-slate-500">অনুষ্ঠানের তারিখ</p><p className="text-xs font-extrabold text-slate-900">১২ নভেম্বর ২০২৬ • বৃহস্পতিবার</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><MapPin className="h-4 w-4"/></span><div><p className="text-[9px] font-bold text-slate-500">অনুষ্ঠানের স্থান</p><p className="text-xs font-extrabold text-slate-900">সাতক্ষীরা সরকারি পলিটেকনিক</p><p className="text-[10px] text-slate-600">সাতক্ষীরা শহর</p></div></div>
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><Sparkles className="h-4 w-4"/></span><div><p className="text-[9px] font-bold text-slate-500">বিশেষ আকর্ষণ</p><p className="text-xs font-extrabold text-emerald-900">থাকছে একগুচ্ছ উপহার।</p></div></div>
        </footer>
        <div className="flex flex-col gap-2 border-t border-emerald-100 px-5 py-3 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8"><p className="text-[9px] text-slate-500">রেজিস্ট্রেশনের তারিখ: {new Date(registration.createdAt).toLocaleDateString('bn-BD')} • প্রবেশের সময় পাসটি প্রদর্শন করুন।</p><p className="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-800"><ShieldCheck className="h-3 w-3"/> QR-এ শুধু Registration ID সংরক্ষিত</p></div>
      </article>

      <div className="no-print mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-900"><Printer className="h-4 w-4"/> প্রিন্ট / PDF ডাউনলোড</button>
        {onClose && <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"><X className="h-4 w-4"/> বন্ধ করুন</button>}
      </div>
    </section>
  );
};
