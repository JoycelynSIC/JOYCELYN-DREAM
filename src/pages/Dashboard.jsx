import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import inventoryData from '../data/inventory.json';
import scheduleData from '../data/schedule.json';
import customerData from '../data/customer.json';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import {
  FaBell, FaBoxOpen, FaUsers, FaExclamationTriangle, FaStar,
  FaTrophy, FaShoppingBag, FaCheckCircle, FaTruck, FaSpinner, FaTimesCircle
} from 'react-icons/fa';

const chartDataMap = {
  Harian: [
    { hari: 'Sen', nilai: 20, omzet: 1400000 }, { hari: 'Sel', nilai: 35, omzet: 2450000 },
    { hari: 'Rab', nilai: 28, omzet: 1960000 }, { hari: 'Kam', nilai: 45, omzet: 3150000 },
    { hari: 'Jum', nilai: 38, omzet: 2660000 }, { hari: 'Sab', nilai: 52, omzet: 3640000 },
    { hari: 'Min', nilai: 44, omzet: 3080000 },
  ],
  Mingguan: [
    { hari: 'Mg 1', nilai: 55, omzet: 3850000 }, { hari: 'Mg 2', nilai: 72, omzet: 5040000 },
    { hari: 'Mg 3', nilai: 63, omzet: 4410000 }, { hari: 'Mg 4', nilai: 88, omzet: 6160000 },
  ],
  Bulanan: [
    { hari: 'Jan', nilai: 70,  omzet: 4900000  }, { hari: 'Feb', nilai: 52,  omzet: 3640000  },
    { hari: 'Mar', nilai: 91,  omzet: 6370000  }, { hari: 'Apr', nilai: 44,  omzet: 3080000  },
    { hari: 'Mei', nilai: 97,  omzet: 6790000  }, { hari: 'Jun', nilai: 63,  omzet: 4410000  },
    { hari: 'Jul', nilai: 85,  omzet: 5950000  }, { hari: 'Agu', nilai: 74,  omzet: 5180000  },
    { hari: 'Sep', nilai: 60,  omzet: 4200000  }, { hari: 'Okt', nilai: 88,  omzet: 6160000  },
    { hari: 'Nov', nilai: 95,  omzet: 6650000  }, { hari: 'Des', nilai: 102, omzet: 7140000  },
  ],
};

const statusConfig = {
  'Selesai': { style: 'bg-primary text-on-primary', icon: FaCheckCircle },
  'Proses':  { style: 'bg-soft text-gray-500',      icon: FaSpinner     },
  'Dikirim': { style: 'bg-secondary text-gray-600', icon: FaTruck       },
  'Batal':   { style: 'bg-accent/20 text-on-primary', icon: FaTimesCircle },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const omzet = payload[0]?.payload?.omzet;
    return (
      <div className="bg-gray-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-gray-700">
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-sm">{payload[0].value} transaksi</p>
        {omzet && <p className="text-primary text-[11px] mt-0.5">Rp {omzet.toLocaleString('id')}</p>}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Bulanan');

  const lowStock    = inventoryData.filter(i => i.stock > 0 && i.stock <= 8).length;
  const outOfStock  = inventoryData.filter(i => i.stock === 0).length;
  const totalPoin   = customerData.reduce((a, c) => a + c.poin, 0);
  const topCustomer = [...customerData].sort((a, b) => b.poin - a.poin)[0];

  const recentOrders = [
    { id: '#ORD-091', customer: 'Dewi Lestari',  produk: 'Kalung Titanium Rosegold', total: 'Rp 170.000', status: 'Selesai', poin: 170 },
    { id: '#ORD-090', customer: 'Amelia Putri',  produk: 'Anting Hoop Minimalist',   total: 'Rp 70.000',  status: 'Proses',  poin: 70  },
    { id: '#ORD-089', customer: 'Siti Sarah',    produk: 'Gelang Crystal Aesthetic', total: 'Rp 90.000',  status: 'Selesai', poin: 90  },
    { id: '#ORD-088', customer: 'Nadia Rahma',   produk: 'Cincin Adjustable Gold',   total: 'Rp 75.000',  status: 'Dikirim', poin: 75  },
    { id: '#ORD-087', customer: 'Hendra Wijaya', produk: 'Kalung Choker Hitam',      total: 'Rp 55.000',  status: 'Selesai', poin: 55  },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      <PageHeader title="Dashboard" breadcrumb={['Dashboard']} />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Notifikasi */}
        <div className="bg-white border border-secondary rounded-3xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
            <FaBell className="text-on-primary text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Notifikasi</p>
            <p className="text-2xl font-black text-gray-700">5</p>
            <p className="text-[10px] text-gray-400">Belum dibaca</p>
          </div>
        </div>

        {/* Stok Kritis */}
        <div className="bg-accent/10 border border-accent/20 rounded-3xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-accent text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary">Stok Kritis</p>
            <p className="text-2xl font-black text-on-primary">{lowStock + outOfStock}</p>
            <p className="text-[10px] text-on-primary/70">{outOfStock} habis · {lowStock} menipis</p>
          </div>
        </div>

        {/* Pelanggan */}
        <div className="bg-primary border border-primary rounded-3xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-white/40 rounded-2xl flex items-center justify-center shrink-0">
            <FaUsers className="text-on-primary text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary/70">Pelanggan</p>
            <p className="text-2xl font-black text-on-primary">{customerData.length}</p>
            <p className="text-[10px] text-on-primary/70">Total terdaftar</p>
          </div>
        </div>

        {/* Total Poin */}
        <div className="bg-white border border-secondary rounded-3xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-soft rounded-2xl flex items-center justify-center shrink-0">
            <FaStar className="text-yellow-400 text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Poin</p>
            <p className="text-2xl font-black text-gray-700">{totalPoin.toLocaleString('id')}</p>
            <p className="text-[10px] text-gray-400">Poin beredar</p>
          </div>
        </div>
      </div>

      {/* ── Row 2: Grafik + Jadwal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Grafik Penjualan */}
        <div className="lg:col-span-2 bg-white border border-secondary rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-black text-gray-700">Grafik Penjualan</h3>
              <p className="text-xs text-gray-400 mt-0.5">Jumlah transaksi Na_store.id</p>
            </div>
            <div className="flex gap-1 bg-soft p-1 rounded-xl">
              {['Harian', 'Mingguan', 'Bulanan'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab ? 'bg-primary text-on-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex gap-6 mb-5 pb-4 border-b border-soft">
            {[
              { label: 'Total Transaksi', val: chartDataMap[activeTab].reduce((a, d) => a + d.nilai, 0), color: 'text-gray-700' },
              { label: 'Est. Omzet', val: `Rp ${(chartDataMap[activeTab].reduce((a, d) => a + d.omzet, 0) / 1000000).toFixed(1)} Jt`, color: 'text-gray-700' },
              { label: 'Tertinggi', val: `${Math.max(...chartDataMap[activeTab].map(d => d.nilai))} trx`, color: 'text-on-primary' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
                <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={chartDataMap[activeTab]}
              barSize={activeTab === 'Bulanan' ? 22 : activeTab === 'Mingguan' ? 48 : 32}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#FF8DC7" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FFB9B9" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="barGradientTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#ff5fa8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FF8DC7" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFF0F3" vertical={false} />
              <XAxis dataKey="hari" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} axisLine={false} tickLine={false} dy={6} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FFF5F5', radius: [6, 6, 0, 0] }} />
              <Bar dataKey="nilai" radius={[8, 8, 3, 3]}>
                {chartDataMap[activeTab].map((entry, i) => {
                  const max = Math.max(...chartDataMap[activeTab].map(d => d.nilai));
                  return <Cell key={i} fill={entry.nilai === max ? 'url(#barGradientTop)' : 'url(#barGradient)'} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Jadwal Hari Ini */}
        <div className="bg-white border border-secondary rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-black text-gray-700">Jadwal Hari Ini</h3>
              <p className="text-xs text-gray-400 mt-0.5">{scheduleData.length} kegiatan</p>
            </div>
            <Link to="/schedule" className="text-[11px] font-bold text-accent hover:text-on-primary transition-colors">
              Lihat Semua →
            </Link>
          </div>
          <div className="space-y-2 flex-1">
            {scheduleData.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-soft transition-colors">
                <div className={`w-1.5 h-8 rounded-full shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">{item.task}</p>
                  <p className="text-[10px] text-gray-400">{item.time}</p>
                </div>
                <span className="text-[10px] bg-soft text-gray-400 px-2 py-1 rounded-lg font-medium shrink-0">
                  {item.kategori}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Pesanan Terbaru + Sidebar kanan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Pesanan Terbaru */}
        <div className="lg:col-span-2 bg-white border border-secondary rounded-3xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-black text-gray-700">Pesanan Terbaru</h3>
              <p className="text-xs text-gray-400 mt-0.5">5 transaksi terakhir</p>
            </div>
            <Link to="/orders" className="text-[11px] font-bold text-accent hover:text-on-primary transition-colors">
              Lihat Semua →
            </Link>
          </div>
          <div className="space-y-1">
            {recentOrders.map(order => {
              const sc = statusConfig[order.status];
              const StatusIcon = sc.icon;
              return (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-soft transition-colors">
                  <div className="w-9 h-9 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
                    <FaShoppingBag className="text-on-primary text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">{order.customer}</p>
                    <p className="text-[10px] text-gray-400 truncate">{order.produk}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-gray-700">{order.total}</p>
                    <p className="text-[10px] text-accent font-semibold flex items-center justify-end gap-0.5">
                      <FaStar className="text-yellow-400 text-[8px]" />+{order.poin} poin
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${sc.style}`}>
                    <StatusIcon className="text-[9px]" />{order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kanan: Top Pelanggan + Stok Kritis */}
        <div className="space-y-4">

          {/* Top Pelanggan */}
          <div className="bg-primary rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FaTrophy className="text-yellow-400 text-sm" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary/70">Top Pelanggan</p>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center text-sm font-black text-on-primary">
                {topCustomer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-on-primary">{topCustomer.name}</p>
                <p className="text-[10px] text-on-primary/70">{topCustomer.type}</p>
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-on-primary">
              <span className="flex items-center gap-1"><FaStar className="text-yellow-400 text-[10px]" />{topCustomer.poin.toLocaleString('id')} poin</span>
              <span>{topCustomer.transaksi}x transaksi</span>
            </div>
            <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          {/* Stok Kritis */}
          <div className="bg-white border border-secondary rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <FaExclamationTriangle className="text-accent text-sm" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stok Kritis</p>
            </div>
            <div className="space-y-2.5">
              {inventoryData.filter(i => i.stock <= 8).slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaBoxOpen className="text-gray-300 text-xs shrink-0" />
                    <p className="text-xs font-semibold text-gray-600 truncate">{item.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.stock === 0 ? 'bg-accent/20 text-on-primary' : 'bg-soft text-gray-500'
                  }`}>
                    {item.stock === 0 ? 'Habis' : `${item.stock} pcs`}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/inventory" className="flex items-center justify-center gap-1 mt-4 text-[11px] font-bold text-accent hover:text-on-primary transition-colors">
              <FaBoxOpen className="text-[10px]" /> Kelola Stok
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
