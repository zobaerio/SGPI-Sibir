import { isAdminRequest, normalizeMobile, supabaseRequest, toStudent, validDepartment } from './_lib/supabase';
type Req = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any };
type Res = { setHeader(n: string, v: string): void; status(c: number): Res; json(d: unknown): void };
export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'GET') {
    if (!isAdminRequest(req)) return res.status(401).json({ message: 'অনুমোদিত এডমিন লগইন প্রয়োজন।' });
    try {
      const rows = await supabaseRequest('sgpi_registrations?select=*&order=created_at.desc&limit=5000');
      return res.status(200).json(rows.map(toStudent));
    } catch (error) {
      console.error('Admin registrations fetch failed:', error);
      return res.status(500).json({ message: 'রেজিস্ট্রেশন তথ্য লোড করা যায়নি।' });
    }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  try {
    const body = req.body || {};
    const mobile = normalizeMobile(body.mobile);
    if (!String(body.fullName || '').trim() || !String(body.fatherName || '').trim() ||
        !String(body.motherName || '').trim() || !String(body.address || '').trim() ||
        !/^01[3-9]\d{8}$/.test(mobile) || !validDepartment(body.department)) {
      return res.status(400).json({ message: 'প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।' });
    }
    const photo = typeof body.photoUrl === 'string' ? body.photoUrl : '';
    if (photo && (!/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(photo) || photo.length > 2_800_000)) {
      return res.status(400).json({ message: 'ছবির ফাইলটি সঠিক নয় অথবা আকার বেশি।' });
    }
    const payload = {
      full_name: String(body.fullName).trim().slice(0, 120),
      father_name: String(body.fatherName).trim().slice(0, 120),
      mother_name: String(body.motherName).trim().slice(0, 120),
      mobile, email: String(body.email || '').trim().slice(0, 160) || null,
      department: body.department, session: String(body.session || '২০২৫-২০২৬').slice(0, 30),
      semester: String(body.semester || 'প্রথম সেমিস্টার').slice(0, 50),
      roll_number: String(body.rollNumber || '').trim().slice(0, 40) || null,
      photo_url: photo || null, address: String(body.address).trim().slice(0, 500),
      notes: String(body.notes || '').trim().slice(0, 500) || null,
      status: 'approved',
    };
    const rows = await supabaseRequest('sgpi_registrations?select=*', {
      method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload),
    });
    if (!rows?.length) throw new Error('Database did not return the saved registration.');
    return res.status(201).json(toStudent(rows[0]));
  } catch (error: any) {
    if (error?.code === '23505' || String(error.message).includes('sgpi_registrations_mobile_unique') || String(error.message).includes('duplicate key')) {
      return res.status(409).json({ message: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি রেজিস্ট্রেশন করা হয়েছে।' });
    }
    console.error('Registration create failed:', error);
    return res.status(500).json({ message: 'রেজিস্ট্রেশন সংরক্ষণ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।' });
  }
}
