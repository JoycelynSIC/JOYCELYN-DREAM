import { useState } from 'react';
import ordersData from '../data/orders.json';
import PageHeader from '../components/PageHeader';
import {
  FaShoppingBag, FaSearch, FaFilter, FaCheckCircle, FaTruck,
  FaSpinner, FaTimesCircle, FaStar, FaBoxOpen, FaEye, FaTimes,
  FaUser, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave,
  FaPlus
} from 'react-icons/fa';

const statusConfig = {
  Selesai: { style: 'bg-status-success/10 text-status-success border border-status-success/20', icon: FaCheckCircle },
  Proses:  { style: 'bg-surface-neutral text-text-light border border-surface-border',          icon: FaSpinner     },
  Dikirim: { style: 'bg-secondary/20 text-text-dark border border-secondary/30',                icon: FaTruck       },
  Batal:   { style: 'bg-status-warning/10 text-status-warning border border-status-warning/20', icon: FaTimesCircle },
};

export default function Orders() {
  const [orders, setOrders]     = useState(ordersData);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [dataForm, setDataForm] = useState({ search: '', filterStatus: 'Semua' });

  const [formPesanan, setFormPesanan] = useState({
    customer: '', produk: '', qty: 1, total: '', status: 'Proses',
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    alamat: '', metode: 'Transfer BCA',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormPesanan({ ...formPesanan, [name]: value });
  };

  const _search = dataForm.search.toLowerCase();
  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(_search)
      || o.id.toLowerCase().includes(_search)
      || o.produk.toLowerCase().includes(_search);
    const matchStatus = dataForm.filterStatus === 'Semua' || o.status === dataForm.filterStatus;
    return matchSearch && matchStatus;
  });

  const totalOmzet   = orders.filter(o => o.status !== 'Batal').reduce((a, o) => a + o.total, 0);
  const totalSelesai = orders.filter(o => o.status === 'Selesai').length;
  const totalProses  = orders.filter(o => o.status === 'Proses').length;
  const totalDikirim = orders.filter(o => o.status === 'Dikirim').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formPesanan.customer || !formPesanan.produk || !formPesanan.total || !formPesanan.alamat) return;
    const newOrder = {
      ...formPesanan,
      id:    `#ORD-${String(orders.length + 1).padStart(3, '0')}`,
      qty:   Number(formPesanan.qty),
      total: Number(formPesanan.total),
      poin:  formPesanan.status === 'Batal' ? 0 : Math.floor(Number(formPesanan.total) / 1000),
    };
    setOrders(prev => [newOrder, ...prev]);
    setFormPesanan({
      customer: '', produk: '', qty: 1, total: '', status: 'Proses',
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      alamat: '', metode: 'Transfer BCA',
    });
    setShowForm(false);
  };

  const inputClass = "w-full bg-surface-gray border border-surface-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-text-disable text-text-light";

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Pesanan" breadcrumb={['Dashboard', 'Pesanan']}>
        <p className="text-xs text-text-disable mr-2 hidden sm:block">
          {orders.length} pesanan · Omzet Rp {totalOmzet.toLocaleString('id')}
        </p>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-surface-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shrink-0">
          <FaPlus className="text-xs" /> Tambah Pesanan
        </button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pesanan', val: orders.length,  icon: FaShoppingBag, bg: 'bg-surface-white',  iconBg: 'bg-surface-gray',     iconColor: 'text-primary'        },
          { label: 'Selesai',       val: totalSelesai,   icon: FaCheckCircle, bg: 'bg-status-success/5 border-status-success/20', iconBg: 'bg-status-success/10', iconColor: 'text-status-success' },
          { label: 'Dikirim',       val: totalDikirim,   icon: FaTruck,       bg: 'bg-secondary/10',   iconBg: 'bg-surface-white',    iconColor: 'text-status-success' },
          { label: 'Diproses',      val: totalProses,    icon: FaSpinner,     bg: 'bg-surface-neutral', iconBg: 'bg-surface-white',   iconColor: 'text-text-disable'   },
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

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* LEFT: Tabel */}
        <div className={`bg-surface-white border border-surface-border rounded-2xl overflow-hidden ${selected ? 'lg:col-span-2' : ''}`}>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-surface-border">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3 text-text-disable text-xs" />
              <input type="text" name="search" placeholder="Cari ID, nama, atau produk..."
                onChange={handleChange}
                className="w-full bg-surface-gray border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-text-disable text-text-light"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-text-disable text-xs shrink-0" />
              {['Semua', 'Selesai', 'Dikirim', 'Proses', 'Batal'].map(s => (
                <button key={s} onClick={() => setDataForm({ ...dataForm, filterStatus: s })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    dataForm.filterStatus === s
                      ? 'bg-primary text-surface-white'
                      : 'bg-surface-neutral border border-surface-border text-text-disable hover:text-text-light'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-neutral border-b border-surface-border">
                  {['ID Pesanan', 'Pelanggan', 'Produk', 'Total', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-disable">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const sc = statusConfig[o.status];
                  const StatusIcon = sc.icon;
                  const isActive = selected?.id === o.id;
                  return (
                    <tr key={o.id}
                      className={`border-b border-surface-border last:border-0 transition-colors ${
                        isActive ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-neutral/60'
                      }`}>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{o.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-bold text-text-dark leading-tight">{o.customer}</p>
                        <p className="text-[10px] text-text-disable">{o.tanggal}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-secondary/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            {o.gambar
                              ? <img src={o.gambar} alt={o.produk} className="w-full h-full object-cover" />
                              : <FaBoxOpen className="text-status-success text-[10px]" />
                            }
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-dark leading-tight">{o.produk}</p>
                            <p className="text-[10px] text-text-disable">{o.qty} pcs</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-black text-text-dark">Rp {o.total.toLocaleString('id')}</p>
                        {o.poin > 0 && (
                          <p className="text-[10px] text-status-success font-semibold flex items-center gap-0.5">
                            <FaStar className="text-yellow-400 text-[8px]" />+{o.poin} poin
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${sc.style}`}>
                          <StatusIcon className="text-[9px]" />{o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setSelected(isActive ? null : o)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-primary text-surface-white'
                              : 'bg-surface-gray border border-surface-border text-text-disable hover:bg-secondary/20 hover:text-status-success'
                          }`}>
                          {isActive ? <FaTimes className="text-[10px]" /> : <FaEye className="text-[10px]" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <FaSearch className="text-3xl text-text-disable mx-auto mb-2" />
                <p className="text-sm font-bold text-text-disable">Pesanan tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Detail Panel */}
        {selected && (() => {
          const sc = statusConfig[selected.status];
          const StatusIcon = sc.icon;
          return (
            <div className="bg-surface-white border border-surface-border rounded-2xl p-6 space-y-5 sticky top-4 h-fit">
              <div className="flex items-start justify-between pb-4 border-b border-surface-border">
                <div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg">{selected.id}</span>
                  <p className="text-[10px] text-text-disable mt-1.5 flex items-center gap-1">
                    <FaCalendarAlt className="text-secondary" />{selected.tanggal}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${sc.style}`}>
                  <StatusIcon className="text-[9px]" />{selected.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Pelanggan</p>
                <div className="flex items-center gap-3 p-3 bg-surface-gray border border-surface-border rounded-xl">
                  <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-sm font-black text-surface-white shrink-0">
                    {selected.customer.charAt(0)}
                  </div>
                  <p className="text-sm font-bold text-text-dark">{selected.customer}</p>
                </div>
                <div className="flex items-start gap-2 px-1">
                  <FaMapMarkerAlt className="text-primary text-xs mt-0.5 shrink-0" />
                  <p className="text-xs text-text-light">{selected.alamat}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Detail Produk</p>
                <div className="flex items-center gap-3 p-3 border border-surface-border rounded-xl">
                  <div className="w-14 h-14 bg-secondary/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {selected.gambar
                      ? <img src={selected.gambar} alt={selected.produk} className="w-full h-full object-cover" />
                      : <FaBoxOpen className="text-status-success text-sm" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">{selected.produk}</p>
                    <p className="text-[10px] text-text-disable">{selected.qty} pcs</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable mb-2">Pembayaran</p>
                {[
                  { label: 'Metode', val: selected.metode,                             icon: FaMoneyBillWave },
                  { label: 'Total',  val: `Rp ${selected.total.toLocaleString('id')}`, icon: FaShoppingBag   },
                  { label: 'Poin',   val: selected.poin > 0 ? `+${selected.poin} poin` : '-', icon: FaStar  },
                ].map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
                      <span className="text-xs text-text-disable flex items-center gap-1.5">
                        <RowIcon className="text-secondary text-[10px]" />{row.label}
                      </span>
                      <span className={`text-xs font-bold ${row.label === 'Poin' && selected.poin > 0 ? 'text-status-success' : 'text-text-dark'}`}>
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-1">
                {selected.status === 'Proses' && (
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-surface-white hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <FaTruck className="text-xs" /> Tandai Dikirim
                  </button>
                )}
                {selected.status === 'Dikirim' && (
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-status-success text-surface-white hover:bg-status-success/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-xs" /> Tandai Selesai
                  </button>
                )}
                <button className="w-full py-2.5 rounded-xl text-xs font-bold border border-surface-border text-text-light hover:bg-surface-neutral transition-all flex items-center justify-center gap-2">
                  <FaUser className="text-xs" /> Lihat Profil Pelanggan
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Modal Tambah Pesanan ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-2xl shadow-2xl w-full max-w-md border border-surface-border animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaShoppingBag className="text-surface-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-text-dark">Tambah Pesanan Baru</p>
                  <p className="text-[10px] text-text-disable">Isi data transaksi pelanggan</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-surface-gray border border-surface-border rounded-xl flex items-center justify-center hover:bg-status-warning/10 hover:text-status-warning transition-colors text-text-disable">
                <FaTimes className="text-xs" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Nama Pelanggan</label>
                <input type="text" name="customer" value={formPesanan.customer} onChange={handleFormChange} required
                  placeholder="cth: Dewi Lestari" className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Produk</label>
                <input type="text" name="produk" value={formPesanan.produk} onChange={handleFormChange} required
                  placeholder="cth: Kalung Titanium Rosegold" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Qty (pcs)</label>
                  <input type="number" name="qty" value={formPesanan.qty} onChange={handleFormChange} min="1" required className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Total (Rp)</label>
                  <input type="number" name="total" value={formPesanan.total} onChange={handleFormChange} required
                    placeholder="85000" className={inputClass} />
                </div>
              </div>

              {formPesanan.total && (
                <div className="flex items-center gap-1.5 bg-status-success/10 border border-status-success/20 rounded-xl px-3 py-2">
                  <FaStar className="text-yellow-400 text-[10px] shrink-0" />
                  <span className="text-[11px] font-bold text-status-success">
                    +{Math.floor(Number(formPesanan.total) / 1000)} poin akan diberikan
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Alamat Pengiriman</label>
                <input type="text" name="alamat" value={formPesanan.alamat} onChange={handleFormChange} required
                  placeholder="cth: Jl. Merdeka No. 12, Perawang" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Metode Bayar</label>
                  <select name="metode" value={formPesanan.metode} onChange={handleFormChange} className={inputClass}>
                    {['Transfer BCA', 'Transfer BRI', 'Transfer BNI', 'GoPay', 'OVO', 'COD'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Status</label>
                  <select name="status" value={formPesanan.status} onChange={handleFormChange} className={inputClass}>
                    {['Proses', 'Dikirim', 'Selesai', 'Batal'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold border border-surface-border text-text-light hover:bg-surface-neutral transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-surface-white hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <FaPlus className="text-xs" /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
