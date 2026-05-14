import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  FaBell, FaUsers, FaStar, FaExclamationTriangle,
  FaTrophy, FaBoxOpen, FaShoppingBag, FaCheckCircle,
  FaSpinner, FaTruck, FaTimesCircle
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';

// ── DATA ──
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
    { hari: 'Jan', nilai: 70, omzet: 4900000 }, { hari: 'Feb', nilai: 52, omzet: 3640000 },
    { hari: 'Mar', nilai: 91, omzet: 6370000 }, { hari: 'Apr', nilai: 44, omzet: 3080000 },
    { hari: 'Mei', nilai: 97, omzet: 6790000 }, { hari: 'Jun', nilai: 63, omzet: 4410000 },
    { hari: 'Jul', nilai: 85, omzet: 5950000 }, { hari: 'Agu', nilai: 74, omzet: 5180000 },
    { hari: 'Sep', nilai: 60, omzet: 4200000 }, { hari: 'Okt', nilai: 88, omzet: 6160000 },
    { hari: 'Nov', nilai: 95, omzet: 6650000 }, { hari: 'Des', nilai: 102, omzet: 7140000 },
  ],
};

const statusConfig = {
  'Selesai': { style: 'bg-status-success/10 text-status-success border border-status-success/20', icon: FaCheckCircle },
  'Proses':  { style: 'bg-surface-neutral text-text-light border border-surface-border',          icon: FaSpinner    },
  'Dikirim': { style: 'bg-secondary/20 text-text-dark border border-secondary/30',                icon: FaTruck      },
  'Batal':   { style: 'bg-status-warning/10 text-status-warning border border-status-warning/20', icon: FaTimesCircle },
};

// ── CUSTOM TOOLTIP ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const omzet = payload[0]?.payload?.omzet;
    return (
      <div className="bg-surface-white px-4 py-3 rounded-xl shadow-lg border border-surface-border font-poppins">
        <p className="text-text-disable text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <p className="text-text-dark text-sm font-bold">{payload[0].value} Transaksi</p>
        {omzet && <p className="text-primary text-[11px] mt-1 font-semibold">Rp {omzet.toLocaleString('id')}</p>}
      </div>
    );
  }
  return null;
};

// ── MAIN ──
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Bulanan');

  const lowStock = 5;
  const outOfStock = 2;
  const totalPoin = 1250000;
  const topCustomer = { name: "Andi Wijaya", poin: 8500, transaksi: 42, type: "Platinum Member" };
  const recentOrders = [
    { id: 1, customer: "Budi Santoso",  produk: "Paket Hemat A",    total: 150000, poin: 15, status: "Selesai" },
    { id: 2, customer: "Siska Putri",   produk: "Layanan Premium",  total: 450000, poin: 45, status: "Proses"  },
    { id: 3, customer: "Rian Aldi",     produk: "Member Bulanan",   total: 200000, poin: 20, status: "Dikirim" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Dashboard" breadcrumb={['Dashboard']} />

      {/* ── ROW 1: STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Notifikasi */}
        <div className="bg-surface-white border border-surface-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-11 h-11 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0">
            <FaBell className="text-status-success text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Notifikasi</p>
            <p className="text-2xl font-black text-text-dark leading-tight">5</p>
            <p className="text-[10px] text-text-light">Belum dibaca</p>
          </div>
        </div>

        {/* Stok Kritis */}
        <div className="bg-status-warning/5 border border-status-warning/20 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-11 h-11 bg-status-warning/15 rounded-xl flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-status-warning text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-status-warning">Stok Kritis</p>
            <p className="text-2xl font-black text-text-dark leading-tight">{lowStock + outOfStock}</p>
            <p className="text-[10px] text-text-light">{outOfStock} Habis · {lowStock} Menipis</p>
          </div>
        </div>

        {/* Pelanggan */}
        <div className="bg-primary rounded-2xl p-5 flex items-center gap-4 shadow-md shadow-primary/20">
          <div className="w-11 h-11 bg-surface-white/20 rounded-xl flex items-center justify-center shrink-0 border border-surface-white/30">
            <FaUsers className="text-surface-white text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-surface-white/70">Pelanggan</p>
            <p className="text-2xl font-black text-surface-white leading-tight">1.2k</p>
            <p className="text-[10px] text-surface-white/60">Total terdaftar</p>
          </div>
        </div>

        {/* Total Poin */}
        <div className="bg-surface-white border border-surface-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-11 h-11 bg-surface-gray rounded-xl flex items-center justify-center shrink-0">
            <FaStar className="text-yellow-400 text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Total Poin</p>
            <p className="text-2xl font-black text-text-dark leading-tight">{totalPoin.toLocaleString('id')}</p>
            <p className="text-[10px] text-text-light">Poin beredar</p>
          </div>
        </div>
      </div>

      {/* ── ROW 2: CHART & SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Grafik Penjualan */}
        <div className="lg:col-span-2 bg-surface-white border border-surface-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-text-dark">Grafik Penjualan</h3>
              <p className="text-[11px] text-text-light mt-0.5">Transaksi harian Na_store.id</p>
            </div>
            <div className="flex gap-1 bg-surface-neutral p-1 rounded-xl border border-surface-border">
              {['Harian', 'Mingguan', 'Bulanan'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-surface-white shadow-sm'
                      : 'text-text-disable hover:text-text-light'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataMap[activeTab]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9E4BDC" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9E4BDC" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis dataKey="hari" tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F4F4F5' }} />
                <Bar dataKey="nilai" fill="url(#barGrad)" radius={[6, 6, 2, 2]} barSize={activeTab === 'Bulanan' ? 18 : 32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Kanan */}
        <div className="space-y-4">
          {/* Top Pelanggan */}
          <div className="bg-primary rounded-2xl p-5 shadow-md shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-white/10 rounded-full" />
            <div className="absolute -right-2 -bottom-4 w-16 h-16 bg-surface-white/5 rounded-full" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <FaTrophy className="text-yellow-300 text-sm" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-white/70">Top Pelanggan</p>
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-11 h-11 bg-surface-white/20 rounded-xl flex items-center justify-center text-base font-black text-surface-white border border-surface-white/30">
                {topCustomer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-surface-white leading-none">{topCustomer.name}</p>
                <p className="text-[11px] text-surface-white/60 mt-0.5">{topCustomer.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-surface-white relative z-10">
              <span className="text-sm font-bold flex items-center gap-1.5">
                <FaStar className="text-yellow-300 text-xs" /> {topCustomer.poin.toLocaleString('id')} poin
              </span>
              <span className="text-[10px] bg-surface-white/20 px-2.5 py-1 rounded-lg font-medium">
                {topCustomer.transaksi}x Order
              </span>
            </div>
          </div>

          {/* Kelola Stok */}
          <Link to="/inventory"
            className="flex items-center justify-between p-5 bg-surface-white border border-surface-border rounded-2xl hover:border-status-warning/50 hover:shadow-sm transition-all group">
            <div>
              <p className="text-sm font-bold text-text-dark">Kelola Stok</p>
              <p className="text-[11px] text-text-light mt-0.5">Cek barang menipis</p>
            </div>
            <div className="w-10 h-10 bg-status-warning/10 rounded-xl flex items-center justify-center text-status-warning group-hover:bg-status-warning group-hover:text-surface-white transition-all">
              <FaBoxOpen className="text-sm" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── ROW 3: PESANAN TERBARU ── */}
      <div className="bg-surface-white border border-surface-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-text-dark">Pesanan Terbaru</h3>
          <Link to="/orders" className="text-primary text-[11px] font-bold hover:underline">Lihat Semua →</Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[560px] space-y-1">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-4 px-4 pb-2 border-b border-surface-border">
              {['Pelanggan', 'Produk', 'Total', 'Poin', 'Status'].map(h => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-text-disable">{h}</p>
              ))}
            </div>
            {recentOrders.map(order => {
              const sc = statusConfig[order.status];
              const StatusIcon = sc.icon;
              return (
                <div key={order.id}
                  className="grid grid-cols-5 items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-neutral transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-black shrink-0">
                      {order.customer.charAt(0)}
                    </div>
                    <p className="text-xs font-bold text-text-dark truncate">{order.customer}</p>
                  </div>
                  <p className="text-xs text-text-light truncate">{order.produk}</p>
                  <p className="text-xs font-bold text-text-dark">Rp {order.total.toLocaleString('id')}</p>
                  <p className="text-xs font-bold text-status-success flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-[9px]" />+{order.poin}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit ${sc.style}`}>
                    <StatusIcon className="text-[9px]" />{order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
