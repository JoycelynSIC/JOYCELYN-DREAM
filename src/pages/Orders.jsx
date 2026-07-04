import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { transaksiAPI, normaliseTransaksi } from '../services/transaksiAPI';
import { produkAPI, getProdukImageUrl, normaliseProduk } from '../services/produkAPI';
import { userAPI } from '../services/userAPI';
import PageHeader from '../components/PageHeader';

import Badge     from '../components/Badge';
import StatCard  from '../components/StatCard';
import Card      from '../components/Card';
import Button    from '../components/Button';
import Input     from '../components/Input';
import Select    from '../components/Select';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  FaShoppingBag, FaSearch, FaFilter, FaCheckCircle,
  FaSpinner, FaTimesCircle, FaStar, FaBoxOpen, FaEye, FaTimes,
  FaUser, FaCalendarAlt, FaMoneyBillWave,
  FaPlus, FaEdit, FaTrash,
} from 'react-icons/fa';
import { useToast, ToastContainer } from '../components/Toast';

// ── Constants ─────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;
const NOTIF_KEY = 'joy_dream_order_notif';

const statusConfig = {
  Selesai:    { style: 'bg-status-success/10 text-status-success border border-status-success/20', icon: FaCheckCircle },
  Proses:     { style: 'bg-surface-neutral text-text-light border border-surface-border',          icon: FaSpinner     },
  Batal:      { style: 'bg-status-warning/10 text-status-warning border border-status-warning/20', icon: FaTimesCircle },
  Dibatalkan: { style: 'bg-status-warning/10 text-status-warning border border-status-warning/20', icon: FaTimesCircle },
};

const isBatalStatus = (status) =>
  status === 'Batal' || status === 'Dibatalkan';

const getImg = (path) => {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http')) return path;
  return getProdukImageUrl(path);
};

const saveOrderNotif = (orders) => {
  try {
    const ids = orders.map(o => o.id);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
};


export default function Orders() {
  const { toasts, showToast, removeToast } = useToast();

  // ── showToast ref proxy (avoid dep loop in useCallback) ──────────────────────
  const showToastRef = useRef(showToast);
  useEffect(() => { showToastRef.current = showToast; }, [showToast]);

  // ── Core state ────────────────────────────────────────────────────────────────
  const [orders, setOrders]         = useState([]);
  const [totalRows, setTotalRows]   = useState(0);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // ── Stat counts (langsung dari DB, bukan dari halaman aktif) ─────────────────
  const [statCounts, setStatCounts] = useState({ total: 0, selesai: 0, proses: 0 });

  const [selected, setSelected]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [hapusTarget, setHapusTarget] = useState(null);
  const [editForm, setEditForm]     = useState({ status: 'Proses', metode: 'Transfer Bank' });

  // ── Pagination / Search / Filter ──────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ── Debounce search 400ms ─────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Reset page on search/filter change ───────────────────────────────────────
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filterStatus]);


  // ── Add form state ────────────────────────────────────────────────────────────
  const [formPesanan, setFormPesanan] = useState({
    customer: '', produk: '', qty: 1, total: '', status: 'Proses',
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    metode: 'Transfer BCA',
  });

  // ── Product autocomplete state ────────────────────────────────────────────────
  const [produkQuery, setProdukQuery]       = useState('');
  const [produkDropdown, setProdukDropdown] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const produkInputRef    = useRef(null);
  const produkDropdownRef = useRef(null);

  // ── Fetch orders (server-side pagination) ────────────────────────────────────
  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data, total } = await transaksiAPI.fetchTransaksiPaged({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
        status: filterStatus,
      });
      const normalised = data.map(normaliseTransaksi);
      setOrders(normalised);
      setTotalRows(total);
      if (!silent) saveOrderNotif(normalised);
    } catch (err) {
      setError(err?.message ?? 'Gagal memuat pesanan.');
      if (!silent) showToastRef.current({ type: 'error', title: 'Gagal memuat', message: err?.message ?? 'Coba lagi.' });
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentPage, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // ── Polling every 30s (silent, page 1 only) ───────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (currentPage === 1) fetchOrders(true);
    }, 30000);
    return () => clearInterval(id);
  }, [currentPage, fetchOrders]);


  // ── Load products once on mount (for gambar map & autocomplete) ──────────────
  useEffect(() => {
    produkAPI.fetchAllProduk()
      .then(items => setInventoryItems(items))
      .catch(() => { /* non-fatal */ });
  }, []);

  // ── Fetch stat counts dari DB (bukan dari halaman aktif) ─────────────────────
  const fetchStatCounts = useCallback(async () => {
    try {
      const counts = await transaksiAPI.fetchStatCounts();
      setStatCounts(counts);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => { fetchStatCounts(); }, [fetchStatCounts]);

  // Refresh stat counts tiap 30s bersamaan dengan polling orders
  useEffect(() => {
    const id = setInterval(fetchStatCounts, 30000);
    return () => clearInterval(id);
  }, [fetchStatCounts]);

  // ── Close autocomplete dropdown on outside click ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (
        produkDropdownRef.current && !produkDropdownRef.current.contains(e.target) &&
        produkInputRef.current && !produkInputRef.current.contains(e.target)
      ) {
        setProdukDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

 const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
  const totalOmzet  = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const produkSuggestions = produkQuery.trim() === ''
    ? inventoryItems.slice(0, 6)
    : inventoryItems.filter(p =>
        p.name.toLowerCase().includes(produkQuery.toLowerCase()) ||
        (p.kategori ?? '').toLowerCase().includes(produkQuery.toLowerCase())
      ).slice(0, 8);


 // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleSelectProduk = (item) => {
    setSelectedProduk(item);
    setProdukQuery(item.name);
    setProdukDropdown(false);
    const qty = Number(formPesanan.qty) || 1;
    setFormPesanan(p => ({
      ...p,
      produk: item.name,
      gambar: item.gambar,
      total: String(item.harga * qty),
    }));
  };

  const handleProdukQueryChange = (e) => {
    const val = e.target.value;
    setProdukQuery(val);
    setProdukDropdown(true);
    setSelectedProduk(null);
    setFormPesanan(p => ({ ...p, produk: val, gambar: '', total: '' }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormPesanan(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'qty' && selectedProduk) {
        updated.total = String(selectedProduk.harga * (Number(value) || 1));
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formPesanan.customer || !formPesanan.produk || !formPesanan.total) return;
    const namaPelanggan = formPesanan.customer;
    try {
      const newOrder = await transaksiAPI.createTransaksiAdmin({
        namaPelanggan,
        idPelanggan:    '',   // form admin manual, tidak ada FK
        produk:         formPesanan.produk,
        idProduk:       selectedProduk?.id       ?? '',
        kategoriProduk: selectedProduk?.kategori ?? '',
        qty:            Number(formPesanan.qty)  || 1,
        hargaSatuan:    selectedProduk?.harga    ?? Number(formPesanan.total),
        total:          Number(formPesanan.total),
        metode:         formPesanan.metode,
        status:         formPesanan.status,
      });
      setFormPesanan({
        customer: '', produk: '', qty: 1, total: '', status: 'Proses',
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        metode: 'Transfer Bank',
      });
      setProdukQuery('');
      setSelectedProduk(null);
      setShowForm(false);
      showToast({ type: 'success', title: 'Pesanan ditambahkan!', message: `Pesanan dari "${namaPelanggan}" berhasil disimpan ke database.` });
      // Tambahkan ke state lokal agar langsung muncul tanpa refetch
      if (newOrder) setOrders(prev => [newOrder, ...prev]);
      fetchStatCounts();
    } catch (err) {
      showToast({ type: 'error', title: 'Gagal menyimpan', message: err?.message ?? 'Coba lagi.' });
    }
  };

  const openEdit = (o) => {
    setEditTarget(o);
    setEditForm({ status: o.status, metode: o.metode });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const oldStatus = editTarget.status;
    const newStatus = editForm.status;
    const idProduk  = editTarget.idProduk;
    const qty       = Number(editTarget.qty) || 1;

    // ── 1. Update status di DB ──────────────────────────────────────────────────
    try {
      await transaksiAPI.updateStatus(editTarget.id, newStatus);
    } catch (err) {
      showToast({ type: 'error', title: 'Gagal update', message: err?.message ?? 'Coba lagi.' });
      return;
    }

    // ── 1.5. Update poin customer dan transaksi jika status berubah ke/dari Selesai ──
    const poinDihitung = Math.floor((editTarget.total ?? 0) / 1000);
    if (oldStatus !== 'Selesai' && newStatus === 'Selesai') {
      try {
        if (editTarget.idPelanggan) {
          await userAPI.tambahPoinCustomer(editTarget.idPelanggan, poinDihitung);
        }
        await transaksiAPI.updatePoinTransaksi(editTarget.id, poinDihitung);
      } catch (err) {
        console.error("Gagal update poin saat Selesai:", err);
      }
    } else if (oldStatus === 'Selesai' && newStatus !== 'Selesai') {
      try {
        if (editTarget.idPelanggan) {
          await userAPI.tambahPoinCustomer(editTarget.idPelanggan, -poinDihitung);
        }
        await transaksiAPI.updatePoinTransaksi(editTarget.id, 0);
      } catch (err) {
        console.error("Gagal update poin saat batal Selesai:", err);
      }
    }

    // ── 2. Manajemen stok otomatis (diurus oleh trigger DB, frontend cukup sync cache) ──
    const prorogToSelesai = oldStatus === 'Proses'  && newStatus === 'Selesai';
    const refundToCancel  = oldStatus === 'Selesai' && (newStatus === 'Batal' || newStatus === 'Dibatalkan');

    if (prorogToSelesai || refundToCancel) {
      // Refresh inventoryItems cache agar autocomplete & gambar tetap sinkron dengan perubahan DB trigger
      setTimeout(() => {
        produkAPI.fetchAllProduk().then(items => setInventoryItems(items)).catch(() => {});
      }, 500);
    }

    // ── 3. Update state lokal ──────────────────────────────────────────────────
    const poin = newStatus === 'Selesai' ? poinDihitung : 0;
    setOrders(prev => prev.map(o =>
      o.id === editTarget.id
        ? { ...o, status: newStatus, metode: editForm.metode, poin }
        : o
    ));
    if (selected?.id === editTarget.id) {
      setSelected(prev => ({ ...prev, status: newStatus, metode: editForm.metode, poin }));
    }

    showToast({ type: 'update', title: 'Pesanan diperbarui!', message: `${editTarget.id} berhasil diupdate ke ${newStatus}.` });
    setEditTarget(null);
    fetchStatCounts(); // refresh stat cards
  };

  const handleHapus = () => {
    const id = hapusTarget.id;
    setOrders(prev => prev.filter(o => o.id !== hapusTarget.id));
    if (selected?.id === hapusTarget.id) setSelected(null);
    setHapusTarget(null);
    showToast({ type: 'delete', title: 'Pesanan dihapus!', message: `Pesanan ${id} telah dihapus permanen.` });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Pesanan" breadcrumb={['Dashboard', 'Pesanan']}>
        <p className="text-xs text-text-disable mr-2 hidden sm:block">
          {orders.length} pesanan · Omzet Rp {totalOmzet.toLocaleString('id')}
        </p>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-surface-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shrink-0">
          <FaPlus className="text-xs" /> Tambah Pesanan
        </button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Pesanan" value={statCounts.total}   desc="semua pesanan"   icon={<FaShoppingBag />} iconBgColor="bg-[#F4F4F5]"   iconColor="text-[#9E4BDC]" />
        <StatCard label="Selesai"       value={statCounts.selesai} desc="transaksi lunas" icon={<FaCheckCircle />} iconBgColor="bg-[#00B5AD]/10" iconColor="text-[#00B5AD]" />
        <StatCard label="Diproses"      value={statCounts.proses}  desc="menunggu proses" icon={<FaSpinner />}     iconBgColor="bg-[#F4F4F5]"   iconColor="text-[#A1A1AA]" />
      </div>

      {/* ── Main 2-col ── */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

        {/* LEFT: Tabel */}
        <Card className={selected ? 'lg:col-span-2' : ''} padding={false}>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-[#E4E4E7]">
            <Input
              placeholder="Cari ID, nama, atau produk..."
              icon={FaSearch}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 !gap-0"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-[#A1A1AA] text-xs shrink-0" />
              {['Semua', 'Selesai', 'Proses', 'Batal'].map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={filterStatus === s ? 'primary' : 'ghost'}
                  onClick={() => {
                    setFilterStatus(s);
                    setCurrentPage(1);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-neutral border-b border-surface-border">
                  {['ID Pesanan', 'Pelanggan', 'Produk', 'Total', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-text-disable">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const sc = statusConfig[o.status] ?? statusConfig.Proses;
                  const isActive = selected?.id === o.id;
                  return (
                    <tr key={o.id}
                      className={`border-b border-surface-border last:border-0 transition-colors ${
                        isActive ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-neutral/60'
                      }`}>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{o.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-bold text-text-dark leading-tight">{o.customer}</p>
                        <p className="text-[10px] text-text-disable">{o.tanggal}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {(() => {
                          // Lookup gambar dari inventoryItems cache
                          const cached = inventoryItems.find(p => p.id === o.idProduk);
                          const imgSrc = getImg(cached?.gambar ?? o.gambar);
                          const detailPath = o.idProduk ? `/inventory/${o.idProduk}` : null;
                          return (
                            <div className="flex items-center gap-2">
                              {/* Thumbnail — klik ke detail */}
                              {detailPath ? (
                                <Link to={detailPath} className="shrink-0 block" title="Lihat detail produk">
                                  <div className="w-9 h-9 bg-secondary/20 rounded-xl overflow-hidden flex items-center justify-center ring-0 hover:ring-2 hover:ring-[#9E4BDC]/40 transition-all">
                                    {imgSrc
                                      ? <img src={imgSrc} alt={o.produk} className="w-full h-full object-cover" />
                                      : <FaBoxOpen className="text-status-success text-[10px]" />
                                    }
                                  </div>
                                </Link>
                              ) : (
                                <div className="w-9 h-9 bg-secondary/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                  {imgSrc
                                    ? <img src={imgSrc} alt={o.produk} className="w-full h-full object-cover" />
                                    : <FaBoxOpen className="text-status-success text-[10px]" />
                                  }
                                </div>
                              )}
                              {/* Nama produk — klik ke detail */}
                              <div>
                                {detailPath ? (
                                  <Link to={detailPath}
                                    className="text-xs font-semibold text-text-dark leading-tight hover:text-[#9E4BDC] hover:underline transition-colors block"
                                    title="Lihat detail produk"
                                  >
                                    {o.produk}
                                  </Link>
                                ) : (
                                  <p className="text-xs font-semibold text-text-dark leading-tight">{o.produk}</p>
                                )}
                                <p className="text-[10px] text-text-disable">{o.qty} pcs</p>
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-black text-text-dark">Rp {o.total.toLocaleString('id')}</p>
                        {o.poin > 0 && (
                          <p className="text-[10px] text-status-success font-semibold flex items-center gap-0.5">
                            <FaStar className="text-yellow-400 text-[8px]" />+{o.poin} poin
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge status={o.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(isActive ? null : o)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              isActive
                                ? 'bg-primary text-surface-white'
                                : 'bg-surface-gray border border-surface-border text-text-disable hover:bg-secondary/20 hover:text-status-success'
                            }`}>
                            {isActive ? <FaTimes className="text-[10px]" /> : <FaEye className="text-[10px]" />}
                          </button>
                          <button
                            onClick={() => openEdit(o)}
                            className="w-7 h-7 rounded-lg border border-surface-border bg-surface-gray flex items-center justify-center text-text-disable hover:bg-[#9E4BDC]/10 hover:text-[#9E4BDC] hover:border-[#9E4BDC]/30 transition-all"
                            title="Edit pesanan"
                          >
                            <FaEdit className="text-[10px]" />
                          </button>
                          <button
                            onClick={() => setHapusTarget(o)}
                            className="w-7 h-7 rounded-lg border border-surface-border bg-surface-gray flex items-center justify-center text-text-disable hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] hover:border-[#F24E1E]/30 transition-all"
                            title="Hapus pesanan"
                          >
                            <FaTrash className="text-[10px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="py-16 text-center">
                <FaSearch className="text-3xl text-text-disable mx-auto mb-2" />
                <p className="text-sm font-bold text-text-disable">Pesanan tidak ditemukan</p>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E4E4E7] flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Prev */}
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

                  {/* Smart windowed page numbers */}
                  {(() => {
                    const WINDOW = 1; // pages shown on each side of current
                    const pages = [];

                    const addPage = (p) => pages.push(
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === currentPage}
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p); }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                    const addEllipsis = (key) => pages.push(
                      <PaginationItem key={key}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );

                    // always show page 1
                    addPage(1);

                    const rangeStart = Math.max(2, currentPage - WINDOW);
                    const rangeEnd   = Math.min(totalPages - 1, currentPage + WINDOW);

                    if (rangeStart > 2) addEllipsis('start-ellipsis');
                    for (let p = rangeStart; p <= rangeEnd; p++) addPage(p);
                    if (rangeEnd < totalPages - 1) addEllipsis('end-ellipsis');

                    // always show last page
                    if (totalPages > 1) addPage(totalPages);

                    return pages;
                  })()}

                  {/* Next */}
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

        {/* RIGHT: Detail Panel */}
        {selected && (() => {
          return (
            <Card className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-hidden" padding={true}>
            <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="pr-3">
              <div className="flex items-start justify-between pb-4 border-b border-[#E4E4E7]">
                <div>
                  <span className="text-xs font-black text-[#9E4BDC] bg-[#9E4BDC]/10 px-2.5 py-1 rounded-lg">{selected.id}</span>
                  <p className="text-[10px] text-[#A1A1AA] mt-1.5 flex items-center gap-1">
                    <FaCalendarAlt className="text-[#95D5B6]" />{selected.tanggal}
                  </p>
                </div>
                <Badge status={selected.status} />
              </div>

              {/* Pelanggan */}
              <div className="space-y-2 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Pelanggan</p>
                <div className="flex items-center gap-3 p-3 bg-surface-gray border border-surface-border rounded-xl">
                  <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-sm font-black text-surface-white shrink-0">
                    {selected.customer.charAt(0)}
                  </div>
                  <p className="text-sm font-bold text-text-dark">{selected.customer}</p>
                </div>
              </div>

              {/* Detail Produk */}
              <div className="space-y-2 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Detail Produk</p>
                <div className="flex items-center gap-3 p-3 border border-surface-border rounded-xl">
                  <div className="w-14 h-14 bg-secondary/20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {getImg(selected.gambar)
                      ? <img src={getImg(selected.gambar)} alt={selected.produk} className="w-full h-full object-cover" />
                      : <FaBoxOpen className="text-status-success text-sm" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">{selected.produk}</p>
                    <p className="text-[10px] text-text-disable">{selected.qty} pcs</p>
                  </div>
                </div>
              </div>

              {/* Pembayaran */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable mb-2">Pembayaran</p>
                {[
                  { label: 'Metode', val: selected.metode,                             icon: FaMoneyBillWave },
                  { label: 'Total',  val: `Rp ${selected.total.toLocaleString('id')}`, icon: FaShoppingBag   },
                  { label: 'Poin',   val: selected.poin > 0 ? `+${selected.poin} poin` : '-', icon: FaStar  },
                ].map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
                      <span className="text-xs text-text-disable flex items-center gap-1.5">
                        <RowIcon className="text-secondary text-[10px]" />{row.label}
                      </span>
                      <span className={`text-xs font-bold ${row.label === 'Poin' && selected.poin > 0 ? 'text-status-success' : 'text-text-dark'}`}>
                        {row.val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Aksi */}
              <div className="space-y-2 pt-4">
                {selected.status === 'Proses' && (
                  <Button variant="primary" className="w-full" icon={<FaCheckCircle className="text-xs" />}
                    onClick={() => {
                      setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, status: 'Selesai' } : o));
                      setSelected(p => ({ ...p, status: 'Selesai' }));
                    }}>
                    Tandai Selesai
                  </Button>
                )}
                <Button variant="outline" className="w-full" icon={<FaUser className="text-xs" />}>
                  Lihat Profil Pelanggan
                </Button>
              </div>
            </div>
            </ScrollArea>
            </Card>
          );
        })()}
      </div>

      {/* ── Modal Edit Pesanan ── */}
      {editTarget && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#22285E] rounded-xl flex items-center justify-center shrink-0">
                  <FaEdit className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Edit Pesanan</p>
                  <p className="text-[10px] text-[#A1A1AA]">Ubah status/metode {editTarget.id}</p>
                </div>
              </div>
              <button onClick={() => setEditTarget(null)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="p-3 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl space-y-1">
                <p className="text-xs font-bold text-[#22285E]">{editTarget.customer}</p>
                <p className="text-[10px] text-[#A1A1AA]">{editTarget.produk} · {editTarget.qty} pcs</p>
                <p className="text-xs font-black text-[#9E4BDC]">Rp {editTarget.total.toLocaleString('id')}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none appearance-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                  >
                    {['Proses', 'Selesai', 'Batal'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">Metode Bayar</label>
                  <select
                    name="metode"
                    value={editForm.metode}
                    onChange={(e) => setEditForm(p => ({ ...p, metode: e.target.value }))}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 px-4 text-sm font-medium text-[#22285E] outline-none appearance-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all cursor-pointer"
                  >
                    {['Transfer Bank', 'QRIS', 'Cash'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditTarget(null)}
                  className="flex-1 px-5 py-2.5 text-sm font-medium rounded-xl text-[#71717A] hover:bg-[#F4F4F5] border border-[#E4E4E7] transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-[#9E4BDC] text-white hover:bg-[#B16FE3] transition-all">
                  <FaEdit className="text-xs" /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal Konfirmasi Hapus Pesanan ── */}
      {hapusTarget && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setHapusTarget(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#F24E1E]/10 rounded-2xl flex items-center justify-center mx-auto">
                <FaTrash className="text-[#F24E1E] text-xl" />
              </div>
              <div>
                <p className="text-base font-black text-[#22285E]">Hapus Pesanan?</p>
                <p className="text-sm text-[#71717A] mt-1">
                  Pesanan <span className="font-bold text-[#22285E]">{hapusTarget.id}</span> dari{' '}
                  <span className="font-bold">{hapusTarget.customer}</span> akan dihapus permanen.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setHapusTarget(null)}
                  className="flex-1 px-5 py-2.5 text-sm font-medium rounded-xl text-[#71717A] hover:bg-[#F4F4F5] border border-[#E4E4E7] transition-all">
                  Batal
                </button>
                <button onClick={handleHapus}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-[#F24E1E] text-white hover:opacity-90 transition-all">
                  <FaTrash className="text-xs" /> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal Tambah Pesanan ── */}
      {showForm && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9E4BDC] rounded-xl flex items-center justify-center shrink-0">
                  <FaShoppingBag className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Tambah Pesanan Baru</p>
                  <p className="text-[10px] text-[#A1A1AA]">Isi data transaksi pelanggan</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl flex items-center justify-center hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors text-[#A1A1AA]">
                <FaTimes className="text-xs" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input label="Nama Pelanggan" type="text" name="customer"
                value={formPesanan.customer} onChange={handleFormChange}
                placeholder="cth: Dewi Lestari" icon={FaUser} />

              {/* ── Autocomplete Produk ── */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">
                  Produk
                </label>

                {/* Input field */}
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none">
                    <FaBoxOpen size={13} />
                  </div>
                  <input
                    ref={produkInputRef}
                    type="text"
                    value={produkQuery}
                    onChange={handleProdukQueryChange}
                    onFocus={() => setProdukDropdown(true)}
                    placeholder="Ketik nama produk..."
                    autoComplete="off"
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl py-3 pl-9 pr-4 text-sm font-medium text-[#22285E] placeholder:text-[#A1A1AA] outline-none focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5 transition-all"
                  />
                  {/* Chip produk terpilih */}
                  {selectedProduk && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduk(null);
                        setProdukQuery('');
                        setFormPesanan(p => ({ ...p, produk: '', gambar: '', total: '' }));
                        produkInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#9E4BDC]/10 flex items-center justify-center text-[#9E4BDC] hover:bg-[#F24E1E]/10 hover:text-[#F24E1E] transition-colors"
                    >
                      <FaTimes className="text-[9px]" />
                    </button>
                  )}
                </div>

                {/* Preview produk terpilih */}
                {selectedProduk && (
                  <div className="flex items-center gap-2.5 bg-[#9E4BDC]/5 border border-[#9E4BDC]/20 rounded-xl px-3 py-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#F4F4F5] flex items-center justify-center">
                      {getImg(selectedProduk.gambar)
                        ? <img src={getImg(selectedProduk.gambar)} alt={selectedProduk.name} className="w-full h-full object-cover" />
                        : <FaBoxOpen className="text-[#A1A1AA] text-[10px]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#22285E] truncate">{selectedProduk.name}</p>
                      <p className="text-[10px] text-[#9E4BDC] font-semibold">
                        Rp {selectedProduk.harga.toLocaleString('id')} / pcs
                      </p>
                    </div>
                    <Badge status={selectedProduk.status} />
                  </div>
                )}

                {/* Dropdown suggestions */}
                {produkDropdown && produkSuggestions.length > 0 && (
                  <div
                    ref={produkDropdownRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#E4E4E7] rounded-2xl shadow-xl overflow-hidden"
                  >
                    {produkQuery.trim() === '' && (
                      <div className="px-3 py-2 border-b border-[#E4E4E7]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">
                          Produk Tersedia
                        </p>
                      </div>
                    )}
                    <div className="max-h-52 overflow-y-auto">
                      {produkSuggestions.map(item => {
                        const img = getImg(item.gambar);
                        const stockColor = item.status === 'Habis'
                          ? 'text-[#F24E1E]'
                          : item.status === 'Hampir Habis'
                          ? 'text-amber-500'
                          : 'text-[#00B5AD]';
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleSelectProduk(item); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#9E4BDC]/5 transition-colors ${
                              item.status === 'Habis' ? 'opacity-60' : ''
                            }`}
                          >
                            {/* Gambar */}
                            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-[#F4F4F5] flex items-center justify-center border border-[#E4E4E7]">
                              {img
                                ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
                                : <FaBoxOpen className="text-[#A1A1AA] text-[10px]" />
                              }
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#22285E] truncate leading-tight">{item.name}</p>
                              <p className="text-[10px] text-[#A1A1AA]">{item.kategori}</p>
                            </div>
                            {/* Harga + stok */}
                            <div className="text-right shrink-0">
                              <p className="text-xs font-black text-[#9E4BDC]">
                                Rp {item.harga.toLocaleString('id')}
                              </p>
                              <p className={`text-[10px] font-semibold ${stockColor}`}>
                                {item.stock === 0 ? 'Habis' : `${item.stock} pcs`}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {produkQuery.trim() !== '' && produkSuggestions.length === 0 && (
                      <div className="px-3 py-4 text-center text-xs text-[#A1A1AA]">
                        Produk tidak ditemukan
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Qty (pcs)" type="number" name="qty"
                  value={formPesanan.qty} onChange={handleFormChange} />
                <Input label="Total (Rp)" type="number" name="total"
                  value={formPesanan.total} onChange={handleFormChange}
                  placeholder="85000" icon={FaMoneyBillWave} />
              </div>

              {formPesanan.total && (
                <div className="flex items-center gap-1.5 bg-[#00B5AD]/10 border border-[#00B5AD]/20 rounded-xl px-3 py-2">
                  <FaStar className="text-yellow-400 text-[10px] shrink-0" />
                  <span className="text-[11px] font-bold text-[#00B5AD]">
                    +{Math.floor(Number(formPesanan.total) / 1000)} poin akan diberikan
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Select label="Metode Bayar" name="metode"
                  value={formPesanan.metode} onChange={handleFormChange}
                  options={['Transfer Bank','QRIS','Cash']
                    .map(m => ({ value: m, label: m }))} />
                <Select label="Status" name="status"
                  value={formPesanan.status} onChange={handleFormChange}
                  options={['Proses','Selesai','Batal']
                    .map(s => ({ value: s, label: s }))} />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-[#E4E4E7]"
                  onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" variant="primary" className="flex-1"
                  icon={<FaPlus className="text-xs" />}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Toast Notifikasi ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

    </div>
  );
}
