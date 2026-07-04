import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoNastore from "../../assets/gambarproduk/logonastore.png";
import {
  Home,
  ShoppingBag,
  Info,
  PhoneCall,
  Crown,
  Gift,
  HelpCircle,
  LogIn,
  LogOut,
  Bell,
  User,
  X,
  Mail,
  MessageCircle,
  MapPin,
  ChevronDown,
  ChevronRight,
  Menu,
  Sparkles,
  Award
} from "lucide-react";

export default function Header({ isLoggedIn, onLoginClick, onLogout, userProfile, cartCount = 0, onCartClick }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'contact' | 'tier' | 'faq' | null
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Poin Berhasil Ditambahkan!",
      desc: "Selamat! Poin Anda bertambah +150 dari pembelian Kalung Titanium Rosegold (#ORD-102).",
      time: "5 menit lalu",
      unread: true,
    },
    {
      id: 2,
      title: "Level Up: Gold Member!",
      desc: "Tingkat keanggotaan Anda telah naik menjadi Gold Member. Selamat menikmati potongan diskon eksklusif!",
      time: "2 jam lalu",
      unread: true,
    },
    {
      id: 3,
      title: "Klaim Hadiah Gratis Anda!",
      desc: "Tukarkan 500 Poin Anda dengan Cincin Bunga Resin secara gratis sebelum 30 Juni 2026.",
      time: "1 hari lalu",
      unread: false,
    },
  ];

  const handleScroll = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const displayName = isLoggedIn && userProfile ? `${userProfile.namaDepan} ${userProfile.namaBelakang}` : "Tamu";
  const email  = isLoggedIn && userProfile ? userProfile.email : "guest@na_store.id";
  const points = isLoggedIn && userProfile ? (userProfile.points ?? 0) : 0;

  // Gunakan statusMember dari Supabase kalau tersedia, fallback hitung dari poin
  const getTierInfo = (pts, statusMember) => {
    // Prioritaskan data dari tabel customer (Supabase)
    const tier = statusMember ?? (
      pts >= 5000 ? "Platinum" :
      pts >= 2000 ? "Gold"     :
      pts >= 500  ? "Silver"   : "Regular"
    );
    const map = {
      Platinum: { name: "Platinum Member", color: "from-blue-600 to-indigo-700 bg-clip-text text-transparent font-black" },
      Gold:     { name: "Gold Member",     color: "from-amber-500 to-yellow-600 bg-clip-text text-transparent font-black" },
      Silver:   { name: "Silver Member",   color: "from-slate-400 to-slate-600 bg-clip-text text-transparent font-black" },
      Regular:  { name: "Regular Member",  color: "from-zinc-500 to-zinc-700 bg-clip-text text-transparent font-black" },
    };
    return map[tier] ?? map.Regular;
  };

  const tierInfo = getTierInfo(points, userProfile?.statusMember);

  return (
    <>
      {/* Floating Navbar wrapper */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
        <header className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgba(34,40,94,0.10)] border border-white/60 transition-all">
        
        <div className="px-5 h-14 flex items-center justify-between">
          {/* Logo & Name */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src={logoNastore} alt="Logo Na_store" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
            <div>
              <p className="font-black text-sm tracking-wide leading-tight text-[#22285E]">Na_store.id</p>
              <p className="text-[9px] uppercase tracking-widest text-[#9E4BDC] font-bold">Accessories & CRM Loyalty</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-4 xl:gap-5 text-[11px] xl:text-xs font-bold text-[#71717A] shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            
            <button
              onClick={() => handleScroll("catalog")}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Katalog</span>
            </button>

            <button
              onClick={() => handleScroll("about")}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Tentang Kami</span>
            </button>

            <button
              onClick={() => handleScroll("lokasi")}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Kontak</span>
            </button>

            <button
              onClick={() => handleScroll("loyalty")}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5 text-yellow-500" />
              <span>Tier Poin</span>
            </button>

            <button
              onClick={() => {
                if (isLoggedIn) {
                  handleScroll("loyalty");
                } else {
                  navigate("/login");
                }
              }}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5 text-[#9E4BDC]" />
              <span>Tukar Reward</span>
            </button>

            <button
              onClick={() => handleScroll("faq")}
              className="flex items-center gap-1.5 hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none py-1.5 whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </button>
          </nav>

          {/* Right Section: Conditional Auth & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              /* CUSTOMER LOGGED IN */
              <div className="flex items-center gap-3.5">
                {/* Points & Badge Info (Desktop only) */}
                <div className="hidden md:flex flex-col text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 animate-pulse" />
                    <span className="text-xs font-black text-[#22285E]">{points.toLocaleString()} Poin</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${tierInfo.color}`}>
                    {tierInfo.name}
                  </span>
                </div>

                {/* Cart Badge */}
                <div className="relative" id="cart-icon-target">
                  <button
                    onClick={() => onCartClick?.()}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-150 hover:bg-[#9E4BDC]/5 hover:border-[#9E4BDC]/20 transition-all text-[#22285E] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#9E4BDC] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white leading-none px-0.5 animate-bounce">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfileMenu(false);
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-150 hover:bg-[#9E4BDC]/5 hover:border-[#9E4BDC]/20 transition-all text-[#22285E] cursor-pointer ${showNotifications ? 'bg-purple-50 border-[#9E4BDC]/30 text-[#9E4BDC]' : ''}`}
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F24E1E] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white leading-none">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E4E4E7] rounded-2xl shadow-xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-[#E4E4E7] flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                        <span className="text-xs font-black text-[#22285E]">Notifikasi Belanja</span>
                        <span className="text-[10px] text-gray-400 font-bold">{notifications.filter(n => n.unread).length} Baru</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1">
                        {notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-left border-b border-gray-50 last:border-0 ${n.unread ? 'bg-purple-50/30' : ''}`}>
                            <div className="flex justify-between items-start gap-1">
                              <p className="text-xs font-bold text-[#22285E] leading-tight">{n.title}</p>
                              {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#9E4BDC] shrink-0 mt-1"></span>}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 leading-normal font-medium">{n.desc}</p>
                            <p className="text-[8px] text-gray-400 mt-1.5 font-semibold text-right">{n.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Icon Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer outline-none select-none hover:opacity-95 bg-transparent border-none"
                  >
                    <div className="relative">
                      {/* Avatar — inisial huruf pertama nama, tanpa foto */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9E4BDC] to-[#6D28D9] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-[#9E4BDC]/25">
                        {userProfile?.namaDepan ? userProfile.namaDepan.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00B5AD] border-2 border-white rounded-full z-20"></span>
                    </div>
                    <div className="hidden sm:block text-left max-w-[100px]">
                      <p className="text-xs font-bold leading-tight text-[#22285E] truncate">{displayName}</p>
                      <p className="text-[9px] text-gray-400 font-semibold truncate">{email}</p>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E4E4E7] rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 border-b border-[#E4E4E7]">
                        <p className="text-[9px] text-yellow-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3 h-3 text-yellow-500 fill-yellow-400" /> {tierInfo.name}
                        </p>
                        <p className="text-xs font-black text-[#22285E] truncate">{displayName}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleScroll("loyalty");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#22285E] hover:bg-gray-50 rounded-lg cursor-pointer transition-colors bg-transparent border-none text-left font-semibold"
                      >
                        <Gift className="w-3.5 h-3.5 text-[#9E4BDC]" />
                        <span>Benefit Member</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#F24E1E] hover:bg-red-50 rounded-lg cursor-pointer transition-colors bg-transparent border-none text-left font-bold border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* GUEST NOT LOGGED IN */
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] hover:opacity-95 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#9E4BDC]/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk / Daftar</span>
              </button>
            )}

            {/* Mobile Hamburger Button (Only visible on small screens) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#22285E] hover:bg-gray-50 border border-gray-150 rounded-xl transition-colors cursor-pointer bg-transparent"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white/95 px-6 py-4 space-y-3 rounded-b-2xl text-left">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>
            
            <button
              onClick={() => handleScroll("catalog")}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Katalog Aksesoris</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScroll("about");
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <Info className="w-4 h-4" />
              <span>Tentang Kami / About</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScroll("lokasi");
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hubungi Kami / Contact</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScroll("loyalty");
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <Crown className="w-4 h-4 text-yellow-500" />
              <span>Info Tier Poin</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isLoggedIn) {
                  handleScroll("loyalty");
                } else {
                  navigate("/login");
                }
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <Gift className="w-4 h-4 text-[#9E4BDC]" />
              <span>Tukar Reward</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScroll("faq");
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none"
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </button>

            {isLoggedIn && (
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs font-bold text-[#22285E]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                  <span>{points.toLocaleString()} Poin</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${tierInfo.color}`}>
                  {tierInfo.name}
                </span>
              </div>
            )}
          </div>
        )}
      </header>
      </div>

      {/* ── INTERACTIVE MODALS ── */}

      {/* 1. Modal About */}
      {activeModal === "about" && (
        <div className="fixed inset-0 bg-[#22285E]/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3.5 border-b border-gray-50 pb-4 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                <Info className="w-5 h-5 text-[#9E4BDC]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#22285E]">Tentang Na_store.id</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Premium Accessories Hub</p>
              </div>
            </div>
            <div className="space-y-4 text-xs font-medium text-[#71717A] leading-relaxed">
              <p>
                <strong>Na_store.id</strong> adalah destinasi utama belanja aksesoris premium untuk pria dan wanita. Kami menyajikan ragam koleksi pilihan buatan lokal dan handmade mulai dari cincin couple perak, kalung titanium anti karat, gelang kristal berkilau, hingga kuku palsu (nail art) kustom estetik.
              </p>
              <p>
                Sebagai platform e-commerce modern berbasis <strong>CRM (Customer Relationship Management)</strong>, misi kami adalah menghargai kesetiaan Anda melalui sistem poin reward terpadu. Kami percaya setiap pembelanjaan harus mendatangkan nilai tambah eksklusif dan kepuasan seutuhnya bagi Anda.
              </p>
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-[#9E4BDC]/10 flex items-start gap-3 mt-4">
                <Sparkles className="w-5 h-5 text-[#9E4BDC] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-[#22285E]">Eksklusivitas Anggota</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Dapatkan benefit poin belanja yang dapat ditukarkan langsung dengan item fashion gratis atau kupon diskon menarik di setiap transaksi.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-100 hover:bg-gray-250 text-[#71717A] text-xs font-black px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Contact */}
      {activeModal === "contact" && (
        <div className="fixed inset-0 bg-[#22285E]/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3.5 border-b border-gray-50 pb-4 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-[#00B5AD]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#22285E]">Hubungi Kami</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Layanan Customer Na_store.id</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-medium text-[#71717A] leading-relaxed">
                Kami siap membantu Anda mendapatkan aksesoris terbaik dan menjawab pertanyaan seputar poin keanggotaan. Silakan gunakan jalur komunikasi di bawah ini:
              </p>
              
              <div className="space-y-3 mt-4">
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/6281234567890?text=Halo%20Na_store.id%20saya%20butuh%20bantuan%20mengenai%20produk%20aksesoris" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100/50 hover:border-emerald-200 transition-all text-emerald-800"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-black">Customer Service WhatsApp</p>
                    <p className="text-[10px] text-emerald-600 leading-none mt-0.5">+62 812-3456-7890 (Respons &lt; 5 Menit)</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-emerald-500" />
                </a>

                {/* Email */}
                <a 
                  href="mailto:support@nastore.id?subject=Tanya%20Tentang%20Aksesoris%20Na_store.id"
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100/50 hover:border-blue-200 transition-all text-blue-800"
                >
                  <Mail className="w-5 h-5 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-black">E-mail Support</p>
                    <p className="text-[10px] text-blue-600 leading-none mt-0.5">support@nastore.id (Pertanyaan Teknis & Akun)</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-blue-500" />
                </a>

                {/* Offline Shop Map Link */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-150 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#22285E] shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-xs font-black text-[#22285E]">Galeri Toko Fisik</p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Ruko Crown Aksesoris No. 12B, Jl. Raya Mode Fashion, Jakarta Selatan, 12340.
                    </p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-[#9E4BDC] hover:underline font-bold mt-2"
                    >
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-100 hover:bg-gray-255 text-[#71717A] text-xs font-black px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Info Tier Poin */}
      {activeModal === "tier" && (
        <div className="fixed inset-0 bg-[#22285E]/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3.5 border-b border-gray-50 pb-4 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#22285E]">Klasifikasi Level Member</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sistem Poin CRM Na_store.id</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-medium text-[#71717A] leading-relaxed">
                Setiap kelipatan <strong>Rp1.000</strong> nilai pembelanjaan produk aksesoris, Anda berhak mendapatkan <strong>1 Poin</strong>. Akumulasi poin akan menentukan level keanggotaan Anda:
              </p>
              
              <div className="grid grid-cols-1 gap-2.5 mt-2">
                {[
                  { name: "Regular Member", range: "0 - 499 Poin", benefit: "Mendapatkan poin di setiap transaksi, kemasan standar Na_store.", color: "border-zinc-150 bg-zinc-50/50 text-zinc-800" },
                  { name: "Silver Member", range: "500 - 1.999 Poin", benefit: "Potongan harga voucher Rp10.000, kemasan beludru mini, hadiah poin hari ultah.", color: "border-slate-200 bg-slate-50 text-slate-800" },
                  { name: "Gold Member", range: "2.000 - 4.999 Poin", benefit: "Kupon diskon Rp25.000, gratis boks kado eksklusif, prioritas chat kustom ukuran.", color: "border-amber-200 bg-amber-50/40 text-amber-800" },
                  { name: "Platinum Member", range: "5.000+ Poin", benefit: "Diskon belanja 10% permanen, penukaran hadiah tanpa minimum, akses produk limited edition.", color: "border-indigo-150 bg-indigo-50/40 text-indigo-900" },
                ].map((tier, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${tier.color}`}>
                    <div>
                      <p className="text-xs font-black">{tier.name}</p>
                      <p className="text-[10px] font-medium leading-relaxed mt-0.5 text-gray-500">{tier.benefit}</p>
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 bg-white/70 border border-gray-100 rounded-full shrink-0 text-center select-none shadow-sm md:self-center self-start">
                      {tier.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-100 hover:bg-gray-250 text-[#71717A] text-xs font-black px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal FAQ */}
      {activeModal === "faq" && (
        <div className="fixed inset-0 bg-[#22285E]/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3.5 border-b border-gray-50 pb-4 mb-4 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#22285E]">Frequently Asked Questions</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tanya & Jawab Na_store.id</p>
              </div>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow scrollbar-hide py-1">
              {[
                {
                  q: "Bagaimana cara mendapatkan poin loyalitas?",
                  a: "Setiap melakukan pembelanjaan produk aksesoris senilai kelipatan Rp1.000, Anda akan otomatis mendapatkan 1 Poin loyalitas. Pastikan Anda telah masuk (logged in) dengan akun terdaftar agar poin otomatis tercatat."
                },
                {
                  q: "Apakah poin belanja saya bisa berkurang?",
                  a: "Ya. Poin Anda akan langsung berkurang (deducted) saat Anda menukarkannya dengan rewards pilihan, seperti produk aksesoris gratis (scrunchie, gantungan kunci) atau voucher potongan diskon belanja."
                },
                {
                  q: "Bagaimana cara menaikkan tingkatan member keanggotaan?",
                  a: "Tingkatan member naik secara otomatis seiring bertambahnya akumulasi poin Anda. Rentang tier adalah: Regular (0-499 Poin), Silver (500-1.999 Poin), Gold (2.000-4.999 Poin), dan Platinum (5.000+ Poin)."
                },
                {
                  q: "Apakah menukarkan poin reward akan menurunkan tier level member saya?",
                  a: "Tidak. Penentuan level member dihitung berdasarkan akumulasi poin yang pernah didapatkan (milestone historis), bukan saldo poin aktif saat ini. Jadi, Anda bebas menukarkan poin kapan saja tanpa khawatir level member turun!"
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-150">
                  <p className="text-xs font-black text-[#22285E] leading-snug">{faq.q}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium mt-2 pt-2 border-t border-gray-200/50">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end shrink-0 border-t border-gray-50 pt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-100 hover:bg-gray-250 text-[#71717A] text-xs font-black px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
