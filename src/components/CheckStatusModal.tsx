import React, { useState } from 'react';
import { StudentRegistration } from '../types';
import { RegistrationPass } from './RegistrationPass';
import { Search, Phone, QrCode, ArrowLeft, AlertCircle } from 'lucide-react';

interface CheckStatusModalProps { onBack: () => void; }
export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({ onBack }) => {
  const [id,setId]=useState('');
  const [mobile,setMobile]=useState('');
  const [loading,setLoading]=useState(false);
  const [searched,setSearched]=useState(false);
  const [foundStudent,setFoundStudent]=useState<StudentRegistration|null>(null);
  const [error,setError]=useState('');
  const handleSearch=async(e:React.FormEvent)=>{
    e.preventDefault(); setError(''); setSearched(false); setFoundStudent(null);
    if(!id.trim()||!mobile.trim()){setError('রেজিস্ট্রেশন আইডি ও মোবাইল নম্বর দুটোই লিখুন।');return;}
    setLoading(true);
    try{
      const response=await fetch('/api/registration-lookup',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({id,mobile})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.message||'তথ্য পাওয়া যায়নি।');
      setFoundStudent(data.registration);setSearched(true);
    }catch(e:any){setFoundStudent(null);setSearched(true);setError(e.message||'তথ্য যাচাই করা যায়নি।');}
    finally{setLoading(false);}
  };
  return <div className="max-w-3xl mx-auto px-4 py-8">
    <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-green-800 hover:text-green-950 font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-green-200 transition"><ArrowLeft className="w-4 h-4"/> হোম পেজে ফিরে যান</button>
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-green-100 mb-8">
      <div className="text-center mb-6"><div className="w-12 h-12 bg-green-100 text-green-800 rounded-2xl flex items-center justify-center mx-auto mb-3"><QrCode className="w-6 h-6"/></div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">রেজিস্ট্রেশন নম্বর সার্চ করুন</h2>
        <p className="text-sm text-gray-600">আপনার রেজিস্ট্রেশন আইডি ও রেজিস্ট্রেশনের সময় দেওয়া মোবাইল নম্বর দিয়ে পাস খুঁজে নিন। নিরাপত্তার জন্য দুটি তথ্যই প্রয়োজন।</p></div>
      <form onSubmit={handleSearch} className="space-y-3" role="search">
        <label className="block text-sm font-bold text-gray-700">রেজিস্ট্রেশন আইডি</label>
        <input value={id} onChange={e=>setId(e.target.value.toUpperCase())} autoComplete="off" spellCheck={false} placeholder="SGPI-2026-1001" aria-label="রেজিস্ট্রেশন আইডি" className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none font-medium"/>
        <label className="block text-sm font-bold text-gray-700">মোবাইল নম্বর</label>
        <div className="relative"><Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400"/><input value={mobile} onChange={e=>setMobile(e.target.value.replace(/[^\d+]/g,''))} type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-label="রেজিস্ট্রেশনের মোবাইল নম্বর" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none font-medium"/></div>
        <button disabled={loading} type="submit" className="w-full px-8 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"><Search className="w-5 h-5"/>{loading?'খোঁজা হচ্ছে…':'সার্চ করুন'}</button>
      </form>
      {error&&<p role="alert" className="text-red-600 text-sm mt-3 flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</p>}
    </div>
    {searched&&foundStudent&&<RegistrationPass registration={foundStudent}/>}
  </div>;
};
