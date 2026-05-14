import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorPage({ kode, deskripsi, gambar }) {
  const navigate = useNavigate();

  const config = {
    400: { label: 'Bad Request',  color: 'text-status-warning', bg: 'bg-status-warning/10', border: 'border-status-warning/20' },
    401: { label: 'Unauthorized', color: 'text-yellow-500',     bg: 'bg-yellow-50',         border: 'border-yellow-200'        },
    403: { label: 'Forbidden',    color: 'text-status-warning', bg: 'bg-status-warning/10', border: 'border-status-warning/20' },
    404: { label: 'Not Found',    color: 'text-text-disable',   bg: 'bg-surface-gray',      border: 'border-surface-border'    },
  }[kode] ?? { label: 'Error', color: 'text-text-disable', bg: 'bg-surface-gray', border: 'border-surface-border' };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-500 font-poppins">
      <div className={`w-full max-w-md text-center bg-surface-white border ${config.border} rounded-2xl p-10 shadow-sm`}>

        {/* Icon */}
        <div className={`w-20 h-20 ${config.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          {gambar ?? <FaExclamationTriangle className={`${config.color} text-3xl`} />}
        </div>

        {/* Kode */}
        <p className={`text-7xl font-black ${config.color} leading-none mb-2`}>{kode}</p>

        {/* Label */}
        <p className="text-base font-black text-text-dark mb-3">{config.label}</p>

        {/* Deskripsi */}
        <p className="text-sm text-text-light leading-relaxed mb-8">{deskripsi}</p>

        {/* Tombol */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-primary text-surface-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95">
            <FaArrowLeft className="text-xs" /> Kembali
          </button>
          <button onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 border border-surface-border text-text-light px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-surface-neutral transition-all active:scale-95">
            Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
