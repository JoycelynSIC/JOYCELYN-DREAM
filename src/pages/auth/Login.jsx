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

  /* ── handleChange: update state saat input berubah ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  /* ── handleSubmit: kirim data ke API via Axios ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    axios
      .post('https://dummyjson.com/user/login', {
        username: dataForm.username,
        password: dataForm.password,
      })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data.message || 'Login gagal.');
          return;
        }
        // Simpan token & info user ke localStorage
        localStorage.setItem('token',    response.data.accessToken);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('name',     `${response.data.firstName} ${response.data.lastName}`);

        setSuccess(`Selamat datang, ${response.data.firstName}! Mengalihkan...`);
        setTimeout(() => navigate('/'), 1000);
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message || 'Username atau password salah.');
        } else {
          setError(err.message || 'Terjadi kesalahan. Coba lagi.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /* ── UI feedback ── */
  const errorInfo = error ? (
    <div className="flex items-center gap-2 bg-accent/10 border border-accent/40 text-on-primary text-xs font-semibold px-4 py-3 rounded-xl mb-4">
      <FaExclamationCircle className="text-accent shrink-0" />
      <span>{error}</span>
    </div>
  ) : null;

  const successInfo = success ? (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
      <FaCheckCircle className="text-green-500 shrink-0" />
      <span>{success}</span>
    </div>
  ) : null;

  const loadingInfo = loading ? (
    <div className="flex items-center gap-2 bg-soft border border-secondary text-gray-500 text-xs px-4 py-3 rounded-xl mb-4">
      <FaSpinner className="animate-spin text-primary shrink-0" />
      <span>Memverifikasi kredensial...</span>
    </div>
  ) : null;

  return (
    <div>
      <h2 className="text-xl font-black text-gray-700 tracking-tight">Selamat Datang</h2>
      <p className="text-gray-400 text-xs mt-1 mb-6">Masukkan kredensial admin Na_store.id</p>

      {errorInfo}
      {successInfo}
      {loadingInfo}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaEnvelope className="text-secondary" /> Username
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-300 text-xs" />
            <input
              type="text"
              name="username"
              value={dataForm.username}
              onChange={handleChange}
              className="w-full bg-soft rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-300 text-gray-600"
              placeholder="emilys"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaLock className="text-secondary" /> Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-3.5 text-gray-300 text-xs" />
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className="w-full bg-soft rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-300 text-gray-600"
              placeholder="••••••••"
              required
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
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading
            ? <><FaSpinner className="animate-spin text-xs" /> Memverifikasi...</>
            : <><FaSignInAlt className="text-xs" /> Masuk</>
          }
        </button>
      </form>

      {/* Hint kredensial untuk testing */}
      <div className="mt-5 p-3 bg-soft border border-secondary rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Kredensial Demo</p>
        <div className="flex gap-4 text-[11px] text-gray-500">
          <span>👤 <span className="font-bold text-gray-600">emilys</span></span>
          <span>🔑 <span className="font-bold text-gray-600">emilyspass</span></span>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        Belum punya akun?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-on-primary transition-colors">
          Daftar
        </Link>
      </p>
    </div>
  );
}
