import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope, FaLock, FaPaperPlane, FaCheckCircle, FaArrowLeft
} from 'react-icons/fa';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-on-primary text-2xl" />
        </div>
        <h2 className="text-lg font-black text-gray-700 tracking-tight">Email Terkirim!</h2>
        <p className="text-gray-400 text-xs mt-2 mb-6 leading-relaxed">
          Cek inbox kamu. Link reset password sudah dikirim ke{' '}
          <span className="font-semibold text-gray-600">{email}</span>
        </p>
        <Link to="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-on-primary transition-colors">
          <FaArrowLeft className="text-[10px]" /> Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Icon */}
      <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
        <FaLock className="text-accent text-lg" />
      </div>

      <h2 className="text-xl font-black text-gray-700 tracking-tight">Lupa Password?</h2>
      <p className="text-gray-400 text-xs mt-1 mb-6 leading-relaxed">
        Masukkan email kamu dan kami akan kirimkan link untuk reset password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
            <FaEnvelope className="text-secondary" /> Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-300 text-xs" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-soft rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-gray-300 text-gray-600"
              placeholder="admin@nastore.com"
            />
          </div>
        </div>

        <button type="submit"
          className="w-full bg-accent text-white py-3 rounded-xl font-bold text-sm hover:bg-[#ff6db3] transition-all active:scale-95 flex items-center justify-center gap-2">
          <FaPaperPlane className="text-xs" /> Kirim Link Reset
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Ingat password kamu?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-on-primary transition-colors">
          Masuk
        </Link>
      </p>
    </div>
  );
}
