/**
 * KOMPONEN 6 — PageHeader
 * Judul halaman + breadcrumb + slot tombol aksi di kanan.
 * Dipakai di semua halaman admin.
 *
 * Props:
 *  title      : string
 *  breadcrumb : string | string[]
 *  children   : ReactNode — tombol aksi (opsional)
 */
import { FaChevronRight, FaHome } from "react-icons/fa";

export default function PageHeader({ title, breadcrumb, children }) {
  const crumbs = Array.isArray(breadcrumb)
    ? breadcrumb
    : breadcrumb
    ? [breadcrumb]
    : [];

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Kiri: judul + breadcrumb */}
      <div>
        <h2 className="text-xl font-black text-[#22285E] tracking-tight leading-tight">
          {title}
        </h2>
        {crumbs.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <FaHome className="text-[#9E4BDC] text-[10px]" />
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <FaChevronRight className="text-[#A1A1AA] text-[9px]" />
                <span
                  className={`text-[11px] font-medium ${
                    i === crumbs.length - 1
                      ? "text-[#9E4BDC] font-bold"
                      : "text-[#A1A1AA]"
                  }`}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Kanan: slot tombol */}
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}
