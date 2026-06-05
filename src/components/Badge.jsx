/**
 * KOMPONEN 3 — Badge
 * Label status berwarna untuk tabel pesanan, member, dll.
 *
 * Props:
 *  status : "Selesai" | "Proses" | "Batal"
 *           | "Reguler" | "Silver" | "Gold" | "Platinum"
 *           | string bebas (fallback abu-abu)
 */
import { FaCheckCircle, FaSpinner, FaTimesCircle, FaStar, FaExclamationTriangle } from 'react-icons/fa';

export default function Badge({ status }) {
  const configs = {
    /* ── Status Pesanan ── */
    Selesai:  { bg: "bg-[#00B5AD]/10",  text: "text-[#00B5AD]",  border: "border-[#00B5AD]/20",  icon: <FaCheckCircle className="text-[10px]" /> },
    Proses:   { bg: "bg-[#F4F4F5]",     text: "text-[#71717A]",  border: "border-[#E4E4E7]",     icon: <FaSpinner className="text-[10px] animate-spin" /> },
    Batal:    { bg: "bg-[#F24E1E]/10",  text: "text-[#F24E1E]",  border: "border-[#F24E1E]/20",  icon: <FaTimesCircle className="text-[10px]" /> },
    /* ── Status Stok Inventaris ── */
    Aman:          { bg: "bg-[#00B5AD]/10",  text: "text-[#00B5AD]",  border: "border-[#00B5AD]/20",  icon: <FaCheckCircle className="text-[10px]" /> },
    'Hampir Habis':{ bg: "bg-yellow-50",     text: "text-yellow-600", border: "border-yellow-200",    icon: <FaExclamationTriangle className="text-[10px]" /> },
    Habis:         { bg: "bg-[#F24E1E]/10",  text: "text-[#F24E1E]",  border: "border-[#F24E1E]/20",  icon: <FaTimesCircle className="text-[10px]" /> },
    /* ── Level Member ── */
    Reguler:  { bg: "bg-[#F4F4F5]",     text: "text-[#71717A]",  border: "border-[#E4E4E7]",     icon: null },
    Silver:   { bg: "bg-[#E4E4E7]/40",  text: "text-[#52525B]",  border: "border-[#A1A1AA]/30",  icon: <FaStar className="text-[10px]" /> },
    Gold:     { bg: "bg-yellow-50",     text: "text-yellow-600", border: "border-yellow-200",    icon: <FaStar className="text-[10px]" /> },
    Platinum: { bg: "bg-[#9E4BDC]/10",  text: "text-[#9E4BDC]",  border: "border-[#9E4BDC]/20",  icon: <FaStar className="text-[10px]" /> },
  };

  const config = configs[status] ?? {
    bg: "bg-[#F4F4F5]", text: "text-[#71717A]", border: "border-[#E4E4E7]", icon: null,
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5
      px-2.5 py-1
      rounded-lg
      text-[10px]
      font-bold
      border
      ${config.bg} ${config.text} ${config.border}
    `}>
      {config.icon}
      {status}
    </div>
  );
}
