/**
 * KOMPONEN — EmptyState
 * Tampilan kosong yang eye-catching dengan ilustrasi SVG, gradient, dan animasi.
 *
 * Props:
 *  variant   : "search" | "box" | "star" | "calendar"  — pilih ilustrasi (default "box")
 *  title     : string
 *  desc      : string   (opsional)
 *  action    : ReactNode — tombol aksi (opsional)
 *  size      : "sm" | "md" | "lg"
 *  className : string
 */
export default function EmptyState({
  variant = "box",
  title = "Belum ada data",
  desc,
  action,
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: { wrap: "py-10",  illus: "w-28 h-28", titleCls: "text-sm",   descCls: "text-[11px]" },
    md: { wrap: "py-16",  illus: "w-36 h-36", titleCls: "text-base", descCls: "text-xs"     },
    lg: { wrap: "py-20",  illus: "w-44 h-44", titleCls: "text-lg",   descCls: "text-sm"     },
  };
  const s = sizes[size];

  /* ── Ilustrasi SVG per variant ── */
  const illustrations = {

    search: (
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Lingkaran latar belakang dekoratif */}
        <circle cx="80" cy="80" r="68" fill="#9E4BDC" fillOpacity="0.06" />
        <circle cx="80" cy="80" r="50" fill="#9E4BDC" fillOpacity="0.08" />
        {/* Kaca pembesar */}
        <circle cx="70" cy="68" r="28" fill="white" stroke="#9E4BDC" strokeWidth="5" />
        <circle cx="70" cy="68" r="20" fill="#F4F4F5" />
        {/* Kilap kaca */}
        <circle cx="62" cy="60" r="5" fill="white" fillOpacity="0.8" />
        {/* Gagang */}
        <line x1="91" y1="89" x2="112" y2="112" stroke="#9E4BDC" strokeWidth="6" strokeLinecap="round" />
        {/* Tanda tanya di dalam kaca */}
        <text x="70" y="74" textAnchor="middle" fontSize="18" fontWeight="900" fill="#9E4BDC" fontFamily="sans-serif">?</text>
        {/* Bintang dekoratif */}
        <circle cx="118" cy="42" r="4" fill="#95D5B6" />
        <circle cx="32" cy="110" r="3" fill="#9E4BDC" fillOpacity="0.4" />
        <circle cx="130" cy="100" r="2.5" fill="#F24E1E" fillOpacity="0.5" />
        <circle cx="40" cy="48" r="2" fill="#9E4BDC" fillOpacity="0.3" />
      </svg>
    ),

    box: (
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Lingkaran latar */}
        <circle cx="80" cy="80" r="68" fill="#9E4BDC" fillOpacity="0.06" />
        <circle cx="80" cy="80" r="50" fill="#9E4BDC" fillOpacity="0.08" />
        {/* Bayangan kotak */}
        <ellipse cx="80" cy="118" rx="36" ry="7" fill="#9E4BDC" fillOpacity="0.12" />
        {/* Kotak bawah */}
        <rect x="44" y="82" width="72" height="32" rx="8" fill="#E4E4E7" />
        {/* Kotak atas (tutup) */}
        <rect x="40" y="68" width="80" height="20" rx="8" fill="#9E4BDC" fillOpacity="0.15" stroke="#9E4BDC" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Tali kotak */}
        <path d="M80 68 L80 88" stroke="#9E4BDC" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 78 L92 78" stroke="#9E4BDC" strokeWidth="2.5" strokeLinecap="round" />
        {/* Tanda minus (kosong) */}
        <rect x="62" y="94" width="36" height="4" rx="2" fill="#A1A1AA" fillOpacity="0.5" />
        <rect x="68" y="102" width="24" height="4" rx="2" fill="#A1A1AA" fillOpacity="0.3" />
        {/* Dekorasi */}
        <circle cx="120" cy="50" r="5" fill="#95D5B6" />
        <circle cx="36" cy="60" r="3.5" fill="#9E4BDC" fillOpacity="0.35" />
        <circle cx="128" cy="108" r="3" fill="#F24E1E" fillOpacity="0.4" />
      </svg>
    ),

    star: (
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Lingkaran latar */}
        <circle cx="80" cy="80" r="68" fill="#9E4BDC" fillOpacity="0.06" />
        <circle cx="80" cy="80" r="50" fill="#9E4BDC" fillOpacity="0.08" />
        {/* Bintang besar tengah */}
        <path d="M80 42 L87.6 65.8 L113 65.8 L92.2 80.2 L99.8 104 L80 89.6 L60.2 104 L67.8 80.2 L47 65.8 L72.4 65.8 Z"
          fill="#9E4BDC" fillOpacity="0.15" stroke="#9E4BDC" strokeWidth="2" strokeLinejoin="round" />
        {/* Bintang kecil kiri */}
        <path d="M34 72 L36.4 79.4 L44 79.4 L37.8 83.8 L40.2 91.2 L34 86.8 L27.8 91.2 L30.2 83.8 L24 79.4 L31.6 79.4 Z"
          fill="#95D5B6" fillOpacity="0.7" />
        {/* Bintang kecil kanan */}
        <path d="M126 72 L128.4 79.4 L136 79.4 L129.8 83.8 L132.2 91.2 L126 86.8 L119.8 91.2 L122.2 83.8 L116 79.4 L123.6 79.4 Z"
          fill="#F24E1E" fillOpacity="0.5" />
        {/* Garis rating kosong */}
        <rect x="52" y="112" width="56" height="6" rx="3" fill="#E4E4E7" />
        <rect x="52" y="112" width="20" height="6" rx="3" fill="#9E4BDC" fillOpacity="0.4" />
        {/* Titik dekoratif */}
        <circle cx="80" cy="130" r="3" fill="#9E4BDC" fillOpacity="0.3" />
        <circle cx="70" cy="130" r="2" fill="#9E4BDC" fillOpacity="0.15" />
        <circle cx="90" cy="130" r="2" fill="#9E4BDC" fillOpacity="0.15" />
      </svg>
    ),

    calendar: (
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Lingkaran latar */}
        <circle cx="80" cy="80" r="68" fill="#9E4BDC" fillOpacity="0.06" />
        <circle cx="80" cy="80" r="50" fill="#9E4BDC" fillOpacity="0.08" />
        {/* Kalender */}
        <rect x="38" y="52" width="84" height="72" rx="10" fill="white" stroke="#E4E4E7" strokeWidth="2" />
        {/* Header kalender */}
        <rect x="38" y="52" width="84" height="24" rx="10" fill="#9E4BDC" />
        <rect x="38" y="64" width="84" height="12" fill="#9E4BDC" />
        {/* Teks bulan */}
        <rect x="56" y="60" width="48" height="8" rx="4" fill="white" fillOpacity="0.3" />
        {/* Gantungan kalender */}
        <rect x="58" y="46" width="8" height="14" rx="4" fill="#9E4BDC" />
        <rect x="94" y="46" width="8" height="14" rx="4" fill="#9E4BDC" />
        {/* Grid hari — kosong semua */}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={46 + i * 11} y="84" width="7" height="7" rx="2" fill="#F4F4F5" />
        ))}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={46 + i * 11} y="96" width="7" height="7" rx="2" fill="#F4F4F5" />
        ))}
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={46 + i * 11} y="108" width="7" height="7" rx="2" fill="#F4F4F5" />
        ))}
        {/* Tanda silang di tengah */}
        <line x1="68" y1="92" x2="92" y2="116" stroke="#9E4BDC" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
        <line x1="92" y1="92" x2="68" y2="116" stroke="#9E4BDC" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
        {/* Dekorasi */}
        <circle cx="122" cy="46" r="4" fill="#95D5B6" />
        <circle cx="34" cy="108" r="3" fill="#F24E1E" fillOpacity="0.4" />
      </svg>
    ),
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${s.wrap} ${className}`}>

      {/* Ilustrasi dengan animasi float */}
      <div
        className={`${s.illus} mb-5 animate-[float_3s_ease-in-out_infinite]`}
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        {illustrations[variant] ?? illustrations.box}
      </div>

      {/* Teks */}
      <p className={`font-black text-[#22285E] leading-tight ${s.titleCls}`}>{title}</p>
      {desc && (
        <p className={`text-[#A1A1AA] mt-2 max-w-[260px] leading-relaxed ${s.descCls}`}>{desc}</p>
      )}

      {/* Aksi */}
      {action && <div className="mt-5">{action}</div>}

      {/* Keyframe float — inline style fallback */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
