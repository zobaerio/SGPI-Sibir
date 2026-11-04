import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ArrowDownToLine } from 'lucide-react';

export const EventPosterHero: React.FC = () => {
  const registrationUrl = 'https://sgpi-sibir.vercel.app/#register';

  return (
    <section className="bg-gradient-to-b from-lime-50 via-white to-green-50 px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-[0_24px_80px_rgba(22,101,52,0.16)]">
          <img
            src="/assets/aistudio/file_0000000025f8820a970c45370e4b97c6_f2521c8e.png"
            alt="নবীন বরণ ২০২৬ — সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট"
            className="block h-auto w-full object-contain max-h-[85vh] mx-auto"
            fetchPriority="high"
          />
          <div className="flex flex-col items-center justify-center gap-5 border-t border-green-100 bg-white p-5 sm:flex-row sm:p-7">
            <a href="#register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-8 py-4 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-green-800">
              <ArrowDownToLine className="h-5 w-5" /> রেজিস্ট্রেশন ফর্ম পূরণ করুন
            </a>
            <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-100">
              <QRCodeSVG value={registrationUrl} size={88} level="H" includeMargin />
              <div className="max-w-[180px]">
                <p className="flex items-center gap-1 text-sm font-extrabold text-green-950"><QrCode className="h-4 w-4" /> QR কোড স্ক্যান করুন</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">স্ক্যান করলে সরাসরি এই ওয়েবসাইটের রেজিস্ট্রেশন ফর্মে যাবে।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
