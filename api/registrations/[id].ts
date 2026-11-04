import { isAdminRequest, normalizeMobile, supabaseRequest, toStudent, validDepartment } from '../_lib/supabase';
type Req = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any; query: Record<string, string | string[] | undefined> };
type Res = { setHeader(n: string, v: string): void; status(c: number): Res; json(d: unknown): void };
export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (!isAdminRequest(req)) return res.status(401).json({ message: 'অনুমোদিত এডমিন লগইন প্রয়োজন।' });
  const id = String(req.query.id || '').trim().toUpperCase();
  if (!/^SGPI-2026-\d+$/.test(id)) return res.status(400).json({ message: 'সঠিক রেজিস্ট্রেশন আইডি প্রয়োজন।' });
  try {
    if (req.method === 'DELETE') {
      const rows = await supabaseRequest('sgpi_registrations?id=eq.' + encodeURIComponent(id) + '&select=id', { method: 'DELETE', headers: { Prefer: 'return=representation' } });
      if (!rows.length) return res.status(404).json({ message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
      return res.status(200).json({ success: true, id });
    }
    if (req.method === 'PUT') {
      const body = req.body || {};
      const allowed: Record<string, string> = {
        fullName: 'full_name', fatherName: 'father_name', motherName: 'mother_name',
        mobile: 'mobile', email: 'email', department: 'department', session: 'session',
        semester: 'semester', rollNumber: 'roll_number', address: 'address', notes: 'notes', photoUrl: 'photo_url',
      };
      const update: Record<string, unknown> = {};
      for (const [key, column] of Object.entries(allowed)) if (body[key] !== undefined) update[column] = body[key];
      if (update.mobile) update.mobile = normalizeMobile(update.mobile);
      if (update.mobile && !/^01[3-9]\d{8}$/.test(String(update.mobile))) return res.status(400).json({ message: 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন।' });
      if (update.department && !validDepartment(update.department)) return res.status(400).json({ message: 'বিভাগ সঠিক নয়।' });
      const rows = await supabaseRequest('sgpi_registrations?id=eq.' + encodeURIComponent(id) + '&select=*', {
        method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(update),
      });
      if (!rows.length) return res.status(404).json({ message: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
      return res.status(200).json(toStudent(rows[0]));
    }
    res.setHeader('Allow', 'PUT, DELETE');
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    if (error?.code === '23505' || String(error.message).includes('duplicate key')) return res.status(409).json({ message: 'এই মোবাইল নম্বরটি অন্য রেজিস্ট্রেশনে ব্যবহৃত হয়েছে।' });
    console.error('Registration mutation failed:', error);
    return res.status(500).json({ message: 'অনুরোধ সম্পন্ন করা যায়নি।' });
  }
}
