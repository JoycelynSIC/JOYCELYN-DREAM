import { Outlet } from "react-router-dom";
import logoNastore from "../assets/gambarproduk/logonastore.png";
import { FaShieldAlt } from "react-icons/fa";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-soft p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg border border-secondary overflow-hidden">
        {/* Header strip */}
        <div className="bg-primary px-10 py-7 flex items-center gap-4">
          <img
            src={logoNastore}
            alt="Na_store.id"
            className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm"
          />
          <div>
            <p className="text-on-primary font-black text-sm tracking-tight">Na_store.id</p>
            <div className="flex items-center gap-1 mt-0.5">
              <FaShieldAlt className="text-on-primary/70 text-[9px]" />
              <p className="text-on-primary/70 text-[10px] uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-10 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
