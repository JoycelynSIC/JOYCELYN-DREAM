/**
 * KOMPONEN — Header (Top Bar) Admin
 * Notifikasi pesanan baru dibaca dari localStorage (ditulis oleh Orders.jsx polling).
 * Notifikasi statis (stok, ulasan) tetap ditampilkan di bawahnya.
 */
import { useState, useEffect, useCallback } from "react";
import { FaBell, FaSearch, FaBoxOpen, FaShoppingBag, FaStar, FaExclamationCircle, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import profileImg from "../assets/profile.jpg";
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Key localStorage yang digunakan Orders.jsx ────────────────────────────────
const NOTIF_KEY = 'admin_order_notifs';

// ── Notifikasi statis (sistem — stok, ulasan, dll) ────────────────────────────
const STATIC_NOTIFS = [
  {
    id: 'static-2',
    icon: FaExclamationCircle,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    title: "Stok hampir habis",
    desc: "Anting Tassel Bohemian tersisa 3 pcs — segera restock",
    time: "Tadi",
    unread: false,
    isStatic: true,
  },
  {
    id: 'static-3',
    icon: FaTimesCircle,
    iconBg: "bg-[#F24E1E]/10",
    iconColor: "text-[#F24E1E]",
    title: "Stok habis",
    desc: "Scrunchie Satin Pastel stok 0 — perlu restock segera",
    time: "Tadi",
    unread: false,
    isStatic: true,
  },
  {
    id: 'static-5',
    icon: FaStar,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    title: "Ulasan baru",
    desc: "Amelia Putri memberi ⭐⭐⭐⭐⭐ untuk Cincin Couple Silver",
    time: "Tadi",
    unread: false,
    isStatic: true,
  },
];

// ── Format waktu relatif ──────────────────────────────────────────────────────
const formatRelativeTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
};

// ── Baca order notifs dari localStorage ──────────────────────────────────────
const readOrderNotifs = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
    return raw.map(n => ({
      ...n,
      icon:      FaShoppingBag,
      iconBg:    "bg-[#9E4BDC]/10",
      iconColor: "text-[#9E4BDC]",
      timeLabel: formatRelativeTime(n.time),
    }));
  } catch { return []; }
};

export default function Header({ pageTitle = "Dashboard" }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const displayName = user ? `${user.namaDepan} ${user.namaBelakang}` : "Joycelyn Dhealiva";
  const email = user ? user.email : "joycelyn@rocketmail.com";

  // ── Notif state: gabungan order (dari localStorage) + statis ─────────────
  const [orderNotifs, setOrderNotifs] = useState(readOrderNotifs);
  const [staticNotifs]                = useState(STATIC_NOTIFS);

  // Refresh order notifs dari localStorage
  const refreshNotifs = useCallback(() => {
    setOrderNotifs(readOrderNotifs());
  }, []);

  // Listen event dari Orders.jsx saat ada pesanan baru
  useEffect(() => {
    window.addEventListener('order-notif-update', refreshNotifs);
    return () => window.removeEventListener('order-notif-update', refreshNotifs);
  }, [refreshNotifs]);

  // Polling setiap 15 detik sebagai fallback (misal tab berbeda)
  useEffect(() => {
    const interval = setInterval(refreshNotifs, 15_000);
    return () => clearInterval(interval);
  }, [refreshNotifs]);

  // Gabungkan: order notifs (terbaru dulu) + static notifs
  const allNotifs = [
    ...orderNotifs.map(n => ({ ...n, _key: n.id })),
    ...staticNotifs.map(n => ({ ...n, _key: n.id })),
  ];

  const unreadCount = allNotifs.filter(n => n.unread).length;

  // Tandai satu notif sebagai dibaca
  const markRead = (id) => {
    setOrderNotifs(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, unread: false } : n);
      localStorage.setItem(NOTIF_KEY, JSON.stringify(
        updated.map(({ icon, iconBg, iconColor, timeLabel, ...rest }) => rest)
      ));
      return updated;
    });
  };

  // Tandai semua dibaca
  const markAllRead = () => {
    setOrderNotifs(prev => {
      const updated = prev.map(n => ({ ...n, unread: false }));
      localStorage.setItem(NOTIF_KEY, JSON.stringify(
        updated.map(({ icon, iconBg, iconColor, timeLabel, ...rest }) => rest)
      ));
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="px-8 py-4 flex items-center justify-between bg-white border-b border-[#E4E4E7] gap-4">
      {/* Kiri: judul halaman */}
      <h1 className="text-xl font-black text-[#22285E] tracking-tight shrink-0">
        {pageTitle}
      </h1>

      {/* Tengah: search bar */}
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

        {/* Bell — Dropdown Notifikasi */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#F4F4F5] border border-[#E4E4E7] hover:bg-[#EBDDF7] transition-colors text-[#22285E] outline-none">
              <FaBell className="text-base" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#F24E1E] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white leading-none px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0 rounded-2xl border border-[#E4E4E7] shadow-xl overflow-hidden">
            {/* Header dropdown */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E4E7] bg-white">
              <div>
                <p className="text-sm font-black text-[#22285E]">Notifikasi</p>
                <p className="text-[10px] text-[#A1A1AA]">{unreadCount} belum dibaca</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-[#9E4BDC] hover:underline cursor-pointer"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            {/* List notifikasi */}
            <div className="bg-white divide-y divide-[#F4F4F5] max-h-[400px] overflow-y-auto">
              {allNotifs.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FaBell className="text-2xl text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-medium">Belum ada notifikasi</p>
                </div>
              ) : (
                allNotifs.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n._key}
                      onClick={() => !n.isStatic && markRead(n.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#F9F9FB] transition-colors
                        ${n.unread ? "bg-[#9E4BDC]/[0.03]" : ""}`}
                    >
                      {/* Ikon */}
                      <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center mt-0.5 ${n.iconBg}`}>
                        <Icon className={`text-xs ${n.iconColor}`} />
                      </div>
                      {/* Teks */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${n.unread ? "font-bold text-[#22285E]" : "font-medium text-[#71717A]"}`}>
                          {n.title}
                        </p>
                        <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-snug line-clamp-2">{n.desc}</p>
                        {n.metode && (
                          <span className="inline-block text-[9px] font-bold text-[#9E4BDC] bg-[#9E4BDC]/8 px-1.5 py-0.5 rounded-full mt-1">
                            {n.metode}
                          </span>
                        )}
                        <p className="text-[10px] text-[#C4C4C8] mt-1">{n.timeLabel ?? n.time}</p>
                      </div>
                      {/* Dot unread */}
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#9E4BDC] shrink-0 mt-1.5" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer — clear order notifs */}
            {orderNotifs.length > 0 && (
              <div className="px-4 py-2.5 border-t border-[#E4E4E7] bg-gray-50/60">
                <button
                  onClick={() => {
                    localStorage.removeItem(NOTIF_KEY);
                    setOrderNotifs([]);
                  }}
                  className="text-[10px] text-gray-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
                >
                  Hapus semua notifikasi pesanan
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E4E4E7]" />

        {/* Profil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 cursor-pointer outline-none select-none hover:opacity-80 transition-opacity">
              <img
                src={profileImg}
                alt="Profil"
                className="w-9 h-9 rounded-xl object-cover shrink-0 border-2 border-[#9E4BDC]/20"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-9 h-9 rounded-xl bg-[#9E4BDC] items-center justify-center text-white text-xs font-black shrink-0 hidden">
                JD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-[#22285E] leading-tight">{displayName}</p>
                <p className="text-[11px] text-[#A1A1AA]">{email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-[#E4E4E7] rounded-xl shadow-lg p-1.5 z-50">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-[#22285E] hover:bg-[#F4F4F5] rounded-lg cursor-pointer">
              <UserIcon className="w-4 h-4 text-[#A1A1AA]" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-[#22285E] hover:bg-[#F4F4F5] rounded-lg cursor-pointer">
              <CreditCardIcon className="w-4 h-4 text-[#A1A1AA]" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-[#22285E] hover:bg-[#F4F4F5] rounded-lg cursor-pointer">
              <SettingsIcon className="w-4 h-4 text-[#A1A1AA]" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 border-t border-[#E4E4E7]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer font-medium"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
