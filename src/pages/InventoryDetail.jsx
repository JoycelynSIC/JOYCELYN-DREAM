import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import inventoryData from '../data/inventory.json';
import PageHeader  from '../components/PageHeader';
import Badge       from '../components/Badge';
import Button      from '../components/Button';
import Input       from '../components/Input';
import Select      from '../components/Select';
import ProgressBar from '../components/ProgressBar';
import {
  FaArrowLeft, FaBoxOpen, FaTag, FaLayerGroup, FaChartLine,
  FaExclamationCircle, FaEdit, FaTrash, FaWhatsapp,
  FaFire, FaCoins, FaShoppingBag, FaCheckCircle, FaTimes,
  FaImage, FaUpload,
} from 'react-icons/fa';

/* ── Gambar produk ── */
import imgKalungRosegold  from '../assets/gambarproduk/kalungrosegold.png';
import imgKalungChoker    from '../assets/gambarproduk/kalungchoker.png';
import imgKalungBintang   from '../assets/gambarproduk/kalungbintang.png';
import imgKalungPearl     from '../assets/gambarproduk/kalungpearl.png';
import imgGelangCrystal   from '../assets/gambarproduk/gelangcrystal.png';
import imgGelangPerak     from '../assets/gambarproduk/gelangperak.png';
import imgGelangBead      from '../assets/gambarproduk/gelangbead.png';
import imgGelangTali      from '../assets/gambarproduk/gelangtali.png';
import imgCincinCouple    from '../assets/gambarproduk/cincincouple.png';
import imgCincinGold      from '../assets/gambarproduk/cincingold.png';
import imgCincinResin     from '../assets/gambarproduk/cincinresin.png';
import imgAntingHoop      from '../assets/gambarproduk/antinghoop.png';
import imgAntingTassel    from '../assets/gambarproduk/antingtassel.png';
import imgAntingPearl     from '../assets/gambarproduk/antingpearl.png';
import imgAntingBintang   from '../assets/gambarproduk/antingbintang.png';
import imgNailFlower      from '../assets/gambarproduk/pressonnailflower.png';
import imgNailGlitter     from '../assets/gambarproduk/pressonnailglitter.png';
import imgNailFrench      from '../assets/gambarproduk/pressonnailfrenchtip.png';
import imgNailOmbre       from '../assets/gambarproduk/pressonnailombre.png';
import imgTumblrPastel    from '../assets/gambarproduk/tmblrpastel.png';
import imgTumblrFlower    from '../assets/gambarproduk/tumblrflower.png';
import imgTumblrGlass     from '../assets/gambarproduk/tumblrglass.png';
import imgClawClip        from '../assets/gambarproduk/clawclip.png';
import imgJepitButterfly  from '../assets/gambarproduk/jepitrambutbutterfly.png';
import imgBandoPearl      from '../assets/gambarproduk/bandopearl.png';
import imgScrunchie       from '../assets/gambarproduk/scrunchie.png';
import imgTasMini         from '../assets/gambarproduk/tasminiselempang.png';
import imgTasRajut        from '../assets/gambarproduk/tasrajut.png';
import imgTasKoin         from '../assets/gambarproduk/taskoin.png';
import imgKacamata        from '../assets/gambarproduk/framekacamata.png';
import imgMasker          from '../assets/gambarproduk/maskerlucu.png';
import imgStiker          from '../assets/gambarproduk/stiker.png';
import imgGanci           from '../assets/gambarproduk/gancisanrio.png';
import imgIkatPinggang    from '../assets/gambarproduk/ikapinggang.png';

const gambarMap = {
  'kalungrosegold.png': imgKalungRosegold,   'kalungchoker.png': imgKalungChoker,
  'kalungbintang.png': imgKalungBintang,     'kalungpearl.png': imgKalungPearl,
  'gelangcrystal.png': imgGelangCrystal,     'gelangperak.png': imgGelangPerak,
  'gelangbead.png': imgGelangBead,           'gelangtali.png': imgGelangTali,
  'cincincouple.png': imgCincinCouple,       'cincingold.png': imgCincinGold,
  'cincinresin.png': imgCincinResin,         'antinghoop.png': imgAntingHoop,
  'antingtassel.png': imgAntingTassel,       'antingpearl.png': imgAntingPearl,
  'antingbintang.png': imgAntingBintang,     'pressonnailflower.png': imgNailFlower,
  'pressonnailglitter.png': imgNailGlitter,  'pressonnailfrenchtip.png': imgNailFrench,
  'pressonnailombre.png': imgNailOmbre,      'tmblrpastel.png': imgTumblrPastel,
  'tumblrflower.png': imgTumblrFlower,       'tumblrglass.png': imgTumblrGlass,
  'clawclip.png': imgClawClip,               'jepitrambutbutterfly.png': imgJepitButterfly,
  'bandopearl.png': imgBandoPearl,           'scrunchie.png': imgScrunchie,
  'tasminiselempang.png': imgTasMini,        'tasrajut.png': imgTasRajut,
  'taskoin.png': imgTasKoin,                 'framekacamata.png': imgKacamata,
  'maskerlucu.png': imgMasker,               'stiker.png': imgStiker,
  'gancisanrio.png': imgGanci,               'ikapinggang.png': imgIkatPinggang,
};

const getImg = (path) => {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  return gambarMap[path.split('/').pop()] ?? null;
};

const progressVariant = { 'Aman': 'success', 'Hampir Habis': 'warning', 'Habis': 'warning' };

const kategoriOptions = [
  'Kalung','Gelang','Cincin','Anting','Nail Art',
  'Tumblr','Aksesoris Rambut','Tas','Lainnya',
];

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F4F4F5] last:border-0">
      <span className="text-[11px] text-[#A1A1AA]">{label}</span>
      <span className="text-[11px] font-bold text-[#22285E]">{children}</span>
    </div>
  );
}

/* ── Modal Edit Produk ── */
function EditModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    name:     item.name,
    kategori: item.kategori,
    harga:    item.harga,
    stock:    item.stock,
  });
  const [imgPreview, setImgPreview] = useState(() => getImg(item.gambar) ?? null);
  const [imgData, setImgData]       = useState(null);
  const fileInputRef = useRef(null);
  const nameRef      = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 50);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const handleChange  = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImgPreview(ev.target.result); setImgData(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.harga || !form.stock) return;
    const harga  = parseInt(form.harga);
    const stock  = parseInt(form.stock);
    const status = stock === 0 ? 'Habis' : stock <= 8 ? 'Hampir Habis' : 'Aman';
    const gambar = imgData ?? item.gambar ?? null;
    onSave({ ...form, harga, stock, status, gambar });
  };

  const previewStatus = String(form.stock) === ''
    ? null
    : parseInt(form.stock) === 0 ? 'Habis'
    : parseInt(form.stock) <= 8  ? 'Hampir Habis'
    : 'Aman';

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#22285E] rounded-xl flex items-center justify-center shrink-0">
              <FaEdit className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-black text-[#22285E]">Edit Produk</p>
              <p className="text-[10px] text-[#A1A1AA]">Perbarui data {item.name}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload Gambar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Foto Produk</label>
            <div
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-36 border-2 border-dashed border-[#E4E4E7] rounded-xl overflow-hidden cursor-pointer hover:border-[#9E4BDC]/50 hover:bg-[#9E4BDC]/5 transition-all group flex items-center justify-center"
            >
              {imgPreview ? (
                <>
                  <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <FaUpload className="text-white text-lg" />
                    <span className="text-white text-xs font-bold">Ganti Foto</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#A1A1AA] group-hover:text-[#9E4BDC] transition-colors">
                  <FaImage className="text-2xl" />
                  <p className="text-xs font-semibold">Klik atau drag foto produk</p>
                  <p className="text-[10px]">PNG, JPG, WEBP — maks. 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <Input ref={nameRef} label="Nama Produk" name="name" value={form.name}
            onChange={handleChange} placeholder="cth: Kalung Titanium Rosegold" icon={FaBoxOpen} />

          <Select label="Kategori" name="kategori" value={form.kategori}
            onChange={handleChange} icon={FaLayerGroup}
            options={kategoriOptions.map(k => ({ value: k, label: k }))} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Harga (Rp)" type="number" name="harga" value={form.harga}
              onChange={handleChange} placeholder="85000" icon={FaTag} />
            <Input label="Stok (pcs)" type="number" name="stock" value={form.stock}
              onChange={handleChange} placeholder="20" icon={FaChartLine} />
          </div>

          {previewStatus && (
            <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
              <span className="text-[10px] text-[#A1A1AA]">Status otomatis:</span>
              <Badge status={previewStatus} />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary" className="flex-1" icon={<FaEdit className="text-xs" />}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ── Modal Konfirmasi Hapus ── */
function HapusModal({ item, onClose, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-[#F24E1E]/10 rounded-2xl flex items-center justify-center mx-auto">
            <FaTrash className="text-[#F24E1E] text-xl" />
          </div>
          <div>
            <p className="text-base font-black text-[#22285E]">Hapus Produk?</p>
            <p className="text-sm text-[#71717A] mt-1">
              Produk <span className="font-bold text-[#22285E]">"{item.name}"</span> akan dihapus secara permanen.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={onClose}>Batal</Button>
            <Button variant="warning" className="flex-1" icon={<FaTrash className="text-xs" />} onClick={onConfirm}>Hapus</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HALAMAN DETAIL
══════════════════════════════════════════════════════════════════════ */
export default function InventoryDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // Baca dari localStorage (sama dengan Inventory.jsx) supaya data sinkron
  const [allItems, setAllItems] = useState(() => {
    const saved = localStorage.getItem('joy_dream_inventory');
    return saved ? JSON.parse(saved) : inventoryData;
  });

  const [showEdit,  setShowEdit]  = useState(false);
  const [showHapus, setShowHapus] = useState(false);

  const item = allItems.find(i => i.id === Number(id));

  const persistAndUpdate = (updatedList) => {
    localStorage.setItem('joy_dream_inventory', JSON.stringify(updatedList));
    setAllItems(updatedList);
  };

  const handleSaveEdit = (data) => {
    const updated = allItems.map(it =>
      it.id === item.id ? { ...it, ...data } : it
    );
    persistAndUpdate(updated);
    setShowEdit(false);
  };

  const handleHapus = () => {
    const updated = allItems.filter(it => it.id !== item.id);
    persistAndUpdate(updated);
    navigate('/inventory');
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 font-poppins">
        <div className="w-16 h-16 bg-[#F4F4F5] border border-[#E4E4E7] rounded-2xl flex items-center justify-center">
          <FaBoxOpen className="text-3xl text-[#A1A1AA]" />
        </div>
        <p className="text-base font-black text-[#22285E]">Produk tidak ditemukan</p>
        <p className="text-sm text-[#71717A]">ID produk tidak ada dalam database.</p>
        <Button variant="primary" icon={<FaArrowLeft className="text-xs" />} onClick={() => navigate('/inventory')}>
          Kembali ke Persediaan
        </Button>
      </div>
    );
  }

  const img          = getImg(item.gambar);
  const totalRevenue = item.harga * item.terjual;
  const nilaiStok    = item.harga * item.stock;
  const poinPerItem  = Math.floor(item.harga / 1000);
  const poinTotal    = poinPerItem * item.terjual;

  const sameCat      = allItems.filter(i => i.kategori === item.kategori);
  const avgTerjual   = sameCat.reduce((s, i) => s + i.terjual, 0) / sameCat.length;
  const isBestSeller = item.terjual >= avgTerjual * 1.3;

  const produkTerkait = allItems
    .filter(i => i.kategori === item.kategori && i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Detail Produk" breadcrumb={['Dashboard', 'Persediaan', item.name]}>
        <Button variant="outline" size="sm" icon={<FaArrowLeft className="text-xs" />} onClick={() => navigate('/inventory')}>
          Kembali
        </Button>
      </PageHeader>

      {/* ══ BARIS ATAS: Gambar + Info Utama ══ */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Gambar */}
          <div className="relative md:w-56 shrink-0 bg-[#F9F9FB] border-b md:border-b-0 md:border-r border-[#E4E4E7]">
            {img
              ? <img src={img} alt={item.name} className="w-full h-full object-cover min-h-[200px] md:min-h-full" />
              : <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[200px] text-center p-6">
                  <FaBoxOpen className="text-4xl text-[#A1A1AA]" />
                  <p className="text-xs text-[#A1A1AA]">Belum ada gambar</p>
                </div>
            }
            {isBestSeller && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md">
                <FaFire className="text-[8px]" /> Best Seller
              </div>
            )}
          </div>

          {/* Info utama */}
          <div className="flex-1 p-5 flex flex-col justify-between gap-4">

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">
                  #PRD-{String(item.id).padStart(3, '0')} · {item.kategori}
                </p>
                <h2 className="text-xl font-black text-[#22285E] leading-snug">{item.name}</h2>
                <p className="text-xs text-[#9E4BDC] font-bold">
                  Rp {item.harga.toLocaleString('id')}
                  <span className="text-[#A1A1AA] font-normal ml-1.5">/ pcs · {poinPerItem} poin per beli</span>
                </p>
              </div>
              <Badge status={item.status} />
            </div>

            {/* 4 stat angka */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: FaBoxOpen,    color: 'text-[#9E4BDC]', bg: 'bg-[#9E4BDC]/8',  label: 'Stok',        val: `${item.stock} pcs` },
                { icon: FaShoppingBag,color: 'text-[#00B5AD]', bg: 'bg-[#00B5AD]/8',  label: 'Terjual',     val: `${item.terjual}×` },
                { icon: FaCoins,      color: 'text-yellow-500',bg: 'bg-yellow-50',     label: 'Nilai Stok',  val: nilaiStok >= 1_000_000 ? `Rp ${(nilaiStok/1_000_000).toFixed(1)}jt` : `Rp ${(nilaiStok/1000).toFixed(0)}k` },
                { icon: FaChartLine,  color: 'text-[#22285E]', bg: 'bg-[#F4F4F5]',    label: 'Pendapatan',  val: totalRevenue >= 1_000_000 ? `Rp ${(totalRevenue/1_000_000).toFixed(1)}jt` : `Rp ${(totalRevenue/1000).toFixed(0)}k` },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`${s.bg} rounded-xl px-3 py-2.5 flex items-center gap-2.5`}>
                    <Icon className={`${s.color} text-base shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#A1A1AA] leading-none">{s.label}</p>
                      <p className="text-sm font-black text-[#22285E] leading-tight mt-0.5 truncate">{s.val}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress stok + tombol aksi */}
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Level Stok</span>
                  <span className="text-[10px] font-bold text-[#71717A]">{item.stock} / 50 pcs</span>
                </div>
                <ProgressBar
                  value={item.stock}
                  max={50}
                  showValue={false}
                  size="md"
                  animated={false}
                  variant={progressVariant[item.status] ?? 'primary'}
                />
                {item.stock <= 8 && (
                  <p className="text-[10px] font-semibold text-[#F24E1E] flex items-center gap-1">
                    <FaExclamationCircle className="text-[9px]" />
                    {item.stock === 0 ? 'Stok habis! Segera restock.' : `Menipis — sisa ${item.stock} pcs`}
                  </p>
                )}
                {item.stock > 8 && (
                  <p className="text-[10px] font-semibold text-[#00B5AD] flex items-center gap-1">
                    <FaCheckCircle className="text-[9px]" /> Stok aman
                  </p>
                )}
              </div>

              {/* Tombol */}
              <div className="flex gap-2 shrink-0">
                {item.stock <= 8 && (
                  <Button variant="secondary" size="sm" icon={<FaWhatsapp className="text-xs" />}>
                    Restock WA
                  </Button>
                )}
                <Button variant="primary" size="sm" icon={<FaEdit className="text-xs" />}
                  onClick={() => setShowEdit(true)}>
                  Edit
                </Button>
                <Button variant="warning" size="sm" icon={<FaTrash className="text-xs" />}
                  onClick={() => setShowHapus(true)}>
                  Hapus
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══ BARIS TENGAH: Detail + Penjualan ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-3">Informasi Produk</p>
          <InfoRow label="ID Produk">#PRD-{String(item.id).padStart(3, '0')}</InfoRow>
          <InfoRow label="Nama Produk">{item.name}</InfoRow>
          <InfoRow label="Kategori">
            <span className="inline-flex items-center gap-1">
              <FaLayerGroup className="text-[9px] text-[#A1A1AA]" />{item.kategori}
            </span>
          </InfoRow>
          <InfoRow label="Harga Jual">Rp {item.harga.toLocaleString('id')}</InfoRow>
          <InfoRow label="Poin per Pembelian">{poinPerItem} poin</InfoRow>
          <InfoRow label="Status Stok"><Badge status={item.status} /></InfoRow>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-3">Performa Penjualan</p>
          <InfoRow label="Stok Tersisa">{item.stock} pcs</InfoRow>
          <InfoRow label="Total Terjual">{item.terjual} pcs</InfoRow>
          <InfoRow label="Total Pendapatan">
            <span className="text-[#9E4BDC]">Rp {totalRevenue.toLocaleString('id')}</span>
          </InfoRow>
          <InfoRow label="Nilai Stok Tersisa">
            {nilaiStok >= 1_000_000
              ? `Rp ${(nilaiStok / 1_000_000).toFixed(2)}jt`
              : `Rp ${nilaiStok.toLocaleString('id')}`}
          </InfoRow>
          <InfoRow label="Total Poin Dihasilkan">{poinTotal.toLocaleString('id')} poin</InfoRow>
          <InfoRow label="Ranking Kategori">
            {isBestSeller
              ? <span className="inline-flex items-center gap-1 text-yellow-600"><FaFire className="text-[9px]" /> Best Seller</span>
              : <span className="text-[#71717A]">Normal</span>}
          </InfoRow>
        </div>
      </div>

      {/* ══ PRODUK TERKAIT ══ */}
      {produkTerkait.length > 0 && (
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-3">
            Produk Terkait — {item.kategori}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {produkTerkait.map(p => {
              const pImg = getImg(p.gambar);
              return (
                <Link
                  key={p.id}
                  to={`/inventory/${p.id}`}
                  className="group flex items-center gap-3 p-3 border border-[#E4E4E7] rounded-xl hover:border-[#9E4BDC]/40 hover:bg-[#F9F9FB] transition-all"
                >
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-[#F4F4F5]">
                    {pImg
                      ? <img src={pImg} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <FaBoxOpen className="text-[#A1A1AA] text-sm" />
                        </div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#22285E] line-clamp-2 leading-snug group-hover:text-[#9E4BDC] transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-black text-[#9E4BDC] mt-0.5">
                      Rp {p.harga.toLocaleString('id')}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge status={p.status} />
                      <span className="text-[10px] text-[#A1A1AA]">{p.stock} pcs</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showEdit  && <EditModal  item={item} onClose={() => setShowEdit(false)}  onSave={handleSaveEdit} />}
      {showHapus && <HapusModal item={item} onClose={() => setShowHapus(false)} onConfirm={handleHapus} />}

    </div>
  );
}
