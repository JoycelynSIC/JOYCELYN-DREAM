/**
 * KOMPONEN: RewardShowcase
 * Panel interaktif tier benefit + Reward Claim Center.
 * Tanpa emoji — semua ikon dari lucide-react.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Gift, Star, Zap, Shield, Sparkles, LogIn,
  Check, X, ChevronRight, Trophy, Ticket, Gem,
  Percent, Layers, CircleDollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const TIERS = [
  {
    name: "Regular",
    range: "0 – 499 Poin",
    icon: Shield,
    accentBar: "bg-zinc-300",
    gradient: "from-white to-zinc-50",
    border: "border-zinc-200",
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-500",
    pillStyle: "text-zinc-600 bg-zinc-100 border-zinc-200",
    benefits: [
      "Harga normal semua produk",
      "Pantau stok real-time",
      "Poin di setiap transaksi",
    ],
  },
  {
    name: "Silver",
    range: "500 – 1.999 Poin",
    icon: Star,
    accentBar: "bg-slate-400",
    gradient: "from-slate-50 to-sky-50/50",
    border: "border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    pillStyle: "text-slate-600 bg-slate-100 border-slate-200",
    benefits: [
      "Voucher potongan Rp5.000",
      "Kemasan beludru mini eksklusif",
      "Bonus poin di hari ulang tahun",
    ],
  },
  {
    name: "Gold",
    range: "2.000 – 4.999 Poin",
    icon: Crown,
    accentBar: "bg-amber-400",
    gradient: "from-amber-50 to-yellow-50/70",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    pillStyle: "text-amber-700 bg-amber-100 border-amber-200",
    benefits: [
      "Tukar poin dengan produk Best Seller",
      "Gratis boks kado eksklusif",
      "Prioritas chat & kustom ukuran",
    ],
    highlight: true,
  },
  {
    name: "Platinum",
    range: "5.000+ Poin",
    icon: Trophy,
    accentBar: "bg-indigo-500",
    gradient: "from-indigo-50 to-purple-50/60",
    border: "border-indigo-200",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    pillStyle: "text-indigo-700 bg-indigo-100 border-indigo-200",
    benefits: [
      "Hadiah aksesoris perak / gold langsung",
      "Diskon permanen 10%",
      "Akses produk limited edition",
    ],
  },
];

const REWARDS = [
  {
    id: 1,
    name: "Voucher Diskon Rp10.000",
    desc: "Potongan langsung untuk semua kategori produk.",
    points: 200,
    Icon: Ticket,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badge: "Paling Populer",
    badgeStyle: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: 2,
    name: "Scrunchie Satin Premium",
    desc: "Ikat rambut satin pilihan warna pastel eksklusif.",
    points: 350,
    Icon: Gift,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
    badge: "Favorit",
    badgeStyle: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    id: 3,
    name: "Cincin Bunga Resin",
    desc: "Cincin handmade unik dengan dekorasi kelopak bunga.",
    points: 500,
    Icon: Gem,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    badge: "Best Seller",
    badgeStyle: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: 4,
    name: "Voucher Diskon Rp25.000",
    desc: "Potongan harga signifikan untuk order selanjutnya.",
    points: 750,
    Icon: Percent,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badge: "Hemat Lebih",
    badgeStyle: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: 5,
    name: "Kalung Pearl Minimalist",
    desc: "Kalung rantai tipis dengan liontin mutiara sintetis.",
    points: 1000,
    Icon: CircleDollarSign,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    badge: "Gold Reward",
    badgeStyle: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    id: 6,
    name: "Gelang Crystal Aesthetic",
    desc: "Gelang kristal estetik untuk tampilan hari-hari.",
    points: 1500,
    Icon: Layers,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badge: "Eksklusif",
    badgeStyle: "bg-purple-100 text-purple-700 border-purple-200",
  },
];

/* ══════════════════════════════════════════════
   SUB-KOMPONEN: TierCard — redesign premium
══════════════════════════════════════════════ */
function TierCard({ tier, index, isCurrentTier }) {
  const Icon = tier.icon;

  return (
    <motion.div
      className={`relative flex flex-col rounded-3xl overflow-hidden text-left h-full
        ${isCurrentTier
          ? "ring-2 ring-[#9E4BDC] ring-offset-2 shadow-xl shadow-[#9E4BDC]/15"
          : tier.highlight
            ? "shadow-lg shadow-amber-200/40"
            : "shadow-sm"
        }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* ── Header block dengan warna penuh ── */}
      <div className={`relative px-5 pt-5 pb-6 overflow-hidden
        ${tier.name === "Regular"  ? "bg-zinc-100"     : ""}
        ${tier.name === "Silver"   ? "bg-slate-100"    : ""}
        ${tier.name === "Gold"     ? "bg-amber-50"     : ""}
        ${tier.name === "Platinum" ? "bg-indigo-50"    : ""}
      `}>
        {/* Glow blob */}
        <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none
          ${tier.name === "Regular"  ? "bg-zinc-300"     : ""}
          ${tier.name === "Silver"   ? "bg-slate-300"    : ""}
          ${tier.name === "Gold"     ? "bg-amber-300"    : ""}
          ${tier.name === "Platinum" ? "bg-indigo-300"   : ""}
        `} />

        {/* Top labels row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tier.iconBg}`}>
            <Icon style={{ width: 20, height: 20 }} className={tier.iconColor} />
          </div>
          <div className="flex flex-col items-end gap-1">
            {tier.highlight && (
              <span className="text-[8px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                Paling Diminati
              </span>
            )}
            {isCurrentTier && (
              <span className="text-[8px] font-black bg-[#9E4BDC] text-white px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                <Zap style={{ width: 9, height: 9 }} /> Tier Anda
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-black text-[#22285E] leading-tight">{tier.name}</h3>
        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border inline-block mt-1 ${tier.pillStyle}`}>
          {tier.range}
        </span>
      </div>

      {/* ── Benefits block ── */}
      <div className="flex-1 bg-white border border-t-0 border-gray-100/80 rounded-b-3xl px-5 py-4 space-y-2.5">
        {tier.benefits.map((b, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5
              ${tier.name === "Regular"  ? "bg-zinc-100"     : ""}
              ${tier.name === "Silver"   ? "bg-slate-100"    : ""}
              ${tier.name === "Gold"     ? "bg-amber-100"    : ""}
              ${tier.name === "Platinum" ? "bg-indigo-100"   : ""}
            `}>
              <Check style={{ width: 9, height: 9 }} className={`
                ${tier.name === "Regular"  ? "text-zinc-500"   : ""}
                ${tier.name === "Silver"   ? "text-slate-500"  : ""}
                ${tier.name === "Gold"     ? "text-amber-600"  : ""}
                ${tier.name === "Platinum" ? "text-indigo-600" : ""}
              `} />
            </div>
            <span className="text-[11px] text-gray-500 font-medium leading-snug">{b}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   SUB-KOMPONEN: RewardCard
══════════════════════════════════════════════ */
function RewardCard({ reward, isLoggedIn, currentPoints, onRedeem, onGuestBlock, index }) {
  const { Icon } = reward;
  const canAfford = currentPoints >= reward.points;
  const pointsGap = reward.points - currentPoints;
  const btnState  = !isLoggedIn ? "guest" : canAfford ? "ready" : "locked";

  return (
    <motion.div
      className={`group bg-white border rounded-2xl p-4 flex items-center gap-4 text-left transition-all duration-200
        ${btnState === "ready"
          ? "border-gray-100 hover:border-[#9E4BDC]/25 hover:shadow-md"
          : "border-gray-100 opacity-70"}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Icon box */}
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${reward.iconBg}`}>
        <Icon className={`w-5 h-5 ${reward.iconColor}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <p className="text-xs font-bold text-[#22285E] leading-tight">{reward.name}</p>
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border shrink-0 ${reward.badgeStyle}`}>
            {reward.badge}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 font-medium leading-snug line-clamp-1">{reward.desc}</p>

        {/* Points tag */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1 bg-[#9E4BDC]/8 px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 shrink-0" />
            <span className="text-[10px] font-black text-[#9E4BDC]">
              {reward.points.toLocaleString("id")} Poin
            </span>
          </div>
          {isLoggedIn && !canAfford && (
            <span className="text-[9px] text-red-400 font-semibold">
              — kurang {pointsGap.toLocaleString("id")} poin
            </span>
          )}
        </div>
      </div>

      {/* CTA button */}
      <motion.button
        onClick={() => {
          if (btnState === "guest") { onGuestBlock(); return; }
          if (btnState === "ready") { onRedeem(reward); }
        }}
        disabled={btnState === "locked"}
        className={`text-[10px] font-black px-3.5 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-colors whitespace-nowrap
          ${btnState === "ready"
            ? "bg-[#9E4BDC] text-white hover:bg-[#8B3EC7] shadow-sm shadow-[#9E4BDC]/25 cursor-pointer"
            : btnState === "guest"
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        whileTap={btnState !== "locked" ? { scale: 0.92 } : {}}
      >
        {btnState === "guest"  && <><LogIn        className="w-3 h-3" /> Masuk</>}
        {btnState === "ready"  && <><Gift         className="w-3 h-3" /> Tukar</>}
        {btnState === "locked" && <><ChevronRight className="w-3 h-3" /> Belum Cukup</>}
      </motion.button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function RewardShowcase({ isLoggedIn, currentPoints = 0, onRedeem, onLoginClick }) {
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [successToast, setSuccessToast]       = useState(null);
  const [errorToast, setErrorToast]           = useState(null);

  const getActiveTier = (pts) => {
    if (pts >= 5000) return "Platinum";
    if (pts >= 2000) return "Gold";
    if (pts >= 500)  return "Silver";
    return "Regular";
  };
  const activeTier = getActiveTier(currentPoints);

  const handleRedeem = async (reward) => {
    try {
      if (onRedeem) {
        await onRedeem(reward);
      }
      setSuccessToast(`Berhasil menukar "${reward.name}"! −${reward.points.toLocaleString("id")} Poin`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      const msg = err?.message || "Penukaran gagal. Coba lagi.";
      setErrorToast(msg);
      setTimeout(() => setErrorToast(null), 4000);
      console.warn("[RewardShowcase] Gagal menukar reward:", msg);
    }
  };

  return (
    <section id="loyalty" className="max-w-7xl mx-auto px-4 md:px-6 scroll-mt-24 space-y-16">

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-[#9E4BDC] to-[#6D28D9] text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/15"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1">{successToast}</span>
            <button
              onClick={() => setSuccessToast(null)}
              className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ERROR TOAST ── */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/15"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <X className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1">{errorToast}</span>
            <button
              onClick={() => setErrorToast(null)}
              className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GUEST DIALOG ── */}
      <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
        <DialogContent className="max-w-sm rounded-3xl border-0 shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#9E4BDC]/10 flex items-center justify-center mx-auto mb-3">
            <Gift className="w-6 h-6 text-[#9E4BDC]" />
          </div>
          <DialogHeader className="text-center items-center space-y-1">
            <DialogTitle className="text-base font-black text-[#22285E]">Akses Terkunci</DialogTitle>
            <DialogDescription className="text-xs text-gray-400 leading-relaxed">
              Daftar atau masuk ke akun Na_store.id untuk mengumpulkan poin dan menukarkan hadiah eksklusif!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => { setGuestDialogOpen(false); onLoginClick?.(); }}
              className="w-full bg-gradient-to-r from-[#9E4BDC] to-[#8B3EC7] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#9E4BDC]/20 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Masuk / Daftar Sekarang
            </button>
            <button
              onClick={() => setGuestDialogOpen(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Lihat Reward Dulu
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════
          TIER GRID
      ══════════════════════════════════════ */}
      <div>
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <motion.span
              className="inline-block bg-[#9E4BDC]/10 text-[#9E4BDC] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#9E4BDC]/10"
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Program Loyalitas
            </motion.span>
            <motion.h2
              className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-2"
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
            >
              Naik Level, Raih Benefit Lebih
            </motion.h2>
            <motion.p
              className="text-xs text-gray-400 font-medium mt-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
            >
              Empat tingkatan membership dengan keuntungan yang semakin eksklusif
            </motion.p>
          </div>

          {/* Current points chip — hanya muncul jika login */}
          {isLoggedIn && (
            <motion.div
              className="flex items-center gap-2.5 bg-[#9E4BDC]/8 border border-[#9E4BDC]/15 px-4 py-3 rounded-2xl shrink-0 self-start md:self-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4 text-[#9E4BDC] shrink-0" />
              <div>
                <p className="text-xs font-black text-[#22285E] leading-tight">
                  {currentPoints.toLocaleString("id")} Poin
                </p>
                <p className="text-[9px] text-[#9E4BDC] font-bold">{activeTier} Member</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Grid kartu tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((tier, i) => (
            <TierCard
              key={tier.name}
              tier={tier}
              index={i}
              isCurrentTier={isLoggedIn && activeTier === tier.name}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          REWARD CLAIM CENTER
      ══════════════════════════════════════ */}
      <div>
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <motion.span
              className="inline-block bg-amber-100 text-amber-700 text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-amber-200"
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Reward Claim Center
            </motion.span>
            <motion.h2
              className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-2"
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
            >
              Tukarkan Poin, Dapatkan Hadiah
            </motion.h2>
            <motion.p
              className="text-xs text-gray-400 font-medium mt-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
            >
              Pilih voucher atau produk gratis sesuai jumlah poin yang Anda miliki
            </motion.p>
          </div>

          {!isLoggedIn && (
            <button
              onClick={() => onLoginClick?.()}
              className="bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shrink-0 self-start md:self-auto transition-colors cursor-pointer shadow-md shadow-[#9E4BDC]/20"
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk untuk Menukar
            </button>
          )}
        </div>

        {/* Reward list — 2 kolom di md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REWARDS.map((reward, i) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              index={i}
              isLoggedIn={isLoggedIn}
              currentPoints={currentPoints}
              onRedeem={handleRedeem}
              onGuestBlock={() => setGuestDialogOpen(true)}
            />
          ))}
        </div>

        {/* Formula banner */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-[#22285E] to-[#1E1B4B] rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 text-left overflow-hidden relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Glow blob */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-black text-white">Rp1.000 belanja = 1 Poin Loyalitas</p>
            <p className="text-[10px] text-white/55 font-medium mt-0.5 leading-relaxed">
              Poin otomatis masuk setelah transaksi selesai. Tidak ada batas kadaluwarsa selama akun aktif.
            </p>
          </div>

          {/* Tier badge row */}
          <div className="flex items-center gap-2.5 shrink-0">
            {[
              { label: "R",  bg: "bg-zinc-500" },
              { label: "S",  bg: "bg-slate-400" },
              { label: "G",  bg: "bg-amber-500" },
              { label: "P",  bg: "bg-indigo-500" },
            ].map(({ label, bg }) => (
              <div
                key={label}
                className={`w-8 h-8 rounded-full ${bg} border-2 border-white/20 flex items-center justify-center text-[9px] font-black text-white`}
              >
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
