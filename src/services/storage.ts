import { StudentRegistration, AdminUser } from '../types';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const STORAGE_KEYS = {
  CURRENT_ADMIN: 'sgpi_nobin_boron_2026_current_admin',
};

const REGISTRATIONS_COLLECTION = 'registrations';
const ADMINS_COLLECTION = 'admins';

// Format and normalize Bangladeshi mobile number
function normalizeMobile(mob: string): string {
  const digits = String(mob).replace(/\D/g, '');
  return digits.startsWith('880') ? `0${digits.slice(3)}` : digits;
}

// 1. Fetch all registrations (Firestore-first with server fallback)
export async function fetchRegistrations(): Promise<StudentRegistration[]> {
  try {
    const colRef = collection(db, REGISTRATIONS_COLLECTION);
    const snap = await getDocs(colRef);
    const list: StudentRegistration[] = [];
    snap.forEach((d) => {
      list.push(d.data() as StudentRegistration);
    });
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.warn('Firestore fetch failed, falling back to local API if available', err);
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) return await res.json();
    } catch {}
    handleFirestoreError(err, OperationType.LIST, REGISTRATIONS_COLLECTION);
  }
}

// 2. Submit new registration directly to Firestore
export async function submitRegistration(
  newReg: Omit<StudentRegistration, 'id' | 'createdAt' | 'status'>
): Promise<StudentRegistration> {
  const localMobile = normalizeMobile(newReg.mobile);

  try {
    // Check for duplicate mobile
    const colRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(colRef, where('mobile', '==', localMobile));
    const existingSnap = await getDocs(q);

    if (!existingSnap.empty) {
      throw new Error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি রেজিস্ট্রেশন সম্পন্ন হয়েছে!');
    }

    // Determine next sequential ID
    const allDocs = await getDocs(colRef);
    const nextNum = 1000 + allDocs.size + 1;
    const registrationId = `SGPI-2026-${nextNum}`;

    const rawData: StudentRegistration = {
      ...newReg,
      mobile: localMobile,
      id: registrationId,
      session: newReg.session || '২০২৫-২০২৬',
      semester: 'প্রথম সেমিস্টার',
      createdAt: new Date().toISOString(),
      status: 'approved',
    };

    // Remove undefined values since Firestore does not support undefined
    const registrationData: any = {};
    for (const [key, val] of Object.entries(rawData)) {
      if (val !== undefined) {
        registrationData[key] = val;
      }
    }

    // Save to Firestore with document ID equal to registrationId
    await setDoc(doc(db, REGISTRATIONS_COLLECTION, registrationId), registrationData);

    // Also notify local dev server if running
    try {
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
    } catch {}

    return registrationData;
  } catch (err: any) {
    if (err.message && err.message.includes('ইতিমধ্যে একটি রেজিস্ট্রেশন')) {
      throw err;
    }
    console.error('Error submitting registration to Firestore:', err);
    // If client offline or Firestore permission issue, try server route
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg),
      });
      if (res.ok) return await res.json();
    } catch {}
    handleFirestoreError(err, OperationType.CREATE, REGISTRATIONS_COLLECTION);
  }
}

// 3. Search registration by mobile or registration ID
export async function searchRegistration(searchQuery: string): Promise<StudentRegistration> {
  const cleanQuery = searchQuery.trim().toLowerCase();
  const normalizedMob = normalizeMobile(searchQuery.trim());

  try {
    const colRef = collection(db, REGISTRATIONS_COLLECTION);
    
    // First try mobile search
    const qMobile = query(colRef, where('mobile', '==', normalizedMob));
    const mobileSnap = await getDocs(qMobile);
    if (!mobileSnap.empty) {
      return mobileSnap.docs[0].data() as StudentRegistration;
    }

    // Try direct ID lookup
    const upperId = cleanQuery.toUpperCase();
    const docSnap = await getDoc(doc(db, REGISTRATIONS_COLLECTION, upperId));
    if (docSnap.exists()) {
      return docSnap.data() as StudentRegistration;
    }

    // Fallback: search all in memory if small collection
    const all = await fetchRegistrations();
    const match = all.find(r => 
      r.id.toLowerCase() === cleanQuery || 
      normalizeMobile(r.mobile) === normalizedMob ||
      r.fullName.toLowerCase().includes(cleanQuery)
    );
    if (match) return match;

    throw new Error('কোনো রেজিস্ট্রেশন পাওয়া যায়নি।');
  } catch (err: any) {
    if (err.message && err.message.includes('কোনো রেজিস্ট্রেশন পাওয়া যায়নি')) {
      throw err;
    }
    handleFirestoreError(err, OperationType.GET, REGISTRATIONS_COLLECTION);
  }
}

// 4. Update registration status
export async function updateRegistrationStatusApi(
  id: string, 
  status: StudentRegistration['status']
): Promise<StudentRegistration> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await updateDoc(docRef, { status });
    const updated = await getDoc(docRef);
    return updated.data() as StudentRegistration;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${id}`);
  }
}

// 5. Update registration full details
export async function updateRegistrationApi(
  updatedReg: StudentRegistration
): Promise<StudentRegistration> {
  try {
    const clean: any = {};
    for (const [key, val] of Object.entries(updatedReg)) {
      if (val !== undefined) clean[key] = val;
    }
    const docRef = doc(db, REGISTRATIONS_COLLECTION, updatedReg.id);
    await setDoc(docRef, clean, { merge: true });
    return updatedReg;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${updatedReg.id}`);
  }
}

// 6. Delete registration
export async function deleteRegistrationApi(id: string): Promise<void> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${REGISTRATIONS_COLLECTION}/${id}`);
  }
}

// 7. Admin authentication
export async function loginAdminApi(email: string, password: string): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();

  // Super Admin validation
  if (cleanEmail === 'zobaerhasan431@gmail.com') {
    if (password === '1@2#3$4_5&aA') {
      const superAdminUser: AdminUser = {
        email: cleanEmail,
        name: 'জুবায়ের হাসান (সুপার এডমিন)',
        role: 'super_admin',
        createdAt: new Date().toISOString(),
      };
      setCurrentAdmin(superAdminUser);
      // Ensure super admin doc exists in Firestore
      try {
        await setDoc(doc(db, ADMINS_COLLECTION, cleanEmail), superAdminUser, { merge: true });
      } catch {}
      return superAdminUser;
    } else {
      throw new Error('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।');
    }
  }

  // Check Firestore for additional admin accounts
  try {
    const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, cleanEmail));
    if (adminDoc.exists()) {
      if (password.length >= 4) {
        const adminData = adminDoc.data() as AdminUser;
        setCurrentAdmin(adminData);
        return adminData;
      } else {
        throw new Error('ভুল পাসওয়ার্ড!');
      }
    }
  } catch {}

  throw new Error('এই ইমেইলটি কোনো অনুমোদিত এডমিন অ্যাকাউন্ট নয়।');
}

// 8. Create additional admin
export async function createAdminApi(email: string, name: string): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();
  const newAdmin: AdminUser = {
    email: cleanEmail,
    name: name.trim(),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, ADMINS_COLLECTION, cleanEmail), newAdmin);
    return newAdmin;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${ADMINS_COLLECTION}/${cleanEmail}`);
  }
}

// Local Storage for current admin session
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

// 9. Firestore real-time listener (Replaces legacy SSE and works on Vercel too!)
export function subscribeToRealtimeUpdates(onEvent: (type: string, payload: any) => void) {
  let isInitial = true;

  try {
    const colRef = collection(db, REGISTRATIONS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (isInitial) {
          isInitial = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          if (change.type === 'added') {
            onEvent('NEW_REGISTRATION', data);
          } else if (change.type === 'modified') {
            onEvent('UPDATE_REGISTRATION', data);
          } else if (change.type === 'removed') {
            onEvent('DELETE_REGISTRATION', { id: data.id || change.doc.id });
          }
        });
      },
      (error) => {
        console.warn('Firestore real-time subscription error:', error);
      }
    );

    return unsubscribe;
  } catch (e) {
    console.error('Error starting Firestore real-time subscription', e);
    return () => {};
  }
}
