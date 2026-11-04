import { isAdminRequest, supabaseRequest, toStudent } from '../../_lib/supabase';
type Req = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any; query: Record<string, string | string[] | undefined> };
type Res = { setHeader(n: string, v: string): void; status(c: number): Res; json(d: unknown): void };
export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (!isAdminRequest(req)) return res.status(401).json({ message: 'অনুমোদিত এডমিন লগইন প্রয়োজন।' });
  if (req.method !== 'PATCH') { res.setHeader('Allow', 'PATCH'); return res.status(405).json({ message: 'Method not allowed' }); }
  const id = String(req.query.id || '').trim().toUpperCase();
  const status = String(req.body?.status || '');
  if (!/^SGPI-2026-\d+$/.test(id) || !['pending', 'approved', 'verified'].includes(status)) return res.status(400).json({ message: 'রেজিস্ট্রেশন আইডি অথবা স্ট্যাটাস সঠিক নয়।' });
  try {
    const rows = await supabaseRequest('sgpi_registrations?id=eq.' + encodeURIComponent(id) + '&select=*', {
      method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status }),
    });
    if (!rows.length) return res.status(404).json({ message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
    return res.status(200).json(toStudent(rows[0]));
  } catch (error) {
    console.error('Registration status update failed:', error);
    return res.status(500).json({ message: 'স্ট্যাটাস আপডেট করা যায়নি।' });
  }
}
