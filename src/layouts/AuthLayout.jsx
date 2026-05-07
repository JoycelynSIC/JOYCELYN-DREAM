import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-white font-poppins overflow-hidden relative">
      
      {/* ── SISI KIRI: Dekorasi Gelombang Organik ── */}
      <div className="relative hidden md:flex w-[40%] h-screen shrink-0">
        <svg
          viewBox="0 0 500 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Layer Bayangan/Soft Wave */}
          <path
            d="M0,0 C150,0 350,150 280,500 C210,850 350,1000 0,1000 Z"
            fill="var(--color-primary)"
            opacity="0.1"
          />
          {/* Layer Utama - Lengkungan Persis Mockup */}
          <path
            d="M0,0 
               C250,0 450,250 350,500 
               C250,750 450,1000 0,1000 
               Z"
            fill="var(--color-primary)"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* ── SISI KANAN: Area Login ── */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
        
        {/* Dekorasi Lingkaran Tipis di Pojok Kanan Atas (Aksen Figma) */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] border border-primary/20 rounded-full pointer-events-none" />

        {/* Konten Form (Outlet) */}
        <div className="w-full max-w-[400px] px-8 z-10">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
}