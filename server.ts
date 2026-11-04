import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(REGISTRATIONS_FILE)) {
  // Empty array - NO demo data!
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ADMINS_FILE)) {
  // Only the designated Super Admin account
  const defaultAdmins = [
    {
      email: 'zobaerhasan431@gmail.com',
      name: 'জুবায়ের হাসান (সুপার এডমিন)',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    }
  ];
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(defaultAdmins, null, 2));
}

// Helpers
function readRegistrations() {
  try {
    const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeRegistrations(data: any) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(data, null, 2));
}

function readAdmins() {
  try {
    const data = fs.readFileSync(ADMINS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeAdmins(data: any) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(data, null, 2));
}

// --- SSE Real-time Updates ---
let clients: express.Response[] = [];

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);
  console.log(`SSE Client connected. Total: ${clients.length}`);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients = clients.filter(c => c !== res);
    console.log(`SSE Client disconnected. Total: ${clients.length}`);
  });
});

function broadcastEvent(type: string, payload: any) {
  const message = `data: ${JSON.stringify({ type, payload })}\n\n`;
  clients.forEach(client => {
    try {
      client.write(message);
    } catch (e) {
      // client disconnected
    }
  });
}

// --- REST Endpoints ---

app.get('/api/health', (req, res) => {
  res.send('Server is up and running on port ' + PORT);
});

// 1. Get all registrations (For Admin or public stats)
app.get('/api/registrations', (req, res) => {
  const registrations = readRegistrations();
  res.json(registrations);
});

// 2. Submit new real registration
app.post('/api/registrations', (req, res) => {
  try {
    const body = req.body;
    const registrations = readRegistrations();

    console.log('Received registration request for:', body.fullName);

    // Validate required fields
    if (!body.fullName || !body.fatherName || !body.motherName || !body.mobile || !body.department || !body.address) {
      console.warn('Missing fields in registration body');
      return res.status(400).json({ error: 'সকল আবশ্যক তথ্য পূরণ করুন।' });
    }

    // Validate mobile format (supports 01XXXXXXXXX and +8801XXXXXXXXX / 8801XXXXXXXXX)
    const digits = String(body.mobile).replace(/\D/g, '');
    const localNumber = digits.startsWith('880') ? `0${digits.slice(3)}` : digits;
    const bdMobileRegex = /^01[3-9]\d{8}$/;
    if (!bdMobileRegex.test(localNumber)) {
      console.warn('Invalid mobile format:', localNumber);
      return res.status(400).json({ error: 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন।' });
    }

    // Check duplicate mobile
    const duplicate = registrations.find((r: any) => {
      const existingDigits = String(r.mobile).replace(/\D/g, '');
      const existingLocal = existingDigits.startsWith('880') ? `0${existingDigits.slice(3)}` : existingDigits;
      return existingLocal === localNumber;
    });
    if (duplicate) {
      console.warn('Duplicate mobile:', localNumber);
      return res.status(400).json({ error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি রেজিস্ট্রেশন সম্পন্ন হয়েছে!' });
    }

    // Generate unique Registration ID
    const nextIdNum = 1000 + registrations.length + 1;
    const newRegistration = {
      ...body,
      mobile: localNumber,
      id: `SGPI-2026-${nextIdNum}`,
      session: body.session || '২০২৬-২০২৭',
      semester: 'প্রথম সেমিস্টার',
      createdAt: new Date().toISOString(),
      status: 'approved', // Auto-approve real registrations or keep 'pending'
    };

    registrations.unshift(newRegistration);
    writeRegistrations(registrations);

    console.log('Registration successful:', newRegistration.id);

    // Broadcast real-time update to all active admins and users!
    broadcastEvent('NEW_REGISTRATION', newRegistration);

    res.status(201).json(newRegistration);
  } catch (err) {
    console.error('CRITICAL ERROR in registration handler:', err);
    res.status(500).json({ error: 'সার্ভারে অভ্যন্তরীণ ত্রুটি হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।' });
  }
});

// 3. Search registration by mobile or ID
app.get('/api/registrations/search', (req, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'অনুসন্ধানের তথ্য দিন।' });
  }

  const registrations = readRegistrations();
  const found = registrations.find((r: any) => 
    r.mobile.toLowerCase() === query || r.id.toLowerCase() === query
  );

  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: 'কোনো রেজিস্ট্রেশন পাওয়া যায়নি।' });
  }
});

// 4. Update registration status (Admin only)
app.patch('/api/registrations/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const registrations = readRegistrations();
  const index = registrations.findIndex((r: any) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
  }

  registrations[index].status = status;
  writeRegistrations(registrations);

  broadcastEvent('UPDATE_REGISTRATION', registrations[index]);
  res.json(registrations[index]);
});

// 5. Update full registration details (Admin only)
app.put('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const registrations = readRegistrations();
  const index = registrations.findIndex((r: any) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
  }

  registrations[index] = { ...registrations[index], ...updatedData };
  writeRegistrations(registrations);

  broadcastEvent('UPDATE_REGISTRATION', registrations[index]);
  res.json(registrations[index]);
});

// 6. Delete registration (Admin only)
app.delete('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  let registrations = readRegistrations();
  const exists = registrations.some((r: any) => r.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'রেজিস্ট্রেশন পাওয়া যায়নি।' });
  }

  registrations = registrations.filter((r: any) => r.id !== id);
  writeRegistrations(registrations);

  broadcastEvent('DELETE_REGISTRATION', { id });
  res.json({ success: true, id });
});

// 7. Admin Authentication (Vercel-style route in Express)
app.all('/api/admin-auth', (req, res) => {
  const { email, password, action } = req.body;
  const method = req.method;

  if (method === 'GET' || action === 'session') {
    return res.status(200).json({ ok: false, error: 'কোনো সক্রিয় সেশন নেই।' });
  }

  if (method === 'POST' && (action === 'login' || !action)) {
    if (!email || !password) {
      return res.status(400).json({ error: 'ইমেইল ও পাসওয়ার্ড উভয়ই প্রদান করুন।' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Super Admin Check
    if (cleanEmail === 'zobaerhasan431@gmail.com') {
      if (password === '1@2#3$4_5&aA') {
        const superAdminUser = {
          email: cleanEmail,
          name: 'জুবায়ের হাসান (সুপার এডমিন)',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
        };
        return res.json({ ok: true, admin: superAdminUser });
      } else {
        return res.status(401).json({ error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।' });
      }
    }

    // Other admins
    const admins = readAdmins();
    const found = admins.find((a: any) => a.email.toLowerCase() === cleanEmail);

    if (found) {
      if (password.length >= 4) {
        return res.json({ ok: true, admin: found });
      } else {
        return res.status(401).json({ error: 'ভুল পাসওয়ার্ড!' });
      }
    }

    return res.status(403).json({ error: 'এই ইমেইলটি কোনো অনুমোদিত এডমিন অ্যাকাউন্ট নয়।' });
  }

  if (action === 'logout') {
    return res.json({ ok: true });
  }

  res.status(405).end();
});

// Legacy Login Route for compatibility
app.post('/api/auth/login', (req, res) => {
  res.redirect(307, '/api/admin-auth');
});

// 8. Create new admin by Super Admin
app.post('/api/auth/admins', (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'এডমিনের নাম ও ইমেইল আবশ্যক।' });
  }

  const admins = readAdmins();
  const exists = admins.some((a: any) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'এই ইমেইল ইতিমধ্যে এডমিন হিসেবে যুক্ত আছে।' });
  }

  const newAdmin = {
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  admins.push(newAdmin);
  writeAdmins(admins);

  res.status(201).json(newAdmin);
});

// Vite Middleware for Full Stack Dev Mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is definitely running on http://0.0.0.0:${PORT}`);
    console.log(`NODE_ENV is: ${process.env.NODE_ENV}`);
  });
}

startServer();
