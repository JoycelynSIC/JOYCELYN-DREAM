/**
 * KOMPONEN — AvatarGroup
 * Tumpukan avatar (overlap) dengan tooltip nama dan badge jumlah sisa.
 * Cocok untuk menampilkan daftar pelanggan, tim, reviewer, dll.
 *
 * Props:
 *  users     : { name: string, color?: string }[]  — daftar user
 *  max       : number   — maks avatar yang ditampilkan (default 4)
 *  size      : "sm" | "md" | "lg"
 *  showNames : boolean  — tampilkan nama di bawah (default false)
 *  label     : string   — teks kecil di samping (opsional)
 *  className : string
 */

const PALETTE = [
  "bg-[#9E4BDC] text-white",
  "bg-[#22285E] text-white",
  "bg-[#95D5B6] text-[#22285E]",
  "bg-yellow-400 text-white",
  "bg-[#F24E1E] text-white",
  "bg-[#00B5AD] text-white",
];

export default function AvatarGroup({
  users = [],
  max = 4,
  size = "md",
  showNames = false,
  label,
  className = "",
}) {
  const visible  = users.slice(0, max);
  const overflow = users.length - max;

  const sizes = {
    sm: { box: "w-7 h-7",   text: "text-[9px]",  font: "font-black", overlap: "-ml-2",   ring: "ring-[1.5px]" },
    md: { box: "w-9 h-9",   text: "text-[11px]", font: "font-black", overlap: "-ml-2.5", ring: "ring-2"       },
    lg: { box: "w-11 h-11", text: "text-sm",     font: "font-black", overlap: "-ml-3",   ring: "ring-2"       },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Stack avatar */}
      <div className="flex items-center">
        {visible.map((user, i) => {
          const colorClass = user.color ?? PALETTE[i % PALETTE.length];
          const initials   = user.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={i}
              className={`
                relative group
                ${s.box} rounded-full
                ${colorClass}
                ${s.ring} ring-white
                flex items-center justify-center
                ${i !== 0 ? s.overlap : ""}
                transition-transform duration-200
                hover:z-10 hover:scale-110 hover:-translate-y-0.5
                cursor-default
              `}
              style={{ zIndex: visible.length - i }}
            >
              <span className={`${s.text} ${s.font} leading-none select-none`}>
                {initials}
              </span>

              {/* Tooltip nama */}
              <div className="
                pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                bg-[#22285E] text-white text-[10px] font-semibold
                px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap
                opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
                transition-all duration-150
              ">
                {user.name}
                <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                  border-x-4 border-x-transparent border-t-4 border-t-[#22285E]" />
              </div>
            </div>
          );
        })}

        {/* Badge sisa */}
        {overflow > 0 && (
          <div
            className={`
              ${s.box} rounded-full
              bg-[#F4F4F5] border-2 border-[#E4E4E7]
              ${s.overlap}
              flex items-center justify-center
              ${s.text} ${s.font} text-[#71717A]
              ring-2 ring-white
            `}
            style={{ zIndex: 0 }}
          >
            +{overflow}
          </div>
        )}
      </div>

      {/* Label samping */}
      {(label || showNames) && (
        <div className="min-w-0">
          {label && (
            <p className="text-[11px] text-[#71717A] font-medium leading-tight">{label}</p>
          )}
          {showNames && visible.length > 0 && (
            <p className="text-[10px] text-[#A1A1AA] truncate max-w-[120px]">
              {visible.map((u) => u.name.split(" ")[0]).join(", ")}
              {overflow > 0 && ` +${overflow}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
