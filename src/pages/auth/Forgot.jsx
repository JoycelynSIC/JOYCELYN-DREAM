import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import logoNastore from "../../assets/gambarproduk/logonastore.png";

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      <div className="w-full max-w-[400px] flex flex-col items-center">

        <img src={logoNastore} alt="Na_store.id" className="w-20 mb-2 object-contain" />
        <p className="text-[11px] text-[#A1A1AA] font-medium mb-4 tracking-wide">TOKO AKSESORIS</p>

        {sent ? (
          /* ── Sukses ── */
          <div className="flex flex-col items-center text-center w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#9E4BDC]/10 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-[#9E4BDC] text-4xl" />
            </div>
            <h2 className="text-[#22285E] text-2xl font-black">Email Terkirim!</h2>
            <p className="text-gray-400 text-sm mt-3 mb-2 leading-relaxed">
              Link reset password sudah dikirim ke:
            </p>
            <p className="font-bold text-[#9E4BDC] text-sm mb-10">{email}</p>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed">
              Cek inbox atau folder spam kamu. Setelah reset, kamu bisa masuk kembali ke admin panel Na_store.id.
            </p>
            <Link
              to="/login"
              className="w-full bg-[#9E4BDC] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#8e3ec7] transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-[10px]" /> Kembali ke Login
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <h2 className="text-[#9E4BDC] text-[28px] font-black mb-2 text-center">Lupa Password?</h2>
            <p className="text-gray-400 text-[13px] mb-10 text-center leading-relaxed">
              Masukkan email akun admin Na_store.id kamu.<br />
              Kami akan kirimkan link pemulihan kata sandi.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email admin Na_store.id"
                required
                className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
              />

              <button
                type="submit"
                className="w-full bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <FaPaperPlane className="text-[10px]" /> Kirim Link Pemulihan
              </button>

              <p className="text-center text-[13px] text-gray-400 pt-4">
                Ingat password kamu?{' '}
                <Link to="/login" className="font-bold text-[#9E4BDC] hover:underline">
                  Masuk
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
