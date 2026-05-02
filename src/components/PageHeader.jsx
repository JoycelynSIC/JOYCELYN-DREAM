import { FaChevronRight, FaHome } from 'react-icons/fa';

/**
 * PageHeader — Reusable component (Pertemuan 3 & 6)
 *
 * Props:
 *   title      : string  — judul halaman
 *   breadcrumb : string | string[] — breadcrumb navigasi
 *   children   : ReactNode — tombol aksi atau konten tambahan di kanan
 */
export default function PageHeader({ title, breadcrumb, children }) {
  // Normalkan breadcrumb: bisa string tunggal atau array
  const crumbs = Array.isArray(breadcrumb)
    ? breadcrumb
    : breadcrumb
    ? [breadcrumb]
    : [];

  return (
    <div className="flex items-center justify-between mb-5">
      {/* Kiri: judul + breadcrumb */}
      <div>
        <h2 className="text-xl font-black text-gray-700 tracking-tight">
          {title}
        </h2>

        {crumbs.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <FaHome className="text-[#FFB9B9] text-[10px]" />
            {crumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <FaChevronRight className="text-gray-300 text-[9px]" />
                <span
                  className={`text-[11px] font-medium ${
                    index === crumbs.length - 1
                      ? 'text-[#9d2a5e] font-bold'
                      : 'text-gray-400'
                  }`}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Kanan: children (tombol aksi, dll) */}
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}
