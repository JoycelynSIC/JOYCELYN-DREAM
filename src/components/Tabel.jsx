import React from 'react';

// Main Table Component
export const Table = ({ headers = [], children, className = "" }) => {
  return (
    <div className={`overflow-x-auto scrollbar-hide ${className}`}>
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-4 pb-3 border-b border-[#E4E4E7]">
          {headers.map((header, idx) => (
            <p 
              key={idx} 
              className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]"
            >
              {header}
            </p>
          ))}
        </div>

        {/* Body */}
        <div className="mt-2 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Rows
export const TableRow = ({ children, className = "" }) => (
  <div className={`grid grid-cols-5 items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#F4F4F5] transition-all group ${className}`}>
    {children}
  </div>
);