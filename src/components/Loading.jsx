export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-neutral font-poppins">
      <div className="w-12 h-12 border-4 border-surface-border border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-text-dark font-bold text-sm">Na_store.id</p>
      <p className="text-text-disable text-xs mt-1">Memuat halaman...</p>
    </div>
  );
}
