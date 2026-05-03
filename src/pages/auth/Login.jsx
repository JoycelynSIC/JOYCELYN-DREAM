import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle,
  FaSpinner, FaCheckCircle
} from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  /* ── State ── */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [dataForm, setDataForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
    // Hapus error saat user mulai ngetik lagi biar box merahnya ilang
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Matikan validasi default browser ("Please fill out this field")
    setError('');
    setSuccess('');

    // Validasi manual sebelum tembak API (opsional tapi bagus buat UX)
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
      // Nampilin error spesifik dari API ke dalam Card
      if (err.response) {
        setError(err.response.data.message || 'Login gagal, periksa kembali akun Anda.');
      } else {
        setError('Koneksi bermasalah. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeup">
      <h2 className="text-2xl font-black text-gray-700 tracking-tight mb-1">Masuk</h2>
      <p className="text-gray-400 text-xs mb-6">Masukkan kredensial admin Na_store.id</p>

      {/* --- BOX ERROR (CUSTOM UI) --- */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold px-4 py-3 rounded-xl mb-4 animate-in fade-in zoom-in duration-200">
          <FaExclamationCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* --- BOX SUCCESS --- */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold px-4 py-3 rounded-xl mb-4">
          <FaCheckCircle className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate> 
        {/* 'noValidate' mastiin browser gak ngeluarin popup default */}

        {/* Username */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaEnvelope className="text-secondary" /> Username
          </label>
          <div className="relative">
            <FaEnvelope className={`absolute left-3.5 top-3.5 text-xs transition-colors ${error ? 'text-red-400' : 'text-gray-300'}`} />
            <input
              type="text"
              name="username"
              value={dataForm.username}
              onChange={handleChange}
              className={`w-full rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-300 
                ${error 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-soft text-gray-600 focus:ring-2 focus:ring-primary border border-transparent'}`}
              placeholder="Masukkan Username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaLock className="text-secondary" /> Password
          </label>
          <div className="relative">
            <FaLock className={`absolute left-3.5 top-3.5 text-xs transition-colors ${error ? 'text-red-400' : 'text-gray-300'}`} />
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className={`w-full rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-300 
                ${error 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-soft text-gray-600 focus:ring-2 focus:ring-primary border border-transparent'}`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot" className="text-[11px] font-semibold text-accent hover:text-on-primary transition-colors flex items-center gap-1">
            <FaLock className="text-[9px]" /> Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading
            ? <><FaSpinner className="animate-spin text-xs" /> Memverifikasi...</>
            : <><FaSignInAlt className="text-xs" /> Masuk</>
          }
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Belum punya akun?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-on-primary transition-colors">
          Daftar
        </Link>
      </p>
    </div>
  );
}