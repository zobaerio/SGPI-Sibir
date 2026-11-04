import { normalizeMobile, supabaseRequest, toStudent } from '../_lib/supabase';
type Req = { method?: string; headers: Record<string, string | string[] | undefined>; query: Record<string, string | string[] | undefined> };
type Res = { setHeader(n: string, v: string): void; status(c: number): Res; json(d: unknown): void };
const attempts = new Map<string, { count: number; reset: number }>();
export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ message: 'Method not allowed' }); }
  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0];
  const now = Date.now(), current = attempts.get(ip);
  if (current && current.reset > now && current.count >= 20) return res.status(429).json({ message: 'অনেকবার চেষ্টা হয়েছে। পরে আবার চেষ্টা করুন।' });
  attempts.set(ip, !current || current.reset <= now ? { count: 1, reset: now + 900000 } : { ...current, count: current.count + 1 });
  const raw = String(req.query.q || '').trim();
  if (!raw) return res.status(400).json({ message: 'মোবাইল নম্বর বা রেজিস্ট্রেশন আইডি দিন।' });
  const id = raw.toUpperCase();
  const mobile = normalizeMobile(raw);
  if (!/^SGPI-2026-\d+$/.test(id) && !/^01[3-9]\d{8}$/.test(mobile)) return res.status(400).json({ message: 'সঠিক মোবাইল নম্বর অথবা রেজিস্ট্রেশন আইডি দিন।' });
  try {
    const filter = /^SGPI-2026-\d+$/.test(id) ? 'id=eq.' + encodeURIComponent(id) : 'mobile=eq.' + encodeURIComponent(mobile);
    const rows = await supabaseRequest('sgpi_registrations?select=*&' + filter + '&limit=1');
    if (!rows.length) return res.status(404).json({ message: 'কোনো রেজিস্ট্রেশন পাওয়া যায়নি।' });
    return res.status(200).json(toStudent(rows[0]));
  } catch (error) {
    console.error('Registration lookup failed:', error);
    return res.status(500).json({ message: 'এখন তথ্য যাচাই করা যাচ্ছে না।' });
  }
}
