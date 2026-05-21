import { useState } from 'react';
import customerData from '../data/customer.json';
import PageHeader    from '../components/PageHeader';
import StatCard      from '../components/StatCard';
import Card          from '../components/Card';
import Button        from '../components/Button';
import Input         from '../components/Input';
import AvatarGroup   from '../components/AvatarGroup';
import CustomerCard  from '../components/CustomerCard';
import {
  FaSearch, FaStar, FaCrown, FaUserPlus, FaEnvelope,
  FaWhatsapp, FaUsers, FaGem, FaShoppingBag, FaEdit, FaPhone,
  FaMedal, FaThLarge, FaList,
} from 'react-icons/fa';

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
  const [dataForm, setDataForm] = useState({ search: '', filterMember: 'Semua' });
  const [selected, setSelected] = useState(customerData[0]);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const _search  = dataForm.search.toLowerCase();
  const filtered = customerData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(_search) || c.email.toLowerCase().includes(_search);
    const matchMember = dataForm.filterMember === 'Semua' || c.member === dataForm.filterMember;
    return matchSearch && matchMember;
  });

  const totalPoin = customerData.reduce((a, c) => a + c.poin, 0);
  const countByMember = (m) => customerData.filter(c => c.member === m).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      {/* ── Header ── */}
      <PageHeader title="Pelanggan" breadcrumb={['Dashboard', 'Pelanggan']}>
        <Button variant="primary" icon={<FaUserPlus className="text-xs" />}>
          Tambah Pelanggan
        </Button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Pelanggan" value={customerData.length} desc="terdaftar"
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
            const members  = customerData.filter(c => c.member === member);
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
              placeholder="Cari nama atau email..."
              icon={FaSearch}
              value={dataForm.search}
              onChange={(e) => setDataForm(p => ({ ...p, search: e.target.value }))}
              className="flex-1 !gap-0"
            />
            <div className="flex gap-1.5 flex-wrap">
              {['Semua', 'Platinum', 'Gold', 'Silver', 'Reguler'].map(m => (
                <Button
                  key={m} size="sm"
                  variant={dataForm.filterMember === m ? 'primary' : 'ghost'}
                  onClick={() => setDataForm(p => ({ ...p, filterMember: m }))}
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
                  {filtered.map((c) => (
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
                  {['Pelanggan', 'Level Member', 'Poin', 'Transaksi', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const cfg    = MEMBER_CONFIG[c.member] ?? MEMBER_CONFIG.Reguler;
                  const Icon   = cfg.icon;
                  const isActive = selected?.id === c.id;
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
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
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
        </Card>

        {/* RIGHT: Detail Panel */}
        {selected && (() => {
          const cfg    = MEMBER_CONFIG[selected.member] ?? MEMBER_CONFIG.Reguler;
          const Icon   = cfg.icon;
          const idx    = customerData.findIndex(c => c.id === selected.id);
          const pct    = poinProgress(selected.poin, selected.member);
          const sisaPoin = cfg.next ? cfg.next - selected.poin : 0;

          return (
            <Card className="sticky top-4">

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
                <Button variant="primary" className="w-full" icon={<FaWhatsapp />}>
                  Kirim Pesan WA
                </Button>
                <Button variant="outline" className="w-full" icon={<FaEdit />}>
                  Edit Data Pelanggan
                </Button>
              </div>

            </Card>
          );
        })()}
      </div>

    </div>
  );
}
