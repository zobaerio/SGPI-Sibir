import { supabaseRequest, toStudent } from './_lib/supabase';

const departments = ['Civil Technology','Electrical Technology','Mechanical Technology','Computer Science & Technology','Electronics Technology','অন্যান্য'];
function normalizeMobile(value: string) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.startsWith('880') ? '0' + digits.slice(3) : digits;
}
type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any; query: Record<string, string | string[] | undefined> };
type VercelResponse = { setHeader(name: string, value: string): void; status(code: number): VercelResponse; json(data: unknown): void };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const body = req.body || {};
    const mobile = normalizeMobile(body.mobile);
    if (!String(body.fullName || '').trim() || !String(body.fatherName || '').trim() ||
        !String(body.motherName || '').trim() || !String(body.address || '').trim() ||
        !/^01[3-9]\d{8}$/.test(mobile) || !departments.includes(body.department)) {
      return res.status(400).json({ message: 'প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।' });
    }
    const photo = typeof body.photoUrl === 'string' ? body.photoUrl : '';
    if (photo && (!photo.startsWith('data:image/') || photo.length > 2_800_000)) {
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
    };
    const rows = await supabaseRequest('sgpi_registrations?select=*', {
      method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload),
    });
    return res.status(201).json({ registration: toStudent(rows[0]) });
  } catch (error: any) {
    if (String(error.message).includes('sgpi_registrations_mobile_unique') || String(error.message).includes('duplicate key')) {
      return res.status(409).json({ message: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি রেজিস্ট্রেশন করা হয়েছে।' });
    }
    console.error('Registration create failed:', error);
    return res.status(500).json({ message: 'রেজিস্ট্রেশন সংরক্ষণ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।' });
  }
}
