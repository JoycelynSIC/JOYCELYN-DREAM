import { useState } from 'react';
import customerData from '../data/customer.json';
import PageHeader from '../components/PageHeader';
import {
  FaSearch, FaStar, FaCrown, FaUserPlus, FaEnvelope, FaWhatsapp,
  FaUsers, FaGem, FaShoppingBag, FaEdit, FaPhone
} from 'react-icons/fa';

/* ── helpers ── */
const tierInfo = (poin) => {
  if (poin >= 3000) return { label: 'Diamond', icon: FaGem,    bg: 'bg-blue-50',    text: 'text-blue-500',   bar: 'bg-blue-400',   next: 6000 };
  if (poin >= 1000) return { label: 'Gold',    icon: FaCrown,  bg: 'bg-yellow-50',  text: 'text-yellow-500', bar: 'bg-yellow-400', next: 3000 };
  if (poin >= 500)  return { label: 'Silver',  icon: FaStar,   bg: 'bg-surface-gray', text: 'text-text-light', bar: 'bg-text-disable', next: 1000 };
  return                   { label: 'Bronze',  icon: FaStar,   bg: 'bg-orange-50',  text: 'text-orange-400', bar: 'bg-orange-300', next: 500  };
};

const typeStyle = {
  VIP:     'bg-yellow-50 text-yellow-600 border border-yellow-200',
  Regular: 'bg-primary/10 text-primary border border-primary/20',
  New:     'bg-secondary/20 text-text-dark border border-surface-border',
};

const avatarColors = [
  'bg-primary text-surface-white',
  'bg-status-warning/20 text-status-warning',
  'bg-secondary/40 text-text-dark',
  'bg-yellow-100 text-yellow-600',
  'bg-blue-100 text-blue-500',
];

export default function Customers() {
  const [dataForm, setDataForm] = useState({ search: '', filterType: 'Semua' });
  const [selected, setSelected] = useState(customerData[0]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const _search = dataForm.search.toLowerCase();
  const filtered = customerData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(_search) || c.email.toLowerCase().includes(_search);
    const matchType   = dataForm.filterType === 'Semua' || c.type === dataForm.filterType;
    return matchSearch && matchType;
  });

  const totalPoin = customerData.reduce((a, c) => a + c.poin, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Pelanggan" breadcrumb={['Dashboard', 'Pelanggan']}>
        <button className="flex items-center gap-2 bg-primary text-surface-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shrink-0">
          <FaUserPlus className="text-xs" /> Tambah Pelanggan
        </button>
      </PageHeader>

      {/* ── Stat Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pelanggan', val: customerData.length,                              icon: FaUsers,       bg: 'bg-surface-white',  iconBg: 'bg-surface-gray',    iconColor: 'text-primary'        },
          { label: 'VIP',             val: customerData.filter(c=>c.type==='VIP').length,     icon: FaCrown,       bg: 'bg-yellow-50',      iconBg: 'bg-surface-white',   iconColor: 'text-yellow-500'     },
          { label: 'Regular',         val: customerData.filter(c=>c.type==='Regular').length, icon: FaShoppingBag, bg: 'bg-secondary/10',   iconBg: 'bg-surface-white',   iconColor: 'text-status-success' },
          { label: 'Total Poin',      val: totalPoin.toLocaleString('id'),                   icon: FaStar,        bg: 'bg-primary',        iconBg: 'bg-surface-white/20', iconColor: 'text-yellow-300'    },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${s.bg} border border-surface-border rounded-2xl p-4 flex items-center gap-3`}>
              <div className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`${s.iconColor} text-sm`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">{s.label}</p>
                <p className="text-xl font-black text-text-dark">{s.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tier Info ── */}
      <div className="bg-surface-white border border-surface-border rounded-2xl p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable mb-3">Sistem Tier Poin</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { tier: 'Bronze',  range: '0 – 499',       icon: FaStar,  iconColor: 'text-orange-400', bg: 'bg-orange-50',   text: 'text-orange-500' },
            { tier: 'Silver',  range: '500 – 999',     icon: FaStar,  iconColor: 'text-text-light', bg: 'bg-surface-gray', text: 'text-text-light' },
            { tier: 'Gold',    range: '1.000 – 2.999', icon: FaCrown, iconColor: 'text-yellow-500', bg: 'bg-yellow-50',   text: 'text-yellow-600' },
            { tier: 'Diamond', range: '3.000+',        icon: FaGem,   iconColor: 'text-blue-400',   bg: 'bg-blue-50',     text: 'text-blue-500'   },
          ].map(t => {
            const TierIcon = t.icon;
            return (
              <div key={t.tier} className={`${t.bg} border border-surface-border rounded-xl p-3 flex items-center gap-3`}>
                <div className="w-8 h-8 bg-surface-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <TierIcon className={`${t.iconColor} text-sm`} />
                </div>
                <div>
                  <p className={`text-sm font-black ${t.text}`}>{t.tier}</p>
                  <p className="text-[10px] text-text-disable">{t.range} poin</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-text-light bg-surface-neutral border border-surface-border rounded-xl px-4 py-2.5 flex items-center gap-2">
          <FaStar className="text-yellow-400 shrink-0" />
          Setiap pembelian <span className="font-bold text-text-dark mx-1">Rp 1.000 = 1 poin</span>. Poin bisa ditukar diskon atau Free Gift.
        </p>
      </div>

      {/* ── Main 2-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* LEFT: Tabel */}
        <div className="lg:col-span-2 bg-surface-white border border-surface-border rounded-2xl overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-surface-border">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3 text-text-disable text-xs" />
              <input
                type="text"
                name="search"
                placeholder="Cari nama atau email..."
                onChange={handleChange}
                className="w-full bg-surface-gray border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-text-disable text-text-light"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['Semua', 'VIP', 'Regular', 'New'].map(t => (
                <button key={t} onClick={() => setDataForm({ ...dataForm, filterType: t })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    dataForm.filterType === t
                      ? 'bg-primary text-surface-white'
                      : 'bg-surface-neutral border border-surface-border text-text-disable hover:text-text-light'
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
                <tr className="bg-surface-neutral border-b border-surface-border">
                  {['Pelanggan', 'Tipe', 'Poin', 'Transaksi', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-disable">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const tier     = tierInfo(c.poin);
                  const TierIcon = tier.icon;
                  const isActive = selected?.id === c.id;
                  return (
                    <tr key={c.id} onClick={() => setSelected(c)}
                      className={`border-b border-surface-border last:border-0 cursor-pointer transition-colors ${
                        isActive ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-neutral/60'
                      }`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-dark leading-tight">{c.name}</p>
                            <p className="text-[10px] text-text-disable">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${typeStyle[c.type]}`}>
                          {c.type === 'VIP' && <FaCrown className="text-yellow-500 text-[9px]" />}
                          {c.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-[10px]" />
                          <span className="text-sm font-black text-text-dark">{c.poin.toLocaleString('id')}</span>
                        </div>
                        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${tier.text}`}>
                          <TierIcon className="text-[9px]" /> {tier.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-sm font-bold text-text-light">
                          <FaShoppingBag className="text-primary text-[10px]" />{c.transaksi}x
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          c.status === 'Aktif'
                            ? 'bg-status-success/10 text-status-success border border-status-success/20'
                            : 'bg-surface-neutral text-text-disable border border-surface-border'
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
                <FaSearch className="text-3xl text-text-disable mx-auto mb-2" />
                <p className="text-sm font-bold text-text-disable">Pelanggan tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Detail Panel */}
        {selected && (() => {
          const tier     = tierInfo(selected.poin);
          const TierIcon = tier.icon;
          const ts       = typeStyle[selected.type];
          const idx      = customerData.findIndex(c => c.id === selected.id);
          const poinPct  = Math.min((selected.poin / tier.next) * 100, 100);
          const sisaPoin = tier.next - selected.poin;

          return (
            <div className="bg-surface-white border border-surface-border rounded-2xl p-6 space-y-5 sticky top-4">

              {/* Avatar + nama */}
              <div className="text-center pb-4 border-b border-surface-border">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-3 ${avatarColors[idx % avatarColors.length]}`}>
                  {selected.name.charAt(0)}
                </div>
                <h3 className="text-base font-black text-text-dark">{selected.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 mt-1.5 ${ts}`}>
                  {selected.type === 'VIP' && <FaCrown className="text-yellow-500 text-[9px]" />}
                  {selected.type}
                </span>
                <p className="text-[10px] text-text-disable mt-1.5">Bergabung {selected.bergabung}</p>
              </div>

              {/* Kontak */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Kontak</p>
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-neutral transition-colors group">
                  <div className="w-7 h-7 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-status-success text-xs" />
                  </div>
                  <span className="text-xs text-text-light group-hover:text-text-dark truncate">{selected.email}</span>
                </a>
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-neutral transition-colors group">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <FaWhatsapp className="text-surface-white text-xs" />
                  </div>
                  <span className="text-xs text-text-light group-hover:text-text-dark">{selected.phone}</span>
                </a>
              </div>

              {/* Poin & Tier */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Poin & Tier</p>
                <div className={`${tier.bg} border border-surface-border rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-2xl font-black text-text-dark">{selected.poin.toLocaleString('id')}</span>
                      <span className="text-xs text-text-disable">poin</span>
                    </div>
                    <span className={`text-xs font-black flex items-center gap-1 ${tier.text}`}>
                      <TierIcon className="text-xs" /> {tier.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-white/70 rounded-full overflow-hidden mb-1.5">
                    <div className={`h-full ${tier.bar} rounded-full transition-all duration-1000`} style={{ width: `${poinPct}%` }} />
                  </div>
                  {selected.poin < 6000
                    ? <p className="text-[10px] text-text-disable">Butuh <span className="font-bold text-text-dark">{sisaPoin.toLocaleString('id')} poin</span> lagi ke tier berikutnya</p>
                    : <p className="text-[10px] text-text-disable">Tier tertinggi tercapai 🎉</p>
                  }
                </div>
              </div>

              {/* Statistik */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable mb-2">Statistik Belanja</p>
                {[
                  { label: 'Total Belanja',       val: `Rp ${selected.totalBelanja.toLocaleString('id')}`, icon: FaShoppingBag },
                  { label: 'Jumlah Transaksi',    val: `${selected.transaksi}x`,                           icon: FaPhone       },
                  { label: 'Rata-rata/Transaksi', val: `Rp ${Math.round(selected.totalBelanja / selected.transaksi).toLocaleString('id')}`, icon: FaStar },
                  { label: 'Status Akun',         val: selected.status,                                    icon: FaUsers       },
                ].map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
                      <span className="text-xs text-text-disable flex items-center gap-1.5">
                        <RowIcon className="text-secondary text-[10px]" />{row.label}
                      </span>
                      <span className={`text-xs font-bold ${
                        row.label === 'Status Akun'
                          ? selected.status === 'Aktif' ? 'text-status-success' : 'text-text-disable'
                          : 'text-text-dark'
                      }`}>
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Aksi */}
              <div className="space-y-2 pt-1">
                <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-surface-white hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <FaWhatsapp /> Kirim Pesan WA
                </button>
                <button className="w-full py-2.5 rounded-xl text-xs font-bold border border-surface-border text-text-light hover:bg-surface-neutral transition-all flex items-center justify-center gap-2">
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
