import { StudentRegistration, AdminUser } from '../types';

const STORAGE_KEYS = {
  REGISTRATIONS: 'sgpi_nobin_boron_2026_registrations',
  ADMINS: 'sgpi_nobin_boron_2026_admins',
  CURRENT_ADMIN: 'sgpi_nobin_boron_2026_current_admin',
};

// Local browser storage is used only as a temporary prototype store.
// Replace with Supabase + RLS before collecting real student information.
export const getStoredRegistrations = (): StudentRegistration[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading registrations', e);
    return [];
  }
};

export const saveStoredRegistrations = (registrations: StudentRegistration[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    window.dispatchEvent(new Event('sgpi_registrations_updated'));
  } catch (e) {
    console.error('Error saving registrations', e);
    throw new Error('তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।');
  }
};

const normalizeBangladeshMobile = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('880')) return `0${digits.slice(3)}`;
  return digits;
};

export const addRegistration = (newReg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>): StudentRegistration => {
  const registrations = getStoredRegistrations();
  const normalizedMobile = normalizeBangladeshMobile(newReg.mobile);
  const existing = registrations.find(r => normalizeBangladeshMobile(r.mobile) === normalizedMobile);
  if (existing) throw new Error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি রেজিস্ট্রেশন করা হয়েছে।');

  const nextIdNum = 1001 + registrations.length;
  const fullRecord: StudentRegistration = {
    ...newReg,
    mobile: normalizedMobile,
    id: `SGPI-2026-${nextIdNum}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  registrations.unshift(fullRecord);
  saveStoredRegistrations(registrations);
  return fullRecord;
};

export const updateRegistrationStatus = (id: string, status: StudentRegistration['status']) => {
  const registrations = getStoredRegistrations();
  saveStoredRegistrations(registrations.map(r => r.id === id ? { ...r, status } : r));
};

export const updateRegistration = (updatedReg: StudentRegistration) => {
  const registrations = getStoredRegistrations();
  saveStoredRegistrations(registrations.map(r => r.id === updatedReg.id ? updatedReg : r));
};

export const deleteRegistration = (id: string) => {
  const registrations = getStoredRegistrations();
  saveStoredRegistrations(registrations.filter(r => r.id !== id));
};

export const getStoredAdmins = (): AdminUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addAdminUser = (admin: AdminUser) => {
  const admins = getStoredAdmins();
  if (admins.some(a => a.email.toLowerCase() === admin.email.toLowerCase())) {
    throw new Error('এই ইমেইল ইতিমধ্যে এডমিন হিসেবে নিবন্ধিত আছে।');
  }
  admins.push(admin);
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
};

export const getCurrentAdmin = (): AdminUser | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCurrentAdmin = (admin: AdminUser | null) => {
  if (admin) localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
  else localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  window.dispatchEvent(new Event('sgpi_admin_updated'));
};
