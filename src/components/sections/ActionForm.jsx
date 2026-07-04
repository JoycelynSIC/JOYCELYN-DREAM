/**
 * KOMPONEN: ActionForm
 * Final CTA section — form penukaran poin loyalitas.
 * PRD V3: Bottom Area, terletak setelah RewardShowcase dan sebelum FAQ.
 *
 * Props:
 *   isLoggedIn   {boolean}
 *   userProfile  {object|null}  — berisi .points, .namaDepan, dll
 *   setUserProfile {function}   — setter parent (UserLayout) untuk sinkronisasi Header
 *   onLoginClick {function}     — navigate ke /login jika guest
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Gift, LogIn, CheckCircle2, AlertCircle,
  ChevronRight, Ticket, Gem, Percent, ShoppingBag, Lock,
} from "lucide-react";

/* ══════════════════════════════════════════════
   KATALOG ITEM PENUKARAN
══════════════════════════════════════════════ */
const REDEEM_ITEMS = [
  {
    id: "voucher-10k",
    label: "Voucher Rp10.000",
    desc: "Potongan langsung untuk semua kategori produk",
    points: 100,
    Icon: Ticket,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    prefix: "VCH10K",
  },
  {
    id: "voucher-25k",
    label: "Voucher Rp25.000",
    desc: "Potongan signifikan untuk order selanjutnya",
    points: 250,
    Icon: Percent,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    prefix: "VCH25K",
  },
  {
    id: "voucher-50k",
    label: "Voucher Rp50.000",
    desc: "Hemat besar untuk belanja di atas Rp100.000",
    points: 500,
    Icon: ShoppingBag,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    prefix: "VCH50K",
  },
  {
    id: "aksesoris-gratis",
    label: "Aksesoris Gratis",
    desc: "Produk aksesoris pilihan dikirim ke rumahmu",
    points: 1000,
    Icon: Gem,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    prefix: "AKSGRTS",
  },
];

/* ── helper: generate kode voucher acak ── */
function generateVoucherCode(prefix) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const suffix = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${prefix}-${suffix}`;
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function ActionForm({ isLoggedIn, userProfile, setUserProfile, onLoginClick }) {
  const [selectedItemId, setSelectedItemId] = useState(REDEEM_ITEMS[0].id);
  const [qty, setQty] = useState(1);
  const [successData, setSuccessData] = useState(null); // { voucherCode, itemLabel, qty, cost }
  const [submitting, setSubmitting] = useState(false);

  const currentPoints = isLoggedIn && userProfile ? (userProfile.points ?? 0) : 0;
  const selectedItem = REDEEM_ITEMS.find((i) => i.id === selectedItemId) ?? REDEEM_ITEMS[0];
  const totalCost = selectedItem.points * qty;
  const isInsufficient = isLoggedIn && totalCost > currentPoints;
  const canSubmit = isLoggedIn && userProfile && !isInsufficient && qty >= 1;

  // Reset success panel saat user ganti pilihan
  const handleItemChange = (id) => {
    setSelectedItemId(id);
    setSuccessData(null);
  };

  const handleQtyChange = (val) => {
    const n = Math.max(1, Number(val) || 1);
    setQty(n);
    setSuccessData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);

    // Hitung poin baru — tidak pernah negatif
    const newPoints = Math.max(0, currentPoints - totalCost);
    const voucherCode = generateVoucherCode(selectedItem.prefix);

    // Update state parent (UserLayout) → sinkronisasi Header otomatis
    const updatedProfile = { ...userProfile, points: newPoints };
    setUserProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));

    setSuccessData({
      voucherCode,
      itemLabel: selectedItem.label,
      qty,
      cost: totalCost,
    });

    // Reset form
    setSelectedItemId(REDEEM_ITEMS[0].id);
    setQty(1);
    setSubmitting(false);
  };

  const SelectedIcon = selectedItem.Icon;

  return (
    <section
      id="action-form"
      className="max-w-7xl mx-auto px-4 md:px-6 scroll-mt-24"
    >
      {/* ── Section Header ── */}
      <div className="text-center mb-10">
        <motion.span
          className="inline-block bg-[#9E4BDC]/10 text-[#9E4BDC] text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#9E4BDC]/10"
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Klaim Reward Anda
        </motion.span>
        <motion.h2
          className="text-2xl md:text-3xl font-black text-[#22285E] tracking-tight mt-4"
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
        >
          Tukar Poin, Raih Hadiah Nyata
        </motion.h2>
        <motion.p
          className="text-xs text-gray-400 font-medium max-w-md mx-auto leading-relaxed mt-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          Ubah setiap transaksi belanja menjadi keuntungan nyata. Gabung member Na_store.id sekarang!
        </motion.p>
      </div>

      {/* ── Main Card ── */}
      <motion.div
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── Kolom Kiri: Value proposition ── */}
          <div className="bg-gradient-to-br from-[#1B1A45] via-[#2F1F5E] to-[#20153D] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Glow decorations */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#9E4BDC]/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/15 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <span className="inline-block bg-white/10 border border-white/15 text-white text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-md">
                Program Loyalitas CRM
              </span>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white leading-snug">
                  Setiap Poin<br />
                  <span className="text-[#C084FC]">Bernilai Nyata</span>
                </h3>
                <p className="text-xs text-white/65 leading-relaxed font-medium">
                  Belanja Rp1.000 = 1 Poin. Kumpulkan, tukarkan, dan nikmati reward eksklusif tanpa batas kedaluwarsa.
                </p>
              </div>

              {/* Benefit list */}
              <ul className="space-y-2.5">
                {[
                  "Poin otomatis masuk setiap transaksi",
                  "Voucher & aksesoris gratis tanpa syarat rumit",
                  "Tier naik = benefit makin eksklusif",
                  "Tidak ada batas kedaluwarsa poin",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-white/70 font-medium">
                    <span className="w-4 h-4 rounded-full bg-[#9E4BDC]/40 border border-[#9E4BDC]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#C084FC]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Saldo poin chip — login only */}
            {isLoggedIn && userProfile && (
              <div className="relative z-10 mt-8 bg-white/10 border border-white/15 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Saldo Poin Anda</p>
                  <p className="text-xl font-black text-white leading-tight">
                    {currentPoints.toLocaleString("id")}
                    <span className="text-sm font-bold text-white/60 ml-1.5">Poin</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Kolom Kanan: Form ── */}
          <div className="p-8 md:p-10 flex flex-col justify-center">

            {/* SUCCESS STATE */}
            <AnimatePresence mode="wait">
              {successData ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex flex-col items-center text-center gap-5 py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-base font-black text-[#22285E]">Penukaran Berhasil!</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      {successData.qty}× {successData.itemLabel} —{" "}
                      <span className="font-bold text-[#9E4BDC]">−{successData.cost.toLocaleString("id")} Poin</span>
                    </p>
                  </div>
                  {/* Kode voucher */}
                  <div className="w-full bg-[#9E4BDC]/5 border border-[#9E4BDC]/20 rounded-2xl px-5 py-4 space-y-1">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Kode Voucher Anda</p>
                    <p className="text-lg font-black text-[#9E4BDC] tracking-widest font-mono">
                      {successData.voucherCode}
                    </p>
                    <p className="text-[9px] text-gray-400">Simpan kode ini dan tunjukkan saat checkout</p>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    Sisa saldo:{" "}
                    <span className="font-black text-[#22285E]">
                      {currentPoints.toLocaleString("id")} Poin
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccessData(null)}
                    className="text-xs font-bold text-[#9E4BDC] hover:underline cursor-pointer"
                  >
                    Tukar Lagi
                  </button>
                </motion.div>
              ) : (

                /* FORM STATE */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Header form */}
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-[#22285E]">Form Penukaran Poin</h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {isLoggedIn
                        ? `Saldo Anda: ${currentPoints.toLocaleString("id")} Poin`
                        : "Login terlebih dahulu untuk menukarkan poin"}
                    </p>
                  </div>

                  {/* GUEST LOCK OVERLAY MESSAGE */}
                  {!isLoggedIn && (
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-snug">
                        Silakan <span className="font-black text-[#9E4BDC]">login</span> untuk mengakses fitur penukaran poin reward.
                      </p>
                    </div>
                  )}

                  {/* Dropdown pilihan item */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#22285E]">Pilih Item Penukaran</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {REDEEM_ITEMS.map((item) => {
                        const Icon = item.Icon;
                        const isSelected = selectedItemId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={!isLoggedIn}
                            onClick={() => handleItemChange(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer
                              ${!isLoggedIn
                                ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                                : isSelected
                                  ? "border-[#9E4BDC]/40 bg-[#9E4BDC]/5 shadow-sm shadow-[#9E4BDC]/10"
                                  : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              <Icon className={`w-4 h-4 ${item.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold leading-tight ${isSelected ? "text-[#9E4BDC]" : "text-[#22285E]"}`}>
                                {item.label}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium truncate">{item.desc}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0
                              ${isSelected
                                ? "bg-[#9E4BDC] text-white"
                                : "bg-gray-100 text-gray-500"}`}
                            >
                              {item.points.toLocaleString("id")} Poin
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input kuantitas */}
                  <div className="space-y-2">
                    <label htmlFor="qty-input" className="text-xs font-bold text-[#22285E]">
                      Kuantitas
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="qty-input"
                        type="number"
                        min={1}
                        value={qty}
                        disabled={!isLoggedIn}
                        onChange={(e) => handleQtyChange(e.target.value)}
                        className="w-24 bg-[#F4F4F5] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black text-[#22285E] text-center focus:outline-none focus:ring-2 focus:ring-[#9E4BDC]/25 focus:border-[#9E4BDC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                      {isLoggedIn && (
                        <p className="text-xs text-gray-400 font-medium">
                          = <span className={`font-black ${isInsufficient ? "text-red-500" : "text-[#9E4BDC]"}`}>
                            {totalCost.toLocaleString("id")} Poin
                          </span> dibutuhkan
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Error saldo kurang */}
                  <AnimatePresence>
                    {isInsufficient && (
                      <motion.div
                        className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-xs text-red-500 font-semibold leading-snug">
                          Maaf, saldo poin Anda tidak mencukupi untuk penukaran ini.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CTA Button */}
                  {isLoggedIn ? (
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className={`w-full flex items-center justify-center gap-2 text-sm font-black py-4 rounded-2xl transition-all
                        ${canSubmit && !submitting
                          ? "bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] text-white shadow-md shadow-[#9E4BDC]/25 hover:opacity-95 active:scale-[0.99] cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      <Gift className="w-4 h-4" />
                      Klaim Voucher Sekarang
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onLoginClick?.()}
                      className="w-full flex items-center justify-center gap-2 text-sm font-black py-4 rounded-2xl bg-gradient-to-r from-[#9E4BDC] to-[#8e3ec7] text-white shadow-md shadow-[#9E4BDC]/25 hover:opacity-95 active:scale-[0.99] cursor-pointer transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Daftar Member Loyalitas
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
