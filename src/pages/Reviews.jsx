/**
 * Reviews — Ulasan Pelanggan Na_store.id
 * Data reviewer & produk diambil dari Supabase.
 * Konten ulasan dikurasi (tidak ada tabel ulasan di DB).
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader  from '../components/PageHeader';
import StatCard    from '../components/StatCard';
import Card        from '../components/Card';
import Badge       from '../components/Badge';
import Input       from '../components/Input';
import ProgressBar from '../components/ProgressBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FaStar, FaSearch, FaFilter, FaCheckCircle, FaClock,
  FaEyeSlash, FaEye, FaChevronDown, FaQuoteLeft,
} from 'react-icons/fa';
import { MessageSquare, ThumbsUp, Award } from 'lucide-react';
import { getProdukImageUrl } from '../services/produkAPI';

const BASE    = 'https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1';
const API_KEY = 'sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ';
const H       = { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` };

// ── Template komentar berdasarkan kategori produk ─────────────────────────────
const KOMENTAR_TEMPLATE = {
  Kalung: [
    "Kalungnya cantik banget, materialnya bagus dan nggak bikin kulit iritasi. Packing rapih!",
    "Sudah beli 3x dan selalu puas. Kualitasnya konsisten dan pengirimannya cepat.",
    "Liontin detail banget, persis seperti foto. Cocok buat hadiah!",
    "Rantainya kuat, nggak gampang putus. Harga sebanding kualitasnya.",
  ],
  Gelang: [
    "Gelangnya cantik dan ringan. Kristalnya berkilau banget kena cahaya!",
    "Ukurannya pas, adjustable. Sudah pakai sebulan dan masih bagus.",
    "Warnanya persis di foto, pengiriman cepat. Recommended!",
    "Beli untuk hadiah ulang tahun teman, dia suka banget!",
  ],
  Anting: [
    "Antingnya ringan banget, bisa dipakai seharian tanpa sakit telinga.",
    "Desainnya unik dan elegan, dapat banyak pujian dari teman-teman!",
    "Materialnya hypoallergenic, cocok untuk kulit sensitif seperti saya.",
    "Pakingnya mewah, cocok banget buat gift. Akan order lagi!",
  ],
  Cincin: [
    "Ukurannya tepat sesuai yang dipesan. Desainnya cantik dan modern.",
    "Cincin couple-nya keren! Packaging bagus, pas banget buat anniversary.",
    "Materialnya premium, nggak gampang pudar. Sudah 3 bulan masih bagus.",
    "Handmade-nya keliatan dari detailnya. Sangat puas!",
  ],
  'Nail Art': [
    "Press on nail-nya tahan lama, sudah 2 minggu masih nempel kuat!",
    "Desainnya estetik banget, banyak yang nanya beli dimana.",
    "Mudah pasangnya, lengkap dengan lem dan alat. Hasilnya bagus!",
    "Warnanya vivid banget dan nggak mudah chip. Love it!",
  ],
  Tumblr: [
    "Tumblrnya aesthetic banget, persis foto. Bahan plastiknya tebal dan berkualitas.",
    "Sudah pakai 2 bulan, warnanya masih cerah. Worth it!",
    "Ukurannya pas, nggak terlalu besar dan nggak terlalu kecil.",
    "Segel sempurna, nggak bocor. Cocok dibawa ke kampus!",
  ],
  'Aksesoris Rambut': [
    "Claw clip-nya kuat banget, nggak gampang patah meski rambut tebal.",
    "Scrunchie satin-nya lembut dan nggak bikin rambut keriput. Juara!",
    "Desainnya trendy, cocok dipakai sehari-hari maupun acara.",
    "Beli banyak warna karena suka semua! Harganya affordable.",
  ],
  Tas: [
    "Tas rajutnya cantik banget, handmade keliatan dari kerapihannya.",
    "Ukurannya pas untuk daily use, ringan dan fashionable.",
    "Material-nya kuat, jahitannya rapi. Sudah dipakai berminggu-minggu.",
    "Tali adjustable sangat membantu. Desainnya versatile!",
  ],
};

const getKomentar = (kategori) => {
  const templates = KOMENTAR_TEMPLATE[kategori] ?? [
    "Produknya sangat memuaskan, kualitas bagus dan pengiriman cepat!",
    "Sesuai ekspektasi, packaging rapih dan aman. Recommended seller!",
    "Produk original dan berkualitas. Pasti order lagi!",
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const RATING_DIST = [5, 5, 5, 5, 4, 4, 4, 5, 5, 4, 3, 5, 5, 4, 5];
const STATUS_LIST  = ['Ditampilkan', 'Ditampilkan', 'Ditampilkan', 'Ditampilkan', 'Pending', 'Ditampilkan', 'Ditampilkan', 'Disembunyikan'];

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const randDate = () => {
  const y = 2024 + Math.floor(Math.random() * 2);
  const m = Math.floor(Math.random() * 12);
  const d = 1 + Math.floor(Math.random() * 28);
  return `${d} ${BULAN[m]} ${y}`;
};

const STATUS_BADGE = { Ditampilkan: 'Selesai', Pending: 'Proses', Disembunyikan: 'Batal' };

function Stars({ rating, size = 'text-xs' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <FaStar key={i} className={`${size} ${i <= rating ? 'text-yellow-400' : 'text-[#E4E4E7]'}`} />
      ))}
    </div>
  );
}

function SK({ h = 'h-10' }) {
  return <div className={`${h} w-full rounded-xl bg-[#F4F4F5] animate-pulse`} />;
}

export default function Reviews() {
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filterRating, setFilterRating] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [currentPage,  setCurrentPage]  = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/customer?select=%22Nama%20Lengkap%22,%22Status%20Member%22,%22Kelompok%20Usia%22&limit=40`, { headers: H }),
      axios.get(`${BASE}/produk?select=%22Nama%20Produk%22,%22Kategori%20Produk%22,%22Foto%20Produk%22&order=Terjual.desc&limit=20`, { headers: H }),
    ]).then(([custRes, prodRes]) => {
      const customers = custRes.data;
      const products  = prodRes.data;
      // Generate ulasan dari kombinasi customer + produk
      const generated = customers.slice(0, 30).map((c, i) => {
        const prod = products[i % products.length];
        const kat  = prod['Kategori Produk'] ?? 'Kalung';
        return {
          id:          i + 1,
          nama:        c['Nama Lengkap']   ?? `Customer ${i+1}`,
          statusMember: c['Status Member'] ?? 'Reguler',
          kelompokUsia: c['Kelompok Usia'] ?? '',
          produk:      prod['Nama Produk']      ?? '',
          kategori:    kat,
          gambar:      prod['Foto Produk']      ?? null,
          rating:      RATING_DIST[i % RATING_DIST.length],
          komentar:    getKomentar(kat),
          tanggal:     randDate(),
          status:      STATUS_LIST[i % STATUS_LIST.length],
          helpful:     Math.floor(Math.random() * 25),
        };
      });
      setReviews(generated);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter
  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.nama.toLowerCase().includes(q)
      || r.produk.toLowerCase().includes(q)
      || r.komentar.toLowerCase().includes(q);
    const matchRating = filterRating === 'Semua' || r.rating === Number(filterRating);
    const matchStatus = filterStatus === 'Semua' || r.status === filterStatus;
    return matchSearch && matchRating && matchStatus;
  });

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const avgRating   = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const totalBintang5 = reviews.filter(r => r.rating === 5).length;
  const totalPending  = reviews.filter(r => r.status === 'Pending').length;

  const toggleStatus = (id) => {
    setReviews(prev => prev.map(r =>
      r.id === id ? { ...r, status: r.status === 'Ditampilkan' ? 'Disembunyikan' : 'Ditampilkan' } : r
    ));
    if (selected?.id === id)
      setSelected(p => ({ ...p, status: p.status === 'Ditampilkan' ? 'Disembunyikan' : 'Ditampilkan' }));
  };

  const approveReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Ditampilkan' } : r));
    if (selected?.id === id) setSelected(p => ({ ...p, status: 'Ditampilkan' }));
  };

  const MC = { Platinum:'#6D28D9', Gold:'#F59E0B', Silver:'#64748B', Reguler:'#9E4BDC' };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">
      <PageHeader title="Ulasan Pelanggan" breadcrumb={['Dashboard', 'Ulasan']} />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? Array(4).fill(0).map((_,i) => <SK key={i} h="h-20"/>) : (<>
          <StatCard label="Total Ulasan" value={reviews.length} desc="semua ulasan"
            icon={<MessageSquare className="w-4 h-4"/>} iconBgColor="bg-[#F4F4F5]" iconColor="text-[#9E4BDC]"/>
          <StatCard label="Rating Rata-rata" value={avgRating} desc="dari 5 bintang"
            icon={<FaStar/>} variant="primary"/>
          <StatCard label="Bintang 5 ⭐" value={totalBintang5} desc={`${Math.round((totalBintang5/reviews.length)*100)}% dari total`}
            icon={<Award className="w-4 h-4"/>} iconBgColor="bg-yellow-50" iconColor="text-yellow-500"/>
          <StatCard label="Perlu Ditinjau" value={totalPending} desc="menunggu persetujuan"
            icon={<FaClock/>} iconBgColor="bg-orange-50" iconColor="text-orange-500"/>
        </>)}
      </div>

      {/* ── Distribusi Rating ── */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Angka besar */}
          <div className="text-center shrink-0">
            <p className="text-5xl font-black text-[#22285E]">{avgRating}</p>
            <Stars rating={Math.round(Number(avgRating))} size="text-sm" />
            <p className="text-[10px] text-[#A1A1AA] mt-1">{reviews.length} ulasan</p>
          </div>
          {/* Bar distribusi */}
          <div className="flex-1 space-y-2 min-w-[200px]">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1 w-10 shrink-0">
                    <span className="text-[10px] font-bold text-[#71717A]">{star}</span>
                    <FaStar className="text-yellow-400 text-[9px]" />
                  </div>
                  <div className="flex-1 h-2 bg-[#F4F4F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: star >= 4 ? '#9E4BDC' : star === 3 ? '#F59E0B' : '#F24E1E' }} />
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] w-8 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* LIST */}
        <div className={`bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden ${selected ? 'lg:col-span-2' : ''}`}>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[#F4F4F5]">
            <Input placeholder="Cari nama, produk, komentar..." icon={FaSearch}
              value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="flex-1 !gap-0" />
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <FaFilter className="text-[#A1A1AA] text-xs shrink-0" />
              {/* Rating filter */}
              <select value={filterRating}
                onChange={e => { setFilterRating(e.target.value); setCurrentPage(1); }}
                className="text-xs font-medium text-[#22285E] bg-white border border-[#E4E4E7] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#9E4BDC]/20 cursor-pointer">
                <option value="Semua">Semua Rating</option>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Bintang</option>)}
              </select>
              {/* Status filter */}
              <select value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="text-xs font-medium text-[#22285E] bg-white border border-[#E4E4E7] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#9E4BDC]/20 cursor-pointer">
                {['Semua','Ditampilkan','Pending','Disembunyikan'].map(s =>
                  <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : s}</option>
                )}
              </select>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="p-4 space-y-3">{Array(5).fill(0).map((_,i) => <SK key={i} h="h-20"/>)}</div>
          ) : (
            <div className="divide-y divide-[#F8F8F8]">
              {paginated.map(r => {
                const isActive = selected?.id === r.id;
                const imgUrl = r.gambar ? getProdukImageUrl(r.gambar) : null;
                const initColor = MC[r.statusMember] ?? '#9E4BDC';
                return (
                  <div key={r.id} onClick={() => setSelected(isActive ? null : r)}
                    className={`flex items-start gap-3.5 p-4 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#9E4BDC]/5 border-l-2 border-l-[#9E4BDC]' : 'hover:bg-[#FAFAFA]'
                    }`}>
                    {/* Avatar pelanggan */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
                      style={{ backgroundColor: initColor }}>
                      {r.nama.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#22285E] truncate">{r.nama}</p>
                          <p className="text-[10px] text-[#A1A1AA] truncate">{r.produk}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Stars rating={r.rating} size="text-[10px]" />
                          <Badge status={STATUS_BADGE[r.status] ?? 'Proses'} />
                        </div>
                      </div>
                      <p className="text-[11px] text-[#71717A] mt-1.5 line-clamp-2 leading-relaxed">
                        "{r.komentar}"
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] text-[#A1A1AA]">{r.tanggal}</span>
                        {r.helpful > 0 && (
                          <span className="text-[9px] text-[#A1A1AA] flex items-center gap-0.5">
                            <ThumbsUp className="w-2.5 h-2.5" /> {r.helpful} membantu
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Gambar produk kecil */}
                    {imgUrl && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#F0F0F0] hidden sm:block">
                        <img src={imgUrl} alt={r.produk} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-14 text-center">
                  <FaStar className="text-3xl text-[#E4E4E7] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#A1A1AA]">Ulasan tidak ditemukan</p>
                  <p className="text-xs text-[#A1A1AA] mt-1">Coba ubah filter atau kata kunci pencarian</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination sederhana */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[#F4F4F5] flex items-center justify-between">
              <p className="text-[10px] text-[#A1A1AA]">
                Halaman {currentPage} dari {totalPages} · {filtered.length} ulasan
              </p>
              <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                  className="w-7 h-7 rounded-lg border border-[#E4E4E7] flex items-center justify-center text-[#A1A1AA] hover:bg-[#F4F4F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1
                    : currentPage >= totalPages - 2 ? totalPages - 4 + i
                    : currentPage - 2 + i;
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        page === currentPage
                          ? 'bg-[#9E4BDC] text-white'
                          : 'border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]'
                      }`}>
                      {page}
                    </button>
                  );
                })}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                  className="w-7 h-7 rounded-lg border border-[#E4E4E7] flex items-center justify-center text-[#A1A1AA] hover:bg-[#F4F4F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs">
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DETAIL PANEL */}
        {selected && (
          <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden sticky top-4 max-h-[calc(100vh-6rem)]">
            <ScrollArea className="h-[calc(100vh-7rem)]">
              <div className="p-5">
                {/* Produk */}
                {(() => {
                  const imgUrl = selected.gambar ? getProdukImageUrl(selected.gambar) : null;
                  return imgUrl ? (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-[#F0F0F0]">
                      <img src={imgUrl} alt={selected.produk} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-28 rounded-xl bg-[#F4F4F5] mb-4 flex items-center justify-center">
                      <FaStar className="text-3xl text-[#E4E4E7]" />
                    </div>
                  );
                })()}

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs font-black text-[#22285E]">{selected.produk}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{selected.kategori}</p>
                  </div>
                  <Badge status={STATUS_BADGE[selected.status] ?? 'Proses'} />
                </div>
                <Stars rating={selected.rating} size="text-sm" />

                {/* Reviewer */}
                <div className="mt-4 flex items-center gap-3 bg-[#FAFAFA] rounded-xl p-3 border border-[#F0F0F0]">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
                    style={{ backgroundColor: MC[selected.statusMember] ?? '#9E4BDC' }}>
                    {selected.nama.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#22285E] truncate">{selected.nama}</p>
                    <div className="flex items-center gap-2">
                      <Badge status={selected.statusMember} />
                      <span className="text-[9px] text-[#A1A1AA]">{selected.tanggal}</span>
                    </div>
                  </div>
                </div>

                {/* Komentar */}
                <div className="mt-4 bg-[#9E4BDC]/4 rounded-xl p-4 border border-[#9E4BDC]/10 relative">
                  <FaQuoteLeft className="text-[#9E4BDC]/20 text-2xl absolute top-3 left-3" />
                  <p className="text-xs text-[#22285E] leading-relaxed pl-6 font-medium">
                    {selected.komentar}
                  </p>
                  {selected.helpful > 0 && (
                    <p className="text-[10px] text-[#A1A1AA] mt-2 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {selected.helpful} orang merasa ulasan ini membantu
                    </p>
                  )}
                </div>

                {/* Aksi */}
                <div className="space-y-2 mt-4">
                  {selected.status === 'Pending' && (
                    <button onClick={() => approveReview(selected.id)}
                      className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer">
                      <FaCheckCircle /> Setujui & Tampilkan
                    </button>
                  )}
                  <button onClick={() => toggleStatus(selected.id)}
                    className={`w-full text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                      selected.status === 'Ditampilkan'
                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                        : 'border-[#9E4BDC]/20 text-[#9E4BDC] hover:bg-[#9E4BDC]/5'
                    }`}>
                    {selected.status === 'Ditampilkan'
                      ? <><FaEyeSlash /> Sembunyikan Ulasan</>
                      : <><FaEye /> Tampilkan Ulasan</>
                    }
                  </button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
