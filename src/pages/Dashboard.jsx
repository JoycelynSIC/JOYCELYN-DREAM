import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  FaBell, FaUsers, FaStar, FaExclamationTriangle, 
  FaTrophy, FaBoxOpen, FaShoppingBag, FaCheckCircle, 
  FaSpinner, FaTruck, FaTimesCircle 
} from 'react-icons/fa';

// ── 1. DATA TOOLS ──
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
  'Selesai': { style: 'bg-status-success/10 text-status-success border-status-success/20', icon: FaCheckCircle },
  'Proses':  { style: 'bg-surface-neutral text-text-light border-surface-border', icon: FaSpinner },
  'Dikirim': { style: 'bg-secondary/20 text-text-dark border-secondary/30', icon: FaTruck },
  'Batal':   { style: 'bg-status-warning/10 text-status-warning border-status-warning/20', icon: FaTimesCircle },
};

// ── 2. CUSTOM COMPONENTS ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const omzet = payload[0]?.payload?.omzet;
    return (
      <div className="bg-surface-white px-4 py-3 rounded-xl shadow-xl border border-surface-border font-poppins">
        <p className="text-text-light text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <p className="text-text-dark text-sm font-bold">{payload[0].value} Transaksi</p>
        {omzet && <p className="text-primary text-[11px] mt-1 font-semibold">Rp {omzet.toLocaleString('id')}</p>}
      </div>
    );
  }
  return null;
};

// ── 3. MAIN DASHBOARD ──
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Bulanan');

  // Dummy Data (Ganti dengan data asli dari database/API)
  const lowStock = 5;
  const outOfStock = 2;
  const totalPoin = 1250000;
  const topCustomer = { name: "Andi Wijaya", poin: 8500, transaksi: 42, type: "Platinum Member" };
  const recentOrders = [
    { id: 1, customer: "Budi Santoso", produk: "Paket Hemat A", total: 150000, poin: 15, status: "Selesai" },
    { id: 2, customer: "Siska Putri", produk: "Layanan Premium", total: 450000, poin: 45, status: "Proses" },
    { id: 3, customer: "Rian Aldi", produk: "Member Bulanan", total: 200000, poin: 20, status: "Dikirim" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-poppins">
      
      {/* ── ROW 1: STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Notifikasi */}
        <div className="bg-surface-white border border-surface-border rounded-3xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
            <FaBell className="text-surface-white text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Notifikasi</p>
            <p className="text-2xl font-bold text-text-dark leading-tight">5</p>
            <p className="text-[10px] text-text-light">Belum dibaca</p>
          </div>
        </div>

        {/* Stok Kritis */}
        <div className="bg-status-warning/5 border border-status-warning/10 rounded-3xl p-5 flex items-center gap-4 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-status-warning rounded-2xl flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-surface-white text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-status-warning">Stok Kritis</p>
            <p className="text-2xl font-bold text-text-dark leading-tight">{lowStock + outOfStock}</p>
            <p className="text-[10px] text-text-light">{outOfStock} Habis · {lowStock} Menipis</p>
          </div>
        </div>

        {/* Pelanggan */}
        <div className="bg-primary rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-primary/20 group cursor-pointer transition-all">
          <div className="w-12 h-12 bg-surface-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-surface-white/30 group-hover:scale-110 transition-transform">
            <FaUsers className="text-surface-white text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-surface-white/70">Pelanggan</p>
            <p className="text-2xl font-bold text-surface-white leading-tight">1.2k</p>
            <p className="text-[10px] text-surface-white/60">Total terdaftar</p>
          </div>
        </div>

        {/* Total Poin */}
        <div className="bg-surface-white border border-surface-border rounded-3xl p-5 flex items-center gap-4 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-surface-style rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
            <FaStar className="text-[#FFB800] text-lg" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Total Poin</p>
            <p className="text-2xl font-bold text-text-dark leading-tight">{totalPoin.toLocaleString('id')}</p>
            <p className="text-[10px] text-text-light">Poin beredar</p>
          </div>
        </div>
      </div>

      {/* ── ROW 2: CHART & SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Penjualan */}
        <div className="lg:col-span-2 bg-surface-white border border-surface-border rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-title-m font-bold text-text-dark">Grafik Penjualan</h3>
              <p className="text-body-xs text-text-light">Transaksi harian Na_store.id</p>
            </div>
            <div className="flex gap-1 bg-surface-neutral p-1 rounded-xl">
              {['Harian', 'Mingguan', 'Bulanan'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === tab ? 'bg-primary text-surface-white shadow-md' : 'text-text-disable'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataMap[activeTab]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-neutral)" vertical={false} />
                <XAxis dataKey="hari" tick={{fontSize: 11, fill: 'var(--color-text-disable)'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 10, fill: 'var(--color-text-disable)'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--color-surface-style)'}} />
                <Bar dataKey="nilai" fill="url(#barGrad)" radius={[8, 8, 2, 2]} barSize={activeTab === 'Bulanan' ? 20 : 35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Kanan: Top Pelanggan */}
        <div className="space-y-4">
          <div className="bg-primary rounded-[32px] p-6 shadow-lg shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-white/10 rounded-full" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <FaTrophy className="text-[#FFB800] text-sm" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-white/70">Top Pelanggan</p>
            </div>
            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-12 h-12 bg-surface-white/20 rounded-2xl flex items-center justify-center text-lg font-bold text-surface-white border border-surface-white/30 group-hover:scale-110 transition-transform">
                {topCustomer.name.charAt(0)}
              </div>
              <div>
                <p className="text-body-m font-bold text-surface-white leading-none">{topCustomer.name}</p>
                <p className="text-[11px] text-surface-white/60 mt-1">{topCustomer.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-end text-surface-white relative z-10">
              <span className="text-sm font-bold flex items-center gap-1.5"><FaStar className="text-[#FFB800]" /> {topCustomer.poin.toLocaleString('id')}</span>
              <span className="text-[10px] bg-surface-white/20 px-2 py-1 rounded-lg">{topCustomer.transaksi}x Order</span>
            </div>
          </div>

          <Link to="/inventory" className="flex items-center justify-between p-6 bg-surface-white border border-surface-border rounded-[32px] hover:border-status-warning transition-all group">
            <div>
              <p className="text-text-dark font-bold text-sm">Kelola Stok</p>
              <p className="text-text-light text-[10px]">Cek barang menipis</p>
            </div>
            <div className="w-10 h-10 bg-status-warning/10 rounded-xl flex items-center justify-center text-status-warning group-hover:bg-status-warning group-hover:text-surface-white transition-all">
              <FaBoxOpen />
            </div>
          </Link>
        </div>
      </div>

      {/* ── ROW 3: PESANAN TERBARU ── */}
      <div className="bg-surface-white border border-surface-border rounded-[32px] p-6 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-title-m font-bold text-text-dark">Pesanan Terbaru</h3>
          <Link to="/orders" className="text-primary text-[11px] font-bold">Lihat Semua →</Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[600px] space-y-2">
            {recentOrders.map(order => {
              const sc = statusConfig[order.status];
              const StatusIcon = sc.icon;
              return (
                <div key={order.id} className="grid grid-cols-5 items-center gap-4 p-4 rounded-2xl hover:bg-surface-style/50 transition-all border border-transparent hover:border-surface-border">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-neutral rounded-xl flex items-center justify-center text-text-disable border border-surface-border">
                      <FaShoppingBag size={14} />
                    </div>
                    <div>
                      <p className="text-body-s font-bold text-text-dark">{order.customer}</p>
                      <p className="text-[10px] text-text-light">{order.produk}</p>
                    </div>
                  </div>
                  <div className="text-body-s font-bold text-text-dark">Rp {order.total.toLocaleString('id')}</div>
                  <div className="flex items-center gap-1 text-status-success font-bold text-[10px]">
                    <FaStar size={8} /> +{order.poin} pts
                  </div>
                  <div className="flex justify-end">
                    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border ${sc.style}`}>
                      <StatusIcon size={10} /> {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}