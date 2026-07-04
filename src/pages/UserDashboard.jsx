import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar, FaBoxOpen, FaGift, FaGem, FaHeadset,
  FaChevronRight, FaTimes, FaChevronDown,
  FaHeart, FaUsers, FaMedal, FaStore, FaShoppingBag,
  FaQuoteLeft, FaMapMarkerAlt, FaPhone, FaClock, FaWhatsapp,
} from "react-icons/fa";

import Card   from "../components/Card";
import Badge  from "../components/Badge";
import { ToastContainer, useToast } from "../components/Toast";
import HeroSection    from "../components/sections/HeroSection";
import ProductCatalog from "../components/sections/ProductCatalog";
import RewardShowcase from "../components/sections/RewardShowcase";
import { userAPI } from "../services/userAPI";

import imgKalungRosegold from "../assets/gambarproduk/kalungrosegold.png";
import imgGelangCrystal  from "../assets/gambarproduk/gelangcrystal.png";
import imgCincinGold     from "../assets/gambarproduk/cincingold.png";
import imgAntingHoop     from "../assets/gambarproduk/antinghoop.png";
import imgAntingPearl    from "../assets/gambarproduk/antingpearl.png";
import imgKalungChoker   from "../assets/gambarproduk/kalungchoker.png";

const gambarOrderMap = {
  "kalungchoker.png":   imgKalungChoker,
  "gelangcrystal.png":  imgGelangCrystal,
  "antingpearl.png":    imgAntingPearl,
};

const getOrderImg = (key) => gambarOrderMap[key] ?? null;

const FAQ_DATA = [
  {
    q: "Bagaimana cara mendapatkan poin loyalitas?",
    a: "Setiap pembelanjaan kelipatan Rp1.000 otomatis menghasilkan 1 Poin. Pastikan sudah login agar poin tercatat ke akun Anda.",
  },
  {
    q: "Apakah poin belanja saya bisa berkurang?",
    a: "Poin akan berkurang hanya saat Anda menukarkannya dengan reward pilihan, seperti produk gratis atau voucher diskon.",
  },
  {
    q: "Mengapa tidak ada fitur pelacakan kurir?",
    a: "Na_store.id berfokus pada CRM, loyalitas poin, dan transparansi stok real-time. Fitur pelacakan kurir tidak tersedia agar sistem tetap ringkas.",
  },
  {
    q: "Bagaimana cara naik tier member?",
    a: "Tier naik otomatis seiring akumulasi poin: Regular (0–499), Silver (500–1.999), Gold (2.000–4.999), Platinum (5.000+).",
  },
  {
    q: "Apakah menukar poin akan menurunkan tier saya?",
    a: "Tidak. Tier dihitung berdasarkan akumulasi historis, bukan saldo aktif. Tukar poin kapan saja tanpa khawatir tier turun.",
  },
];

export default function UserDashboard() {
  const { isLoggedIn, userProfile, onLoginClick, setUserProfile, setCartCount, tierPersen } = useOutletContext();
  const { toasts, showToast, removeToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const points = isLoggedIn && userProfile ? (userProfile.points || 0) : 0;

  const handleAddToCart = (product) => {
    if (setCartCount) setCartCount(product);
    // Poin TIDAK ditambah saat add to cart.
    // Poin hanya ditambah saat admin mengubah status pesanan menjadi "Selesai".
    // Notifikasi ditangani oleh StickyToast di ProductCatalog — tidak perlu toast ganda.
  };

  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedProduct]);

  return (
    <div className="space-y-20 font-poppins animate-in fade-in duration-700 bg-[#F8F9FB] min-h-screen pb-20 relative overflow-hidden">

      {/* Ambient blur bg */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#9E4BDC]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#22285E]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 w-screen h-screen bg-[#22285E]/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-8 shadow-2xl relative border border-gray-100/50 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <FaTimes className="text-xs" />
            </button>
            <div className="w-full md:w-1/2 aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              {selectedProduct._img ? (
                <img src={selectedProduct._img} alt={selectedProduct.name} className="w-full h-full object-cover" />
              ) : (
                <FaBoxOpen className="text-5xl text-gray-300" />
              )}
            </div>
            <div className="flex-grow flex flex-col justify-between py-2">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-purple-50 text-[#9E4BDC] border border-[#9E4BDC]/10">
                  {selectedProduct.kategori}
                </span>
                <h3 className="text-xl font-black text-[#22285E] mt-4 leading-snug">{selectedProduct.name}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-xs" />)}
                  <span className="text-[10px] text-gray-400 font-semibold ml-2">25+ Ulasan</span>
                </div>
                <p className="text-2xl font-black text-[#9E4BDC] mt-4">Rp {selectedProduct.harga.toLocaleString("id")}</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-4">
                  Koleksi aksesoris premium buatan lokal dengan material berkualitas tinggi. Tahan lama, aman bagi kulit sensitif, dan dirancang untuk melengkapi penampilan estetik harian Anda.
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={(selectedProduct.stock ?? 0) === 0}
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  className={`flex-grow text-xs font-bold py-3 rounded-xl transition-all active:scale-95 cursor-pointer ${
                    (selectedProduct.stock ?? 0) === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] text-white shadow-md shadow-[#9E4BDC]/20"
                  }`}
                >
                  {(selectedProduct.stock ?? 0) === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. HERO ── */}
      <HeroSection />

      {/* ── 2. BENEFITS ── */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="text-center">
          <span className="bg-[#9E4BDC]/10 text-[#9E4BDC] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#9E4BDC]/10">
            Keunggulan Na_store.id
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-4">
            Kenapa Belanja di Sini?
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-md mx-auto leading-relaxed mt-3">
            Dari kualitas produk hingga layanan pelanggan, kami rancang pengalaman belanja yang memuaskan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaGem className="text-xl" />,
              title: "Kualitas Premium",
              highlight: "HANDMADE",
              items: ["Material titanium anti karat", "Kristal pilihan berkilau", "Pengerjaan detail presisi"],
              cta: "Lihat Koleksi",
              onClick: () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }),
            },
            {
              icon: <FaGift className="text-xl" />,
              title: "Poin Loyalitas",
              highlight: "REWARD KADO",
              items: ["Kumpul poin tiap belanja", "Tukar aksesoris gratis", "Raih milestone VIP"],
              cta: "Tukar Poin",
              onClick: () => document.getElementById("loyalty")?.scrollIntoView({ behavior: "smooth" }),
            },
            {
              icon: <FaHeadset className="text-xl" />,
              title: "Layanan Pelanggan",
              highlight: "FAST RESPONSE",
              items: ["Konsultasi panduan ukuran", "Respons di bawah 5 menit", "Bantuan transaksi ramah"],
              cta: "Hubungi CS",
              onClick: () => alert("Hubungi CS Na_store.id di WhatsApp: +62 812-3456-7890"),
            },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 flex flex-col justify-between items-center min-h-[360px] shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#9E4BDC]/30 group text-center">
              <div className="space-y-5 w-full flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#9E4BDC]/8 text-[#9E4BDC] flex items-center justify-center shrink-0 mx-auto group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[#22285E] tracking-wide mt-2">{card.title}</h3>
                </div>
                <div className="text-2xl font-black text-[#9E4BDC] tracking-tight">{card.highlight}</div>
                <ul className="text-xs text-gray-400 space-y-2 font-medium flex flex-col items-center">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9E4BDC] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={card.onClick}
                className="mt-6 bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] text-white font-bold text-xs px-8 py-3 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer w-full hover:opacity-95"
              >
                {card.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. ABOUT ── */}
      <section id="about" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="text-center mb-12">
          <span className="bg-[#9E4BDC]/10 text-[#9E4BDC] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#9E4BDC]/10">
            Tentang Na_store.id
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-4">
            Kisah di Balik Setiap Aksesoris
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-lg mx-auto leading-relaxed mt-3">
            Dari tangan pengrajin lokal, lahir koleksi yang merayakan kecantikan sehari-hari.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
          {/* Kiri: grid foto */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="aspect-square rounded-3xl overflow-hidden bg-[#9E4BDC]/8 border border-[#9E4BDC]/10 flex items-center justify-center p-6 group hover:border-[#9E4BDC]/30 transition-all">
                  <img src={imgKalungRosegold} alt="Kalung" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center p-6 group hover:border-[#9E4BDC]/30 transition-all">
                  <img src={imgCincinGold} alt="Cincin" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="aspect-square rounded-3xl overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center p-6 group hover:border-[#9E4BDC]/30 transition-all">
                  <img src={imgGelangCrystal} alt="Gelang" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center p-6 group hover:border-[#9E4BDC]/30 transition-all">
                  <img src={imgAntingHoop} alt="Anting" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                <FaStar className="text-yellow-400 text-sm" />
              </div>
              <div>
                <p className="text-xs font-black text-[#22285E]">4.9 / 5.0</p>
                <p className="text-[9px] text-gray-400 font-semibold">Rating Pelanggan</p>
              </div>
            </div>
          </div>
          {/* Kanan: narasi + timeline */}
          <div className="space-y-7">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-[#22285E] leading-snug">
                Aksesoris Handmade Lokal,<br />
                <span className="text-[#9E4BDC]">Kualitas Premium.</span>
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Na_store.id lahir dari kecintaan mendalam terhadap aksesori cantik yang terjangkau. Kami percaya setiap orang berhak tampil percaya diri tanpa harus merogoh kocek dalam-dalam.
              </p>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Setiap produk dibuat langsung oleh pengrajin lokal Indonesia dengan material pilihan — titanium anti karat, kristal berkilau, dan resin handmade — yang aman untuk kulit sensitif.
              </p>
            </div>
            <div className="space-y-4 relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-[#9E4BDC]/30 via-[#9E4BDC]/10 to-transparent" />
              {[
                { tahun: "2022", icon: <FaStore />, judul: "Na_store.id Berdiri", ket: "Mulai dengan 10 koleksi kalung handmade, dijual dari rumah." },
                { tahun: "2023", icon: <FaUsers />, judul: "1.000 Pelanggan", ket: "Produk berkembang ke 30+ koleksi, membuka sistem poin loyalitas." },
                { tahun: "2024", icon: <FaMedal />, judul: "Rating 4.9 Bintang", ket: "Dipercaya 2.500+ pelanggan di seluruh Indonesia." },
                { tahun: "2025", icon: <FaHeart />, judul: "50+ Koleksi Produk", ket: "Menghadirkan aksesoris rambut, tas, nail art, hingga tumblr aesthetic." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 pl-1">
                  <div className="w-9 h-9 rounded-full bg-[#9E4BDC]/10 border-2 border-white shadow-sm flex items-center justify-center text-[#9E4BDC] text-xs shrink-0 z-10">
                    {item.icon}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-extrabold text-[#9E4BDC] tracking-widest uppercase">{item.tahun}</span>
                      <span className="text-xs font-black text-[#22285E]">{item.judul}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{item.ket}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] text-white text-xs font-black px-7 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-[#9E4BDC]/20 hover:opacity-95"
            >
              Belanja Sekarang <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <FaUsers className="text-[#9E4BDC]" />, angka: "2.500+", label: "Pelanggan Puas", bg: "bg-[#9E4BDC]/5" },
            { icon: <FaStore className="text-[#00B5AD]" />, angka: "50+",    label: "Koleksi Produk", bg: "bg-[#00B5AD]/5" },
            { icon: <FaStar  className="text-yellow-400" />, angka: "4.9",   label: "Rating Rata-rata", bg: "bg-yellow-50" },
            { icon: <FaHeart className="text-rose-400" />,  angka: "100%",   label: "Handmade Lokal", bg: "bg-rose-50" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5 flex items-center gap-4 border border-white/60`}>
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-base shrink-0">{s.icon}</div>
              <div>
                <p className="text-lg font-black text-[#22285E]">{s.angka}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. PRODUCT CATALOG ── */}
      <ProductCatalog
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        tierPersen={tierPersen ?? 0}
        onLoginClick={onLoginClick}
        onAddToCart={handleAddToCart}
      />

      {/* ── 5. REWARD SHOWCASE ── */}
      <RewardShowcase
        isLoggedIn={isLoggedIn}
        currentPoints={points}
        onLoginClick={onLoginClick}
        onRedeem={async (reward) => {
          if (!isLoggedIn || !userProfile) return;

          if (!userProfile.id) {
            throw new Error("ID user tidak ditemukan. Coba logout dan login kembali.");
          }

          // ── Optimistic update: langsung update UI & localStorage ──────────
          const updated = {
            ...userProfile,
            points:       Math.max(0, (userProfile.points || 0) - reward.points),
            poinDitukar:  (userProfile.poinDitukar || 0) + reward.points,
          };
          setUserProfile(updated);
          localStorage.setItem("user", JSON.stringify(updated));

          // ── Sync ke Supabase (await — rollback jika gagal) ────────────────
          try {
            await userAPI.kurangiPoinCustomer(userProfile.id, reward.points);
            console.log("[Reward] Poin berhasil disync ke Supabase.");
          } catch (err) {
            // Rollback optimistic update jika Supabase gagal
            setUserProfile(userProfile);
            localStorage.setItem("user", JSON.stringify(userProfile));
            throw err; // lempar ke RewardShowcase agar toast error muncul
          }
        }}
      />

      {/* ── 6. TESTIMONIALS ── */}
      <section className="space-y-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="bg-[#00B5AD]/10 text-[#00B5AD] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#00B5AD]/10">
            Ulasan Pelanggan
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-4">
            Apa Kata Mereka
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-3">Testimoni nyata dari pelanggan setia Na_store.id</p>
        </div>
        {(() => {
          const REVIEWS = [
            { nama: "Vina Anggraini",     inisial: "V", barang: "Cincin Couple Silver",     teks: "Cincin couple peraknya sangat bagus dan pas di jari. Detail pengerjaan rapi, tidak pudar walaupun sering terkena air.", rating: 5 },
            { nama: "Fatimah Novitasari", inisial: "F", barang: "Kalung Titanium Rosegold", teks: "Saya tukarkan poin dengan scrunchie satin premium. Warnanya cantik dan bahannya lembut. Kualitas jauh melebihi ekspektasi!", rating: 5 },
            { nama: "Olivia Felicia",     inisial: "O", barang: "Gelang Bead Crystal",      teks: "Gelang bead-nya sangat estetik! CS ramah, membantu merekomendasikan ukuran yang pas. Sangat puas belanja di sini.", rating: 5 },
            { nama: "Sherly Aulia",       inisial: "S", barang: "Anting Tassel Bohemian",   teks: "Anting tasselnya ringan banget meski terlihat besar. Banyak compliment dari teman. Packagingnya juga cantik!", rating: 5 },
            { nama: "Dewi Lestari",       inisial: "D", barang: "Gelang Crystal Aesthetic", teks: "Kilap kristalnya cantik di cahaya matahari. Sudah beli 3 warna dan berencana koleksi semua. Harga sangat terjangkau!", rating: 5 },
            { nama: "Anisa Rahmawati",    inisial: "A", barang: "Kalung Bintang Perak",     teks: "Detail kalungnya bagus sekali. Datang dalam kotak kado cantik, langsung hadiahkan ke adik. Dia sangat suka!", rating: 5 },
            { nama: "Putri Maharani",     inisial: "P", barang: "Cincin Resin Bunga",       teks: "Cincin resinnya unik! Setiap cincin beda karena handmade. Pengrajinnya sangat teliti dan hasilnya halus.", rating: 5 },
          ];
          const track = [...REVIEWS, ...REVIEWS];
          const cardW = 300, gap = 20;
          const totalW = REVIEWS.length * (cardW + gap);
          return (
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#F8F9FB] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#F8F9FB] to-transparent z-10 pointer-events-none" />
              <motion.div
                className="flex"
                style={{ gap: `${gap}px`, width: "max-content" }}
                animate={{ x: [`0px`, `-${totalW}px`] }}
                transition={{ duration: 38, ease: "linear", repeat: Infinity }}
              >
                {track.map((t, i) => (
                  <div key={i} style={{ width: `${cardW}px` }} className="shrink-0 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <FaQuoteLeft className="absolute text-3xl text-gray-100 opacity-60" />
                    <div className="space-y-3">
                      <div className="flex gap-0.5">{[...Array(t.rating)].map((_, idx) => <FaStar key={idx} className="text-yellow-400 text-xs" />)}</div>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-4">{t.teks}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#9E4BDC]/10 flex items-center justify-center text-xs font-black text-[#9E4BDC] shrink-0">{t.inisial}</div>
                      <div>
                        <p className="text-xs font-bold text-[#22285E]">{t.nama}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">Membeli {t.barang}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          );
        })()}
      </section>

      {/* ── 7. FAQ ── */}
      <section id="faq" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="bg-indigo-50 text-indigo-600 text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-indigo-100">
            Pertanyaan Umum
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-md mx-auto leading-relaxed mt-3">
            Jawaban atas pertanyaan yang paling sering ditanyakan seputar produk, poin, dan keanggotaan Na_store.id.
          </p>
        </div>

        {/* FAQ accordion — 1 kolom penuh */}
        <div className="max-w-3xl mx-auto space-y-3 mb-10">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#9E4BDC]/30 shadow-md shadow-[#9E4BDC]/6 bg-white"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className={`text-sm font-bold leading-snug flex-1 transition-colors ${isOpen ? "text-[#9E4BDC]" : "text-[#22285E]"}`}>
                    {item.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen ? "bg-[#9E4BDC] text-white rotate-180" : "bg-gray-100 text-gray-400"
                  }`}>
                    <FaChevronDown className="text-[9px]" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 border-t border-gray-50">
                        <p className="text-xs text-gray-500 font-medium leading-relaxed pt-4">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA bawah FAQ */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#9E4BDC]/5 to-indigo-50/60 rounded-3xl border border-[#9E4BDC]/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <p className="text-sm font-black text-[#22285E]">Masih ada pertanyaan lain?</p>
            <p className="text-xs text-gray-400 font-medium">Tim CS kami siap membantu Anda kapan saja melalui WhatsApp.</p>
          </div>
          <button
            type="button"
            onClick={() => alert("Hubungi CS Na_store.id di WhatsApp: +62 812-3456-7890")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] text-white text-xs font-black px-7 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-[#9E4BDC]/20 hover:opacity-95 shrink-0"
          >
            <FaHeadset className="text-sm" /> Hubungi CS Kami
          </button>
        </div>
      </section>

      {/* ── 8. MAPS & LOKASI ── */}
      <section id="lokasi" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="bg-rose-50 text-rose-500 text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-rose-100">
            Kunjungi Kami
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-4">
            Temukan Toko Na_store.id
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-md mx-auto leading-relaxed mt-3">
            Kunjungi toko kami langsung atau hubungi via WhatsApp untuk konsultasi produk dan pesanan custom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Peta — 3 kolom */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-gray-100 shadow-sm min-h-[360px]">
            <iframe
              title="Lokasi Na_store.id"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2356!2d101.5957912!3d0.6648541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d44f18a06263e3%3A0x1ebb3c5824ccb432!2sOnline%20Shop%20Store.id_prw%20N%26A!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "360px", display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info toko — 2 kolom */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Card info utama */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#9E4BDC]/10 flex items-center justify-center shrink-0">
                  <FaStore className="text-[#9E4BDC] text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#22285E]">Na_store.id</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Online Shop Aksesoris</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-rose-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#22285E]">Alamat</p>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
                      Perawang, Kabupaten Siak,<br />Riau, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FaWhatsapp className="text-emerald-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#22285E]">WhatsApp</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FaClock className="text-amber-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#22285E]">Jam Operasional</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Senin – Sabtu: 08.00 – 21.00</p>
                    <p className="text-xs text-gray-500 font-medium">Minggu: 09.00 – 18.00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://www.google.com/maps/place/Online+Shop+Store.id_prw+N%26A/@0.6648935,101.595775,16z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-[#9E4BDC]/30 hover:shadow-md text-[#22285E] text-xs font-bold px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer"
              >
                <FaMapMarkerAlt className="text-rose-500 text-sm" />
                Buka Maps
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <FaWhatsapp className="text-sm" />
                Chat WA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. NEWSLETTER ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#1B1A45] via-[#2F1F5E] to-[#20153D] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden border border-white/5 shadow-xl shadow-purple-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9E4BDC]/15 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Teks */}
            <div className="space-y-3 text-center lg:text-left max-w-md">
              <span className="bg-white/10 text-white text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-md border border-white/10">
                Buletin Na_store.id
              </span>
              <h3 className="text-2xl font-black text-white leading-snug mt-4">
                Jangan Ketinggalan<br />
                <span className="text-[#C084FC]">Penawaran Terbaru</span>
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Dapatkan notifikasi restok produk favorit, diskon eksklusif, dan koleksi baru langsung di inbox Anda.
              </p>
            </div>
            {/* Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); showToast({ type: "success", title: "Berhasil!", message: "Kamu berhasil berlangganan buletin Na_store.id." }); }}
              className="w-full lg:max-w-sm space-y-3"
            >
              <input
                type="email"
                required
                placeholder="Masukkan alamat email Anda"
                className="w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-white hover:bg-purple-50 text-[#22285E] text-sm font-black py-3.5 rounded-2xl transition-all hover:scale-[1.01] shadow-lg cursor-pointer"
              >
                Berlangganan Sekarang
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}