import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaUserPlus, FaCheckCircle
} from 'react-icons/fa';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [done, setDone]         = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (name && email && password.length >= 6) setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-on-primary text-2xl" />
        </div>
        <h2 className="text-lg font-black text-gray-700">Akun Dibuat!</h2>
        <p className="text-gray-400 text-xs mt-2 mb-6">Selamat datang, <span className="font-bold text-gray-600">{name}</span>!</p>
        <Link to="/login"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-primary-hover transition-all">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeup">
      <h2 className="text-2xl font-black text-gray-700 tracking-tight mb-1">Buat Akun</h2>
      <p className="text-gray-400 text-xs mb-6">Daftarkan akun admin baru</p>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nama */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaUser className="text-secondary" /> Nama Lengkap
          </label>
          <div className="relative">
            <FaUser className="absolute left-3.5 top-3.5 text-gray-300 text-xs" />
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-soft rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-300 text-gray-600"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaEnvelope className="text-secondary" /> Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-300 text-xs" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-soft rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-300 text-gray-600"
              placeholder="admin@nastore.com"
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
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-soft rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-300 text-gray-600"
              placeholder="Min. 6 karakter"
            />
          </div>
        </div>

        <button type="submit"
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2">
          <FaUserPlus className="text-xs" /> Daftar Sekarang
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-on-primary transition-colors">
          Masuk
        </Link>
      </p>
    </div>
  );
}
