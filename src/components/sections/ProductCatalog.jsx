/**
 * KOMPONEN: ProductCatalog
 * - Katalog grid + filter kategori
 * - Product Detail Modal dengan qty controls
 * - Flying ball animation (framer-motion)
 * - Sticky toast notifikasi
 * - Guard Guest vs Customer (Shadcn Dialog)
 */
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, X, LogIn, Star, Package,
  ShoppingBag, Sparkles, Eye, Plus, Minus,
  CheckCircle2, Tag, Search, SearchX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

/* ─── IMAGES ─── */
import imgKalungRosegold from "../../assets/gambarproduk/kalungrosegold.png";
import imgKalungChoker   from "../../assets/gambarproduk/kalungchoker.png";
import imgKalungBintang  from "../../assets/gambarproduk/kalungbintang.png";
import imgKalungPearl    from "../../assets/gambarproduk/kalungpearl.png";
import imgGelangCrystal  from "../../assets/gambarproduk/gelangcrystal.png";
import imgGelangPerak    from "../../assets/gambarproduk/gelangperak.png";
import imgGelangBead     from "../../assets/gambarproduk/gelangbead.png";
import imgGelangTali     from "../../assets/gambarproduk/gelangtali.png";
import imgCincinCouple   from "../../assets/gambarproduk/cincincouple.png";
import imgCincinGold     from "../../assets/gambarproduk/cincingold.png";
import imgCincinResin    from "../../assets/gambarproduk/cincinresin.png";
import imgAntingHoop     from "../../assets/gambarproduk/antinghoop.png";
import imgAntingTassel   from "../../assets/gambarproduk/antingtassel.png";
import imgAntingPearl    from "../../assets/gambarproduk/antingpearl.png";
import imgAntingBintang  from "../../assets/gambarproduk/antingbintang.png";
import imgScrunchie      from "../../assets/gambarproduk/scrunchie.png";

/* ─── MOCK DATA ─── */
const PRODUCTS = [
  { id:1,  name:"Kalung Titanium Rosegold", category:"Kalung",  price:"Rp 89.000", priceValue:89000,  stock:24, image:imgKalungRosegold, tag:"Best Seller", rating:4.9, sold:312,
    desc:"Kalung titanium rosegold anti karat dengan finishing premium. Material hypoallergenic, aman untuk kulit sensitif. Tersedia dalam panjang 40 cm dan 45 cm." },
  { id:2,  name:"Kalung Choker Elegan",     category:"Kalung",  price:"Rp 65.000", priceValue:65000,  stock:8,  image:imgKalungChoker,   tag:"Trending",    rating:4.7, sold:198,
    desc:"Choker minimalis dengan detail rantai tipis berkilau. Cocok untuk tampilan kasual maupun semi-formal. Material stainless steel berlapis emas." },
  { id:3,  name:"Kalung Bintang Perak",     category:"Kalung",  price:"Rp 72.000", priceValue:72000,  stock:15, image:imgKalungBintang,  tag:"Top Rated",   rating:5.0, sold:89,
    desc:"Kalung dengan liontin bintang perak sterling 925. Detail ukir tangan yang presisi dengan kilap natural. Datang dalam kotak kado premium." },
  { id:4,  name:"Kalung Pearl Minimalist",  category:"Kalung",  price:"Rp 55.000", priceValue:55000,  stock:0,  image:imgKalungPearl,    tag:"Favorit",     rating:4.8, sold:143,
    desc:"Kalung mutiara sintetis bergaya minimalis. Liontin mutiara putih berukuran 8mm dengan rantai emas tipis. Kesan elegan untuk tampilan sehari-hari." },
  { id:5,  name:"Gelang Crystal Aesthetic", category:"Gelang",  price:"Rp 55.000", priceValue:55000,  stock:31, image:imgGelangCrystal,  tag:"Trending",    rating:4.8, sold:267,
    desc:"Gelang kristal Swarovski-inspired dengan warna pelangi yang berkilau di bawah cahaya. Elastis, one-size-fits-all. Bisa dipadukan dengan gelang lain." },
  { id:6,  name:"Gelang Perak Ukir",        category:"Gelang",  price:"Rp 78.000", priceValue:78000,  stock:6,  image:imgGelangPerak,    tag:"Premium",     rating:4.9, sold:112,
    desc:"Gelang bangle perak dengan motif ukir bunga tradisional. Dibuat dari perak 925 murni oleh pengrajin lokal berpengalaman." },
  { id:7,  name:"Gelang Bead Colorful",     category:"Gelang",  price:"Rp 35.000", priceValue:35000,  stock:42, image:imgGelangBead,     tag:"New Arrival", rating:4.6, sold:88,
    desc:"Gelang manik-manik warna-warni berbahan acrylic premium. Ringan dan nyaman dipakai seharian. Tersedia dalam 8 pilihan kombinasi warna." },
  { id:8,  name:"Gelang Tali Charm",        category:"Gelang",  price:"Rp 28.000", priceValue:28000,  stock:0,  image:imgGelangTali,     tag:"Favorit",     rating:4.5, sold:76,
    desc:"Gelang tali lilin dengan charm perak mini. Dapat disesuaikan ukurannya dengan simpul geser. Tersedia pilihan charm bintang, bulan, dan love." },
  { id:9,  name:"Cincin Couple Silver",     category:"Cincin",  price:"Rp 95.000", priceValue:95000,  stock:18, image:imgCincinCouple,   tag:"Best Seller", rating:4.9, sold:201,
    desc:"Pasangan cincin couple sterling silver 925 dengan ukiran nama. Tersedia dalam ukuran 5-12. Cocok sebagai hadiah anniversary atau wisuda." },
  { id:10, name:"Cincin Adjustable Gold",   category:"Cincin",  price:"Rp 45.000", priceValue:45000,  stock:27, image:imgCincinGold,     tag:"Trending",    rating:4.7, sold:145,
    desc:"Cincin gold adjustable dengan desain open-end yang bisa disesuaikan ukurannya. Material kuningan berlapis gold 18K, tahan gesek dan tidak mudah pudar." },
  { id:11, name:"Cincin Resin Bunga",       category:"Cincin",  price:"Rp 38.000", priceValue:38000,  stock:3,  image:imgCincinResin,    tag:"Handmade",    rating:4.8, sold:93,
    desc:"Cincin resin handmade dengan kelopak bunga asli yang diawetkan di dalam resin bening. Setiap cincin unik dan berbeda — karya seni yang bisa dipakai." },
  { id:12, name:"Anting Hoop Premium",      category:"Anting",  price:"Rp 42.000", priceValue:42000,  stock:22, image:imgAntingHoop,     tag:"Trending",    rating:4.7, sold:176,
    desc:"Anting hoop klasik dengan diameter 3 cm. Material titanium ringan anti alergi. Pengait push-back yang kuat, nyaman untuk pemakaian seharian." },
  { id:13, name:"Anting Tassel Bohemian",   category:"Anting",  price:"Rp 48.000", priceValue:48000,  stock:3,  image:imgAntingTassel,   tag:"Eksklusif",   rating:4.8, sold:134,
    desc:"Anting tassel panjang bergaya bohemian dengan detail bead warna-warni. Ringan meski terlihat statement. Cocok untuk acara festival dan casual." },
  { id:14, name:"Anting Pearl Elegan",      category:"Anting",  price:"Rp 38.000", priceValue:38000,  stock:0,  image:imgAntingPearl,    tag:"Favorit",     rating:4.9, sold:267,
    desc:"Anting studs mutiara sintetis ukuran 6mm dengan tatanan silver. Tampil elegan dan bersih. Cocok untuk interview kerja, kondangan, maupun sehari-hari." },
  { id:15, name:"Anting Bintang Mini",      category:"Anting",  price:"Rp 32.000", priceValue:32000,  stock:19, image:imgAntingBintang,  tag:"New Arrival", rating:4.6, sold:58,
    desc:"Anting studs berbentuk bintang mini 5 titik. Tersedia dalam warna gold dan silver. Material stainless steel hypoallergenic, aman untuk telinga sensitif." },
  { id:16, name:"Scrunchie Satin Premium",  category:"Aksesori",price:"Rp 29.000", priceValue:29000,  stock:14, image:imgScrunchie,      tag:"Reward Item", rating:4.8, sold:176,
    desc:"Ikat rambut satin lembut anti-serat yang tidak merusak rambut. Tersedia dalam 12 pilihan warna pastel dan earth tone. 1 set isi 3 pcs." },
];

const CATEGORIES = ["Semua", "Kalung", "Gelang", "Cincin", "Anting"];

const TAG_COLORS = {
  "Best Seller":"bg-amber-100 text-amber-700 border-amber-200",
  "Trending":   "bg-blue-100 text-blue-700 border-blue-200",
  "New Arrival":"bg-emerald-100 text-emerald-700 border-emerald-200",
  "Top Rated":  "bg-purple-100 text-purple-700 border-purple-200",
  "Favorit":    "bg-pink-100 text-pink-700 border-pink-200",
  "Premium":    "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Handmade":   "bg-orange-100 text-orange-700 border-orange-200",
  "Eksklusif":  "bg-red-100 text-red-700 border-red-200",
  "Reward Item":"bg-teal-100 text-teal-700 border-teal-200",
};

/* ══════════════════════════════════════════════
   FLYING BALL
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   STICKY TOAST — tetap terlihat sampai di-dismiss
══════════════════════════════════════════════ */
function StickyToast({ product, onClose }) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999] bg-white border border-[#9E4BDC]/20 rounded-2xl shadow-2xl shadow-[#9E4BDC]/10 flex items-center gap-3 p-3.5 pr-5 min-w-[300px] max-w-[360px]"
      initial={{ opacity: 0, y: 32, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.94 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Product thumb */}
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Ditambahkan!</span>
        </div>
        <p className="text-xs font-bold text-[#22285E] line-clamp-1 leading-snug">{product.name}</p>
        <p className="text-[10px] text-gray-400 font-medium">{product.price} · +{Math.floor(product.priceValue / 1000)} Poin</p>
      </div>
      {/* Dismiss */}
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
      >
        <X className="w-3 h-3 text-gray-400" />
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   PRODUCT DETAIL MODAL
══════════════════════════════════════════════ */
function ProductDetailModal({ product, isLoggedIn, onAddToCart, onGuestBlock, onClose }) {
  const [qty, setQty] = useState(1);
  const btnRef = useRef(null);
  const isOutOfStock = product.stock === 0;

  const handleAdd = () => {
    if (!isLoggedIn) { onGuestBlock(); return; }
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      onAddToCart(product, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, qty);
    }
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-[#22285E]/55 backdrop-blur-md flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl relative"
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="w-full md:w-[280px] shrink-0 bg-gradient-to-br from-gray-50 to-gray-100/60 flex items-center justify-center p-8 min-h-[240px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-56 w-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Right: Info */}
          <div className="flex-1 p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              {/* Tag + category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${TAG_COLORS[product.tag] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                  {product.tag}
                </span>
                <span className="text-[9px] font-black text-[#9E4BDC] uppercase tracking-widest">{product.category}</span>
              </div>

              {/* Name */}
              <h2 className="text-lg font-black text-[#22285E] leading-snug">{product.name}</h2>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
                <span className="text-[10px] text-gray-400 font-bold ml-1">{product.rating} · {product.sold}+ terjual</span>
              </div>

              {/* Desc */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{product.desc}</p>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-[9px] font-black rounded-full">Stok Habis</Badge>
                ) : product.stock < 10 ? (
                  <Badge className="text-[9px] font-black rounded-full bg-amber-500 hover:bg-amber-500 border-0">Sisa {product.stock} unit</Badge>
                ) : (
                  <Badge className="text-[9px] font-black rounded-full bg-emerald-500 hover:bg-emerald-500 border-0">Stok {product.stock} unit</Badge>
                )}
              </div>
            </div>

            {/* Price + Qty + CTA */}
            <div className="space-y-4">
              {/* Price */}
              <div>
                <p className="text-[10px] text-gray-400 line-through">Rp {Math.floor(product.priceValue * 1.2).toLocaleString("id")}</p>
                <p className="text-2xl font-black text-[#9E4BDC] leading-tight">{product.price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3 text-[#00B5AD]" />
                  <span className="text-[10px] text-[#00B5AD] font-bold">
                    +{Math.floor(product.priceValue / 1000 * qty)} Poin untuk {qty} item
                  </span>
                </div>
              </div>

              {/* Qty controls */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">Jumlah:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500 hover:text-[#9E4BDC]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-black text-[#22285E] select-none">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500 hover:text-[#9E4BDC]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400">maks. {product.stock}</span>
                </div>
              )}

              {/* CTA */}
              <motion.button
                ref={btnRef}
                disabled={isOutOfStock}
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-colors
                  ${isOutOfStock
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white shadow-lg shadow-[#9E4BDC]/25 cursor-pointer"
                  }`}
                whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? "Stok Habis" : `Tambah ke Keranjang${qty > 1 ? ` (${qty})` : ""}`}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════ */
function ProductCard({ product, isLoggedIn, onAddToCart, onGuestBlock, onViewDetail, index }) {
  const btnRef = useRef(null);
  const isOutOfStock = product.stock === 0;
  const isLowStock   = product.stock > 0 && product.stock < 10;
  const tagClass     = TAG_COLORS[product.tag] ?? "bg-gray-100 text-gray-600 border-gray-200";

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!isLoggedIn) { onGuestBlock(); return; }
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) onAddToCart(product, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, 1);
  };

  return (
    <motion.div
      className={`group relative bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden text-left
        ${isOutOfStock ? "opacity-60 border-gray-100" : "border-gray-100/80 hover:shadow-xl hover:border-[#9E4BDC]/20"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isOutOfStock ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={!isOutOfStock ? { y: -4 } : {}}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${tagClass}`}>
          {product.tag}
        </span>
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-[9px] font-black px-2.5 py-0.5 rounded-full w-fit">Stok Habis</Badge>
        ) : isLowStock ? (
          <Badge className="text-[9px] font-black px-2.5 py-0.5 rounded-full w-fit bg-amber-500 hover:bg-amber-500 border-0">Sisa {product.stock}</Badge>
        ) : (
          <Badge className="text-[9px] font-black px-2.5 py-0.5 rounded-full w-fit bg-emerald-500 hover:bg-emerald-500 border-0">Stok {product.stock}</Badge>
        )}
      </div>

      {/* Image — klik buka detail */}
      <div
        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-100 overflow-hidden relative cursor-pointer"
        onClick={() => !isOutOfStock && onViewDetail(product)}
      >
        <img
          src={product.image} alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${!isOutOfStock ? "group-hover:scale-105" : ""}`}
        />
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

      {/* Info */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1.5">
          <p className="text-[9px] font-black text-[#9E4BDC] uppercase tracking-widest">{product.category}</p>
          <h4
            className="text-xs font-bold text-[#22285E] line-clamp-2 leading-snug min-h-[2.4rem] cursor-pointer hover:text-[#9E4BDC] transition-colors"
            onClick={() => !isOutOfStock && onViewDetail(product)}
          >
            {product.name}
          </h4>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-[9px] text-gray-400 ml-1 font-bold">{product.rating} · {product.sold}+</span>
          </div>
        </div>

        {/* Price + Cart */}
        <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[9px] text-gray-400 line-through leading-none">Rp {Math.floor(product.priceValue * 1.2).toLocaleString("id")}</p>
            <p className="text-sm font-black text-[#9E4BDC] mt-0.5 leading-none">{product.price}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Sparkles className="w-2.5 h-2.5 text-[#00B5AD] shrink-0" />
              <span className="text-[9px] text-[#00B5AD] font-bold">+{Math.floor(product.priceValue / 1000)} Poin</span>
            </div>
          </div>
          <motion.button
            ref={btnRef}
            disabled={isOutOfStock}
            onClick={handleCartClick}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors
              ${isOutOfStock ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white shadow-md shadow-[#9E4BDC]/30 cursor-pointer"}`}
            whileTap={!isOutOfStock ? { scale: 0.85 } : {}}
            whileHover={!isOutOfStock ? { scale: 1.08 } : {}}
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function ProductCatalog({ isLoggedIn, onAddToCart, onLoginClick }) {
  const [activeCategory, setActiveCategory]   = useState("Semua");
  const [searchQuery, setSearchQuery]         = useState("");
  const [flyingBalls, setFlyingBalls]         = useState([]);
  const [stickyToast, setStickyToast]         = useState(null);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [detailProduct, setDetailProduct]     = useState(null);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat  = activeCategory === "Semua" || p.category === activeCategory;
    const q         = searchQuery.trim().toLowerCase();
    const matchSearch = q === ""
      || p.name.toLowerCase().includes(q)
      || p.category.toLowerCase().includes(q)
      || p.tag.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleAddToCart = useCallback((product, origin, qty = 1) => {
    // Flying ball
    const ballId = Date.now();
    setFlyingBalls((prev) => [...prev, { id: ballId, origin }]);

    // Sticky toast — ganti toast yang sedang tampil
    setStickyToast({ product });

    // Notify parent (qty kali untuk counter)
    for (let i = 0; i < qty; i++) {
      if (onAddToCart) onAddToCart(product);
    }
  }, [onAddToCart]);

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
          <StickyToast
            key="sticky"
            product={stickyToast.product}
            onClose={() => setStickyToast(null)}
          />
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
              Silakan Masuk atau Daftar akun terlebih dahulu untuk mulai belanja dan menikmati program loyalitas Na_store.id!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => { setGuestDialogOpen(false); onLoginClick?.(); }}
              className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#9E4BDC]/20 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Masuk / Daftar Sekarang
            </button>
            <button
              onClick={() => setGuestDialogOpen(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Lanjut Melihat Katalog
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailModal
            product={detailProduct}
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
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-black text-emerald-700">Stok Real-Time</span>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        {/* Search input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk, kategori, atau tag..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs text-[#22285E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 focus:border-[#9E4BDC] transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-2.5 h-2.5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2.5 rounded-full text-xs font-black transition-colors shrink-0 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-[#9E4BDC] text-white border-[#9E4BDC] shadow-md shadow-[#9E4BDC]/25"
                  : "bg-white text-gray-400 hover:text-[#22285E] border-gray-200/60 hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
              {activeCategory === cat && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-white/15"
                  layoutId="categoryPill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isLoggedIn={isLoggedIn}
              onAddToCart={handleAddToCart}
              onGuestBlock={() => setGuestDialogOpen(true)}
              onViewDetail={setDetailProduct}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          className="text-center py-20 text-gray-400"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <SearchX className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-bold text-gray-500">
            {searchQuery ? `Tidak ada produk untuk "${searchQuery}"` : "Belum ada produk di kategori ini"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-xs text-[#9E4BDC] font-bold hover:underline cursor-pointer"
            >
              Hapus pencarian
            </button>
          )}
        </motion.div>
      )}

      {/* ── Points Banner ── */}
      <motion.div
        className="mt-12 bg-gradient-to-r from-[#9E4BDC]/8 via-[#7C3AED]/5 to-[#4F46E5]/8 border border-[#9E4BDC]/15 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
          {/* Left icon block */}
          <div className="bg-[#9E4BDC]/10 px-6 py-5 flex items-center justify-center shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-[#9E4BDC]/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#9E4BDC]" />
            </div>
          </div>
          {/* Text */}
          <div className="flex-1 px-6 py-5 flex flex-col justify-center text-left">
            <p className="text-sm font-black text-[#22285E]">Setiap Rp1.000 = 1 Poin Loyalitas</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">
              Kumpulkan poin dari setiap pembelian dan tukarkan dengan aksesoris gratis atau voucher diskon eksklusif.
            </p>
          </div>
          {/* CTA — hanya muncul untuk guest */}
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

    </section>
  );
}
