import { useParams, useNavigate, Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader from '../components/PageHeader';
import Card    from '../components/Card';
import Badge   from '../components/Badge';
import Button  from '../components/Button';
import {
  FaArrowLeft, FaBoxOpen, FaTag, FaLayerGroup, FaChartLine,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle,
  FaEdit, FaTrash, FaWhatsapp, FaStar,
} from 'react-icons/fa';

/* ── Gambar produk ── */
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
  'kalungrosegold.png': imgKalungRosegold, 'kalungchoker.png': imgKalungChoker,
  'kalungbintang.png': imgKalungBintang,   'kalungpearl.png': imgKalungPearl,
  'gelangcrystal.png': imgGelangCrystal,   'gelangperak.png': imgGelangPerak,
  'gelangbead.png': imgGelangBead,         'gelangtali.png': imgGelangTali,
  'cincincouple.png': imgCincinCouple,     'cincingold.png': imgCincinGold,
  'cincinresin.png': imgCincinResin,       'antinghoop.png': imgAntingHoop,
  'antingtassel.png': imgAntingTassel,     'antingpearl.png': imgAntingPearl,
  'antingbintang.png': imgAntingBintang,   'pressonnailflower.png': imgNailFlower,
  'pressonnailglitter.png': imgNailGlitter,'pressonnailfrenchtip.png': imgNailFrench,
  'pressonnailombre.png': imgNailOmbre,    'tmblrpastel.png': imgTumblrPastel,
  'tumblrflower.png': imgTumblrFlower,     'tumblrglass.png': imgTumblrGlass,
  'clawclip.png': imgClawClip,             'jepitrambutbutterfly.png': imgJepitButterfly,
  'bandopearl.png': imgBandoPearl,         'scrunchie.png': imgScrunchie,
  'tasminiselempang.png': imgTasMini,      'tasrajut.png': imgTasRajut,
  'taskoin.png': imgTasKoin,               'framekacamata.png': imgKacamata,
  'maskerlucu.png': imgMasker,             'stiker.png': imgStiker,
  'gancisanrio.png': imgGanci,             'ikapinggang.png': imgIkatPinggang,
};

const getImg = (path) => {
  if (!path) return null;
  return gambarMap[path.split('/').pop()] ?? null;
};

/* Map status stok → Badge status */
const statusBadgeMap = {
  'Aman':         'Selesai',
  'Hampir Habis': 'Proses',
  'Habis':        'Batal',
};

const statusBarColor = {
  'Aman':         'bg-[#00B5AD]',
  'Hampir Habis': 'bg-yellow-400',
  'Habis':        'bg-[#F24E1E]',
};

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
        <p className="text-sm text-[#71717A]">ID produk tidak ada dalam database Na_store.id.</p>
        <Button variant="primary" icon={<FaArrowLeft className="text-xs" />} onClick={() => navigate('/inventory')}>
          Kembali ke Persediaan
        </Button>
      </div>
    );
  }

  const img           = getImg(item.gambar);
  const stokPct       = Math.min((item.stock / 50) * 100, 100);
  const produkTerkait = inventoryData
    .filter(i => i.kategori === item.kategori && i.id !== item.id)
    .slice(0, 4);

  /* Hitung poin yang dihasilkan produk ini (Rp 1.000 = 1 poin) */
  const poinDihasilkan = Math.floor(item.harga / 1000 * item.terjual);

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Detail Produk Aksesoris" breadcrumb={['Dashboard', 'Persediaan', item.name]}>
        <Button variant="outline" size="sm" icon={<FaArrowLeft className="text-xs" />} onClick={() => navigate('/inventory')}>
          Kembali
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Kiri: Gambar + Aksi ── */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {img
              ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
              : <div className="flex flex-col items-center gap-2">
                  <FaBoxOpen className="text-5xl text-[#A1A1AA]" />
                  <p className="text-xs text-[#A1A1AA]">Belum ada gambar</p>
                </div>
            }
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" icon={<FaEdit className="text-xs" />} className="w-full">
              Edit Produk
            </Button>
            <Button variant="warning" icon={<FaTrash className="text-xs" />} className="w-full">
              Hapus
            </Button>
          </div>

          {/* Kirim notif restock via WA */}
          {item.stock <= 8 && (
            <Button variant="secondary" icon={<FaWhatsapp />} className="w-full">
              Notif Restock via WA
            </Button>
          )}
        </div>

        {/* ── Kanan: Info Produk ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Info utama */}
          <Card>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-black text-[#22285E]">{item.name}</h2>
                <span className="inline-flex items-center gap-1 text-xs bg-[#F4F4F5] border border-[#E4E4E7] text-[#71717A] px-2.5 py-1 rounded-lg font-medium mt-1.5">
                  <FaLayerGroup className="text-[9px] text-[#A1A1AA]" />{item.kategori}
                </span>
              </div>
              {/* Badge status stok */}
              <Badge status={statusBadgeMap[item.status] ?? 'Proses'} />
            </div>

            {/* Harga */}
            <div className="bg-[#9E4BDC]/5 border border-[#9E4BDC]/15 rounded-xl px-5 py-4 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-1">Harga Jual</p>
              <p className="text-3xl font-black text-[#9E4BDC]">
                Rp {item.harga.toLocaleString('id')}
              </p>
              <p className="text-[10px] text-[#A1A1AA] mt-1">
                Setiap pembelian menghasilkan <span className="font-bold text-[#9E4BDC]">{Math.floor(item.harga / 1000)} poin</span> untuk pelanggan
              </p>
            </div>

            {/* Stats 3 kotak */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Stok Tersisa', val: `${item.stock} pcs`,  icon: FaBoxOpen,   color: 'text-[#9E4BDC]',  bg: 'bg-[#9E4BDC]/5 border-[#9E4BDC]/15'   },
                { label: 'Terjual',      val: `${item.terjual}x`,   icon: FaChartLine, color: 'text-[#00B5AD]',  bg: 'bg-[#00B5AD]/5 border-[#00B5AD]/15'   },
                { label: 'Nilai Stok',   val: `Rp ${(item.harga * item.stock / 1000).toFixed(0)}k`, icon: FaTag, color: 'text-[#22285E]', bg: 'bg-[#F4F4F5] border-[#E4E4E7]' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`border rounded-xl p-4 text-center ${s.bg}`}>
                    <Icon className={`${s.color} text-lg mx-auto mb-1`} />
                    <p className="text-lg font-black text-[#22285E]">{s.val}</p>
                    <p className="text-[10px] text-[#A1A1AA] font-medium">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Level stok */}
          <Card title="Level Stok">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs text-[#71717A]">
                {item.stock === 0
                  ? '⚠️ Stok habis — segera restock!'
                  : item.stock <= 8
                  ? `⚠️ Stok menipis — tersisa ${item.stock} pcs`
                  : `✓ Stok aman — ${item.stock} pcs tersedia`
                }
              </p>
              <span className="text-xs font-bold text-[#A1A1AA]">{item.stock} / 50 pcs</span>
            </div>
            <div className="w-full h-3 bg-[#F4F4F5] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${statusBarColor[item.status] ?? 'bg-[#9E4BDC]'}`}
                style={{ width: `${stokPct}%` }}
              />
            </div>
            {item.stock <= 8 && (
              <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-[#F24E1E]/10 border border-[#F24E1E]/20 rounded-xl text-xs font-semibold text-[#F24E1E]">
                <FaExclamationCircle className="shrink-0" />
                {item.stock === 0
                  ? 'Stok habis! Segera hubungi supplier untuk restock.'
                  : `Stok menipis! Restock sebelum kehabisan.`
                }
              </div>
            )}
          </Card>

          {/* Performa penjualan */}
          <Card title="Performa Penjualan" subtitle={`Data penjualan ${item.name} di Na_store.id`}>
            <div className="space-y-0">
              {[
                { label: 'ID Produk',          val: `#PRD-${String(item.id).padStart(3, '0')}` },
                { label: 'Kategori',           val: item.kategori },
                { label: 'Total Terjual',      val: `${item.terjual} pcs` },
                { label: 'Total Pendapatan',   val: `Rp ${(item.harga * item.terjual).toLocaleString('id')}` },
                { label: 'Poin Dihasilkan',    val: `${poinDihasilkan.toLocaleString('id')} poin untuk pelanggan` },
                { label: 'Status Stok',        val: item.status },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#E4E4E7] last:border-0">
                  <span className="text-xs text-[#A1A1AA]">{row.label}</span>
                  <span className={`text-xs font-bold ${
                    row.label === 'Status Stok'
                      ? item.status === 'Aman' ? 'text-[#00B5AD]'
                      : item.status === 'Habis' ? 'text-[#F24E1E]'
                      : 'text-yellow-500'
                      : 'text-[#22285E]'
                  }`}>
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* ── Produk Terkait ── */}
      {produkTerkait.length > 0 && (
        <Card
          title={`Produk Terkait — ${item.kategori}`}
          subtitle="Aksesoris lain dalam kategori yang sama"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {produkTerkait.map(p => {
              const pImg = getImg(p.gambar);
              return (
                <Link key={p.id} to={`/inventory/${p.id}`}
                  className="border border-[#E4E4E7] rounded-xl overflow-hidden hover:border-[#9E4BDC] hover:shadow-md transition-all group">
                  <div className="aspect-square bg-[#F4F4F5] overflow-hidden">
                    {pImg
                      ? <img src={pImg} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <FaBoxOpen className="text-[#A1A1AA] text-2xl" />
                        </div>
                    }
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-[#22285E] leading-snug line-clamp-2">{p.name}</p>
                    <p className="text-[11px] font-black text-[#9E4BDC] mt-1">Rp {p.harga.toLocaleString('id')}</p>
                    <div className="mt-1.5">
                      <Badge status={statusBadgeMap[p.status] ?? 'Proses'} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

    </div>
  );
}
