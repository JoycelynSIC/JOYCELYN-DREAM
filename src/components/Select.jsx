/**
 * KOMPONEN 5 — Select
 * Dropdown pilihan dengan label dan ikon opsional.
 *
 * Props:
 *  label     : string
 *  options   : Array<{ value, label }>
 *  value     : string
 *  onChange  : fn
 *  icon      : ReactIcon component
 *  disabled  : boolean
 *  className : string
 */
import { FaChevronDown } from "react-icons/fa";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  icon: Icon,
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

        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full bg-[#F4F4F5] border-2 border-transparent rounded-xl py-3
            ${Icon ? "pl-11" : "px-4"} pr-10
            text-sm font-medium text-[#22285E] outline-none appearance-none
            focus:border-[#9E4BDC]/30 focus:bg-white focus:ring-4 focus:ring-[#9E4BDC]/5
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
          `}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none">
          <FaChevronDown size={12} />
        </div>
      </div>
    </div>
  );
}
