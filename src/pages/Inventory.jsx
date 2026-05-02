import React, { useState } from 'react';
import inventoryData from '../data/inventory.json';
import PageHeader from '../components/PageHeader';
import {
  FaSearch, FaPlus, FaBoxOpen, FaTag, FaLayerGroup,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartLine,
  FaTimes
} from 'react-icons/fa';

const statusConfig = {
  'Aman':         { style: 'bg-primary text-on-primary',    icon: FaCheckCircle       },
  'Hampir Habis': { style: 'bg-secondary text-yellow-700',  icon: FaExclamationCircle },
  'Habis':        { style: 'bg-accent/20 text-on-primary',  icon: FaTimesCircle       },
};

const kategoriOptions = ['Kalung', 'Gelang', 'Cincin', 'Anting', 'Nail Art', 'Tumblr', 'Aksesoris Rambut', 'Tas', 'Lainnya'];

export default function Inventory() {
  const [items, setItems] = useState(inventoryData);
  const [showForm, setShowForm] = useState(false);

  /** Deklarasi state — Best Practice (Pertemuan 4) **/
  const [dataForm, setDataForm] = useState({
    searchTerm:     '',
    filterKategori: 'Semua',
  });

  /** State form tambah produk **/
  const [formProduk, setFormProduk] = useState({
    name:     '',
    kategori: 'Kalung',
    harga:    '',
    stock:    '',
  });

  /** Inisialisasi Handle perubahan nilai input form **/
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
    const harga = parseInt(formProduk.harga);
    const stock = parseInt(formProduk.stock);
    const status = stock === 0 ? 'Habis' : stock <= 8 ? 'Hampir Habis' : 'Aman';
    const newItem = {
      id:       items.length + 1,
      name:     formProduk.name,
      kategori: formProduk.kategori,
      harga,
      stock,
      terjual:  0,
      status,
    };
    setItems(prev => [...prev, newItem]);
    setFormProduk({ name: '', kategori: 'Kalung', harga: '', stock: '' });
    setShowForm(false);
  };

  /** Deklarasi Logic Search & Filter **/
  const _searchTerm = dataForm.searchTerm.toLowerCase();

  /** Deklarasi pengambilan unique kategori di inventoryData **/
  const kategoriList = ['Semua', ...new Set(items.map(i => i.kategori))];

  const filteredData = items.filter(item => {
    const matchSearch   = item.name.toLowerCase().includes(_searchTerm);
    const matchKategori = dataForm.filterKategori === 'Semua' || item.kategori === dataForm.filterKategori;
    return matchSearch && matchKategori;
  });

  const totalNilai = items.reduce((a, i) => a + i.harga * i.stock, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader title="Persediaan" breadcrumb={['Dashboard', 'Persediaan']}>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary-hover transition-all active:scale-95">
          <FaPlus className="text-xs" /> Tambah Produk
        </button>
      </PageHeader>

      {/* ── Modal Form Tambah Produk ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-secondary animate-in fade-in zoom-in-95 duration-200">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-soft">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <FaBoxOpen className="text-on-primary text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-700">Tambah Produk Baru</p>
                  <p className="text-[10px] text-gray-400">Isi data produk aksesoris</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-xl bg-soft flex items-center justify-center text-gray-400 hover:bg-secondary transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Body form */}
            <form onSubmit={handleTambahProduk} className="p-6 space-y-4">

              {/* Nama Produk */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <FaBoxOpen className="text-secondary" /> Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  value={formProduk.name}
                  onChange={handleFormChange}
                  placeholder="cth: Kalung Titanium Rosegold"
                  required
                  className="w-full bg-soft rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <FaLayerGroup className="text-secondary" /> Kategori
                </label>
                <select
                  name="kategori"
                  value={formProduk.kategori}
                  onChange={handleFormChange}
                  className="w-full bg-soft rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-gray-600"
                >
                  {kategoriOptions.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* Harga & Stok — 2 kolom */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    <FaTag className="text-secondary" /> Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={formProduk.harga}
                    onChange={handleFormChange}
                    placeholder="85000"
                    min="0"
                    required
                    className="w-full bg-soft rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    <FaChartLine className="text-secondary" /> Stok (pcs)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formProduk.stock}
                    onChange={handleFormChange}
                    placeholder="20"
                    min="0"
                    required
                    className="w-full bg-soft rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
                  />
                </div>
              </div>

              {/* Preview status otomatis */}
              {formProduk.stock !== '' && (
                <div className="bg-soft rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">Status otomatis:</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    parseInt(formProduk.stock) === 0
                      ? 'bg-accent/20 text-on-primary'
                      : parseInt(formProduk.stock) <= 8
                      ? 'bg-secondary text-yellow-700'
                      : 'bg-primary text-on-primary'
                  }`}>
                    {parseInt(formProduk.stock) === 0 ? 'Habis' : parseInt(formProduk.stock) <= 8 ? 'Hampir Habis' : 'Aman'}
                  </span>
                </div>
              )}

              {/* Tombol aksi */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold border border-secondary text-gray-400 hover:bg-soft transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-sm font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2"
                >
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
          { label: 'Total Produk',  val: items.length,                                           icon: FaBoxOpen,           bg: 'bg-white',        iconColor: 'text-on-primary' },
          { label: 'Hampir Habis',  val: items.filter(i => i.stock > 0 && i.stock <= 8).length,  icon: FaExclamationCircle, bg: 'bg-soft',         iconColor: 'text-yellow-500' },
          { label: 'Stok Habis',    val: items.filter(i => i.stock === 0).length,                icon: FaTimesCircle,       bg: 'bg-accent/10',    iconColor: 'text-accent'     },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${s.bg} border border-secondary rounded-2xl p-4 flex items-center gap-3`}>
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Icon className={`${s.iconColor} text-sm`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                <p className="text-2xl font-black text-gray-700">{s.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter & Search ── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <FaSearch className="absolute left-4 top-3 text-gray-300 text-sm" />
          <input
            type="text"
            name="searchTerm"
            placeholder="Cari produk..."
            onChange={handleChange}
            className="w-full bg-white border border-secondary rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-gray-300 text-gray-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <FaLayerGroup className="text-gray-300 text-sm" />
          {kategoriList.map(k => (
            <button key={k} onClick={() => setDataForm({ ...dataForm, filterKategori: k })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                dataForm.filterKategori === k
                  ? 'bg-primary text-on-primary'
                  : 'bg-white border border-secondary text-gray-400 hover:border-primary'
              }`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-soft border-b border-secondary">
              {[
                { label: 'Produk',    icon: FaBoxOpen    },
                { label: 'Kategori', icon: FaLayerGroup  },
                { label: 'Harga',    icon: FaTag         },
                { label: 'Stok',     icon: null          },
                { label: 'Terjual',  icon: FaChartLine   },
                { label: 'Status',   icon: null          },
              ].map((h, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {h.icon && <h.icon className="text-gray-300 text-[10px]" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{h.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-soft">
            {filteredData.map(item => {
              const sc = statusConfig[item.status];
              const StatusIcon = sc.icon;
              return (
                <tr key={item.id} className="hover:bg-soft/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                        <FaBoxOpen className="text-on-primary text-xs" />
                      </div>
                      <p className="text-sm font-bold text-gray-700 group-hover:translate-x-0.5 transition-transform">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-soft text-gray-500 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 w-fit">
                      <FaLayerGroup className="text-[9px] text-gray-300" />{item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Rp {item.harga.toLocaleString('id')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{item.stock} pcs</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <FaChartLine className="text-primary text-xs" />{item.terjual}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit ${sc.style}`}>
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
