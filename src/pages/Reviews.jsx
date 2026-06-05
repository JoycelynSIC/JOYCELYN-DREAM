import { useState } from 'react';
import reviewsData from '../data/reviews.json';
import PageHeader  from '../components/PageHeader';
import StatCard    from '../components/StatCard';
import Card        from '../components/Card';
import Badge       from '../components/Badge';
import Button      from '../components/Button';
import Input       from '../components/Input';
import ProgressBar from '../components/ProgressBar';
import EmptyState  from '../components/EmptyState';
import Tooltip     from '../components/Tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FaStar, FaSearch, FaFilter,
  FaCheckCircle, FaClock, FaEyeSlash, FaEye, FaInfoCircle, FaChevronDown,
} from 'react-icons/fa';

/* Map status ulasan → Badge status */
const reviewBadgeMap = {
  'Ditampilkan':   'Selesai',
  'Pending':       'Proses',
  'Disembunyikan': 'Batal',
};

function StarRating({ rating, size = 'text-sm' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <FaStar key={i} className={`${size} ${i <= rating ? 'text-yellow-400' : 'text-[#E4E4E7]'}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews,  setReviews]  = useState(reviewsData);
  const [selected, setSelected] = useState(null);
  const [dataForm, setDataForm] = useState({
    search: '', filterRating: 'Semua', filterStatus: 'Semua',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const _search  = dataForm.search.toLowerCase();
  const filtered = reviews.filter(r => {
    const matchSearch = r.nama.toLowerCase().includes(_search)
      || r.produk.toLowerCase().includes(_search)
      || r.komentar.toLowerCase().includes(_search);
    const matchRating = dataForm.filterRating === 'Semua' || r.rating === Number(dataForm.filterRating);
    const matchStatus = dataForm.filterStatus === 'Semua' || r.status === dataForm.filterStatus;
    return matchSearch && matchRating && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const avgRating     = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
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

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Ulasan Pelanggan" breadcrumb={['Dashboard', 'Ulasan']} />

      {/* ── Stat Cards — pakai StatCard ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Ulasan"
          value={reviews.length}
          desc="semua ulasan"
          icon={<FaStar />}
          iconBgColor="bg-[#F4F4F5]"
          iconColor="text-[#9E4BDC]"
        />
        <StatCard
          label="Rating Rata-rata"
          value={avgRating}
          desc="dari 5 bintang"
          icon={<FaStar />}
          variant="primary"
        />
        <StatCard
          label="Bintang 5"
          value={totalBintang5}
          desc="ulasan terbaik"
          icon={<FaStar />}
          iconBgColor="bg-yellow-50"
          iconColor="text-yellow-400"
        />
        <StatCard
          label="Perlu Ditinjau"
          value={totalPending}
          desc="menunggu persetujuan"
          icon={<FaClock />}
          iconBgColor="bg-[#F24E1E]/10"
          iconColor="text-[#F24E1E]"
        />
      </div>

      {/* ── Distribusi Rating — pakai Card + ProgressBar ── */}
      <Card
        title="Distribusi Rating"
        action={
          <Tooltip content="Persentase ulasan berdasarkan jumlah bintang" position="left">
            <FaInfoCircle className="text-[#A1A1AA] text-sm cursor-help" />
          </Tooltip>
        }
      >
        <div className="space-y-3">
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <span className="text-xs font-bold text-[#71717A]">{star}</span>
                  <FaStar className="text-yellow-400 text-xs" />
                </div>
                <ProgressBar
                  value={count}
                  max={reviews.length}
                  showValue={false}
                  size="md"
                  variant={star >= 4 ? 'primary' : star === 3 ? 'secondary' : 'warning'}
                  animated={false}
                  className="flex-1"
                />
                <span className="text-xs text-[#A1A1AA] w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* LEFT — pakai Card + Input + Select ── */}
        <Card className={selected ? 'lg:col-span-2' : ''} padding={false}>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-[#E4E4E7]">
            <Input
              placeholder="Cari nama, produk, komentar..."
              icon={FaSearch}
              value={dataForm.search}
              onChange={(e) => {
                setDataForm(p => ({ ...p, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="flex-1 !gap-0"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-[#A1A1AA] text-xs shrink-0" />

              {/* Filter Rating */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="
                    inline-flex items-center gap-2 w-36 justify-between
                    bg-white border border-[#E4E4E7] rounded-xl px-3 py-2.5
                    text-sm font-medium text-[#22285E]
                    hover:border-[#9E4BDC]/50 hover:ring-4 hover:ring-[#9E4BDC]/5
                    focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5
                    focus:outline-none transition-all duration-200 cursor-pointer
                  ">
                    <span className="flex items-center gap-2 min-w-0">
                      <FaStar size={12} className="text-yellow-400 shrink-0" />
                      <span className="truncate">
                        {dataForm.filterRating === 'Semua' ? 'Semua Rating' : `${dataForm.filterRating} Bintang`}
                      </span>
                    </span>
                    <FaChevronDown size={11} className="text-[#A1A1AA] shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" avoidCollisions={false} className="w-36">
                  <DropdownMenuLabel className="flex items-center gap-1.5">
                    <FaStar size={11} className="text-yellow-400" />Rating
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={dataForm.filterRating}
                    onValueChange={(val) => {
                      setDataForm(p => ({ ...p, filterRating: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <DropdownMenuRadioItem value="Semua" className="cursor-pointer text-sm">
                      Semua Rating
                    </DropdownMenuRadioItem>
                    {[5, 4, 3, 2, 1].map(r => (
                      <DropdownMenuRadioItem key={r} value={String(r)} className="cursor-pointer text-sm">
                        <span className="flex items-center gap-1.5">
                          {r} <FaStar size={10} className="text-yellow-400" />
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Status */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="
                    inline-flex items-center gap-2 w-40 justify-between
                    bg-white border border-[#E4E4E7] rounded-xl px-3 py-2.5
                    text-sm font-medium text-[#22285E]
                    hover:border-[#9E4BDC]/50 hover:ring-4 hover:ring-[#9E4BDC]/5
                    focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5
                    focus:outline-none transition-all duration-200 cursor-pointer
                  ">
                    <span className="flex items-center gap-2 min-w-0">
                      <FaCheckCircle size={12} className="text-[#A1A1AA] shrink-0" />
                      <span className="truncate">{dataForm.filterStatus === 'Semua' ? 'Semua Status' : dataForm.filterStatus}</span>
                    </span>
                    <FaChevronDown size={11} className="text-[#A1A1AA] shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" avoidCollisions={false} className="w-40">
                  <DropdownMenuLabel className="flex items-center gap-1.5">
                    <FaCheckCircle size={11} />Status
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={dataForm.filterStatus}
                    onValueChange={(val) => {
                      setDataForm(p => ({ ...p, filterStatus: val }));
                      setCurrentPage(1);
                    }}
                  >
                    {['Semua', 'Ditampilkan', 'Pending', 'Disembunyikan'].map(s => (
                      <DropdownMenuRadioItem key={s} value={s} className="cursor-pointer text-sm">
                        {s === 'Semua' ? 'Semua Status' : s}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* List ulasan */}
          <div className="divide-y divide-[#E4E4E7]">
            {paginatedData.map(r => {
              const isActive = selected?.id === r.id;
              return (
                <div key={r.id}
                  onClick={() => setSelected(isActive ? null : r)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
                    isActive ? 'bg-[#9E4BDC]/5' : 'hover:bg-[#F4F4F5]/60'
                  }`}
                >
                  <img
                    src={r.gambar}
                    alt={r.produk}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 bg-[#F4F4F5]"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-bold text-[#22285E] leading-tight">{r.nama}</p>
                        <p className="text-[10px] text-[#A1A1AA]">{r.produk}</p>
                      </div>
                      {/* Badge — pakai komponen Badge */}
                      <Badge status={reviewBadgeMap[r.status] ?? 'Proses'} />
                    </div>
                    <StarRating rating={r.rating} size="text-xs" />
                    <p className="text-xs text-[#71717A] mt-1.5 line-clamp-2">{r.komentar}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-1">{r.tanggal}</p>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <EmptyState
                variant="star"
                title="Ulasan tidak ditemukan"
                desc="Coba ubah kata kunci atau filter rating & status ulasan."
                size="md"
              />
            )}
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E4E4E7] flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>

        {/* RIGHT: Detail Panel — pakai Card + Button ── */}
        {selected && (
          <Card className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-hidden">
            <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="pr-3">

            {/* Produk */}
            <div className="text-center pb-4 border-b border-[#E4E4E7]">
              <img
                src={selected.gambar}
                alt={selected.produk}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 bg-[#F4F4F5]"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <p className="text-sm font-black text-[#22285E]">{selected.produk}</p>
              <StarRating rating={selected.rating} />
              <div className="mt-2 flex justify-center">
                <Badge status={reviewBadgeMap[selected.status] ?? 'Proses'} />
              </div>
            </div>

            {/* Reviewer */}
            <div className="space-y-1 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Reviewer</p>
              <div className="flex items-center gap-3 p-3 bg-[#F4F4F5] rounded-xl">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0">
                  {selected.nama.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#22285E]">{selected.nama}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{selected.tanggal}</p>
                </div>
              </div>
            </div>

            {/* Komentar */}
            <div className="space-y-1 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Komentar</p>
              <div className="bg-[#F4F4F5] rounded-xl p-4">
                <p className="text-sm text-[#71717A] leading-relaxed">"{selected.komentar}"</p>
              </div>
            </div>

            {/* Aksi — pakai Button ── */}
            <div className="space-y-2 pt-4">
              {selected.status === 'Pending' && (
                <Button
                  variant="primary"
                  className="w-full"
                  icon={<FaCheckCircle className="text-xs" />}
                  onClick={() => approveReview(selected.id)}
                >
                  Setujui & Tampilkan
                </Button>
              )}
              <Button
                variant={selected.status === 'Ditampilkan' ? 'warning' : 'outline'}
                className="w-full"
                icon={selected.status === 'Ditampilkan' ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                onClick={() => toggleStatus(selected.id)}
              >
                {selected.status === 'Ditampilkan' ? 'Sembunyikan Ulasan' : 'Tampilkan Ulasan'}
              </Button>
            </div>

            </div>
            </ScrollArea>
          </Card>
        )}
      </div>

    </div>
  );
}
