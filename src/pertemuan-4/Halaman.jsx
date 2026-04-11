import React, { useState } from "react";
import productsData from "./Supermarket.json";

const images = import.meta.glob("../assets/Supermarket/*.png", { eager: true });
const imageMap = Object.fromEntries(
  Object.entries(images).map(([path, module]) => [path.split("/").pop(), module.default])
);

export default function Halaman() {
  const [formData, setFormData] = useState({
    searchTerm: "",
    selectedTag: "Semua",
    selectedStock: "Semua",
    view: "guest",
  });

  const allTags = ["Semua", ...new Set(productsData.map((p) => p.category))];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dataFiltered = productsData.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(formData.searchTerm.toLowerCase());
    const matchTag = formData.selectedTag === "Semua" || p.category === formData.selectedTag;
    const matchStock =
      formData.selectedStock === "Semua" ||
      (formData.selectedStock === "Tersedia" && p.stock >= 100) ||
      (formData.selectedStock === "Stok Terbatas" && p.stock > 0 && p.stock < 100) ||
      (formData.selectedStock === "Habis" && p.stock === 0);
    return matchSearch && matchTag && matchStock;
  });

  const getImagePath = (fileName) => {
    return imageMap[fileName] || "https://via.placeholder.com/150";
  };

  return (
    <div className="w-full min-h-screen bg-[#A5D6A7] text-slate-800 font-sans pb-10">
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-[#C8E6C9] shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl animate-bounce" style={{ animationDuration: '1.5s' }}>🥦</span>
            <h1 className="text-sm md:text-xl font-black text-[#2E7D32]">
              FRESH<span className="text-orange-500">BASKET</span>
            </h1>
          </div>
          <div className="flex bg-[#F1F8E9]/80 p-1 rounded-xl border border-[#C8E6C9]">
            <button
              onClick={() => setFormData(prev => ({...prev, view: 'guest'}))}
              className={`px-3 md:px-5 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${
                formData.view === "guest" ? "bg-[#4CAF50] text-white shadow-md" : "text-[#4CAF50]"
              }`}
            >GUEST</button>
            <button
              onClick={() => setFormData(prev => ({...prev, view: 'admin'}))}
              className={`px-3 md:px-5 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${
                formData.view === "admin" ? "bg-[#2E7D32] text-white shadow-md" : "text-[#2E7D32]"
              }`}
            >ADMIN</button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="w-full bg-white p-4 rounded-[1.5rem] shadow-md border border-white mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <input
                type="text"
                name="searchTerm"
                placeholder="Cari produk..."
                value={formData.searchTerm}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#F1F8E9] focus:border-[#4CAF50] bg-[#F1F8E9]/50 text-xs md:text-sm outline-none"
              />
              <span className="absolute left-3 top-3.5">🔍</span>
            </div>
            <div className="grid grid-cols-2 gap-2 md:contents">
              <div className="relative">
                <select 
                  name="selectedTag" 
                  value={formData.selectedTag} 
                  onChange={handleInputChange}
                  className="w-full appearance-none pl-3 pr-8 py-3 rounded-xl border-2 border-[#F1F8E9] bg-[#F1F8E9]/50 text-[10px] md:text-sm font-bold text-[#2E7D32] outline-none"
                >
                  {allTags.map(t => <option key={t} value={t}>{t === "Semua" ? "Kategori" : t}</option>)}
                </select>
                <div className="absolute right-2 top-4 pointer-events-none text-[#4CAF50]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              <div className="relative">
                <select 
                  name="selectedStock" 
                  value={formData.selectedStock} 
                  onChange={handleInputChange}
                  className="w-full appearance-none pl-3 pr-8 py-3 rounded-xl border-2 border-[#F1F8E9] bg-[#F1F8E9]/50 text-[10px] md:text-sm font-bold text-[#2E7D32] outline-none">
                  <option value="Semua">Stok</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Stok Terbatas">Stok Terbatas</option>
                  <option value="Habis">Habis</option>
                </select>
                <div className="absolute right-2 top-4 pointer-events-none text-[#4CAF50]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {dataFiltered.length > 0 ? (
          formData.view === "guest" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {dataFiltered.map((p) => (
                <div key={p.id} className="group bg-white rounded-[1.2rem] md:rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white flex flex-col overflow-hidden">
                  <div className="relative aspect-square m-1.5 md:m-2 rounded-[0.9rem] md:rounded-[1.5rem] overflow-hidden">
                    <img 
                      src={getImagePath(p.image)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={p.name} 
                    />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black text-[#2E7D32]">
                      ⭐ {p.rating}
                    </div>
                  </div>
                  <div className="p-3 md:p-5 pt-1 flex flex-col flex-grow">
                    <span className="text-[7px] md:text-[9px] font-black text-[#4CAF50] uppercase tracking-wider mb-0.5">{p.category}</span>
                    <h3 className="text-[10px] md:text-xs font-bold text-slate-800 mb-2 line-clamp-2 h-7 md:h-9 leading-tight">{p.name}</h3>
                    <div className="bg-[#F1F8E9] p-2 rounded-lg mb-3 text-[8px] md:text-[9px] text-slate-500">
                       <p className="truncate font-bold text-[#2E7D32]">🏬 {p.supplier.name}</p>
                    </div>
                    <div className="mt-auto mb-3">
                        <p className="text-sm md:text-base font-black text-[#2E7D32]">Rp{p.price.toLocaleString()}</p>
                        <p className={`text-[8px] md:text-[9px] font-black ${p.stock < 100 ? 'text-orange-500' : 'text-slate-400'}`}>STOK: {p.stock}</p>
                    </div>
                    <button className="w-full bg-[#4CAF50] text-white py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase active:scale-95 transition-all">
                      + Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full bg-white rounded-[1.5rem] shadow-xl border border-white overflow-hidden overflow-x-auto">
              <table className="w-full text-[10px] md:text-sm">
                <thead className="bg-[#2E7D32] text-white uppercase text-[8px] md:text-[10px]">
                  <tr>
                    <th className="px-4 py-5 text-left">Produk</th>
                    <th className="py-5 text-left">Supplier</th>
                    <th className="py-5 text-left">Nutrisi</th>
                    <th className="py-5 text-left">Status</th>
                    <th className="py-5 text-center">Stok</th>
                    <th className="py-5 text-right px-4">Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dataFiltered.map((p) => (
                    <tr key={p.id} className="transition-colors duration-200 hover:bg-[#E8F5E9]">
                      <td className="px-4 py-3 min-w-[160px]">
                        <div className="flex items-center gap-3">
                          <img 
                            src={getImagePath(p.image)} 
                            className="w-10 h-10 rounded-xl object-cover" 
                            alt="" 
                          />
                          <div>
                            <p className="font-bold text-slate-700 leading-tight">{p.name}</p>
                            <p className="text-[7px] md:text-[9px] text-[#4CAF50] font-black uppercase">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-[9px] md:text-[11px] min-w-[120px]">
                        <p className="font-bold text-slate-600">{p.supplier.name}</p>
                        <p className="text-slate-400 uppercase text-[8px]">{p.supplier.city}</p>
                      </td>
                      <td className="py-3 text-[9px] md:text-[10px] text-slate-500 min-w-[100px]">
                        <p>🔥 {p.nutrition.calories} Cal</p>
                        <p>💪 {p.nutrition.protein} Prot</p>
                      </td>
                      <td className="py-3 min-w-[90px]">
                        <span className={`px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black ${p.availability.online ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                          {p.availability.online ? 'ONLINE' : 'OFFLINE'}
                        </span>
                        <p className="text-[7px] text-slate-400 mt-1 italic">{p.availability.lastRestock}</p>
                      </td>
                      <td className="text-center font-bold px-2 text-slate-600">{p.stock}</td>
                      <td className="text-right px-4 font-black text-[#2E7D32] whitespace-nowrap text-xs md:text-sm">Rp{p.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="w-full py-24 flex flex-col items-center justify-center bg-white/20 rounded-[3rem] border-2 border-dashed border-white text-white">
            <div className="text-6xl mb-4 opacity-80">🍃</div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] mb-2 text-white">Produk tidak tersedia</h3>
            <p className="text-[10px] md:text-xs font-medium text-white/70 italic tracking-widest px-6 text-center">Coba cari kata kunci lain...</p>
          </div>
        )}
      </main>
    </div>
  );
}