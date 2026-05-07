import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logoNastore from "../../assets/gambarproduk/logonastore.png";
import { FaSpinner } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  /* ── State ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dataForm, setDataForm] = useState({
    username: '',
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

    if (!dataForm.username || !dataForm.password) {
      setError('Username dan password wajib diisi!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: dataForm.username,
        password: dataForm.password,
      });

      localStorage.setItem('token', response.data.token);
      setSuccess(`Selamat datang, ${response.data.firstName}!`);
      setTimeout(() => navigate('/'), 1500);
      
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login gagal.');
      } else {
        setError('Koneksi bermasalah.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Container Utama: min-h-screen dan justify-center untuk vertikal, items-center untuk horizontal */
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      
      <div className="w-full max-w-[400px] flex flex-col items-center animate-fadeup">
        
        {/* Logo */}
        <img src={logoNastore} alt="Logo" className="w-20 mb-4 object-contain" />
        
        {/* Judul Login */}
        <h2 className="text-[#9E4BDC] text-[28px] font-bold mb-10">Login</h2>

        {/* --- BOX PESAN --- */}
        {(error || success) && (
          <div className={`w-full text-center py-3 px-4 rounded-xl mb-6 text-xs font-medium animate-in fade-in zoom-in ${error ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
            {error || success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
          {/* Username Input - Background Abu-abu #F0F2F5 */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={dataForm.username}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
          />

          {/* Password Input - Background Abu-abu #F0F2F5 */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={dataForm.password}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm"
          />

          {/* Keep Logged In & Forgot Password */}
          <div className="flex items-center justify-between text-[12px] px-1 font-medium">
            <label className="flex items-center text-gray-400 cursor-pointer group">
              <input type="checkbox" className="mr-2 accent-[#9E4BDC] w-4 h-4 rounded border-none bg-[#F0F2F5]" />
              Keep me logged in
            </label>
            <Link to="/forgot" className="text-[#9E4BDC] hover:underline font-bold">
              Forget Password!
            </Link>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Login"}
          </button>

          {/* Social Login */}
          <div className="flex justify-center gap-6 pt-6">
            <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
              Login with facebook
            </button>
            <button type="button" className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors font-medium">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Login with Google
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-[12px] text-gray-400 pt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#9E4BDC] hover:underline">
              Create now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}