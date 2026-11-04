import { StudentRegistration } from '../types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'অনুরোধ সম্পন্ন হয়নি।');
  return data as T;
}
export async function createRegistration(data: Omit<StudentRegistration,'id'|'createdAt'|'status'>) {
  const result = await request<{registration:StudentRegistration}>('/api/registrations', {method:'POST',body:JSON.stringify(data)});
  return result.registration;
}
export async function listRegistrations() {
  const result = await request<{registrations:StudentRegistration[]}>('/api/admin-registrations');
  return result.registrations;
}
export async function updateRemoteRegistration(registration: StudentRegistration) {
  const result = await request<{registration:StudentRegistration}>('/api/admin-registrations?id='+encodeURIComponent(registration.id), {
    method:'PATCH', body:JSON.stringify(registration),
  });
  return result.registration;
}
export async function removeRemoteRegistration(id: string) {
  await request('/api/admin-registrations?id='+encodeURIComponent(id), {method:'DELETE'});
}
