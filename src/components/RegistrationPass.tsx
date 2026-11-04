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
        
        <div className="relative z-10 flex h-full p-4">
          <div className="flex flex-col justify-between w-full">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/assets/chhatrashibir_logo.jpg" alt="Logo" className="h-8 w-8 object-contain"/>
                <div>
                  <h1 className="text-[14px] font-black text-red-800 uppercase">Sathkhira Govt Polytechnic</h1>
                  <p className="text-[9px] font-bold text-red-600">নবীণ বরণ ২০২৬</p>
                </div>
              </div>
              <div className="bg-red-700 text-white px-2 py-0.5 rounded font-black text-[9px] uppercase">Student ID Card</div>
            </header>

            <div className="flex items-center gap-4 mt-2">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-red-700 bg-gray-100 flex items-center justify-center">
                {registration.photoUrl
                  ? <img src={registration.photoUrl} alt={registration.fullName} className="h-full w-full object-cover"/>
                  : <GraduationCap className="h-10 w-10 text-red-700"/>}
              </div>
              <div className="flex-1 space-y-0.5">
                <h3 className="text-lg font-black text-gray-900 uppercase">{registration.fullName}</h3>
                <div className="grid grid-cols-[auto,1fr] gap-x-2 text-[10px] font-bold text-gray-700 mt-1">
                    <span className="text-red-700">ID:</span><span>{registration.id}</span>
                    <span className="text-red-700">Date:</span><span>{new Date(registration.createdAt).toLocaleDateString()}</span>
                    <span className="text-red-700">Address:</span><span>{registration.address}</span>
                </div>
              </div>
              
              <div className="shrink-0">
                  <QRCodeSVG value={`SGPI-2026-REG:${registration.id}`} size={60} level="H"/>
              </div>
            </div>
            
            <footer className="mt-2 text-center text-[10px] font-bold text-gray-500 border-t pt-1">
                This is a computer generated pass for Nobin Boron 2026.
            </footer>
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
