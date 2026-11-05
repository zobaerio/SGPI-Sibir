// Vercel serverless function fallback handler
export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const body = req.body || {};
    const nextNum = 1000 + Math.floor(Math.random() * 9000);
    const id = body.id || `SGPI-2026-${nextNum}`;
    const result = {
      ...body,
      id,
      session: body.session || '২০২৬-২০২৭',
      semester: body.semester || 'প্রথম সেমিস্টার',
      status: body.status || 'approved',
      createdAt: body.createdAt || new Date().toISOString(),
    };
    return res.status(201).json(result);
  }

  res.status(200).json({ ok: true, message: 'Registrations API ready' });
}
