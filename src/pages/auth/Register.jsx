import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaGem } from 'react-icons/fa';
import logoNastore from "../../assets/gambarproduk/logonastore.png";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [dataForm, setDataForm] = useState({
    namaDepan: '', namaBelakang: '', password: '', konfirmasiPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  const inputClass =
    "w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      <div className="w-full max-w-[400px] flex flex-col items-center">

        {/* ── Sukses ── */}
        {done ? (
          <div className="flex flex-col items-center text-center w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#9E4BDC]/10 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-[#9E4BDC] text-4xl" />
            </div>
            <h2 className="text-[#22285E] text-2xl font-black">Akun Berhasil Dibuat!</h2>
            <p className="text-gray-400 text-sm mt-2 mb-3 leading-relaxed">
              Selamat bergabung di <span className="font-bold text-[#9E4BDC]">Na_store.id</span> 🎉
            </p>
            <p className="text-gray-400 text-xs mb-10 leading-relaxed">
              Masuk sekarang untuk mulai mengelola toko aksesoris kamu — gelang, kalung, anting, dan lebih banyak lagi.
            </p>
            <Link
              to="/login"
              className="w-full bg-[#9E4BDC] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#8e3ec7] transition-all shadow-lg shadow-purple-500/20 text-center"
            >
              Masuk Sekarang
            </Link>
          </div>
        ) : (
          /* ── Form Daftar ── */
          <>
            <img src={logoNastore} alt="Na_store.id" className="w-20 mb-2 object-contain" />
            <p className="text-[11px] text-[#A1A1AA] font-medium mb-1 tracking-wide">TOKO AKSESORIS</p>
            <h2 className="text-[#9E4BDC] text-[28px] font-black mb-1">Daftar Akun</h2>
            <p className="text-gray-400 text-xs mb-8 text-center">
              Buat akun admin Na_store.id kamu
            </p>

            <form onSubmit={handleRegister} className="w-full space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text" name="namaDepan" placeholder="Nama depan"
                  value={dataForm.namaDepan} onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="text" name="namaBelakang" placeholder="Nama belakang"
                  value={dataForm.namaBelakang} onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <input
                type="password" name="password" placeholder="Password"
                value={dataForm.password} onChange={handleChange}
                className={inputClass}
              />

              <input
                type="password" name="konfirmasiPassword" placeholder="Konfirmasi password"
                value={dataForm.konfirmasiPassword} onChange={handleChange}
                className={inputClass}
              />

              <div className="flex items-center text-[12px] px-1 font-medium text-gray-400">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 accent-[#9E4BDC] w-4 h-4" />
                  Tetap masuk
                </label>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Daftar Sekarang"}
              </button>

              {/* Social */}
              <div className="flex justify-center gap-6 pt-4">
                <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="FB" />
                  Daftar via Facebook
                </button>
                <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  Daftar via Google
                </button>
              </div>

              <p className="text-center text-[12px] text-gray-400 pt-4">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-bold text-[#9E4BDC] hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
