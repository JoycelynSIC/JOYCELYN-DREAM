import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useToast, ToastContainer } from '../components/Toast';
import {
  FaSearch, FaUserPlus, FaUsers, FaUserShield, FaUserGraduate,
  FaEdit, FaTrash, FaTimes, FaUser, FaEnvelope, FaKey, FaArrowLeft
} from 'react-icons/fa';
import { userAPI } from '../services/userAPI';

export default function Users() {
  const { toasts, showToast, removeToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formValues, setFormValues] = useState({
    namaDepan: '',
    namaBelakang: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [editUserId, setEditUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState('');

  const searchInputRef = useRef(null);
  const nameInputRef = useRef(null);

  // Load users from Supabase API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.fetchUsers();
      setUsers(data || []);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Koneksi Gagal',
        message: 'Gagal mengambil data user dari Supabase. Pastikan API key Anda valid.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const resetForm = () => {
    setFormValues({
      namaDepan: '',
      namaBelakang: '',
      email: '',
      password: '',
      role: 'user'
    });
    setEditUserId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formValues.namaDepan || !formValues.namaBelakang || !formValues.email || !formValues.password) {
      showToast({
        type: 'error',
        title: 'Form Tidak Valid',
        message: 'Semua kolom wajib diisi!'
      });
      return;
    }

    setLoading(true);
    try {
      await userAPI.createUser({
        namaDepan: formValues.namaDepan,
        namaBelakang: formValues.namaBelakang,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role
      });

      showToast({
        type: 'success',
        title: 'User Berhasil Ditambah!',
        message: `User ${formValues.namaDepan} ${formValues.namaBelakang} telah ditambahkan.`
      });
      
      setShowAddModal(false);
      resetForm();
      loadUsers();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Gagal Menambahkan',
        message: 'Email mungkin sudah digunakan atau konfigurasi API bermasalah.'
      });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user) => {
    setEditUserId(user.id);
    setFormValues({
      namaDepan: user.namaDepan || '',
      namaBelakang: user.namaBelakang || '',
      email: user.email || '',
      password: '', // Password dikosongkan saat edit, diisi hanya jika ingin diubah
      role: user.role || 'user'
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!formValues.namaDepan || !formValues.namaBelakang || !formValues.email) {
      showToast({
        type: 'error',
        title: 'Form Tidak Valid',
        message: 'Nama dan Email wajib diisi!'
      });
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        namaDepan: formValues.namaDepan,
        namaBelakang: formValues.namaBelakang,
        email: formValues.email,
        role: formValues.role
      };

      // Update password hanya jika diisi
      if (formValues.password.trim() !== '') {
        updateData.password = formValues.password;
      }

      await userAPI.updateUser(editUserId, updateData);

      showToast({
        type: 'success',
        title: 'User Diperbarui!',
        message: `Data user ${formValues.namaDepan} telah diperbarui.`
      });

      setShowEditModal(false);
      resetForm();
      loadUsers();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Gagal Memperbarui',
        message: 'Koneksi bermasalah atau API Key tidak valid.'
      });
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (user) => {
    setDeleteUserId(user.id);
    setDeleteUserName(`${user.namaDepan} ${user.namaBelakang}`);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await userAPI.deleteUser(deleteUserId);
      showToast({
        type: 'success',
        title: 'User Dihapus!',
        message: `User ${deleteUserName} telah dihapus dari sistem.`
      });
      setShowDeleteModal(false);
      loadUsers();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Koneksi bermasalah atau database menolak hapusan.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search
  const filteredUsers = users.filter(u => {
    const fullName = `${u.namaDepan} ${u.namaBelakang}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchSearch = fullName.includes(query) || email.includes(query);
    const matchRole = roleFilter === 'Semua' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ── Header ── */}
      <PageHeader title="Manajemen User & Karyawan" breadcrumb={['Dashboard', 'User']}>
        <Button
          id="btn-tambah-user"
          variant="primary"
          icon={<FaUserPlus className="text-xs" />}
          onClick={() => { resetForm(); setShowAddModal(true); }}
        >
          Tambah User / Karyawan
        </Button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total User"
          value={totalUsers}
          desc="Tersimpan di Supabase"
          icon={<FaUsers />}
          iconBgColor="bg-[#9E4BDC]/10"
          iconColor="text-[#9E4BDC]"
        />
        <StatCard
          label="Administrator (Staff)"
          value={adminCount}
          desc="Role: admin"
          icon={<FaUserShield />}
          iconBgColor="bg-[#22285E]/10"
          iconColor="text-[#22285E]"
        />
        <StatCard
          label="Murni Customer"
          value={customerCount}
          desc="Role: user"
          icon={<FaUserGraduate />}
          iconBgColor="bg-[#95D5B6]/20"
          iconColor="text-[#00B5AD]"
        />
      </div>

      {/* ── Main Section ── */}
      <Card padding={false}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-[#E4E4E7]">
          <Input
            ref={searchInputRef}
            id="input-search-user"
            placeholder="Cari nama atau email..."
            icon={FaSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 !gap-0"
          />
          <div className="flex gap-1.5 flex-wrap">
            {['Semua', 'admin', 'user'].map(role => (
              <Button
                key={role}
                id={`btn-filter-${role}`}
                size="sm"
                variant={roleFilter === role ? 'primary' : 'ghost'}
                onClick={() => setRoleFilter(role)}
              >
                {role === 'Semua' ? 'Semua Role' : role === 'admin' ? 'Admin / Staff' : 'Customer'}
              </Button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {loading && users.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#9E4BDC] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500 font-medium">Menghubungkan ke database Supabase...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                  {['User', 'Email', 'Role', 'Password Hash/Plain', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#F4F4F5]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                            isAdmin ? 'bg-[#22285E] text-white' : 'bg-[#9E4BDC] text-white'
                          }`}>
                            {(user.namaDepan || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#22285E] leading-tight">
                              {user.namaDepan} {user.namaBelakang}
                            </p>
                            <p className="text-[10px] text-[#A1A1AA] mt-0.5">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-[#71717A] font-medium">{user.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          isAdmin 
                            ? 'bg-[#22285E]/10 text-[#22285E] border border-[#22285E]/20'
                            : 'bg-[#9E4BDC]/10 text-[#9E4BDC] border border-[#9E4BDC]/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono text-gray-400">
                          {user.password ? '•'.repeat(8) : '(Tidak ada)'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-edit-${user.id}`}
                            onClick={() => openEdit(user)}
                            className="w-7 h-7 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-center text-[#A1A1AA] hover:bg-[#9E4BDC]/10 hover:text-[#9E4BDC] hover:border-[#9E4BDC]/30 transition-all"
                            title="Edit user"
                          >
                            <FaEdit className="text-[10px]" />
                          </button>
                          <button
                            id={`btn-delete-${user.id}`}
                            onClick={() => openDelete(user)}
                            className="w-7 h-7 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-center text-[#A1A1AA] hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] hover:border-[#F24E1E]/30 transition-all"
                            title="Hapus user"
                          >
                            <FaTrash className="text-[10px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="py-16 text-center">
              <FaSearch className="text-3xl text-[#A1A1AA] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#A1A1AA]">User tidak ditemukan</p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Modal Add User ── */}
      {showAddModal && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center shrink-0">
                  <FaUserPlus className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Tambah User Baru</p>
                  <p className="text-[10px] text-[#A1A1AA]">Tambahkan customer atau admin baru</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  ref={nameInputRef}
                  id="add-nama-depan"
                  label="Nama Depan"
                  name="namaDepan"
                  value={formValues.namaDepan}
                  onChange={handleFormChange}
                  placeholder="cth: Siti"
                  icon={FaUser}
                />
                <Input
                  id="add-nama-belakang"
                  label="Nama Belakang"
                  name="namaBelakang"
                  value={formValues.namaBelakang}
                  onChange={handleFormChange}
                  placeholder="cth: Rahma"
                  icon={FaUser}
                />
              </div>
              <Input
                id="add-email"
                label="Email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleFormChange}
                placeholder="cth: siti@email.com"
                icon={FaEnvelope}
              />
              <Input
                id="add-password"
                label="Password"
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleFormChange}
                placeholder="Masukkan password"
                icon={FaKey}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Role Akun</label>
                <select
                  id="add-role"
                  name="role"
                  value={formValues.role}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                >
                  <option value="user">Customer (user)</option>
                  <option value="admin">Administrator / Staff (admin)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setShowAddModal(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" icon={<FaUserPlus className="text-xs" />}>
                  Tambah User
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal Edit User ── */}
      {showEditModal && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#22285E] rounded-xl flex items-center justify-center shrink-0">
                  <FaEdit className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Edit Data User</p>
                  <p className="text-[10px] text-[#A1A1AA]">Perbarui data user dari database</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  ref={nameInputRef}
                  id="edit-nama-depan"
                  label="Nama Depan"
                  name="namaDepan"
                  value={formValues.namaDepan}
                  onChange={handleFormChange}
                  placeholder="cth: Siti"
                  icon={FaUser}
                />
                <Input
                  id="edit-nama-belakang"
                  label="Nama Belakang"
                  name="namaBelakang"
                  value={formValues.namaBelakang}
                  onChange={handleFormChange}
                  placeholder="cth: Rahma"
                  icon={FaUser}
                />
              </div>
              <Input
                id="edit-email"
                label="Email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleFormChange}
                placeholder="cth: siti@email.com"
                icon={FaEnvelope}
              />
              <Input
                id="edit-password"
                label="Password (Kosongkan jika tidak diubah)"
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleFormChange}
                placeholder="Ubah password"
                icon={FaKey}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Role Akun</label>
                <select
                  id="edit-role"
                  name="role"
                  value={formValues.role}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                >
                  <option value="user">Customer (user)</option>
                  <option value="admin">Administrator / Staff (admin)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setShowEditModal(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" icon={<FaEdit className="text-xs" />}>
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal Delete User ── */}
      {showDeleteModal && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#F24E1E]/10 rounded-2xl flex items-center justify-center mx-auto">
                <FaTrash className="text-[#F24E1E] text-xl" />
              </div>
              <div>
                <p className="text-base font-black text-[#22285E]">Hapus User?</p>
                <p className="text-sm text-[#71717A] mt-1">
                  User <span className="font-bold text-[#22285E]">"{deleteUserName}"</span> akan dihapus secara permanen dari database Supabase.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setShowDeleteModal(false)}>
                  Batal
                </Button>
                <Button variant="warning" className="flex-1" icon={<FaTrash className="text-xs" />} onClick={handleDeleteUser}>
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
