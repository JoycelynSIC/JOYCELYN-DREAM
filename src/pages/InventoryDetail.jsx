import { useParams, useNavigate, Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader from '../components/PageHeader';
import {
  FaArrowLeft, FaBoxOpen, FaTag, FaLayerGroup, FaChartLine,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle,
  FaEdit, FaTrash
} from 'react-icons/fa';

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

const getImg = (path) => {
  if (!path) return null;
  const filename = path.split('/').pop();
  return gambarMap[filename] ?? null;
};

const statusConfig = {
  'Aman':         { style: 'bg-status-success/10 text-status-success border border-status-success/20', icon: FaCheckCircle,       bar: 'bg-status-success'  },
  'Hampir Habis': { style: 'bg-status-warning/10 text-status-warning border border-status-warning/20', icon: FaExclamationCircle, bar: 'bg-status-warning'  },
  'Habis':        { style: 'bg-status-warning/20 text-status-warning border border-status-warning/30', icon: FaTimesCircle,       bar: 'bg-status-warning'  },
};

export default function InventoryDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const item = inventoryData.find(i => i.id === Number(id));

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-16 h-16 bg-surface-gray border border-surface-border rounded-2xl flex items-center justify-center">
          <FaBoxOpen className="text-3xl text-text-disable" />
        </div>
        <p className="text-base font-black text-text-dark">Produk tidak ditemukan</p>
        <p className="text-sm text-text-light">ID produk tidak ada dalam database.</p>
        <Link to="/inventory"
          className="flex items-center gap-2 bg-primary text-surface-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">
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
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Detail Produk" breadcrumb={['Dashboard', 'Persediaan', item.name]}>
        <button onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 border border-surface-border text-text-light bg-surface-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-surface-neutral transition-all">
          <FaArrowLeft className="text-xs" /> Kembali
        </button>
      </PageHeader>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Kiri: Gambar */}
        <div className="space-y-4">
          <div className="bg-surface-white border border-surface-border rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {img
              ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
              : <div className="flex flex-col items-center gap-2">
                  <FaBoxOpen className="text-5xl text-text-disable" />
                  <p className="text-xs text-text-disable">Tidak ada gambar</p>
                </div>
            }
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-primary text-surface-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95">
              <FaEdit className="text-xs" /> Edit
            </button>
            <button className="flex items-center justify-center gap-2 border border-status-warning/40 text-status-warning py-3 rounded-xl text-sm font-bold hover:bg-status-warning/10 transition-all active:scale-95">
              <FaTrash className="text-xs" /> Hapus
            </button>
          </div>
        </div>

        {/* Kanan: Info */}
        <div className="lg:col-span-2 space-y-4">

          {/* Info utama */}
          <div className="bg-surface-white border border-surface-border rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-text-dark">{item.name}</h2>
                <span className="inline-flex items-center gap-1 text-xs bg-surface-gray border border-surface-border text-text-light px-2.5 py-1 rounded-lg font-medium mt-1.5">
                  <FaLayerGroup className="text-[9px] text-text-disable" />{item.kategori}
                </span>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${sc.style}`}>
                <StatusIcon className="text-[10px]" />{item.status}
              </span>
            </div>

            {/* Harga */}
            <div className="bg-primary/5 border border-primary/15 rounded-xl px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable mb-1">Harga Jual</p>
              <p className="text-3xl font-black text-primary">
                Rp {item.harga.toLocaleString('id')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Stok Tersisa', val: `${item.stock} pcs`,  icon: FaBoxOpen,   color: 'text-primary',        bg: 'bg-primary/5 border-primary/15'        },
                { label: 'Terjual',      val: `${item.terjual}x`,   icon: FaChartLine, color: 'text-status-success', bg: 'bg-status-success/5 border-status-success/15' },
                { label: 'Nilai Stok',   val: `Rp ${(item.harga * item.stock / 1000).toFixed(0)}k`, icon: FaTag, color: 'text-text-dark', bg: 'bg-surface-gray border-surface-border' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`border rounded-xl p-4 text-center ${s.bg}`}>
                    <Icon className={`${s.color} text-lg mx-auto mb-1`} />
                    <p className="text-lg font-black text-text-dark">{s.val}</p>
                    <p className="text-[10px] text-text-disable font-medium">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level stok */}
          <div className="bg-surface-white border border-surface-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-black text-text-dark">Level Stok</p>
              <span className="text-xs font-bold text-text-light">{item.stock} / 50 pcs</span>
            </div>
            <div className="w-full h-2.5 bg-surface-neutral rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${sc.bar}`} style={{ width: `${stokPct}%` }} />
            </div>
            {item.stock <= 8 && (
              <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-status-warning/10 border border-status-warning/20 rounded-xl text-xs font-semibold text-status-warning">
                <FaExclamationCircle className="shrink-0" />
                {item.stock === 0
                  ? 'Stok habis! Segera lakukan restok.'
                  : `Stok menipis! Tersisa ${item.stock} pcs.`
                }
              </div>
            )}
          </div>

          {/* Performa */}
          <div className="bg-surface-white border border-surface-border rounded-2xl p-6">
            <p className="text-sm font-black text-text-dark mb-4">Performa Penjualan</p>
            <div className="space-y-0">
              {[
                { label: 'Total Terjual',    val: `${item.terjual} pcs` },
                { label: 'Total Pendapatan', val: `Rp ${(item.harga * item.terjual / 1000000).toFixed(2)} Jt` },
                { label: 'Poin Dihasilkan',  val: `${Math.floor(item.harga / 1000 * item.terjual)} poin` },
                { label: 'ID Produk',        val: `#PRD-${String(item.id).padStart(3, '0')}` },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-surface-border last:border-0">
                  <span className="text-xs text-text-disable">{row.label}</span>
                  <span className="text-xs font-bold text-text-dark">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Produk Terkait ── */}
      {produkTerkait.length > 0 && (
        <div className="bg-surface-white border border-surface-border rounded-2xl p-6">
          <p className="text-sm font-black text-text-dark mb-4">
            Produk Terkait —{' '}
            <span className="text-text-light font-medium">{item.kategori}</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {produkTerkait.map(p => {
              const pImg   = getImg(p.gambar);
              const pSc    = statusConfig[p.status];
              const PSIcon = pSc.icon;
              return (
                <Link key={p.id} to={`/inventory/${p.id}`}
                  className="border border-surface-border rounded-xl overflow-hidden hover:border-primary hover:shadow-sm transition-all group">
                  <div className="aspect-square bg-surface-gray overflow-hidden">
                    {pImg
                      ? <img src={pImg} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center"><FaBoxOpen className="text-text-disable text-2xl" /></div>
                    }
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-text-dark leading-snug line-clamp-2">{p.name}</p>
                    <p className="text-[11px] font-black text-primary mt-1">Rp {p.harga.toLocaleString('id')}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-0.5 mt-1.5 ${pSc.style}`}>
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
