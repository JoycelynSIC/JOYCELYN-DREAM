/**
 * KOMPONEN 14 — DonutChart
 * Pie chart donat menggunakan Recharts PieChart.
 *
 * Props:
 *  title    : string
 *  subtitle : string
 *  segments : Array<{ label, value, color }>  — value dalam persen (total = 100)
 *  center   : string  — teks di tengah donat
 */
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer,
} from "recharts";

/* Tooltip kustom */
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl px-3 py-2 shadow-lg text-xs font-poppins">
      <p className="font-bold text-[#22285E]">{d.name}</p>
      <p style={{ color: d.payload.color }} className="font-black text-sm">
        {d.value}%
      </p>
    </div>
  );
}

/* Label di dalam slice */
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (value < 8) return null; // jangan tampil kalau slice terlalu kecil
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight="bold"
      fontFamily="Poppins, sans-serif"
    >
      {value}%
    </text>
  );
}

export default function DonutChart({ title, subtitle, segments = [], center }) {
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title   && <h3 className="text-sm font-bold text-[#22285E]">{title}</h3>}
          {subtitle && <p className="text-[10px] text-[#A1A1AA] mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* ── Pie Chart ── */}
        <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={60}
                paddingAngle={3}
                labelLine={false}
                label={renderLabel}
                strokeWidth={0}
              >
                {segments.map((seg, i) => (
                  <Cell key={i} fill={seg.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Teks tengah lubang donat */}
          {center && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-black text-[#22285E] text-center leading-tight px-1">
                {center}
              </span>
            </div>
          )}
        </div>

        {/* ── Legenda ── */}
        <div className="space-y-2 flex-1 min-w-0">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-[10px] text-[#71717A] flex-1 truncate">{seg.label}</span>
              <span className="text-[10px] font-bold text-[#22285E] shrink-0">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
