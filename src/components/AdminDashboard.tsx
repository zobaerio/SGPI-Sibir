import React, { useState, useEffect } from 'react';
import { 
  getStoredRegistrations, 
  updateRegistrationStatus, 
  deleteRegistration, 
  updateRegistration, 
  getCurrentAdmin,
  getStoredAdmins 
} from '../services/storage';
import { StudentRegistration } from '../types';
import { RegistrationPass } from './RegistrationPass';
import * as XLSX from 'xlsx';
import { 
  Users, Search, Filter, Download, Trash2, Edit, CheckCircle, 
  XCircle, Printer, Eye, Shield, FileSpreadsheet, RefreshCw, AlertTriangle, X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentRegistration | null>(null);
  const [currentAdmin, setCurrentAdminState] = useState(getCurrentAdmin());

  const loadData = () => {
    setRegistrations(getStoredRegistrations());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sgpi_registrations_updated', handleUpdate);
    window.addEventListener('sgpi_admin_updated', () => setCurrentAdminState(getCurrentAdmin()));
    return () => {
      window.removeEventListener('sgpi_registrations_updated', handleUpdate);
      window.removeEventListener('sgpi_admin_updated', () => {});
    };
  }, []);

  // Filter logic
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.mobile.includes(searchQuery) ||
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.fatherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'ALL' || reg.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || reg.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Statistics
  const totalCount = registrations.length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  const deptCounts = {
    cst: registrations.filter(r => r.department === 'Computer Science & Technology').length,
    civil: registrations.filter(r => r.department === 'Civil Technology').length,
    electrical: registrations.filter(r => r.department === 'Electrical Technology').length,
    mechanical: registrations.filter(r => r.department === 'Mechanical Technology').length,
    electronics: registrations.filter(r => r.department === 'Electronics Technology').length,
    others: registrations.filter(r => r.department === 'অন্যান্য').length,
  };

  // Export to Excel / CSV
  const exportToExcel = () => {
    const exportData = registrations.map((r, index) => ({
      'ক্রমিক': index + 1,
      'রেজিস্ট্রেশন আইডি': r.id,
      'শিক্ষার্থীর নাম': r.fullName,
      'পিতার নাম': r.fatherName,
      'মাতার নাম': r.motherName,
      'মোবাইল নম্বর': r.mobile,
      'ইমেইল': r.email || '',
      'বিভাগ': r.department,
      'শিক্ষাবর্ষ': r.session,
      'সেমিস্টার': r.semester,
      'রোল নম্বর': r.rollNumber || '',
      'বর্তমান ঠিকানা': r.address,
      'বিশেষ তথ্য': r.notes || '',
      'স্ট্যাটাস': r.status,
      'নিবন্ধনের তারিখ': new Date(r.createdAt).toLocaleString('bn-BD'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, `Nobin_Boron_2026_Registrations_${Date.now()}.xlsx`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই রেজিস্ট্রেশনটি মুছে ফেলতে চান?')) {
      deleteRegistration(id);
      loadData();
    }
  };

  const handleStatusToggle = (id: string, currentStatus: StudentRegistration['status']) => {
    const nextStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    updateRegistrationStatus(id, nextStatus);
    loadData();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateRegistration(editingStudent);
      setEditingStudent(null);
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-950 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Shield className="w-4 h-4" /> সুরক্ষিত এডমিন প্যানেল
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-yellow-300">
            নবীন বরণ ২০২৬ - এডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-green-100 mt-1">
            স্বাগতম, {currentAdmin?.name || 'এডমিন'} ({currentAdmin?.email})
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToExcel}
            className="bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> এক্সেল এক্সপোর্ট (Excel)
          </button>
          <button
            onClick={loadData}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-2xl transition flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-600">
          <div className="text-gray-500 text-xs font-bold mb-1">মোট রেজিস্ট্রেশন</div>
          <div className="text-3xl font-black text-gray-900">{totalCount}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emerald-500">
          <div className="text-gray-500 text-xs font-bold mb-1">অনুমোদিত</div>
          <div className="text-3xl font-black text-emerald-600">{approvedCount}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-amber-500">
          <div className="text-gray-500 text-xs font-bold mb-1">বিচারাধীন</div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-600">
          <div className="text-gray-500 text-xs font-bold mb-1">টেকনোলজি সংখ্যা</div>
          <div className="text-3xl font-black text-blue-600">৫+</div>
        </div>
      </div>

      {/* Department Breakdown Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-green-100">
        <h3 className="text-sm font-bold text-gray-800 mb-4">বিভাগভিত্তিক রেজিস্ট্রেশন পরিসংখ্যান</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-center">
            <div className="text-xs text-gray-600">CST</div>
            <div className="text-xl font-bold text-green-900">{deptCounts.cst}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
            <div className="text-xs text-gray-600">Civil</div>
            <div className="text-xl font-bold text-blue-900">{deptCounts.civil}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <div className="text-xs text-gray-600">Electrical</div>
            <div className="text-xl font-bold text-amber-900">{deptCounts.electrical}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center">
            <div className="text-xs text-gray-600">Mechanical</div>
            <div className="text-xl font-bold text-purple-900">{deptCounts.mechanical}</div>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
            <div className="text-xs text-gray-600">Electronics</div>
            <div className="text-xl font-bold text-rose-900">{deptCounts.electronics}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
            <div className="text-xs text-gray-600">অন্যান্য</div>
            <div className="text-xl font-bold text-gray-900">{deptCounts.others}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row gap-4 justify-between items-center border border-green-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="নাম, মোবাইল নম্বর বা আইডি দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none text-sm font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none"
          >
            <option value="ALL">সকল বিভাগ</option>
            <option value="Computer Science & Technology">Computer Science & Technology</option>
            <option value="Civil Technology">Civil Technology</option>
            <option value="Electrical Technology">Electrical Technology</option>
            <option value="Mechanical Technology">Mechanical Technology</option>
            <option value="Electronics Technology">Electronics Technology</option>
            <option value="অন্যান্য">অন্যান্য</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="approved">অনুমোদিত</option>
            <option value="pending">বিচারাধীন</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-900 text-white text-xs uppercase tracking-wider">
                <th className="p-4">আইডি ও ছবি</th>
                <th className="p-4">শিক্ষার্থীর নাম</th>
                <th className="p-4">বিভাগ</th>
                <th className="p-4">মোবাইল নম্বর</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-green-50/50 transition">
                    <td className="p-4 font-mono font-bold text-green-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-green-300 shrink-0 flex items-center justify-center">
                          {reg.photoUrl ? (
                            <img src={reg.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-green-700" />
                          )}
                        </div>
                        <div>
                          <div>{reg.id}</div>
                          <div className="text-[10px] text-gray-500">রোল: {reg.rollNumber || 'নেই'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{reg.fullName}</div>
                      <div className="text-xs text-gray-500">পিতা: {reg.fatherName}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{reg.department}</td>
                    <td className="p-4 font-mono font-medium">{reg.mobile}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(reg.id, reg.status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 w-fit ${
                          reg.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {reg.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                        {reg.status === 'approved' ? 'অনুমোদিত' : 'বিচারাধীন'}
                      </button>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(reg.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedStudent(reg)}
                          title="পাস দেখুন"
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingStudent(reg)}
                          title="সম্পাদনা করুন"
                          className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reg.id)}
                          title="মুছে ফেলুন"
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                    কোনো রেজিস্ট্রেশন পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Pass Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <RegistrationPass registration={selectedStudent} onClose={() => setSelectedStudent(null)} />
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">রেজিস্ট্রেশন তথ্য সম্পাদনা</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">শিক্ষার্থীর নাম</label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl text-sm font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">পিতার নাম</label>
                  <input
                    type="text"
                    value={editingStudent.fatherName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">মাতার নাম</label>
                  <input
                    type="text"
                    value={editingStudent.motherName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={editingStudent.mobile}
                    onChange={(e) => setEditingStudent({ ...editingStudent, mobile: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">রোল নম্বর</label>
                  <input
                    type="text"
                    value={editingStudent.rollNumber || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বর্তমান ঠিকানা</label>
                <textarea
                  rows={2}
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl text-sm font-medium"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-700 text-white rounded-xl font-bold text-sm"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
