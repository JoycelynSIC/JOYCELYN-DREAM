import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import logoNastore from "../../assets/gambarproduk/logonastore.png";
import { userAPI } from '../../services/userAPI';
import { useToast, ToastContainer } from '../../components/Toast';

export default function Register() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');
  const [dataForm, setDataForm] = useState({
    namaDepan: '', namaBelakang: '', email: '', password: '', konfirmasiPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi input
    if (!dataForm.namaDepan || !dataForm.namaBelakang || !dataForm.email || !dataForm.password || !dataForm.konfirmasiPassword) {
      setError('Semua kolom wajib diisi!');
      return;
    }

    if (dataForm.password !== dataForm.konfirmasiPassword) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }

    setLoading(true);

    try {
      // 1. Buat akun di tabel users_profile
      const newUsers = await userAPI.createUser({
        namaDepan: dataForm.namaDepan,
        namaBelakang: dataForm.namaBelakang,
        email: dataForm.email,
        password: dataForm.password,
        role: 'user',
      });

      // 2. Otomatis buat profil member di tabel customer dengan status Regular
      //    newUsers bisa berupa array (Supabase return=representation) atau object
      const newUser = Array.isArray(newUsers) ? newUsers[0] : newUsers;
      if (newUser?.id) {
        await userAPI.createCustomerProfile({
          userProfileId: newUser.id,
          namaDepan:     dataForm.namaDepan,
          namaBelakang:  dataForm.namaBelakang,
          email:         dataForm.email,
        });
      }

      showToast({
        type: 'success',
        title: 'Pendaftaran Berhasil!',
        message: 'Akun Anda berhasil dibuat. Silakan login.',
        duration: 2000
      });

      setDone(true);
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 409) {
        setError('Email sudah terdaftar!');
      } else {
        setError('Terjadi kesalahan saat pendaftaran. Pastikan API Key benar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-6 py-4 bg-[#F0F2F5] border-none rounded-2xl text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 transition-all text-sm shadow-sm";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 font-poppins">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* ── Sukses ── */}
        {done ? (
          <div className="flex flex-col items-center text-center w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#9E4BDC]/10 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-[#9E4BDC] text-4xl" />
            </div>
            <h2 className="text-[#22285E] text-2xl font-black">Akun Berhasil Dibuat!</h2>
            <p className="text-gray-400 text-sm mt-2 mb-3 leading-relaxed">
              Selamat bergabung di <span className="font-bold text-[#9E4BDC]">Na_store.id</span>
            </p>
            <p className="text-gray-400 text-xs mb-10 leading-relaxed">
              Mengarahkan Anda ke halaman login...
            </p>
          </div>
        ) : (
          /* ── Form Daftar ── */
          <>
            <img src={logoNastore} alt="Na_store.id" className="w-20 mb-2 object-contain" />
            <p className="text-[11px] text-[#A1A1AA] font-medium mb-1 tracking-wide">TOKO AKSESORIS</p>
            <h2 className="text-[#9E4BDC] text-[28px] font-black mb-1">Daftar Akun</h2>
            <p className="text-gray-400 text-xs mb-8 text-center">
              Buat akun customer Na_store.id kamu
            </p>

            {error && (
              <div className="w-full text-center py-3 px-4 rounded-xl mb-4 text-xs font-medium bg-red-50 text-red-500">
                {error}
              </div>
            )}

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
                type="email" name="email" placeholder="Email"
                value={dataForm.email} onChange={handleChange}
                className={inputClass}
              />

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

