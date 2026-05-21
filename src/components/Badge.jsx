import { FaCheckCircle, FaSpinner, FaTruck, FaTimesCircle } from 'react-icons/fa';

export default function Badge({ status }) {
  // Mapping konfigurasi berdasarkan palette warna kamu
  const configs = {
    "Selesai": {
      bg: "bg-[#00B5AD]/10",
      text: "text-[#00B5AD]",
      border: "border-[#00B5AD]/20",
      icon: <FaCheckCircle className="text-[10px]" />
    },
    "Proses": {
      bg: "bg-[#F4F4F5]",
      text: "text-[#71717A]",
      border: "border-[#E4E4E7]",
      icon: <FaSpinner className="text-[10px] animate-spin" />
    },
    "Dikirim": {
      bg: "bg-[#95D5B6]/20",
      text: "text-[#22285E]",
      border: "border-[#95D5B6]/30",
      icon: <FaTruck className="text-[10px]" />
    },
    "Batal": {
      bg: "bg-[#F24E1E]/10",
      text: "text-[#F24E1E]",
      border: "border-[#F24E1E]/20",
      icon: <FaTimesCircle className="text-[10px]" />
    }
  };

  const config = configs[status] || configs["Proses"];

  return (
    <div className={`
      inline-flex items-center gap-1.5 
      px-2.5 py-1 
      rounded-lg 
      text-[10px] 
      font-bold 
      border
      ${config.bg} ${config.text} ${config.border}
    `}>
      {config.icon}
      {status}
    </div>
  );
}