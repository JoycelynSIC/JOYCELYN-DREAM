import { useParams, useNavigate, Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader from '../components/PageHeader';
import {
  FaArrowLeft, FaBoxOpen, FaTag, FaLayerGroup, FaChartLine,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle,
  FaEdit, FaTrash
} from 'react-icons/fa';

/* ── Import semua gambar produk secara statis (Vite tidak bisa dynamic import) ── */
import imgKalungRosegold      from '../assets/gambarproduk/kalungrosegold.png';
import imgKalungChoker        from '../assets/gambarproduk/kalungchoker.png';
import imgKalungBintang       from '../assets/gambarproduk/kalungbintang.png';
import imgKalungPearl         from '../assets/gambarproduk/kalungpearl.png';
import imgGelangCrystal       from '../assets/gambarproduk/gelangcrystal.png';
import imgGelangPerak         from '../assets/gambarproduk/gelangperak.png';
import imgGelangBead          from '../assets/gambarproduk/gelangbead.png';
import imgGelangTali          from '../assets/gambarproduk/gelangtali.png';
import imgCincinCouple        from '../assets/gambarproduk/cincincouple.png';
import imgCincinGold          from '../assets/gambarproduk/cincingold.png';
import imgCincinResin         from '../assets/gambarproduk/cincinresin.png';
import imgAntingHoop          from '../assets/gambarproduk/antinghoop.png';
import imgAntingTassel        from '../assets/gambarproduk/antingtassel.png';
import imgAntingPearl         from '../assets/gambarproduk/antingpearl.png';
import imgAntingBintang       from '../assets/gambarproduk/antingbintang.png';
import imgNailFlower          from '../assets/gambarproduk/pressonnailflower.png';
import imgNailGlitter         from '../assets/gambarproduk/pressonnailglitter.png';
import imgNailFrench          from '../assets/gambarproduk/pressonnailfrenchtip.png';
import imgNailOmbre           from '../assets/gambarproduk/pressonnailombre.png';
import imgTumblrPastel        from '../assets/gambarproduk/tmblrpastel.png';
import imgTumblrFlower        from '../assets/gambarproduk/tumblrflower.png';
import imgTumblrGlass         from '../assets/gambarproduk/tumblrglass.png';
import imgClawClip            from '../assets/gambarproduk/clawclip.png';
import imgJepitButterfly      from '../assets/gambarproduk/jepitrambutbutterfly.png';
import imgBandoPearl          from '../assets/gambarproduk/bandopearl.png';
import imgScrunchie           from '../assets/gambarproduk/scrunchie.png';
import imgTasMini             from '../assets/gambarproduk/tasminiselempang.png';
import imgTasRajut            from '../assets/gambarproduk/tasrajut.png';
import imgTasKoin             from '../assets/gambarproduk/taskoin.png';
import imgKacamata            from '../assets/gambarproduk/framekacamata.png';
import imgMasker              from '../assets/gambarproduk/maskerlucu.png';
import imgStiker              from '../assets/gambarproduk/stiker.png';
import imgGanci               from '../assets/gambarproduk/gancisanrio.png';
import imgIkatPinggang        from '../assets/gambarproduk/ikapinggang.png';

/* ── Lookup: nama file → URL yang sudah diproses Vite ── */
const gambarMap = {
  'kalungrosegold.png':       imgKalungRosegold,
  'kalungchoker.png':         imgKalungChoker,
  'kalungbintang.png':        imgKalungBintang,
  'kalungpearl.png':          imgKalungPearl,
  'gelangcrystal.png':        imgGelangCrystal,
  'gelangperak.png':          imgGelangPerak,
  'gelangbead.png':           imgGelangBead,
  'gelangtali.png':           imgGelangTali,
  'cincincouple.png':         imgCincinCouple,
  'cincingold.png':           imgCincinGold,
  'cincinresin.png':          imgCincinResin,
  'antinghoop.png':           imgAntingHoop,
  'antingtassel.png':         imgAntingTassel,
  'antingpearl.png':          imgAntingPearl,
  'antingbintang.png':        imgAntingBintang,
  'pressonnailflower.png':    imgNailFlower,
  'pressonnailglitter.png':   imgNailGlitter,
  'pressonnailfrenchtip.png': imgNailFrench,
  'pressonnailombre.png':     imgNailOmbre,
  'tmblrpastel.png':          imgTumblrPastel,
  'tumblrflower.png':         imgTumblrFlower,
  'tumblrglass.png':          imgTumblrGlass,
  'clawclip.png':             imgClawClip,
  'jepitrambutbutterfly.png': imgJepitButterfly,
  'bandopearl.png':           imgBandoPearl,
  'scrunchie.png':            imgScrunchie,
  'tasminiselempang.png':     imgTasMini,
  'tasrajut.png':             imgTasRajut,
  'taskoin.png':              imgTasKoin,
  'framekacamata.png':        imgKacamata,
  'maskerlucu.png':           imgMasker,
  'stiker.png':               imgStiker,
  'gancisanrio.png':          imgGanci,
  'ikapinggang.png':          imgIkatPinggang,
};

/* ── Helper: ambil URL gambar dari path JSON ── */
const getImg = (path) => {
  if (!path) return null;
  const filename = path.split('/').pop();
  return gambarMap[filename] ?? null;
};

const statusConfig = {
  'Aman':         { style: 'bg-primary text-on-primary',   icon: FaCheckCircle,       bar: 'bg-primary'    },
  'Hampir Habis': { style: 'bg-secondary text-yellow-700', icon: FaExclamationCircle, bar: 'bg-yellow-300' },
  'Habis':        { style: 'bg-accent/20 text-on-primary', icon: FaTimesCircle,       bar: 'bg-accent'     },
};

export default function InventoryDetail() {
  /* ── Dynamic Route: ambil :id dari URL ── */
  const { id }   = useParams();
  const navigate = useNavigate();

  /* Cari produk berdasarkan id dari inventory.json */
  const item = inventoryData.find(i => i.id === Number(id));

  /* Jika produk tidak ditemukan */
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <FaBoxOpen className="text-5xl text-secondary" />
        <p className="text-lg font-black text-gray-500">Produk tidak ditemukan</p>
        <Link to="/inventory"
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-primary-hover transition-all">
          <FaArrowLeft className="text-xs" /> Kembali ke Persediaan
        </Link>
      </div>
    );
  }

  const sc            = statusConfig[item.status];
  const StatusIcon    = sc.icon;
  const img           = getImg(item.gambar);
  const stokPct       = Math.min((item.stock / 50) * 100, 100);
  const produkTerkait = inventoryData
    .filter(i => i.kategori === item.kategori && i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader
        title="Detail Produk"
        breadcrumb={['Dashboard', 'Persediaan', item.name]}
      >
        <button
          onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 border border-secondary text-gray-500 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-soft transition-all"
        >
          <FaArrowLeft className="text-xs" /> Kembali
        </button>
      </PageHeader>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Kiri: Gambar produk ── */}
        <div className="space-y-4">
          <div className="bg-white border border-secondary rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
            {img
              ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
              : <FaBoxOpen className="text-6xl text-secondary" />
            }
          </div>

          {/* Aksi */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-2xl text-sm font-bold hover:bg-primary-hover transition-all active:scale-95">
              <FaEdit className="text-xs" /> Edit
            </button>
            <button className="flex items-center justify-center gap-2 border border-accent/40 text-accent py-3 rounded-2xl text-sm font-bold hover:bg-accent/10 transition-all active:scale-95">
              <FaTrash className="text-xs" /> Hapus
            </button>
          </div>
        </div>

        {/* ── Kanan: Info produk ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Info utama */}
          <div className="bg-white border border-secondary rounded-3xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-gray-700">{item.name}</h2>
                <span className="inline-flex items-center gap-1 text-xs bg-soft text-gray-500 px-2.5 py-1 rounded-lg font-medium mt-1.5">
                  <FaLayerGroup className="text-[9px] text-gray-300" />{item.kategori}
                </span>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0 ${sc.style}`}>
                <StatusIcon className="text-[10px]" />{item.status}
              </span>
            </div>

            {/* Harga */}
            <div className="bg-soft rounded-2xl px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Harga Jual</p>
              <p className="text-3xl font-black text-on-primary">
                Rp {item.harga.toLocaleString('id')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Stok Tersisa', val: `${item.stock} pcs`,  icon: FaBoxOpen,   color: 'text-on-primary' },
                { label: 'Terjual',      val: `${item.terjual}x`,   icon: FaChartLine, color: 'text-green-600'  },
                { label: 'Nilai Stok',   val: `Rp ${(item.harga * item.stock / 1000).toFixed(0)}k`, icon: FaTag, color: 'text-gray-700' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-soft rounded-2xl p-4 text-center">
                    <Icon className={`${s.color} text-lg mx-auto mb-1`} />
                    <p className="text-lg font-black text-gray-700">{s.val}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level stok */}
          <div className="bg-white border border-secondary rounded-3xl p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-black text-gray-700">Level Stok</p>
              <span className="text-xs font-bold text-gray-500">{item.stock} / 50 pcs</span>
            </div>
            <div className="w-full h-3 bg-soft rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${sc.bar}`}
                style={{ width: `${stokPct}%` }}
              />
            </div>
            {item.stock <= 8 && (
              <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                item.stock === 0 ? 'bg-accent/10 text-on-primary' : 'bg-yellow-50 text-yellow-700'
              }`}>
                <FaExclamationCircle className="shrink-0" />
                {item.stock === 0
                  ? 'Stok habis! Segera lakukan restok.'
                  : `Stok menipis! Tersisa ${item.stock} pcs.`
                }
              </div>
            )}
          </div>

          {/* Performa */}
          <div className="bg-white border border-secondary rounded-3xl p-6">
            <p className="text-sm font-black text-gray-700 mb-4">Performa Penjualan</p>
            <div className="space-y-1">
              {[
                { label: 'Total Terjual',    val: `${item.terjual} pcs` },
                { label: 'Total Pendapatan', val: `Rp ${(item.harga * item.terjual / 1000000).toFixed(2)} Jt` },
                { label: 'Poin Dihasilkan',  val: `${Math.floor(item.harga / 1000 * item.terjual)} poin` },
                { label: 'ID Produk',        val: `#PRD-${String(item.id).padStart(3, '0')}` },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-soft last:border-0">
                  <span className="text-xs text-gray-400">{row.label}</span>
                  <span className="text-xs font-bold text-gray-700">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Produk Terkait ── */}
      {produkTerkait.length > 0 && (
        <div className="bg-white border border-secondary rounded-3xl p-6">
          <p className="text-sm font-black text-gray-700 mb-4">
            Produk Terkait —{' '}
            <span className="text-gray-400 font-medium">{item.kategori}</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {produkTerkait.map(p => {
              const pImg   = getImg(p.gambar);
              const pSc    = statusConfig[p.status];
              const PSIcon = pSc.icon;
              return (
                <Link
                  key={p.id}
                  to={`/inventory/${p.id}`}
                  className="border border-secondary rounded-2xl overflow-hidden hover:border-primary hover:shadow-sm transition-all group"
                >
                  <div className="aspect-square bg-soft overflow-hidden">
                    {pImg
                      ? <img src={pImg} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center"><FaBoxOpen className="text-secondary text-2xl" /></div>
                    }
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-700 leading-snug line-clamp-2">{p.name}</p>
                    <p className="text-[11px] font-black text-on-primary mt-1">Rp {p.harga.toLocaleString('id')}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 mt-1.5 ${pSc.style}`}>
                      <PSIcon className="text-[8px]" />{p.status}
                    </span>
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
