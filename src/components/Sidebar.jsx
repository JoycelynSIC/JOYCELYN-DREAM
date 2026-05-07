import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoNastore from "../assets/gambarproduk/logonastore.png";
import {
  FaThLarge, FaChartBar, FaCalendarAlt,
  FaBox, FaUsers, FaSignOutAlt, FaShoppingBag,
  FaStar
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const activeLink = ({ isActive }) =>
    `flex items-center rounded-full text-sm transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden my-1 ${
      // Padding dinamis: mx-3 saat lebar, mx-2 saat kecil supaya pas di tengah
      isHovered ? "px-5 mx-3 gap-3 justify-start" : "px-0 mx-2 justify-center"
    } ${
      isActive
        ? "bg-[#C48DF2] text-white font-bold shadow-md"
        : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
    }`;

  const menuItems = [
    { to: "/", icon: <FaThLarge />, label: "Dashboard" },
    { to: "/analytics", icon: <FaChartBar />, label: "Laporan" },
    { to: "/orders", icon: <FaShoppingBag />, label: "Pesanan" },
    { to: "/schedule", icon: <FaCalendarAlt />, label: "Jadwal" },
    { to: "/inventory", icon: <FaBox />, label: "Persediaan" },
    { to: "/customers", icon: <FaUsers />, label: "Pelanggan" },
    { to: "/reviews", icon: <FaStar />, label: "Ulasan" },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Gunakan min-w dan max-w untuk kunci lebar
      className={`bg-[#A65EEA] flex flex-col h-screen transition-all duration-300 ease-in-out z-50 shadow-xl shrink-0 overflow-hidden ${
        isHovered 
          ? "w-64 min-w-[256px] max-w-[256px]" 
          : "w-20 min-w-[80px] max-w-[80px]"
      }`}
    >
      
      {/* Area Logo */}
      <div className="pt-10 pb-8 flex flex-col items-center shrink-0 min-h-[140px]">
        <img
          src={logoNastore}
          alt="Logo"
          className={`object-contain transition-all duration-300 ${isHovered ? "w-14 h-14" : "w-10 h-10"}`}
        />
        <div className={`mt-4 text-center transition-all duration-300 ${isHovered ? "opacity-100 h-auto visible" : "opacity-0 h-0 invisible"}`}>
          <p className="text-white font-bold text-sm tracking-wide">Na_store.id</p>
          <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 bg-[#9347D5] py-6 space-y-1 rounded-tl-[3rem] overflow-y-auto scrollbar-hide flex flex-col">
        <p className={`text-[10px] font-bold uppercase tracking-widest text-white/40 px-8 pb-3 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
          Main Menu
        </p>
        
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={activeLink} style={{ height: '48px' }}>
            {/* Box Ikon: Ukuran fixed agar selalu center */}
            <div className="text-xl shrink-0 w-10 h-10 flex items-center justify-center">
              {item.icon}
            </div>
            {/* Teks Label */}
            <span className={`transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
              {item.label}
            </span>
          </NavLink>
        ))}

        <div className="mt-auto pt-6">
          <div className={`mx-8 mb-4 border-t border-white/10 ${isHovered ? "block" : "hidden"}`} />
          <button
            onClick={() => { if (confirm("Logout?")) { localStorage.clear(); navigate("/login"); } }}
            className={`flex items-center text-white/70 hover:text-white transition-all w-full group ${
              isHovered ? "px-8 gap-3 justify-start" : "justify-center"
            }`}
            style={{ height: '50px' }}
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <FaSignOutAlt className="text-xl rotate-180" />
            </div>
            <span className={`font-semibold transition-opacity ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
              Log Out
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}