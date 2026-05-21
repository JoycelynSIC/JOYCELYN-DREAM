/**
 * KOMPONEN 1 — StatCard
 * Kartu statistik ringkas untuk baris atas dashboard.
 * Mirip kartu NOTIFICATION / PROJECT / CLIENT / Create new di figma.
 *
 * Props:
 *  label       : string   — judul kartu
 *  value       : string   — angka / nilai utama
 *  desc        : string   — keterangan di bawah value
 *  icon        : ReactNode
 *  variant     : "white" | "primary" | "green" | "dark"
 *  iconBgColor : string   — kelas Tailwind bg ikon (variant white)
 *  iconColor   : string   — kelas Tailwind text ikon (variant white)
 *  onClick     : fn       — opsional
 */
export default function StatCard({
  label,
  value,
  desc,
  icon,
  variant = "white",
  iconBgColor = "bg-[#F4F4F5]",
  iconColor = "text-[#9E4BDC]",
  onClick,
}) {
  const base =
    "rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 " +
    (onClick ? "cursor-pointer active:scale-[0.98] " : "");

  /* ── Variant: ungu solid (PROJECT di figma) ── */
  if (variant === "primary") {
    return (
      <div onClick={onClick} className={`${base} bg-[#9E4BDC] shadow-lg shadow-[#9E4BDC]/30 relative overflow-hidden`}>
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -right-1 -bottom-5 w-14 h-14 bg-white/5 rounded-full pointer-events-none" />
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 border border-white/30 relative z-10 text-white text-xl">
          {icon}
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{label}</p>
          <p className="text-xl font-black text-white leading-tight">{value}</p>
          <p className="text-[10px] text-white/60">{desc}</p>
        </div>
      </div>
    );
  }

  /* ── Variant: hijau (Create new di figma) ── */
  if (variant === "green") {
    return (
      <div onClick={onClick} className={`${base} bg-[#95D5B6] border border-[#6EC99E]`}>
        <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0 border border-white/40 text-[#22285E] text-xl">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#22285E]/60">{label}</p>
          <p className="text-xl font-black text-[#22285E] leading-tight">{value}</p>
          <p className="text-[10px] text-[#22285E]/60">{desc}</p>
        </div>
      </div>
    );
  }

  /* ── Variant: gelap (CLIENT di figma) ── */
  if (variant === "dark") {
    return (
      <div onClick={onClick} className={`${base} bg-[#22285E] border border-[#22285E]`}>
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 text-white text-xl">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</p>
          <p className="text-xl font-black text-white leading-tight">{value}</p>
          <p className="text-[10px] text-white/50">{desc}</p>
        </div>
      </div>
    );
  }

  /* ── Variant default: putih (NOTIFICATION di figma) ── */
  return (
    <div onClick={onClick} className={`${base} bg-white border border-[#E4E4E7] hover:shadow-md group`}>
      <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 text-xl`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{label}</p>
        <p className="text-xl font-black text-[#22285E] leading-tight">{value}</p>
        <p className="text-[10px] text-[#71717A]">{desc}</p>
      </div>
    </div>
  );
}
