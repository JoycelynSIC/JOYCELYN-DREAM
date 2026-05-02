import React, { useState } from 'react';
import customerData from '../data/customer.json';
import PageHeader from '../components/PageHeader';
import {
  FaSearch, FaStar, FaCrown, FaUserPlus, FaEnvelope, FaWhatsapp,
  FaUsers, FaGem, FaShoppingBag, FaEdit, FaPhone
} from 'react-icons/fa';

/* ── helpers ── */
const tierInfo = (poin) => {
  if (poin >= 3000) return { label: 'Diamond', icon: FaGem,    bg: 'bg-blue-50',   text: 'text-blue-500',   bar: 'bg-blue-300',   next: 6000 };
  if (poin >= 1000) return { label: 'Gold',    icon: FaCrown,  bg: 'bg-yellow-50', text: 'text-yellow-500', bar: 'bg-yellow-300', next: 3000 };
  if (poin >= 500)  return { label: 'Silver',  icon: FaStar,   bg: 'bg-gray-50',   text: 'text-gray-400',   bar: 'bg-gray-300',   next: 1000 };
  return                   { label: 'Bronze',  icon: FaStar,   bg: 'bg-orange-50', text: 'text-orange-400', bar: 'bg-orange-300', next: 500  };
};

const typeStyle = {
  VIP:     'bg-yellow-50 text-yellow-600 border border-yellow-200',
  Regular: 'bg-primary text-on-primary border border-primary',
  New:     'bg-secondary text-gray-500 border border-secondary',
};

const avatarBg = [
  'bg-primary text-on-primary',
  'bg-accent/30 text-on-primary',
  'bg-secondary text-gray-600',
  'bg-yellow-100 text-yellow-600',
  'bg-blue-50 text-blue-400',
];

export default function Customers() {
  /** Deklarasi state — Best Practice (Pertemuan 4) **/
  const [dataForm, setDataForm] = useState({
    search:     '',
    filterType: 'Semua',
  });
  const [selected, setSelected] = useState(customerData[0]);

  /** Inisialisasi Handle perubahan nilai input form **/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  /** Deklarasi Logic Search & Filter **/
  const _search = dataForm.search.toLowerCase();

  const filtered = customerData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(_search) || c.email.toLowerCase().includes(_search);
    const matchType   = dataForm.filterType === 'Semua' || c.type === dataForm.filterType;
    return matchSearch && matchType;
  });

  const totalPoin = customerData.reduce((a, c) => a + c.poin, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader title="Pelanggan" breadcrumb={['Dashboard', 'Pelanggan']}>
        <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary-hover transition-all active:scale-95 shrink-0">
          <FaUserPlus className="text-xs" /> Tambah Pelanggan
        </button>
      </PageHeader>

      {/* ── Stat Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pelanggan', val: customerData.length,                               icon: FaUsers,    bg: 'bg-white',       iconBg: 'bg-soft',      iconColor: 'text-primary'    },
          { label: 'VIP',             val: customerData.filter(c=>c.type==='VIP').length,      icon: FaCrown,    bg: 'bg-yellow-50',   iconBg: 'bg-white',     iconColor: 'text-yellow-500' },
          { label: 'Regular',         val: customerData.filter(c=>c.type==='Regular').length,  icon: FaShoppingBag, bg: 'bg-secondary', iconBg: 'bg-white',  iconColor: 'text-on-primary' },
          { label: 'Total Poin',      val: totalPoin.toLocaleString('id'),                    icon: FaStar,     bg: 'bg-primary',     iconBg: 'bg-white/40',  iconColor: 'text-yellow-400' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${s.bg} border border-secondary rounded-2xl p-4 flex items-center gap-3`}>
              <div className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`${s.iconColor} text-sm`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                <p className="text-xl font-black text-gray-700">{s.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tier Info ── */}
      <div className="bg-white border border-secondary rounded-3xl p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Sistem Tier Poin</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { tier: 'Bronze',  range: '0 – 499',       icon: FaStar, iconColor: 'text-orange-400', bg: 'bg-orange-50',  text: 'text-orange-400' },
            { tier: 'Silver',  range: '500 – 999',     icon: FaStar, iconColor: 'text-gray-400',   bg: 'bg-gray-50',    text: 'text-gray-400'   },
            { tier: 'Gold',    range: '1.000 – 2.999', icon: FaCrown,iconColor: 'text-yellow-500', bg: 'bg-yellow-50',  text: 'text-yellow-500' },
            { tier: 'Diamond', range: '3.000+',        icon: FaGem,  iconColor: 'text-blue-400',   bg: 'bg-blue-50',    text: 'text-blue-400'   },
          ].map(t => {
            const TierIcon = t.icon;
            return (
              <div key={t.tier} className={`${t.bg} rounded-2xl p-3 flex items-center gap-3`}>
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <TierIcon className={`${t.iconColor} text-sm`} />
                </div>
                <div>
                  <p className={`text-sm font-black ${t.text}`}>{t.tier}</p>
                  <p className="text-[10px] text-gray-400">{t.range} poin</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-500 bg-soft rounded-xl px-4 py-2.5 flex items-center gap-2">
          <FaStar className="text-yellow-400 shrink-0" />
          Setiap pembelian <span className="font-bold text-gray-700 mx-1">Rp 1.000 = 1 poin</span>. Poin bisa ditukar diskon atau Free Gift pada transaksi berikutnya.
        </p>
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* ── LEFT: Tabel ── */}
        <div className="lg:col-span-2 bg-white border border-secondary rounded-3xl overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-soft">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3 text-gray-300 text-xs" />
              <input
                type="text"
                name="search"
                placeholder="Cari nama atau email..."
                onChange={handleChange}
                className="w-full bg-soft rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['Semua','VIP','Regular','New'].map(t => (
                <button key={t} onClick={() => setDataForm({ ...dataForm, filterType: t })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    dataForm.filterType === t ? 'bg-primary text-on-primary' : 'bg-soft text-gray-400 hover:text-gray-600'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-soft">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pelanggan</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tipe</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Poin</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Transaksi</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const tier     = tierInfo(c.poin);
                  const TierIcon = tier.icon;
                  const isActive = selected?.id === c.id;
                  return (
                    <tr key={c.id} onClick={() => setSelected(c)}
                      className={`border-b border-soft last:border-0 cursor-pointer transition-colors ${
                        isActive ? 'bg-primary/10' : 'hover:bg-soft/60'
                      }`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ${avatarBg[idx % avatarBg.length]}`}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-700 leading-tight">{c.name}</p>
                            <p className="text-[10px] text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${typeStyle[c.type]}`}>
                          {c.type === 'VIP' && <FaCrown className="text-yellow-500 text-[9px]" />}
                          {c.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <FaStar className="text-yellow-400 text-[10px] shrink-0" />
                          <span className="text-sm font-black text-gray-700">{c.poin.toLocaleString('id')}</span>
                        </div>
                        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${tier.text}`}>
                          <TierIcon className="text-[9px]" />{tier.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-sm font-bold text-gray-600">
                          <FaShoppingBag className="text-primary text-[10px]" />{c.transaksi}x
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          c.status === 'Aktif' ? 'bg-primary text-on-primary' : 'bg-soft text-gray-400'
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
                <FaSearch className="text-3xl text-secondary mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-400">Pelanggan tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail Panel ── */}
        {selected && (() => {
          const tier     = tierInfo(selected.poin);
          const TierIcon = tier.icon;
          const ts       = typeStyle[selected.type];
          const idx      = customerData.findIndex(c => c.id === selected.id);
          const poinPct  = Math.min((selected.poin / tier.next) * 100, 100);
          const sisaPoin = tier.next - selected.poin;

          return (
            <div className="bg-white border border-secondary rounded-3xl p-6 space-y-5 sticky top-4">

              {/* Avatar + nama */}
              <div className="text-center pb-4 border-b border-soft">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black mx-auto mb-3 ${avatarBg[idx % avatarBg.length]}`}>
                  {selected.name.charAt(0)}
                </div>
                <h3 className="text-base font-black text-gray-700">{selected.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 mt-1.5 ${ts}`}>
                  {selected.type === 'VIP' && <FaCrown className="text-yellow-500 text-[9px]" />}
                  {selected.type}
                </span>
                <p className="text-[10px] text-gray-400 mt-1.5">Bergabung {selected.bergabung}</p>
              </div>

              {/* Kontak */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kontak</p>
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-soft transition-colors group">
                  <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-on-primary text-xs" />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-gray-800">{selected.email}</span>
                </a>
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-soft transition-colors group">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <FaWhatsapp className="text-on-primary text-xs" />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-gray-800">{selected.phone}</span>
                </a>
              </div>

              {/* Poin & Tier */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Poin & Tier</p>
                <div className={`${tier.bg} rounded-2xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-2xl font-black text-gray-700">{selected.poin.toLocaleString('id')}</span>
                      <span className="text-xs text-gray-400">poin</span>
                    </div>
                    <span className={`text-xs font-black flex items-center gap-1 ${tier.text}`}>
                      <TierIcon className="text-xs" />{tier.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden mb-1.5">
                    <div className={`h-full ${tier.bar} rounded-full transition-all duration-1000`} style={{ width: `${poinPct}%` }} />
                  </div>
                  {selected.poin < 6000
                    ? <p className="text-[10px] text-gray-400">Butuh <span className="font-bold text-gray-600">{sisaPoin.toLocaleString('id')} poin</span> lagi ke tier berikutnya</p>
                    : <p className="text-[10px] text-gray-400">Tier tertinggi tercapai 🎉</p>
                  }
                </div>
              </div>

              {/* Statistik */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Statistik Belanja</p>
                {[
                  { label: 'Total Belanja',       val: `Rp ${selected.totalBelanja.toLocaleString('id')}`, icon: FaShoppingBag },
                  { label: 'Jumlah Transaksi',    val: `${selected.transaksi}x`,                           icon: FaPhone       },
                  { label: 'Rata-rata/Transaksi', val: `Rp ${Math.round(selected.totalBelanja / selected.transaksi).toLocaleString('id')}`, icon: FaStar },
                  { label: 'Status Akun',         val: selected.status,                                    icon: FaUsers       },
                ].map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-soft last:border-0">
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <RowIcon className="text-secondary text-[10px]" />{row.label}
                      </span>
                      <span className={`text-xs font-bold ${row.label === 'Status Akun' ? (selected.status === 'Aktif' ? 'text-on-primary' : 'text-gray-400') : 'text-gray-700'}`}>
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Aksi */}
              <div className="space-y-2 pt-1">
                <button className="w-full py-2.5 rounded-2xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2">
                  <FaWhatsapp /> Kirim Pesan WA
                </button>
                <button className="w-full py-2.5 rounded-2xl text-xs font-bold border border-secondary text-gray-400 hover:bg-soft transition-all flex items-center justify-center gap-2">
                  <FaEdit /> Edit Data Pelanggan
                </button>
              </div>

            </div>
          );
        })()}
      </div>

    </div>
  );
}
