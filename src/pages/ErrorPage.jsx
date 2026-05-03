import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle, FaLock, FaBan } from 'react-icons/fa';

export default function ErrorPage({ kode, deskripsi, gambar }) {
  const navigate = useNavigate();

  // Warna & label default per kode error
  const config = {
    400: { label: 'Bad Request',   color: 'text-orange-400', bg: 'bg-orange-50',  border: 'border-orange-200' },
    401: { label: 'Unauthorized',  color: 'text-yellow-500', bg: 'bg-yellow-50',  border: 'border-yellow-200' },
    403: { label: 'Forbidden',     color: 'text-[#9d2a5e]',  bg: 'bg-[#FFF5F5]', border: 'border-[#FFDDD2]'  },
    404: { label: 'Not Found',     color: 'text-gray-400',   bg: 'bg-gray-50',    border: 'border-gray-200'   },
  }[kode] ?? { label: 'Error', color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className={`w-full max-w-md text-center bg-white border ${config.border} rounded-3xl p-10 shadow-sm`}>

        {/* Ilustrasi / Icon */}
        <div className={`w-24 h-24 ${config.bg} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
          {gambar ?? (
            <FaExclamationTriangle className={`${config.color} text-4xl`} />
          )}
        </div>

        {/* Kode error */}
        <p className={`text-7xl font-black ${config.color} leading-none mb-2`}>
          {kode}
        </p>

        {/* Label */}
        <p className="text-base font-black text-gray-700 mb-3">{config.label}</p>

        {/* Deskripsi */}
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          {deskripsi}
        </p>

        {/* Tombol kembali */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-[#FFB9B9] text-[#9d2a5e] px-6 py-3 rounded-2xl text-sm font-bold hover:bg-[#ffacc7] transition-all active:scale-95 mr-3"
        >
          <FaArrowLeft className="text-xs" /> Kembali
        </button>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 border border-[#FFDDD2] text-gray-400 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-[#FFF5F5] transition-all active:scale-95"
        >
          Dashboard
        </button>

      </div>
    </div>
  );
}
