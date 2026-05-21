/**
 * KOMPONEN 15 — ActivityItem
 * Item jadwal / aktivitas berwarna untuk timeline harian.
 * Mirip blok "IOS Dev Team Meeting", "SEO Analytics", dll di figma,
 * diadaptasi untuk jadwal restock / promo / event Na_store.id.
 *
 * Props:
 *  title    : string
 *  time     : string  — misal "10:00 - 12:00"
 *  color    : "purple" | "teal" | "dark" | "green"  — warna blok
 *  className: string
 */
const colorMap = {
  purple: "bg-[#9E4BDC] text-white",
  teal:   "bg-[#00B5AD] text-white",
  dark:   "bg-[#22285E] text-white",
  green:  "bg-[#95D5B6] text-[#22285E]",
  orange: "bg-[#F24E1E] text-white",
};

export default function ActivityItem({
  title = "Aktivitas",
  time,
  color = "purple",
  className = "",
}) {
  return (
    <div
      className={`
        rounded-xl px-4 py-3 flex flex-col justify-center
        ${colorMap[color] ?? colorMap.purple}
        ${className}
      `}
    >
      <p className="text-xs font-bold leading-tight">{title}</p>
      {time && <p className="text-[10px] opacity-70 mt-0.5">{time}</p>}
    </div>
  );
}
