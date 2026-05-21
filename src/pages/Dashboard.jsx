import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  FaBell, FaUsers, FaStar, FaExclamationTriangle,
  FaTrophy, FaBoxOpen, FaSearch // Tambahkan FaSearch untuk input
} from 'react-icons/fa';

// Import Komponen Modular
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Input from '../components/Input'; // Import Komponen Input Baru

// ── DATA CHART ──
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

// ── CUSTOM TOOLTIP ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const omzet = payload[0]?.payload?.omzet;
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-[#E4E4E7] font-poppins">
        <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <p className="text-[#22285E] text-sm font-bold">{payload[0].value} Transaksi</p>
        {omzet && <p className="text-[#9E4BDC] text-[11px] mt-1 font-semibold">Rp {omzet.toLocaleString('id')}</p>}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Bulanan');
  const [searchQuery, setSearchQuery] = useState(''); // State untuk input pencarian

  // Mock Data
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
        <StatCard 
          label="Notifikasi" 
          value="5" 
          desc="Belum dibaca" 
          icon={<FaBell />} 
          iconBgColor="bg-[#95D5B6]/20" 
          iconColor="text-[#00B5AD]" 
        />
        <StatCard 
          label="Stok Kritis" 
          value={lowStock + outOfStock} 
          desc={`${outOfStock} Habis · ${lowStock} Menipis`} 
          icon={<FaExclamationTriangle />} 
          iconBgColor="bg-[#F24E1E]/15" 
          iconColor="text-[#F24E1E]" 
        />
        <StatCard 
          variant="primary"
          label="Pelanggan" 
          value="1.2k" 
          desc="Total terdaftar" 
          icon={<FaUsers />} 
        />
        <StatCard 
          label="Total Poin" 
          value={totalPoin.toLocaleString('id')} 
          desc="Poin beredar" 
          icon={<FaStar />} 
          iconBgColor="bg-[#F0F2F5]" 
          iconColor="text-yellow-400" 
        />
      </div>

      {/* ── ROW 2: CHART & SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Grafik Penjualan */}
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-[#22285E]">Grafik Penjualan</h3>
              <p className="text-[11px] text-[#71717A] mt-0.5">Transaksi harian Na_store.id</p>
            </div>
            
            {/* Filter Button */}
            <div className="flex gap-1 bg-[#F4F4F5] p-1 rounded-xl border border-[#E4E4E7]">
              {['Harian', 'Mingguan', 'Bulanan'].map(tab => (
                <Button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  isActive={activeTab === tab}
                >
                  {tab}
                </Button>
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
          <div className="bg-[#9E4BDC] rounded-2xl p-5 shadow-md shadow-[#9E4BDC]/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-2 -bottom-4 w-16 h-16 bg-white/5 rounded-full" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <FaTrophy className="text-yellow-300 text-sm" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Top Pelanggan</p>
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-base font-black text-white border border-white/30">
                {topCustomer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">{topCustomer.name}</p>
                <p className="text-[11px] text-white/60 mt-0.5">{topCustomer.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-white relative z-10">
              <span className="text-sm font-bold flex items-center gap-1.5">
                <FaStar className="text-yellow-300 text-xs" /> {topCustomer.poin.toLocaleString('id')} poin
              </span>
              <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-lg font-medium">
                {topCustomer.transaksi}x Order
              </span>
            </div>
          </div>

          {/* Kelola Stok */}
          <Link to="/inventory"
            className="flex items-center justify-between p-5 bg-white border border-[#E4E4E7] rounded-2xl hover:border-[#F24E1E]/50 hover:shadow-sm transition-all group">
            <div>
              <p className="text-sm font-bold text-[#22285E]">Kelola Stok</p>
              <p className="text-[11px] text-[#71717A] mt-0.5">Cek barang menipis</p>
            </div>
            <div className="w-10 h-10 bg-[#F24E1E]/10 rounded-xl flex items-center justify-center text-[#F24E1E] group-hover:bg-[#F24E1E] group-hover:text-white transition-all">
              <FaBoxOpen className="text-sm" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── ROW 3: PESANAN TERBARU ── */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h3 className="text-base font-bold text-[#22285E]">Pesanan Terbaru</h3>
            <p className="text-[11px] text-[#71717A] mt-0.5">Monitoring transaksi masuk</p>
          </div>
          
          {/* IMPLEMENTASI INPUT UNTUK PENCARIAN */}
          <div className="w-full md:w-72">
            <Input 
              placeholder="Cari nama pelanggan..."
              icon={FaSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!gap-0" // Menghilangkan gap atas karena tidak pakai label
            />
          </div>

          <Link to="/orders" className="text-[#9E4BDC] text-[11px] font-bold hover:underline hidden md:block">Lihat Semua →</Link>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[560px] space-y-1">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-4 px-4 pb-2 border-b border-[#E4E4E7]">
              {['Pelanggan', 'Produk', 'Total', 'Poin', 'Status'].map(h => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h}</p>
              ))}
            </div>

            {recentOrders.map(order => (
              <div key={order.id}
                className="grid grid-cols-5 items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#F4F4F5] transition-all">
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#9E4BDC]/10 rounded-lg flex items-center justify-center text-[#9E4BDC] text-xs font-black shrink-0">
                    {order.customer.charAt(0)}
                  </div>
                  <p className="text-xs font-bold text-[#22285E] truncate">{order.customer}</p>
                </div>
                
                <p className="text-xs text-[#71717A] truncate">{order.produk}</p>
                <p className="text-xs font-bold text-[#22285E]">Rp {order.total.toLocaleString('id')}</p>
                
                <p className="text-xs font-bold text-[#00B5AD] flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-[9px]" />+{order.poin}
                </p>

                {/* IMPLEMENTASI BADGE */}
                <Badge status={order.status} />
              </div>
            ))}
          </div>
        </div>
        <Link to="/orders" className="text-[#9E4BDC] text-[11px] font-bold hover:underline block mt-4 md:hidden text-center">Lihat Semua →</Link>
      </div>

    </div>
  );
}