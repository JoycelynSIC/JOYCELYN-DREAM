/**
 * KOMPONEN: ProductCatalog (v3 — Supabase + CRM Tier Discount)
 * - Data live dari tabel public.produk (Supabase)
 * - Diskon otomatis sesuai tier CRM user (crm_tier_config)
 * - Skeleton loader saat fetch
 * - Flying ball + sticky toast + detail modal
 * - Filter kategori + search
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, X, LogIn, Package,
  Sparkles, Eye, Plus, Minus, CheckCircle2,
  Tag, Search, SearchX, Crown,
  AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { produkAPI, getProdukImageUrl } from "../../services/produkAPI";

// ── Tier badge config ─────────────────────────────────────────────────────────
const TIER_CONFIG = {
  Platinum: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: "💎" },
  Gold:     { color: "bg-amber-100  text-amber-700  border-amber-200",  icon: "🥇" },
  Silver:   { color: "bg-slate-100  text-slate-600  border-slate-200",  icon: "🥈" },
};

// Hitung harga member dari harga asli + persentase diskon
const hitungHargaMember = (hargaAsli, persen) => {
  if (!persen || persen <= 0) return null;
  return Math.floor(hargaAsli - (hargaAsli * persen / 100));
};

const rupiahFmt = (angka) =>
  "Rp " + angka.toLocaleString("id-ID");

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-8 bg-gray-100 rounded-2xl mt-3" />
      </div>
    </div>
  );
}

// ── Flying Ball ───────────────────────────────────────────────────────────────
function FlyingBall({ origin, onComplete }) {
  const target = { x: window.innerWidth - 88, y: 28 };
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none"
      style={{ left: origin.x - 16, top: origin.y - 16 }}
      initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
      animate={{ x: target.x - origin.x, y: target.y - origin.y, scale: 0.25, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onComplete}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9E4BDC] to-[#4F46E5] shadow-lg shadow-[#9E4BDC]/50 flex items-center justify-center">
        <ShoppingCart className="w-3.5 h-3.5 text-white" />
      </div>
    </motion.div>
  );
}

// ── Sticky Toast ──────────────────────────────────────────────────────────────
function StickyToast({ product, price, onClose }) {
  const imgUrl = getProdukImageUrl(product.gambar);
  const showPrice = price ?? product.harga;
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999] bg-white border border-[#9E4BDC]/20 rounded-2xl shadow-2xl shadow-[#9E4BDC]/10 flex items-center gap-3 p-3.5 pr-5 min-w-[300px] max-w-[360px]"
      initial={{ opacity: 0, y: 32, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.94 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Ditambahkan!</span>
        </div>
        <p className="text-xs font-bold text-[#22285E] line-clamp-1">{product.name}</p>
        <p className="text-[10px] text-gray-400 font-medium">{rupiahFmt(showPrice)} · +{Math.floor(showPrice / 1000)} Poin</p>
      </div>
      <button onClick={onClose} className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
        <X className="w-3 h-3 text-gray-400" />
      </button>
    </motion.div>
  );
}

// ── Product Detail Modal ──────────────────────────────────────────────────────
function ProductDetailModal({ product, tierPersen, tierName, isLoggedIn, onAddToCart, onGuestBlock, onClose }) {
  const [qty, setQty]           = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [copied, setCopied]     = useState(false);
  const btnRef       = useRef(null);
  const isOutOfStock = product.stock === 0;
  const isLowStock   = product.stock > 0 && product.stock < 10;
  const imgUrl       = getProdukImageUrl(product.gambar);
  const hargaMember  = hitungHargaMember(product.harga, tierPersen);
  const tierCfg      = TIER_CONFIG[tierName];
  const finalPrice   = hargaMember ?? product.harga;
  const hargaAsli    = Math.ceil((product.harga * 1.2) / 1000) * 1000;
  const pointsEarned = Math.floor(finalPrice / 1000 * qty);

  // Persentase sisa stok untuk progress bar (maks anggap 50 unit = 100%)
  const stockPct = Math.min(100, Math.round((product.stock / 50) * 100));

  const handleAdd = () => {
    if (!isLoggedIn) { onGuestBlock(); return; }
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) onAddToCart(product, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, qty);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(product.name + " – Na_store.id");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-[#22285E]/60 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-[2rem] max-w-3xl w-full overflow-hidden shadow-2xl shadow-[#22285E]/20 relative flex flex-col md:flex-row max-h-[92vh]"
        initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── LEFT: Image Panel ─────────────────────── */}
        <div className="relative w-full md:w-[300px] shrink-0 bg-gradient-to-br from-[#f3f0ff] via-[#faf5ff] to-[#ede9fe] flex flex-col items-center justify-center p-8 min-h-[260px] md:min-h-0">
          {/* Ambient glow behind image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full bg-[#9E4BDC]/10 blur-[60px]" />
          </div>

          {/* Stock status pill */}
          <div className="absolute top-4 left-4">
            {isOutOfStock ? (
              <span className="bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full">Stok Habis</span>
            ) : isLowStock ? (
              <span className="bg-amber-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full animate-pulse">Sisa {product.stock} unit!</span>
            ) : (
              <span className="bg-emerald-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full">Ready Stock</span>
            )}
          </div>

          {/* Action buttons top-right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setWishlist(w => !w)}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-all cursor-pointer ${wishlist ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-400 hover:text-red-400"}`}
              title="Wishlist"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={wishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#9E4BDC] flex items-center justify-center shadow-sm transition-all cursor-pointer"
              title="Salin nama produk"
            >
              {copied
                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                : <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              }
            </button>
          </div>

          {/* Product image */}
          <div className="relative z-10 flex items-center justify-center w-full h-52">
            {imgUrl
              ? <img src={imgUrl} alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105" />
              : <Package className="w-24 h-24 text-[#9E4BDC]/20" />
            }
          </div>

          {/* Stock progress bar */}
          {!isOutOfStock && (
            <div className="relative z-10 w-full mt-5 space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-gray-400">Ketersediaan Stok</span>
                <span className={isLowStock ? "text-amber-500" : "text-emerald-600"}>{product.stock} unit tersisa</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isLowStock ? "bg-amber-400" : "bg-emerald-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stockPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Info Panel ─────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto">

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer md:top-5 md:right-5">
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>

          <div className="p-6 md:p-7 flex flex-col gap-5 flex-1">

            {/* ── Badges row ── */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-black text-[#9E4BDC] uppercase tracking-widest bg-[#9E4BDC]/8 px-2.5 py-1 rounded-full border border-[#9E4BDC]/15">
                {product.kategori || "Aksesori"}
              </span>
              {product.material && (
                <span className="text-[9px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                  {product.material}
                </span>
              )}
              {tierCfg && hargaMember && (
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${tierCfg.color}`}>
                  <Crown className="w-2.5 h-2.5" /> {tierCfg.icon} {tierName} {tierPersen}% OFF
                </span>
              )}
            </div>

            {/* ── Product name ── */}
            <div>
              <h2 className="text-xl font-black text-[#22285E] leading-snug">{product.name}</h2>
              <p className="text-[10px] text-gray-400 font-medium mt-1">ID: {product.id}</p>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Kategori",  value: product.kategori || "—" },
                { label: "Material",  value: product.material || "—" },
                { label: "Stok",      value: isOutOfStock ? "Habis" : `${product.stock} unit` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-xs font-black text-[#22285E] leading-tight line-clamp-1">{value}</p>
                </div>
              ))}
            </div>

            {/* ── Divider ── */}
            <div className="h-px bg-gray-100" />

            {/* ── Price section ── */}
            <div className="space-y-2">
              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <p className="text-[10px] text-gray-400 line-through leading-none">{rupiahFmt(hargaAsli)}</p>
                  <p className="text-3xl font-black text-emerald-600 leading-tight mt-0.5">{rupiahFmt(finalPrice)}</p>
                </div>
                <span className={`mb-1 text-[9px] font-black px-2.5 py-1.5 rounded-xl border ${tierPersen > 0 ? (tierCfg?.color || "bg-[#9E4BDC]/10 text-[#9E4BDC] border-[#9E4BDC]/20") : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                  {tierPersen > 0 
                    ? `Hemat ${rupiahFmt(hargaAsli - finalPrice)} (Member ${tierName} + Promo)`
                    : `Hemat ${rupiahFmt(hargaAsli - finalPrice)} (Promo)`
                  }
                </span>
              </div>

              {/* Poin info */}
              <div className="inline-flex items-center gap-1.5 bg-[#00B5AD]/8 border border-[#00B5AD]/20 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-3 h-3 text-[#00B5AD]" />
                <span className="text-[10px] text-[#00B5AD] font-bold">
                  Belanja ini = <strong>+{pointsEarned} Poin</strong> loyalitas
                </span>
              </div>
            </div>

            {/* ── Guest CTA jika belum login ── */}
            {!isLoggedIn && (
              <div className="bg-[#9E4BDC]/5 border border-[#9E4BDC]/15 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#9E4BDC]/10 flex items-center justify-center shrink-0">
                  <Crown className="w-3.5 h-3.5 text-[#9E4BDC]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#22285E]">Login untuk harga member</p>
                  <p className="text-[9px] text-gray-400 font-medium">Dapatkan diskon tier Silver/Gold/Platinum + kumpulkan poin</p>
                </div>
              </div>
            )}

            {/* ── Qty + CTA ── */}
            <div className="mt-auto space-y-3 pt-2">
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Jumlah:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-[#9E4BDC]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-black text-[#22285E] select-none">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-[#9E4BDC]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400">maks. {product.stock}</span>
                  {qty > 1 && (
                    <span className="text-[10px] font-black text-[#9E4BDC] ml-auto">
                      Total: {rupiahFmt(finalPrice * qty)}
                    </span>
                  )}
                </div>
              )}

              <motion.button
                ref={btnRef}
                disabled={isOutOfStock}
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-colors
                  ${isOutOfStock
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#9E4BDC] to-[#7C3AED] hover:from-[#8B3EC7] hover:to-[#6D28D9] text-white shadow-lg shadow-[#9E4BDC]/30 cursor-pointer"
                  }`}
                whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock
                  ? "Stok Habis"
                  : qty > 1
                    ? `Tambah ${qty} Item ke Keranjang`
                    : "Tambah ke Keranjang"
                }
              </motion.button>

              {/* Garansi info */}
              <div className="flex items-center justify-center gap-4 pt-1">
                {[
                  { Icon: CheckCircle2, text: "Transaksi Aman" },
                  { Icon: Tag,          text: "Kumpul Poin" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold">
                    <Icon className="w-3 h-3 shrink-0" /><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, tierPersen, tierName, isLoggedIn, onAddToCart, onGuestBlock, onViewDetail, index }) {
  const btnRef        = useRef(null);
  const isOutOfStock  = product.stock === 0;
  const isLowStock    = product.stock > 0 && product.stock < 10;
  const imgUrl        = getProdukImageUrl(product.gambar);
  const hargaMember   = hitungHargaMember(product.harga, tierPersen);
  const hargaPromo    = hargaMember ?? product.harga;
  const hargaAsli     = Math.ceil((product.harga * 1.2) / 1000) * 1000;
  const tierCfg       = TIER_CONFIG[tierName];

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!isLoggedIn) { onGuestBlock(); return; }
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) onAddToCart(product, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, 1);
  };

  return (
    <motion.div
      className={`group relative bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden text-left h-full
        ${isOutOfStock ? "opacity-60 border-gray-100" : "border-gray-100/80 hover:shadow-xl hover:border-[#9E4BDC]/20"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isOutOfStock ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      whileHover={!isOutOfStock ? { y: -4 } : {}}
    >
      {/* ── Tier Discount Badge (pojok kanan atas) ── */}
      {tierCfg && hargaMember && !isOutOfStock && (
        <div className={`absolute top-3 right-3 z-10 flex items-center gap-1 text-[8px] font-black px-2 py-1 rounded-full border ${tierCfg.color}`}>
          <Crown className="w-2.5 h-2.5" /> {tierCfg.icon} {tierPersen}% OFF
        </div>
      )}

      {/* ── Stok Badge (pojok kiri atas) ── */}
      <div className="absolute top-3 left-3 z-10">
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-[8px] font-black px-2 py-0.5 rounded-full">Stok Habis</Badge>
        ) : isLowStock ? (
          <Badge className="text-[8px] font-black px-2 py-0.5 rounded-full bg-amber-500 hover:bg-amber-500 border-0">Sisa {product.stock}</Badge>
        ) : null}
      </div>

      {/* ── Gambar ── */}
      <div
        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-100 overflow-hidden relative cursor-pointer"
        onClick={() => !isOutOfStock && onViewDetail(product)}
      >
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 ${!isOutOfStock ? "group-hover:scale-105" : ""}`} />
          : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-gray-200" /></div>
        }
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-[#22285E]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
            <div className="flex items-center gap-1.5 bg-white text-[#22285E] text-[10px] font-black px-4 py-2 rounded-xl shadow-lg">
              <Eye className="w-3 h-3" /> Lihat Detail
            </div>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
            <div className="bg-white/90 text-gray-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5">
              <Package className="w-3 h-3" /> Habis Terjual
            </div>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1.5">
          <p className="text-[9px] font-black text-[#9E4BDC] uppercase tracking-widest">{product.kategori}</p>
          <h4
            className="text-xs font-bold text-[#22285E] line-clamp-2 leading-snug min-h-[2.4rem] cursor-pointer hover:text-[#9E4BDC] transition-colors"
            onClick={() => !isOutOfStock && onViewDetail(product)}
          >
            {product.name}
          </h4>
        </div>

        {/* ── Harga + Cart ── */}
        <div className="mt-3.5 pt-3.5 border-t border-gray-100">
          {/* Area Harga */}
          <div className="mb-3">
            <p className="text-[9px] text-gray-400 line-through leading-none">{rupiahFmt(hargaAsli)}</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5 leading-none">{rupiahFmt(hargaPromo)}</p>
            <p className="text-[8px] text-emerald-500 font-bold mt-0.5">
              Hemat {rupiahFmt(hargaAsli - hargaPromo)}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <Sparkles className="w-2.5 h-2.5 text-[#00B5AD] shrink-0" />
              <span className="text-[9px] text-[#00B5AD] font-bold">+{Math.floor(hargaPromo / 1000)} Poin</span>
            </div>
          </div>

          {/* Tombol Tambah ke Keranjang */}
          <motion.button
            ref={btnRef}
            disabled={isOutOfStock}
            onClick={handleCartClick}
            className={`w-full py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors
              ${isOutOfStock ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white shadow-md shadow-[#9E4BDC]/30 cursor-pointer"}`}
            whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
/**
 * Props:
 *   isLoggedIn   : boolean
 *   userProfile  : object | null  — harus ada .id (FK ke users_profile)
 *                                   dan opsional .statusKeanggotaan
 *   onAddToCart  : (product) => void
 *   onLoginClick : () => void
 */
export default function ProductCatalog({ isLoggedIn, userProfile, tierPersen: tierPersenProp, onAddToCart, onLoginClick }) {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  // Gunakan prop tierPersen dari UserLayout (sudah di-fetch), fallback ke fetch mandiri
  const [tierName, setTierName]           = useState(null);
  const [tierPersen, setTierPersen]       = useState(tierPersenProp ?? 0);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery]       = useState("");
  const [currentPage, setCurrentPage]       = useState(1);
  const [flyingBalls, setFlyingBalls]       = useState([]);
  const [stickyToast, setStickyToast]       = useState(null);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [detailProduct, setDetailProduct]   = useState(null);

  // Reset ke page 1 saat filter/search berubah
  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  // ── Fetch produk dari Supabase ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await produkAPI.fetchAllProduk();
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError("Gagal memuat katalog. Coba refresh halaman.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Sync tierPersen dari prop UserLayout + derive tierName dari userProfile
  useEffect(() => {
    // Prop dari UserLayout sudah paling akurat — pakai langsung
    setTierPersen(tierPersenProp ?? 0);
    // tierName dari statusMember (Silver/Gold/Platinum), bukan statusKeanggotaan (Aktif/Nonaktif)
    const tier = userProfile?.statusMember ?? null;
    const validTiers = ["Silver", "Gold", "Platinum"];
    setTierName(validTiers.includes(tier) ? tier : null);
  }, [tierPersenProp, userProfile]);

  // ── Filter & Pagination ────────────────────────────────────────────────────
  const MAX_VISIBLE_CATS = 6; // tampilkan maks 6 kategori, sisanya → "Lainnya"
  const ITEMS_PER_PAGE   = 20; // 5 kolom × 4 baris

  // Semua kategori unik dari data
  const allCategories = Array.from(new Set(products.map((p) => p.kategori).filter(Boolean)));
  // 6 pertama yang paling sering muncul
  const topCats = allCategories
    .map((cat) => ({ cat, count: products.filter((p) => p.kategori === cat).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_VISIBLE_CATS)
    .map((x) => x.cat);
  const hasOthers = allCategories.length > MAX_VISIBLE_CATS;
  const otherCats = allCategories.filter((c) => !topCats.includes(c));

  // Kategori yang sedang aktif: "Semua" | salah satu topCats | "Lainnya"
  const visibleCategories = ["Semua", ...topCats, ...(hasOthers ? ["Lainnya"] : [])];

  const filtered = products.filter((p) => {
    let matchCat;
    if (activeCategory === "Semua")    matchCat = true;
    else if (activeCategory === "Lainnya") matchCat = otherCats.includes(p.kategori);
    else                               matchCat = p.kategori === activeCategory;
    const q           = searchQuery.trim().toLowerCase();
    const matchSearch = q === "" || p.name.toLowerCase().includes(q) || p.kategori.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Cart handler ────────────────────────────────────────────────────────────
  const handleAddToCart = useCallback((product, origin, qty = 1) => {
    const ballId = Date.now();
    setFlyingBalls((prev) => [...prev, { id: ballId, origin }]);
    const finalPrice = hitungHargaMember(product.harga, tierPersen) ?? product.harga;
    setStickyToast({ product, price: finalPrice });
    for (let i = 0; i < qty; i++) {
      if (onAddToCart) onAddToCart(product);
    }
  }, [onAddToCart, tierPersen]);

  const removeBall = useCallback((id) => {
    setFlyingBalls((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 md:px-6 scroll-mt-24">

      {/* Flying balls */}
      <AnimatePresence>
        {flyingBalls.map((ball) => (
          <FlyingBall key={ball.id} origin={ball.origin} onComplete={() => removeBall(ball.id)} />
        ))}
      </AnimatePresence>

      {/* Sticky toast */}
      <AnimatePresence>
        {stickyToast && (
          <StickyToast key="sticky" product={stickyToast.product} price={stickyToast.price} onClose={() => setStickyToast(null)} />
        )}
      </AnimatePresence>

      {/* Guest Dialog */}
      <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
        <DialogContent className="max-w-sm rounded-3xl border-0 shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#9E4BDC]/10 flex items-center justify-center mx-auto mb-2">
            <ShoppingCart className="w-6 h-6 text-[#9E4BDC]" />
          </div>
          <DialogHeader className="text-center items-center">
            <DialogTitle className="text-base font-black text-[#22285E]">Akses Terkunci</DialogTitle>
            <DialogDescription className="text-xs text-gray-400 leading-relaxed mt-1">
              Masuk atau daftar akun untuk mulai belanja dan menikmati diskon eksklusif berdasarkan tier keanggotaan kamu!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => { setGuestDialogOpen(false); onLoginClick?.(); }}
              className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#9E4BDC]/20 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Masuk / Daftar Sekarang
            </button>
            <button onClick={() => setGuestDialogOpen(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer">
              Lanjut Melihat Katalog
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailModal
            product={detailProduct}
            tierPersen={tierPersen}
            tierName={tierName}
            isLoggedIn={isLoggedIn}
            onAddToCart={handleAddToCart}
            onGuestBlock={() => { setDetailProduct(null); setGuestDialogOpen(true); }}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <motion.span
            className="inline-block bg-[#00B5AD]/10 text-[#00B5AD] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#00B5AD]/10"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            Katalog Aksesoris
          </motion.span>
          <motion.h2
            className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-2"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
          >
            Koleksi Aksesoris Terlaris
          </motion.h2>
          <motion.p
            className="text-xs text-gray-400 font-medium mt-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.14 }}
          >
            Sempurnakan penampilan dengan aksesoris berkualitas premium buatan lokal
          </motion.p>
        </div>

        <div className="flex items-center gap-3 flex-wrap self-start sm:self-auto">
          {/* Tier badge — tampil kalau user login & punya tier */}
          {isLoggedIn && tierName && tierPersen > 0 && (
            <motion.div
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-black ${TIER_CONFIG[tierName]?.color ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            >
              <Crown className="w-3.5 h-3.5" />
              {TIER_CONFIG[tierName]?.icon} Tier {tierName} — Diskon {tierPersen}%
            </motion.div>
          )}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[10px] font-black text-emerald-700">Stok Real-Time</span>
          </div>
        </div>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        {/* Search bar — lebih panjang */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk atau kategori..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs text-[#22285E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 focus:border-[#9E4BDC] transition-all font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors cursor-pointer">
              <X className="w-2.5 h-2.5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Category pills — max 6 + Lainnya, tidak scroll horizontal */}
        <div className="flex items-center flex-wrap gap-2">
          {visibleCategories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-colors shrink-0 cursor-pointer border
                ${activeCategory === cat
                  ? "bg-[#9E4BDC] text-white border-[#9E4BDC] shadow-md shadow-[#9E4BDC]/25"
                  : "bg-white text-gray-400 hover:text-[#22285E] border-gray-200/60 hover:bg-gray-50"}`}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Error State ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-6 text-sm text-red-600 font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Product Grid — 5 kolom × 4 baris = 20/page ── */}
      {!loading && !error && (
        <>
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" layout>
            <AnimatePresence mode="popLayout">
              {paginated.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  tierPersen={tierPersen}
                  tierName={tierName}
                  isLoggedIn={isLoggedIn}
                  onAddToCart={handleAddToCart}
                  onGuestBlock={() => setGuestDialogOpen(true)}
                  onViewDetail={setDetailProduct}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#9E4BDC]/40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Tampilkan: page 1, last, dan 2 di kiri-kanan currentPage
                const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                const isEllipsisBefore = page === currentPage - 2 && currentPage - 2 > 1;
                const isEllipsisAfter  = page === currentPage + 2 && currentPage + 2 < totalPages;

                if (isEllipsisBefore || isEllipsisAfter) {
                  return <span key={page} className="text-gray-300 text-sm font-bold px-1">…</span>;
                }
                if (!show) return null;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-colors cursor-pointer border
                      ${currentPage === page
                        ? "bg-[#9E4BDC] text-white border-[#9E4BDC] shadow-md shadow-[#9E4BDC]/25"
                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-[#9E4BDC]/30"}`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#9E4BDC]/40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          {/* Info count */}
          {filtered.length > 0 && (
            <p className="text-center text-[10px] text-gray-400 font-medium mt-3">
              Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} produk
            </p>
          )}
        </>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SearchX className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-bold text-gray-400">
            {searchQuery ? `Tidak ada produk untuk "${searchQuery}"` : "Belum ada produk di kategori ini"}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mt-3 text-xs text-[#9E4BDC] font-bold hover:underline cursor-pointer">
              Hapus pencarian
            </button>
          )}
        </motion.div>
      )}

      {/* ── Points Banner ── */}
      {!loading && (
        <motion.div
          className="mt-12 bg-gradient-to-r from-[#9E4BDC]/8 via-[#7C3AED]/5 to-[#4F46E5]/8 border border-[#9E4BDC]/15 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
            <div className="bg-[#9E4BDC]/10 px-6 py-5 flex items-center justify-center shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-[#9E4BDC]/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#9E4BDC]" />
              </div>
            </div>
            <div className="flex-1 px-6 py-5 flex flex-col justify-center text-left">
              <p className="text-sm font-black text-[#22285E]">Setiap Rp1.000 = 1 Poin Loyalitas</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">
                Kumpulkan poin dari setiap pembelian dan tukarkan dengan aksesoris gratis atau voucher diskon eksklusif.
              </p>
            </div>
            {!isLoggedIn && (
              <div className="px-6 py-5 flex items-center shrink-0 border-t sm:border-t-0 sm:border-l border-[#9E4BDC]/10">
                <button
                  onClick={() => onLoginClick?.()}
                  className="bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-[#9E4BDC]/20 flex items-center gap-2 whitespace-nowrap"
                >
                  <Tag className="w-3.5 h-3.5" /> Mulai Kumpulkan Poin
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

    </section>
  );
}
