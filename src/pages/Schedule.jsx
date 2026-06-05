/**
 * Schedule — Na_store.id
 * Redesign sesuai figma Calendar:
 *  - Tab: Tickets / Holidays / Planner
 *  - Kalender 2 bulan berdampingan
 *  - Panel "Buat Pengingat" di kanan
 *  - Section Upcoming Events di bawah
 */
import { useState } from "react";
import {
  FaPlus, FaTimes,
  FaMapMarkerAlt, FaAlignLeft, FaClock, FaBoxOpen,
  FaCheckDouble, FaArchive, FaCamera, FaHeadset,
  FaCalendarAlt, FaUserFriends, FaSearch,
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import scheduleData from "../data/schedule.json";
import { Calendar } from "@/components/ui/calendar";

/* ─── Konstanta ─────────────────────────────────── */
const HARI_PENDEK = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const BULAN = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const BULAN_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TABS = ["Tickets", "Holidays", "Planner"];

const KATEGORI_CONFIG = {
  Restok:  { color: "bg-[#9E4BDC] text-white",          dot: "bg-[#9E4BDC]",  icon: FaBoxOpen,      iconBg: "bg-[#9E4BDC]/10 text-[#9E4BDC]"  },
  QC:      { color: "bg-[#95D5B6] text-[#22285E]",      dot: "bg-[#95D5B6]",  icon: FaCheckDouble,  iconBg: "bg-[#95D5B6]/20 text-[#22285E]"   },
  Packing: { color: "bg-[#9E4BDC] text-white",          dot: "bg-[#9E4BDC]",  icon: FaArchive,      iconBg: "bg-[#9E4BDC]/10 text-[#9E4BDC]"  },
  Konten:  { color: "bg-[#F4F4F5] text-[#71717A]",      dot: "bg-[#A1A1AA]",  icon: FaCamera,       iconBg: "bg-[#F4F4F5] text-[#71717A]"      },
  CS:      { color: "bg-[#F24E1E]/10 text-[#F24E1E]",   dot: "bg-[#F24E1E]",  icon: FaHeadset,      iconBg: "bg-[#F24E1E]/10 text-[#F24E1E]"   },
};

const REMINDER_TYPES = ["Restock", "Promo", "Packing", "CS / WA"];

/* ─── Komponen Utama ─────────────────────────────── */
export default function Schedule() {
  const today = new Date();

  const [activeTab, setActiveTab]       = useState("Tickets");
  const [selectedDate, setSelectedDate] = useState(today);
  const [startTime, setStartTime]       = useState("10:30");
  const [endTime, setEndTime]           = useState("12:30");
  const [tasks, setTasks]               = useState(scheduleData);
  const [reminderName, setReminderName] = useState("Restock Gelang Bead");
  const [reminderType, setReminderType] = useState("Restock");
  const [showSuccess, setShowSuccess]   = useState(false);

  /* Tanggal yang ada jadwal */
  const markedDates = [2, 5, 8, 12, 15, 19, 22, 26, 29];

  /* Label tanggal terpilih */
  const selLabel = `${selectedDate.getDate()} ${BULAN[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  /* Buat pengingat */
  const handleCreateReminder = () => {
    if (!reminderName.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id:       Date.now(),
        task:     reminderName,
        time:     `${startTime} - ${endTime}`,
        kategori: reminderType === "Restock"  ? "Restok"
                : reminderType === "Packing"  ? "Packing"
                : reminderType === "CS / WA"  ? "CS"
                : "Konten",
        color:    "bg-[#9E4BDC]",
      },
    ]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
    setReminderName("");
  };

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">

      {/* ── Page Header ── */}
      <PageHeader title="Jadwal" breadcrumb={["Dashboard", "Jadwal"]}>
        <button
          onClick={() => setReminderName("Jadwal Baru")}
          className="flex items-center gap-2 bg-[#9E4BDC] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#B16FE3] transition-all active:scale-95 shadow-md shadow-[#9E4BDC]/20"
        >
          <FaPlus className="text-[10px]" /> Tambah Jadwal
        </button>
      </PageHeader>

      {/* ── "Pick a day" + Tab ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-[#22285E]">Pick a day</h2>

        {/* Tab Tickets / Holidays / Planner */}
        <div className="flex bg-[#F4F4F5] rounded-2xl p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#9E4BDC] text-white shadow-md shadow-[#9E4BDC]/20"
                  : "text-[#A1A1AA] hover:text-[#22285E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Grid: Kalender + Panel Reminder ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ── Kalender 2 bulan ── */}
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-3xl p-6 shadow-sm flex flex-col justify-between">

          {/* Toggle One way / Two way */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-[#F4F4F5] rounded-full p-1 gap-1">
              {["One way", "Two way"].map((opt) => (
                <button
                  key={opt}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    opt === "One way"
                      ? "bg-[#9E4BDC] text-white shadow-sm"
                      : "text-[#A1A1AA] hover:text-[#22285E]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Dua kalender berdampingan */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              numberOfMonths={2}
              className="p-0 border border-[#E4E4E7] rounded-2xl bg-white shadow-xs p-4"
            />
          </div>

          {/* Time Picker */}
          <div className="mt-6 pt-5 border-t border-[#E4E4E7] flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex flex-col gap-1.5 w-full sm:w-48">
              <label htmlFor="time-from" className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">
                Start Time
              </label>
              <div className="relative flex items-center bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
                <input
                  id="time-from"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#22285E] font-medium outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full sm:w-48">
              <label htmlFor="time-to" className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] ml-1">
                End Time
              </label>
              <div className="relative flex items-center bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl px-4 py-2.5">
                <input
                  id="time-to"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#22285E] font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── Filter bar bawah kalender ── */}
          <div className="mt-6 pt-5 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 bg-[#F4F4F5] rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-[#9E4BDC] text-sm shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA]">Lokasi</p>
                <p className="text-xs font-bold text-[#22285E] truncate">Na_store.id — Toko Aksesoris</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#F4F4F5] rounded-xl px-4 py-3">
              <FaCalendarAlt className="text-[#9E4BDC] text-sm shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA]">Tanggal Dipilih</p>
                <p className="text-xs font-bold text-[#22285E] truncate">{selLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#F4F4F5] rounded-xl px-4 py-3">
              <FaUserFriends className="text-[#9E4BDC] text-sm shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA]">Tim Admin</p>
                <p className="text-xs font-bold text-[#22285E]">2 Admin Aktif</p>
              </div>
              <FaSearch className="text-[#A1A1AA] text-xs ml-auto shrink-0" />
            </div>
          </div>
        </div>

        {/* ── Panel Create Reminder ── */}
        <div className="bg-white border border-[#E4E4E7] rounded-3xl p-5 shadow-sm space-y-4">
          <p className="text-sm font-black text-[#22285E]">Buat Pengingat Jadwal</p>
          <p className="text-[10px] text-[#A1A1AA] -mt-2">Tambah kegiatan operasional Na_store.id</p>

          {/* Input nama */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-1.5">Nama Kegiatan</p>
            <div className="relative">
              <input
                type="text"
                value={reminderName}
                onChange={(e) => setReminderName(e.target.value)}
                placeholder="cth: Restock Gelang Bead..."
                className="w-full bg-[#F4F4F5] rounded-xl px-4 py-2.5 text-sm text-[#22285E] outline-none focus:ring-2 focus:ring-[#9E4BDC]/30 placeholder:text-[#A1A1AA] pr-10"
              />
              {reminderName && (
                <button
                  onClick={() => setReminderName("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#22285E]"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Tipe reminder */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2">Tipe Kegiatan</p>
            <div className="grid grid-cols-2 gap-2">
              {REMINDER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setReminderType(type)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    reminderType === type
                      ? "bg-[#9E4BDC] text-white shadow-sm"
                      : "bg-[#F4F4F5] text-[#71717A] hover:bg-[#E4E4E7]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Detail event */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2">Detail Jadwal</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                <FaClock className="text-[#9E4BDC] text-xs shrink-0" />
                <span className="font-semibold">{startTime} — {endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                <FaCalendarAlt className="text-[#9E4BDC] text-xs shrink-0" />
                <span>{selLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { bg: "#9E4BDC", label: "J" },
                  { bg: "#95D5B6", label: "N" },
                ].map((av, i) => (
                  <div
                      key={i}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-white -ml-1 first:ml-0"
                      style={{ backgroundColor: av.bg }}
                  >
                    {av.label}
                  </div>
                ))}
                <button className="w-6 h-6 rounded-full bg-[#F4F4F5] border-2 border-white flex items-center justify-center text-[#A1A1AA] -ml-1 hover:bg-[#9E4BDC]/10 transition-all">
                  <FaPlus className="text-[8px]" />
                </button>
                <span className="text-[10px] text-[#A1A1AA] ml-1">Tim Na_store.id</span>
              </div>
            </div>
          </div>

          {/* Lokasi & Deskripsi */}
          <div className="space-y-2">
            <button className="flex items-center gap-2 text-[11px] text-[#A1A1AA] hover:text-[#9E4BDC] transition-colors w-full">
              <FaMapMarkerAlt className="text-xs" /> Na_store.id — Toko Aksesoris
            </button>
            <button className="flex items-center gap-2 text-[11px] text-[#A1A1AA] hover:text-[#9E4BDC] transition-colors w-full">
              <FaAlignLeft className="text-xs" /> Tambah catatan kegiatan
            </button>
          </div>

          {/* Tombol buat */}
          <button
            onClick={handleCreateReminder}
            className="w-full py-3 bg-[#9E4BDC] text-white text-sm font-bold rounded-xl hover:bg-[#B16FE3] transition-all active:scale-95 shadow-md shadow-[#9E4BDC]/20"
          >
            Simpan Jadwal
          </button>

          {showSuccess && (
            <p className="text-center text-[11px] text-[#00B5AD] font-bold animate-in fade-in duration-300">
              ✓ Jadwal berhasil ditambahkan!
            </p>
          )}
        </div>
      </div>

      {/* ── Upcoming Events ── */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-[#22285E]">Upcoming Events</h3>
            <p className="text-[11px] text-[#A1A1AA] mt-0.5">{selLabel}</p>
          </div>
          <button className="bg-[#9E4BDC] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#B16FE3] transition-all active:scale-95">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((item, i) => {
            const accents = ["#9E4BDC", "#00B5AD", "#F24E1E", "#95D5B6", "#22285E"];
            return (
              <div key={item.id} className="relative bg-white border border-[#E4E4E7] rounded-2xl p-4 hover:shadow-md transition-all overflow-hidden">
                {/* Garis aksen kiri */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
                  style={{ backgroundColor: accents[i % accents.length] }}
                />
                <div className="pl-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#22285E] leading-snug">{item.task}</p>
                    <p className="text-[11px] text-[#A1A1AA] mt-1 flex items-center gap-1">
                      <FaClock className="text-[9px]" /> {item.time}
                    </p>
                    {/* Avatar */}
                    <div className="flex items-center mt-2">
                      {["J","N","A"].slice(0, 2 + (i % 2)).map((av, j) => (
                        <div
                          key={j}
                          className="w-5 h-5 rounded-full border-2 border-white -ml-1 first:ml-0 flex items-center justify-center text-[8px] font-bold text-white"
                          style={{ backgroundColor: accents[j % accents.length] }}
                        >
                          {av}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Ikon kategori */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accents[i % accents.length] + "20" }}
                  >
                    {(() => {
                      const cfg  = KATEGORI_CONFIG[item.kategori] ?? KATEGORI_CONFIG.Restok;
                      const Icon = cfg.icon;
                      return <Icon style={{ color: accents[i % accents.length] }} className="text-sm" />;
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
