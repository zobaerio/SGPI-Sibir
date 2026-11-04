import React from 'react';
import { Calendar, Clock, MapPin, Award, CheckCircle, ShieldCheck, Phone, Gift, Users } from 'lucide-react';

interface EventPosterSectionProps {
  onGotoRegister: () => void;
}

export const EventPosterSection: React.FC<EventPosterSectionProps> = ({ onGotoRegister }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-800 via-emerald-700 to-blue-900 rounded-3xl p-6 md:p-12 text-white shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-950 px-4 py-1.5 rounded-full text-sm font-extrabold mb-4 shadow">
              <Award className="w-4 h-4" /> ২০২৫-২০২৬ শিক্ষাবর্ষের নবীন বরণ
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-yellow-300 leading-tight mb-4">
              নবীন বরণ ২০২৬
            </h1>
            <p className="text-lg md:text-xl text-green-100 font-medium mb-6">
              সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউটের প্রথম সেমিস্টারের নবীন শিক্ষার্থীদের বরণ উপলক্ষে বর্ণাঢ্য আয়োজন।
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-green-200 text-xs">তারিখ ও বার</div>
                  <div className="font-bold text-white">১২ নভেম্বর ২০২৬, বৃহস্পতিবার</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-green-200 text-xs">ভেন্যু</div>
                  <div className="font-bold text-white">সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট, সাতক্ষীরা শহর</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGotoRegister}
                className="bg-yellow-400 hover:bg-yellow-500 text-green-950 font-black px-8 py-4 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                <CheckCircle className="w-5 h-5" /> এখনই রেজিস্ট্রেশন করুন
              </button>
            </div>
          </div>

          {/* Poster Image Preview */}
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-2xl shadow-2xl border-4 border-yellow-400 max-w-sm w-full transform hover:scale-[1.02] transition duration-300">
              <img 
                src="/assets/aistudio/file_0000000025f8820a970c45370e4b97c6_f2521c8e.png" 
                alt="নবীন বরণ ২০২৬ অফিশিয়াল পোস্টার" 
                className="w-full h-auto rounded-lg object-contain max-h-[500px]"
              />
              <div className="mt-3 text-center text-xs font-bold text-green-900 bg-yellow-100 py-2 rounded-lg">
                ✨ সাথে থাকছে একগুচ্ছ উপহার ✨
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Highlights & Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-800 rounded-xl">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">একগুচ্ছ উপহার</h3>
            <p className="text-sm text-gray-600">প্রত্যেক নিবন্ধিত নবীন শিক্ষার্থীর জন্য আকর্ষণীয় উপহার সামগ্রী ও স্টাডি কিট।</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-800 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">সাংস্কৃতিক অনুষ্ঠান</h3>
            <p className="text-sm text-gray-600">মনোরম সাংস্কৃতিক পরিবেশনা, ক্যারিয়ার গাইডলাইন ও কৃতি শিক্ষার্থীদের সংবর্ধনা।</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-800 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">আয়োজকবৃন্দ</h3>
            <p className="text-sm text-gray-600">বাংলাদেশ ইসলামী ছাত্রশিবির, সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট শাখা।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
