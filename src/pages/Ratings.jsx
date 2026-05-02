import { useState } from 'react';
import ratingsData from '../data/ratings.json';
import PageHeader from '../components/PageHeader';
import { produkGambar } from './Dashboard';
import {
  FaStar, FaRegStar, FaReply, FaSearch, FaFilter,
  FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';

const getImg = (path) => {
  if (!path) return null;
  const filename = path.split('/').pop();
  return produkGambar[filename] ?? null;
};

/* ── Komponen bintang ── */
function StarRow({ count, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        i < count
          ? <FaStar key={i} className="text-yellow-400 text-xs" />
          : <FaRegStar key={i} className="text-gray-300 text-xs" />
      ))}
    </div>
  );
}

/* ── Warna badge bintang ── */
const starStyle = (b) => {
  if (b >= 5) return 'bg-green-50 text-green-600';
  if (b >= 4) return 'bg-yellow-50 text-yellow-600';
  if (b >= 3) return 'bg-orange-50 text-orange-500';
  return 'bg-red-50 text-red-500';
};

export default function Ratings() {
  const [selected, setSelected] = useState(null);
  const [balasan, setBalasan]   = useState('');

  /** State filter — Best Practice (Pertemuan 4) **/
  const [dataForm, setDataForm] = useState({
    search:      '',
    filterBintang: 'Semua',
    filterBalas:   'Semua',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm(prev => ({ ...prev, [name]: value }));
  };

  /** Logic filter **/
  const _search = dataForm.search.toLowerCase();
  const filtered = ratingsData.filter(r => {
    const matchSearch  = r.pelanggan.toLowerCase().includes(_search) || r.produk.toLowerCase().includes(_search);
    const matchBintang = dataForm.filterBintang === 'Semua' || r.bintang === Number(dataForm.filterBintang);
    const matchBalas   = dataForm.filterBalas === 'Semua'
      || (dataForm.filterBalas === 'Sudah' && r.dibalas)
      || (dataForm.filterBalas === 'Belum' && !r.dibalas);
    return matchSearch && matchBintang && matchBalas;
  });

  /** Stats **/
  const rataRata   = (ratingsData.reduce((a, r) => a + r.bintang, 0) / ratingsData.length).toFixed(1);
  const belumBalas = ratingsData.filter(r => !r.dibalas).length;
  const bintang5   = ratingsData.filter(r => r.bintang === 5).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader title="Ulasan Pelanggan" breadcrumb={['Dashboard', 'Ulasan']} />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Ulasan',   val: ratingsData.length,  sub: 'ulasan masuk',      bg: 'bg-white'       },
          { label: 'Rata-rata',      val: `${rataRata} ★`,     sub: 'dari 5 bintang',    bg: 'bg-yellow-50'   },
          { label: 'Bintang 5',      val: bintang5,            sub: 'ulasan sempurna',   bg: 'bg-green-50'    },
          { label: 'Belum Dibalas',  val: belumBalas,          sub: 'perlu respons',     bg: belumBalas > 0 ? 'bg-[#FFF5F5]' : 'bg-white' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border border-secondary rounded-2xl p-4`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
            <p className="text-2xl font-black text-gray-700 mt-1">{s.val}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Distribusi bintang ── */}
      <div className="bg-white border border-secondary rounded-3xl p-6">
        <p className="text-sm font-black text-gray-700 mb-4">Distribusi Rating</p>
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map(b => {
            const count = ratingsData.filter(r => r.bintang === b).length;
            const pct   = Math.round((count / ratingsData.length) * 100);
            return (
              <div key={b} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span className="text-xs font-bold text-gray-600">{b}</span>
                </div>
                <div className="flex-1 h-2.5 bg-soft rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-300 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right shrink-0">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* ── LEFT: List ulasan ── */}
        <div className={selected ? 'lg:col-span-2' : ''}>

          {/* Toolbar */}
          <div className="bg-white border border-secondary rounded-3xl overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-soft">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-3 text-gray-300 text-xs" />
                <input type="text" name="search" placeholder="Cari nama atau produk..."
                  onChange={handleChange}
                  className="w-full bg-soft rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-gray-300 text-gray-600"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <FaFilter className="text-gray-300 text-xs shrink-0" />
                {/* Filter bintang */}
                {['Semua', '5', '4', '3', '2', '1'].map(b => (
                  <button key={b} onClick={() => setDataForm(p => ({ ...p, filterBintang: b }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      dataForm.filterBintang === b ? 'bg-yellow-100 text-yellow-600' : 'bg-soft text-gray-400 hover:text-gray-600'
                    }`}>
                    {b !== 'Semua' && <FaStar className="text-[9px]" />}{b}
                  </button>
                ))}
                <div className="w-px h-4 bg-secondary" />
                {/* Filter balasan */}
                {['Semua', 'Belum', 'Sudah'].map(b => (
                  <button key={b} onClick={() => setDataForm(p => ({ ...p, filterBalas: b }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      dataForm.filterBalas === b ? 'bg-primary text-on-primary' : 'bg-soft text-gray-400 hover:text-gray-600'
                    }`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-soft">
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <FaStar className="text-3xl text-secondary mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-400">Ulasan tidak ditemukan</p>
                </div>
              )}
              {filtered.map(r => (
                <div key={r.id}
                  onClick={() => setSelected(selected?.id === r.id ? null : r)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
                    selected?.id === r.id ? 'bg-primary/5' : 'hover:bg-soft/60'
                  }`}>

                  {/* Gambar produk */}
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-secondary shrink-0">
                    <img src={getImg(r.gambar)} alt={r.produk} className="w-full h-full object-cover" />
                  </div>

                  {/* Konten */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-bold text-gray-700 leading-tight">{r.pelanggan}</p>
                        <p className="text-[10px] text-gray-400 truncate">{r.produk}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${starStyle(r.bintang)}`}>
                          <FaStar className="text-[9px]" />{r.bintang}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                          r.dibalas ? 'bg-green-50 text-green-600' : 'bg-[#FFF5F5] text-[#9d2a5e]'
                        }`}>
                          {r.dibalas
                            ? <><FaCheckCircle className="text-[8px]" /> Dibalas</>
                            : <><FaExclamationCircle className="text-[8px]" /> Belum</>
                          }
                        </span>
                      </div>
                    </div>
                    <StarRow count={r.bintang} />
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{r.komentar}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{r.tanggal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Detail & Balas ── */}
        {selected && (
          <div className="bg-white border border-secondary rounded-3xl p-6 space-y-5 sticky top-4 h-fit">

            {/* Gambar + info produk */}
            <div className="text-center pb-4 border-b border-soft">
              <div className="w-20 h-20 rounded-3xl overflow-hidden bg-secondary mx-auto mb-3">
                <img src={getImg(selected.gambar)} alt={selected.produk} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-bold text-gray-500">{selected.produk}</p>
            </div>

            {/* Info ulasan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-gray-700">{selected.pelanggan}</p>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${starStyle(selected.bintang)}`}>
                  <FaStar className="text-[9px]" />{selected.bintang}/5
                </span>
              </div>
              <StarRow count={selected.bintang} />
              <p className="text-xs text-gray-500 leading-relaxed bg-soft rounded-2xl p-3">
                "{selected.komentar}"
              </p>
              <p className="text-[10px] text-gray-400">{selected.tanggal}</p>
            </div>

            {/* Status balasan */}
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${
              selected.dibalas ? 'bg-green-50 text-green-600' : 'bg-[#FFF5F5] text-[#9d2a5e]'
            }`}>
              {selected.dibalas
                ? <><FaCheckCircle /> Ulasan ini sudah dibalas</>
                : <><FaExclamationCircle /> Ulasan ini belum dibalas</>
              }
            </div>

            {/* Form balas */}
            {!selected.dibalas && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tulis Balasan</p>
                <textarea
                  value={balasan}
                  onChange={e => setBalasan(e.target.value)}
                  placeholder="Halo kak, terima kasih sudah berbelanja di Na_store.id! 🌸"
                  rows={3}
                  className="w-full bg-soft rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-gray-300 text-gray-600 resize-none"
                />
                <button
                  onClick={() => { if (balasan.trim()) { setBalasan(''); setSelected(null); } }}
                  className="w-full py-2.5 rounded-2xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaReply className="text-[10px]" /> Kirim Balasan
                </button>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
