/**
 * Analytics — Na_store.id
 * Laporan penjualan toko aksesoris: gelang, kalung, anting, cincin, nail art, dll.
 */
import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaMoneyBillWave, FaShoppingCart,
  FaUserPlus, FaTimesCircle, FaFire, FaChartLine, FaTachometerAlt,
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import StatCard   from '../components/StatCard';
import Card       from '../components/Card';
import TabFilter  from '../components/TabFilter';

/* ─── Data tren penjualan aksesoris ─── */
const penjualanData = {
  Mingguan: [
    { label: 'Sen', nilai: 18 }, { label: 'Sel', nilai: 32 },
    { label: 'Rab', nilai: 25 }, { label: 'Kam', nilai: 41 },
    { label: 'Jum', nilai: 36 }, { label: 'Sab', nilai: 58 },
    { label: 'Min', nilai: 47 },
  ],
  Bulanan: [
    { label: 'Jan', nilai: 70 }, { label: 'Feb', nilai: 52 },
    { label: 'Mar', nilai: 91 }, { label: 'Apr', nilai: 44 },
    { label: 'Mei', nilai: 97 }, { label: 'Jun', nilai: 63 },
    { label: 'Jul', nilai: 85 }, { label: 'Agu', nilai: 74 },
    { label: 'Sep', nilai: 60 }, { label: 'Okt', nilai: 88 },
    { label: 'Nov', nilai: 95 }, { label: 'Des', nilai: 102 },
  ],
  Tahunan: [
    { label: '2022', nilai: 420 }, { label: '2023', nilai: 580 },
    { label: '2024', nilai: 750 }, { label: '2025', nilai: 820 },
  ],
};

/* ─── Produk terlaris — dari inventory.json (terjual tertinggi) ─── */
const produkTerlaris = [
  { name: 'Scrunchie Satin',   terjual: 200 },
  { name: 'Claw Clip Besar',   terjual: 150 },
  { name: 'Jepit Butterfly',   terjual: 110 },
  { name: 'Nail Art Bunga',    terjual: 120 },
  { name: 'Stiker Aesthetic',  terjual: 175 },
];

/* ─── Indikator kinerja bisnis Na_store.id ─── */
const kinerja = [
  { label: 'Tingkat Konversi',   val: 74, color: '#9E4BDC', icon: FaChartLine     },
  { label: 'Kepuasan Pelanggan', val: 88, color: '#00B5AD', icon: FaTachometerAlt },
  { label: 'Tingkat Retur',      val:  5, color: '#F24E1E', icon: FaTimesCircle   },
  { label: 'Repeat Order',       val: 63, color: '#22285E', icon: FaFire          },
];

/* ─── KPI cards — angka dari orders.json & customer.json ─── */
const kpiConfig = [
  { label: 'Omzet Bulan Ini',   val: 'Rp 4,2 Jt', change: '+18%', up: true,  icon: FaMoneyBillWave },
  { label: 'Total Pesanan',     val: '70',         change: '+12%', up: true,  icon: FaShoppingCart  },
  { label: 'Pelanggan Baru',    val: '8',          change: '+4%',  up: true,  icon: FaUserPlus      },
  { label: 'Produk Stok Habis', val: '6',          change: '+2',   up: false, icon: FaTimesCircle   },
];

/* ─── Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E4E4E7] px-3 py-2 rounded-xl shadow-lg font-poppins">
      <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-[#22285E] text-sm font-bold">{payload[0].value} Transaksi</p>
    </div>
  );
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Bulanan');
  const data = penjualanData[activeTab];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Laporan & Analitik" breadcrumb={['Dashboard', 'Laporan']} />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiConfig.map((k, i) => {
          const Icon = k.icon;
          return (
            <StatCard
              key={i}
              label={k.label}
              value={k.val}
              desc={
                <span className={`flex items-center gap-1 font-bold ${k.up ? 'text-[#00B5AD]' : 'text-[#F24E1E]'}`}>
                  {k.up ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                  {k.change}
                  <span className="text-[#A1A1AA] font-normal ml-0.5">vs bulan lalu</span>
                </span>
              }
              icon={<Icon />}
              variant={i === 0 ? 'primary' : 'white'}
              iconBgColor="bg-[#F4F4F5]"
              iconColor="text-[#9E4BDC]"
            />
          );
        })}
      </div>

      {/* ── Grafik ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Tren Penjualan Aksesoris */}
        <Card
          className="lg:col-span-2"
          title="Tren Penjualan Aksesoris"
          subtitle="Volume transaksi Na_store.id per periode"
          action={
            <TabFilter
              tabs={['Mingguan', 'Bulanan', 'Tahunan']}
              active={activeTab}
              onChange={setActiveTab}
            />
          }
        >
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 600 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="nilai" stroke="#9E4BDC" strokeWidth={3}
                  dot={{ fill: '#9E4BDC', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#9E4BDC', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Produk Terlaris */}
        <Card title="Produk Terlaris" subtitle="Unit terbanyak terjual di Na_store.id">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={produkTerlaris} layout="vertical" barSize={14} margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category" dataKey="name"
                  tick={{ fontSize: 10, fill: '#22285E', fontWeight: 600 }}
                  axisLine={false} tickLine={false} width={110}
                />
                <Tooltip cursor={{ fill: '#F4F4F5' }} content={<CustomTooltip />} />
                <Bar dataKey="terjual" radius={[0, 6, 6, 0]}>
                  {produkTerlaris.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#9E4BDC' : i === 1 ? '#22285E' : '#95D5B6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Indikator Kinerja Bisnis ── */}
      <Card
        title="Indikator Kinerja Bisnis Na_store.id"
        subtitle="Evaluasi performa toko aksesoris bulan ini"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {kinerja.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F4F4F5] flex items-center justify-center">
                      <Icon className="text-xs" style={{ color: k.color }} />
                    </div>
                    <p className="text-sm font-bold text-[#22285E]">{k.label}</p>
                  </div>
                  <span className="text-sm font-black text-[#22285E]">{k.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F4F4F5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-[1500ms] ease-out"
                    style={{ width: `${k.val}%`, backgroundColor: k.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Ringkasan Kategori ── */}
      <Card
        title="Ringkasan per Kategori Aksesoris"
        subtitle="Perbandingan omzet dan unit terjual tiap kategori"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Nail Art",          terjual: 352, omzet: "Rp 7,7 Jt", color: "#9E4BDC" },
            { label: "Aksesoris Rambut",  terjual: 525, omzet: "Rp 6,5 Jt", color: "#22285E" },
            { label: "Anting",            terjual: 266, omzet: "Rp 9,5 Jt", color: "#95D5B6" },
            { label: "Gelang",            terjual: 202, omzet: "Rp 7,0 Jt", color: "#00B5AD" },
            { label: "Kalung",            terjual: 147, omzet: "Rp 12,3 Jt", color: "#F24E1E" },
            { label: "Lainnya",           terjual: 503, omzet: "Rp 8,2 Jt", color: "#A1A1AA" },
          ].map((cat, i) => (
            <div key={i} className="bg-[#F4F4F5] rounded-2xl p-4 text-center hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#E4E4E7]">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: cat.color }}
              />
              <p className="text-[10px] font-bold text-[#22285E] leading-tight mb-1">{cat.label}</p>
              <p className="text-lg font-black text-[#22285E]">{cat.terjual}</p>
              <p className="text-[9px] text-[#A1A1AA] font-medium">unit terjual</p>
              <p className="text-[10px] font-bold mt-1" style={{ color: cat.color }}>{cat.omzet}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
