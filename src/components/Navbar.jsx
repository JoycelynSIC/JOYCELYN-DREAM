import { useState } from "react";
import logoNastore from "../assets/gambarproduk/logonastore.png";
import profileImg from "../assets/profile.jpg";
import { FaGift, FaShoppingBag, FaTimes, FaBars } from "react-icons/fa";
import { LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const displayName = user ? `${user.namaDepan} ${user.namaBelakang}` : "Pelanggan";
  const email = user ? user.email : "";

  // Smooth scroll handler
  const handleScroll = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={logoNastore} alt="Logo" className="w-9 h-9 object-contain" />
          <div>
            <p className="font-black text-sm tracking-wide leading-tight text-[#22285E]">Na_store.id</p>
            <p className="text-[9px] uppercase tracking-widest text-[#9E4BDC] font-bold">Portal Pelanggan</p>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#71717A]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("catalog")}
            className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            Katalog
          </button>
          <button
            onClick={() => handleScroll("loyalty")}
            className="hover:text-[#9E4BDC] transition-colors cursor-pointer flex items-center gap-1.5 bg-transparent border-none outline-none"
          >
            <FaGift className="text-xs text-[#9E4BDC]" /> Promo & Reward
          </button>
          <button
            onClick={() => handleScroll("orders")}
            className="hover:text-[#9E4BDC] transition-colors cursor-pointer flex items-center gap-1.5 bg-transparent border-none outline-none"
          >
            <FaShoppingBag className="text-xs text-[#9E4BDC]" /> Riwayat Belanja
          </button>
        </nav>

        {/* Right Section: Profile & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer outline-none select-none hover:opacity-90 transition-opacity bg-transparent border-none">
                <div className="relative">
                  <img
                    src={profileImg}
                    alt="Profil"
                    className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback initials */}
                  <div className="w-9 h-9 rounded-xl bg-[#9E4BDC]/10 text-[#9E4BDC] items-center justify-center text-xs font-black shrink-0 hidden">
                    {user.namaDepan ? user.namaDepan.charAt(0) : "P"}
                  </div>
                  {/* Active dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00B5AD] border-2 border-white rounded-full"></span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight text-[#22285E]">{displayName}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-white border border-[#E4E4E7] rounded-xl shadow-lg p-1.5 z-[9999]">
              <div className="px-3 py-2 border-b border-[#E4E4E7]">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Member Gold</p>
                <p className="text-xs font-bold text-[#22285E] truncate">{displayName}</p>
              </div>
              <DropdownMenuItem 
                onClick={() => handleScroll("loyalty")}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#22285E] hover:bg-[#F4F4F5] rounded-lg cursor-pointer transition-colors"
              >
                <FaGift className="w-3.5 h-3.5 text-[#9E4BDC]" />
                <span>Benefit Member</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-t border-[#E4E4E7]" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg cursor-pointer font-bold transition-colors"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span>Keluar Portal</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#22285E] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
          >
            {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 shadow-inner">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="block w-full text-left py-2 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none outline-none"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("catalog")}
            className="block w-full text-left py-2 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] bg-transparent border-none outline-none"
          >
            Katalog Aksesoris
          </button>
          <button
            onClick={() => handleScroll("loyalty")}
            className="block w-full text-left py-2 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] flex items-center gap-1.5 bg-transparent border-none outline-none"
          >
            <FaGift className="text-xs text-[#9E4BDC]" /> Promo & Reward
          </button>
          <button
            onClick={() => handleScroll("orders")}
            className="block w-full text-left py-2 text-xs font-bold text-[#71717A] hover:text-[#9E4BDC] flex items-center gap-1.5 bg-transparent border-none outline-none"
          >
            <FaShoppingBag className="text-xs text-[#9E4BDC]" /> Riwayat Belanja
          </button>
        </div>
      )}
    </header>
  );
}
