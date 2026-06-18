import { useState, useEffect } from "react";
import {
  FaShoppingBag, FaStar, FaBoxOpen, FaGift, FaTruck, FaGem, FaHeadset,
  FaCheckCircle, FaArrowRight, FaQuoteLeft, FaInfoCircle, FaChevronRight, FaTimes
} from "react-icons/fa";

import Card         from "../components/Card";
import Badge        from "../components/Badge";
import inventoryData from "../data/inventory.json";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/* ─── Import gambar produk ─── */
import imgKalungRosegold  from "../assets/gambarproduk/kalungrosegold.png";
import imgKalungChoker    from "../assets/gambarproduk/kalungchoker.png";
import imgKalungBintang   from "../assets/gambarproduk/kalungbintang.png";
import imgKalungPearl     from "../assets/gambarproduk/kalungpearl.png";
import imgGelangCrystal   from "../assets/gambarproduk/gelangcrystal.png";
import imgGelangPerak     from "../assets/gambarproduk/gelangperak.png";
import imgGelangBead      from "../assets/gambarproduk/gelangbead.png";
import imgGelangTali      from "../assets/gambarproduk/gelangtali.png";
import imgCincinCouple    from "../assets/gambarproduk/cincincouple.png";
import imgCincinGold      from "../assets/gambarproduk/cincingold.png";
import imgCincinResin     from "../assets/gambarproduk/cincinresin.png";
import imgAntingHoop      from "../assets/gambarproduk/antinghoop.png";
import imgAntingTassel    from "../assets/gambarproduk/antingtassel.png";
import imgAntingPearl     from "../assets/gambarproduk/antingpearl.png";
import imgAntingBintang   from "../assets/gambarproduk/antingbintang.png";
import imgNailFlower      from "../assets/gambarproduk/pressonnailflower.png";
import imgNailGlitter     from "../assets/gambarproduk/pressonnailglitter.png";
import imgNailFrench      from "../assets/gambarproduk/pressonnailfrenchtip.png";
import imgNailOmbre       from "../assets/gambarproduk/pressonnailombre.png";
import imgTumblrPastel    from "../assets/gambarproduk/tmblrpastel.png";
import imgTumblrFlower    from "../assets/gambarproduk/tumblrflower.png";
import imgTumblrGlass     from "../assets/gambarproduk/tumblrglass.png";
import imgClawClip        from "../assets/gambarproduk/clawclip.png";
import imgJepitButterfly  from "../assets/gambarproduk/jepitrambutbutterfly.png";
import imgBandoPearl      from "../assets/gambarproduk/bandopearl.png";
import imgScrunchie       from "../assets/gambarproduk/scrunchie.png";
import imgTasMini         from "../assets/gambarproduk/tasminiselempang.png";
import imgTasRajut        from "../assets/gambarproduk/tasrajut.png";
import imgTasKoin         from "../assets/gambarproduk/taskoin.png";
import imgKacamata        from "../assets/gambarproduk/framekacamata.png";
import imgMasker          from "../assets/gambarproduk/maskerlucu.png";
import imgStiker          from "../assets/gambarproduk/stiker.png";
import imgGanci           from "../assets/gambarproduk/gancisanrio.png";
import imgIkatPinggang    from "../assets/gambarproduk/ikapinggang.png";

const gambarMap = {
  "kalungrosegold.png": imgKalungRosegold,     "kalungchoker.png": imgKalungChoker,
  "kalungbintang.png": imgKalungBintang,       "kalungpearl.png": imgKalungPearl,
  "gelangcrystal.png": imgGelangCrystal,       "gelangperak.png": imgGelangPerak,
  "gelangbead.png": imgGelangBead,             "gelangtali.png": imgGelangTali,
  "cincincouple.png": imgCincinCouple,         "cincingold.png": imgCincinGold,
  "cincinresin.png": imgCincinResin,           "antinghoop.png": imgAntingHoop,
  "antingtassel.png": imgAntingTassel,         "antingpearl.png": imgAntingPearl,
  "antingbintang.png": imgAntingBintang,       "pressonnailflower.png": imgNailFlower,
  "pressonnailglitter.png": imgNailGlitter,    "pressonnailfrenchtip.png": imgNailFrench,
  "pressonnailombre.png": imgNailOmbre,        "tmblrpastel.png": imgTumblrPastel,
  "tumblrflower.png": imgTumblrFlower,         "tumblrglass.png": imgTumblrGlass,
  "clawclip.png": imgClawClip,                 "jepitrambutbutterfly.png": imgJepitButterfly,
  "bandopearl.png": imgBandoPearl,             "scrunchie.png": imgScrunchie,
  "tasminiselempang.png": imgTasMini,          "tasrajut.png": imgTasRajut,
  "taskoin.png": imgTasKoin,                   "framekacamata.png": imgKacamata,
  "maskerlucu.png": imgMasker,                 "stiker.png": imgStiker,
  "gancisanrio.png": imgGanci,                 "ikapinggang.png": imgIkatPinggang,
};

const getImg = (path) => {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  return gambarMap[path.split("/").pop()] ?? null;
};

export default function UserDashboard() {
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = inventoryData.filter(
    (p) => kategoriFilter === "Semua" || p.kategori.toLowerCase() === kategoriFilter.toLowerCase()
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user ? `${user.namaDepan} ${user.namaBelakang}` : "Pelanggan";

  const handleAddToCart = (productName) => {
    setCartMessage(`"${productName}" berhasil ditambahkan ke keranjang belanja.`);
    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  useEffect(() => {
    if (pointsModalOpen || selectedProduct) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [pointsModalOpen, selectedProduct]);

  return (
    <div className="space-y-16 font-poppins animate-in fade-in duration-700 bg-[#F8F9FB] min-h-screen pb-16 relative overflow-hidden">
      
      {/* Dynamic Ambient Blur Background Elements */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#9E4BDC]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#22285E]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Dynamic Cart Status Toast */}
      {cartMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-gradient-to-r from-[#00B5AD] to-[#3acbc5] text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-xl shadow-[#00B5AD]/25 flex items-center gap-3 border border-white/20 animate-in slide-in-from-bottom-5 duration-300">
          <FaCheckCircle className="text-sm shrink-0" />
          <span>{cartMessage}</span>
        </div>
      )}

      {/* Points Redemption Modal */}
      {pointsModalOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-[#22285E]/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative border border-gray-100/50 animate-in zoom-in-95 duration-200 text-left">
            <button 
              onClick={() => setPointsModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <FaTimes className="text-xs" />
            </button>
            <h3 className="text-lg font-black text-[#22285E] flex items-center gap-2">
              <FaGift className="text-[#9E4BDC]" /> Tukar Poin Loyalitas
            </h3>
            <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed font-medium">
              Pilih hadiah eksklusif berikut sesuai jumlah poin Anda. Poin Anda saat ini: <span className="font-extrabold text-[#9E4BDC]">3.250 Poin</span>.
            </p>
            
            <div className="mt-6 space-y-4">
              {[
                { nama: "Scrunchie Satin Premium", poin: 150, desc: "Aksesoris rambut satin dengan pilihan warna pastel." },
                { nama: "Dompet Koin Lucu", poin: 350, desc: "Dompet kecil bahan kanvas untuk koin dan kartu." },
                { nama: "Cincin Bunga Resin", poin: 500, desc: "Cincin estetik handmade dengan dekorasi kelopak bunga." },
                { nama: "Kalung Pearl Minimalist", poin: 1000, desc: "Kalung rantai tipis dengan liontin mutiara sintetis premium." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#F8F9FA] hover:bg-white hover:border-[#9E4BDC]/30 hover:shadow-md transition-all duration-300">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-bold text-[#22285E] truncate">{item.nama}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
                    <p className="text-[10px] text-[#00B5AD] font-bold mt-1.5 flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-[9px]" /> {item.poin} Poin
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Selamat! Anda berhasil menukarkan ${item.poin} poin untuk "${item.nama}". Hadiah akan dikirimkan bersama pesanan Anda berikutnya.`);
                      setPointsModalOpen(false);
                    }}
                    className="bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white text-[10px] font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0 shadow-md shadow-[#9E4BDC]/10"
                  >
                    Tukarkan
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setPointsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-[#71717A] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 w-screen h-screen bg-[#22285E]/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-8 shadow-2xl relative border border-gray-100/50 animate-in zoom-in-95 duration-200 text-left flex flex-col md:flex-row gap-8">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <FaTimes className="text-xs" />
            </button>

            {/* Product Image */}
            <div className="w-full md:w-1/2 aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center relative group">
              {getImg(selectedProduct.gambar) ? (
                <img
                  src={getImg(selectedProduct.gambar)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <FaBoxOpen className="text-5xl text-gray-300" />
              )}
            </div>

            {/* Product Info */}
            <div className="flex-grow flex flex-col justify-between py-2">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-purple-50 text-[#9E4BDC] border border-[#9E4BDC]/10">
                  {selectedProduct.kategori}
                </span>
                <h3 className="text-xl font-black text-[#22285E] mt-4 leading-snug">
                  {selectedProduct.name}
                </h3>
                
                <div className="flex items-center gap-1 mt-2.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-[10px] text-gray-400 font-semibold ml-2">(25+ Ulasan Pelanggan)</span>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-gray-400 line-through leading-none">Rp {(selectedProduct.harga * 1.25).toLocaleString('id')}</p>
                  <p className="text-2xl font-black text-[#9E4BDC] mt-1">Rp {selectedProduct.harga.toLocaleString('id')}</p>
                </div>

                <div className="mt-5 space-y-2 text-xs text-[#71717A]">
                  <p className="flex items-center gap-2">
                    <span className="font-bold text-[#22285E] w-20">Stok Status:</span>
                    <Badge 
                      variant="solid"
                      status={
                        (selectedProduct.stock ?? selectedProduct.stok) === 0 
                          ? "Habis" 
                          : (selectedProduct.stock ?? selectedProduct.stok) < 10 
                            ? "Hampir Habis" 
                            : "Aman"
                      } 
                    />
                  </p>
                  <p className="flex items-center gap-2"><span className="font-bold text-[#22285E] w-20">Total Stok:</span> <span className="font-bold text-[#22285E]">{selectedProduct.stock ?? selectedProduct.stok} unit</span></p>
                  <p className="leading-relaxed text-gray-400 mt-3 border-t border-gray-50 pt-3">
                    Koleksi aksesoris premium buatan lokal dengan material berkualitas tinggi. Tahan lama, aman bagi kulit sensitif (hipoalergenik), dan dirancang presisi untuk melengkapi penampilan estetik harian Anda.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(selectedProduct.name);
                    setSelectedProduct(null);
                  }}
                  className="flex-grow bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] hover:opacity-95 text-white text-xs font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-[#9E4BDC]/20 text-center cursor-pointer font-bold"
                >
                  Tambah ke Keranjang
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-50 hover:bg-gray-100 text-[#71717A] text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full bg-gradient-to-r from-[#1B1A45] via-[#2F1F5E] to-[#45277E] text-white overflow-hidden text-left pt-16 pb-32 md:pt-20 md:pb-36 lg:py-24 lg:min-h-[calc(100vh-4rem)] lg:flex lg:items-center">
        {/* Glow behind hero */}
        <div className="absolute top-1/2 left-1/2 w-4/5 h-4/5 bg-gradient-to-r from-[#9E4BDC]/10 to-[#22285E]/5 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        {/* Inner ambient blurs */}
        <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-[#9E4BDC]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] bg-[#00B5AD]/15 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Col: Headings */}
          <div className="lg:col-span-7 space-y-5 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-lg border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B5AD] animate-pulse"></span>
              Koleksi Aksesoris Premium 2026
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Sempurnakan Gaya Anda dengan <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200">Sentuhan Estetik</span>
            </h1>
            <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed max-w-xl">
              Temukan keindahan aksesoris buatan tangan terbaik mulai dari cincin couple perak murni, gelang kristal berkilau, kalung titanium rosegold, hingga press-on nail art custom yang memukau. Didesain khusus untuk mengekspresikan karakter unik Anda.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById("catalog").scrollIntoView({ behavior: "smooth" })}
                className="bg-white hover:bg-yellow-400 text-[#22285E] transition-all duration-300 px-8 py-4 rounded-xl text-xs font-black shadow-lg hover:shadow-yellow-400/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Belanja Sekarang
              </button>
              <button
                onClick={() => document.getElementById("loyalty").scrollIntoView({ behavior: "smooth" })}
                className="bg-white/10 hover:bg-white/25 border border-white/15 text-white transition-all duration-300 px-8 py-4 rounded-xl text-xs font-black hover:scale-[1.02] active:scale-[0.98] cursor-pointer backdrop-blur-sm"
              >
                Cek Keuntungan Member
              </button>
            </div>
          </div>

          {/* Right Col: Overlapping Floating Cards Showcase */}
          <div className="lg:col-span-5 relative h-[380px] hidden lg:flex items-center justify-center animate-fade-in-right">
            {/* Back Card (Left) */}
            <div className="absolute left-[5%] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 w-[200px] shadow-2xl opacity-60 pointer-events-none animate-float-left">
              <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden mb-3">
                <img src={gambarMap["gelangcrystal.png"]} alt="Gelang Crystal" className="w-full h-full object-cover" />
              </div>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">Gelang</p>
              <p className="text-xs font-bold text-white truncate">Gelang Crystal Aesthetic</p>
            </div>

            {/* Back Card (Right) */}
            <div className="absolute right-[5%] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 w-[200px] shadow-2xl opacity-60 pointer-events-none animate-float-right">
              <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden mb-3">
                <img src={gambarMap["cincingold.png"]} alt="Cincin Gold" className="w-full h-full object-cover" />
              </div>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">Cincin</p>
              <p className="text-xs font-bold text-white truncate">Cincin Adjustable Gold</p>
            </div>

            {/* Front Card (Center) */}
            <div className="absolute z-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-5 w-[240px] shadow-2xl group hover:-translate-y-4 hover:rotate-1 transition-all duration-500 cursor-pointer animate-float-center" onClick={() => document.getElementById("catalog").scrollIntoView({ behavior: "smooth" })}>
              <div className="absolute top-4 right-4 bg-[#00B5AD] text-white text-[8px] font-black px-2 py-0.5 rounded-md">
                BEST SELLER
              </div>
              <div className="aspect-square bg-white/10 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={gambarMap["kalungrosegold.png"]}
                  alt="Featured Kalung"
                  className="w-4/5 h-4/5 object-cover drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">Aksesoris Kalung</p>
                <p className="text-xs font-bold text-white">Kalung Titanium Rosegold</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-[9px]" />
                    ))}
                  </div>
                  <span className="text-[9px] text-white/70 font-semibold">(58 Ulasan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-px pointer-events-none">
          <svg className="relative block w-full h-[40px] md:h-[60px] lg:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,0 C150,90 350,120 600,100 C850,80 1050,90 1200,60 L1200,120 L0,120 Z" className="text-[#F8F9FB]"></path>
          </svg>
        </div>
      </section>

      {/* ─── BENEFITS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { title: "Pengiriman Cepat", desc: "Gratis ongkos kirim ke seluruh Indonesia dengan belanja minimal Rp50.000.", icon: FaTruck, color: "text-[#9E4BDC] bg-purple-50 hover:bg-[#9E4BDC]/5 hover:border-[#9E4BDC]/20 border-gray-100" },
            { title: "Kualitas Premium", desc: "Terbuat dari bahan titanium anti karat, kristal terpilih, dan pengerjaan handmade detail.", icon: FaGem, color: "text-[#00B5AD] bg-teal-50 hover:bg-[#00B5AD]/5 hover:border-[#00B5AD]/20 border-gray-100" },
            { title: "Layanan CS Prioritas", desc: "Bantuan prioritas chat untuk menjawab pertanyaan dan panduan ukuran di bawah 5 menit.", icon: FaHeadset, color: "text-[#F24E1E] bg-orange-50 hover:bg-[#F24E1E]/5 hover:border-[#F24E1E]/20 border-gray-100" },
            { title: "Hadiah Loyalitas", desc: "Tukarkan akumulasi poin belanja dengan aneka produk aksesoris cantik gratis.", icon: FaGift, color: "text-blue-600 bg-blue-50 hover:bg-blue-50/5 hover:border-blue-600/20 border-gray-100" }
          ].map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border transition-all duration-300 flex flex-col justify-between ${benefit.color}`}>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg shrink-0">
                    <Icon />
                  </div>
                  <h4 className="text-sm font-bold text-[#22285E]">{benefit.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── LOYALTY CARD SECTION ─── */}
      <section id="loyalty" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm text-left overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-purple-100/50 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Info details */}
            <div className="max-w-xl space-y-4">
              <span className="inline-block mb-2 md:mb-3 bg-[#9E4BDC]/10 text-[#9E4BDC] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#9E4BDC]/10">
                Program Poin Na_store.id
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight">
                Akumulasi Poin & Tukarkan Rewards Menarik
              </h2>
              <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                Setiap transaksi belanja sebesar Rp1.000 akan otomatis menghasilkan 1 Poin loyalitas. Kumpulkan terus poin Anda dan dapatkan bonus hadiah pouch beludru, gelang charm, hingga kalung perak gratis.
              </p>

              <div className="pt-4 flex flex-wrap gap-6 items-center">
                <div className="flex -space-x-3">
                  {["bg-[#9E4BDC] text-white", "bg-[#22285E] text-white", "bg-[#95D5B6] text-[#22285E]", "bg-yellow-400 text-purple-950"].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black ${color}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-bold">Daftar bersama 30+ Member Aktif lainnya</span>
              </div>
            </div>

            {/* Virtual Membership Card & Progress */}
            <div className="w-full lg:w-[460px] space-y-6 shrink-0">
              {/* Card Container */}
              <div className="bg-gradient-to-br from-[#1E1B4B] via-[#2F1F5E] to-[#141235] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-48 border border-white/5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-white/50 font-extrabold">Na_store.id</p>
                    <p className="text-xs font-black tracking-wide text-yellow-300">Gold VIP Member</p>
                  </div>
                  <FaGem className="text-yellow-400 text-lg" />
                </div>
                
                {/* Simulated Card Code & Name */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold tracking-[0.25em] text-white/80 font-mono">•••• •••• •••• 3250</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] text-white/40 font-bold uppercase tracking-wider">Nama Anggota</p>
                      <p className="text-xs font-black truncate max-w-[200px]">{displayName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-white/40 font-bold uppercase tracking-wider">Sisa Poin</p>
                      <p className="text-sm font-black text-yellow-300">3.250 PTS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar and trigger */}
              <div className="space-y-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">Progress Milestone</span>
                  <span className="text-[#9E4BDC] font-extrabold">Sisa 1.750 Poin ke Platinum</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#9E4BDC] to-[#22285E] rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-400 font-semibold">Tingkat Penukaran Poin: 65%</p>
                  <button 
                    type="button"
                    onClick={() => setPointsModalOpen(true)}
                    className="bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white transition-all duration-300 py-2.5 px-5 rounded-xl text-xs font-black shadow-md shadow-[#9E4BDC]/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaGift /> Tukar Rewards
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── SPECIAL PROMOS GRID ─── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Beli 2 Gratis 1 Gelang", desc: "Berlaku otomatis untuk semua pembelian gelang manik dan tali.", badge: "PROMO BULAN INI", bg: "from-[#F24E1E] to-[#FF8E6E]", shadow: "shadow-[#F24E1E]/10" },
            { title: "Potongan Harga Rp25.000", desc: "Gunakan 200 poin belanja Anda untuk klaim kupon diskon langsung.", badge: "KUPON REWARD", bg: "from-[#00B5AD] to-[#6EE7B7]", shadow: "shadow-[#00B5AD]/10" },
            { title: "Free Gift Boks Beludru", desc: "Dapatkan boks kado eksklusif beludru untuk pembelian kalung/cincin.", badge: "HADIAH KHUSUS", bg: "from-[#22285E] to-[#4054B2]", shadow: "shadow-[#22285E]/10" }
          ].map((promo, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${promo.bg} text-white rounded-[2rem] p-6 shadow-lg ${promo.shadow} flex flex-col justify-between h-44 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer border border-white/5 relative overflow-hidden`}>
              {/* Accent light on card */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="bg-white/20 text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {promo.badge}
                </span>
                <h3 className="text-base font-black mt-4 leading-tight group-hover:text-yellow-200 transition-colors">{promo.title}</h3>
                <p className="text-[11px] text-white/80 mt-1.5 leading-snug font-semibold">{promo.desc}</p>
              </div>
              <span className="text-[10px] font-bold text-white/95 hover:underline mt-2 self-start flex items-center gap-1 font-bold">
                Klaim Sekarang <FaChevronRight className="text-[8px]" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS CATALOG SECTION ─── */}
      <section id="catalog" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="space-y-8 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 gap-4">
            <div>
              <span className="bg-[#00B5AD]/10 text-[#00B5AD] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#00B5AD]/10">
                Katalog Produk
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-2">
                Koleksi Aksesoris Terlaris
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1">Sempurnakan penampilan Anda dengan aksesoris perhiasan berkualitas terbaik</p>
            </div>
          </div>

          {/* Filter Categories Pill Grid */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-hide">
            {["Semua", "Kalung", "Gelang", "Cincin", "Anting", "Nail Art"].map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => { setKategoriFilter(kat); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer border ${
                  kategoriFilter === kat
                    ? "bg-[#9E4BDC] text-white border-[#9E4BDC] shadow-lg shadow-[#9E4BDC]/20"
                    : "bg-white text-gray-400 hover:text-[#22285E] border-gray-200/60 hover:bg-gray-50"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          {/* Catalog Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((product) => {
                const imgSrc = getImg(product.gambar);
                const isLowStock = (product.stock ?? product.stok) > 0 && (product.stock ?? product.stok) < 10;
                const isOutOfStock = (product.stock ?? product.stok) === 0;

                return (
                  <div 
                    key={product.id} 
                    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden relative text-left"
                  >
                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/95 text-[#22285E] px-2.5 py-1 rounded-md shadow-sm border border-gray-100/60">
                        {product.kategori}
                      </span>
                      <Badge 
                        variant="solid"
                        status={
                          isOutOfStock 
                            ? "Stok Habis" 
                            : isLowStock 
                              ? `Sisa ${product.stock ?? product.stok}` 
                              : `Stok: ${product.stock ?? product.stok}`
                        } 
                      />
                    </div>

                    {/* Image Area with Zoom & Quick View */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="aspect-square bg-gray-50/50 border-b border-gray-50 overflow-hidden relative cursor-pointer group"
                    >
                      {imgSrc ? (
                        <img 
                          src={imgSrc} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FaBoxOpen className="text-3xl" />
                        </div>
                      )}
                      
                      {/* Interactive View Details Overlay */}
                      <div className="absolute inset-0 bg-[#22285E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white text-[#22285E] text-[10px] font-black px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          Lihat Detail
                        </span>
                      </div>
                    </div>

                    {/* Product Card Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 
                          onClick={() => setSelectedProduct(product)}
                          className="text-xs font-bold text-[#22285E] line-clamp-2 leading-snug min-h-[2.5rem] hover:text-[#9E4BDC] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`text-[9px] ${i < 4 ? 'text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                          <span className="text-[9px] text-gray-400 ml-1.5 font-bold">(18 Ulasan)</span>
                        </div>
                      </div>

                      {/* Price Grid & Add to Cart button */}
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 line-through leading-none">Rp {(product.harga * 1.25).toLocaleString('id')}</p>
                          <p className="text-sm font-extrabold text-[#9E4BDC] mt-1">Rp {product.harga.toLocaleString('id')}</p>
                        </div>
                        <button 
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(product.name)}
                          className="w-9 h-9 bg-[#9E4BDC] hover:bg-[#8e3ec7] disabled:bg-gray-100 text-white rounded-full flex items-center justify-center shadow-md shadow-[#9E4BDC]/10 active:scale-90 hover:scale-105 transition-all cursor-pointer font-bold disabled:cursor-not-allowed shrink-0"
                          title="Beli"
                        >
                          <FaShoppingBag className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10">
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

        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 text-left space-y-8">
        <div className="text-center space-y-2">
          <span className="bg-[#00B5AD]/10 text-[#00B5AD] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#00B5AD]/10">
            Ulasan Pelanggan
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight">
            Apa Kata Mereka Tentang Kami
          </h2>
          <p className="text-xs text-gray-400 font-medium">Testimoni nyata dari pelanggan setia produk aksesoris Na_store.id</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { nama: "Vina Anggraini", barang: "Cincin Couple Silver", teks: "Cincin couple peraknya sangat bagus dan pas sekali di jari saya dan pasangan! Detail pengerjaan rapi dan tidak pudar warnanya walaupun sering terkena air saat cuci tangan.", rating: 5 },
            { nama: "Fatimah Novitasari", barang: "Kalung Titanium Rosegold", teks: "Kemarin saya menukarkan poin loyalitas saya dengan ikat rambut satin premium. Pengiriman bonusnya cepat digabung dengan orderan kalung rosegold saya. Kalungnya cantik sekali berkilau.", rating: 5 },
            { nama: "Olivia Felicia", barang: "Gelang Bead Crystal", teks: "Aksesoris gelang bead-nya sangat estetik! Pelayanan chat admin ramah, membantu merekomendasikan ukuran pergelangan tangan yang pas. Sangat puas belanja di sini.", rating: 5 }
          ].map((testi, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-6 right-6 text-gray-100">
                <FaQuoteLeft className="text-4xl" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex gap-0.5">
                  {[...Array(testi.rating)].map((_, idx) => (
                    <FaStar key={idx} className="text-yellow-400 text-xs" />
                  ))}
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                  {testi.teks}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#9E4BDC]/10 flex items-center justify-center text-xs font-black text-[#9E4BDC]">
                  {testi.nama.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#22285E]">{testi.nama}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Membeli {testi.barang}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ORDERS & NEWSLETTER SECTION ─── */}
      <section id="orders" className="max-w-7xl mx-auto px-6 scroll-mt-24 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Col: Order Tracker */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <Card title="Riwayat Belanja Saya" subtitle="Pantau status transaksi pemesanan perhiasan Anda">
            <div className="divide-y divide-gray-100">
              {[
                { id: "ORD-102", name: "Kalung Titanium Choker & Cincin Resin", qty: 2, price: 120000, date: "18 Juni 2026", status: "Selesai", points: 120, image: "kalungchoker.png" },
                { id: "ORD-095", name: "Gelang Bead Crystal Premium", qty: 1, price: 85000, date: "15 Juni 2026", status: "Selesai", points: 85, image: "gelangcrystal.png" },
                { id: "ORD-089", name: "Anting Hoop Pearl & Jepit Butterfly", qty: 3, price: 155000, date: "10 Juni 2026", status: "Selesai", points: 155, image: "antingpearl.png" }
              ].map((order, idx) => {
                const orderImg = getImg(order.image);
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {orderImg ? (
                          <img src={orderImg} alt={order.name} className="w-full h-full object-cover" />
                        ) : (
                          <FaShoppingBag className="text-[#9E4BDC] text-sm" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#22285E] leading-snug">{order.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">{order.id} • {order.qty} barang • {order.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                      <div>
                        <p className="text-xs font-bold text-[#22285E]">Rp {order.price.toLocaleString('id')}</p>
                        <p className="text-[9px] text-[#00B5AD] font-bold flex items-center sm:justify-end gap-0.5 mt-0.5">
                          <FaStar className="text-yellow-400 text-[8px]" />+{order.points} Poin
                        </p>
                      </div>
                      <Badge status={order.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Newsletter Subscription Banner */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#1B1A45] via-[#2F1F5E] to-[#20153D] rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden border border-white/5 shadow-lg shadow-purple-900/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
          <div className="space-y-4">
            <span className="bg-white/10 text-white text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-md border border-white/10">
              Update Buletin
            </span>
            <h4 className="text-lg font-black text-white">Info Restok & Penawaran Baru</h4>
            <p className="text-xs text-white/80 leading-relaxed font-semibold">
              Langganan sekarang untuk mendapatkan informasi produk aksesoris estetik terbaru serta voucher diskon awal rilis.
            </p>
          </div>
          <form 
            onSubmit={(e) => { e.preventDefault(); alert("Pendaftaran newsletter berhasil!"); }} 
            className="mt-8 space-y-3"
          >
            <input
              type="email"
              required
              placeholder="Masukkan alamat email Anda"
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
            <button
              type="submit"
              className="w-full bg-white hover:bg-yellow-400 text-[#22285E] text-xs font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] shadow-lg shadow-white/5 cursor-pointer"
            >
              Berlangganan Sekarang
            </button>
          </form>
        </div>

      </section>

    </div>
  );
}
