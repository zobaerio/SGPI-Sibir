import React, { useState } from 'react';
import { addRegistration } from '../services/storage';
import { StudentRegistration } from '../types';
import { RegistrationPass } from './RegistrationPass';
import { User, Phone, Mail, BookOpen, Upload, CheckCircle, AlertCircle, Award, Send } from 'lucide-react';

interface RegistrationFormProps {
  onRegistrationSuccess: (reg: StudentRegistration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    mobile: '',
    email: '',
    department: 'Computer Science & Technology' as StudentRegistration['department'],
    session: '২০২৫-২০২৬',
    semester: 'প্রথম সেমিস্টার',
    rollNumber: '',
    address: '',
    notes: '',
  });

  const [photoFile, setPhotoFile] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedRegistration, setCompletedRegistration] = useState<StudentRegistration | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('ছবির সাইজ ২ মেগাবাইটের কম হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoFile(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateMobile = (mob: string) => {
    const bdMobileRegex = /^01[3-9]\d{8}$/;
    return bdMobileRegex.test(mob);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('শিক্ষার্থীর পূর্ণ নাম আবশ্যক।');
      return;
    }
    if (!formData.fatherName.trim()) {
      setError('পিতার নাম আবশ্যক।');
      return;
    }
    if (!formData.motherName.trim()) {
      setError('মাতার নাম আবশ্যক।');
      return;
    }
    if (!validateMobile(formData.mobile)) {
      setError('সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX অথবা +88017XXXXXXXX)।');
      return;
    }
    if (!formData.department) {
      setError('বিভাগ / টেকনোলজি নির্বাচন করুন।');
      return;
    }
    if (!formData.address.trim()) {
      setError('বর্তমান ঠিকানা আবশ্যক।');
      return;
    }

    setLoading(true);

    try {
      const newReg = addRegistration({
        ...formData,
        photoUrl: photoFile || undefined,
      });

      setCompletedRegistration(newReg);
      onRegistrationSuccess(newReg);
    } catch (err: any) {
      setError(err.message || 'রেজিস্ট্রেশন সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (completedRegistration) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 md:p-8 text-center mb-6 shadow-xl">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-emerald-900 mb-2">
            অভিনন্দন! আপনার রেজিস্ট্রেশন সফল হয়েছে।
          </h2>
          <p className="text-emerald-700 max-w-lg mx-auto mb-6">
            সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট নবীন বরণ ২০২৬ এর জন্য আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে। নিচে আপনার অফিসিয়াল পাস দেখতে পাচ্ছেন।
          </p>
        </div>

        <RegistrationPass 
          registration={completedRegistration} 
          onClose={() => setCompletedRegistration(null)} 
        />
      </div>
    );
  }

  return (
    <div id="registration-form" className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-blue-900 text-white p-6 md:p-8 text-center relative">
          <div className="absolute top-3 right-3 bg-yellow-400 text-green-950 text-xs font-black px-3 py-1 rounded-full shadow">
            রেজিস্ট্রেশন সম্পূর্ণ ফ্রি
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-yellow-300 mb-2">
            নবীন বরণ ২০২৬ - রেজিস্ট্রেশন ফর্ম
          </h2>
          <p className="text-green-100 text-sm md:text-base max-w-2xl mx-auto">
            সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট • ২০২৫-২০২৬ শিক্ষাবর্ষ • প্রথম সেমিস্টার
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                শিক্ষার্থীর পূর্ণ নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
                />
              </div>
            </div>

            {/* 2. Father's Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                পিতার নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="পিতার নাম লিখুন"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
                />
              </div>
            </div>

            {/* 3. Mother's Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                মাতার নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="মাতার নাম লিখুন"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
                />
              </div>
            </div>

            {/* 4. Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  maxLength={14}
                  placeholder="01XXXXXXXXX"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">বাংলাদেশি মোবাইল নম্বর দিন (এটাই আপনার পাস আইডি)</p>
            </div>

            {/* 5. Email (Optional) */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                ইমেইল <span className="text-gray-400 text-xs font-normal">(ঐচ্ছিক)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
                />
              </div>
            </div>

            {/* 6. Department / Technology */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                বিভাগ / টেকনোলজি <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
              >
                <option value="Computer Science & Technology">Computer Science & Technology</option>
                <option value="Civil Technology">Civil Technology</option>
                <option value="Electrical Technology">Electrical Technology</option>
                <option value="Mechanical Technology">Mechanical Technology</option>
                <option value="Electronics Technology">Electronics Technology</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            {/* 7. Academic Session */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                শিক্ষাবর্ষ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={formData.session}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 font-bold cursor-not-allowed"
              />
            </div>

            {/* 8. Semester */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                সেমিস্টার <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={formData.semester}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 font-bold cursor-not-allowed"
              />
            </div>

            {/* 9. Roll Number */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                রোল নম্বর <span className="text-gray-400 text-xs font-normal">(যদি বরাদ্দ হয়ে থাকে)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: ১০৫৪২১"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
              />
            </div>

            {/* 10. Student Photo */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                শিক্ষার্থীর ছবি <span className="text-gray-400 text-xs font-normal">(ঐচ্ছিক - সর্বোচ্চ ২ এমবি)</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 hover:border-green-600 rounded-xl p-2.5 text-center transition flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Upload className="w-4 h-4 text-green-700" />
                  <span>{photoFile ? 'ছবি পরিবর্তিত হয়েছে' : 'ছবি আপলোড করুন'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoFile && (
                  <div className="w-12 h-12 rounded-lg border-2 border-green-600 overflow-hidden shrink-0">
                    <img src={photoFile} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 11. Current Address */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              বর্তমান ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="আপনার বর্তমান ঠিকানা (গ্রাম, থানা, জেলা) লিখুন"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
            />
          </div>

          {/* 12. Special Notes */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              বিশেষ কোনো তথ্য <span className="text-gray-400 text-xs font-normal">(ঐচ্ছিক)</span>
            </label>
            <input
              type="text"
              placeholder="যেমন: সাংস্কৃতিক অনুষ্ঠানে অংশগ্রহণ করতে চাই বা বিশেষ কোনো জিজ্ঞাসা..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white outline-none transition font-medium"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-green-950 text-white font-black text-lg rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3 mx-auto"
            >
              <Send className="w-5 h-5 text-yellow-300" />
              {loading ? 'প্রসেসিং হচ্ছে...' : 'রেজিস্ট্রেশন সম্পন্ন করুন'}
            </button>
            <p className="text-xs text-gray-500 mt-3">
              * রেজিস্ট্রেশন সফল হওয়ার পর আপনার ডিজিটাল পাস ও আইডি নম্বর স্ক্রিনে প্রদর্শিত হবে।
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
