/**
 * KOMPONEN 12 — CustomerCard
 * Kartu profil pelanggan ringkas untuk daftar / grid pelanggan.
 * Menampilkan: foto/avatar, nama, level member, poin, total belanja.
 *
 * Props:
 *  id          : string | number
 *  nama        : string
 *  email       : string
 *  noHp        : string
 *  statusMember: "Reguler" | "Silver" | "Gold" | "Platinum"
 *  totalPoin   : number
 *  totalBelanja: number  — dalam Rupiah
 *  foto        : string  — URL foto (opsional)
 *  onClick     : fn
 */
import Badge from "./Badge";
import { FaStar, FaWhatsapp } from "react-icons/fa";

const memberColor = {
  Reguler:  "bg-[#F4F4F5] text-[#71717A]",
  Silver:   "bg-[#E4E4E7] text-[#52525B]",
  Gold:     "bg-yellow-100 text-yellow-700",
  Platinum: "bg-[#9E4BDC]/10 text-[#9E4BDC]",
};

export default function CustomerCard({
  id,
  nama = "Pelanggan",
  email,
  noHp,
  statusMember = "Reguler",
  totalPoin = 0,
  totalBelanja = 0,
  foto,
  onClick,
}) {
  const initials = nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E4E4E7] rounded-2xl p-5 hover:shadow-md hover:border-[#9E4BDC]/30 transition-all cursor-pointer group"
    >
      {/* Baris atas: avatar + nama + badge */}
      <div className="flex items-center gap-3 mb-4">
        {foto ? (
          <img
            src={foto}
            alt={nama}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border-2 border-[#9E4BDC]/20"
          />
        ) : (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${memberColor[statusMember] ?? "bg-[#F4F4F5] text-[#71717A]"}`}>
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#22285E] truncate">{nama}</p>
          {email && <p className="text-[10px] text-[#A1A1AA] truncate">{email}</p>}
        </div>
        <div className="ml-auto shrink-0">
          <Badge status={statusMember} />
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F4F4F5] rounded-xl p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-0.5">Total Poin</p>
          <p className="text-sm font-black text-[#22285E] flex items-center gap-1">
            <FaStar className="text-yellow-400 text-[10px]" />
            {totalPoin.toLocaleString("id")}
          </p>
        </div>
        <div className="bg-[#F4F4F5] rounded-xl p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-0.5">Total Belanja</p>
          <p className="text-sm font-black text-[#22285E]">
            Rp {totalBelanja >= 1000000
              ? (totalBelanja / 1000000).toFixed(1) + "jt"
              : totalBelanja.toLocaleString("id")}
          </p>
        </div>
      </div>

      {/* Footer: nomor WA */}
      {noHp && (
        <div className="mt-3 flex items-center gap-2 text-[#00B5AD] text-[11px] font-semibold">
          <FaWhatsapp className="text-sm" />
          {noHp}
        </div>
      )}
    </div>
  );
}
