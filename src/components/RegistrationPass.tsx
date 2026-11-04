import React from 'react';
import { StudentRegistration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { CalendarDays, MapPin, Printer, X, ShieldCheck, GraduationCap, School, Hash } from 'lucide-react';

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
  // Keep the QR payload stable for existing registration verification workflows.
  const qrPayload = `SGPI-2026-REG:${registration.id}`;

  return (
    <section className="mx-auto my-7 w-full max-w-4xl px-3 sm:px-5 print:my-0 print:max-w-none print:px-0">
      <article className="event-pass visiting-card relative mx-auto grid aspect-[1.72/1] w-full max-w-[760px] grid-cols-[1fr_30%] overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-[0_24px_70px_rgba(6,78,59,.2)]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border-[22px] border-emerald-50"/>
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full border-[22px] border-amber-50"/>
        <div className="relative z-10 flex min-w-0 flex-col p-[3.2%]">
          <header className="flex items-center gap-3 border-b border-emerald-100 pb-[2.2%]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-yellow-500 text-emerald-950 shadow"><School className="h-6 w-6"/></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[clamp(8px,1.35vw,14px)] font-black text-emerald-950">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</p>
              <h2 className="truncate text-[clamp(13px,2.2vw,23px)] font-black leading-tight text-emerald-800">নবীন বরণ ২০২৬</h2>
            </div>
            <span className="shrink-0 rounded-md bg-emerald-900 px-2 py-1 text-[clamp(6px,.85vw,9px)] font-black tracking-wider text-amber-200">STUDENT CARD</span>
          </header>

          <div className="relative z-10 flex min-h-0 flex-1 items-center gap-[3%] py-[2.5%]">
            <div className="h-[76%] max-h-28 aspect-[3/4] shrink-0 overflow-hidden rounded-lg border-2 border-white bg-emerald-50 shadow-md ring-1 ring-emerald-200">
              {registration.photoUrl
                ? <img src={registration.photoUrl} alt={registration.fullName} className="h-full w-full object-cover"/>
                : <div className="flex h-full items-center justify-center text-emerald-700"><GraduationCap className="h-9 w-9"/></div>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[clamp(6px,.8vw,9px)] font-black uppercase tracking-[.18em] text-emerald-700">Registered Student</p>
              <h3 className="mt-1 line-clamp-2 break-words text-[clamp(12px,2.15vw,22px)] font-black leading-tight text-slate-950">{registration.fullName}</h3>
              <p className="mt-1 truncate text-[clamp(8px,1.15vw,12px)] font-extrabold text-emerald-800">{departmentLabels[registration.department] || registration.department}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-2 py-1 font-mono text-[clamp(7px,.9vw,10px)] font-bold text-white"><Hash className="h-3 w-3 text-amber-300"/>{registration.id}</span>
                <span className={`rounded-md px-2 py-1 text-[clamp(7px,.85vw,9px)] font-black ${approved ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>{approved ? 'APPROVED' : 'REGISTERED'}</span>
              </div>
              <p className="mt-2 truncate text-[clamp(7px,.9vw,10px)] font-semibold text-slate-600">শিক্ষাবর্ষ: {registration.session || '২০২৫–২০২৬'} • {registration.semester || 'প্রথম সেমিস্টার'}</p>
            </div>
          </div>

          <footer className="relative z-10 flex items-center justify-between gap-2 border-t border-emerald-100 pt-[2%]">
            <div className="min-w-0">
              <p className="text-[clamp(7px,.9vw,10px)] font-black text-emerald-950">১২ নভেম্বর ২০২৬ • বৃহস্পতিবার</p>
              <p className="truncate text-[clamp(6px,.78vw,9px)] font-semibold text-slate-500">বাংলাদেশ ইসলামী ছাত্রশিবির • এসপিআই</p>
            </div>
            <p className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[clamp(6px,.75vw,8px)] font-black text-amber-900">থাকছে একগুচ্ছ উপহার</p>
          </footer>
        </div>

        <aside className="relative z-10 flex flex-col items-center justify-center gap-2 border-l border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-[5%]">
          <div className="rounded-lg border border-emerald-100 bg-white p-1.5 shadow-sm"><QRCodeSVG value={qrPayload} size={112} level="H" includeMargin/></div>
          <p className="text-center text-[clamp(7px,.9vw,10px)] font-black tracking-wider text-emerald-950">SCAN TO VERIFY</p>
          <p className="break-all text-center font-mono text-[clamp(6px,.7vw,8px)] text-slate-500">{registration.id}</p>
          <span className="inline-flex items-center gap-1 text-[clamp(6px,.7vw,8px)] font-bold text-emerald-800"><ShieldCheck className="h-3 w-3"/>{approved ? 'Approved ID' : 'Registration ID'}</span>
        </aside>
      </article>

      <div className="no-print mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-900"><Printer className="h-4 w-4"/> শুধু কার্ড ডাউনলোড / PDF</button>
        {onClose && <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"><X className="h-4 w-4"/> বন্ধ করুন</button>}
      </div>
    </section>
  );
};
