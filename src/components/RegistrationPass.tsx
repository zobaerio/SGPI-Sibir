import React from 'react';
import { StudentRegistration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Award, Calendar, MapPin, Phone, User, CheckCircle, Printer, Download } from 'lucide-react';

interface RegistrationPassProps {
  registration: StudentRegistration;
  onClose?: () => void;
  onPrint?: () => void;
}

export const RegistrationPass: React.FC<RegistrationPassProps> = ({ registration, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto border-4 border-green-600 my-4 print:my-0 print:shadow-none print:border-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-blue-900 text-white p-6 text-center relative">
        <div className="absolute top-2 left-2 bg-yellow-400 text-green-950 text-xs font-bold px-2 py-1 rounded">
          অফিসিয়াল পাস
        </div>
        <div className="text-xs uppercase tracking-widest text-green-200 font-semibold mb-1">
          সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-300 drop-shadow">
          নবীন বরণ ২০২৬
        </h2>
        <p className="text-sm text-green-100 mt-1">
          শিক্ষাবর্ষ: ২০২৫-২০২৬ | প্রথম সেমিস্টার
        </p>
        <div className="mt-2 inline-block bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs text-yellow-200 font-medium">
          সংগঠক: বাংলাদেশ ইসলামী ছাত্রশিবির, সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট শাখা
        </div>
      </div>

      {/* Body content */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-green-50/50 to-white">
        <div className="flex flex-col md:flex-row gap-6 items-center border-b border-green-200 pb-6 mb-6">
          {/* Student Photo */}
          <div className="w-32 h-36 bg-gray-100 rounded-xl border-2 border-green-500 overflow-hidden shadow-inner flex items-center justify-center shrink-0">
            {registration.photoUrl ? (
              <img 
                src={registration.photoUrl} 
                alt={registration.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-2 text-gray-400">
                <User className="w-12 h-12 mx-auto mb-1 text-green-600" />
                <span className="text-[10px]">ছবি নেই</span>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="bg-green-700 text-white text-xs px-3 py-0.5 rounded-full font-bold">
                রেজিস্ট্রেশন আইডি: {registration.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                registration.status === 'approved' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {registration.status === 'approved' ? 'অনুমোদিত' : 'বিচারাধীন'}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {registration.fullName}
            </h3>
            <p className="text-sm font-semibold text-green-800 mb-2">
              বিভাগ: {registration.department}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
              <div><strong className="text-gray-900">পিতা:</strong> {registration.fatherName}</div>
              <div><strong className="text-gray-900">মাতা:</strong> {registration.motherName}</div>
              <div><strong className="text-gray-900">মোবাইল:</strong> {registration.mobile}</div>
              <div><strong className="text-gray-900">রোল নম্বর:</strong> {registration.rollNumber || 'প্রযোজ্য নয়'}</div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-3 rounded-xl border border-green-200 shadow-sm flex flex-col items-center shrink-0">
            <QRCodeSVG 
              value={`SGPI-2026-REG:${registration.id}:${registration.mobile}`} 
              size={90}
              level="M"
              includeMargin={false}
            />
            <span className="text-[10px] text-gray-500 mt-1 font-mono">{registration.id}</span>
          </div>
        </div>

        {/* Event Details Footer inside Pass */}
        <div className="bg-green-800 text-white rounded-xl p-4 mb-6 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-300 shrink-0" />
            <div>
              <div className="text-green-200">তারিখ ও বার</div>
              <div className="font-bold">১২ নভেম্বর ২০২৬ (বৃহস্পতিবার)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-300 shrink-0" />
            <div>
              <div className="text-green-200">ভেন্যু</div>
              <div className="font-bold">সাতক্ষীরা শহর</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-300 shrink-0" />
            <div>
              <div className="text-green-200">বিশেষ আকর্ষণ</div>
              <div className="font-bold text-yellow-300">থাকছে একগুচ্ছ উপহার।</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-xs text-gray-600 mb-6 border-t border-dashed border-gray-300 pt-4">
          <p className="font-semibold text-green-900 mb-1">অনুষ্ঠানে প্রবেশের সময় এই পাসটি (ডিজিটাল কপি বা প্রিন্ট) সাথে রাখুন।</p>
          <p>রেজিস্ট্রেশনের তারিখ: {new Date(registration.createdAt).toLocaleDateString('bn-BD')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-md"
          >
            <Printer className="w-4 h-4" /> প্রিন্ট / ডাউনলোড করুন
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2.5 rounded-xl transition"
            >
              বন্ধ করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
