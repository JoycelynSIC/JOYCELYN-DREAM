import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/layout/Header";
import logoNastore from "../assets/gambarproduk/logonastore.png";
import { FaGift, FaShoppingBag, FaShieldAlt } from "react-icons/fa";
import { X, ShoppingCart, Plus, Minus, Trash2, Tag, ArrowRight, Ticket, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Store, ClipboardCheck, Star } from "lucide-react";

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
  const [cartCount, setCartCount]     = useState(0);
  const [cartItems, setCartItems]     = useState([]);   // [{ product, qty }]
  const [cartOpen, setCartOpen]       = useState(false);
  const [voucherInput, setVoucherInput]   = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null); // voucher object yang aktif
  const [voucherError, setVoucherError]   = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [orderConfirmed, setOrderConfirmed]   = useState(null); // { orderId, items, total, discount, points }
  const navigate = useNavigate();

  // Sync state with localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(storedUser);
      // Default to 2236 points if the user object doesn't have a points field yet
      if (parsedUser.points === undefined) {
        parsedUser.points = 2236;
      }
      setUserProfile(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    // Logout: Clear localStorage and states
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate("/");
  };

  const handleLoginClick = () => {
    // Redirect to the real login page
    navigate("/login");
  };

  // Smooth scroll handler for footer links
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
    setCartCount((c) => c + 1);
  };

  const handleQtyChange = (productId, delta) => {
    setCartItems((prev) => {
      const updated = prev.map((i) =>
        i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      );
      const newTotal = updated.reduce((s, i) => s + i.qty, 0);
      setCartCount(newTotal);
      return updated;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.product.id !== productId);
      const newTotal = updated.reduce((s, i) => s + i.qty, 0);
      setCartCount(newTotal);
      return updated;
    });
  };

  // ── Voucher helpers ──
  const subtotal = cartItems.reduce((s, i) => s + i.product.priceValue * i.qty, 0);

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

  // ── Konfirmasi pesanan (COD / ambil langsung) ──
  const handleConfirmOrder = () => {
    const orderId  = `ORD-${Date.now().toString().slice(-6)}`;
    const earnedPts = cartItems.reduce((s, i) => s + Math.floor(i.product.priceValue / 1000 * i.qty), 0);

    setOrderConfirmed({
      orderId,
      items: [...cartItems],
      subtotal,
      discount,
      grandTotal,
      points: earnedPts,
      voucher: appliedVoucher,
    });

    // Reset cart & voucher
    setCartItems([]);
    setCartCount(0);
    setAppliedVoucher(null);
    setVoucherInput("");
    setVoucherError("");
    setVoucherSuccess("");
    setCartOpen(false);

    // Tambah poin ke user jika login
    if (isLoggedIn && userProfile) {
      const updated = { ...userProfile, points: (userProfile.points || 0) + earnedPts };
      setUserProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
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
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#22285E] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-[#9E4BDC] font-black mt-0.5">{product.price}</p>
                        <p className="text-[9px] text-[#00B5AD] font-bold mt-0.5">
                          +{Math.floor(product.priceValue / 1000 * qty)} Poin
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
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>Subtotal ({cartCount} item)</span>
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
                        {discount > 0 && (
                          <p className="text-[10px] text-gray-400 line-through leading-none">Rp {subtotal.toLocaleString("id")}</p>
                        )}
                        <p className="text-base font-black text-[#9E4BDC]">Rp {grandTotal.toLocaleString("id")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Points earned */}
                  <div className="flex items-center gap-2 bg-[#00B5AD]/8 border border-[#00B5AD]/15 px-3 py-2 rounded-xl">
                    <Tag className="w-3.5 h-3.5 text-[#00B5AD] shrink-0" />
                    <span className="text-[10px] font-bold text-[#00B5AD]">
                      +{cartItems.reduce((s, i) => s + Math.floor(i.product.priceValue / 1000 * i.qty), 0)} Poin dari order ini
                    </span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] hover:opacity-95 text-white text-sm font-black py-3.5 rounded-2xl transition-opacity cursor-pointer shadow-lg shadow-[#9E4BDC]/20 flex items-center justify-center gap-2">
                    Bayar Rp {grandTotal.toLocaleString("id")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area for Customers */}
      <main className="flex-grow">
        <Outlet context={{ isLoggedIn, userProfile, onLoginClick: handleLoginClick, onLogout: handleLogout, setUserProfile, cartCount, setCartCount: handleAddToCart }} />
      </main>
      
      {/* Premium E-Commerce Footer */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Col 1: Brand details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={logoNastore} alt="Logo" className="w-8 h-8 object-contain" />
              <p className="font-black text-sm tracking-wide text-[#22285E]">Na_store.id</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Menyediakan aksesoris premium mulai dari cincin couple, kalung rosegold, gelang crystal, hingga nail art custom buatan tangan.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-[#22285E] uppercase tracking-wider mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("catalog")} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Katalog Aksesoris
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("loyalty")} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Poin & Reward
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("orders")} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Status Transaksi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Service benefits */}
          <div>
            <h4 className="text-xs font-bold text-[#22285E] uppercase tracking-wider mb-3">Jaminan Belanja</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li className="flex items-center gap-2">
                <FaShieldAlt className="text-[#9E4BDC]" /> Transaksi Aman REST API
              </li>
              <li className="flex items-center gap-2">
                <FaGift className="text-[#9E4BDC]" /> Poin Reward Belanja
              </li>
              <li className="flex items-center gap-2">
                <FaShoppingBag className="text-[#9E4BDC]" /> Kualitas Produk Terbaik
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#22285E] uppercase tracking-wider">Info Koleksi Baru</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Masukkan email untuk mendapatkan pembaruan info diskon dan restok produk terlaris kami.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Terima kasih sudah mendaftar!"); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Alamat Email"
                className="w-full bg-[#F4F4F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#22285E] placeholder-gray-400 focus:outline-none focus:border-[#9E4BDC] focus:ring-1 focus:ring-[#9E4BDC]"
              />
              <button
                type="submit"
                className="bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          <p>© 2026 Na_store.id. Semua Hak Dilindungi Undang-Undang.</p>
          <p className="mt-1 font-medium text-[#9E4BDC]">Premium Accessories Portal - Powered by Supabase & Axios</p>
        </div>
      </footer>
    </div>
  );
}
