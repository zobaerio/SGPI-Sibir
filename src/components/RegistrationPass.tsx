import React from 'react';
import { StudentRegistration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, GraduationCap } from 'lucide-react';

interface RegistrationPassProps {
  registration: StudentRegistration;
  onClose?: () => void;
  onPrint?: () => void;
}

export const RegistrationPass: React.FC<RegistrationPassProps> = ({ registration, onClose, onPrint }) => {
  const handlePrint = () => {
    onPrint?.();
    window.print();
  };

  const registrationDate = new Date(registration.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <section className="mx-auto my-7 w-full max-w-4xl px-3 sm:px-5 print:my-0 print:max-w-none print:px-0">
      <article className="event-pass visiting-card relative mx-auto aspect-[1.72/1] w-full max-w-[760px] overflow-hidden rounded-xl border border-emerald-700/30 bg-white shadow-[0_22px_65px_rgba(5,100,85,.18)] print:rounded-none print:shadow-none">
        {/* Layered emerald and blue corner ribbons */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-28 w-[48%] rounded-bl-[5rem] bg-gradient-to-r from-emerald-700 via-teal-600 to-blue-700" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-7 -top-7 h-20 w-[43%] rounded-bl-[4.5rem] border-b-[3px] border-l-[3px] border-white/90" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-[48%] rounded-tr-[5rem] bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-700" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-7 -left-7 h-20 w-[43%] rounded-tr-[4.5rem] border-r-[3px] border-t-[3px] border-white/90" />

        <div className="relative z-10 flex h-full flex-col px-4 py-3 sm:px-6 sm:py-4">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[clamp(9px,1.55vw,15px)] font-black uppercase tracking-wide text-emerald-900">
                Sathkhira Govt. Polytechnic Institute
              </h1>
              <p className="mt-0.5 text-[clamp(7px,1vw,10px)] font-bold text-slate-600">
                নবীন বরণ ২০২৬ · শিক্ষাবর্ষ ২০২৬-২০২৭
              </p>
            </div>
            <img
              src="/assets/chhatrashibir_logo.jpg"
              alt="বাংলাদেশ ইসলামী ছাত্রশিবিরের লোগো"
              className="h-8 w-8 shrink-0 rounded-full bg-white/90 object-contain p-0.5 sm:h-10 sm:w-10"
            />
          </header>

          <div className="my-auto flex min-h-0 items-center gap-3 sm:gap-5">
            <div className="h-[clamp(66px,13vw,118px)] w-[clamp(66px,13vw,118px)] shrink-0 overflow-hidden rounded-full border-[3px] border-emerald-700 bg-emerald-50 shadow-sm sm:border-4">
              {registration.photoUrl ? (
                <img src={registration.photoUrl} alt={registration.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <GraduationCap className="h-1/2 w-1/2 text-emerald-700" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1.5 inline-flex rounded-sm bg-gradient-to-r from-emerald-700 to-blue-700 px-3 py-1 text-[clamp(9px,1.6vw,16px)] font-black uppercase tracking-wider text-white shadow-sm">
                Student ID Card
              </div>
              <h2 className="truncate text-[clamp(12px,2.1vw,21px)] font-black uppercase leading-tight text-emerald-800">
                {registration.fullName}
              </h2>
              <div className="mt-1.5 grid grid-cols-[auto,1fr] gap-x-2 gap-y-0.5 text-[clamp(8px,1.25vw,12px)] font-semibold leading-snug text-slate-800">
                <span className="text-emerald-800">Student ID</span><span className="truncate">{registration.id}</span>
                <span className="text-emerald-800">Date</span><span>{registrationDate}</span>
                <span className="text-emerald-800">Session</span><span>{registration.session || "২০২৬-২০২৭"}</span>
                <span className="text-emerald-800">Address</span><span className="line-clamp-2">{registration.address}</span>
              </div>
            </div>

            <div className="hidden shrink-0 self-end rounded-md bg-white p-1 shadow-sm sm:block">
              <QRCodeSVG value={`SGPI-2026-REG:${registration.id}`} size={76} level="H" includeMargin />
            </div>
          </div>

          <footer className="relative z-10 flex items-end justify-between gap-2 border-t border-emerald-100 pt-1.5">
            <p className="text-[clamp(6px,.85vw,9px)] font-semibold text-slate-500">
              Computer-generated student registration identity card
            </p>
            <div className="rounded bg-white/95 p-0.5 shadow-sm sm:hidden">
              <QRCodeSVG value={`SGPI-2026-REG:${registration.id}`} size={42} level="H" />
            </div>
            <span className="text-[clamp(7px,1vw,10px)] font-extrabold tracking-wide text-blue-800">SGPI · 2026</span>
          </footer>
        </div>
      </article>

      <div className="no-print mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-blue-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5">
          <Printer className="h-4 w-4" /> শুধু কার্ড ডাউনলোড / PDF
        </button>
        {onClose && (
          <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
            <X className="h-4 w-4" /> বন্ধ করুন
          </button>
        )}
      </div>
    </section>
  );
};
