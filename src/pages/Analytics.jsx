/**
 * Analytics — Laporan Na_store.id
 */
import { useState, useEffect } from "react";
import { usePdfExport } from "../hooks/usePdfExport";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  FaArrowUp, FaArrowDown, FaMoneyBillWave, FaShoppingCart,
  FaUsers, FaBoxOpen, FaFire, FaChartLine, FaCoins,
} from "react-icons/fa";
import { TrendingUp, Repeat2, Award, Target } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Card       from "../components/Card";
import Badge      from "../components/Badge";
import { dashboardAPI } from "../services/dashboardAPI";

const C  = ["#9E4BDC","#22285E","#00B5AD","#F24E1E","#F59E0B","#95D5B6","#64748B"];
const MC = { Platinum:"#6D28D9", Gold:"#F59E0B", Silver:"#64748B", Reguler:"#A1A1AA" };

function SK({ h = "h-48" }) {
  return <div className={`${h} w-full rounded-2xl bg-gradient-to-r from-[#F4F4F5] to-[#EBEBEB] animate-pulse`} />;
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1B4B] text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-poppins border border-white/10 min-w-[150px]">
      {label && (
        <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5">
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-1 first:mt-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color === "#1E1B4B" ? "#9E4BDC" : p.color }} />
          <span className="text-white/70 font-medium">{p.name}:</span>
          <span className="font-black ml-auto pl-3">
            {typeof p.value === "number" ? p.value.toLocaleString("id") : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, color = "#9E4BDC", loading }) {
  if (loading) return <SK h="h-20" />;
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <p className="text-xl font-black text-[#22285E] leading-none">{value}</p>
      <p className="text-[11px] text-[#A1A1AA] font-medium mt-1">{label}</p>
      {sub && <p className="text-[10px] text-[#A1A1AA] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const [years,       setYears]       = useState([]);
  const [yearA,       setYearA]       = useState(null);
  const [yearB,       setYearB]       = useState(null);
  const [loading,     setLoading]     = useState(true);

  const [stats,     setStats]     = useState(null);
  const [crmStats,  setCrmStats]  = useState(null);
  const [trxB,      setTrxB]      = useState([]);
  const [yearSum,   setYearSum]   = useState([]);
  const [yoyCmp,    setYoyCmp]    = useState([]);
  const [segMember, setSegMember] = useState([]);
  const [kategori,  setKategori]  = useState([]);
  const [metode,    setMetode]    = useState([]);
  const [saluran,   setSaluran]   = useState([]);

  useEffect(() => {
    dashboardAPI.fetchAvailableYears().then(y => {
      setYears(y);
      setYearB(y[y.length - 1] ?? new Date().getFullYear());
      setYearA(y[y.length - 2] ?? y[0]);
    });
  }, []);

  useEffect(() => {
    if (!yearB) return;
    setLoading(true);
    const allYears = years.length ? years : [yearB];
    Promise.all([
      dashboardAPI.fetchStatCards(),
      dashboardAPI.fetchCRMStats(),
      dashboardAPI.fetchTrxPerBulan(yearB),
      dashboardAPI.fetchTrxPerTahun(allYears),
      yearA && yearA !== yearB ? dashboardAPI.fetchYoYComparison(yearA, yearB) : Promise.resolve([]),
      dashboardAPI.fetchSegmentasiMember(),
      dashboardAPI.fetchKategoriTerlaris(),
      dashboardAPI.fetchMetodePembayaran(),
      dashboardAPI.fetchSaluranPembelian(),
    ]).then(([s, crm, tb, ys, yoy, sm, kt, mp, sal]) => {
      setStats(s); setCrmStats(crm); setTrxB(tb); setYearSum(ys);
      setYoyCmp(yoy); setSegMember(sm); setKategori(kt);
      setMetode(mp); setSaluran(sal);
    }).catch(console.error).finally(() => setLoading(false));
  }, [yearA, yearB]);

  const fmtRp = n => {
    if (!n) return "Rp 0";
    if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(1)}M`;
    if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(1)} jt`;
    return `Rp ${(n / 1e3).toFixed(0)} rb`;
  };

  const prevSum = yearSum.find(y => y.tahun === yearB - 1);
  const curSum  = yearSum.find(y => y.tahun === yearB);
  const omzetG  = prevSum?.omzet > 0
    ? +((( curSum?.omzet ?? 0) - prevSum.omzet) / prevSum.omzet * 100).toFixed(1) : null;

  const { exportRef, exporting, exportToPdf } = usePdfExport("analitik-nastore");

  return (
    <div className="space-y-5 font-poppins">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Laporan & Analitik" breadcrumb={["Dashboard", "Laporan"]} />
        <button
          onClick={exportToPdf}
          disabled={exporting || loading}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#22285E] text-white hover:bg-[#9E4BDC] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {exporting
            ? <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Mengekspor...</>
            : <>&#8595; Download PDF</>
          }
        </button>
      </div>

      {/* ── YEAR PICKER ── */}
      {years.length > 1 && (
        <div className="flex items-center gap-3 flex-wrap bg-white border border-[#E8E8E8] rounded-2xl px-4 py-3 shadow-sm">
          <TrendingUp className="w-3.5 h-3.5 text-[#9E4BDC] shrink-0" />
          <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Tahun ditampilkan:</span>
          <div className="flex items-center gap-1.5">
            {years.map(y => (
              <button key={y} onClick={() => setYearB(y)}
                className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  yearB === y ? "bg-[#9E4BDC] text-white shadow-sm" : "text-[#A1A1AA] hover:text-[#22285E] hover:bg-[#F4F4F5]"
                }`}>
                {y}
              </button>
            ))}
          </div>
          {years.length > 1 && (
            <>
              <span className="text-[#E4E4E7] text-xs">|</span>
              <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Bandingkan dengan:</span>
              <div className="flex items-center gap-1.5">
                {years.filter(y => y !== yearB).map(y => (
                  <button key={y} onClick={() => setYearA(yearA === y ? null : y)}
                    className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      yearA === y ? "bg-[#22285E] text-white shadow-sm" : "text-[#A1A1AA] hover:text-[#22285E] hover:bg-[#F4F4F5]"
                    }`}>
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 4 SUMMARY CARDS ── */}
      <div ref={exportRef} className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard loading={loading} icon={FaCoins} color="#9E4BDC"
          label="Total Omzet" value={fmtRp(stats?.totalOmzet)}
          sub={omzetG !== null ? `${omzetG >= 0 ? "+" : ""}${omzetG}% vs ${yearB - 1}` : undefined} />
        <SummaryCard loading={loading} icon={FaShoppingCart} color="#22285E"
          label="Total Transaksi" value={(stats?.totalTrx ?? 0).toLocaleString("id")}
          sub={`${stats?.trxProses ?? 0} sedang diproses`} />
        <SummaryCard loading={loading} icon={Repeat2} color="#00B5AD"
          label="Repeat Customer Rate" value={`${crmStats?.repeatRate ?? 0}%`}
          sub={`${(crmStats?.repeatCustomer ?? 0).toLocaleString("id")} pelanggan repeat`} />
        <SummaryCard loading={loading} icon={Target} color="#F59E0B"
          label="Avg Order Value" value={fmtRp(stats?.avgOrderValue)}
          sub={`${(stats?.totalUnit ?? 0).toLocaleString("id")} unit terjual`} />
      </div>

      {/* ── TREN UTAMA: Area chart + YoY line (jika ada 2 tahun) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Area chart tahun terpilih */}
        <div className={`${yoyCmp.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-black text-[#22285E]">Tren Transaksi {yearB}</p>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">Volume & omzet bulanan</p>
            </div>
            {omzetG !== null && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                omzetG >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              }`}>
                {omzetG >= 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                {Math.abs(omzetG)}% vs {yearB - 1}
              </span>
            )}
          </div>
          {loading ? <SK h="h-52" /> : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trxB} margin={{ top: 6, right: 6, left: -26, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gTrx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9E4BDC" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#9E4BDC" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gOmz" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5AD" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#00B5AD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#A1A1AA" }} axisLine={false} tickLine={false} dy={6} />
                  <YAxis yAxisId="l" tick={{ fontSize: 9, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 9, fill: "#A1A1AA" }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1e6 ? `${(v / 1e6).toFixed(0)}jt` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}rb` : v} />
                  <Tooltip content={<Tip />} />
                  <Legend iconType="circle" iconSize={8}
                    formatter={v => <span className="text-[10px] font-semibold text-[#22285E]">{v}</span>} />
                  <Area yAxisId="l" type="monotone" dataKey="trx" name="Transaksi"
                    stroke="#9E4BDC" strokeWidth={2.5} fill="url(#gTrx)" dot={false} activeDot={{ r: 5 }} />
                  <Area yAxisId="r" type="monotone" dataKey="omzet" name="Omzet (Rp)"
                    stroke="#00B5AD" strokeWidth={2} fill="url(#gOmz)" dot={false} strokeDasharray="5 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* YoY comparison line — hanya muncul jika ada 2 tahun berbeda */}
        {!loading && yoyCmp.length > 0 && yearA && yearA !== yearB && (
          <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
            <p className="text-sm font-black text-[#22285E] mb-0.5">Perbandingan Transaksi</p>
            <p className="text-[11px] text-[#A1A1AA] mb-3">{yearA} vs {yearB}</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yoyCmp} margin={{ top: 6, right: 6, left: -26, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Legend iconType="circle" iconSize={8}
                    formatter={v => <span className="text-[10px] font-semibold text-[#22285E]">{v}</span>} />
                  <Line dataKey={`trx_${yearA}`} name={`${yearA}`} stroke="#A1A1AA"
                    strokeWidth={2} dot={false} strokeDasharray="5 3" activeDot={{ r: 4 }} />
                  <Line dataKey={`trx_${yearB}`} name={`${yearB}`} stroke="#9E4BDC"
                    strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#9E4BDC" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ── RINGKASAN PER TAHUN (jika >1 tahun) ── */}
      {!loading && yearSum.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {yearSum.map((y, i) => {
            const prev = yearSum[i - 1];
            const grow = prev?.omzet > 0
              ? +((( y.omzet - prev.omzet) / prev.omzet) * 100).toFixed(1) : null;
            return (
              <div key={y.tahun} className={`rounded-2xl p-5 border ${
                y.tahun === yearB
                  ? "bg-[#9E4BDC] text-white border-[#8B3EC7]"
                  : "bg-white border-[#F0F0F0] shadow-sm"
              }`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  y.tahun === yearB ? "text-white/70" : "text-[#A1A1AA]"
                }`}>{y.tahun}</p>
                <p className={`text-xl font-black ${y.tahun === yearB ? "text-white" : "text-[#22285E]"}`}>
                  {fmtRp(y.omzet)}
                </p>
                <p className={`text-xs mt-0.5 ${y.tahun === yearB ? "text-white/70" : "text-[#A1A1AA]"}`}>
                  {y.trx.toLocaleString("id")} transaksi
                </p>
                {grow !== null && (
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-2 ${
                    grow >= 0 ? "text-emerald-400" : "text-red-400"
                  } ${y.tahun === yearB ? "" : grow >= 0 ? "!text-emerald-600" : "!text-red-500"}`}>
                    {grow >= 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                    {Math.abs(grow)}% vs {y.tahun - 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── BREAKDOWN: Kategori + Metode + Saluran ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Kategori produk */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <p className="text-sm font-black text-[#22285E] mb-0.5">Kategori Terlaris</p>
          <p className="text-[11px] text-[#A1A1AA] mb-3">Unit terjual per kategori</p>
          {loading ? <SK h="h-52" /> : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kategori} layout="vertical" barSize={10} margin={{ left: 0, right: 12 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} width={110}
                    tick={{ fontSize: 10, fill: "#22285E", fontWeight: 600 }} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="value" name="Unit" radius={[0, 6, 6, 0]}>
                    {kategori.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Metode pembayaran */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <p className="text-sm font-black text-[#22285E] mb-0.5">Metode Pembayaran</p>
          <p className="text-[11px] text-[#A1A1AA] mb-4">Preferensi pembayaran pelanggan</p>
          {loading ? <SK h="h-52" /> : (
            <div className="space-y-3">
              {metode.map((m, i) => {
                const total = metode.reduce((s, x) => s + x.value, 0);
                const max   = metode[0]?.value || 1;
                const pct   = Math.round((m.value / total) * 100);
                const bar   = Math.round((m.value / max) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#22285E]">{m.label}</span>
                      <span className="text-[10px] font-black" style={{ color: C[i % C.length] }}>
                        {m.value.toLocaleString("id")} trx · {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F4F4F5] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${bar}%`, backgroundColor: C[i % C.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Saluran pembelian + Tier member */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <p className="text-sm font-black text-[#22285E] mb-0.5">Saluran Pembelian</p>
          <p className="text-[11px] text-[#A1A1AA] mb-3">Channel transaksi pelanggan</p>
          {loading ? <SK h="h-52" /> : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={saluran} cx="50%" cy="50%" outerRadius={72}
                      dataKey="value" nameKey="label" paddingAngle={2} startAngle={90} endAngle={450}>
                      {saluran.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-1">
                {saluran.slice(0, 4).map((d, i) => {
                  const tot = saluran.reduce((s, x) => s + x.value, 0);
                  const pct = tot > 0 ? Math.round((d.value / tot) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: C[i % C.length] }} />
                      <span className="text-[10px] font-medium text-[#22285E] flex-1 truncate">{d.label}</span>
                      <span className="text-[10px] font-black" style={{ color: C[i % C.length] }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── SEGMENTASI PELANGGAN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Tier member */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <p className="text-sm font-black text-[#22285E] mb-0.5">Distribusi Tier Member</p>
          <p className="text-[11px] text-[#A1A1AA] mb-3">Komposisi status keanggotaan pelanggan</p>
          {loading ? <SK h="h-48" /> : (
            <div className="flex items-center gap-5">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={segMember} cx="50%" cy="50%" innerRadius={46} outerRadius={68}
                      dataKey="value" nameKey="label" paddingAngle={3} startAngle={90} endAngle={450}>
                      {segMember.map((e, i) => <Cell key={i} fill={MC[e.label] ?? C[i % C.length]} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {segMember.map((e, i) => {
                  const tot = segMember.reduce((s, x) => s + x.value, 0);
                  const pct = tot > 0 ? Math.round((e.value / tot) * 100) : 0;
                  const col = MC[e.label] ?? C[i % C.length];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col }} />
                          <span className="text-xs font-semibold text-[#22285E]">{e.label}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color: col }}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: col }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CRM insight cards */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <p className="text-sm font-black text-[#22285E] mb-0.5">Insight Pelanggan (CRM)</p>
          <p className="text-[11px] text-[#A1A1AA] mb-4">Metrik loyalitas dan engagement</p>
          {loading ? <SK h="h-48" /> : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Repeat Rate",     value: `${crmStats?.repeatRate ?? 0}%`,
                  sub: `${(crmStats?.repeatCustomer ?? 0).toLocaleString("id")} pelanggan repeat`, color: "#00B5AD", icon: Repeat2 },
                { label: "Avg Belanja",     value: fmtRp(crmStats?.avgBelanja),
                  sub: `${crmStats?.avgTrxPerCustomer ?? 0}× trx rata-rata`, color: "#F59E0B", icon: Award },
                { label: "Poin Aktif",      value: (crmStats?.totalPoinAktif ?? 0).toLocaleString("id"),
                  sub: "poin belum ditukar", color: "#9E4BDC", icon: FaCoins },
                { label: "Poin Ditukar",    value: (crmStats?.totalPoinDitukar ?? 0).toLocaleString("id"),
                  sub: "dari program reward", color: "#22285E", icon: FaFire },
              ].map((k, i) => {
                const Icon = k.icon;
                return (
                  <div key={i} className="bg-[#FAFAFA] rounded-xl p-3.5 border border-[#F0F0F0]">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${k.color}15` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: k.color }} />
                    </div>
                    <p className="text-base font-black text-[#22285E]">{k.value}</p>
                    <p className="text-[10px] font-semibold text-[#22285E] mt-0.5">{k.label}</p>
                    <p className="text-[9px] text-[#A1A1AA] mt-0.5">{k.sub}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── INDIKATOR KINERJA ── */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
        <p className="text-sm font-black text-[#22285E] mb-0.5">Indikator Kinerja Bisnis</p>
        <p className="text-[11px] text-[#A1A1AA] mb-5">Evaluasi performa toko aksesoris Na_store.id</p>
        {loading ? <SK h="h-32" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { label: "Transaksi Selesai",
                val: stats?.totalTrx > 0 ? Math.round((stats.totalTrxSelesai / stats.totalTrx) * 100) : 0,
                color: "#9E4BDC" },
              { label: "Produk Tersedia di Stok",
                val: stats?.totalProduk > 0 ? Math.round(((stats.totalProduk - stats.stokHabis) / stats.totalProduk) * 100) : 0,
                color: "#00B5AD" },
              { label: "Repeat Customer Rate",
                val: crmStats?.repeatRate ?? 0,
                color: "#F59E0B" },
              { label: "Member Premium (non-Reguler)",
                val: stats?.totalCustomer > 0
                  ? Math.round((segMember.filter(s => s.label !== "Reguler").reduce((s, x) => s + x.value, 0) / stats.totalCustomer) * 100)
                  : 0,
                color: "#22285E" },
            ].map((k, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-xs font-semibold text-[#22285E]">{k.label}</p>
                  <span className="text-xs font-black" style={{ color: k.color }}>{k.val}%</span>
                </div>
                <div className="w-full h-2 bg-[#F4F4F5] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                    style={{ width: `${k.val}%`, backgroundColor: k.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </div>{/* end exportRef */}
    </div>
  );
}
