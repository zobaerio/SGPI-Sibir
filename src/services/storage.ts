import { StudentRegistration, AdminUser } from '../types';

const STORAGE_KEYS = {
  CURRENT_ADMIN: 'sgpi_nobin_boron_2026_current_admin',
};

// --- Real Server API Calls ---

export async function fetchRegistrations(): Promise<StudentRegistration[]> {
  try {
    const res = await fetch('/api/registrations');
    if (!res.ok) throw new Error('রেজিস্ট্রেশন তথ্য লোড করতে ব্যর্থ হয়েছে');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function submitRegistration(newReg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>): Promise<StudentRegistration> {
  const res = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReg),
  });

  const contentType = res.headers.get('content-type') || '';
  let data: any = {};
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else {
    const text = await res.text();
    data = { error: text || 'সার্ভার থেকে সঠিক রেসপন্স পাওয়া যায়নি।' };
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || 'রেজিস্ট্রেশন সম্পন্ন করতে সমস্যা হয়েছে।');
  }

  return data;
}

export async function searchRegistration(query: string): Promise<StudentRegistration> {
  const res = await fetch(`/api/registrations/search?q=${encodeURIComponent(query)}`);
  const contentType = res.headers.get('content-type') || '';
  let data: any = {};
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else {
    const text = await res.text();
    data = { error: text || 'সার্ভার থেকে সঠিক রেসপন্স পাওয়া যায়নি।' };
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || 'কোনো রেজিস্ট্রেশন পাওয়া যায়নি।');
  }
  return data;
}

export async function updateRegistrationStatusApi(id: string, status: StudentRegistration['status']): Promise<StudentRegistration> {
  const res = await fetch(`/api/registrations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
  return data;
}

export async function updateRegistrationApi(updatedReg: StudentRegistration): Promise<StudentRegistration> {
  const res = await fetch(`/api/registrations/${updatedReg.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedReg),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'তথ্য আপডেট ব্যর্থ হয়েছে।');
  return data;
}

export async function deleteRegistrationApi(id: string): Promise<void> {
  const res = await fetch(`/api/registrations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'রেজিস্ট্রেশন ডিলিট করতে ব্যর্থ হয়েছে।');
  }
}

export async function loginAdminApi(email: string, password: string): Promise<AdminUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'লগইন ব্যর্থ হয়েছে।');
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'এডমিন তৈরি ব্যর্থ হয়েছে।');
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

// SSE Real-time Subscription Hook
export function subscribeToRealtimeUpdates(onEvent: (type: string, payload: any) => void) {
  const eventSource = new EventSource('/api/events');

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type !== 'connected') {
        onEvent(data.type, data.payload);
      }
    } catch (err) {
      console.error('Error handling SSE message', err);
    }
  };

  eventSource.onerror = (err) => {
    console.warn('Real-time connection reconnecting...', err);
  };

  return () => {
    eventSource.close();
  };
}
