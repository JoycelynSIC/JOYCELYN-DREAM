import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaMoneyBillWave, FaShoppingCart,
  FaUserPlus, FaTimesCircle, FaFire, FaChartLine, FaTachometerAlt
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

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
  { label: 'Konversi',     val: 74, color: '#FFB9B9', icon: FaChartLine     },
  { label: 'Kepuasan',     val: 88, color: '#FFDDD2', icon: FaTachometerAlt },
  { label: 'Retur',        val: 12, color: '#FF8DC7', icon: FaTimesCircle   },
  { label: 'Repeat Order', val: 63, color: '#FFB9B9', icon: FaFire          },
];

const kpiConfig = [
  { label: 'Pendapatan Bulan Ini', val: 'Rp 8,4 Jt', change: '+12%', up: true,  icon: FaMoneyBillWave },
  { label: 'Total Pesanan',        val: '127',        change: '+8%',  up: true,  icon: FaShoppingCart  },
  { label: 'Pelanggan Baru',       val: '14',         change: '+3%',  up: true,  icon: FaUserPlus      },
  { label: 'Produk Habis',         val: '2',          change: '-1',   up: false, icon: FaTimesCircle   },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
        <p className="text-gray-400 mb-0.5">{label}</p>
        <p>{payload[0].value} transaksi</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Bulanan');
  const data = penjualanData[activeTab];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader title="Analytics" breadcrumb={['Dashboard', 'Analytics']} />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiConfig.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white border border-secondary rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{k.label}</p>
                <div className="w-7 h-7 bg-soft rounded-xl flex items-center justify-center">
                  <Icon className="text-primary text-xs" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-700">{k.val}</p>
              <div className={`flex items-center gap-1 mt-1 text-[11px] font-bold ${k.up ? 'text-on-primary' : 'text-accent'}`}>
                {k.up ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
                {k.change} vs bulan lalu
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Grafik + Produk Terlaris ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Grafik Tren */}
        <div className="lg:col-span-2 bg-white border border-secondary rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-soft rounded-xl flex items-center justify-center">
                <FaChartLine className="text-primary text-sm" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-700">Tren Penjualan</h3>
                <p className="text-xs text-gray-400">Jumlah transaksi per periode</p>
              </div>
            </div>
            <div className="flex gap-1 bg-soft p-1 rounded-xl">
              {['Mingguan', 'Bulanan', 'Tahunan'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab ? 'bg-primary text-on-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFF5F5" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="nilai" stroke="#FFB9B9" strokeWidth={3}
                dot={{ fill: '#FFB9B9', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#FF8DC7', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Produk Terlaris */}
        <div className="bg-white border border-secondary rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-soft rounded-xl flex items-center justify-center">
              <FaFire className="text-accent text-sm" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-700">Produk Terlaris</h3>
              <p className="text-xs text-gray-400">Berdasarkan jumlah terjual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={produkTerlaris} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFF5F5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FFF5F5' }} />
              <Bar dataKey="terjual" fill="#FFB9B9" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Indikator Kinerja ── */}
      <div className="bg-white border border-secondary rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-soft rounded-xl flex items-center justify-center">
            <FaTachometerAlt className="text-primary text-sm" />
          </div>
          <h3 className="text-base font-black text-gray-700">Indikator Kinerja</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {kinerja.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className="text-xs" style={{ color: k.color }} />
                    <p className="text-xs font-bold text-gray-600">{k.label}</p>
                  </div>
                  <span className="text-xs font-black text-gray-700">{k.val}%</span>
                </div>
                <div className="w-full h-3 bg-soft rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-[1500ms] ease-out"
                    style={{ width: `${k.val}%`, backgroundColor: k.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
