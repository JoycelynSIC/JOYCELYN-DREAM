import { FaBell, FaSearch } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();
  const displayName = "Asril ibrahim"; // Sesuai mockup
  const email = "asril@rocketmail.com"; // Sesuai mockup

  return (
    <header className="px-10 py-5 flex justify-between items-center bg-white">
      <div className="flex items-center gap-10">
        <h1 className="text-[22px] font-bold text-[#22285E]">Dashboard</h1>
        
        <div className="relative hidden lg:block">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6ABC8] text-sm" />
          <input 
            type="text" 
            placeholder="Search"
            className="pl-10 pr-4 py-2 bg-white border border-[#E0E4EC] rounded-full text-sm w-[350px] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-[#22285E]">
          <FaBell className="text-xl" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#9E4BDC] rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#22285E] leading-tight">{displayName}</p>
            <p className="text-[10px] text-[#7B7E9E]">{email}</p>
          </div>
          {/* Avatar menggunakan initial AI sesuai image_eea039.png */}
          <div className="w-10 h-10 rounded-full bg-[#9E4BDC] flex items-center justify-center text-white text-xs font-bold border-2 border-[#F4F7FE]">
            AI
          </div>
        </div>
      </div>
    </header>
  );
}