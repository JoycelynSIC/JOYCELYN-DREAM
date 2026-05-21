export default function StatCard({ 
  label, 
  value, 
  desc, 
  icon, 
  variant = "white", // white atau primary
  iconBgColor = "bg-[#F4F4F5]", 
  iconColor = "text-[#9E4BDC]" 
}) {
  
  if (variant === "primary") {
    return (
      <div className="bg-[#9E4BDC] rounded-2xl p-5 flex items-center gap-4 shadow-md shadow-[#9E4BDC]/20 border border-[#9E4BDC]">
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0 border border-white/30">
          <span className="text-white text-base">{icon}</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{label}</p>
          <p className="text-2xl font-black text-white leading-tight">{value}</p>
          <p className="text-[10px] text-white/60">{desc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all group">
      <div className={`w-11 h-11 ${iconBgColor} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
        <span className={`${iconColor} text-base`}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{label}</p>
        <p className="text-2xl font-black text-[#22285E] leading-tight">{value}</p>
        <p className="text-[10px] text-[#71717A]">{desc}</p>
      </div>
    </div>
  );
}