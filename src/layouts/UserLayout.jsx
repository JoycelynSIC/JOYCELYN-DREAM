import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { userAPI } from "../services/userAPI";
import { transaksiAPI } from "../services/transaksiAPI";
import { produkAPI, getProdukImageUrl } from "../services/produkAPI";
import {
  X, ShoppingCart, Plus, Minus, Trash2, Tag, ArrowRight,
  Ticket, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Crown,
  CreditCard, Wallet, Building2, Smartphone, Package, ChevronRight,
  MapPin, Clock, CheckCheck, Loader2,
} from "lucide-react";

/* ══════════════════════════════════════════════
   VOUCHER DATABASE (simulasi server-side)
══════════════════════════════════════════════ */
const VOUCHER_DB = [
  {
    code: "NASTORE10",
    type: "percent",       // potong persentase
    value: 10,
    minOrder: 50000,
    maxDiscount: 25000,
    desc: "Diskon 10% untuk semua produk",
    label: "10% OFF",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    code: "WELCOME20K",
    type: "flat",          // potong nominal
    value: 20000,
    minOrder: 75000,
    maxDiscount: 20000,
    desc: "Potongan langsung Rp20.000",
    label: "Rp20.000",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    code: "POIN200",
    type: "flat",
    value: 10000,
    minOrder: 0,
    maxDiscount: 10000,
    desc: "Reward poin — potongan Rp10.000",
    label: "Rp10.000",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    requiresLogin: true,
  },
  {
    code: "SILVER5K",
    type: "flat",
    value: 5000,
    minOrder: 30000,
    maxDiscount: 5000,
    desc: "Benefit Silver Member — Rp5.000 off",
    label: "Rp5.000",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    requiresLogin: true,
  },
  {
    code: "NASTORE25K",
    type: "flat",
    value: 25000,
    minOrder: 100000,
    maxDiscount: 25000,
    desc: "Potongan Rp25.000 untuk belanja di atas Rp100.000",
    label: "Rp25.000",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

export default function UserLayout() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [tierPersen, setTierPersen]   = useState(0); // % diskon dari crm_tier_config

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cartCount, setCartCount] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      const items = saved ? JSON.parse(saved) : [];
      return items.reduce((s, i) => s + i.qty, 0);
    } catch { return 0; }
  });

  const [cartOpen, setCartOpen]       = useState(false);
  const [voucherInput, setVoucherInput]   = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError]   = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [orderConfirmed, setOrderConfirmed]   = useState(null);

  // ── Payment flow state ──────────────────────────────────────────────────────
  const [paymentStep, setPaymentStep]     = useState(null); // null | 'method' | 'confirm' | 'success'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [submittedGrandTotal, setSubmittedGrandTotal] = useState(0); // simpan total sebelum reset cart
  const [submittedItems, setSubmittedItems] = useState([]); // simpan items sebelum reset
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState("");

  const navigate = useNavigate();

  // Sync state dengan localStorage + fetch data customer dari Supabase
  useEffect(() => {
    const syncUser = async () => {
      const token      = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!token || !storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      // Set logged in dulu dengan data dasar agar UI tidak blank
      setIsLoggedIn(true);
      setUserProfile({ ...parsedUser, points: parsedUser.points ?? 0 });

      // Fetch data customer (poin real, tier, status) dari Supabase
      try {
        const customer = await userAPI.fetchCustomerByProfileId(parsedUser.id);
        if (customer) {
          const statusMember = customer["Status Member"] ?? "Regular";
          const merged = {
            ...parsedUser,
            points:            customer["Total Poin Saat Ini"]              ?? 0,
            statusMember,
            statusKeanggotaan: customer["Status Keanggotaan"]               ?? "Aktif",
            totalTransaksi:    customer["Total Transaksi"]                  ?? 0,
            totalBelanja:      customer["Total Belanja Keseluruhan (Rp)"]   ?? 0,
            idPelanggan:       customer["ID Pelanggan"]                     ?? null,
            namaLengkap:       customer["Nama Lengkap"]                     ?? `${parsedUser.namaDepan} ${parsedUser.namaBelakang}`,
          };
          setUserProfile(merged);
          localStorage.setItem("user", JSON.stringify(merged));

          // Fetch persentase diskon dari crm_tier_config
          const persen = await produkAPI.fetchDiskonByTier(statusMember);
          console.log(`[UserLayout] tier="${statusMember}" → diskon=${persen}%`);
          setTierPersen(persen);
        } else {
          // User belum punya row di customer (daftar sebelum fitur ini ada)
          // Reset poin ke 0, jangan pakai nilai stale dari localStorage
          const safe = {
            ...parsedUser,
            points:            0,
            statusMember:      "Regular",
            statusKeanggotaan: "Aktif",
          };
          setUserProfile(safe);
          localStorage.setItem("user", JSON.stringify(safe));
        }
      } catch (err) {
        // Fetch gagal (misal offline) — pakai 0 sebagai safe default, bukan nilai stale
        console.warn("[UserLayout] fetchCustomerByProfileId gagal:", err?.message);
        setUserProfile((prev) => ({ ...prev, points: prev?.points ?? 0 }));
      }
    };

    syncUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUserProfile(null);
    setTierPersen(0);
    setCartItems([]);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Smooth scroll handler for footer links
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Sync cart ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    const total = cartItems.reduce((s, i) => s + i.qty, 0);
    setCartCount(total);
  }, [cartItems]);

  // Add product to cart (merge qty jika sudah ada)
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleQtyChange = (productId, delta) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // ── Voucher helpers ──
  // Hitung harga setelah diskon tier untuk satu produk
  const getHargaMember = (hargaAsli) => {
    if (!tierPersen || tierPersen <= 0) return hargaAsli;
    return Math.floor(hargaAsli - hargaAsli * (tierPersen / 100));
  };

  const subtotal = cartItems.reduce((s, i) => s + getHargaMember(i.product.harga ?? 0) * i.qty, 0);
  const subtotalAsli = cartItems.reduce((s, i) => s + (i.product.harga ?? 0) * i.qty, 0);
  const tierDiscount = subtotalAsli - subtotal; // selisih dari diskon tier

  const calcDiscount = (voucher, total) => {
    if (!voucher) return 0;
    if (voucher.type === "percent") {
      return Math.min(Math.floor(total * voucher.value / 100), voucher.maxDiscount);
    }
    return voucher.value;
  };

  const discount    = calcDiscount(appliedVoucher, subtotal);
  const grandTotal  = Math.max(0, subtotal - discount);

  const handleApplyVoucher = (codeOverride) => {
    const code = (codeOverride ?? voucherInput).trim().toUpperCase();
    setVoucherError("");
    setVoucherSuccess("");
    if (!code) return;

    const voucher = VOUCHER_DB.find((v) => v.code === code);
    if (!voucher) {
      setVoucherError("Kode voucher tidak ditemukan atau sudah kedaluwarsa.");
      setAppliedVoucher(null);
      return;
    }
    if (voucher.requiresLogin && !isLoggedIn) {
      setVoucherError("Voucher ini hanya untuk member yang sudah login.");
      return;
    }
    if (subtotal < voucher.minOrder) {
      setVoucherError(`Minimum belanja Rp${voucher.minOrder.toLocaleString("id")} untuk voucher ini.`);
      setAppliedVoucher(null);
      return;
    }
    setAppliedVoucher(voucher);
    setVoucherInput(voucher.code);
    setShowVoucherList(false);
    setVoucherSuccess(`Voucher "${voucher.code}" berhasil diterapkan! Hemat Rp${calcDiscount(voucher, subtotal).toLocaleString("id")}.`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    setVoucherError("");
    setVoucherSuccess("");
  };

  // ── Generate ID Transaksi unik ──────────────────────────────────────────────
  const generateTrxId = () => {
    const ts   = Date.now().toString().slice(-6);
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `TRX-${ts}${rand}`;
  };

  // ── Submit order ke Supabase ────────────────────────────────────────────────
  const handleConfirmOrder = async () => {
    if (!selectedMethod || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Simpan grandTotal dan items sebelum reset cart
      setSubmittedGrandTotal(grandTotal);
      setSubmittedItems(cartItems.map(i => ({
        name:     i.product.name,
        gambar:   i.product.gambar ?? null,
        qty:      i.qty,
        harga:    getHargaMember(i.product.harga ?? 0),
      })));

      // Pastikan user punya row di tabel customer
      let customerId = userProfile?.idPelanggan;
      if (!customerId) {
        console.warn("[UserLayout] idPelanggan tidak ada, buat customer row dulu");
        const newCustomers = await userAPI.createCustomerProfile({
          userProfileId: userProfile.id,
          namaDepan:     userProfile.namaDepan,
          namaBelakang:  userProfile.namaBelakang,
          email:         userProfile.email,
        });
        customerId = newCustomers[0]?.["ID Pelanggan"];
        // Update userProfile state
        setUserProfile(prev => ({ ...prev, idPelanggan: customerId }));
      }

      // Hitung diskon voucher proporsional per item
      const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

      const promises = cartItems.map((item) => {
        const hargaSatuanMember = getHargaMember(item.product.harga ?? 0);
        const itemSubtotal      = hargaSatuanMember * item.qty;
        
        // Bagi diskon voucher secara proporsional berdasarkan persentase nilai item
        const itemDiskon = discount > 0
          ? Math.round((itemSubtotal / subtotal) * discount)
          : 0;
        
        // Pastikan itemTotal tidak boleh negatif atau 0 kalau ada subtotal
        let itemTotal = itemSubtotal - itemDiskon;
        if (itemTotal < 0) itemTotal = 0;
        if (itemTotal === 0 && itemSubtotal > 0) {
          // Bug: itemTotal jadi 0 padahal ada subtotal
          console.error('[Checkout ERROR] itemTotal = 0 tapi itemSubtotal > 0', {
            product: item.product.name,
            hargaAsli: item.product.harga,
            tierPersen,
            hargaSatuanMember,
            itemSubtotal,
            itemDiskon,
            subtotal,
            discount,
          });
          // Fallback: pakai itemSubtotal (ignore diskon voucher untuk item ini)
          itemTotal = itemSubtotal;
        }

        console.log('[Checkout]', {
          product: item.product.name,
          hargaAsli: item.product.harga,
          tierPersen,
          hargaSatuanMember,
          qty: item.qty,
          itemSubtotal,
          itemDiskon,
          itemTotal,
          subtotal,
          discount,
        });

        return transaksiAPI.createTransaksi({
          customer: {
            idPelanggan:  customerId,
            namaLengkap:  userProfile?.namaLengkap  ?? `${userProfile?.namaDepan ?? ''} ${userProfile?.namaBelakang ?? ''}`.trim(),
            statusMember: userProfile?.statusMember ?? 'Regular',
            kelompokUsia: userProfile?.kelompokUsia ?? '',
          },
          item,
          hargaSatuan:      hargaSatuanMember,
          diskon:           itemDiskon,
          totalBayar:       itemTotal,
          metodePembayaran: selectedMethod.label,
          idTransaksi:      generateTrxId(),
        });
      });

      await Promise.all(promises);

      // Reset cart & voucher
      setCartItems([]);
      setAppliedVoucher(null);
      setVoucherInput("");
      setVoucherError("");
      setVoucherSuccess("");
      setCartOpen(false);

      // Tampilkan success step
      setPaymentStep('success');
    } catch (err) {
      setSubmitError(err?.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-poppins flex flex-col">
      {/* Premium Decoupled Header */}
      <Header 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLoginClick} 
        onLogout={handleLogout} 
        userProfile={userProfile}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9990] bg-[#22285E]/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[9991] bg-white shadow-2xl flex flex-col"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
            >
              {/* Header drawer */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#9E4BDC]/10 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-[#9E4BDC]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#22285E]">Keranjang Belanja</p>
                    <p className="text-[10px] text-gray-400 font-medium">{cartCount} item</p>
                  </div>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <ShoppingCart className="w-7 h-7 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-400">Keranjang masih kosong</p>
                      <p className="text-xs text-gray-300 mt-1">Tambahkan produk dari katalog</p>
                    </div>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                    >
                      Lihat Katalog <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-3 bg-gray-50/60 rounded-2xl p-3 border border-gray-100">
                      {/* Thumb */}
                      <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0">
                        <img
                          src={getProdukImageUrl(product.gambar) ?? product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#22285E] line-clamp-1">{product.name}</p>
                        <p className="text-[9px] text-gray-400 line-through leading-none mt-0.5">
                          Rp {(Math.ceil(((product.harga ?? 0) * 1.2) / 1000) * 1000).toLocaleString("id-ID")}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-black mt-0.5">
                          Rp {getHargaMember(product.harga ?? 0).toLocaleString("id-ID")}
                        </p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                          Subtotal: Rp {(getHargaMember(product.harga ?? 0) * qty).toLocaleString("id-ID")}
                        </p>
                      </div>
                      {/* Qty controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleRemoveFromCart(product.id)}
                          className="w-5 h-5 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-red-400" />
                        </button>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleQtyChange(product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-[#22285E] select-none">{qty}</span>
                          <button
                            onClick={() => handleQtyChange(product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer drawer — voucher + total + checkout */}
              {cartItems.length > 0 && (
                <div className="px-6 py-5 border-t border-gray-100 space-y-4 bg-white">

                  {/* ── Voucher Section ── */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#22285E] flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-[#9E4BDC]" /> Kode Voucher
                      </span>
                      <button
                        onClick={() => setShowVoucherList((v) => !v)}
                        className="text-[10px] text-[#9E4BDC] font-black flex items-center gap-0.5 cursor-pointer hover:underline"
                      >
                        Lihat voucher {showVoucherList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Input field */}
                    {!appliedVoucher ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={voucherInput}
                          onChange={(e) => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(""); setVoucherSuccess(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                          placeholder="Masukkan kode voucher"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#22285E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E4BDC]/25 focus:border-[#9E4BDC] font-mono tracking-wider transition-all uppercase"
                        />
                        <button
                          onClick={() => handleApplyVoucher()}
                          className="bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white text-xs font-black px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Pakai
                        </button>
                      </div>
                    ) : (
                      /* Applied voucher chip */
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-emerald-700 font-mono">{appliedVoucher.code}</p>
                          <p className="text-[10px] text-emerald-600">{appliedVoucher.desc}</p>
                        </div>
                        <button
                          onClick={handleRemoveVoucher}
                          className="w-5 h-5 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <X className="w-2.5 h-2.5 text-emerald-700" />
                        </button>
                      </div>
                    )}

                    {/* Error / success */}
                    <AnimatePresence>
                      {voucherError && (
                        <motion.div
                          className="flex items-center gap-1.5 text-[10px] text-red-500 font-semibold"
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                          <AlertCircle className="w-3 h-3 shrink-0" /> {voucherError}
                        </motion.div>
                      )}
                      {voucherSuccess && !appliedVoucher && (
                        <motion.div
                          className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold"
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                          <CheckCircle2 className="w-3 h-3 shrink-0" /> {voucherSuccess}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Voucher list dropdown */}
                    <AnimatePresence>
                      {showVoucherList && (
                        <motion.div
                          className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1">Voucher Tersedia</p>
                          <div className="divide-y divide-gray-100">
                            {VOUCHER_DB.filter((v) => !v.requiresLogin || isLoggedIn).map((v) => {
                              const eligible = subtotal >= v.minOrder;
                              return (
                                <button
                                  key={v.code}
                                  disabled={!eligible}
                                  onClick={() => { setVoucherInput(v.code); handleApplyVoucher(v.code); }}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                                    ${eligible ? "hover:bg-white cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                >
                                  <div className={`text-[8px] font-black px-2 py-1 rounded-lg border shrink-0 ${v.color}`}>
                                    {v.label}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-[#22285E] font-mono">{v.code}</p>
                                    <p className="text-[9px] text-gray-400 font-medium">{v.desc}</p>
                                    {!eligible && (
                                      <p className="text-[9px] text-red-400 font-semibold">
                                        Min. Rp{v.minOrder.toLocaleString("id")}
                                      </p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Price breakdown ── */}
                  <div className="space-y-1.5 pt-1">
                    {/* Baris subtotal asli — tampilkan hanya jika ada tier diskon */}
                    {tierDiscount > 0 && (
                      <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                        <span>Harga normal ({cartCount} item)</span>
                        <span>Rp {subtotalAsli.toLocaleString("id")}</span>
                      </div>
                    )}
                    {/* Diskon tier */}
                    {tierDiscount > 0 && (
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Diskon {userProfile?.statusMember} {tierPersen}%
                        </span>
                        <span>- Rp {tierDiscount.toLocaleString("id")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>Subtotal setelah tier ({cartCount} item)</span>
                      <span>Rp {subtotal.toLocaleString("id")}</span>
                    </div>
                    {discount > 0 && (
                      <motion.div
                        className="flex items-center justify-between text-xs font-bold"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Ticket className="w-3 h-3" /> Diskon voucher
                        </span>
                        <span className="text-emerald-600">- Rp {discount.toLocaleString("id")}</span>
                      </motion.div>
                    )}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                      <span className="text-sm font-black text-[#22285E]">Total Bayar</span>
                      <div className="text-right">
                        {(discount > 0 || tierDiscount > 0) && (
                          <p className="text-[10px] text-gray-400 line-through leading-none">Rp {subtotalAsli.toLocaleString("id")}</p>
                        )}
                        <p className="text-base font-black text-[#9E4BDC]">Rp {grandTotal.toLocaleString("id")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Points earned */}
                  <div className="flex items-center gap-2 bg-[#00B5AD]/8 border border-[#00B5AD]/15 px-3 py-2 rounded-xl">
                    <Tag className="w-3.5 h-3.5 text-[#00B5AD] shrink-0" />
                    <span className="text-[10px] font-bold text-[#00B5AD]">
                      Poin akan ditambahkan setelah pesanan selesai dikonfirmasi admin
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!isLoggedIn) { setCartOpen(false); navigate("/login"); return; }
                      setSelectedMethod(null);
                      setSubmitError("");
                      setPaymentStep('method');
                    }}
                    className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] hover:opacity-95 text-white text-sm font-black py-3.5 rounded-2xl transition-opacity cursor-pointer shadow-lg shadow-[#9E4BDC]/20 flex items-center justify-center gap-2"
                  >
                    Bayar Rp {grandTotal.toLocaleString("id")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          PAYMENT FLOW MODALS
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {paymentStep && paymentStep !== 'success' && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9992] bg-[#22285E]/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { if (!isSubmitting) setPaymentStep(null); }}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[9993] flex items-end sm:items-center justify-center p-0 sm:p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
                initial={{ y: 60, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 60, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                {/* ── STEP 1: Pilih Metode Pembayaran ── */}
                {paymentStep === 'method' && (() => {
                  const METHODS = [
                    {
                      id: 'transfer_bca',
                      label: 'Transfer BCA',
                      icon: Building2,
                      iconBg: 'bg-blue-50',
                      iconColor: 'text-blue-600',
                      desc: '1234 5678 9012 (a.n. Na_store.id)',
                      tag: 'Paling Cepat',
                      tagStyle: 'bg-blue-100 text-blue-700',
                    },
                    {
                      id: 'transfer_mandiri',
                      label: 'Transfer Mandiri',
                      icon: Building2,
                      iconBg: 'bg-yellow-50',
                      iconColor: 'text-yellow-600',
                      desc: '1400 0012 3456 (a.n. Na_store.id)',
                    },
                    {
                      id: 'gopay',
                      label: 'GoPay',
                      icon: Smartphone,
                      iconBg: 'bg-green-50',
                      iconColor: 'text-green-600',
                      desc: '0812-3456-7890',
                      tag: 'Populer',
                      tagStyle: 'bg-green-100 text-green-700',
                    },
                    {
                      id: 'dana',
                      label: 'DANA',
                      icon: Wallet,
                      iconBg: 'bg-sky-50',
                      iconColor: 'text-sky-600',
                      desc: '0812-3456-7890',
                    },
                    {
                      id: 'cod',
                      label: 'COD / Ambil Langsung',
                      icon: Package,
                      iconBg: 'bg-orange-50',
                      iconColor: 'text-orange-500',
                      desc: 'Bayar saat terima pesanan',
                    },
                  ];

                  return (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-black text-[#22285E]">Pilih Metode Pembayaran</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Total: <span className="font-black text-[#9E4BDC]">Rp {grandTotal.toLocaleString("id")}</span></p>
                        </div>
                        <button
                          onClick={() => setPaymentStep(null)}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Methods list */}
                      <div className="px-4 py-3 space-y-2 max-h-[60vh] overflow-y-auto">
                        {METHODS.map((m) => {
                          const Icon = m.icon;
                          const isSelected = selectedMethod?.id === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setSelectedMethod(m)}
                              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer
                                ${isSelected
                                  ? 'border-[#9E4BDC] bg-[#9E4BDC]/4 shadow-sm shadow-[#9E4BDC]/10'
                                  : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/60'}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.iconBg}`}>
                                <Icon className={`w-5 h-5 ${m.iconColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-black text-[#22285E]">{m.label}</p>
                                  {m.tag && (
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${m.tagStyle}`}>{m.tag}</span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{m.desc}</p>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors
                                ${isSelected ? 'border-[#9E4BDC] bg-[#9E4BDC]' : 'border-gray-300'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* CTA */}
                      <div className="px-4 pb-6 pt-2">
                        <button
                          disabled={!selectedMethod}
                          onClick={() => setPaymentStep('confirm')}
                          className={`w-full text-sm font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all
                            ${selectedMethod
                              ? 'bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] text-white shadow-lg shadow-[#9E4BDC]/20 hover:opacity-95 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          Lanjut <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  );
                })()}

                {/* ── STEP 2: Konfirmasi Pesanan ── */}
                {paymentStep === 'confirm' && (() => {
                  const Icon = selectedMethod.icon;
                  return (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPaymentStep('method')}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-gray-500 rotate-180" />
                          </button>
                          <p className="text-sm font-black text-[#22285E]">Konfirmasi Pesanan</p>
                        </div>
                        <button
                          onClick={() => setPaymentStep(null)}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Order summary */}
                      <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

                        {/* Items */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Item Pesanan</p>
                          {cartItems.map(({ product, qty }) => (
                            <div key={product.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0">
                                <img
                                  src={getProdukImageUrl(product.gambar) ?? product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#22285E] line-clamp-1">{product.name}</p>
                                <p className="text-[10px] text-gray-400">{qty} pcs × Rp {getHargaMember(product.harga).toLocaleString("id")}</p>
                              </div>
                              <p className="text-xs font-black text-[#22285E] shrink-0">
                                Rp {(getHargaMember(product.harga) * qty).toLocaleString("id")}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Metode */}
                        <div className="flex items-center gap-3 bg-[#9E4BDC]/5 border border-[#9E4BDC]/15 rounded-xl p-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedMethod.iconBg}`}>
                            <Icon className={`w-4 h-4 ${selectedMethod.iconColor}`} />
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 font-semibold">Metode Pembayaran</p>
                            <p className="text-xs font-black text-[#22285E]">{selectedMethod.label}</p>
                            <p className="text-[9px] text-gray-400">{selectedMethod.desc}</p>
                          </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="space-y-1.5 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          {tierDiscount > 0 && (
                            <div className="flex justify-between text-[10px]">
                              <span className="text-gray-400">Harga normal</span>
                              <span className="text-gray-400">Rp {subtotalAsli.toLocaleString("id")}</span>
                            </div>
                          )}
                          {tierDiscount > 0 && (
                            <div className="flex justify-between text-[10px] font-bold text-emerald-600">
                              <span>Diskon tier {userProfile?.statusMember}</span>
                              <span>- Rp {tierDiscount.toLocaleString("id")}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Subtotal ({cartCount} item)</span>
                            <span>Rp {subtotal.toLocaleString("id")}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-[10px] font-bold text-emerald-600">
                              <span className="flex items-center gap-1"><Ticket className="w-2.5 h-2.5" /> Voucher {appliedVoucher?.code}</span>
                              <span>- Rp {discount.toLocaleString("id")}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                            <span className="text-sm font-black text-[#22285E]">Total Bayar</span>
                            <span className="text-sm font-black text-[#9E4BDC]">Rp {grandTotal.toLocaleString("id")}</span>
                          </div>
                        </div>

                        {/* Info poin */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <p className="text-[10px] text-amber-700 font-medium leading-snug">
                            Poin loyalitas akan otomatis masuk setelah pesanan dikonfirmasi selesai oleh admin.
                          </p>
                        </div>

                        {/* Error */}
                        {submitError && (
                          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <p className="text-[10px] text-red-600 font-medium">{submitError}</p>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="px-4 pb-6 pt-2">
                        <button
                          onClick={handleConfirmOrder}
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] hover:opacity-95 disabled:opacity-60 text-white text-sm font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#9E4BDC]/20 cursor-pointer"
                        >
                          {isSubmitting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                            : <><CheckCheck className="w-4 h-4" /> Konfirmasi Pesanan</>
                          }
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SUCCESS MODAL ── */}
      <AnimatePresence>
        {paymentStep === 'success' && (
          <>
            <motion.div
              className="fixed inset-0 z-[9992] bg-[#22285E]/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-[9993] flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
              >
                {/* Checkmark */}
                <motion.div
                  className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CheckCheck className="w-8 h-8 text-emerald-500" />
                </motion.div>

                <h3 className="text-lg font-black text-[#22285E]">Pesanan Berhasil!</h3>
                <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">
                  Pesananmu sudah masuk dan sedang diproses oleh admin Na_store.id. Kamu akan mendapatkan poin setelah pesanan selesai.
                </p>

                {/* Detail singkat */}
                <div className="mt-5 bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 space-y-3">

                  {/* List item yang dipesan */}
                  <div className={`space-y-2.5 ${submittedItems.length > 3 ? 'max-h-44 overflow-y-auto pr-1' : ''}`}>
                    {submittedItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.gambar
                            ? <img
                                src={getProdukImageUrl(item.gambar)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            : <span className="text-[10px] font-black text-[#A1A1AA]">{item.name.charAt(0)}</span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#22285E] truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400">{item.qty} pcs × Rp {item.harga.toLocaleString("id")}</p>
                        </div>
                        <p className="text-xs font-black text-[#22285E] shrink-0">
                          Rp {(item.harga * item.qty).toLocaleString("id")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-2.5 space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400 font-medium">Metode</span>
                      <span className="font-black text-[#22285E]">{selectedMethod?.label}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400 font-medium">Status</span>
                      <span className="font-black text-amber-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Diproses
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-gray-100 mt-1">
                      <span className="text-xs font-bold text-[#22285E]">Total Bayar</span>
                      <span className="text-sm font-black text-[#9E4BDC]">Rp {submittedGrandTotal.toLocaleString("id")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mt-6">
                  <button
                    onClick={() => setPaymentStep(null)}
                    className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] text-white text-xs font-black py-3 rounded-xl hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Oke, Mengerti
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area for Customers */}
      <main className="flex-grow">        <Outlet context={{ isLoggedIn, userProfile, onLoginClick: handleLoginClick, onLogout: handleLogout, setUserProfile, cartCount, setCartCount: handleAddToCart, tierPersen }} />
      </main>

      <Footer />
    </div>
  );
}