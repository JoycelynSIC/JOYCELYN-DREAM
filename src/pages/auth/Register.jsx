import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
// Pastikan path logo sudah benar sesuai struktur folder src/assets/gambarproduk/
import logoNastore from "../../assets/gambarproduk/logonastore.png"; 

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [dataForm, setDataForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi proses pendaftaran
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  return (
    /* 1. Container Utama: Menjamin posisi di tengah layar (Vertikal & Horizontal) */
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      
      <div className="w-full max-w-[400px] flex flex-col items-center animate-fadeup">
        
        {/* UI Sukses Registrasi */}
        {done ? (
          <div className="flex flex-col items-center text-center w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-[#1A1D1F] text-2xl font-bold">Akun Berhasil Dibuat!</h2>
            <p className="text-gray-400 text-sm mt-2 mb-10 leading-relaxed">
              Silahkan masuk untuk mulai mengelola <br/> toko Na_store.id kamu.
            </p>
            <Link to="/login" className="w-full bg-[#9E4BDC] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#8e3ec7] transition-all shadow-lg shadow-purple-500/20 text-center">
              Masuk Sekarang
            </Link>
          </div>
        ) : (
          /* UI Form Registrasi */
          <>
            {/* Logo */}
            <img src={logoNastore} alt="Logo" className="w-20 mb-4 object-contain" />
            
            {/* Judul Sign Up */}
            <h2 className="text-[#9E4BDC] text-[28px] font-bold mb-10">Sign Up</h2>

            <form onSubmit={handleRegister} className="w-full space-y-4" noValidate>
              {/* First Name - BG Abu-abu #F0F2F5 */}
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={dataForm.firstName}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
              />

              {/* Last Name */}
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={dataForm.lastName}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={dataForm.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
              />

              {/* Confirm Password */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={dataForm.confirmPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
              />

              {/* Keep Logged In Checkbox */}
              <div className="flex items-center text-[12px] px-1 font-medium text-gray-400">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="mr-2 accent-[#9E4BDC] w-4 h-4 rounded border-none bg-[#F0F2F5]" />
                  Keep me logged in
                </label>
              </div>

              {/* Button Sign Up */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
              </button>

              {/* Social Register */}
              <div className="flex justify-center gap-6 pt-6">
                <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="FB" />
                  Sign up with facebook
                </button>
                <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  Sign up with Google
                </button>
              </div>

              {/* Footer Link */}
              <p className="text-center text-[12px] text-gray-400 pt-6">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#9E4BDC] hover:underline transition-colors">
                  Login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}