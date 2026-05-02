import React, { useState } from 'react';
import ordersData from '../data/orders.json';
import PageHeader from '../components/PageHeader';
import {
  FaShoppingBag, FaSearch, FaFilter, FaCheckCircle, FaTruck,
  FaSpinner, FaTimesCircle, FaStar, FaBoxOpen, FaEye, FaTimes,
  FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave,
  FaPlus
} from 'react-icons/fa';

const statusConfig = {
  Selesai: { style: 'bg-primary text-on-primary',    icon: FaCheckCircle  },
  Proses:  { style: 'bg-soft text-gray-500',         icon: FaSpinner      },
  Dikirim: { style: 'bg-secondary text-orange-600',  icon: FaTruck        },
  Batal:   { style: 'bg-accent/20 text-on-primary',  icon: FaTimesCircle  },
};

export default function Orders() {
  const [orders, setOrders]     = useState(ordersData);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /** Deklarasi state — Best Practice (Pertemuan 4) **/
  const [dataForm, setDataForm] = useState({
    search:       '',
    filterStatus: 'Semua',
  });

  /** State form tambah pesanan **/
  const [formPesanan, setFormPesanan] = useState({
    customer: '',
    produk:   '',
    qty:      1,
    total:    '',
    status:   'Proses',
    tanggal:  new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    alamat:   '',
    metode:   'Transfer BCA',
  });

  /** Inisialisasi Handle perubahan nilai input form **/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormPesanan({ ...formPesanan, [name]: value });
  };

  /** Deklarasi Logic Search & Filter **/
  const _search = dataForm.search.toLowerCase();

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(_search)
      || o.id.toLowerCase().includes(_search)
      || o.produk.toLowerCase().includes(_search);
    const matchStatus = dataForm.filterStatus === 'Semua' || o.status === dataForm.filterStatus;
    return matchSearch && matchStatus;
  });

  /* ── stats ── */
  const totalOmzet   = orders.filter(o => o.status !== 'Batal').reduce((a, o) => a + o.total, 0);
  const totalSelesai = orders.filter(o => o.status === 'Selesai').length;
  const totalProses  = orders.filter(o => o.status === 'Proses').length;
  const totalDikirim = orders.filter(o => o.status === 'Dikirim').length;

  /* ── submit form ── */
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
    setFormPesanan({ customer:'', produk:'', qty:1, total:'', status:'Proses',
      tanggal: new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }),
      alamat:'', metode:'Transfer BCA' });
    setShowForm(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <PageHeader title="Pesanan" breadcrumb={['Dashboard', 'Pesanan']}>
        <p className="text-xs text-gray-400 mr-2 hidden sm:block">
          {orders.length} pesanan · Omzet Rp {totalOmzet.toLocaleString('id')}
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary-hover transition-all active:scale-95 shrink-0"
        >
          <FaPlus className="text-xs" /> Tambah Pesanan
        </button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pesanan', val: orders.length,  icon: FaShoppingBag, bg: 'bg-white',     iconBg: 'bg-soft',      iconColor: 'text-primary'    },
          { label: 'Selesai',       val: totalSelesai,   icon: FaCheckCircle, bg: 'bg-primary',   iconBg: 'bg-white/40',  iconColor: 'text-on-primary' },
          { label: 'Dikirim',       val: totalDikirim,   icon: FaTruck,       bg: 'bg-secondary', iconBg: 'bg-white/60',  iconColor: 'text-orange-500' },
          { label: 'Diproses',      val: totalProses,    icon: FaSpinner,     bg: 'bg-soft',      iconBg: 'bg-white',     iconColor: 'text-gray-400'   },
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

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* ── LEFT: Tabel ── */}
        <div className={`bg-white border border-secondary rounded-3xl overflow-hidden ${selected ? 'lg:col-span-2' : ''}`}>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-soft">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3 text-gray-300 text-xs" />
              <input
                type="text"
                name="search"
                placeholder="Cari ID, nama, atau produk..."
                onChange={handleChange}
                className="w-full bg-soft rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-gray-300 text-xs shrink-0" />
              {['Semua', 'Selesai', 'Dikirim', 'Proses', 'Batal'].map(s => (
                <button key={s} onClick={() => setDataForm({ ...dataForm, filterStatus: s })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    dataForm.filterStatus === s ? 'bg-primary text-on-primary' : 'bg-soft text-gray-400 hover:text-gray-600'
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
                <tr className="border-b border-soft">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">ID Pesanan</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pelanggan</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Produk</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const sc = statusConfig[o.status];
                  const StatusIcon = sc.icon;
                  const isActive = selected?.id === o.id;
                  return (
                    <tr key={o.id} className={`border-b border-soft last:border-0 transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-soft/60'}`}>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-black text-on-primary bg-soft px-2 py-1 rounded-lg">{o.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-bold text-gray-700 leading-tight">{o.customer}</p>
                        <p className="text-[10px] text-gray-400">{o.tanggal}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-secondary rounded-xl overflow-hidden shrink-0">
                            {o.gambar ? (
                              <img
                                src={new URL(`../assets/gambarproduk/${o.gambar}`, import.meta.url).href}
                                alt={o.produk}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBoxOpen className="text-on-primary text-[10px]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 leading-tight">{o.produk}</p>
                            <p className="text-[10px] text-gray-400">{o.qty} pcs</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-black text-gray-700">Rp {o.total.toLocaleString('id')}</p>
                        {o.poin > 0 && (
                          <p className="text-[10px] text-accent font-semibold flex items-center gap-0.5">
                            <FaStar className="text-yellow-400 text-[8px]" />+{o.poin} poin
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${sc.style}`}>
                          <StatusIcon className="text-[9px]" />{o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setSelected(isActive ? null : o)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                            isActive ? 'bg-primary text-on-primary' : 'bg-soft text-gray-400 hover:bg-secondary hover:text-on-primary'
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
                <FaSearch className="text-3xl text-secondary mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-400">Pesanan tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail Panel ── */}
        {selected && (() => {
          const sc = statusConfig[selected.status];
          const StatusIcon = sc.icon;
          return (
            <div className="bg-white border border-secondary rounded-3xl p-6 space-y-5 sticky top-4 h-fit">
              <div className="flex items-start justify-between pb-4 border-b border-soft">
                <div>
                  <span className="text-xs font-black text-on-primary bg-soft px-2.5 py-1 rounded-lg">{selected.id}</span>
                  <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                    <FaCalendarAlt className="text-secondary" />{selected.tanggal}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${sc.style}`}>
                  <StatusIcon className="text-[9px]" />{selected.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pelanggan</p>
                <div className="flex items-center gap-3 p-3 bg-soft rounded-2xl">
                  <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-sm font-black text-on-primary shrink-0">
                    {selected.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{selected.customer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 px-1">
                  <FaMapMarkerAlt className="text-primary text-xs mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-500">{selected.alamat}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Detail Produk</p>
                <div className="flex items-center gap-3 p-3 border border-secondary rounded-2xl">
                  <div className="w-14 h-14 bg-secondary rounded-xl overflow-hidden shrink-0">
                    {selected.gambar ? (
                      <img
                        src={new URL(`../assets/gambarproduk/${selected.gambar}`, import.meta.url).href}
                        alt={selected.produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBoxOpen className="text-on-primary text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700">{selected.produk}</p>
                    <p className="text-[10px] text-gray-400">{selected.qty} pcs</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pembayaran</p>
                {[
                  { label: 'Metode',  val: selected.metode,                              icon: FaMoneyBillWave },
                  { label: 'Total',   val: `Rp ${selected.total.toLocaleString('id')}`,  icon: FaShoppingBag   },
                  { label: 'Poin',    val: selected.poin > 0 ? `+${selected.poin} poin` : '-', icon: FaStar   },
                ].map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-soft last:border-0">
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <RowIcon className="text-secondary text-[10px]" />{row.label}
                      </span>
                      <span className={`text-xs font-bold ${row.label === 'Poin' && selected.poin > 0 ? 'text-accent' : 'text-gray-700'}`}>
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-1">
                {selected.status === 'Proses' && (
                  <button className="w-full py-2.5 rounded-2xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2">
                    <FaTruck className="text-xs" /> Tandai Dikirim
                  </button>
                )}
                {selected.status === 'Dikirim' && (
                  <button className="w-full py-2.5 rounded-2xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-xs" /> Tandai Selesai
                  </button>
                )}
                <button className="w-full py-2.5 rounded-2xl text-xs font-bold border border-secondary text-gray-400 hover:bg-soft transition-all flex items-center justify-center gap-2">
                  <FaUser className="text-xs" /> Lihat Profil Pelanggan
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Modal Form Tambah Pesanan ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-secondary animate-in fade-in zoom-in-95 duration-200">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-soft">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaShoppingBag className="text-on-primary text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-700">Tambah Pesanan Baru</p>
                  <p className="text-[10px] text-gray-400">Isi data transaksi pelanggan</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-soft rounded-xl flex items-center justify-center hover:bg-secondary transition-colors text-gray-400">
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Nama Pelanggan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Nama Pelanggan
                </label>
                <input type="text" name="customer" value={formPesanan.customer}
                  onChange={handleFormChange} required
                  placeholder="cth: Dewi Lestari"
                  className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                />
              </div>

              {/* Produk */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Produk
                </label>
                <input type="text" name="produk" value={formPesanan.produk}
                  onChange={handleFormChange} required
                  placeholder="cth: Kalung Titanium Rosegold"
                  className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                />
              </div>

              {/* Qty & Total — 2 kolom */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Qty (pcs)
                  </label>
                  <input type="number" name="qty" value={formPesanan.qty}
                    onChange={handleFormChange} min="1" required
                    className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-gray-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Total (Rp)
                  </label>
                  <input type="number" name="total" value={formPesanan.total}
                    onChange={handleFormChange} required
                    placeholder="85000"
                    className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                  />
                </div>
              </div>

              {/* Preview poin otomatis */}
              {formPesanan.total && (
                <div className="flex items-center gap-1.5 bg-soft rounded-xl px-3 py-2">
                  <FaStar className="text-yellow-400 text-[10px] shrink-0" />
                  <span className="text-[11px] font-bold text-gray-600">
                    +{Math.floor(Number(formPesanan.total) / 1000)} poin akan diberikan
                  </span>
                </div>
              )}

              {/* Alamat */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Alamat Pengiriman
                </label>
                <input type="text" name="alamat" value={formPesanan.alamat}
                  onChange={handleFormChange} required
                  placeholder="cth: Jl. Merdeka No. 12, Perawang"
                  className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                />
              </div>

              {/* Metode & Status — 2 kolom */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Metode Bayar
                  </label>
                  <select name="metode" value={formPesanan.metode} onChange={handleFormChange}
                    className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-gray-600">
                    {['Transfer BCA','Transfer BRI','Transfer BNI','GoPay','OVO','COD'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </label>
                  <select name="status" value={formPesanan.status} onChange={handleFormChange}
                    className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-gray-600">
                    {['Proses','Dikirim','Selesai','Batal'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tombol */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold border border-secondary text-gray-400 hover:bg-soft transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-2xl text-sm font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2">
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
