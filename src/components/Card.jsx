/**
 * KOMPONEN 10 — Card
 * Wadah konten putih dengan border radius dan shadow.
 * Dipakai untuk section grafik, tabel, form, dll.
 *
 * Props:
 *  title     : string  — judul section (opsional)
 *  subtitle  : string  — keterangan di bawah judul (opsional)
 *  action    : ReactNode — slot kanan header (tombol, filter, dll)
 *  padding   : boolean — default true
 *  className : string
 *  children  : ReactNode
 */
export default function Card({
  title,
  subtitle,
  action,
  padding = true,
  className = "",
  children,
}) {
  return (
    <div className={`bg-white border border-[#E4E4E7] rounded-2xl ${padding ? "p-6" : ""} ${className}`}>
      {/* Header card (hanya tampil jika ada title) */}
      {(title || action) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && (
              <h3 className="text-base font-bold text-[#22285E] leading-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-[#71717A] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
