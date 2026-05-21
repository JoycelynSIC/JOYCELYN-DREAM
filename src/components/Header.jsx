/**
 * KOMPONEN 8 — Header (Top Bar)
 * Bar atas dashboard: judul halaman + search + notifikasi + profil user.
 * Sesuai figma: "Dashboard  [Search...]  [foto] Asril Ibrahim / email"
 */
import { FaBell, FaSearch } from "react-icons/fa";
import profileImg from "../assets/profile.jpg";

export default function Header({ pageTitle = "Dashboard" }) {
  const displayName = "Joycelyn Dhealiva";
  const email = "joycelyn@rocketmail.com";

  return (
    <header className="px-8 py-4 flex items-center justify-between bg-white border-b border-[#E4E4E7] gap-4">
      {/* Kiri: judul halaman */}
      <h1 className="text-xl font-black text-[#22285E] tracking-tight shrink-0">
        {pageTitle}
      </h1>

      {/* Tengah: search bar — mirip figma */}
      <div className="relative flex-1 max-w-sm hidden lg:block">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] text-sm pointer-events-none" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-11 pr-5 py-2.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-full text-sm text-[#22285E] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 focus:border-[#9E4BDC] transition-all"
        />
      </div>

      {/* Kanan: notifikasi + profil */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#F4F4F5] border border-[#E4E4E7] hover:bg-[#EBDDF7] transition-colors text-[#22285E]">
          <FaBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F24E1E] rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E4E4E7]" />

        {/* Profil */}
        <div className="flex items-center gap-3">
          <img
            src={profileImg}
            alt="Profil"
            className="w-9 h-9 rounded-xl object-cover shrink-0 border-2 border-[#9E4BDC]/20"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback inisial */}
          <div className="w-9 h-9 rounded-xl bg-[#9E4BDC] items-center justify-center text-white text-xs font-black shrink-0 hidden">
            JD
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[#22285E] leading-tight">{displayName}</p>
            <p className="text-[11px] text-[#A1A1AA]">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
