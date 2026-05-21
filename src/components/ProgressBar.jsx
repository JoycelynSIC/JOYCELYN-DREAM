/**
 * KOMPONEN — ProgressBar
 * Bar progres untuk menampilkan persentase stok, target penjualan, dll.
 *
 * Props:
 *  value     : number   — nilai saat ini (0–max)
 *  max       : number   — nilai maksimum (default 100)
 *  label     : string   — label di atas bar (opsional)
 *  showValue : boolean  — tampilkan persentase di kanan (default true)
 *  variant   : "primary" | "success" | "warning" | "dark" | "secondary"
 *  size      : "sm" | "md" | "lg"
 *  animated  : boolean  — animasi shimmer (default true)
 *  className : string
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  variant = "primary",
  size = "md",
  animated = true,
  className = "",
}) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const trackColors = {
    primary:   "bg-[#9E4BDC]/10",
    success:   "bg-[#00B5AD]/10",
    warning:   "bg-[#F24E1E]/10",
    dark:      "bg-[#22285E]/10",
    secondary: "bg-[#95D5B6]/20",
  };

  const fillColors = {
    primary:   "bg-[#9E4BDC]",
    success:   "bg-[#00B5AD]",
    warning:   "bg-[#F24E1E]",
    dark:      "bg-[#22285E]",
    secondary: "bg-[#95D5B6]",
  };

  const textColors = {
    primary:   "text-[#9E4BDC]",
    success:   "text-[#00B5AD]",
    warning:   "text-[#F24E1E]",
    dark:      "text-[#22285E]",
    secondary: "text-[#22285E]",
  };

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label + nilai */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[11px] font-semibold text-[#71717A]">{label}</span>
          )}
          {showValue && (
            <span className={`text-[11px] font-black ml-auto ${textColors[variant]}`}>
              {pct}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className={`w-full rounded-full overflow-hidden ${trackColors[variant]} ${heights[size]}`}>
        {/* Fill */}
        <div
          className={`
            ${heights[size]} rounded-full transition-all duration-700 ease-out
            ${fillColors[variant]}
            ${animated ? "relative overflow-hidden" : ""}
          `}
          style={{ width: `${pct}%` }}
        >
          {/* Shimmer overlay */}
          {animated && (
            <span
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ animation: "shimmer 2s infinite" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
