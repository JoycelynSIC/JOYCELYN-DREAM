import { useState } from 'react';
import { Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader  from '../components/PageHeader';
import StatCard    from '../components/StatCard';
import Badge       from '../components/Badge';
import Card        from '../components/Card';
import Button      from '../components/Button';
import Input       from '../components/Input';
import Select      from '../components/Select';
import ProgressBar from '../components/ProgressBar';
import EmptyState  from '../components/EmptyState';
import Tooltip     from '../components/Tooltip';
import {
  FaSearch, FaPlus, FaBoxOpen, FaTag, FaLayerGroup,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartLine,
  FaTimes, FaInfoCircle,
} from 'react-icons/fa';

/* Badge status stok — pakai komponen Badge dengan status custom */
const statusBadgeMap = {
  'Aman':         'Selesai',   // hijau
  'Hampir Habis': 'Proses',    // abu
  'Habis':        'Batal',     // merah
};

const kategoriOptions = [
  'Kalung','Gelang','Cincin','Anting','Nail Art',
  'Tumblr','Aksesoris Rambut','Tas','Lainnya',
];

export default function Inventory() {
  const [items,    setItems]    = useState(inventoryData);
  const [showForm, setShowForm] = useState(false);

  const [dataForm, setDataForm] = useState({
    searchTerm:     '',
    filterKategori: 'Semua',
    filterStatus:   'Semua Status',
  });

  const [formProduk, setFormProduk] = useState({
    name: '', kategori: 'Kalung', harga: '', stock: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduk(p => ({ ...p, [name]: value }));
  };

  const handleTambahProduk = (e) => {
    e.preventDefault();
    if (!formProduk.name || !formProduk.harga || !formProduk.stock) return;
    const harga  = parseInt(formProduk.harga);
    const stock  = parseInt(formProduk.stock);
    const status = stock === 0 ? 'Habis' : stock <= 8 ? 'Hampir Habis' : 'Aman';
    setItems(prev => [...prev, {
      id: items.length + 1, name: formProduk.name,
      kategori: formProduk.kategori, harga, stock, terjual: 0, status,
    }]);
    setFormProduk({ name: '', kategori: 'Kalung', harga: '', stock: '' });
    setShowForm(false);
  };

  const _search      = dataForm.searchTerm.toLowerCase();
  const kategoriList = ['Semua', ...new Set(items.map(i => i.kategori))];

  const filteredData = items.filter(item => {
    const matchSearch   = item.name.toLowerCase().includes(_search);
    const matchKategori = dataForm.filterKategori === 'Semua' || item.kategori === dataForm.filterKategori;
    const matchStatus   = dataForm.filterStatus === 'Semua Status' || item.status === dataForm.filterStatus;
    return matchSearch && matchKategori && matchStatus;
  });

  /* Preview status otomatis di form */
  const previewStatus = formProduk.stock === '' ? null
    : parseInt(formProduk.stock) === 0 ? 'Habis'
    : parseInt(formProduk.stock) <= 8  ? 'Hampir Habis'
    : 'Aman';

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Persediaan" breadcrumb={['Dashboard', 'Persediaan']}>
        <Button variant="primary" icon={<FaPlus className="text-xs" />} onClick={() => setShowForm(true)}>
          Tambah Produk
        </Button>
      </PageHeader>

      {/* ── Stat Cards — pakai StatCard ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Produk"
          value={items.length}
          desc="semua produk"
          icon={<FaBoxOpen />}
          iconBgColor="bg-[#F4F4F5]"
          iconColor="text-[#9E4BDC]"
        />
        <StatCard
          label="Hampir Habis"
          value={items.filter(i => i.stock > 0 && i.stock <= 8).length}
          desc="stok menipis"
          icon={<FaExclamationCircle />}
          iconBgColor="bg-[#F24E1E]/10"
          iconColor="text-[#F24E1E]"
        />
        <StatCard
          label="Stok Habis"
          value={items.filter(i => i.stock === 0).length}
          desc="perlu restock"
          icon={<FaTimesCircle />}
          variant="primary"
        />
      </div>

      {/* ── Filter & Search — pakai Input + Select ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Cari produk..."
          icon={FaSearch}
          value={dataForm.searchTerm}
          onChange={(e) => setDataForm(p => ({ ...p, searchTerm: e.target.value }))}
          className="flex-1 !gap-0"
        />
        <Select
          icon={FaLayerGroup}
          value={dataForm.filterKategori}
          onChange={(e) => setDataForm(p => ({ ...p, filterKategori: e.target.value }))}
          options={kategoriList.map(k => ({ value: k, label: k }))}
          className="sm:w-44"
        />
        <Select
          icon={FaCheckCircle}
          value={dataForm.filterStatus}
          onChange={(e) => setDataForm(p => ({ ...p, filterStatus: e.target.value }))}
          options={['Semua Status','Aman','Hampir Habis','Habis'].map(s => ({ value: s, label: s }))}
          className="sm:w-44"
        />
      </div>

      {/* ── Tabel — pakai Card ── */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                {[
                  { label: 'Produk',   icon: FaBoxOpen,   tip: null },
                  { label: 'Kategori', icon: FaLayerGroup, tip: null },
                  { label: 'Harga',    icon: FaTag,        tip: null },
                  { label: 'Stok',     icon: null,         tip: 'Jumlah unit tersisa di gudang' },
                  { label: 'Terjual',  icon: FaChartLine,  tip: 'Total unit terjual sepanjang waktu' },
                  { label: 'Status',   icon: null,         tip: 'Aman ≥ 9 pcs · Hampir Habis ≤ 8 pcs · Habis = 0' },
                ].map((h, i) => (
                  <th key={i} className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {h.icon && <h.icon className="text-[#A1A1AA] text-[10px]" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h.label}</span>
                      {h.tip && (
                        <Tooltip content={h.tip} position="top">
                          <FaInfoCircle className="text-[#A1A1AA] text-[9px] cursor-help" />
                        </Tooltip>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-[#F4F4F5]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#95D5B6]/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        {item.gambar
                          ? <img src={item.gambar} alt={item.name} className="w-full h-full object-cover" />
                          : <FaBoxOpen className="text-[#00B5AD] text-xs" />
                        }
                      </div>
                      <Link to={`/inventory/${item.id}`}
                        className="text-sm font-bold text-[#22285E] hover:text-[#9E4BDC] transition-colors">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-[#F4F4F5] border border-[#E4E4E7] text-[#71717A] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 w-fit">
                      <FaLayerGroup className="text-[9px] text-[#A1A1AA]" />{item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#22285E]">
                    Rp {item.harga.toLocaleString('id')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#22285E]">
                    <div className="space-y-1 min-w-[80px]">
                      <span className="text-xs font-bold text-[#22285E]">{item.stock} pcs</span>
                      <ProgressBar
                        value={item.stock}
                        max={30}
                        showValue={false}
                        size="sm"
                        variant={
                          item.stock === 0 ? 'warning'
                          : item.stock <= 8 ? 'warning'
                          : 'primary'
                        }
                        animated={false}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm text-[#71717A]">
                      <FaChartLine className="text-[#9E4BDC] text-xs" />{item.terjual}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Badge — pakai komponen Badge dengan mapping status */}
                    <Badge status={statusBadgeMap[item.status] ?? 'Proses'} />
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      variant="search"
                      title="Produk tidak ditemukan"
                      desc="Coba ubah kata kunci pencarian atau filter kategori & status."
                      size="md"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Modal Tambah Produk ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center shrink-0">
                  <FaBoxOpen className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Tambah Produk Baru</p>
                  <p className="text-[10px] text-[#A1A1AA]">Isi data produk aksesoris</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Form — pakai komponen Input & Select */}
            <form onSubmit={handleTambahProduk} className="p-6 space-y-4">
              <Input
                label="Nama Produk"
                name="name"
                value={formProduk.name}
                onChange={handleFormChange}
                placeholder="cth: Kalung Titanium Rosegold"
                icon={FaBoxOpen}
              />

              <Select
                label="Kategori"
                name="kategori"
                value={formProduk.kategori}
                onChange={handleFormChange}
                icon={FaLayerGroup}
                options={kategoriOptions.map(k => ({ value: k, label: k }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Harga (Rp)"
                  type="number"
                  name="harga"
                  value={formProduk.harga}
                  onChange={handleFormChange}
                  placeholder="85000"
                  icon={FaTag}
                />
                <Input
                  label="Stok (pcs)"
                  type="number"
                  name="stock"
                  value={formProduk.stock}
                  onChange={handleFormChange}
                  placeholder="20"
                  icon={FaChartLine}
                />
              </div>

              {/* Preview status otomatis — pakai Badge */}
              {previewStatus && (
                <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
                  <span className="text-[10px] text-[#A1A1AA]">Status otomatis:</span>
                  <Badge status={statusBadgeMap[previewStatus]} />
                  <span className="text-[10px] font-bold text-[#22285E]">{previewStatus}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" icon={<FaPlus className="text-xs" />}>
                  Simpan Produk
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
