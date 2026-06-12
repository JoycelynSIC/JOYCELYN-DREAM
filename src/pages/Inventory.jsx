import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import PageHeader  from '../components/PageHeader';

/* ─── Import gambar produk (agar Vite bundle dengan benar di production) ─── */
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

import StatCard    from '../components/StatCard';
import Badge       from '../components/Badge';
import Card        from '../components/Card';
import Button      from '../components/Button';
import Input       from '../components/Input';
import Select      from '../components/Select';
import ProgressBar from '../components/ProgressBar';
import EmptyState  from '../components/EmptyState';
import Tooltip     from '../components/Tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FaSearch, FaPlus, FaBoxOpen, FaTag, FaLayerGroup,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaChartLine,
  FaTimes, FaInfoCircle, FaChevronDown,
} from 'react-icons/fa';

const gambarMap = {
  'kalungrosegold.png': imgKalungRosegold,     'kalungchoker.png': imgKalungChoker,
  'kalungbintang.png': imgKalungBintang,       'kalungpearl.png': imgKalungPearl,
  'gelangcrystal.png': imgGelangCrystal,       'gelangperak.png': imgGelangPerak,
  'gelangbead.png': imgGelangBead,             'gelangtali.png': imgGelangTali,
  'cincincouple.png': imgCincinCouple,         'cincingold.png': imgCincinGold,
  'cincinresin.png': imgCincinResin,           'antinghoop.png': imgAntingHoop,
  'antingtassel.png': imgAntingTassel,         'antingpearl.png': imgAntingPearl,
  'antingbintang.png': imgAntingBintang,       'pressonnailflower.png': imgNailFlower,
  'pressonnailglitter.png': imgNailGlitter,    'pressonnailfrenchtip.png': imgNailFrench,
  'pressonnailombre.png': imgNailOmbre,        'tmblrpastel.png': imgTumblrPastel,
  'tumblrflower.png': imgTumblrFlower,         'tumblrglass.png': imgTumblrGlass,
  'clawclip.png': imgClawClip,                 'jepitrambutbutterfly.png': imgJepitButterfly,
  'bandopearl.png': imgBandoPearl,             'scrunchie.png': imgScrunchie,
  'tasminiselempang.png': imgTasMini,          'tasrajut.png': imgTasRajut,
  'taskoin.png': imgTasKoin,                   'framekacamata.png': imgKacamata,
  'maskerlucu.png': imgMasker,                 'stiker.png': imgStiker,
  'gancisanrio.png': imgGanci,                 'ikapinggang.png': imgIkatPinggang,
};

const getImg = (path) => {
  if (!path) return null;
  return gambarMap[path.split('/').pop()] ?? null;
};

/* Badge status stok — pakai komponen Badge langsung dengan status dari data */

const kategoriOptions = [
  'Kalung','Gelang','Cincin','Anting','Nail Art',
  'Tumblr','Aksesoris Rambut','Tas','Lainnya',
];

export default function Inventory() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('joy_dream_inventory');
    return saved ? JSON.parse(saved) : inventoryData;
  });
  const [showForm, setShowForm] = useState(false);

  const [dataForm, setDataForm] = useState({
    searchTerm:     '',
    filterKategori: 'Semua',
    filterStatus:   'Semua Status',
  });

  const [formProduk, setFormProduk] = useState({
    name: '', kategori: 'Kalung', harga: '', stock: '',
  });

  const searchInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const prevItemsCountRef = useRef(items.length);

  // Efek untuk memfokuskan input pencarian saat halaman dimuat
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Efek untuk menyimpan data ke localStorage dan mendeteksi penambahan produk baru
  useEffect(() => {
    localStorage.setItem('joy_dream_inventory', JSON.stringify(items));

    if (items.length > prevItemsCountRef.current) {
      alert(`Produk baru berhasil ditambahkan! Total produk sekarang: ${items.length}`);
    }
    prevItemsCountRef.current = items.length;
  }, [items]);

  // Efek untuk keyboard Escape dan fokus input modal ketika terbuka
  useEffect(() => {
    if (!showForm) return;

    const timer = setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showForm]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduk(p => ({ ...p, [name]: value }));
  };

  const handleTambahProduk = (e) => {
    e.preventDefault();
    if (!formProduk.name || !formProduk.harga || !formProduk.stock) return;
    const harga  = parseInt(formProduk.harga);
    const stock  = parseInt(formProduk.stock);
    const status = stock === 0 ? 'Habis' : stock <= 8 ? 'Hampir Habis' : 'Aman';
    setItems(prev => [{
      id: prev.length + 1, name: formProduk.name,
      kategori: formProduk.kategori, harga, stock, terjual: 0, status,
    }, ...prev]);
    setFormProduk({ name: '', kategori: 'Kalung', harga: '', stock: '' });
    setShowForm(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const _search      = dataForm.searchTerm.toLowerCase();
  const kategoriList = ['Semua', ...new Set(items.map(i => i.kategori))];

  const filteredData = items.filter(item => {
    const matchSearch   = item.name.toLowerCase().includes(_search);
    const matchKategori = dataForm.filterKategori === 'Semua' || item.kategori === dataForm.filterKategori;
    const matchStatus   = dataForm.filterStatus === 'Semua Status' || item.status === dataForm.filterStatus;
    return matchSearch && matchKategori && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* Preview status otomatis di form */
  const previewStatus = formProduk.stock === '' ? null
    : parseInt(formProduk.stock) === 0 ? 'Habis'
    : parseInt(formProduk.stock) <= 8  ? 'Hampir Habis'
    : 'Aman';

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Persediaan" breadcrumb={['Dashboard', 'Persediaan']}>
        <Button variant="primary" icon={<FaPlus className="text-xs" />} onClick={() => setShowForm(true)}>
          Tambah Produk
        </Button>
      </PageHeader>

      {/* ── Stat Cards — pakai StatCard ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Produk"
          value={items.length}
          desc="semua produk"
          icon={<FaBoxOpen />}
          iconBgColor="bg-[#F4F4F5]"
          iconColor="text-[#9E4BDC]"
        />
        <StatCard
          label="Hampir Habis"
          value={items.filter(i => i.stock > 0 && i.stock <= 8).length}
          desc="stok menipis"
          icon={<FaExclamationCircle />}
          iconBgColor="bg-[#F24E1E]/10"
          iconColor="text-[#F24E1E]"
        />
        <StatCard
          label="Stok Habis"
          value={items.filter(i => i.stock === 0).length}
          desc="perlu restock"
          icon={<FaTimesCircle />}
          variant="primary"
        />
      </div>

      {/* ── Filter & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          ref={searchInputRef}
          placeholder="Cari produk..."
          icon={FaSearch}
          value={dataForm.searchTerm}
          onChange={(e) => {
            setDataForm(p => ({ ...p, searchTerm: e.target.value }));
            setCurrentPage(1);
          }}
          className="flex-1 !gap-0"
        />

        {/* Filter Kategori */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="
              inline-flex items-center gap-2 sm:w-48 w-full justify-between
              bg-white border border-[#E4E4E7] rounded-xl px-4 py-3
              text-sm font-medium text-[#22285E]
              hover:border-[#9E4BDC]/50 hover:ring-4 hover:ring-[#9E4BDC]/5
              focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5
              focus:outline-none transition-all duration-200 cursor-pointer
            ">
              <span className="flex items-center gap-2 min-w-0">
                <FaLayerGroup size={13} className="text-[#A1A1AA] shrink-0" />
                <span className="truncate">{dataForm.filterKategori}</span>
              </span>
              <FaChevronDown size={11} className="text-[#A1A1AA] shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" avoidCollisions={false} className="w-48 p-0">
            <div className="px-2 pt-2 pb-1">
              <DropdownMenuLabel className="flex items-center gap-1.5 px-0">
                <FaLayerGroup size={11} />Kategori
              </DropdownMenuLabel>
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="max-h-52">
            <DropdownMenuRadioGroup
              value={dataForm.filterKategori}
              onValueChange={(val) => {
                setDataForm(p => ({ ...p, filterKategori: val }));
                setCurrentPage(1);
              }}
            >
              {kategoriList.map(k => (
                <DropdownMenuRadioItem key={k} value={k} className="cursor-pointer text-sm">
                  {k}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="
              inline-flex items-center gap-2 sm:w-44 w-full justify-between
              bg-white border border-[#E4E4E7] rounded-xl px-4 py-3
              text-sm font-medium text-[#22285E]
              hover:border-[#9E4BDC]/50 hover:ring-4 hover:ring-[#9E4BDC]/5
              focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5
              focus:outline-none transition-all duration-200 cursor-pointer
            ">
              <span className="flex items-center gap-2 min-w-0">
                <FaCheckCircle size={13} className="text-[#A1A1AA] shrink-0" />
                <span className="truncate">{dataForm.filterStatus}</span>
              </span>
              <FaChevronDown size={11} className="text-[#A1A1AA] shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" avoidCollisions={false} className="w-44">
            <DropdownMenuLabel className="flex items-center gap-1.5">
              <FaCheckCircle size={11} />Status Stok
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={dataForm.filterStatus}
              onValueChange={(val) => {
                setDataForm(p => ({ ...p, filterStatus: val }));
                setCurrentPage(1);
              }}
            >
              {['Semua Status', 'Aman', 'Hampir Habis', 'Habis'].map(s => (
                <DropdownMenuRadioItem key={s} value={s} className="cursor-pointer text-sm">
                  {s}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Tabel — pakai Card ── */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="overflow-visible">
              <tr className="bg-[#F4F4F5] border-b border-[#E4E4E7]">
                {[
                  { label: 'Produk',   icon: FaBoxOpen,   tip: null },
                  { label: 'Kategori', icon: FaLayerGroup, tip: null },
                  { label: 'Harga',    icon: FaTag,        tip: null },
                  { label: 'Stok',     icon: null,         tip: 'Jumlah unit tersisa di gudang' },
                  { label: 'Terjual',  icon: FaChartLine,  tip: 'Total unit terjual sepanjang waktu' },
                  { label: 'Status',   icon: null,         tip: 'Aman ≥ 9 pcs · Hampir Habis ≤ 8 pcs · Habis = 0' },
                ].map((h, i) => (
                  <th key={i} className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {h.icon && <h.icon className="text-[#A1A1AA] text-[10px]" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h.label}</span>
                      {h.tip && (
                        <Tooltip content={h.tip} position="top">
                          <FaInfoCircle className="text-[#A1A1AA] text-[9px] cursor-help" />
                        </Tooltip>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-[#F4F4F5]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#95D5B6]/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        {getImg(item.gambar)
                          ? <img src={getImg(item.gambar)} alt={item.name} className="w-full h-full object-cover" />
                          : <FaBoxOpen className="text-[#00B5AD] text-xs" />
                        }
                      </div>
                      <Link to={`/inventory/${item.id}`}
                        className="text-sm font-bold text-[#22285E] hover:text-[#9E4BDC] transition-colors">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-[#F4F4F5] border border-[#E4E4E7] text-[#71717A] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 w-fit">
                      <FaLayerGroup className="text-[9px] text-[#A1A1AA]" />{item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#22285E]">
                    Rp {item.harga.toLocaleString('id')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#22285E]">
                    <div className="space-y-1 min-w-[80px]">
                      <span className="text-xs font-bold text-[#22285E]">{item.stock} pcs</span>
                      <ProgressBar
                        value={item.stock}
                        max={30}
                        showValue={false}
                        size="sm"
                        variant={
                          item.stock === 0 ? 'warning'
                          : item.stock <= 8 ? 'warning'
                          : 'primary'
                        }
                        animated={false}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm text-[#71717A]">
                      <FaChartLine className="text-[#9E4BDC] text-xs" />{item.terjual}x
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Badge — pakai komponen Badge langsung dengan status stok */}
                    <Badge status={item.status} />
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      variant="search"
                      title="Produk tidak ditemukan"
                      desc="Coba ubah kata kunci pencarian atau filter kategori & status."
                      size="md"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

      {/* ── Modal Tambah Produk ── */}
      {showForm && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center shrink-0">
                  <FaBoxOpen className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Tambah Produk Baru</p>
                  <p className="text-[10px] text-[#A1A1AA]">Isi data produk aksesoris</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Form — pakai komponen Input & Select */}
            <form onSubmit={handleTambahProduk} className="p-6 space-y-4">
              <Input
                ref={nameInputRef}
                label="Nama Produk"
                name="name"
                value={formProduk.name}
                onChange={handleFormChange}
                placeholder="cth: Kalung Titanium Rosegold"
                icon={FaBoxOpen}
              />

              <Select
                label="Kategori"
                name="kategori"
                value={formProduk.kategori}
                onChange={handleFormChange}
                icon={FaLayerGroup}
                options={kategoriOptions.map(k => ({ value: k, label: k }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Harga (Rp)"
                  type="number"
                  name="harga"
                  value={formProduk.harga}
                  onChange={handleFormChange}
                  placeholder="85000"
                  icon={FaTag}
                />
                <Input
                  label="Stok (pcs)"
                  type="number"
                  name="stock"
                  value={formProduk.stock}
                  onChange={handleFormChange}
                  placeholder="20"
                  icon={FaChartLine}
                />
              </div>

              {/* Preview status otomatis — pakai Badge */}
              {previewStatus && (
                <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
                  <span className="text-[10px] text-[#A1A1AA]">Status otomatis:</span>
                  <Badge status={previewStatus} />
                  <span className="text-[10px] font-bold text-[#22285E]">{previewStatus}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" icon={<FaPlus className="text-xs" />}>
                  Simpan Produk
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
