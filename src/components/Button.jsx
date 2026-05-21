export default function Button({ 
  children, 
  variant = "primary", 
  onClick, 
  className = "", 
  type = "button" 
}) {
  const variants = {
    // Menggunakan Warna Utama #9E4BDC
    primary: "bg-[#9E4BDC] text-white hover:bg-[#B16FE3] shadow-md",
    
    // Menggunakan Warna Secondary #95D5B6
    secondary: "bg-[#95D5B6] text-[#22285E] hover:bg-[#A8E0C5]",
    
    // Varian Outline menggunakan warna Primary
    outline: "border-2 border-[#9E4BDC] text-[#9E4BDC] hover:bg-[#EBDDF7]",
    
    // Varian Status Success & Warning
    success: "bg-[#00B5AD] text-white hover:opacity-90",
    warning: "bg-[#F24E1E] text-white hover:opacity-90",
    
    // Varian Polos/Neutral
    ghost: "text-[#71717A] hover:bg-[#F4F4F5]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-5 py-2.5 
        rounded-lg 
        font-medium 
        text-sm 
        transition-all 
        duration-300 
        active:scale-95 
        flex items-center justify-center gap-2
        ${variants[variant]} 
        ${className}
      `}
    >
      {children}
    </button>
  );
}