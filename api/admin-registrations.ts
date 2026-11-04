import { isAdminRequest, supabaseRequest, toStudent } from './_lib/supabase';

type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any; query: Record<string, string | string[] | undefined> };
type VercelResponse = { setHeader(name: string, value: string): void; status(code: number): VercelResponse; json(data: unknown): void };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (!isAdminRequest(req)) return res.status(401).json({ message: 'অনুমোদিত এডমিন লগইন প্রয়োজন।' });
  try {
    if (req.method === 'GET') {
      const rows = await supabaseRequest('sgpi_registrations?select=*&order=created_at.desc&limit=5000');
      return res.status(200).json({ registrations: rows.map(toStudent) });
    }
    const id = String(req.query.id || req.body?.id || '');
    if (!id || !/^SGPI-2026-\d+$/.test(id)) return res.status(400).json({ message: 'সঠিক রেজিস্ট্রেশন আইডি প্রয়োজন।' });
    if (req.method === 'DELETE') {
      await supabaseRequest('sgpi_registrations?id=eq.' + encodeURIComponent(id), { method: 'DELETE' });
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'PATCH') {
      const body = req.body || {};
      const allowed: Record<string,string> = {
        fullName:'full_name', fatherName:'father_name', motherName:'mother_name',
        mobile:'mobile', email:'email', department:'department', session:'session',
        semester:'semester', rollNumber:'roll_number', address:'address', notes:'notes',
        photoUrl:'photo_url', status:'status',
      };
      const update: Record<string,unknown> = {};
      for (const [key, column] of Object.entries(allowed)) if (body[key] !== undefined) update[column] = body[key];
      if (update.mobile) update.mobile = String(update.mobile).replace(/\D/g,'').replace(/^880/,'0');
      if (update.status && !['pending','approved','verified'].includes(String(update.status))) return res.status(400).json({message:'Invalid status'});
      if (update.department && !['Civil Technology','Electrical Technology','Mechanical Technology','Computer Science & Technology','Electronics Technology','অন্যান্য'].includes(String(update.department))) return res.status(400).json({message:'Invalid department'});
      const rows = await supabaseRequest('sgpi_registrations?id=eq.' + encodeURIComponent(id) + '&select=*', {
        method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(update),
      });
      if (!rows.length) return res.status(404).json({message:'রেজিস্ট্রেশন পাওয়া যায়নি।'});
      return res.status(200).json({registration:toStudent(rows[0])});
    }
    res.setHeader('Allow','GET, PATCH, DELETE');
    return res.status(405).json({message:'Method not allowed'});
  } catch (error:any) {
    if (String(error.message).includes('duplicate key')) return res.status(409).json({message:'এই মোবাইল নম্বরটি অন্য রেজিস্ট্রেশনে ব্যবহৃত হয়েছে।'});
    console.error('Admin registration API failed:', error);
    return res.status(500).json({message:'ডেটাবেস অনুরোধ সম্পন্ন হয়নি।'});
  }
}
