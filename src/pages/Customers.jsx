import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import customerData from '../data/customer.json';
import PageHeader    from '../components/PageHeader';
import StatCard      from '../components/StatCard';
import Card          from '../components/Card';
import Button        from '../components/Button';
import Input         from '../components/Input';
import AvatarGroup   from '../components/AvatarGroup';
import CustomerCard  from '../components/CustomerCard';
import Badge         from '../components/Badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FaSearch, FaStar, FaCrown, FaUserPlus, FaEnvelope,
  FaWhatsapp, FaUsers, FaGem, FaShoppingBag, FaEdit, FaPhone,
  FaMedal, FaThLarge, FaList, FaTimes, FaUser, FaTrash, FaSave,
} from 'react-icons/fa';
import Select from '../components/Select';
import { useToast, ToastContainer } from '../components/Toast';

/* ─────────────────────────────────────────────────────
   Konfigurasi level member Na_store.id
   Reguler  : 0 – 499 poin
   Silver   : 500 – 1.999 poin
   Gold     : 2.000 – 4.999 poin
   Platinum : 5.000+ poin
───────────────────────────────────────────────────── */
const MEMBER_CONFIG = {
  Reguler:  {
    icon: FaMedal,
    iconColor: 'text-[#A1A1AA]',
    bg:   'bg-[#F4F4F5]',
    text: 'text-[#71717A]',
    bar:  'bg-[#A1A1AA]',
    border: 'border-[#E4E4E7]',
    next: 500,
    badge: 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7]',
  },
  Silver:   {
    icon: FaStar,
    iconColor: 'text-[#71717A]',
    bg:   'bg-[#F4F4F5]',
    text: 'text-[#52525B]',
    bar:  'bg-[#A1A1AA]',
    border: 'border-[#E4E4E7]',
    next: 2000,
    badge: 'bg-[#E4E4E7]/60 text-[#52525B] border border-[#A1A1AA]/30',
  },
  Gold:     {
    icon: FaCrown,
    iconColor: 'text-yellow-500',
    bg:   'bg-yellow-50',
    text: 'text-yellow-600',
    bar:  'bg-yellow-400',
    border: 'border-yellow-200',
    next: 5000,
    badge: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  },
  Platinum: {
    icon: FaGem,
    iconColor: 'text-[#9E4BDC]',
    bg:   'bg-[#9E4BDC]/10',
    text: 'text-[#9E4BDC]',
    bar:  'bg-[#9E4BDC]',
    border: 'border-[#9E4BDC]/20',
    next: null, // level tertinggi
    badge: 'bg-[#9E4BDC]/10 text-[#9E4BDC] border border-[#9E4BDC]/20',
  },
};

/* Warna avatar bergilir */
const AVATAR_COLORS = [
  'bg-[#9E4BDC] text-white',
  'bg-[#22285E] text-white',
  'bg-[#95D5B6] text-[#22285E]',
  'bg-yellow-400 text-white',
  'bg-[#F24E1E] text-white',
];

/* Helper: hitung persen progress ke level berikutnya */
function poinProgress(poin, member) {
  const cfg = MEMBER_CONFIG[member];
  if (!cfg || !cfg.next) return 100;
  const prev = member === 'Reguler' ? 0 : member === 'Silver' ? 500 : member === 'Gold' ? 2000 : 5000;
  return Math.min(((poin - prev) / (cfg.next - prev)) * 100, 100);
}

export default function Customers() {
  const { toasts, showToast, removeToast } = useToast();

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('joy_dream_customers');
    return saved ? JSON.parse(saved) : customerData;
  });
  const [dataForm, setDataForm]   = useState({ search: '', filterMember: 'Semua' });
  const [selected, setSelected]   = useState(() => {
    const saved = localStorage.getItem('joy_dream_customers');
    const parsed = saved ? JSON.parse(saved) : customerData;
    return parsed[0] || null;
  });
  const [viewMode, setViewMode]   = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm]   = useState(false);
  const [formPelanggan, setFormPelanggan] = useState({
    name: '', email: '', phone: '', member: 'Reguler', status: 'Aktif',
  });
  // Edit mode: null = tidak edit, object = pelanggan yang sedang diedit
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm]     = useState({ name: '', email: '', phone: '', member: 'Reguler', status: 'Aktif' });
  // Hapus modal
  const [hapusTarget, setHapusTarget] = useState(null);
  const ITEMS_PER_PAGE = 5;

  const searchInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const prevCustomersCountRef = useRef(customers.length);

  // Efek untuk memfokuskan input pencarian saat halaman dimuat
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Efek untuk menyimpan data ke localStorage
  useEffect(() => {
    localStorage.setItem('joy_dream_customers', JSON.stringify(customers));
    prevCustomersCountRef.current = customers.length;
  }, [customers]);

  // Efek untuk keyboard Escape dan fokus input modal ketika terbuka
  useEffect(() => {
    if (!showForm && !editTarget) return;

    const timer = setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditTarget(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showForm, editTarget]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormPelanggan(p => ({ ...p, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(p => ({ ...p, [name]: value }));
  };

  const openEdit = (c) => {
    setEditTarget(c);
    setEditForm({ name: c.name, email: c.email, phone: c.phone, member: c.member, status: c.status });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) return;
    setCustomers(prev => prev.map(c =>
      c.id === editTarget.id ? { ...c, ...editForm } : c
    ));
    // Update selected jika yang diedit adalah yang sedang dipilih
    if (selected?.id === editTarget.id) {
      setSelected(p => ({ ...p, ...editForm }));
    }
    showToast({ type: 'update', title: 'Pelanggan diperbarui!', message: `Data "${editForm.name}" berhasil diupdate.` });
    setEditTarget(null);
  };

  const handleHapus = () => {
    const nama = hapusTarget.name;
    setCustomers(prev => prev.filter(c => c.id !== hapusTarget.id));
    if (selected?.id === hapusTarget.id) setSelected(null);
    setHapusTarget(null);
    showToast({ type: 'delete', title: 'Pelanggan dihapus!', message: `"${nama}" telah dihapus permanen.` });
  };

  const handleTambahPelanggan = (e) => {
    e.preventDefault();
    if (!formPelanggan.name || !formPelanggan.email) return;
    const newCustomer = {
      id: customers.length + 1,
      name: formPelanggan.name,
      email: formPelanggan.email,
      phone: formPelanggan.phone,
      member: formPelanggan.member,
      status: formPelanggan.status,
      poin: 0,
      transaksi: 0,
      totalBelanja: 0,
      bergabung: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setFormPelanggan({ name: '', email: '', phone: '', member: 'Reguler', status: 'Aktif' });
    setShowForm(false);
    showToast({ type: 'success', title: 'Pelanggan ditambahkan!', message: `"${formPelanggan.name}" berhasil disimpan.` });
  };

  const _search  = dataForm.search.toLowerCase();
  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(_search) || c.email.toLowerCase().includes(_search);
    const matchMember = dataForm.filterMember === 'Semua' || c.member === dataForm.filterMember;
    return matchSearch && matchMember;
  });

  const totalPages    = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalPoin      = customers.reduce((a, c) => a + c.poin, 0);
  const countByMember  = (m) => customers.filter(c => c.member === m).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      {/* ── Header ── */}
      <PageHeader title="Pelanggan" breadcrumb={['Dashboard', 'Pelanggan']}>
        <Button variant="primary" icon={<FaUserPlus className="text-xs" />} onClick={() => setShowForm(true)}>
          Tambah Pelanggan
        </Button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Pelanggan" value={customers.length} desc="terdaftar"
          icon={<FaUsers />} iconBgColor="bg-[#F4F4F5]" iconColor="text-[#9E4BDC]"
        />
        <StatCard
          label="Platinum" value={countByMember('Platinum')} desc="member tertinggi"
          icon={<FaGem />} iconBgColor="bg-[#9E4BDC]/10" iconColor="text-[#9E4BDC]"
        />
        <StatCard
          label="Gold" value={countByMember('Gold')} desc="member aktif"
          icon={<FaCrown />} iconBgColor="bg-yellow-50" iconColor="text-yellow-500"
          variant="primary"
        />
        <StatCard
          label="Total Poin" value={totalPoin.toLocaleString('id')} desc="poin beredar"
          icon={<FaStar />} iconBgColor="bg-[#F4F4F5]" iconColor="text-yellow-400"
        />
      </div>

      {/* ── Info Level Member ── */}
      <Card title="Sistem Level Member Na_store.id" subtitle="Setiap Rp 1.000 pembelian = 1 poin">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { member: 'Reguler',  range: '0 – 499 poin',       count: countByMember('Reguler')  },
            { member: 'Silver',   range: '500 – 1.999 poin',   count: countByMember('Silver')   },
            { member: 'Gold',     range: '2.000 – 4.999 poin', count: countByMember('Gold')     },
            { member: 'Platinum', range: '5.000+ poin',        count: countByMember('Platinum') },
          ].map(({ member, range, count }) => {
            const cfg      = MEMBER_CONFIG[member];
            const Icon     = cfg.icon;
            const members  = customers.filter(c => c.member === member);
            return (
              <div key={member} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 flex flex-col gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className={`${cfg.iconColor} text-base`} />
                  </div>
                  <div>
                    <p className={`text-sm font-black ${cfg.text}`}>{member}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{range}</p>
                    <p className="text-[10px] font-bold text-[#22285E] mt-0.5">{count} pelanggan</p>
                  </div>
                </div>
                {/* AvatarGroup per tier */}
                <AvatarGroup
                  users={members.map((c, i) => ({ name: c.name, color: AVATAR_COLORS[i % AVATAR_COLORS.length] }))}
                  max={4}
                  size="sm"
                  showNames={false}
                  label={`${count} anggota`}
                />
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[#71717A] bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5 flex items-center gap-2">
          <FaStar className="text-yellow-400 shrink-0" />
          Poin bisa ditukar diskon atau free gift aksesoris pilihan di Na_store.id.
        </p>
      </Card>

      {/* ── Main 2-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* LEFT: Tabel / Grid */}
        <Card className="lg:col-span-2" padding={false}>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-[#E4E4E7]">
            <Input
              ref={searchInputRef}
              placeholder="Cari nama atau email..."
              icon={FaSearch}
              value={dataForm.search}
              onChange={(e) => {
                setDataForm(p => ({ ...p, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="flex-1 !gap-0"
            />
            <div className="flex gap-1.5 flex-wrap">
              {['Semua', 'Platinum', 'Gold', 'Silver', 'Reguler'].map(m => (
                <Button
                  key={m} size="sm"
                  variant={dataForm.filterMember === m ? 'primary' : 'ghost'}
                  onClick={() => {
                    setDataForm(p => ({ ...p, filterMember: m }));
                    setCurrentPage(1);
                  }}
                >
                  {m}
                </Button>
              ))}
            </div>
            {/* Toggle view */}
            <div className="flex bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl p-1 gap-1 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'table' ? 'bg-white text-[#9E4BDC] shadow-sm' : 'text-[#A1A1AA] hover:text-[#22285E]'
                }`}
              >
                <FaList className="text-xs" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#9E4BDC] shadow-sm' : 'text-[#A1A1AA] hover:text-[#22285E]'
                }`}
              >
                <FaThLarge className="text-xs" />
              </button>
            </div>
          </div>

          {/* ── VIEW: GRID (CustomerCard) ── */}
          {viewMode === 'grid' && (
            <div className="p-5">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paginatedData.map((c) => (
                    <CustomerCard
                      key={c.id}
                      id={c.id}
                      nama={c.name}
                      email={c.email}
                      noHp={c.phone}
                      statusMember={c.member}
                      totalPoin={c.poin}
                      totalBelanja={c.totalBelanja}
                      onClick={() => setSelected(c)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <FaSearch className="text-3xl text-[#A1A1AA] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#A1A1AA]">Pelanggan tidak ditemukan</p>
                </div>
              )}
            </div>
          )}

          {/* ── VIEW: TABLE ── */}
          {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                  {['Pelanggan', 'Level Member', 'Poin', 'Transaksi', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((c, idx) => {
                  const cfg    = MEMBER_CONFIG[c.member] ?? MEMBER_CONFIG.Reguler;
                  const Icon   = cfg.icon;
                  const isActive = selected?.id === c.id;
                  const absoluteIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`border-b border-[#E4E4E7] last:border-0 cursor-pointer transition-colors ${
                        isActive ? 'bg-[#9E4BDC]/5 border-l-2 border-l-[#9E4BDC]' : 'hover:bg-[#F4F4F5]/60'
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${AVATAR_COLORS[absoluteIdx % AVATAR_COLORS.length]}`}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#22285E] leading-tight">{c.name}</p>
                            <p className="text-[10px] text-[#A1A1AA]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${cfg.badge}`}>
                          <Icon className="text-[9px]" />
                          {c.member}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-[10px]" />
                          <span className="text-sm font-black text-[#22285E]">{c.poin.toLocaleString('id')}</span>
                        </div>
                        <div className="w-16 h-1 bg-[#E4E4E7] rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cfg.bar}`}
                            style={{ width: `${poinProgress(c.poin, c.member)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-sm font-bold text-[#71717A]">
                          <FaShoppingBag className="text-[#9E4BDC] text-[10px]" />{c.transaksi}x
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          c.status === 'Aktif'
                            ? 'bg-[#00B5AD]/10 text-[#00B5AD] border border-[#00B5AD]/20'
                            : 'bg-[#F4F4F5] text-[#A1A1AA] border border-[#E4E4E7]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                            className="w-7 h-7 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-center text-[#A1A1AA] hover:bg-[#9E4BDC]/10 hover:text-[#9E4BDC] hover:border-[#9E4BDC]/30 transition-all"
                            title="Edit pelanggan"
                          >
                            <FaEdit className="text-[10px]" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setHapusTarget(c); }}
                            className="w-7 h-7 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-center text-[#A1A1AA] hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] hover:border-[#F24E1E]/30 transition-all"
                            title="Hapus pelanggan"
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

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <FaSearch className="text-3xl text-[#A1A1AA] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#A1A1AA]">Pelanggan tidak ditemukan</p>
              </div>
            )}
          </div>
          )}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E4E4E7] flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>

        {/* RIGHT: Detail Panel */}
        {selected && (() => {
          const cfg    = MEMBER_CONFIG[selected.member] ?? MEMBER_CONFIG.Reguler;
          const Icon   = cfg.icon;
          const idx    = customers.findIndex(c => c.id === selected.id);
          const pct    = poinProgress(selected.poin, selected.member);
          const sisaPoin = cfg.next ? cfg.next - selected.poin : 0;

          return (
            <Card className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-hidden">
              <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="pr-3">

              {/* Avatar + nama */}
              <div className="text-center pb-4 border-b border-[#E4E4E7]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-3 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                  {selected.name.charAt(0)}
                </div>
                <h3 className="text-base font-black text-[#22285E]">{selected.name}</h3>

                <span className={`text-[10px] font-bold px-3 py-1 rounded-lg inline-flex items-center gap-1.5 mt-2 ${cfg.badge}`}>
                  <Icon className="text-[10px]" />
                  {selected.member}
                </span>

                <p className="text-[10px] text-[#A1A1AA] mt-2">Member sejak {selected.bergabung}</p>
              </div>

              {/* Kontak */}
              <div className="space-y-1.5 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Kontak</p>
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F4F5] transition-colors group">
                  <div className="w-7 h-7 bg-[#95D5B6]/20 rounded-lg flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-[#00B5AD] text-xs" />
                  </div>
                  <span className="text-xs text-[#71717A] group-hover:text-[#22285E] truncate">{selected.email}</span>
                </a>
                <a href={`https://wa.me/${selected.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F4F5] transition-colors group">
                  <div className="w-7 h-7 bg-[#9E4BDC] rounded-lg flex items-center justify-center shrink-0">
                    <FaWhatsapp className="text-white text-xs" />
                  </div>
                  <span className="text-xs text-[#71717A] group-hover:text-[#22285E]">{selected.phone}</span>
                </a>
              </div>

              {/* Poin & Level */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2">Poin & Level Member</p>
                <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-4`}>
                  {/* Poin */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-2xl font-black text-[#22285E]">{selected.poin.toLocaleString('id')}</span>
                      <span className="text-xs text-[#A1A1AA]">poin</span>
                    </div>
                    <span className={`text-xs font-black flex items-center gap-1 ${cfg.text}`}>
                      <Icon className="text-xs" /> {selected.member}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-white/70 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${cfg.bar} rounded-full transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Keterangan progress */}
                  {cfg.next ? (
                    <p className="text-[10px] text-[#A1A1AA]">
                      Butuh <span className="font-bold text-[#22285E]">{sisaPoin.toLocaleString('id')} poin</span> lagi untuk naik ke level berikutnya
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#9E4BDC] font-bold">✨ Level Platinum — tertinggi di Na_store.id!</p>
                  )}
                </div>
              </div>

              {/* Statistik belanja */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2">Statistik Belanja</p>
                {[
                  { label: 'Total Belanja',       val: `Rp ${selected.totalBelanja?.toLocaleString('id')}`,                                                icon: FaShoppingBag },
                  { label: 'Jumlah Transaksi',    val: `${selected.transaksi}x`,                                                                           icon: FaPhone       },
                  { label: 'Rata-rata/Transaksi', val: `Rp ${Math.round((selected.totalBelanja || 0) / (selected.transaksi || 1)).toLocaleString('id')}`,  icon: FaStar        },
                  { label: 'Status Akun',         val: selected.status,                                                                                    icon: FaUsers       },
                ].map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-[#E4E4E7] last:border-0">
                      <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                        <RowIcon className="text-[#95D5B6] text-[10px]" />{row.label}
                      </span>
                      <span className={`text-xs font-bold ${
                        row.label === 'Status Akun'
                          ? selected.status === 'Aktif' ? 'text-[#00B5AD]' : 'text-[#A1A1AA]'
                          : 'text-[#22285E]'
                      }`}>
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Aksi */}
              <div className="space-y-2 pt-4">
                <Button variant="primary" className="w-full" icon={<FaWhatsapp />}
                  onClick={() => window.open(`https://wa.me/${selected.phone?.replace(/\D/g, '')}`, '_blank')}>
                  Kirim Pesan WA
                </Button>
                <Button variant="outline" className="w-full" icon={<FaEdit />}
                  onClick={() => openEdit(selected)}>
                  Edit Data Pelanggan
                </Button>
                <Button variant="warning" className="w-full" icon={<FaTrash />}
                  onClick={() => setHapusTarget(selected)}>
                  Hapus Pelanggan
                </Button>
              </div>

              </div>
              </ScrollArea>
            </Card>
          );
        })()}
      </div>

      {/* ── Modal Edit Pelanggan ── */}
      {editTarget && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#22285E] rounded-xl flex items-center justify-center shrink-0">
                  <FaEdit className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Edit Pelanggan</p>
                  <p className="text-[10px] text-[#A1A1AA]">Perbarui data {editTarget.name}</p>
                </div>
              </div>
              <button onClick={() => setEditTarget(null)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <Input
                ref={nameInputRef}
                label="Nama Lengkap"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="cth: Siti Rahma"
                icon={FaUser}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="cth: siti@email.com"
                icon={FaEnvelope}
              />
              <Input
                label="No. WhatsApp"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                placeholder="cth: 08123456789"
                icon={FaWhatsapp}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Level Member</label>
                  <select
                    name="member"
                    value={editForm.member}
                    onChange={handleEditChange}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none appearance-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                  >
                    {['Reguler', 'Silver', 'Gold', 'Platinum'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none appearance-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                  >
                    {['Aktif', 'Tidak Aktif'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              {editForm.member && (() => {
                const cfg  = MEMBER_CONFIG[editForm.member];
                const Icon = cfg?.icon;
                return (
                  <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
                    <span className="text-[10px] text-[#A1A1AA]">Level:</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${cfg?.badge}`}>
                      {Icon && <Icon className="text-[9px]" />}
                      {editForm.member}
                    </span>
                  </div>
                );
              })()}
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setEditTarget(null)}>
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

      {/* ── Modal Konfirmasi Hapus Pelanggan ── */}
      {hapusTarget && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setHapusTarget(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#F24E1E]/10 rounded-2xl flex items-center justify-center mx-auto">
                <FaTrash className="text-[#F24E1E] text-xl" />
              </div>
              <div>
                <p className="text-base font-black text-[#22285E]">Hapus Pelanggan?</p>
                <p className="text-sm text-[#71717A] mt-1">
                  Pelanggan <span className="font-bold text-[#22285E]">"{hapusTarget.name}"</span> akan dihapus secara permanen.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setHapusTarget(null)}>
                  Batal
                </Button>
                <Button variant="warning" className="flex-1" icon={<FaTrash className="text-xs" />} onClick={handleHapus}>
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal Tambah Pelanggan ── */}
      {showForm && createPortal(        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center shrink-0">
                  <FaUserPlus className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Tambah Pelanggan Baru</p>
                  <p className="text-[10px] text-[#A1A1AA]">Isi data pelanggan Na_store.id</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>

            <form onSubmit={handleTambahPelanggan} className="p-6 space-y-4">
              <Input
                ref={nameInputRef}
                label="Nama Lengkap"
                name="name"
                value={formPelanggan.name}
                onChange={handleFormChange}
                placeholder="cth: Siti Rahma"
                icon={FaUser}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formPelanggan.email}
                onChange={handleFormChange}
                placeholder="cth: siti@email.com"
                icon={FaEnvelope}
              />
              <Input
                label="No. WhatsApp"
                name="phone"
                value={formPelanggan.phone}
                onChange={handleFormChange}
                placeholder="cth: 08123456789"
                icon={FaWhatsapp}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Level Member</label>
                  <select
                    name="member"
                    value={formPelanggan.member}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none appearance-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                  >
                    {['Reguler', 'Silver', 'Gold', 'Platinum'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Status</label>
                  <select
                    name="status"
                    value={formPelanggan.status}
                    onChange={handleFormChange}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none appearance-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                  >
                    {['Aktif', 'Tidak Aktif'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview badge member */}
              {formPelanggan.member && (() => {
                const cfg  = MEMBER_CONFIG[formPelanggan.member];
                const Icon = cfg?.icon;
                return (
                  <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
                    <span className="text-[10px] text-[#A1A1AA]">Level:</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${cfg?.badge}`}>
                      {Icon && <Icon className="text-[9px]" />}
                      {formPelanggan.member}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] ml-auto">0 poin · 0 transaksi</span>
                  </div>
                );
              })()}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" icon={<FaUserPlus className="text-xs" />}>
                  Simpan Pelanggan
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Toast Notifikasi ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

    </div>
  );
}
