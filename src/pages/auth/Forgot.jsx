import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import logoNastore from "../../assets/gambarproduk/logonastore.png";

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    /* Container Utama: Membuat semua konten berada di tengah (Center) */
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      
      <div className="w-full max-w-[400px] flex flex-col items-center animate-fadeup">
        
        {/* LOGO */}
        <img src={logoNastore} alt="Logo" className="w-20 mb-4 object-contain" />

        {/* LOGIC TAMPILAN: JIKA SUDAH TERKIRIM VS FORM INPUT */}
        {sent ? (
          /* --- TAMPILAN SUKSES --- */
          <div className="flex flex-col items-center text-center w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-[#1A1D1F] text-2xl font-bold">Email Terkirim!</h2>
            <p className="text-gray-400 text-sm mt-3 mb-10 leading-relaxed">
              Cek inbox kamu. Link reset password sudah dikirim ke: <br />
              <span className="font-bold text-[#9E4BDC]">{email}</span>
            </p>
            <Link to="/login" className="w-full bg-[#9E4BDC] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#8e3ec7] transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
              <FaArrowLeft className="text-[10px]" /> Kembali ke Login
            </Link>
          </div>
        ) : (
          /* --- TAMPILAN FORM --- */
          <>
            <h2 className="text-[#9E4BDC] text-[28px] font-bold mb-2 text-center">Forgot Password</h2>
            <p className="text-gray-400 text-[13px] mb-10 text-center leading-relaxed">
              Masukkan email kamu untuk menerima <br /> link pemulihan kata sandi.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
              {/* Email Input - BG Abu-abu #F0F2F5 */}
              <div className="space-y-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
                />
              </div>

              {/* Tombol Kirim */}
              <button
                type="submit"
                className="w-full bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <FaPaperPlane className="text-[10px]" /> Send Recovery Link
              </button>

              {/* Link Kembali */}
              <div className="pt-6 text-center">
                <p className="text-[13px] text-gray-400">
                  Remember your password?{' '}
                  <Link to="/login" className="font-bold text-[#9E4BDC] hover:underline transition-colors">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}