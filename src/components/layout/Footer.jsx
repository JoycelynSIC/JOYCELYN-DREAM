/**
 * KOMPONEN: Footer (Real Footer)
 * PRD V3: Komponen kaki halaman 4 kolom standar e-commerce.
 */
import { useState } from "react";
import logoNastore from "../../assets/gambarproduk/logonastore.png";
import {
  MessageCircle, Mail, HelpCircle, Crown,
  Home, ShoppingBag, Info, Send, CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const WA_NUMBER = "6282363250101";
const WA_LINK   = `https://wa.me/${WA_NUMBER}?text=Halo%20Na_store.id%20saya%20butuh%20bantuan`;
const IG_LINK   = "https://www.instagram.com/na_store.id_?igsh=MXB1YTIxaWxmODRsZg==";

export default function Footer() {
  const [email, setEmail]           = useState("");
  const [emailStatus, setEmailStatus] = useState(null); // null | "success" | "error"

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("error");
      return;
    }
    setEmailStatus("success");
    setEmail("");
    setTimeout(() => setEmailStatus(null), 4000);
  };

  return (
    <footer className="bg-[#0D0B2A] mt-0">

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Kolom 1: Brand & Tentang Kami ── */}
          <div className="space-y-4 lg:col-span-1">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={logoNastore}
                alt="Logo Na_store.id"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform bg-white rounded-lg p-1"
              />
              <div>
                <p className="font-black text-sm tracking-wide leading-tight text-white">
                  Na_store.id
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[#A855F7] font-bold">
                  Accessories & CRM Loyalty
                </p>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed font-medium">
              Platform belanja aksesoris premium berbasis program loyalitas CRM. Dari cincin handmade hingga nail art custom — setiap pembelian menghasilkan poin yang bisa ditukar hadiah nyata.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-400" />
              </a>
              <a
                href={IG_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-pink-500/20 flex items-center justify-center transition-colors"
              >
                <FaInstagram className="w-4 h-4 text-pink-400" />
              </a>
            </div>
          </div>

          {/* ── Kolom 2: Navigasi Cepat ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white/80 uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Beranda",           Icon: Home,        action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                { label: "Katalog Aksesoris", Icon: ShoppingBag, action: () => handleScroll("catalog") },
                { label: "Tentang Kami",      Icon: Info,        action: () => handleScroll("about") },
                { label: "Info Tier Poin",    Icon: Crown,       action: () => handleScroll("loyalty") },
                { label: "FAQ",               Icon: HelpCircle,  action: () => handleScroll("faq") },
              ].map(({ label, Icon, action }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={action}
                    className="flex items-center gap-2 text-xs text-white/50 font-semibold hover:text-[#A855F7] transition-colors bg-transparent border-none cursor-pointer group"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 group-hover:text-[#A855F7] transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Kolom 3: Hubungi Kami ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white/80 uppercase tracking-wider">
              Hubungi Kami
            </h4>
            <ul className="space-y-3.5">
              {/* WhatsApp */}
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80 group-hover:text-emerald-400 transition-colors">
                      Customer Service
                    </p>
                    <p className="text-[10px] text-white/40 font-medium">0823-6325-0101</p>
                    <p className="text-[9px] text-emerald-400 font-semibold">Respons &lt; 5 menit</p>
                  </div>
                </a>
              </li>
              {/* Email */}
              <li>
                <a
                  href="mailto:support@nastore.id"
                  className="flex items-start gap-2.5 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-500/20 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80 group-hover:text-blue-400 transition-colors">
                      Email Support
                    </p>
                    <p className="text-[10px] text-white/40 font-medium">support@nastore.id</p>
                  </div>
                </a>
              </li>
              {/* FAQ */}
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll("faq")}
                  className="flex items-start gap-2.5 group cursor-pointer bg-transparent border-none text-left w-full"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-500/20 transition-colors">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80 group-hover:text-indigo-400 transition-colors">
                      FAQ Hub
                    </p>
                    <p className="text-[10px] text-white/40 font-medium">Jawaban pertanyaan umum</p>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* ── Kolom 4: Newsletter ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white/80 uppercase tracking-wider">
              Info Koleksi Baru
            </h4>
            <p className="text-xs text-white/50 leading-relaxed font-medium">
              Daftarkan email untuk mendapatkan notifikasi diskon, restok produk, dan koleksi terbaru Na_store.id.
            </p>
            <form onSubmit={handleNewsletter} noValidate className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailStatus(null); }}
                  placeholder="Email kamu"
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#A855F7]/60 focus:ring-1 focus:ring-[#A855F7]/25 transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#9E4BDC] hover:bg-[#8e3ec7] text-white px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                  aria-label="Kirim email"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {emailStatus === "success" && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  Terima kasih! Kamu berhasil berlangganan.
                </div>
              )}
              {emailStatus === "error" && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-semibold">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Masukkan alamat email yang valid.
                </div>
              )}
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {["Handmade Lokal", "Anti Spam", "Unsubscribe Kapan Saja"].map((badge) => (
                <span
                  key={badge}
                  className="text-[8px] font-bold text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p className="font-medium text-center sm:text-left">
            © 2026 Na_store.id. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <button
              type="button"
              onClick={() => alert("Kebijakan Privasi Na_store.id — Akan segera tersedia.")}
              className="hover:text-[#A855F7] transition-colors cursor-pointer bg-transparent border-none"
            >
              Kebijakan Privasi
            </button>
            <span className="text-white/10">|</span>
            <button
              type="button"
              onClick={() => alert("Syarat & Ketentuan Keanggotaan Na_store.id — Akan segera tersedia.")}
              className="hover:text-[#A855F7] transition-colors cursor-pointer bg-transparent border-none"
            >
              Syarat & Ketentuan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}