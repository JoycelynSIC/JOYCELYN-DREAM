export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF5F5]">
      <div className="w-12 h-12 border-4 border-[#FFB9B9] border-t-[#FF8DC7] rounded-full animate-spin"></div>
      <p className="mt-4 text-[#9d2a5e] font-bold text-sm">Na_store.id</p>
      <p className="text-[#FF8DC7] text-xs mt-1">Memuat halaman...</p>
    </div>
  );
}
