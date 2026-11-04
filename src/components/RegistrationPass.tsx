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
  
  return (
    <section className="mx-auto my-7 w-full max-w-4xl px-3 sm:px-5 print:my-0 print:max-w-none print:px-0">
      <article className="event-pass visiting-card relative mx-auto aspect-[1.72/1] w-full max-w-[760px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(185,28,28,.2)] border-2 border-red-700">
        {/* Red decorative waves */}
        <div className="absolute top-0 right-0 h-24 w-64 bg-red-700 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 h-24 w-64 bg-red-700 rounded-tr-full" />
        
        <div className="relative z-10 flex h-full flex-col p-4">
          {/* Header */}
          <header className="flex items-center justify-between border-b-2 border-red-700 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <img src="/assets/chhatrashibir_logo.jpg" alt="Logo" className="h-10 w-10 object-contain"/>
              <School className="h-8 w-8 text-red-700"/>
              <div className="text-left">
                <p className="text-[10px] font-black text-red-900 uppercase">Sathkhira Govt Polytechnic</p>
                <p className="text-xs font-black text-red-700">UNIVERSITY NAME</p>
              </div>
            </div>
            <div className="bg-red-700 text-white px-4 py-1 rounded font-black text-sm tracking-wider">STUDENT ID CARD</div>
          </header>

          {/* Body */}
          <div className="flex flex-1 items-center gap-6">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-red-700 bg-red-50 flex items-center justify-center">
              {registration.photoUrl
                ? <img src={registration.photoUrl} alt={registration.fullName} className="h-full w-full object-cover"/>
                : <GraduationCap className="h-16 w-16 text-red-700"/>}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-black text-red-800 uppercase">{registration.fullName}</h3>
              <p className="text-sm font-bold text-gray-800"><span className="text-red-700 font-black">Student Id : </span> {registration.id}</p>
              <p className="text-sm font-bold text-gray-800"><span className="text-red-700 font-black">Date : </span> {new Date(registration.createdAt).toLocaleDateString()}</p>
              <p className="text-sm font-bold text-gray-800"><span className="text-red-700 font-black">Adress : </span> {registration.address}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end">
            <div className="bg-white p-1 rounded-sm shadow-sm">
                <QRCodeSVG value={`SGPI-2026-REG:${registration.id}`} size={80} level="H"/>
            </div>
          </div>
        </div>
      </article>

      <div className="no-print mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-800"><Printer className="h-4 w-4"/> শুধু কার্ড ডাউনলোড / PDF</button>
        {onClose && <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"><X className="h-4 w-4"/> বন্ধ করুন</button>}
      </div>
    </section>
  );
};
