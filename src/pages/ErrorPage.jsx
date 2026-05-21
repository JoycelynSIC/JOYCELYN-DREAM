import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationTriangle, FaLock, FaBan, FaSearch } from 'react-icons/fa';
import logoNastore from '../assets/gambarproduk/logonastore.png';

export default function ErrorPage({ kode, deskripsi, gambar }) {
  const navigate = useNavigate();

  const config = {
    400: {
      label:  'Permintaan Tidak Valid',
      desc:   'Data yang dikirim tidak sesuai format sistem Na_store.id.',
      color:  'text-[#F24E1E]',
      bg:     'bg-[#F24E1E]/10',
      border: 'border-[#F24E1E]/20',
      icon:   <FaExclamationTriangle className="text-[#F24E1E] text-3xl" />,
    },
    401: {
      label:  'Sesi Berakhir',
      desc:   'Kamu belum login atau sesi admin Na_store.id telah berakhir. Silakan masuk kembali.',
      color:  'text-yellow-500',
      bg:     'bg-yellow-50',
      border: 'border-yellow-200',
      icon:   <FaLock className="text-yellow-500 text-3xl" />,
    },
    403: {
      label:  'Akses Ditolak',
      desc:   'Kamu tidak memiliki izin untuk mengakses halaman ini di Na_store.id.',
      color:  'text-[#F24E1E]',
      bg:     'bg-[#F24E1E]/10',
      border: 'border-[#F24E1E]/20',
      icon:   <FaBan className="text-[#F24E1E] text-3xl" />,
    },
    404: {
      label:  'Halaman Tidak Ditemukan',
      desc:   'Halaman yang kamu cari tidak ada atau sudah dipindahkan.',
      color:  'text-[#A1A1AA]',
      bg:     'bg-[#F4F4F5]',
      border: 'border-[#E4E4E7]',
      icon:   <FaSearch className="text-[#A1A1AA] text-3xl" />,
    },
  }[kode] ?? {
    label:  'Terjadi Kesalahan',
    desc:   'Ada yang tidak beres di sistem Na_store.id. Coba lagi nanti.',
    color:  'text-[#A1A1AA]',
    bg:     'bg-[#F4F4F5]',
    border: 'border-[#E4E4E7]',
    icon:   <FaExclamationTriangle className="text-[#A1A1AA] text-3xl" />,
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-500 font-poppins">
      <div className={`w-full max-w-md text-center bg-white border ${config.border} rounded-2xl p-10 shadow-sm`}>

        {/* Logo kecil */}
        <img src={logoNastore} alt="Na_store.id" className="w-10 mx-auto mb-6 object-contain opacity-30" />

        {/* Ikon */}
        <div className={`w-20 h-20 ${config.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          {gambar ?? config.icon}
        </div>

        {/* Kode error */}
        <p className={`text-7xl font-black ${config.color} leading-none mb-2`}>{kode}</p>

        {/* Label */}
        <p className="text-base font-black text-[#22285E] mb-3">{config.label}</p>

        {/* Deskripsi — pakai prop jika ada, fallback ke config */}
        <p className="text-sm text-[#71717A] leading-relaxed mb-8">
          {deskripsi || config.desc}
        </p>

        {/* Tombol */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#9E4BDC] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#B16FE3] transition-all active:scale-95 shadow-md shadow-[#9E4BDC]/20"
          >
            <FaArrowLeft className="text-xs" /> Kembali
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 border border-[#E4E4E7] text-[#71717A] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#F4F4F5] transition-all active:scale-95"
          >
            Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
