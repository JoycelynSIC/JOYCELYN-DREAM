import { useState } from 'react';
import { Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader from '../components/PageHeader';
import {
  FaSearch, FaPlus, FaBoxOpen, FaTag, FaLayerGroup,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartLine,
  FaTimes
} from 'react-icons/fa';

const statusConfig = {
  'Aman':         { style: 'bg-status-success/10 text-status-success border border-status-success/20', icon: FaCheckCircle       },
  'Hampir Habis': { style: 'bg-status-warning/10 text-status-warning border border-status-warning/20', icon: FaExclamationCircle },
  'Habis':        { style: 'bg-status-warning/20 text-status-warning border border-status-warning/30', icon: FaTimesCircle       },
};

const kategoriOptions = ['Kalung', 'Gelang', 'Cincin', 'Anting', 'Nail Art', 'Tumblr', 'Aksesoris Rambut', 'Tas', 'Lainnya'];

export default function Inventory() {
  const [items, setItems]     = useState(inventoryData);
  const [showForm, setShowForm] = useState(false);

  const [dataForm, setDataForm] = useState({
    searchTerm:     '',
    filterKategori: 'Semua',
    filterStatus:   'Semua Status',
  });

  const [formProduk, setFormProduk] = useState({
    name: '', kategori: 'Kalung', harga: '', stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduk({ ...formProduk, [name]: value });
  };

  const handleTambahProduk = (e) => {
    e.preventDefault();
    if (!formProduk.name || !formProduk.harga || !formProduk.stock) return;
    const harga  = parseInt(formProduk.harga);
    const stock  = parseInt(formProduk.stock);
    const status = stock === 0 ? 'Habis' : stock <= 8 ? 'Hampir Habis' : 'Aman';
    setItems(prev => [...prev, { id: items.length + 1, name: formProduk.name, kategori: formProduk.kategori, harga, stock, terjual: 0, status }]);
    setFormProduk({ name: '', kategori: 'Kalung', harga: '', stock: '' });
    setShowForm(false);
  };

  const _searchTerm  = dataForm.searchTerm.toLowerCase();
  const kategoriList = ['Semua', ...new Set(items.map(i => i.kategori))];

  const filteredData = items.filter(item => {
    const matchSearch   = item.name.toLowerCase().includes(_searchTerm);
    const matchKategori = dataForm.filterKategori === 'Semua' || item.kategori === dataForm.filterKategori;
    const matchStatus   = dataForm.filterStatus === 'Semua Status' || item.status === dataForm.filterStatus;
    return matchSearch && matchKategori && matchStatus;
  });

  const inputClass = "w-full bg-surface-gray border border-surface-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-text-disable text-text-light";

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Persediaan" breadcrumb={['Dashboard', 'Persediaan']}>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-surface-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95">
          <FaPlus className="text-xs" /> Tambah Produk
        </button>
      </PageHeader>

      {/* ── Modal Tambah Produk ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-2xl shadow-2xl w-full max-w-md border border-surface-border animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaBoxOpen className="text-surface-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-text-dark">Tambah Produk Baru</p>
                  <p className="text-[10px] text-text-disable">Isi data produk aksesoris</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-surface-gray border border-surface-border rounded-xl flex items-center justify-center hover:bg-status-warning/10 hover:text-status-warning transition-colors text-text-disable">
                <FaTimes className="text-xs" />
              </button>
            </div>

            <form onSubmit={handleTambahProduk} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable flex items-center gap-1">
                  <FaBoxOpen className="text-secondary" /> Nama Produk
                </label>
                <input type="text" name="name" value={formProduk.name} onChange={handleFormChange}
                  placeholder="cth: Kalung Titanium Rosegold" required className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable flex items-center gap-1">
                  <FaLayerGroup className="text-secondary" /> Kategori
                </label>
                <select name="kategori" value={formProduk.kategori} onChange={handleFormChange} className={inputClass}>
                  {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable flex items-center gap-1">
                    <FaTag className="text-secondary" /> Harga (Rp)
                  </label>
                  <input type="number" name="harga" value={formProduk.harga} onChange={handleFormChange}
                    placeholder="85000" min="0" required className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable flex items-center gap-1">
                    <FaChartLine className="text-secondary" /> Stok (pcs)
                  </label>
                  <input type="number" name="stock" value={formProduk.stock} onChange={handleFormChange}
                    placeholder="20" min="0" required className={inputClass} />
                </div>
              </div>

              {formProduk.stock !== '' && (
                <div className="bg-surface-gray border border-surface-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <span className="text-[10px] text-text-disable">Status otomatis:</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    parseInt(formProduk.stock) === 0
                      ? 'bg-status-warning/20 text-status-warning'
                      : parseInt(formProduk.stock) <= 8
                      ? 'bg-status-warning/10 text-status-warning'
                      : 'bg-status-success/10 text-status-success'
                  }`}>
                    {parseInt(formProduk.stock) === 0 ? 'Habis' : parseInt(formProduk.stock) <= 8 ? 'Hampir Habis' : 'Aman'}
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold border border-surface-border text-text-light hover:bg-surface-neutral transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-surface-white hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <FaPlus className="text-xs" /> Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Stat mini ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Produk',  val: items.length,                                          icon: FaBoxOpen,           bg: 'bg-surface-white',       iconColor: 'text-primary'        },
          { label: 'Hampir Habis',  val: items.filter(i => i.stock > 0 && i.stock <= 8).length, icon: FaExclamationCircle, bg: 'bg-status-warning/5',    iconColor: 'text-status-warning' },
          { label: 'Stok Habis',    val: items.filter(i => i.stock === 0).length,               icon: FaTimesCircle,       bg: 'bg-status-warning/10',   iconColor: 'text-status-warning' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${s.bg} border border-surface-border rounded-2xl p-4 flex items-center gap-3`}>
              <div className="w-9 h-9 bg-surface-white border border-surface-border rounded-xl flex items-center justify-center shrink-0">
                <Icon className={`${s.iconColor} text-sm`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">{s.label}</p>
                <p className="text-2xl font-black text-text-dark">{s.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-3 text-text-disable text-sm" />
          <input type="text" name="searchTerm" placeholder="Cari produk..." onChange={handleChange}
            className="w-full bg-surface-white border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-disable text-text-light"
          />
        </div>

        <div className="relative">
          <FaLayerGroup className="absolute left-4 top-3 text-text-disable text-sm pointer-events-none" />
          <select name="filterKategori" value={dataForm.filterKategori} onChange={handleChange}
            className="appearance-none bg-surface-white border border-surface-border rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-light cursor-pointer">
            {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-text-disable text-xs">▾</div>
        </div>

        <div className="relative">
          <FaCheckCircle className="absolute left-4 top-3 text-text-disable text-sm pointer-events-none" />
          <select name="filterStatus" value={dataForm.filterStatus} onChange={handleChange}
            className="appearance-none bg-surface-white border border-surface-border rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-light cursor-pointer">
            {['Semua Status', 'Aman', 'Hampir Habis', 'Habis'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-text-disable text-xs">▾</div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-white rounded-2xl border border-surface-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-neutral border-b border-surface-border">
              {[
                { label: 'Produk',   icon: FaBoxOpen    },
                { label: 'Kategori', icon: FaLayerGroup  },
                { label: 'Harga',    icon: FaTag         },
                { label: 'Stok',     icon: null          },
                { label: 'Terjual',  icon: FaChartLine   },
                { label: 'Status',   icon: null          },
              ].map((h, i) => (
                <th key={i} className="px-6 py-3.5">
                  <div className="flex items-center gap-1.5">
                    {h.icon && <h.icon className="text-text-disable text-[10px]" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-disable">{h.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filteredData.map(item => {
              const sc = statusConfig[item.status];
              const StatusIcon = sc.icon;
              return (
                <tr key={item.id} className="hover:bg-surface-neutral/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        {item.gambar
                          ? <img src={item.gambar} alt={item.name} className="w-full h-full object-cover" />
                          : <FaBoxOpen className="text-status-success text-xs" />
                        }
                      </div>
                      <Link to={`/inventory/${item.id}`}
                        className="text-sm font-bold text-text-dark hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-surface-gray border border-surface-border text-text-light px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 w-fit">
                      <FaLayerGroup className="text-[9px] text-text-disable" />{item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-text-dark">
                    Rp {item.harga.toLocaleString('id')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-text-dark">{item.stock} pcs</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm text-text-light">
                      <FaChartLine className="text-primary text-xs" />{item.terjual}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit ${sc.style}`}>
                      <StatusIcon className="text-[9px]" />{item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
