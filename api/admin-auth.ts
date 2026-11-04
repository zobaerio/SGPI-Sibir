import { timingSafeEqual } from 'node:crypto';
import { clearAdminCookie, createAdminCookie } from './_lib/supabase';

type Req = { method?: string; headers: Record<string, string | string[] | undefined>; body?: any };
type Res = { setHeader(n: string, v: string): void; status(c: number): Res; json(d: unknown): void };
const attempts = new Map<string, { count: number; resetAt: number }>();
function equal(a: string, b: string) {
  const x = Buffer.from(a); const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function readSession(req: Req) {
  const token = String(req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('sgpi_admin_session='))?.slice('sgpi_admin_session='.length) || '';
  const [payload, signature] = token.split('.');
  const secret = process.env.ADMIN_SESSION_SECRET;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!payload || !signature || !secret || !email) return null;
  const expected = (awaitlessHmac(payload, secret));
  if (!equal(expected, signature)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.email === email && data.expires > Math.floor(Date.now() / 1000) ? data : null;
  } catch { return null; }
}
function awaitlessHmac(payload: string, secret: string) {
  // Synchronous HMAC is provided by Node crypto.
  return createSignature(payload, secret);
}
import { createHmac } from 'node:crypto';
function createSignature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}
export default function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!adminEmail || !adminPassword || !secret) return res.status(503).json({ ok: false, message: 'Admin credentials are not configured in Vercel.' });

  if (req.method === 'GET' || req.body?.action === 'session') {
    const session = readSession(req);
    return session
      ? res.status(200).json({ ok: true, admin: { email: adminEmail, name: 'Super Admin', role: 'super_admin' } })
      : res.status(401).json({ ok: false });
  }
  if (req.body?.action === 'logout') {
    res.setHeader('Set-Cookie', clearAdminCookie);
    return res.status(200).json({ ok: true });
  }
  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const now = Date.now(); const current = attempts.get(ip);
  if (current && current.resetAt > now && current.count >= 8) return res.status(429).json({ ok: false, message: 'অনেকবার চেষ্টা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।' });
  if (!current || current.resetAt <= now) attempts.set(ip, { count: 1, resetAt: now + 900000 });
  else attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt });
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (email !== adminEmail || !equal(password, adminPassword)) return res.status(401).json({ ok: false, message: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' });
  attempts.delete(ip);
  res.setHeader('Set-Cookie', createAdminCookie(adminEmail));
  return res.status(200).json({ ok: true, admin: { email: adminEmail, name: 'Super Admin', role: 'super_admin' } });
}
