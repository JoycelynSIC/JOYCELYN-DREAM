/**
 * KOMPONEN 9 — Loading
 * Layar penuh saat lazy-load halaman.
 */
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F4F5] font-poppins">
      {/* Spinner cincin ungu */}
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 border-4 border-[#E4E4E7] border-t-[#9E4BDC] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 bg-[#9E4BDC] rounded-full opacity-20 animate-ping" />
        </div>
      </div>
      <p className="mt-5 text-[#22285E] font-black text-sm tracking-wide">Na_store.id</p>
      <p className="text-[#A1A1AA] text-xs mt-1">Memuat halaman...</p>
    </div>
  );
}
