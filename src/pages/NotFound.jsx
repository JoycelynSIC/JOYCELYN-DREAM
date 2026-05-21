import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaGem } from 'react-icons/fa';
import logoNastore from '../assets/gambarproduk/logonastore.png';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-6 font-poppins">
      <div className="text-center max-w-md">

        {/* Logo */}
        <img src={logoNastore} alt="Na_store.id" className="w-16 mx-auto mb-6 object-contain opacity-40" />

        {/* Angka 404 besar */}
        <h1 className="text-[120px] font-black text-[#9E4BDC]/20 leading-none mb-0 select-none">
          404
        </h1>

        {/* Ikon aksesoris */}
        <div className="w-20 h-20 bg-[#9E4BDC]/10 rounded-3xl flex items-center justify-center mx-auto -mt-6 mb-6 shadow-sm">
          <FaGem className="text-[#9E4BDC] text-3xl" />
        </div>

        <h2 className="text-2xl font-black text-[#22285E] tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm text-[#71717A] leading-relaxed mb-8">
          Sepertinya aksesoris yang kamu cari sudah habis terjual 😅<br />
          Halaman ini tidak ada atau sudah dipindahkan.<br />
          Yuk kembali ke dashboard Na_store.id.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 bg-[#9E4BDC] text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-[#B16FE3] transition-all active:scale-95 shadow-md shadow-[#9E4BDC]/20"
          >
            <FaHome className="text-xs" /> Ke Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-[#E4E4E7] text-[#71717A] px-5 py-3 rounded-2xl text-sm font-bold hover:bg-white transition-all active:scale-95"
          >
            <FaArrowLeft className="text-xs" /> Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
