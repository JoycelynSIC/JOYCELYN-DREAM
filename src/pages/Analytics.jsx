import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaMoneyBillWave, FaShoppingCart,
  FaUserPlus, FaTimesCircle, FaFire, FaChartLine, FaTachometerAlt
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

// ── 1. DATA CONFIGURATION ──
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
  { name: 'Gelang Bead',    terjual: 88 },
  { name: 'Anting Hoop',    terjual: 72 },
  { name: 'Kalung Titanium', terjual: 58 },
  { name: 'Kalung Choker',   terjual: 41 },
  { name: 'Cincin Adjustable', terjual: 29 },
];

const kinerja = [
  { label: 'Konversi',     val: 74, color: 'var(--color-primary)', icon: FaChartLine     },
  { label: 'Kepuasan',     val: 88, color: 'var(--color-secondary)', icon: FaTachometerAlt },
  { label: 'Retur',        val: 12, color: 'var(--color-status-warning)', icon: FaTimesCircle   },
  { label: 'Repeat Order', val: 63, color: 'var(--color-primary)', icon: FaFire           },
];

const kpiConfig = [
  { label: 'Pendapatan', val: 'Rp 8,4 Jt', change: '+12%', up: true,  icon: FaMoneyBillWave },
  { label: 'Total Pesanan', val: '127', change: '+8%', up: true,  icon: FaShoppingCart },
  { label: 'Pelanggan Baru', val: '14', change: '+3%', up: true,  icon: FaUserPlus },
  { label: 'Produk Habis', val: '2', change: '-1', up: false, icon: FaTimesCircle },
];

// ── 2. CUSTOM COMPONENTS ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-white border border-surface-border px-3 py-2 rounded-xl shadow-xl font-poppins">
        <p className="text-text-light text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <p className="text-text-dark text-sm font-bold">{payload[0].value} Transaksi</p>
      </div>
    );
  }
  return null;
};

// ── 3. MAIN COMPONENT ──
export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Bulanan');
  const data = penjualanData[activeTab];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Analytics" breadcrumb={['Dashboard', 'Analytics']} />

      {/* ── KPI Cards Section ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiConfig.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-surface-white border border-surface-border rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">{k.label}</p>
                <div className="w-8 h-8 bg-surface-style rounded-xl flex items-center justify-center text-primary text-xs shadow-sm">
                  <Icon />
                </div>
              </div>
              <p className="text-2xl font-bold text-text-dark leading-tight">{k.val}</p>
              <div className={`flex items-center gap-1 mt-2 text-[11px] font-bold ${k.up ? 'text-status-success' : 'text-status-warning'}`}>
                {k.up ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                {k.change} <span className="text-text-light font-medium ml-1">vs bulan lalu</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tren Penjualan (Line Chart) */}
        <div className="lg:col-span-2 bg-surface-white border border-surface-border rounded-[32px] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <FaChartLine />
              </div>
              <div>
                <h3 className="text-title-m font-bold text-text-dark">Tren Penjualan</h3>
                <p className="text-body-xs text-text-light">Volume transaksi periode ini</p>
              </div>
            </div>
            <div className="flex gap-1 bg-surface-neutral p-1 rounded-xl">
              {['Mingguan', 'Bulanan', 'Tahunan'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab ? 'bg-primary text-surface-white shadow-md' : 'text-text-disable hover:text-text-light'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-neutral)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-disable)', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-disable)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="nilai" stroke="var(--color-primary)" strokeWidth={4}
                  dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: 'var(--color-primary)', stroke: '#fff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produk Terlaris (Bar Chart Horizontal) */}
        <div className="bg-surface-white border border-surface-border rounded-[32px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-status-warning/10 rounded-2xl flex items-center justify-center text-status-warning">
              <FaFire />
            </div>
            <div>
              <h3 className="text-title-m font-bold text-text-dark">Terlaris</h3>
              <p className="text-body-xs text-text-light">Unit terbanyak terjual</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={produkTerlaris} layout="vertical" barSize={16} margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-dark)', fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{ fill: 'var(--color-surface-style)' }} content={<CustomTooltip />} />
                <Bar dataKey="terjual" radius={[0, 8, 8, 0]}>
                  {produkTerlaris.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 3: Performance Indicators ── */}
      <div className="bg-surface-white border border-surface-border rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
            <FaTachometerAlt />
          </div>
          <h3 className="text-title-m font-bold text-text-dark">Indikator Kinerja Bisnis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {kinerja.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-surface-neutral group-hover:bg-surface-style transition-colors">
                      <Icon className="text-xs" style={{ color: k.color }} />
                    </div>
                    <p className="text-body-s font-bold text-text-dark">{k.label}</p>
                  </div>
                  <span className="text-body-m font-black text-text-dark">{k.val}%</span>
                </div>
                <div className="w-full h-3.5 bg-surface-neutral rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-[2000ms] ease-in-out shadow-sm"
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