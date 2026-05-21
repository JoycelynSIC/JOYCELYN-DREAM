import { useState } from 'react';
import ordersData from '../data/orders.json';
import PageHeader from '../components/PageHeader';
import Badge     from '../components/Badge';
import StatCard  from '../components/StatCard';
import Card      from '../components/Card';
import Button    from '../components/Button';
import Input     from '../components/Input';
import Select    from '../components/Select';
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

      {/* ── Stat Cards — pakai StatCard ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Pesanan" value={orders.length}  desc="semua pesanan"   icon={<FaShoppingBag />} iconBgColor="bg-[#F4F4F5]"          iconColor="text-[#9E4BDC]"  />
        <StatCard label="Selesai"       value={totalSelesai}   desc="transaksi lunas" icon={<FaCheckCircle />} iconBgColor="bg-[#00B5AD]/10"        iconColor="text-[#00B5AD]"  />
        <StatCard label="Dikirim"       value={totalDikirim}   desc="dalam pengiriman" icon={<FaTruck />}      variant="primary" />
        <StatCard label="Diproses"      value={totalProses}    desc="menunggu proses" icon={<FaSpinner />}     iconBgColor="bg-[#F4F4F5]"          iconColor="text-[#A1A1AA]"  />
      </div>

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* LEFT: Tabel — pakai Card */}
        <Card
          className={selected ? 'lg:col-span-2' : ''}
          padding={false}
          title=""
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-[#E4E4E7]">
            <Input
              placeholder="Cari ID, nama, atau produk..."
              icon={FaSearch}
              value={dataForm.search}
              onChange={(e) => setDataForm({ ...dataForm, search: e.target.value })}
              className="flex-1 !gap-0"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-[#A1A1AA] text-xs shrink-0" />
              {['Semua', 'Selesai', 'Dikirim', 'Proses', 'Batal'].map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={dataForm.filterStatus === s ? 'primary' : 'ghost'}
                  onClick={() => setDataForm({ ...dataForm, filterStatus: s })}
                >
                  {s}
                </Button>
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
                        {/* Badge dari komponen Badge */}
                        <Badge status={o.status} />
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
        </Card>

        {/* RIGHT: Detail Panel — pakai Card */}
        {selected && (() => {
          const sc = statusConfig[selected.status];
          const StatusIcon = sc.icon;
          return (
            <Card className="sticky top-4 h-fit" padding={true}>
              <div className="flex items-start justify-between pb-4 border-b border-[#E4E4E7]">
                <div>
                  <span className="text-xs font-black text-[#9E4BDC] bg-[#9E4BDC]/10 px-2.5 py-1 rounded-lg">{selected.id}</span>
                  <p className="text-[10px] text-[#A1A1AA] mt-1.5 flex items-center gap-1">
                    <FaCalendarAlt className="text-[#95D5B6]" />{selected.tanggal}
                  </p>
                </div>
                <Badge status={selected.status} />
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
                  <Button variant="primary" className="w-full" icon={<FaTruck className="text-xs" />}>
                    Tandai Dikirim
                  </Button>
                )}
                {selected.status === 'Dikirim' && (
                  <Button variant="success" className="w-full" icon={<FaCheckCircle className="text-xs" />}>
                    Tandai Selesai
                  </Button>
                )}
                <Button variant="outline" className="w-full" icon={<FaUser className="text-xs" />}>
                  Lihat Profil Pelanggan
                </Button>
              </div>
            </Card>
          );
        })()}
      </div>

      {/* ── Modal Tambah Pesanan — pakai Input + Select + Button ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center shrink-0">
                  <FaShoppingBag className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Tambah Pesanan Baru</p>
                  <p className="text-[10px] text-[#A1A1AA]">Isi data transaksi pelanggan</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input label="Nama Pelanggan" type="text" name="customer"
                value={formPesanan.customer} onChange={handleFormChange}
                placeholder="cth: Dewi Lestari" icon={FaUser} />

              <Input label="Produk" type="text" name="produk"
                value={formPesanan.produk} onChange={handleFormChange}
                placeholder="cth: Kalung Titanium Rosegold" icon={FaBoxOpen} />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Qty (pcs)" type="number" name="qty"
                  value={formPesanan.qty} onChange={handleFormChange} />
                <Input label="Total (Rp)" type="number" name="total"
                  value={formPesanan.total} onChange={handleFormChange}
                  placeholder="85000" icon={FaMoneyBillWave} />
              </div>

              {formPesanan.total && (
                <div className="flex items-center gap-1.5 bg-[#00B5AD]/10 border border-[#00B5AD]/20 rounded-xl px-3 py-2">
                  <FaStar className="text-yellow-400 text-[10px] shrink-0" />
                  <span className="text-[11px] font-bold text-[#00B5AD]">
                    +{Math.floor(Number(formPesanan.total) / 1000)} poin akan diberikan
                  </span>
                </div>
              )}

              <Input label="Alamat Pengiriman" type="text" name="alamat"
                value={formPesanan.alamat} onChange={handleFormChange}
                placeholder="cth: Jl. Merdeka No. 12, Perawang" icon={FaMapMarkerAlt} />

              <div className="grid grid-cols-2 gap-3">
                <Select label="Metode Bayar" name="metode"
                  value={formPesanan.metode} onChange={handleFormChange}
                  options={['Transfer BCA','Transfer BRI','Transfer BNI','GoPay','OVO','COD']
                    .map(m => ({ value: m, label: m }))} />
                <Select label="Status" name="status"
                  value={formPesanan.status} onChange={handleFormChange}
                  options={['Proses','Dikirim','Selesai','Batal']
                    .map(s => ({ value: s, label: s }))} />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]"
                  onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" variant="primary" className="flex-1"
                  icon={<FaPlus className="text-xs" />}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
