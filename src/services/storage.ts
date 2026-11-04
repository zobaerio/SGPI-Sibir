import { StudentRegistration, AdminUser } from '../types';

const STORAGE_KEYS = {
  REGISTRATIONS: 'sgpi_nobin_boron_2026_registrations',
  ADMINS: 'sgpi_nobin_boron_2026_admins',
  CURRENT_ADMIN: 'sgpi_nobin_boron_2026_current_admin',
};

// Initial seeded registrations for demonstration and immediate testing
const INITIAL_REGISTRATIONS: StudentRegistration[] = [
  {
    id: 'SGPI-2026-1001',
    fullName: 'আরিফ হোসেন',
    fatherName: 'রফিকুল ইসলাম',
    motherName: 'ফাতেমা বেগম',
    mobile: '01712345678',
    email: 'arif.cst26@gmail.com',
    department: 'Computer Science & Technology',
    session: '২৬-২৭',
    semester: 'প্রথম সেমিস্টার',
    rollNumber: '১০৫৪২১',
    address: 'সাতক্ষীরা সদর, সাতক্ষীরা',
    notes: 'অনুষ্ঠানে উপস্থিত থাকার ব্যাপারে অত্যন্ত আগ্রহী।',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'approved',
  },
  {
    id: 'SGPI-2026-1002',
    fullName: 'মোস্তফা কামাল',
    fatherName: 'আব্দুল জব্বার',
    motherName: 'মাজেদা খাতুন',
    mobile: '01812345679',
    email: 'mustofa.elec@gmail.com',
    department: 'Electrical Technology',
    session: '২৬-২৭',
    semester: 'প্রথম সেমিস্টার',
    rollNumber: '১০৫৪২২',
    address: 'কালিগঞ্জ, সাতক্ষীরা',
    notes: '',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'approved',
  },
  {
    id: 'SGPI-2026-1003',
    fullName: 'জান্নাতুল ফেরদৌস',
    fatherName: 'শফিকুল ইসলাম',
    motherName: 'মোর্শেদা খাতুন',
    mobile: '01912345680',
    email: 'jannatul.civil@gmail.com',
    department: 'Civil Technology',
    session: '২৬-২৭',
    semester: 'প্রথম সেমিস্টার',
    rollNumber: '১০৫৪২৩',
    address: 'দেবহাটা, সাতক্ষীরা',
    notes: 'সাংস্কৃতিক অনুষ্ঠানে অংশগ্রহণ করতে চাই।',
    createdAt: new Date().toISOString(),
    status: 'pending',
  },
];

const INITIAL_ADMINS: AdminUser[] = [
  {
    email: 'zobaerhasan431@gmail.com',
    name: 'জুবায়ের হাসান (সুপার এডমিন)',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  },
  {
    email: 'admin@sgpi.edu.bd',
    name: 'অফিসিয়াল এডমিন',
    role: 'admin',
    createdAt: new Date().toISOString(),
  }
];

export const getStoredRegistrations = (): StudentRegistration[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading registrations', e);
    return INITIAL_REGISTRATIONS;
  }
};

export const saveStoredRegistrations = (registrations: StudentRegistration[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    window.dispatchEvent(new Event('sgpi_registrations_updated'));
  } catch (e) {
    console.error('Error saving registrations', e);
  }
};

export const addRegistration = (newReg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>): StudentRegistration => {
  const registrations = getStoredRegistrations();
  
  // Check duplicate mobile
  const existing = registrations.find(r => r.mobile === newReg.mobile);
  if (existing) {
    throw new Error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি রেজিস্ট্রেশন করা হয়েছে!');
  }

  const nextIdNum = 1000 + registrations.length + 1;
  const id = `SGPI-2026-${nextIdNum}`;
  
  const fullRecord: StudentRegistration = {
    ...newReg,
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  registrations.unshift(fullRecord);
  saveStoredRegistrations(registrations);
  return fullRecord;
};

export const updateRegistrationStatus = (id: string, status: StudentRegistration['status']) => {
  const registrations = getStoredRegistrations();
  const updated = registrations.map(r => r.id === id ? { ...r, status } : r);
  saveStoredRegistrations(updated);
};

export const updateRegistration = (updatedReg: StudentRegistration) => {
  const registrations = getStoredRegistrations();
  const updated = registrations.map(r => r.id === updatedReg.id ? updatedReg : r);
  saveStoredRegistrations(updated);
};

export const deleteRegistration = (id: string) => {
  const registrations = getStoredRegistrations();
  const filtered = registrations.filter(r => r.id !== id);
  saveStoredRegistrations(filtered);
};

export const getStoredAdmins = (): AdminUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ADMINS;
  }
};

export const addAdminUser = (admin: AdminUser) => {
  const admins = getStoredAdmins();
  if (admins.some(a => a.email.toLowerCase() === admin.email.toLowerCase())) {
    throw new Error('এই ইমেইল ইতিমধ্যে এডমিন হিসেবে নিবন্ধিত আছে!');
  }
  admins.push(admin);
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
};

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
