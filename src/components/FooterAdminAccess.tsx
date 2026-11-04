import React from 'react';
import { ArrowUp } from 'lucide-react';

type FooterAdminAccessProps = { onOpenAdmin: () => void };

export function FooterAdminAccess({ onOpenAdmin }: FooterAdminAccessProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 border-t border-white/10 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-300">
        <p className="text-center sm:text-left">© ২০২৬ নবীন বরণ কমিটি, সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট। সর্বস্বত্ব সংরক্ষিত।</p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-green-100 transition hover:bg-white/10 hover:text-white">
            <ArrowUp className="h-3.5 w-3.5" /> উপরে যান
          </button>
          <button type="button" onClick={onOpenAdmin} aria-label="Open admin panel" title="Admin access" className="group inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-300/70 transition group-hover:bg-yellow-300" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
