import { useState } from 'react';
import reviewsData from '../data/reviews.json';
import PageHeader from '../components/PageHeader';
import {
  FaStar, FaRegStar, FaSearch, FaFilter,
  FaCheckCircle, FaClock, FaEyeSlash, FaEye,
  FaBoxOpen
} from 'react-icons/fa';

const statusConfig = {
  'Ditampilkan': { style: 'bg-primary text-on-primary',   icon: FaEye         },
  'Pending':     { style: 'bg-soft text-gray-500',        icon: FaClock       },
  'Disembunyikan':{ style: 'bg-accent/20 text-on-primary', icon: FaEyeSlash   },
};

function StarRating({ rating, size = 'text-sm' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <FaStar key={i} className={`${size} ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(reviewsData);
  const [selected, setSelected] = useState(null);

  /** State — Best Practice (Pertemuan 4) **/
  const [dataForm, setDataForm] = useState({
    search:       '',
    filterRating: 'Semua',
    filterStatus: 'Semua',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm(prev => ({ ...prev, [name]: value }));
  };

  /** Logic Search & Filter **/
  const _search = dataForm.search.toLowerCase();
  const filtered = reviews.filter(r => {
    const matchSearch = r.nama.toLowerCase().includes(_search)
      || r.produk.toLowerCase().includes(_search)
      || r.komentar.toLowerCase().includes(_search);
    const matchRating = dataForm.filterRating === 'Semua' || r.rating === Number(dataForm.filterRating);
    const matchStatus = dataForm.filterStatus === 'Semua' || r.status === dataForm.filterStatus;
    return matchSearch && matchRating && matchStatus;
  });

  /** Stats **/
  const avgRating   = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const totalBintang5 = reviews.filter(r => r.rating === 5).length;
  const totalPending  = reviews.filter(r => r.status === 'Pending').length;

  /** Toggle status review **/
  const toggleStatus = (id) => {
    setReviews(prev => prev.map(r =>
      r.id === id
        ? { ...r, status: r.status === 'Ditampilkan' ? 'Disembunyikan' : 'Ditampilkan' }
        : r
    ));
    if (selected?.id === id) {
      setSelected(prev => ({
        ...prev,
        status: prev.status === 'Ditampilkan' ? 'Disembunyikan' : 'Ditampilkan'
      }));
    }
  };

  const approveReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Ditampilkan' } : r));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'Ditampilkan' }));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader title="Ulasan Pelanggan" breadcrumb={['Dashboard', 'Ulasan']} />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Ulasan',  val: reviews.length,  sub: 'semua ulasan',       bg: 'bg-white'      },
          { label: 'Rating Rata-rata', val: avgRating,    sub: 'dari 5 bintang',     bg: 'bg-primary'    },
          { label: 'Bintang 5',     val: totalBintang5,   sub: 'ulasan terbaik',     bg: 'bg-soft'       },
          { label: 'Perlu Ditinjau',val: totalPending,    sub: 'menunggu persetujuan',bg: 'bg-accent/10' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border border-secondary rounded-2xl p-4`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
            <div className="flex items-end gap-1 mt-1">
              <p className="text-2xl font-black text-gray-700">{s.val}</p>
              {i === 1 && <FaStar className="text-yellow-400 text-sm mb-1" />}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Distribusi Rating ── */}
      <div className="bg-white border border-secondary rounded-3xl p-6">
        <p className="text-sm font-black text-gray-700 mb-4">Distribusi Rating</p>
        <div className="space-y-2">
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <span className="text-xs font-bold text-gray-600">{star}</span>
                  <FaStar className="text-yellow-400 text-xs" />
                </div>
                <div className="flex-1 h-2.5 bg-soft rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* ── LEFT: Tabel ── */}
        <div className={`bg-white border border-secondary rounded-3xl overflow-hidden ${selected ? 'lg:col-span-2' : ''}`}>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-soft">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3 text-gray-300 text-xs" />
              <input type="text" name="search" placeholder="Cari nama, produk, komentar..."
                onChange={handleChange}
                className="w-full bg-soft rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-gray-300 text-xs shrink-0" />
              <select name="filterRating" onChange={handleChange}
                className="bg-soft rounded-xl px-3 py-2 text-xs font-bold outline-none text-gray-500 focus:ring-2 focus:ring-primary/40">
                <option value="Semua">Semua Rating</option>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Bintang</option>)}
              </select>
              <select name="filterStatus" onChange={handleChange}
                className="bg-soft rounded-xl px-3 py-2 text-xs font-bold outline-none text-gray-500 focus:ring-2 focus:ring-primary/40">
                <option value="Semua">Semua Status</option>
                <option value="Ditampilkan">Ditampilkan</option>
                <option value="Pending">Pending</option>
                <option value="Disembunyikan">Disembunyikan</option>
              </select>
            </div>
          </div>

          {/* List ulasan */}
          <div className="divide-y divide-soft">
            {filtered.map(r => {
              const sc = statusConfig[r.status] ?? statusConfig['Pending'];
              const StatusIcon = sc.icon;
              const isActive = selected?.id === r.id;
              return (
                <div key={r.id}
                  onClick={() => setSelected(isActive ? null : r)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${isActive ? 'bg-primary/5' : 'hover:bg-soft/60'}`}>

                  {/* Gambar produk */}
                  <img
                    src={`/src/assets/gambarproduk/${r.gambar}`}
                    alt={r.produk}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 bg-soft"
                    onError={e => { e.target.src = ''; e.target.className = 'w-12 h-12 rounded-2xl bg-secondary shrink-0 flex items-center justify-center'; }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-bold text-gray-700 leading-tight">{r.nama}</p>
                        <p className="text-[10px] text-gray-400">{r.produk}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${sc.style}`}>
                        <StatusIcon className="text-[9px]" />{r.status}
                      </span>
                    </div>
                    <StarRating rating={r.rating} size="text-xs" />
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{r.komentar}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{r.tanggal}</p>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <FaSearch className="text-3xl text-secondary mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-400">Ulasan tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail Panel ── */}
        {selected && (() => {
          const sc = statusConfig[selected.status] ?? statusConfig['Pending'];
          const StatusIcon = sc.icon;
          return (
            <div className="bg-white border border-secondary rounded-3xl p-6 space-y-5 sticky top-4 h-fit">

              {/* Produk */}
              <div className="text-center pb-4 border-b border-soft">
                <img
                  src={`/src/assets/gambarproduk/${selected.gambar}`}
                  alt={selected.produk}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 bg-soft"
                  onError={e => { e.target.style.display='none'; }}
                />
                <p className="text-sm font-black text-gray-700">{selected.produk}</p>
                <StarRating rating={selected.rating} />
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 mt-2 ${sc.style}`}>
                  <StatusIcon className="text-[9px]" />{selected.status}
                </span>
              </div>

              {/* Reviewer */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Reviewer</p>
                <div className="flex items-center gap-3 p-3 bg-soft rounded-2xl">
                  <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-sm font-black text-on-primary shrink-0">
                    {selected.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{selected.nama}</p>
                    <p className="text-[10px] text-gray-400">{selected.tanggal}</p>
                  </div>
                </div>
              </div>

              {/* Komentar */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Komentar</p>
                <div className="bg-soft rounded-2xl p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">"{selected.komentar}"</p>
                </div>
              </div>

              {/* Aksi */}
              <div className="space-y-2 pt-1">
                {selected.status === 'Pending' && (
                  <button onClick={() => approveReview(selected.id)}
                    className="w-full py-2.5 rounded-2xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-xs" /> Setujui & Tampilkan
                  </button>
                )}
                <button onClick={() => toggleStatus(selected.id)}
                  className="w-full py-2.5 rounded-2xl text-xs font-bold border border-secondary text-gray-400 hover:bg-soft transition-all flex items-center justify-center gap-2">
                  {selected.status === 'Ditampilkan'
                    ? <><FaEyeSlash className="text-xs" /> Sembunyikan Ulasan</>
                    : <><FaEye className="text-xs" /> Tampilkan Ulasan</>
                  }
                </button>
              </div>

            </div>
          );
        })()}
      </div>

    </div>
  );
}
