/**
 * AdminDashboard — Na_store.id
 */
import { useState, useEffect, useRef } from "react";
import { usePdfExport } from "../hooks/usePdfExport";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FaUsers, FaShoppingBag, FaBoxOpen, FaCoins, FaStar,
  FaClock, FaBoxes, FaCheckDouble, FaArchive, FaCamera, FaHeadset,
  FaArrowUp, FaArrowDown,
} from "react-icons/fa";
import { TrendingUp, Package, ChevronRight } from "lucide-react";

import PageHeader  from "../components/PageHeader";
import Card        from "../components/Card";
import Badge       from "../components/Badge";
import BannerPromo from "../components/BannerPromo";
import { dashboardAPI } from "../services/dashboardAPI";
import { getProdukImageUrl } from "../services/produkAPI";

const MC = { Platinum:"#6D28D9", Gold:"#F59E0B", Silver:"#64748B", Reguler:"#A1A1AA" };
const C  = ["#9E4BDC","#22285E","#00B5AD","#F24E1E","#F59E0B","#95D5B6"];
const ST = {
  Selesai:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Diproses:   "bg-amber-50   text-amber-700   border-amber-200",
  Dibatalkan: "bg-red-50     text-red-700     border-red-200",
};

const JADWAL = [
  { jam:"09:00", title:"Restok Kalung Titanium",   time:"09:00–10:00", bg:"#9E4BDC", icon:FaBoxes      },
  { jam:"10:30", title:"QC Cincin Couple Silver",  time:"10:30–12:00", bg:"#00B5AD", icon:FaCheckDouble },
  { jam:"13:00", title:"Packing Pesanan Reseller", time:"13:00–14:30", bg:"#22285E", icon:FaArchive    },
  { jam:"15:00", title:"Update Foto Produk Baru",  time:"15:00–16:00", bg:"#2D9B5A", icon:FaCamera     },
  { jam:"16:30", title:"Balas Chat Pelanggan",     time:"16:30–17:30", bg:"#F24E1E", icon:FaHeadset    },
];

function SK({ h = "h-32" }) {
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

function KPICard({ label, value, sub, icon: Icon, color = "#9E4BDC", up, loading }) {
  if (loading) return <SK />;
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        {up !== undefined && (
          <span className={`text-[9px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
            up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}>
            {up ? <FaArrowUp size={6} /> : <FaArrowDown size={6} />}
            {sub}
          </span>
        )}
      </div>
      <p className="text-xl font-black text-[#22285E] leading-none">{value}</p>
      <p className="text-[11px] text-[#A1A1AA] font-medium mt-1">{label}</p>
      {up === undefined && sub && <p className="text-[10px] text-[#A1A1AA] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading,     setLoading]     = useState(true);
  const [stats,       setStats]       = useState(null);
  const [trxBulan,    setTrxBulan]    = useState([]);
  const [yearSum,     setYearSum]     = useState([]);
  const [segMember,   setSegMember]   = useState([]);
  const [kategori,    setKategori]    = useState([]);
  const [topProduk,   setTopProduk]   = useState([]);
  const [topCust,     setTopCust]     = useState([]);
  const [trxTerbaru,  setTrxTerbaru]  = useState([]);
  const [years,       setYears]       = useState([]);
  const [activeYear,  setActiveYear]  = useState(null);

  useEffect(() => {
    dashboardAPI.fetchAvailableYears().then(y => {
      setYears(y);
      const latest = y[y.length - 1] ?? new Date().getFullYear();
      setActiveYear(latest);
    });
  }, []);

  useEffect(() => {
    if (!activeYear) return;
    setLoading(true);
    Promise.all([
      dashboardAPI.fetchStatCards(),
      dashboardAPI.fetchTrxPerBulan(activeYear),
      dashboardAPI.fetchTrxPerTahun(years.length ? years : [activeYear]),
      dashboardAPI.fetchSegmentasiMember(),
      dashboardAPI.fetchKategoriTerlaris(),
      dashboardAPI.fetchTopProduk(5),
      dashboardAPI.fetchTopPelanggan(5),
      dashboardAPI.fetchTrxTerbaru(5),
    ]).then(([s, tb, ys, sm, kt, tp, tc, tl]) => {
      setStats(s); setTrxBulan(tb); setYearSum(ys); setSegMember(sm);
      setKategori(kt); setTopProduk(tp); setTopCust(tc); setTrxTerbaru(tl);
    }).catch(console.error).finally(() => setLoading(false));
  }, [activeYear]);

  const fmtRp = n => {
    if (!n) return "Rp 0";
    if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(1)}M`;
    if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(1)} jt`;
    return `Rp ${(n / 1e3).toFixed(0)} rb`;
  };

  const prevY  = yearSum.find(y => y.tahun === activeYear - 1);
  const curY   = yearSum.find(y => y.tahun === activeYear);
  const omzetG = prevY?.omzet > 0
    ? +((( curY?.omzet ?? 0) - prevY.omzet) / prevY.omzet * 100).toFixed(1) : null;

  const { exportRef, exporting, exportToPdf } = usePdfExport("dashboard-nastore");

  return (
    <div className="space-y-5 font-poppins">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Dashboard" breadcrumb={["Dashboard"]} />
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-[#E8E8E8] rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-[10px] text-[#A1A1AA] font-bold mr-1">Tahun:</span>
            {years.map(y => (
              <button key={y} onClick={() => setActiveYear(y)}
                className={`text-xs font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeYear === y ? "bg-[#9E4BDC] text-white" : "text-[#A1A1AA] hover:text-[#22285E]"
                }`}>
                {y}
              </button>
            ))}
          </div>
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
      </div>

      {/* ── KONTEN (di-capture untuk PDF) ── */}
      <div ref={exportRef} className="space-y-5">

      {/* ── 4 KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard loading={loading} label="Total Omzet" value={fmtRp(stats?.totalOmzet)}
          icon={FaCoins} color="#9E4BDC"
          up={omzetG !== null ? omzetG >= 0 : undefined}
          sub={omzetG !== null ? `${Math.abs(omzetG)}% vs ${activeYear - 1}` : "Dari trx selesai"} />
        <KPICard loading={loading} label="Pesanan Diproses" value={stats?.trxProses ?? 0}
          icon={FaShoppingBag} color="#F24E1E"
          sub="Menunggu konfirmasi" />
        <KPICard loading={loading} label="Total Pelanggan" value={(stats?.totalCustomer ?? 0).toLocaleString("id")}
          icon={FaUsers} color="#22285E"
          sub="Terdaftar di sistem" />
        <KPICard loading={loading} label="Stok Habis" value={stats?.stokHabis ?? 0}
          icon={FaBoxOpen} color="#F24E1E"
          sub={`dari ${stats?.totalProduk ?? 0} produk`} />
      </div>

      {/* ── MAIN ROW: Area Chart + Pie Member ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Area chart transaksi bulanan */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-black text-[#22285E]">Transaksi per Bulan</p>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">Volume penjualan {activeYear}</p>
            </div>
            {omzetG !== null && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                omzetG >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              }`}>
                {omzetG >= 0 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                {Math.abs(omzetG)}% vs {activeYear - 1}
              </span>
            )}
          </div>
          {loading ? <SK h="h-44" /> : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trxBulan} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9E4BDC" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#9E4BDC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#A1A1AA" }} axisLine={false} tickLine={false} dy={6} />
                  <YAxis tick={{ fontSize: 10, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="trx" name="Transaksi" stroke="#9E4BDC" strokeWidth={2.5}
                    fill="url(#gMain)" dot={false} activeDot={{ r: 5, fill: "#9E4BDC" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie tier member */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <p className="text-sm font-black text-[#22285E] mb-0.5">Tier Member</p>
          <p className="text-[11px] text-[#A1A1AA] mb-3">Distribusi status keanggotaan</p>
          {loading ? <SK h="h-44" /> : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={segMember} cx="50%" cy="50%" innerRadius={50} outerRadius={74}
                      dataKey="value" nameKey="label" paddingAngle={3} startAngle={90} endAngle={450}>
                      {segMember.map((e, i) => <Cell key={i} fill={MC[e.label] ?? C[i % C.length]} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {segMember.map((e, i) => {
                  const tot = segMember.reduce((s, x) => s + x.value, 0);
                  const pct = tot > 0 ? Math.round((e.value / tot) * 100) : 0;
                  const col = MC[e.label] ?? C[i % C.length];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col }} />
                      <span className="text-[11px] font-medium text-[#22285E] flex-1">{e.label}</span>
                      <span className="text-[10px] text-[#A1A1AA]">{e.value.toLocaleString("id")}</span>
                      <span className="text-[10px] font-black w-7 text-right" style={{ color: col }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── SECOND ROW: Kategori terlaris + Daily task ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Kategori horizontal bar */}
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

        {/* Daily task */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-black text-[#22285E]">Daily Task</p>
              <p className="text-[11px] text-[#A1A1AA]">Jadwal operasional hari ini</p>
            </div>
            <Link to="/schedule" className="text-[10px] font-bold text-[#9E4BDC] hover:underline flex items-center gap-0.5">
              Lihat jadwal <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-[38px] top-0 bottom-0 w-px bg-[#F0F0F0]" />
            <div className="space-y-2">
              {JADWAL.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#A1A1AA] font-bold w-9 text-right shrink-0 z-10">{item.jam}</span>
                    <div className="w-2 h-2 rounded-full shrink-0 z-10 ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: item.bg }} />
                    <div className="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-white"
                      style={{ backgroundColor: item.bg }}>
                      <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <Icon className="text-[10px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{item.title}</p>
                        <p className="text-[10px] opacity-70 flex items-center gap-1 mt-0.5">
                          <FaClock className="text-[8px]" />{item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── THIRD ROW: Transaksi terbaru + Top produk + Top pelanggan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Transaksi terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4F4F5]">
            <div>
              <p className="text-sm font-black text-[#22285E]">Transaksi Terbaru</p>
              <p className="text-[11px] text-[#A1A1AA]">5 pesanan paling baru</p>
            </div>
            <Link to="/orders" className="text-[10px] font-bold text-[#9E4BDC] hover:underline flex items-center gap-0.5">
              Lihat semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{Array(5).fill(0).map((_, i) => <SK key={i} h="h-12" />)}</div>
          ) : (
            <div className="divide-y divide-[#F8F8F8]">
              {trxTerbaru.map(o => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAFA] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#9E4BDC]/10 flex items-center justify-center
                    text-[#9E4BDC] text-xs font-black shrink-0">
                    {(o.customer || "?").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#22285E] truncate">{o.customer}</p>
                    <p className="text-[10px] text-[#A1A1AA] truncate">{o.produk} · {o.metode}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-[#22285E]">Rp {o.total.toLocaleString("id")}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${ST[o.status] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top produk */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4F4F5]">
            <p className="text-sm font-black text-[#22285E]">Top Produk</p>
            <Link to="/inventory" className="text-[10px] font-bold text-[#9E4BDC] hover:underline flex items-center gap-0.5">
              Lihat <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{Array(5).fill(0).map((_, i) => <SK key={i} h="h-10" />)}</div>
          ) : (
            <div className="p-4 space-y-2">
              {topProduk.map((p, i) => {
                const max = topProduk[0]?.terjual || 1;
                const img = p.gambar ? getProdukImageUrl(p.gambar) : null;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[10px] font-black text-[#A1A1AA] w-3 shrink-0">{i + 1}</span>
                    <div className="w-7 h-7 rounded-lg bg-[#F4F4F5] border border-[#EBEBEB] overflow-hidden shrink-0 flex items-center justify-center">
                      {img
                        ? <img src={img} alt={p.name} className="w-full h-full object-cover" />
                        : <FaBoxOpen className="text-[#A1A1AA] text-[9px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[10px] font-bold text-[#22285E] truncate">{p.name}</p>
                        <span className="text-[9px] font-black text-[#9E4BDC] shrink-0 ml-1">{p.terjual}×</span>
                      </div>
                      <div className="w-full h-1 bg-[#F4F4F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${(p.terjual / max) * 100}%`, backgroundColor: C[i % C.length] }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── TOP PELANGGAN ── */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4F4F5]">
          <div>
            <p className="text-sm font-black text-[#22285E]">Top Pelanggan Setia</p>
            <p className="text-[11px] text-[#A1A1AA]">Berdasarkan total belanja keseluruhan</p>
          </div>
          <Link to="/customers" className="text-[10px] font-bold text-[#9E4BDC] hover:underline flex items-center gap-0.5">
            Lihat semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="p-5 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {Array(5).fill(0).map((_, i) => <SK key={i} h="h-24" />)}
          </div>
        ) : (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {topCust.map((p, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-xl p-3.5 text-center hover:bg-[#9E4BDC]/4 transition-colors border border-transparent hover:border-[#9E4BDC]/15">
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-black text-white"
                  style={{ backgroundColor: MC[p.statusMember] ?? "#9E4BDC" }}>
                  {p.nama.charAt(0)}
                </div>
                <p className="text-[11px] font-bold text-[#22285E] truncate">{p.nama}</p>
                <Badge status={p.statusMember} />
                <div className="mt-2 pt-2 border-t border-[#EBEBEB] space-y-0.5">
                  <p className="text-[10px] text-[#A1A1AA]">
                    <FaStar className="text-yellow-400 inline text-[8px] mr-0.5" />
                    <span className="font-bold text-[#22285E]">{p.poin.toLocaleString("id")}</span> poin
                  </p>
                  <p className="text-[10px] text-[#A1A1AA]">
                    Rp <span className="font-bold text-[#22285E]">
                      {p.totalBelanja >= 1e6
                        ? `${(p.totalBelanja / 1e6).toFixed(1)}jt`
                        : p.totalBelanja.toLocaleString("id")}
                    </span>
                  </p>
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
