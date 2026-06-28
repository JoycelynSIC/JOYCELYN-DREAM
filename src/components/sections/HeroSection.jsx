import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Gift, ShoppingBag, Star } from "lucide-react";

import imgKalungRosegold from "../../assets/gambarproduk/kalungrosegold.png";
import imgGelangCrystal  from "../../assets/gambarproduk/gelangcrystal.png";
import imgCincinGold      from "../../assets/gambarproduk/cincingold.png";
import imgAntingPearl    from "../../assets/gambarproduk/antingpearl.png";
import imgKalungBintang  from "../../assets/gambarproduk/kalungbintang.png";
import imgScrunchie      from "../../assets/gambarproduk/scrunchie.png";

const PRODUCTS = [
  { id:0, name:"Kalung Titanium Rosegold", cat:"Kalung", img:imgKalungRosegold, price:"Rp 89.000", tag:"Best Seller",  rating:4.9, sold:312 },
  { id:1, name:"Gelang Crystal Aesthetic", cat:"Gelang", img:imgGelangCrystal,  price:"Rp 55.000", tag:"Trending",     rating:4.8, sold:198 },
  { id:2, name:"Cincin Adjustable Gold",   cat:"Cincin", img:imgCincinGold,     price:"Rp 45.000", tag:"New Arrival",  rating:4.7, sold:145 },
  { id:3, name:"Anting Pearl Elegan",      cat:"Anting", img:imgAntingPearl,    price:"Rp 38.000", tag:"Favorit",      rating:4.9, sold:267 },
  { id:4, name:"Kalung Bintang Perak",     cat:"Kalung", img:imgKalungBintang,  price:"Rp 72.000", tag:"Top Rated",    rating:5.0, sold:89  },
  { id:5, name:"Scrunchie Satin Premium",  cat:"Rambut", img:imgScrunchie,      price:"Rp 29.000", tag:"Reward Item",  rating:4.8, sold:176 },
];

const N     = PRODUCTS.length;
const SLOT  = 255; // px between each card-center slot
const CARD_W = 240; // px — matches w-60

const wrap = (i) => ((i % N) + N) % N;

/** Returns the shortest circular offset from idx to i */
const getOffset = (i, idx) => {
  let d = i - idx;
  if (d > N / 2)  d -= N;
  if (d < -N / 2) d += N;
  return d;
};

/** Inline style for each card based on its offset from center */
const slotStyle = (offset) => {
  const TRANSITION = "all 0.55s cubic-bezier(0.22,1,0.36,1)";
  // cards beyond ±1 → invisible, shifted further out
  if (Math.abs(offset) > 1) {
    return {
      position: "absolute",
      left: "50%",
      top: 0,
      width: CARD_W,
      transform: `translateX(calc(-50% + ${offset * SLOT}px)) scale(0.78)`,
      opacity: 0,
      pointerEvents: "none",
      zIndex: 0,
      transition: TRANSITION,
    };
  }
  // center card
  if (offset === 0) {
    return {
      position: "absolute",
      left: "50%",
      top: 0,
      width: CARD_W,
      transform: "translateX(-50%) scale(1)",
      opacity: 1,
      zIndex: 20,
      cursor: "pointer",
      transition: TRANSITION,
    };
  }
  // side ghost cards (±1)
  return {
    position: "absolute",
    left: "50%",
    top: 0,
    width: CARD_W,
    transform: `translateX(calc(-50% + ${offset * SLOT}px)) scale(0.88)`,
    opacity: 0.32,
    filter: "blur(1.5px)",
    pointerEvents: "none",
    zIndex: 5,
    transition: TRANSITION,
  };
};

export default function HeroSection() {
  const [idx, setIdx] = useState(0);

  const go   = useCallback((n) => setIdx(wrap(n)), []);
  const next = useCallback(() => go(idx + 1), [idx, go]);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const t = setInterval(next, 3800);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative bg-[#0D0B2A] text-white overflow-hidden">
      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage:"radial-gradient(rgba(158,75,220,0.22) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
      {/* glow blobs */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#7C3AED]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-[#4F46E5]/10 blur-[100px] pointer-events-none" />

      {/* ── GRID ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-32 pb-24 lg:pt-36 lg:pb-28">

        {/* LEFT: copy */}
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-[#9E4BDC]/15 border border-[#9E4BDC]/30 text-purple-200 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            Platform CRM Loyalitas #1
          </span>

          <h1 className="font-black leading-[1.2] text-[28px] md:text-[36px] xl:text-[42px]">
            <span className="text-white">Belanja Aksesoris</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F0ABFC] via-[#C084FC] to-[#818CF8]">Premium,</span>{" "}
            <span className="text-white">Dapat</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#34D399] to-[#38BDF8]">Poin!</span>
          </h1>

          <p className="text-white/60 text-sm leading-relaxed max-w-md">
            Setiap pembelian menghasilkan poin yang bisa ditukar hadiah gratis.
            Pantau stok real-time & nikmati benefit VIP eksklusif.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => scroll("catalog")}
              className="relative overflow-hidden group inline-flex items-center gap-2 bg-[#9E4BDC] hover:bg-[#8B3EC7] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-[#9E4BDC]/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ShoppingBag className="w-4 h-4 shrink-0" />
              Mulai Belanja
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              onClick={() => scroll("loyalty")}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-md"
            >
              <Gift className="w-4 h-4 text-[#C084FC] shrink-0" />
              Tukar Poin
            </button>
          </div>

          <div className="flex gap-8 pt-4 border-t border-white/[0.07]">
            {[["200+","Produk"],["3.5K+","Pelanggan"],["Free","Poin Reward"]].map(([v,l]) => (
              <div key={l}>
                <p className="text-base font-black text-white">{v}</p>
                <p className="text-[10px] text-white/40 font-semibold">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: slot-based carousel — all 6 cards always rendered */}
        <div className="hidden lg:flex flex-col items-center gap-6">

          {/* Carousel stage — fixed height, no overflow-hidden so side cards show fully */}
          <div className="relative w-full" style={{ height: 420 }}>
            {/* Ambient glow under active card */}
            <div
              className="absolute rounded-full bg-[#9E4BDC]/15 blur-[70px] pointer-events-none"
              style={{ width: 220, height: 220, left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
            />

            {PRODUCTS.map((p, i) => {
              const offset = getOffset(i, idx);
              const isActive = offset === 0;
              return (
                <div
                  key={p.id}
                  style={slotStyle(offset)}
                  onClick={isActive ? () => scroll("catalog") : undefined}
                >
                  {/* Card shell */}
                  <div
                    className={`bg-white/[0.05] backdrop-blur-xl border rounded-[1.75rem] p-5 w-full h-full transition-[border-color,box-shadow] duration-500 ${
                      isActive
                        ? "border-[#9E4BDC]/30 shadow-[0_24px_60px_rgba(158,75,220,0.22)] hover:border-[#9E4BDC]/55 hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(158,75,220,0.3)] group"
                        : "border-white/[0.07] shadow-none"
                    }`}
                  >
                    {/* Tag */}
                    <span className="inline-block bg-[#9E4BDC] text-white text-[9px] font-black px-2.5 py-1 rounded-full mb-4 tracking-widest uppercase">
                      {p.tag}
                    </span>

                    {/* Image */}
                    <div className="w-full h-40 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#9E4BDC]/10 to-transparent" />
                      <img
                        src={p.img}
                        alt={p.name}
                        className={`h-[85%] w-auto object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 ${isActive ? "group-hover:scale-105" : ""}`}
                      />
                    </div>

                    {/* Info */}
                    <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-0.5">{p.cat}</p>
                    <p className="text-sm font-black text-white leading-snug mb-1">{p.name}</p>
                    <p className="text-base font-black text-[#C084FC] mb-3">{p.price}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_,si) => (
                          <Star key={si} className={`w-2.5 h-2.5 ${si < Math.floor(p.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
                        ))}
                        <span className="text-[10px] text-white/50 font-semibold ml-1">{p.rating}</span>
                      </div>
                      <span className="text-[10px] text-white/35 font-semibold">{p.sold} terjual</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {PRODUCTS.map((_,i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i===idx ? "bg-[#A855F7] w-5 h-1.5" : "bg-white/20 hover:bg-white/40 w-1.5 h-1.5"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* wave divider */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="currentColor">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" className="text-[#F4F4F5]" />
        </svg>
      </div>
    </section>
  );
}
