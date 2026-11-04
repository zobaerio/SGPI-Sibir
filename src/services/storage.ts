import { StudentRegistration, AdminUser } from '../types';

const STORAGE_KEYS = {
  CURRENT_ADMIN: 'sgpi_nobin_boron_2026_current_admin',
};

// --- Helpers ---
async function fetchWithTimeout(url: string, options: any = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// --- Real Server API Calls ---

export async function fetchRegistrations(): Promise<StudentRegistration[]> {
  try {
    const res = await fetchWithTimeout('/api/registrations');
    if (!res.ok) throw new Error('রেজিস্ট্রেশন তথ্য লোড করতে ব্যর্থ হয়েছে');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function submitRegistration(newReg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>): Promise<StudentRegistration> {
  const res = await fetchWithTimeout('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReg),
  });

  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।');
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || 'রেজিস্ট্রেশন সম্পন্ন করতে সমস্যা হয়েছে।');
  }

  return data;
}

export async function searchRegistration(query: string): Promise<StudentRegistration> {
  const res = await fetchWithTimeout(`/api/registrations/search?q=${encodeURIComponent(query)}`);
  
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি।');
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || 'কোনো রেজিস্ট্রেশন পাওয়া যায়নি।');
  }
  return data;
}

export async function updateRegistrationStatusApi(id: string, status: StudentRegistration['status']): Promise<StudentRegistration> {
  const res = await fetchWithTimeout(`/api/registrations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
  return data;
}

export async function updateRegistrationApi(updatedReg: StudentRegistration): Promise<StudentRegistration> {
  const res = await fetchWithTimeout(`/api/registrations/${updatedReg.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedReg),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || 'তথ্য আপডেট ব্যর্থ হয়েছে।');
  return data;
}

export async function deleteRegistrationApi(id: string): Promise<void> {
  const res = await fetchWithTimeout(`/api/registrations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || 'রেজিস্ট্রেশন ডিলিট করতে ব্যর্থ হয়েছে।');
  }
}

export async function loginAdminApi(email: string, password: string): Promise<AdminUser> {
  const res = await fetchWithTimeout('/api/admin-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || 'লগইন ব্যর্থ হয়েছে।');
  }

  setCurrentAdmin(data.admin);
  return data.admin;
}

export async function createAdminApi(email: string, name: string): Promise<AdminUser> {
  const res = await fetch('/api/auth/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || 'এডমিন তৈরি ব্যর্থ হয়েছে।');
  }
  return data;
}

// Current logged-in admin state stored locally in session/localStorage
export const getCurrentAdmin = (): AdminUser | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentAdmin = (admin: AdminUser | null) => {
  if (admin) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  }
  window.dispatchEvent(new Event('sgpi_admin_updated'));
};

// Singleton for SSE connection to avoid hitting browser connection limits (max 6)
let sharedEventSource: EventSource | null = null;
const sseListeners = new Set<(type: string, payload: any) => void>();

export function subscribeToRealtimeUpdates(onEvent: (type: string, payload: any) => void) {
  sseListeners.add(onEvent);

  if (!sharedEventSource) {
    console.log('Initializing shared SSE connection...');
    sharedEventSource = new EventSource('/api/events');

    sharedEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'connected') {
          sseListeners.forEach(listener => listener(data.type, data.payload));
        }
      } catch (err) {
        console.error('Error handling shared SSE message', err);
      }
    };

    sharedEventSource.onerror = (err) => {
      console.warn('Shared real-time connection reconnecting...', err);
      // EventSource automatically reconnects
    };
  }

  return () => {
    sseListeners.delete(onEvent);
    if (sseListeners.size === 0 && sharedEventSource) {
      sharedEventSource.close();
      sharedEventSource = null;
    }
  };
}
