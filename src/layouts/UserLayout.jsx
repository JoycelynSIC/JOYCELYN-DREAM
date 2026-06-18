import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import logoNastore from "../assets/gambarproduk/logonastore.png";
import { FaGift, FaShoppingBag, FaShieldAlt } from "react-icons/fa";

export default function UserLayout() {
  // Smooth scroll handler for footer links
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-poppins flex flex-col">
      {/* Premium Decoupled Navbar */}
      <Navbar />

      {/* Main Content Area for Customers */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Premium E-Commerce Footer */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Col 1: Brand details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={logoNastore} alt="Logo" className="w-8 h-8 object-contain" />
              <p className="font-black text-sm tracking-wide text-[#22285E]">Na_store.id</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Menyediakan aksesoris premium mulai dari cincin couple, kalung rosegold, gelang crystal, hingga nail art custom buatan tangan.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-[#22285E] uppercase tracking-wider mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("catalog")} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Katalog Aksesoris
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("loyalty")} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Poin & Reward
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("orders")} className="hover:text-[#9E4BDC] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  Status Transaksi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Service benefits */}
          <div>
            <h4 className="text-xs font-bold text-[#22285E] uppercase tracking-wider mb-3">Jaminan Belanja</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li className="flex items-center gap-2">
                <FaShieldAlt className="text-[#9E4BDC]" /> Transaksi Aman REST API
              </li>
              <li className="flex items-center gap-2">
                <FaGift className="text-[#9E4BDC]" /> Poin Reward Belanja
              </li>
              <li className="flex items-center gap-2">
                <FaShoppingBag className="text-[#9E4BDC]" /> Kualitas Produk Terbaik
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#22285E] uppercase tracking-wider">Info Koleksi Baru</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Masukkan email untuk mendapatkan pembaruan info diskon dan restok produk terlaris kami.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Terima kasih sudah mendaftar!"); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Alamat Email"
                className="w-full bg-[#F4F4F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#22285E] placeholder-gray-400 focus:outline-none focus:border-[#9E4BDC] focus:ring-1 focus:ring-[#9E4BDC]"
              />
              <button
                type="submit"
                className="bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          <p>© 2026 Na_store.id. Semua Hak Dilindungi Undang-Undang.</p>
          <p className="mt-1 font-medium text-[#9E4BDC]">Premium Accessories Portal - Powered by Supabase & Axios</p>
        </div>
      </footer>
    </div>
  );
}
