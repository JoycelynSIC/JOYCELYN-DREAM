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
  FaChevronLeft, FaChevronRight, FaPlus, FaTimes,
  FaMapMarkerAlt, FaAlignLeft, FaClock, FaBoxOpen,
  FaCheckDouble, FaArchive, FaCamera, FaHeadset,
  FaCalendarAlt, FaUserFriends, FaSearch,
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import scheduleData from "../data/schedule.json";

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

/* ─── Helper: bangun grid kalender ──────────────── */
function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const total    = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: firstDay }, () => null)
    .concat(Array.from({ length: total }, (_, i) => i + 1));
}

/* ─── Mini Calendar ─────────────────────────────── */
function MiniCalendar({ year, month, selectedDate, onSelect, markedDates = [] }) {
  const today = new Date();
  const days  = buildCalendar(year, month);

  return (
    <div className="flex-1 min-w-0">
      {/* Nama bulan */}
      <p className="text-sm font-bold text-[#22285E] text-center mb-3">
        {BULAN_EN[month]} {year}
      </p>

      {/* Header hari */}
      <div className="grid grid-cols-7 mb-1">
        {HARI_PENDEK.map((h) => (
          <div key={h} className="text-center text-[9px] font-bold text-[#A1A1AA] py-1">
            {h}
          </div>
        ))}
      </div>

      {/* Grid tanggal */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const isSelected =
            day === selectedDate?.day &&
            month === selectedDate?.month &&
            year === selectedDate?.year;
          const hasEvent = day && markedDates.includes(day);

          return (
            <button
              key={i}
              disabled={!day}
              onClick={() => day && onSelect({ day, month, year })}
              className={`
                relative aspect-square rounded-full text-[11px] font-semibold
                flex flex-col items-center justify-center transition-all
                ${!day ? "invisible" : ""}
                ${isSelected
                  ? "bg-[#9E4BDC] text-white shadow-md shadow-[#9E4BDC]/30 font-bold"
                  : isToday
                  ? "bg-[#9E4BDC]/15 text-[#9E4BDC] font-bold"
                  : "text-[#22285E] hover:bg-[#F4F4F5]"
                }
              `}
            >
              {day}
              {hasEvent && (
                <span
                  className={`absolute bottom-0.5 w-1 h-1 rounded-full
                    ${isSelected ? "bg-white/70" : "bg-[#9E4BDC]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Event Card (Upcoming Events) ──────────────── */
function EventCard({ task, time, kategori, accent = "#9E4BDC" }) {
  const cfg  = KATEGORI_CONFIG[kategori] ?? KATEGORI_CONFIG.Restok;
  const Icon = cfg.icon;

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 flex items-start justify-between gap-3 hover:shadow-md transition-all group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#22285E] leading-snug">{task}</p>
        <p className="text-[11px] text-[#A1A1AA] mt-1 flex items-center gap-1">
          <FaClock className="text-[9px]" /> {time}
        </p>
        {/* Avatar placeholder mirip figma */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white -ml-1 first:ml-0 flex items-center justify-center text-[8px] font-bold text-white"
              style={{ backgroundColor: ["#9E4BDC","#95D5B6","#F24E1E"][i] }}
            >
              {["J","N","A"][i]}
            </div>
          ))}
        </div>
      </div>
      {/* Ikon kategori */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: accent + "20" }}
      >
        <Icon style={{ color: accent }} className="text-sm" />
      </div>
      {/* Garis aksen kiri */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

/* ─── Komponen Utama ─────────────────────────────── */
export default function Schedule() {
  const today = new Date();

  const [activeTab, setActiveTab]       = useState("Tickets");
  const [viewYear,  setViewYear]        = useState(today.getFullYear());
  const [viewMonth, setViewMonth]       = useState(today.getMonth());
  const [selected,  setSelected]        = useState({
    day: today.getDate(), month: today.getMonth(), year: today.getFullYear(),
  });
  const [tasks, setTasks]               = useState(scheduleData);
  const [reminderName, setReminderName] = useState("Restock Gelang Bead");
  const [reminderType, setReminderType] = useState("Restock");
  const [showSuccess, setShowSuccess]   = useState(false);

  /* Bulan kedua */
  const month2 = viewMonth === 11 ? 0  : viewMonth + 1;
  const year2  = viewMonth === 11 ? viewYear + 1 : viewYear;

  const prevPair = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextPair = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  /* Tanggal yang ada jadwal */
  const markedDates = [2, 5, 8, 12, 15, 19, 22, 26, 29];

  /* Label tanggal terpilih */
  const selLabel = `${selected.day} ${BULAN[selected.month]} ${selected.year}`;

  /* Buat pengingat */
  const handleCreateReminder = () => {
    if (!reminderName.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id:       Date.now(),
        task:     reminderName,
        time:     "09:00 - 10:00",
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
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-3xl p-6 shadow-sm">

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
          <div className="flex items-start gap-6">
            {/* Tombol prev */}
            <button
              onClick={prevPair}
              className="mt-8 w-8 h-8 rounded-full bg-[#F4F4F5] hover:bg-[#9E4BDC]/10 flex items-center justify-center text-[#22285E] transition-all shrink-0"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {/* Kalender bulan 1 */}
            <MiniCalendar
              year={viewYear}
              month={viewMonth}
              selectedDate={selected}
              onSelect={setSelected}
              markedDates={markedDates}
            />

            {/* Divider */}
            <div className="w-px self-stretch bg-[#E4E4E7] mx-2 hidden sm:block" />

            {/* Kalender bulan 2 */}
            <MiniCalendar
              year={year2}
              month={month2}
              selectedDate={selected}
              onSelect={setSelected}
              markedDates={markedDates}
            />

            {/* Tombol next */}
            <button
              onClick={nextPair}
              className="mt-8 w-8 h-8 rounded-full bg-[#F4F4F5] hover:bg-[#9E4BDC]/10 flex items-center justify-center text-[#22285E] transition-all shrink-0"
            >
              <FaChevronRight className="text-xs" />
            </button>
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
                <span className="font-semibold">09:00 — 10:00</span>
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
