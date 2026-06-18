import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoNastore from "../../assets/gambarproduk/logonastore.png";
import { FaSpinner } from 'react-icons/fa';
import { userAPI } from '../../services/userAPI';

export default function Login() {
  /* ── State ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dataForm, setDataForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!dataForm.email || !dataForm.password) {
      setError('Email dan password wajib diisi!');
      return;
    }

    setLoading(true);

    try {
      const users = await userAPI.login(dataForm.email, dataForm.password);

      if (users.length === 0) {
        setError('Email atau password salah!');
        return;
      }

      const loggedInUser = users[0];

      // 1. Simpan token dan data user ke localStorage
      localStorage.setItem('token', loggedInUser.id);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      setSuccess(`Selamat datang, ${loggedInUser.namaDepan}!`);
      
      // 2. Redirect menggunakan window.location agar App.jsx mengecek ulang token
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Koneksi bermasalah atau API Key tidak valid.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      <div className="w-full max-w-[400px] flex flex-col items-center animate-fadeup">
        
        <img src={logoNastore} alt="Logo" className="w-20 mb-4 object-contain" />
        <h2 className="text-[#9E4BDC] text-[28px] font-bold mb-10">Login</h2>

        {(error || success) && (
          <div className={`w-full text-center py-3 px-4 rounded-xl mb-6 text-xs font-medium ${error ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
            {error || success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={dataForm.email}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 text-sm shadow-sm"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={dataForm.password}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 text-sm shadow-sm"
          />

          <div className="flex items-center justify-between text-[12px] px-1 font-medium">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 accent-[#9E4BDC] w-4 h-4" />
              Tetap masuk
            </label>
            <Link to="/forgot" className="text-[#9E4BDC] font-bold hover:underline">
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Masuk"}
          </button>

          <div className="flex justify-center gap-6 pt-6">
            <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="FB" />
              Masuk dengan Facebook
            </button>
            <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Masuk dengan Google
            </button>
          </div>

          <p className="text-center text-[12px] text-gray-400 pt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-[#9E4BDC] hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}