import { Outlet } from "react-router-dom";
import logoNastore from "../assets/gambarproduk/logonastore.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden flex min-h-[520px]">

        {/* ── Kiri: Dekorasi Wave ── */}
        <div className="relative hidden md:flex w-2/5 bg-primary overflow-hidden shrink-0">
          {/* Wave layer 1 — lebih terang */}
          <svg
            viewBox="0 0 200 600"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L200,0 L200,600 L0,600 Z"
              fill="#FFB9B9"
            />
            <path
              d="M200,0 Q120,150 160,300 Q200,450 120,600 L200,600 Z"
              fill="#FFDDD2"
            />
            <path
              d="M200,0 Q80,200 140,350 Q180,480 100,600 L200,600 Z"
              fill="#FFF5F5"
              opacity="0.6"
            />
          </svg>

          {/* Logo + teks di tengah panel kiri */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full gap-4 px-8">
            <img
              src={logoNastore}
              alt="Na_store.id"
              className="w-20 h-20 rounded-3xl object-cover shadow-lg"
            />
            <div className="text-center">
              <p className="text-on-primary font-black text-xl tracking-tight">Na_store.id</p>
              <p className="text-on-primary/70 text-xs mt-1 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* ── Kanan: Form ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-10 relative">

          {/* Dekorasi lingkaran pojok kanan atas */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full border-[12px] border-secondary opacity-50 pointer-events-none" />

          {/* Logo mobile (hanya muncul di layar kecil) */}
          <div className="flex items-center gap-3 mb-6 md:hidden">
            <img src={logoNastore} alt="Na_store.id" className="w-9 h-9 rounded-xl object-cover" />
            <p className="font-black text-on-primary text-sm">Na_store.id</p>
          </div>

          <Outlet />
        </div>

      </div>
    </div>
  );
}
