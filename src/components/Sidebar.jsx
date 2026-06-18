import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoNastore from "../assets/gambarproduk/logonastore.png";
import {
  FaThLarge, FaChartBar, FaCalendarAlt,
  FaBox, FaUsers, FaSignOutAlt, FaShoppingBag,
  FaStar, FaUserFriends
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Ambil role user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const activeLink = ({ isActive }) =>
    `flex items-center rounded-full text-sm transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden my-1 ${
      isHovered ? "px-4 mx-2 gap-2.5 justify-start" : "px-0 mx-2 justify-center"
    } ${
      isActive
        ? "bg-[#C48DF2] text-white font-bold shadow-md"
        : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
    }`;

  // Tentukan item menu berdasarkan role
  const menuItems = isAdmin
    ? [
        { to: "/", icon: <FaThLarge />, label: "Dashboard" },
        { to: "/analytics", icon: <FaChartBar />, label: "Laporan" },
        { to: "/orders", icon: <FaShoppingBag />, label: "Pesanan" },
        { to: "/schedule", icon: <FaCalendarAlt />, label: "Jadwal" },
        { to: "/inventory", icon: <FaBox />, label: "Persediaan" },
        { to: "/customers", icon: <FaUsers />, label: "Pelanggan" },
        { to: "/reviews", icon: <FaStar />, label: "Ulasan" },
        { to: "/users", icon: <FaUserFriends />, label: "User" },
      ]
    : [
        { to: "/", icon: <FaThLarge />, label: "Dashboard" },
      ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-[#A65EEA] flex flex-col h-screen transition-all duration-300 ease-in-out z-50 shadow-xl shrink-0 overflow-hidden ${
        isHovered 
          ? "w-44 min-w-[176px] max-w-[176px]" 
          : "w-[72px] min-w-[72px] max-w-[72px]"
      }`}
    >
      
      {/* Area Logo */}
      <div className="pt-8 pb-6 flex flex-col items-center shrink-0 min-h-[120px]">
        <img
          src={logoNastore}
          alt="Logo"
          className={`object-contain transition-all duration-300 ${isHovered ? "w-10 h-10" : "w-9 h-9"}`}
        />
        <div className={`mt-3 text-center transition-all duration-300 ${isHovered ? "opacity-100 h-auto visible" : "opacity-0 h-0 invisible"}`}>
          <p className="text-white font-bold text-xs tracking-wide">Na_store.id</p>
          <p className="text-white/60 text-[9px] uppercase tracking-widest font-medium">
            {isAdmin ? "Admin Panel" : "Customer Portal"}
          </p>
        </div>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 bg-[#9347D5] py-5 space-y-0.5 rounded-tl-[2.5rem] overflow-y-auto scrollbar-hide flex flex-col">
        <p className={`text-[9px] font-bold uppercase tracking-widest text-white/40 px-5 pb-2 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
          Menu
        </p>
        
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={activeLink} style={{ height: '44px' }}>
            {/* Ikon */}
            <div className="text-base shrink-0 w-9 h-9 flex items-center justify-center">
              {item.icon}
            </div>
            {/* Label */}
            <span className={`text-xs transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
              {item.label}
            </span>
          </NavLink>
        ))}

        <div className="mt-auto pt-4">
          <div className={`mx-5 mb-3 border-t border-white/10 ${isHovered ? "block" : "hidden"}`} />
          <button
            onClick={() => { if (confirm("Logout?")) { localStorage.clear(); window.location.href = "/login"; } }}
            className={`flex items-center text-white/70 hover:text-white transition-all w-full group ${
              isHovered ? "px-4 mx-2 gap-2.5 justify-start" : "justify-center"
            }`}
            style={{ height: '44px' }}
          >
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <FaSignOutAlt className="text-base rotate-180" />
            </div>
            <span className={`text-xs font-semibold transition-opacity ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
              Log Out
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}