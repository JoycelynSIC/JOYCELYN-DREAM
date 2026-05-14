import React, { useState } from 'react';
import scheduleData from '../data/schedule.json';
import PageHeader from '../components/PageHeader';
import {
  FaPlus, FaCalendarAlt, FaClock, FaTimes,
  FaBoxOpen, FaCheckDouble, FaArchive, FaCamera, FaHeadset
} from 'react-icons/fa';

const HARI  = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const kategoriList = ['Restok','QC','Packing','Konten','CS'];

const kategoriConfig = {
  Restok:  { badge: 'bg-primary text-surface-white',          dot: 'bg-primary',          icon: FaBoxOpen     },
  QC:      { badge: 'bg-secondary/20 text-text-dark',         dot: 'bg-secondary',        icon: FaCheckDouble },
  Packing: { badge: 'bg-primary text-surface-white',          dot: 'bg-primary',          icon: FaArchive     },
  Konten:  { badge: 'bg-surface-neutral text-text-light',     dot: 'bg-text-disable',     icon: FaCamera      },
  CS:      { badge: 'bg-status-warning/10 text-status-warning', dot: 'bg-status-warning', icon: FaHeadset     },
};

const jadwalDates = [2, 5, 8, 12, 15, 19, 22, 26, 29];

export default function Schedule() {
  const today = new Date();
  const [viewMonth, setViewMonth]       = useState(today.getMonth());
  const [viewYear,  setViewYear]        = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showForm, setShowForm]         = useState(false);
  const [tasks, setTasks]               = useState(scheduleData);

  /** State form — Best Practice (Pertemuan 4) **/
  const [dataForm, setDataForm] = useState({
    task:       '',
    tanggal:    new Date().toISOString().split('T')[0], // default hari ini
    jamMulai:   '',
    jamSelesai: '',
    kategori:   'Restok',
  });

  /** handleChange — satu fungsi untuk semua input **/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm(prev => ({ ...prev, [name]: value }));
  };

  const hariPertama = new Date(viewYear, viewMonth, 1).getDay();
  const totalHari   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calDays     = Array.from({ length: hariPertama }, () => null)
    .concat(Array.from({ length: totalHari }, (_, i) => i + 1));

  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dataForm.task || !dataForm.jamMulai || !dataForm.jamSelesai) return;

    const timeStr = `${dataForm.jamMulai} - ${dataForm.jamSelesai}`;
    const colorMap = {
      Restok: 'bg-primary', QC: 'bg-secondary/20',
      Packing: 'bg-primary', Konten: 'bg-surface-neutral', CS: 'bg-status-warning/10'
    };

    setTasks(prev => [...prev, {
      id:       Date.now(),
      task:     dataForm.task,
      time:     timeStr,
      kategori: dataForm.kategori,
      color:    colorMap[dataForm.kategori],
    }]);

    setDataForm({ task: '', tanggal: new Date().toISOString().split('T')[0], jamMulai: '', jamSelesai: '', kategori: 'Restok' });
    setShowForm(false);
  };

  /* Tanggal terpilih sebagai string label */
  const selectedLabel = isToday(selectedDate)
    ? 'Hari Ini'
    : `${selectedDate} ${BULAN[viewMonth]} ${viewYear}`;

  return (
    <div className="space-y-5 animate-in fade-in duration-500 font-poppins">

      <PageHeader title="Jadwal" breadcrumb={['Dashboard', 'Jadwal']}>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-surface-white px-4 py-2.5 rounded-[24px] text-sm font-bold hover:bg-primary/90 transition-all active:scale-95"
        >
          <FaPlus className="text-xs" /> Tambah Jadwal
        </button>
      </PageHeader>

      {/* ── Main 2-col ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* ── LEFT: Kalender ── */}
        <div className="lg:col-span-2 bg-surface-white border border-surface-border rounded-[32px] shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-surface-neutral rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-primary text-sm" />
              </div>
              <h3 className="text-base font-black text-text-dark">{BULAN[viewMonth]} {viewYear}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-surface-neutral text-text-light hover:bg-secondary/20 transition-all font-bold text-sm flex items-center justify-center">‹</button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-surface-neutral text-text-light hover:bg-secondary/20 transition-all font-bold text-sm flex items-center justify-center">›</button>
            </div>
          </div>

          {/* Header hari */}
          <div className="grid grid-cols-7 mb-1">
            {HARI.map(h => (
              <div key={h} className="text-center text-[10px] font-bold text-text-disable uppercase py-2">{h}</div>
            ))}
          </div>

          {/* Grid tanggal */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, i) => (
              <button key={i} onClick={() => day && setSelectedDate(day)} disabled={!day}
                className={`relative aspect-square rounded-[24px] text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  !day ? 'invisible' :
                  isToday(day) && selectedDate === day ? 'bg-primary text-surface-white shadow-sm' :
                  isToday(day) ? 'bg-primary/30 text-surface-white' :
                  selectedDate === day ? 'bg-secondary/20 text-text-dark shadow-sm' :
                  'text-text-light hover:bg-surface-neutral'
                }`}>
                {day}
                {day && jadwalDates.includes(day) && (
                  <span className={`w-1 h-1 rounded-full ${isToday(day) || selectedDate === day ? 'bg-surface-white/70' : 'bg-primary'}`} />
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-5 pt-4 border-t border-surface-border">
            {[
              { color: 'bg-primary',      label: 'Hari ini'   },
              { color: 'bg-secondary/20', label: 'Dipilih'    },
              { color: 'bg-primary',      label: 'Ada jadwal', small: true },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`rounded-full ${l.small ? 'w-1.5 h-1.5' : 'w-3 h-3'} ${l.color}`} />
                <span className="text-[10px] text-text-disable font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Panel jadwal ── */}
        <div className="space-y-4">

          {/* Jadwal tanggal dipilih */}
          <div className="bg-surface-white border border-surface-border rounded-[32px] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaCalendarAlt className="text-surface-white text-xs" />
                </div>
                <div>
                  <p className="text-sm font-black text-text-dark">{selectedLabel}</p>
                  <p className="text-[10px] text-text-disable">{tasks.length} kegiatan</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {tasks.map(item => {
                const kc = kategoriConfig[item.kategori] ?? { badge: 'bg-secondary/20 text-text-light', dot: 'bg-text-disable', icon: FaCalendarAlt };
                const KIcon = kc.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-[24px] border border-surface-border hover:border-primary transition-colors group">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${kc.badge}`}>
                      <KIcon className="text-[10px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-dark leading-snug">{item.task}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <FaClock className="text-text-disable text-[9px]" />
                        <p className="text-[10px] text-text-disable">{item.time}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${kc.badge}`}>
                      {item.kategori}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan Kategori */}
          <div className="bg-surface-white border border-surface-border rounded-[32px] shadow-sm p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-disable mb-3">Kategori Kegiatan</p>
            <div className="space-y-2">
              {kategoriList.map(k => {
                const count = tasks.filter(t => t.kategori === k).length;
                const kc = kategoriConfig[k];
                const KIcon = kc.icon;
                return (
                  <div key={k} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KIcon className={`text-xs ${count > 0 ? 'text-primary' : 'text-text-disable'}`} />
                      <span className="text-xs font-semibold text-text-light">{k}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${count > 0 ? kc.badge : 'bg-surface-neutral text-text-disable'}`}>
                      {count}x
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Modal Form Tambah Jadwal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-[32px] shadow-2xl w-full max-w-md border border-surface-border animate-in fade-in zoom-in-95 duration-200">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaCalendarAlt className="text-surface-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-text-dark">Tambah Jadwal Baru</p>
                  <p className="text-[10px] text-text-disable">Isi detail kegiatan toko</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-surface-neutral rounded-xl flex items-center justify-center hover:bg-secondary/20 transition-colors text-text-disable">
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Nama Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">
                  Nama Kegiatan
                </label>
                <input
                  type="text"
                  name="task"
                  value={dataForm.task}
                  onChange={handleChange}
                  placeholder="cth: Restok Kalung Titanium"
                  required
                  className="w-full bg-surface-neutral rounded-[24px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-text-disable text-text-light"
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={dataForm.tanggal}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-neutral rounded-[24px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-text-light"
                />
              </div>

              {/* Jam Mulai & Selesai */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">
                  Waktu
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-text-disable mb-1">Mulai</p>
                    <input
                      type="time"
                      name="jamMulai"
                      value={dataForm.jamMulai}
                      onChange={handleChange}
                      required
                      className="w-full bg-surface-neutral rounded-[24px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-text-light"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-disable mb-1">Selesai</p>
                    <input
                      type="time"
                      name="jamSelesai"
                      value={dataForm.jamSelesai}
                      onChange={handleChange}
                      required
                      className="w-full bg-surface-neutral rounded-[24px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all text-text-light"
                    />
                  </div>
                </div>
                {dataForm.jamMulai && dataForm.jamSelesai && (
                  <div className="flex items-center gap-1.5 bg-surface-neutral rounded-xl px-3 py-2 mt-1">
                    <FaClock className="text-primary text-[10px] shrink-0" />
                    <span className="text-[11px] font-bold text-text-light">
                      {dataForm.jamMulai} – {dataForm.jamSelesai}
                    </span>
                  </div>
                )}
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-disable">Kategori</label>
                <div className="grid grid-cols-5 gap-2">
                  {kategoriList.map(k => {
                    const kc = kategoriConfig[k];
                    const KIcon = kc.icon;
                    return (
                      <button key={k} type="button"
                        onClick={() => setDataForm(p => ({ ...p, kategori: k }))}
                        className={`py-2.5 rounded-[24px] text-[10px] font-bold transition-all flex flex-col items-center gap-1 border-2 ${
                          dataForm.kategori === k
                            ? `${kc.badge} border-transparent shadow-sm`
                            : 'bg-surface-neutral text-text-disable border-transparent hover:border-surface-border'
                        }`}>
                        <KIcon className="text-sm" />
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tombol */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-[24px] text-sm font-bold border border-surface-border text-text-disable hover:bg-surface-neutral transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-[24px] text-sm font-bold bg-primary text-surface-white hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <FaPlus className="text-xs" /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Timeline ── */}
      <div className="bg-surface-white border border-surface-border rounded-[32px] shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-surface-neutral rounded-xl flex items-center justify-center">
            <FaClock className="text-primary text-sm" />
          </div>
          <h3 className="text-base font-black text-text-dark">Timeline Hari Ini</h3>
        </div>
        <div className="relative pl-16">
          <div className="absolute left-12 top-2 bottom-2 w-px bg-secondary/30" />
          <div className="space-y-4">
            {tasks.map(item => {
              const kc = kategoriConfig[item.kategori] ?? { badge: 'bg-secondary/20 text-text-light', dot: 'bg-text-disable', icon: FaCalendarAlt };
              const KIcon = kc.icon;
              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  <span className="absolute -left-16 text-[10px] font-bold text-text-disable pt-2.5 w-10 text-right">
                    {item.time.split(' - ')[0]}
                  </span>
                  <div className={`absolute -left-[18px] w-3 h-3 rounded-full mt-2.5 z-10 border-2 border-surface-white shadow-sm ${kc.dot}`} />
                  <div className="flex-1 bg-surface-neutral hover:bg-secondary/20 transition-colors rounded-[24px] px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${kc.badge}`}>
                        <KIcon className="text-[10px]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-dark">{item.task}</p>
                        <p className="text-[10px] text-text-disable mt-0.5">{item.time}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl shrink-0 ${kc.badge}`}>
                      {item.kategori}
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
