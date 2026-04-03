import React, { useState, useRef, useEffect } from "react";

export const InputField = ({ label, name, type, value, onChange, placeholder, error }) => (
  <div className="relative">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-6 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 border outline-none
        ${error
          ? "border-red-300 bg-red-50 text-red-900 ring-2 ring-red-100"
          : "border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 ring-indigo-50 text-slate-700"
        }`}
    />
    {error && <p className="text-[9px] font-bold text-red-500 mt-1 ml-1 animate-pulse italic">* {error}</p>}
  </div>
);

export const SelectField = ({ label, name, value, onChange, opsi, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-300 border cursor-pointer flex justify-between items-center relative z-20
          ${error
            ? "border-red-300 bg-red-50 text-red-900 ring-2 ring-red-100"
            : isOpen ? "border-indigo-500 bg-white ring-4 ring-indigo-50 text-slate-700" : "border-slate-100 bg-slate-50 text-slate-700"
          }`}
      >
        <span className={`${!value ? "text-slate-400" : ""} leading-tight`}>
          {value || "Pilih"}
        </span>
        <svg className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {error && <p className="text-[9px] font-bold text-red-500 mt-1 ml-1 animate-pulse italic">* {error}</p>}

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="max-h-60 overflow-y-auto p-2">
            {opsi.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item.value)}
                className={`px-4 py-3 rounded-xl text-[10px] font-bold cursor-pointer transition-all mb-1 last:mb-0
                  ${value === item.value ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"}`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};