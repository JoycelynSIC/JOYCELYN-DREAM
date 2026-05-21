/**
 * KOMPONEN 2 — Button
 * Tombol serbaguna dengan berbagai varian warna & ukuran.
 *
 * Props:
 *  children  : ReactNode
 *  variant   : "primary" | "secondary" | "outline" | "success" | "warning" | "ghost" | "tab" | "tab-active"
 *  size      : "sm" | "md" | "lg"
 *  onClick   : fn
 *  type      : "button" | "submit" | "reset"
 *  disabled  : boolean
 *  icon      : ReactNode — ikon kiri
 *  iconRight : ReactNode — ikon kanan
 *  className : string
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  type = "button",
  disabled = false,
  icon,
  iconRight,
}) {
  const variants = {
    primary:      "bg-[#9E4BDC] text-white hover:bg-[#B16FE3] shadow-md shadow-[#9E4BDC]/20",
    secondary:    "bg-[#95D5B6] text-[#22285E] hover:bg-[#A8E0C5]",
    outline:      "border-2 border-[#9E4BDC] text-[#9E4BDC] hover:bg-[#EBDDF7] bg-transparent",
    success:      "bg-[#00B5AD] text-white hover:opacity-90",
    warning:      "bg-[#F24E1E] text-white hover:opacity-90",
    ghost:        "text-[#71717A] hover:bg-[#F4F4F5] bg-transparent",
    /* Tab filter — tidak aktif */
    tab:          "text-[#71717A] hover:bg-white hover:text-[#22285E] bg-transparent text-xs font-semibold rounded-lg",
    /* Tab filter — aktif */
    "tab-active": "bg-white text-[#9E4BDC] shadow-sm text-xs font-bold rounded-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3 text-base rounded-xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        font-medium
        transition-all
        duration-200
        active:scale-95
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
