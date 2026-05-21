import React from 'react';

const Input = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  error,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-[#9E4BDC] transition-colors">
            <Icon size={14} />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-[#F4F4F5] border-2 border-transparent rounded-xl py-3 
            ${Icon ? 'pl-11' : 'px-4'} pr-4
            text-sm font-medium text-[#22285E] outline-none
            placeholder:text-[#A1A1AA]
            focus:border-[#9E4BDC]/20 focus:bg-white focus:ring-4 focus:ring-[#9E4BDC]/5
            transition-all duration-200
            ${error ? 'border-red-500/50 bg-red-50' : ''}
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
};

export default Input;