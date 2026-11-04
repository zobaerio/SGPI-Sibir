import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowDown, ArrowDownToLine, CalendarDays, MapPin, QrCode, Sparkles, Users } from 'lucide-react';

export const EventPosterHero: React.FC = () => {
  const registrationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#register`
    : '/#register';

  return (
    <section className="relative isolate overflow-hidden bg-[#062b20] px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#d9f99d 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center lg:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-200/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-lime-100 backdrop-blur sm:text-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            ২০২৫–২০২৬ শিক্ষাবর্ষের নবীন শিক্ষার্থীদের জন্য
          </div>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            নবীন বরণ <span className="text-lime-300">২০২৬</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-emerald-100/85 sm:text-base">
            সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউটের নবীন শিক্ষার্থীদের বরণ উপলক্ষে বর্ণাঢ্য আয়োজন
          </p>
        </div>

        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-12">
          <div className="relative mx-auto w-full max-w-[680px]">
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-lime-300/50 via-yellow-300/20 to-emerald-300/30 blur-lg" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/25 bg-white p-2 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-3">
              <img
                src="/event-poster.svg"
                alt="নবীন বরণ ২০২৬-এর মূল অনুষ্ঠান ব্যানার"
                className="block h-auto w-full rounded-xl"
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/20 bg-white/95 px-4 py-2.5 shadow-xl sm:left-7">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">বিশেষ আকর্ষণ</p>
              <p className="text-sm font-black text-rose-700 sm:text-base">থাকছে একগুচ্ছ উপহার!</p>
            </div>
          </div>

          <div className="pt-5 text-white lg:pt-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-lime-300">Welcome, Freshers</p>
            <h2 className="mt-3 text-2xl font-black leading-snug sm:text-3xl">
              তোমার নতুন পথচলা শুরু হোক আনন্দ ও সম্ভাবনায়
            </h2>
            <p className="mt-3 text-sm leading-7 text-emerald-100/80">
              অনুষ্ঠানে অংশ নিতে অনলাইনে রেজিস্ট্রেশন সম্পন্ন করো। রেজিস্ট্রেশন শেষে পাওয়া আইডি দিয়ে নিজের পাস ও স্ট্যাটাস খুঁজে নিতে পারবে।
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <span className="rounded-xl bg-lime-300/15 p-2 text-lime-300"><CalendarDays className="h-5 w-5" /></span>
                <div><p className="text-xs text-emerald-100/65">অনুষ্ঠানের তারিখ</p><p className="mt-1 text-sm font-extrabold">১২ নভেম্বর ২০২৬</p><p className="text-xs text-emerald-100/70">বৃহস্পতিবার</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <span className="rounded-xl bg-lime-300/15 p-2 text-lime-300"><MapPin className="h-5 w-5" /></span>
                <div><p className="text-xs text-emerald-100/65">অনুষ্ঠানস্থল</p><p className="mt-1 text-sm font-extrabold">সাতক্ষীরা সরকারি পলিটেকনিক</p><p className="text-xs text-emerald-100/70">সাতক্ষীরা শহর</p></div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#register" className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-300 to-yellow-300 px-6 py-4 text-sm font-black text-emerald-950 shadow-[0_12px_30px_rgba(190,242,100,0.2)] transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200/40">
                <ArrowDownToLine className="h-5 w-5" /> এখনই রেজিস্ট্রেশন করুন
              </a>
            </div>

            <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:flex-row">
              <div className="rounded-xl bg-white p-2">
                <QRCodeSVG value={registrationUrl} size={84} level="H" includeMargin />
              </div>
              <div className="text-center sm:text-left">
                <p className="flex items-center justify-center gap-2 text-sm font-extrabold text-white sm:justify-start"><QrCode className="h-4 w-4 text-lime-300" /> QR কোড স্ক্যান করো</p>
                <p className="mt-1 max-w-xs text-xs leading-6 text-emerald-100/70">মোবাইল দিয়ে স্ক্যান করলেই সরাসরি অনলাইন রেজিস্ট্রেশন ফর্মে চলে যাবে।</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-100/65 sm:justify-start">
              <Users className="h-4 w-4 text-lime-300" />
              আয়োজনে: বাংলাদেশ ইসলামী ছাত্রশিবির · সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a href="#register" className="flex items-center gap-2 text-xs font-bold text-lime-200/80 transition hover:text-white">
            রেজিস্ট্রেশন ফর্ম নিচে <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
