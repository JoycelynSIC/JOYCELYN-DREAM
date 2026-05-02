import { NavLink, useNavigate } from "react-router-dom";
import {
  FaThLarge, FaChartBar, FaCalendarAlt,
  FaBox, FaUsers, FaSignOutAlt, FaShoppingBag,
  FaExclamationTriangle, FaLock, FaBan
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  const activeLink = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 mx-3 my-0.5 rounded-2xl text-sm transition-all duration-200 ${
      isActive
        ? "bg-primary text-on-primary font-bold shadow-sm"
        : "text-gray-400 hover:bg-secondary hover:text-gray-600 font-medium"
    }`;

  const errorLink = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-2.5 mx-3 my-0.5 rounded-2xl text-xs transition-all duration-200 ${
      isActive
        ? "bg-[#FFB9B9] text-[#9d2a5e] font-bold shadow-sm"
        : "text-gray-400 hover:bg-[#FFF5F5] hover:text-gray-500 font-medium"
    }`;

  return (
    <aside className="w-64 bg-white m-3 rounded-3xl flex flex-col border border-secondary shadow-sm min-h-[calc(100vh-1.5rem)]">
      {/* Logo */}
      <div className="px-8 pt-8 pb-6 flex items-center gap-3 border-b border-secondary">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <span className="text-base font-black italic text-on-primary">Na</span>
        </div>
        <div>
          <p className="text-sm font-black text-gray-700 leading-tight">Na_store.id</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 px-8 pb-2 pt-2">Menu</p>
        <NavLink to="/" end className={activeLink}><FaThLarge className="text-xs shrink-0" /> Dashboard</NavLink>
        <NavLink to="/analytics" className={activeLink}><FaChartBar className="text-xs shrink-0" /> Laporan</NavLink>
        <NavLink to="/orders" className={activeLink}><FaShoppingBag className="text-xs shrink-0" /> Pesanan</NavLink>
        <NavLink to="/schedule" className={activeLink}><FaCalendarAlt className="text-xs shrink-0" /> Jadwal</NavLink>
        <NavLink to="/inventory" className={activeLink}><FaBox className="text-xs shrink-0" /> Persediaan</NavLink>
        <NavLink to="/customers" className={activeLink}><FaUsers className="text-xs shrink-0" /> Pelanggan</NavLink>

        {/* ── Error Pages (Pertemuan 6) ── */}
        <div className="mx-3 my-2 border-t border-[#FFDDD2]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 px-8 pb-2 pt-2">Error Pages</p>
        <NavLink to="/error/400" className={errorLink}>
          <FaExclamationTriangle className="text-xs shrink-0 text-orange-400" />
          <span>400 Bad Request</span>
        </NavLink>
        <NavLink to="/error/401" className={errorLink}>
          <FaLock className="text-xs shrink-0 text-yellow-500" />
          <span>401 Unauthorized</span>
        </NavLink>
        <NavLink to="/error/403" className={errorLink}>
          <FaBan className="text-xs shrink-0 text-[#9d2a5e]" />
          <span>403 Forbidden</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-secondary">
        <button
          onClick={() => {
            if (confirm("Yakin mau logout?")) {
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              localStorage.removeItem('name');
              navigate("/login");
            }
          }}
          className="flex items-center gap-3 w-full px-5 py-3 rounded-2xl text-sm font-semibold text-accent hover:bg-accent/10 transition-all"
        >
          <FaSignOutAlt className="text-xs shrink-0" /> Log Out
        </button>
      </div>
    </aside>
  );
}
