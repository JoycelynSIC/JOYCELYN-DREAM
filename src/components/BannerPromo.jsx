/**
 * KOMPONEN 11 — BannerPromo
 * Banner ungu bergradasi dengan teks promosi + tombol CTA.
 * Mirip section "Manage your project in one touch" di figma,
 * diadaptasi untuk konteks toko aksesoris Na_store.id.
 *
 * Props:
 *  title    : string
 *  subtitle : string
 *  ctaLabel : string  — teks tombol (default "Lihat Promo")
 *  onCta    : fn
 */
export default function BannerPromo({
  title = "Kelola toko aksesorismu dalam satu sentuhan",
  subtitle = "Pantau pesanan, stok, dan pelanggan setia Na_store.id kapan saja.",
  ctaLabel = "Lihat Promo",
  onCta,
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#9E4BDC] to-[#7B2FBE] p-6 flex flex-col justify-between min-h-[160px]">
      {/* Dekorasi lingkaran latar */}
      <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute right-10 bottom-0 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
      {/* Segitiga dekoratif kanan (mirip figma) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 opacity-20 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%)",
        }}
      />

      <div className="relative z-10 max-w-[65%]">
        <h3 className="text-white font-black text-base leading-snug">{title}</h3>
        <p className="text-white/70 text-[11px] mt-2 leading-relaxed">{subtitle}</p>
      </div>

      <button
        onClick={onCta}
        className="relative z-10 mt-4 self-start bg-white text-[#9E4BDC] text-xs font-bold px-5 py-2 rounded-xl hover:bg-[#F3E8FF] transition-all active:scale-95 shadow-md"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
