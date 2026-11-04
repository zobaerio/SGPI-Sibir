export interface StudentRegistration {
  id: string; // e.g. SGPI-2026-1001
  fullName: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  email?: string;
  department: 
    | 'Civil Technology' 
    | 'Electrical Technology' 
    | 'Mechanical Technology' 
    | 'Computer Science & Technology' 
    | 'Electronics Technology' 
    | 'অন্যান্য';
  session: string; // '২৬-২৭'
  semester: string; // 'প্রথম সেমিস্টার'
  rollNumber?: string;
  photoUrl?: string;
  address: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'verified';
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}
