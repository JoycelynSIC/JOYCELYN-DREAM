/**
 * Dashboard — Na_store.id CRM
 * Layout mengikuti referensi: Stat Cards → Banner + Grafik → Daily Task + 2 Pie Charts → Recent Orders
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FaBell, FaUsers, FaShoppingBag, FaPlusCircle,
  FaStar, FaBoxOpen, FaClock, FaBoxes, FaCheckDouble,
  FaArchive, FaCamera, FaHeadset, FaCoins,
} from "react-icons/fa";

import PageHeader   from "../components/PageHeader";
import StatCard     from "../components/StatCard";
import BannerPromo  from "../components/BannerPromo";
import TabFilter    from "../components/TabFilter";
import DonutChart   from "../components/DonutChart";
import Badge        from "../components/Badge";
import Card         from "../components/Card";
import AvatarGroup  from "../components/AvatarGroup";
import ordersData    from "../data/orders.json";
import inventoryData from "../data/inventory.json";

/* ─── Import gambar produk ─── */
import imgKalungRosegold  from "../assets/gambarproduk/kalungrosegold.png";
import imgKalungChoker    from "../assets/gambarproduk/kalungchoker.png";
import imgKalungBintang   from "../assets/gambarproduk/kalungbintang.png";
import imgKalungPearl     from "../assets/gambarproduk/kalungpearl.png";
import imgGelangCrystal   from "../assets/gambarproduk/gelangcrystal.png";
import imgGelangPerak     from "../assets/gambarproduk/gelangperak.png";
import imgGelangBead      from "../assets/gambarproduk/gelangbead.png";
import imgGelangTali      from "../assets/gambarproduk/gelangtali.png";
import imgCincinCouple    from "../assets/gambarproduk/cincincouple.png";
import imgCincinGold      from "../assets/gambarproduk/cincingold.png";
import imgCincinResin     from "../assets/gambarproduk/cincinresin.png";
import imgAntingHoop      from "../assets/gambarproduk/antinghoop.png";
import imgAntingTassel    from "../assets/gambarproduk/antingtassel.png";
import imgAntingPearl     from "../assets/gambarproduk/antingpearl.png";
import imgAntingBintang   from "../assets/gambarproduk/antingbintang.png";
import imgNailFlower      from "../assets/gambarproduk/pressonnailflower.png";
import imgNailGlitter     from "../assets/gambarproduk/pressonnailglitter.png";
import imgNailFrench      from "../assets/gambarproduk/pressonnailfrenchtip.png";
import imgNailOmbre       from "../assets/gambarproduk/pressonnailombre.png";
import imgTumblrPastel    from "../assets/gambarproduk/tmblrpastel.png";
import imgTumblrFlower    from "../assets/gambarproduk/tumblrflower.png";
import imgTumblrGlass     from "../assets/gambarproduk/tumblrglass.png";
import imgClawClip        from "../assets/gambarproduk/clawclip.png";
import imgJepitButterfly  from "../assets/gambarproduk/jepitrambutbutterfly.png";
import imgBandoPearl      from "../assets/gambarproduk/bandopearl.png";
import imgScrunchie       from "../assets/gambarproduk/scrunchie.png";
import imgTasMini         from "../assets/gambarproduk/tasminiselempang.png";
import imgTasRajut        from "../assets/gambarproduk/tasrajut.png";
import imgTasKoin         from "../assets/gambarproduk/taskoin.png";
import imgKacamata        from "../assets/gambarproduk/framekacamata.png";
import imgMasker          from "../assets/gambarproduk/maskerlucu.png";
import imgStiker          from "../assets/gambarproduk/stiker.png";
import imgGanci           from "../assets/gambarproduk/gancisanrio.png";
import imgIkatPinggang    from "../assets/gambarproduk/ikapinggang.png";

const gambarMap = {
  "kalungrosegold.png": imgKalungRosegold,     "kalungchoker.png": imgKalungChoker,
  "kalungbintang.png": imgKalungBintang,       "kalungpearl.png": imgKalungPearl,
  "gelangcrystal.png": imgGelangCrystal,       "gelangperak.png": imgGelangPerak,
  "gelangbead.png": imgGelangBead,             "gelangtali.png": imgGelangTali,
  "cincincouple.png": imgCincinCouple,         "cincingold.png": imgCincinGold,
  "cincinresin.png": imgCincinResin,           "antinghoop.png": imgAntingHoop,
  "antingtassel.png": imgAntingTassel,         "antingpearl.png": imgAntingPearl,
  "antingbintang.png": imgAntingBintang,       "pressonnailflower.png": imgNailFlower,
  "pressonnailglitter.png": imgNailGlitter,    "pressonnailfrenchtip.png": imgNailFrench,
  "pressonnailombre.png": imgNailOmbre,        "tmblrpastel.png": imgTumblrPastel,
  "tumblrflower.png": imgTumblrFlower,         "tumblrglass.png": imgTumblrGlass,
  "clawclip.png": imgClawClip,                 "jepitrambutbutterfly.png": imgJepitButterfly,
  "bandopearl.png": imgBandoPearl,             "scrunchie.png": imgScrunchie,
  "tasminiselempang.png": imgTasMini,          "tasrajut.png": imgTasRajut,
  "taskoin.png": imgTasKoin,                   "framekacamata.png": imgKacamata,
  "maskerlucu.png": imgMasker,                 "stiker.png": imgStiker,
  "gancisanrio.png": imgGanci,                 "ikapinggang.png": imgIkatPinggang,
};
const getImg = (path) => {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  return gambarMap[path.split("/").pop()] ?? null;
};

/* ─── Data grafik transaksi harian ─── */
const chartDataMap = {
  Harian: [
    { hari: "Sen", nilai: 18, repeat: 10 }, { hari: "Sel", nilai: 32, repeat: 20 },
    { hari: "Rab", nilai: 25, repeat: 15 }, { hari: "Kam", nilai: 41, repeat: 28 },
    { hari: "Jum", nilai: 36, repeat: 22 }, { hari: "Sab", nilai: 58, repeat: 40 },
    { hari: "Min", nilai: 47, repeat: 32 },
  ],
  Mingguan: [
    { hari: "Mg 1", nilai: 62, repeat: 30 }, { hari: "Mg 2", nilai: 78, repeat: 45 },
    { hari: "Mg 3", nilai: 55, repeat: 28 }, { hari: "Mg 4", nilai: 91, repeat: 60 },
  ],
  Bulanan: [
    { hari: "Jan", nilai: 70, repeat: 38 }, { hari: "Feb", nilai: 52, repeat: 25 },
    { hari: "Mar", nilai: 91, repeat: 55 }, { hari: "Apr", nilai: 44, repeat: 20 },
    { hari: "Mei", nilai: 97, repeat: 62 }, { hari: "Jun", nilai: 63, repeat: 40 },
    { hari: "Jul", nilai: 85, repeat: 50 },
  ],
};

/* ─── Custom Tooltip grafik ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-[#E4E4E7] text-xs font-poppins">
      <p className="text-[#A1A1AA] uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-[#9E4BDC] font-bold">{payload[0]?.value} Transaksi Baru</p>
      {payload[1] && <p className="text-[#22285E] font-bold mt-0.5">{payload[1].value} Repeat Order</p>}
    </div>
  );
}

/* ─── Jadwal harian dari schedule.json (hardcoded sesuai data) ─── */
const JADWAL = [
  {
    jam: "09:00",
    title: "Restok Kalung Titanium",
    time: "09:00 – 10:00",
    kategori: "Restok",
    color: "purple",
    icon: FaBoxes,
  },
  {
    jam: "10:30",
    title: "QC Cincin Couple Silver",
    time: "10:30 – 12:00",
    kategori: "QC",
    color: "teal",
    icon: FaCheckDouble,
  },
  {
    jam: "13:00",
    title: "Packing Pesanan Reseller",
    time: "13:00 – 14:30",
    kategori: "Packing",
    color: "dark",
    icon: FaArchive,
  },
  {
    jam: "15:00",
    title: "Update Foto Produk Baru",
    time: "15:00 – 16:00",
    kategori: "Konten",
    color: "green",
    icon: FaCamera,
  },
  {
    jam: "16:30",
    title: "Balas Chat Pelanggan",
    time: "16:30 – 17:30",
    kategori: "CS",
    color: "orange",
    icon: FaHeadset,
  },
];

const JADWAL_COLOR_MAP = {
  purple: { bg: "bg-[#9E4BDC]",        text: "text-white",        dot: "bg-[#9E4BDC]"  },
  teal:   { bg: "bg-[#00B5AD]",        text: "text-white",        dot: "bg-[#00B5AD]"  },
  dark:   { bg: "bg-[#22285E]",        text: "text-white",        dot: "bg-[#22285E]"  },
  green:  { bg: "bg-[#95D5B6]",        text: "text-[#22285E]",    dot: "bg-[#95D5B6]"  },
  orange: { bg: "bg-[#F24E1E]",        text: "text-white",        dot: "bg-[#F24E1E]"  },
};

/* ─── Pelanggan Top ─── */
const pelangganBaru = [
  { id: 7,  nama: "Fatimah Novitasari", status: "Gold", poin: 3760, belanja: 4259000 },
  { id: 15, nama: "Olivia Felicia",     status: "Gold", poin: 3121, belanja: 4013000 },
  { id: 27, nama: "Uswatun Dewi",       status: "Gold", poin: 3151, belanja: 3961000 },
  { id: 4,  nama: "Ulfah Permatasari",  status: "Gold", poin: 3016, belanja: 3409000 },
  { id: 18, nama: "Uswatun Andriani",   status: "Gold", poin: 2984, belanja: 3609000 },
];

const pesananTerbaru = ordersData.slice(0, 4);

/* ─── Hitung total omzet dari pesanan Selesai ─── */
const totalOmzet = ordersData
  .filter((o) => o.status === "Selesai")
  .reduce((sum, o) => sum + o.total, 0);
const omzetLabel =
  totalOmzet >= 1_000_000
    ? `${(totalOmzet / 1_000_000).toFixed(1)} jt`
    : `${(totalOmzet / 1_000).toFixed(0)} rb`;

/* ════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Bulanan");

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">

      {/* ── Page Header ── */}
      <PageHeader title="Dashboard" breadcrumb={["Dashboard"]}>
        <Link
          to="/customers"
          className="flex items-center gap-2 bg-[#9E4BDC] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#B16FE3] transition-all active:scale-95 shadow-md shadow-[#9E4BDC]/20"
        >
          <FaPlusCircle className="text-sm" />
          Tambah Pelanggan
        </Link>
      </PageHeader>

      {/* ══ ROW 1 — Stat Cards ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Notifikasi"
          value="6"
          desc="Belum dibaca"
          icon={<FaBell />}
          iconBgColor="bg-[#9E4BDC]/10"
          iconColor="text-[#9E4BDC]"
        />
        <StatCard
          variant="primary"
          label="Pesanan Masuk"
          value="4"
          desc="Update terakhir"
          icon={<FaShoppingBag />}
        />
        <StatCard
          variant="dark"
          label="Pelanggan Aktif"
          value="30"
          desc="Terdaftar di sistem"
          icon={<FaUsers />}
        />
        <StatCard
          variant="green"
          label="Total Omzet"
          value={`Rp ${omzetLabel}`}
          desc="Dari pesanan selesai"
          icon={<FaCoins />}
        />
      </div>

      {/* ══ ROW 2 — Banner + Grafik ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Banner Promo */}
        <div className="lg:col-span-2 h-full">
          <BannerPromo
            title="Kelola toko aksesorismu dalam satu sentuhan"
            subtitle="Pantau pesanan, stok gelang, kalung, anting & lebih — kapan saja di Na_store.id."
            ctaLabel="Lihat Laporan"
            onCta={() => (window.location.href = "/analytics")}
          />
        </div>

        {/* Grafik Transaksi */}
        <Card
          className="lg:col-span-3"
          title="Statistik Transaksi"
          subtitle="Volume penjualan aksesoris Na_store.id"
          action={
            <TabFilter
              tabs={["Harian", "Mingguan", "Bulanan"]}
              active={activeTab}
              onChange={setActiveTab}
            />
          }
        >
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataMap[activeTab]} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#9E4BDC" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#9E4BDC" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="gradDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22285E" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#22285E" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                <XAxis dataKey="hari" tick={{ fontSize: 10, fill: "#A1A1AA" }} axisLine={false} tickLine={false} dy={6} />
                <YAxis tick={{ fontSize: 10, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="nilai"  stroke="#9E4BDC" strokeWidth={2.5} fill="url(#gradPurple)" dot={false} activeDot={{ r: 5, fill: "#9E4BDC" }} />
                <Area type="monotone" dataKey="repeat" stroke="#22285E" strokeWidth={1.5} fill="url(#gradDark)"   dot={false} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3">
            {[
              { label: "Transaksi Baru",  color: "#9E4BDC" },
              { label: "Repeat Order",    color: "#22285E" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] text-[#A1A1AA] font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ══ ROW 3 — Daily Task + 2 Pie Charts (layout mirip referensi) ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Daily Task Timeline ── */}
        <Card
          className="lg:col-span-3"
          title="Daily Task"
          subtitle="Jadwal operasional Na_store.id hari ini"
        >
          {/* Timeline grid — jam di kiri, blok di kanan */}
          <div className="relative mt-2">
            {/* Garis vertikal waktu */}
            <div className="absolute left-12 top-0 bottom-0 w-px bg-[#E4E4E7]" />

            <div className="space-y-2.5">
              {JADWAL.map((item, i) => {
                const c = JADWAL_COLOR_MAP[item.color] ?? JADWAL_COLOR_MAP.purple;
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 relative">
                    {/* Jam */}
                    <span className="text-[10px] text-[#A1A1AA] font-bold w-10 shrink-0 text-right pr-1 z-10">
                      {item.jam}
                    </span>

                    {/* Dot on line */}
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 z-10 border-2 border-white shadow-sm ${c.dot}`} />

                    {/* Blok aktivitas */}
                    <div
                      className={`flex-1 flex items-center gap-3 rounded-xl px-4 py-3 ${c.bg} ${c.text} hover:opacity-90 transition-opacity cursor-default`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <Icon className="text-xs" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold leading-tight truncate">{item.title}</p>
                        <p className="text-[10px] opacity-75 mt-0.5 flex items-center gap-1">
                          <FaClock className="text-[8px]" />
                          {item.time}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold opacity-60 shrink-0 hidden sm:block">
                        {item.kategori}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-4 pt-4 border-t border-[#E4E4E7] flex items-center justify-between">
            <p className="text-[10px] text-[#A1A1AA]">
              {JADWAL.length} kegiatan terjadwal hari ini
            </p>
            <Link
              to="/schedule"
              className="text-[10px] font-bold text-[#9E4BDC] hover:underline"
            >
              Lihat Jadwal Lengkap →
            </Link>
          </div>
        </Card>

        {/* ── 2 Pie Charts ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Pie Chart 1: Segmentasi Pelanggan */}
          <DonutChart
            title="Segmentasi Pelanggan"
            subtitle="Status member aktif Na_store.id"
            center="Gold"
            segments={[
              { label: "Gold Member",   value: 70, color: "#9E4BDC" },
              { label: "Silver Member", value: 20, color: "#95D5B6" },
              { label: "Bronze Member", value: 10, color: "#E4E4E7" },
            ]}
          />

          {/* Pie Chart 2: Kategori Produk Terlaris */}
          <DonutChart
            title="Kategori Produk Terlaris"
            subtitle="Berdasarkan unit terjual bulan ini"
            center="Nail Art"
            segments={[
              { label: "Nail Art",        value: 35, color: "#9E4BDC" },
              { label: "Aksesoris Rambut", value: 28, color: "#95D5B6" },
              { label: "Anting",           value: 18, color: "#F24E1E" },
              { label: "Gelang",           value: 12, color: "#22285E" },
              { label: "Lainnya",          value:  7, color: "#E4E4E7" },
            ]}
          />
        </div>
      </div>

      {/* ══ ROW 4 — Pesanan Terbaru ══ */}
      <Card
        title="Pesanan Terbaru"
        subtitle="Transaksi aksesoris masuk hari ini"
        action={
          <Link to="/orders" className="text-[#9E4BDC] text-[11px] font-bold hover:underline">
            Lihat Semua →
          </Link>
        }
      >
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-4 pb-3 border-b border-[#E4E4E7]">
          {["ID Pesanan", "Pelanggan", "Produk", "Total + Poin", "Status"].map((h) => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#F4F4F5]">
          {pesananTerbaru.map((o) => {
            const invItem = inventoryData.find(i => i.name === o.produk);
            const imgSrc  = getImg(invItem?.gambar);
            return (
              <div key={o.id} className="grid grid-cols-5 items-center gap-4 px-4 py-3 hover:bg-[#F9F9FB] transition-colors">

                {/* ID Pesanan */}
                <span className="text-xs font-black text-[#9E4BDC] bg-[#9E4BDC]/10 px-2.5 py-1 rounded-lg w-fit whitespace-nowrap">{o.id}</span>

                {/* Pelanggan */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#9E4BDC]/10 flex items-center justify-center text-[#9E4BDC] text-xs font-black">
                    {o.customer.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#22285E] truncate">{o.customer}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">{o.tanggal}</p>
                  </div>
                </div>

                {/* Produk */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {invItem ? (
                    <Link to={`/inventory/${invItem.id}`} className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-[#F4F4F5] border border-[#E4E4E7] hover:border-[#9E4BDC]/40 transition-colors">
                      {imgSrc
                        ? <img src={imgSrc} alt={o.produk} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><FaBoxOpen className="text-[#A1A1AA] text-xs" /></div>
                      }
                    </Link>
                  ) : (
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center">
                      <FaBoxOpen className="text-[#A1A1AA] text-xs" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {invItem ? (
                      <Link to={`/inventory/${invItem.id}`} className="text-xs font-semibold text-[#22285E] truncate block hover:text-[#9E4BDC] transition-colors">{o.produk}</Link>
                    ) : (
                      <p className="text-xs font-semibold text-[#22285E] truncate">{o.produk}</p>
                    )}
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">{o.qty} pcs</p>
                  </div>
                </div>

                {/* Total + Poin */}
                <div>
                  <p className="text-xs font-bold text-[#22285E] whitespace-nowrap">Rp {o.total.toLocaleString("id")}</p>
                  <p className="text-[10px] text-[#00B5AD] font-semibold flex items-center gap-0.5 mt-0.5">
                    <FaStar className="text-yellow-400 text-[8px]" />+{o.poin} poin
                  </p>
                </div>

                {/* Status */}
                <div><Badge status={o.status} /></div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ══ ROW 5 — Top Pelanggan Setia ══ */}
      <Card
        title="Top Pelanggan Setia"
        subtitle="Pelanggan dengan poin & belanja tertinggi di Na_store.id"
        action={
          <Link to="/customers" className="text-[#9E4BDC] text-[11px] font-bold hover:underline">
            Lihat Semua →
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pelangganBaru.map((p, i) => (
            <div key={p.id} className="bg-[#F4F4F5] rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[#9E4BDC]/5 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white ${
                i === 0 ? "bg-[#9E4BDC]" : i === 1 ? "bg-[#22285E]" : "bg-[#95D5B6]"
              }`}>
                {p.nama.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-[#22285E] leading-tight">{p.nama}</p>
                <Badge status={p.status} />
              </div>
              <div className="w-full pt-2 border-t border-[#E4E4E7] space-y-1">
                <p className="text-[10px] text-[#A1A1AA]">
                  <FaStar className="text-yellow-400 inline mr-0.5 text-[9px]" />
                  <span className="font-bold text-[#22285E]">{p.poin.toLocaleString("id")}</span> poin
                </p>
                <p className="text-[10px] text-[#A1A1AA]">
                  Rp <span className="font-bold text-[#22285E]">
                    {p.belanja >= 1000000
                      ? (p.belanja / 1000000).toFixed(1) + " jt"
                      : p.belanja.toLocaleString("id")}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-[#E4E4E7] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#22285E]">Semua Pelanggan Aktif</p>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">Hover avatar untuk lihat nama</p>
          </div>
          <AvatarGroup
            users={[
              { name: "Fatimah Novitasari", color: "bg-[#9E4BDC] text-white"     },
              { name: "Olivia Felicia",     color: "bg-[#22285E] text-white"     },
              { name: "Uswatun Dewi",       color: "bg-[#95D5B6] text-[#22285E]" },
              { name: "Ulfah Permatasari",  color: "bg-yellow-400 text-white"    },
              { name: "Uswatun Andriani",   color: "bg-[#F24E1E] text-white"     },
              { name: "Bunga Susanti",      color: "bg-[#00B5AD] text-white"     },
              { name: "Vina Anggraini",     color: "bg-[#9E4BDC] text-white"     },
            ]}
            max={5}
            size="md"
            label="30 pelanggan terdaftar"
          />
        </div>
      </Card>

    </div>
  );
}
