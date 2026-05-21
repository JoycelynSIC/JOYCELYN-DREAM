/**
 * KOMPONEN — Tooltip
 * Tooltip hover untuk info tambahan pada ikon, label, atau elemen apapun.
 * Menggunakan CSS pure (group/peer) tanpa library eksternal.
 *
 * Props:
 *  content   : string | ReactNode  — isi tooltip
 *  position  : "top" | "bottom" | "left" | "right"  (default "top")
 *  children  : ReactNode           — elemen yang di-hover
 *  className : string
 */
export default function Tooltip({
  content,
  position = "top",
  children,
  className = "",
}) {
  const positionClasses = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top:    "top-full left-1/2 -translate-x-1/2 border-t-[#22285E] border-x-transparent border-b-transparent border-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[#22285E] border-x-transparent border-t-transparent border-4",
    left:   "left-full top-1/2 -translate-y-1/2 border-l-[#22285E] border-y-transparent border-r-transparent border-4",
    right:  "right-full top-1/2 -translate-y-1/2 border-r-[#22285E] border-y-transparent border-l-transparent border-4",
  };

  return (
    <div className={`relative inline-flex group ${className}`}>
      {/* Trigger */}
      {children}

      {/* Tooltip bubble */}
      <div
        className={`
          pointer-events-none absolute z-50 w-max max-w-[200px]
          bg-[#22285E] text-white text-[11px] font-semibold
          px-3 py-1.5 rounded-lg shadow-lg
          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-150 ease-out
          ${positionClasses[position]}
        `}
      >
        {content}
        {/* Arrow */}
        <span className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
      </div>
    </div>
  );
}
