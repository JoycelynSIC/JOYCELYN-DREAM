/**
 * KOMPONEN 4 — Input
 * Field teks serbaguna dengan label, ikon, dan pesan error.
 *
 * Props:
 *  label       : string
 *  type        : string  — default "text"
 *  placeholder : string
 *  value       : string
 *  onChange    : fn
 *  icon        : ReactIcon component (bukan instance)
 *  error       : string  — pesan error
 *  disabled    : boolean
 *  className   : string
 */
export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-[#9E4BDC] transition-colors pointer-events-none">
            <Icon size={14} />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-white border border-[#E4E4E7] rounded-xl py-3
            ${Icon ? "pl-11" : "px-4"} pr-4
            text-sm font-medium text-[#22285E] outline-none
            placeholder:text-[#A1A1AA]
            focus:border-[#9E4BDC]/50 focus:ring-4 focus:ring-[#9E4BDC]/5
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? "border-red-400/50 bg-red-50" : ""}
          `}
        />
      </div>

      {error && (
        <span className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tight">
          {error}
        </span>
      )}
    </div>
  );
}
