import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';

type FooterAdminAccessProps = { onOpenAdmin: () => void };

export function FooterAdminAccess({ onOpenAdmin }: FooterAdminAccessProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 border-t border-white/10 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-300">
        <p className="text-center sm:text-left">© ২০২৬ নবীন বরণ কমিটি, সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট। সর্বস্বত্ব সংরক্ষিত।</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-green-100 transition hover:bg-white/10 hover:text-white">
            <ArrowUp className="h-3.5 w-3.5" /> উপরে যান
          </button>
          <button type="button" onClick={onOpenAdmin} className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-300/40 bg-yellow-400/10 px-3 py-2 font-bold text-yellow-200 transition hover:bg-yellow-400 hover:text-green-950">
            <Shield className="h-3.5 w-3.5" /> Admin
          </button>
        </div>
      </div>
    </div>
  );
}
