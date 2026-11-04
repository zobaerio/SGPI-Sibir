import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'sgpi_admin_session';
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a); const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function verifyToken(token: string, secret: string) {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  if (!safeEqual(expected, sig)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data.expires || data.expires <= Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch { return null; }
}
export function isAdminRequest(req: { headers: Record<string, string | string[] | undefined> }) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!secret || !email) return false;
  const cookie = String(req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1) || '';
  return verifyToken(cookie, secret)?.email === email;
}
export function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server environment variables are not configured.');
  return { url: url.replace(/\/$/, ''), key };
}
export async function supabaseRequest(path: string, init: RequestInit = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(url + '/rest/v1/' + path, {
    ...init,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try { message = JSON.parse(text).message || JSON.parse(text).details || text; } catch {}
    throw new Error(message || 'Database request failed');
  }
  return text ? JSON.parse(text) : null;
}
export function toStudent(row: any) {
  return {
    id: row.id, fullName: row.full_name, fatherName: row.father_name,
    motherName: row.mother_name, mobile: row.mobile, email: row.email || undefined,
    department: row.department, session: row.session, semester: row.semester,
    rollNumber: row.roll_number || undefined, photoUrl: row.photo_url || undefined,
    address: row.address, notes: row.notes || undefined, createdAt: row.created_at,
    status: row.status,
  };
}
