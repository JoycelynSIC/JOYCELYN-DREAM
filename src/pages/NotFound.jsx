import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-6">
      <div className="text-center max-w-md">

        {/* Icon */}
        <div className="w-24 h-24 bg-[#FFB9B9] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FaExclamationTriangle className="text-[#9d2a5e] text-4xl" />
        </div>

        {/* Kode error */}
        <h1 className="text-8xl font-black text-[#FFB9B9] leading-none mb-2">404</h1>

        {/* Pesan */}
        <h2 className="text-2xl font-black text-gray-700 tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Coba kembali ke dashboard Na_store.id.
        </p>

        {/* Tombol aksi */}
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 bg-[#FFB9B9] text-[#9d2a5e] px-5 py-3 rounded-2xl text-sm font-bold hover:bg-[#ffacc7] transition-all active:scale-95"
          >
            <FaHome className="text-xs" /> Ke Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-[#FFDDD2] text-gray-400 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-[#FFF5F5] transition-all"
          >
            <FaArrowLeft className="text-xs" /> Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
