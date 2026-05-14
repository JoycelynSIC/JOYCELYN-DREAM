import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaMoneyBillWave, FaShoppingCart,
  FaUserPlus, FaTimesCircle, FaFire, FaChartLine, FaTachometerAlt
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

// ── DATA ──
const penjualanData = {
  Mingguan: [
    { label: 'Sen', nilai: 12 }, { label: 'Sel', nilai: 19 }, { label: 'Rab', nilai: 15 },
    { label: 'Kam', nilai: 22 }, { label: 'Jum', nilai: 18 }, { label: 'Sab', nilai: 25 }, { label: 'Min', nilai: 21 },
  ],
  Bulanan: [
    { label: 'Jan', nilai: 45 }, { label: 'Feb', nilai: 62 }, { label: 'Mar', nilai: 55 },
    { label: 'Apr', nilai: 78 }, { label: 'Mei', nilai: 68 }, { label: 'Jun', nilai: 85 },
    { label: 'Jul', nilai: 72 }, { label: 'Agu', nilai: 90 }, { label: 'Sep', nilai: 80 },
    { label: 'Okt', nilai: 95 }, { label: 'Nov', nilai: 88 }, { label: 'Des', nilai: 102 },
  ],
  Tahunan: [
    { label: '2022', nilai: 520 }, { label: '2023', nilai: 680 },
    { label: '2024', nilai: 750 }, { label: '2025', nilai: 820 },
  ],
};

const produkTerlaris = [
  { name: 'Gelang Bead',       terjual: 88 },
  { name: 'Anting Hoop',       terjual: 72 },
  { name: 'Kalung Titanium',   terjual: 58 },
  { name: 'Kalung Choker',     terjual: 41 },
  { name: 'Cincin Adjustable', terjual: 29 },
];

const kinerja = [
  { label: 'Konversi',     val: 74, color: '#9E4BDC', icon: FaChartLine     },
  { label: 'Kepuasan',     val: 88, color: '#00B5AD', icon: FaTachometerAlt },
  { label: 'Retur',        val: 12, color: '#F24E1E', icon: FaTimesCircle   },
  { label: 'Repeat Order', val: 63, color: '#9E4BDC', icon: FaFire          },
];

const kpiConfig = [
  { label: 'Pendapatan',    val: 'Rp 8,4 Jt', change: '+12%', up: true,  icon: FaMoneyBillWave },
  { label: 'Total Pesanan', val: '127',        change: '+8%',  up: true,  icon: FaShoppingCart  },
  { label: 'Pelanggan Baru',val: '14',         change: '+3%',  up: true,  icon: FaUserPlus      },
  { label: 'Produk Habis',  val: '2',          change: '-1',   up: false, icon: FaTimesCircle   },
];

// ── TOOLTIP ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-white border border-surface-border px-3 py-2 rounded-xl shadow-lg font-poppins">
        <p className="text-text-disable text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <p className="text-text-dark text-sm font-bold">{payload[0].value} Transaksi</p>
      </div>
    );
  }
  return null;
};

// ── MAIN ──
export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Bulanan');
  const data = penjualanData[activeTab];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Analytics" breadcrumb={['Dashboard', 'Analytics']} />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiConfig.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-surface-white border border-surface-border rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">{k.label}</p>
                <div className="w-8 h-8 bg-surface-gray rounded-xl flex items-center justify-center text-primary text-xs">
                  <Icon />
                </div>
              </div>
              <p className="text-2xl font-black text-text-dark leading-tight">{k.val}</p>
              <div className={`flex items-center gap-1 mt-2 text-[11px] font-bold ${k.up ? 'text-status-success' : 'text-status-warning'}`}>
                {k.up ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                {k.change}
                <span className="text-text-disable font-medium ml-1">vs bulan lalu</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Tren Penjualan */}
        <div className="lg:col-span-2 bg-surface-white border border-surface-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <FaChartLine />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-dark">Tren Penjualan</h3>
                <p className="text-[11px] text-text-light">Volume transaksi periode ini</p>
              </div>
            </div>
            <div className="flex gap-1 bg-surface-neutral p-1 rounded-xl border border-surface-border">
              {['Mingguan', 'Bulanan', 'Tahunan'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab ? 'bg-primary text-surface-white shadow-sm' : 'text-text-disable hover:text-text-light'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 600 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="nilai" stroke="#9E4BDC" strokeWidth={3}
                  dot={{ fill: '#9E4BDC', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#9E4BDC', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produk Terlaris */}
        <div className="bg-surface-white border border-surface-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-status-warning/10 rounded-xl flex items-center justify-center text-status-warning">
              <FaFire />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-dark">Terlaris</h3>
              <p className="text-[11px] text-text-light">Unit terbanyak terjual</p>
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={produkTerlaris} layout="vertical" barSize={14} margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#22285E', fontWeight: 600 }} axisLine={false} tickLine={false} width={105} />
                <Tooltip cursor={{ fill: '#F4F4F5' }} content={<CustomTooltip />} />
                <Bar dataKey="terjual" radius={[0, 6, 6, 0]}>
                  {produkTerlaris.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#9E4BDC' : '#95D5B6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Indikator Kinerja ── */}
      <div className="bg-surface-white border border-surface-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-status-success">
            <FaTachometerAlt />
          </div>
          <h3 className="text-base font-bold text-text-dark">Indikator Kinerja Bisnis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {kinerja.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-surface-gray flex items-center justify-center">
                      <Icon className="text-xs" style={{ color: k.color }} />
                    </div>
                    <p className="text-sm font-bold text-text-dark">{k.label}</p>
                  </div>
                  <span className="text-sm font-black text-text-dark">{k.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-neutral rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-[1500ms] ease-out"
                    style={{ width: `${k.val}%`, backgroundColor: k.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
