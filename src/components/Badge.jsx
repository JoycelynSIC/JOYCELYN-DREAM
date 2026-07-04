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

export default function Badge({ status, variant = "pastel" }) {
  const configsPastel = {
    /* ── Status Pesanan ── */
    Selesai:     { bg: "bg-[#00B5AD]/10",  text: "text-[#00B5AD]",  border: "border-[#00B5AD]/20",  icon: <FaCheckCircle className="text-[10px]" /> },
    Proses:      { bg: "bg-[#F4F4F5]",     text: "text-[#71717A]",  border: "border-[#E4E4E7]",     icon: <FaSpinner className="text-[10px] animate-spin" /> },
    Dikirim:     { bg: "bg-blue-50",       text: "text-blue-600",   border: "border-blue-200",      icon: <FaSpinner className="text-[10px]" /> },
    Batal:       { bg: "bg-[#F24E1E]/10",  text: "text-[#F24E1E]",  border: "border-[#F24E1E]/20",  icon: <FaTimesCircle className="text-[10px]" /> },
    Dibatalkan:  { bg: "bg-[#F24E1E]/10",  text: "text-[#F24E1E]",  border: "border-[#F24E1E]/20",  icon: <FaTimesCircle className="text-[10px]" /> },
    Pending:     { bg: "bg-yellow-50",     text: "text-yellow-600", border: "border-yellow-200",    icon: <FaSpinner className="text-[10px] animate-spin" /> },
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

  const configsSolid = {
    /* ── Status Pesanan ── */
    Selesai:     { bg: "bg-[#00B5AD]",     text: "text-white",      border: "border-transparent",   icon: null },
    Proses:      { bg: "bg-[#71717A]",     text: "text-white",      border: "border-transparent",   icon: null },
    Dikirim:     { bg: "bg-blue-500",      text: "text-white",      border: "border-transparent",   icon: null },
    Batal:       { bg: "bg-[#F24E1E]",     text: "text-white",      border: "border-transparent",   icon: null },
    Dibatalkan:  { bg: "bg-[#F24E1E]",     text: "text-white",      border: "border-transparent",   icon: null },
    Pending:     { bg: "bg-yellow-400",    text: "text-white",      border: "border-transparent",   icon: null },
    /* ── Status Stok Inventaris ── */
    Aman:          { bg: "bg-[#9E4BDC]",     text: "text-white",      border: "border-transparent",   icon: null },
    'Hampir Habis':{ bg: "bg-amber-500",    text: "text-white",      border: "border-transparent",   icon: null },
    Habis:         { bg: "bg-[#F24E1E]",     text: "text-white",      border: "border-transparent",   icon: null },
    /* ── Level Member ── */
    Reguler:  { bg: "bg-[#F4F4F5]",     text: "text-[#71717A]",  border: "border-[#E4E4E7]",     icon: null },
    Silver:   { bg: "bg-[#E4E4E7]/40",  text: "text-[#52525B]",  border: "border-[#A1A1AA]/30",  icon: null },
    Gold:     { bg: "bg-yellow-400",    text: "text-[#22285E]",  border: "border-transparent",   icon: null },
    Platinum: { bg: "bg-[#9E4BDC]",     text: "text-white",      border: "border-transparent",   icon: null },
  };

  const configs = variant === "solid" ? configsSolid : configsPastel;

  let config = configs[status];
  if (!config) {
    // Normalise casing untuk status yang mungkin datang lowercase dari DB
    const normalized = typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
    config = configs[normalized];
  }
  if (!config) {
    if (typeof status === "string" && status.startsWith("Stok:")) {
      config = configs["Aman"];
    } else if (typeof status === "string" && status.startsWith("Sisa")) {
      config = configs["Hampir Habis"];
    } else if (typeof status === "string" && (status.startsWith("Habis") || status === "Stok Habis")) {
      config = configs["Habis"];
    } else {
      // Fallback abu-abu untuk status apapun yang tidak dikenal
      config = {
        bg: "bg-[#F4F4F5]", text: "text-[#71717A]", border: "border-[#E4E4E7]", icon: null,
      };
    }
  }

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
