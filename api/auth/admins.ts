type Req = { method?: string };
type Res = { setHeader(n: string, v: string): void; status(c: number): Res; json(d: unknown): void };
export default function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed' }); }
  return res.status(403).json({ message: 'নতুন এডমিন অ্যাকাউন্ট তৈরি বর্তমানে বন্ধ। সুপার এডমিনের নিরাপদ অনুমোদন প্রয়োজন।' });
}
