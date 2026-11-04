type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any };
type VercelResponse = { setHeader(name: string, value: string): void; status(code: number): VercelResponse; json(data: unknown): void };
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';

const COOKIE = 'sgpi_admin_session';
const TTL = 8 * 60 * 60;
const attempts = new Map<string, { count: number; resetAt: number }>();

function equal(a: string, b: string) {
  const x = Buffer.from(a); const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function signature(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex');
}
function verify(token: string, secret: string) {
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !equal(signature(payload, secret), sig)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.expires > Math.floor(Date.now() / 1000) ? data : null;
  } catch { return null; }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ ok: false });
  const secret = process.env.ADMIN_SESSION_SECRET;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!secret || !adminEmail) return res.status(503).json({ ok: false, message: 'Admin security setup is incomplete.' });

  const token = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1) || '';
  const session = token ? verify(token, secret) : null;

  if (req.method === 'GET' || req.body?.action === 'session') {
    return session?.email === adminEmail
      ? res.status(200).json({ ok: true, admin: { email: adminEmail, name: 'Super Admin', role: 'super_admin' } })
      : res.status(401).json({ ok: false });
  }
  if (req.body?.action === 'logout') {
    res.setHeader('Set-Cookie', COOKIE + '=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
    return res.status(200).json({ ok: true });
  }

  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const now = Date.now(); const current = attempts.get(ip);
  if (current && current.resetAt > now && current.count >= 8) return res.status(429).json({ ok: false, message: 'অনেকবার চেষ্টা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।' });
  if (!current || current.resetAt <= now) attempts.set(ip, { count: 1, resetAt: now + 900000 });
  else attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt });

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const parts = (process.env.ADMIN_PASSWORD_HASH || '').split('$');
  let valid = false;
  if (parts.length === 3 && parts[0] === 'scrypt' && parts[1] && parts[2]) {
    try { valid = equal(scryptSync(password, parts[1], 64).toString('hex'), parts[2]); } catch { valid = false; }
  }
  if (email !== adminEmail || !valid) return res.status(401).json({ ok: false, message: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' });

  attempts.delete(ip);
  const expires = Math.floor(Date.now() / 1000) + TTL;
  const payload = Buffer.from(JSON.stringify({ email: adminEmail, expires })).toString('base64url');
  const signed = payload + '.' + signature(payload, secret);
  res.setHeader('Set-Cookie', COOKIE + '=' + signed + '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=' + TTL);
  return res.status(200).json({ ok: true, admin: { email: adminEmail, name: 'Super Admin', role: 'super_admin' } });
}
