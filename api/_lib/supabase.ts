import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'sgpi_admin_session';
const DEPARTMENTS = ['Civil Technology','Electrical Technology','Mechanical Technology','Computer Science & Technology','Electronics Technology','অন্যান্য'];

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
export function createAdminCookie(email: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured.');
  const expires = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const payload = Buffer.from(JSON.stringify({ email, expires })).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return COOKIE + '=' + payload + '.' + signature + '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800';
}
export const clearAdminCookie = COOKIE + '=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';

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
    try { const parsed = JSON.parse(text); message = parsed.message || parsed.details || text; } catch {}
    const error = new Error(message || 'Database request failed') as Error & { code?: string };
    try { error.code = JSON.parse(text).code; } catch {}
    throw error;
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
export function normalizeMobile(value: unknown) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.startsWith('880') ? '0' + digits.slice(3) : digits;
}
export function validDepartment(value: unknown) {
  return DEPARTMENTS.includes(String(value));
}
export function sendMethodNotAllowed(res: any, allow: string) {
  res.setHeader('Allow', allow);
  return res.status(405).json({ message: 'Method not allowed' });
}
