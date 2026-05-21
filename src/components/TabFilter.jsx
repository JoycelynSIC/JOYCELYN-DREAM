/**
 * KOMPONEN 13 — TabFilter
 * Grup tombol tab untuk filter (Harian / Mingguan / Bulanan, dll).
 * Mirip filter di area grafik figma.
 *
 * Props:
 *  tabs      : string[]          — daftar label tab
 *  active    : string            — tab yang sedang aktif
 *  onChange  : fn(tab: string)   — callback saat tab diklik
 *  className : string
 */
export default function TabFilter({ tabs = [], active, onChange, className = "" }) {
  return (
    <div className={`flex gap-1 bg-[#F4F4F5] p-1 rounded-xl border border-[#E4E4E7] ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange?.(tab)}
          className={`
            px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200
            ${active === tab
              ? "bg-white text-[#9E4BDC] shadow-sm font-bold"
              : "text-[#71717A] hover:bg-white/60 hover:text-[#22285E]"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
