import { useParams, useNavigate, Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader  from '../components/PageHeader';
import Badge       from '../components/Badge';
import Button      from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import {
  FaArrowLeft, FaBoxOpen, FaTag, FaLayerGroup, FaChartLine,
  FaExclamationCircle, FaEdit, FaTrash, FaWhatsapp,
  FaFire, FaCoins, FaShoppingBag, FaCheckCircle,
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
  return gambarMap[path.split('/').pop()] ?? null;
};

const progressVariant = { 'Aman': 'success', 'Hampir Habis': 'warning', 'Habis': 'warning' };

/* ── Row info kecil reusable ── */
function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F4F4F5] last:border-0">
      <span className="text-[11px] text-[#A1A1AA]">{label}</span>
      <span className="text-[11px] font-bold text-[#22285E]">{children}</span>
    </div>
  );
}

export default function InventoryDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const item     = inventoryData.find(i => i.id === Number(id));

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

  const sameCat      = inventoryData.filter(i => i.kategori === item.kategori);
  const avgTerjual   = sameCat.reduce((s, i) => s + i.terjual, 0) / sameCat.length;
  const isBestSeller = item.terjual >= avgTerjual * 1.3;

  const produkTerkait = inventoryData
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

          {/* Gambar — fixed width, tidak aspect-square agar tidak ada ruang kosong */}
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

          {/* Info utama — mengisi sisa lebar */}
          <div className="flex-1 p-5 flex flex-col justify-between gap-4">

            {/* Nama + badge + kategori */}
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

            {/* 4 stat angka dalam satu baris */}
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

            {/* Progress stok + tombol aksi — 1 baris */}
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
                <Button variant="primary" size="sm" icon={<FaEdit className="text-xs" />}>
                  Edit
                </Button>
                <Button variant="warning" size="sm" icon={<FaTrash className="text-xs" />}>
                  Hapus
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══ BARIS TENGAH: Detail + Penjualan ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Info Detail */}
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

        {/* Performa Penjualan */}
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

    </div>
  );
}
