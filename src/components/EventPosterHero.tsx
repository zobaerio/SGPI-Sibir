import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CalendarDays, MapPin, Gift, Users } from 'lucide-react';

export const EventPosterHero: React.FC = () => {
  const registrationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#register`
    : '/#register';

  return (
    <section id="event-poster" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-lime-300/70 blur-3xl" />
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-green-400/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-emerald-100 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-gradient-to-br from-lime-100 via-white to-green-50 shadow-[0_24px_80px_rgba(22,101,52,0.16)]">
          <div className="relative px-5 pb-7 pt-8 text-center sm:px-10 sm:pt-10">
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600" />
            <p className="mx-auto max-w-3xl text-sm font-bold leading-relaxed text-rose-900 sm:text-lg">
              সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউটের ২০২৫-২০২৬ শিক্ষাবর্ষের<br className="hidden sm:block" />
              প্রথম সেমিস্টারের নবীন শিক্ষার্থীদের নিয়ে
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-indigo-950 sm:text-7xl md:text-8xl">
              নবীন বরণ
            </h1>
            <div className="mt-1 text-5xl font-black leading-none text-indigo-950 sm:text-7xl">২০২৬</div>
            <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-green-100">
                <CalendarDays className="h-7 w-7 shrink-0 text-rose-700" />
                <div><p className="text-xs text-gray-500">তারিখ ও বার</p><p className="font-extrabold text-rose-900">১২ নভেম্বর ২০২৬</p><p className="text-sm font-semibold text-green-900">রোজ বৃহস্পতিবার</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-green-100">
                <MapPin className="h-7 w-7 shrink-0 text-rose-700" />
                <div><p className="text-xs text-gray-500">অনুষ্ঠানস্থল</p><p className="font-extrabold leading-snug text-rose-900">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</p><p className="text-sm font-semibold text-green-900">সাতক্ষীরা শহর</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-green-100">
                <Gift className="h-7 w-7 shrink-0 text-rose-700" />
                <div><p className="text-xs text-gray-500">বিশেষ আকর্ষণ</p><p className="font-extrabold text-rose-900">থাকছে একগুচ্ছ উপহার।</p><p className="text-sm font-semibold text-green-900">রেজিস্ট্রেশন সম্পূর্ণ ফ্রি</p></div>
              </div>
            </div>
            <div className="mt-7 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <a href="#register" className="rounded-2xl bg-green-700 px-8 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-green-800">
                বিনামূল্যে রেজিস্ট্রেশন করুন
              </a>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-md ring-1 ring-green-100">
                <QRCodeSVG value={registrationUrl} size={88} level="H" includeMargin />
                <div className="max-w-[150px] text-left">
                  <p className="text-sm font-extrabold text-gray-900">রেজিস্ট্রেশন করতে</p>
                  <p className="text-xs leading-snug text-gray-600">QR কোড স্ক্যান করুন। এটি সরাসরি ফর্মে নিয়ে যাবে।</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-lg font-black text-rose-900 sm:text-2xl">থাকছে একগুচ্ছ উপহার।</p>
          </div>
          <div className="bg-gradient-to-r from-lime-400 via-green-500 to-green-600 px-4 py-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xl font-black text-indigo-950 sm:text-3xl">
              <Users className="h-7 w-7" /> বাংলাদেশ ইসলামী ছাত্রশিবির
            </div>
            <p className="mt-1 text-lg font-extrabold text-rose-900 sm:text-2xl">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট</p>
            <p className="text-base font-bold text-indigo-950 sm:text-xl">সাতক্ষীরা শহর</p>
          </div>
        </div>
      </div>
    </section>
  );
};
