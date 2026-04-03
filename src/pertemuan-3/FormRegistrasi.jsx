import React, { useState } from "react";
import { InputField, SelectField } from "./components/Input";

export default function FormRegistrasi() {
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    email: "",
    jurusan: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (name, value) => {
    let errorMsg = "";
    if (!value) return "Wajib diisi";
    
    if (name === "nama") {
      if (/[0-9]/.test(value)) errorMsg = "Nama tidak boleh ada angka";
      else if (value.length < 3) errorMsg = "Minimal 3 karakter";
    }
    if (name === "nim") {
      if (!/^[0-9]+$/.test(value)) errorMsg = "Harus angka";
      else if (value.length !== 10) errorMsg = "Harus 10 digit";
    }
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) errorMsg = "Format email salah";
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
    setIsSubmitted(false);
  };

  const isFormValid = Object.values(formData).every((v) => v !== "") && Object.values(errors).every((e) => e === "");

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0f1d] px-6 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[130px]"></div>
      </div>

      <div className="w-full max-w-7xl flex items-center justify-center gap-10 relative z-10">
        <div className="w-full max-w-[520px] bg-white rounded-[2.8rem] shadow-[0_45px_90px_-20px_rgba(0,0,0,0.55)] border border-slate-200/50">
          <div className="p-10 sm:p-12">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-10 bg-indigo-600 rounded-full"></div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Formulir Data Mahasiswa</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                Registrasi Mahasiswa
              </h1>
            </header>

            <div className="space-y-5">
              <InputField label="Nama Lengkap" name="nama" type="text" placeholder="Masukkan nama" value={formData.nama} onChange={handleChange} error={errors.nama} />

              <div className="grid grid-cols-2 gap-5">
                <InputField label="NIM" name="nim" type="text" placeholder="10 Digit" value={formData.nim} onChange={handleChange} error={errors.nim} />
                <InputField label="Email Institusi" name="email" type="email" placeholder="Masukkan Email" value={formData.email} onChange={handleChange} error={errors.email} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <SelectField 
                  label="Program Studi" 
                  name="jurusan" 
                  value={formData.jurusan} 
                  onChange={handleChange} 
                  error={errors.jurusan} 
                  opsi={[
                    { label: "Teknik Informatika", value: "Teknik Informatika" }, 
                    { label: "Sistem Informasi", value: "Sistem Informasi" }, 
                    { label: "Teknik Rekayasa Komputer", value: "Teknik Rekayasa Komputer" }
                  ]} 
                />
                <SelectField 
                  label="Status Kuliah" 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  error={errors.status} 
                  opsi={[
                    { label: "Aktif", value: "Aktif" }, 
                    { label: "Cuti", value: "Cuti" }, 
                    { label: "Magang", value: "Magang" }
                  ]} 
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsSubmitted(true)}
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-2xl font-black text-[12px] tracking-[0.25em] uppercase transition-all duration-300
                    ${isFormValid 
                      ? "bg-slate-900 text-white hover:bg-indigo-600 shadow-2xl shadow-indigo-500/25 active:scale-[0.97] cursor-pointer" 
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                >
                  Submit Registration
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSubmitted && (
          <div className="w-[380px] animate-[slideInRight_0.5s_ease-out]">
            <div className="bg-[#111827]/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-9 shadow-2xl relative overflow-hidden">
              <h3 className="text-white text-xl font-black mb-7 flex items-center gap-3">
                <span className="h-6 w-1 bg-indigo-500 rounded-full"></span>
                Review Data
              </h3>
              <div className="space-y-5">
                {Object.entries(formData).map(([key, val]) => (
                  <div key={key} className="border-b border-white/5 pb-3 last:border-0">
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-indigo-400/60 mb-1.5">{key}</p>
                    <p className="text-slate-100 font-bold text-[14px] leading-relaxed italic">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(35px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </div>
  );
}