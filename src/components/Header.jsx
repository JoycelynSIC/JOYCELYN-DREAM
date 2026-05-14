import { FaBell, FaSearch } from 'react-icons/fa';

export default function Header() {
  const displayName = "Joycelyn Dhealiva";
  const email = "joycelyn@rocketmail.com";

  return (
    <header className="px-8 py-4 flex justify-between items-center bg-surface-white border-b border-surface-border">
      {/* Search */}
      <div className="relative hidden lg:block">        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disable text-sm" />
        <input
          type="text"
          placeholder="Cari sesuatu..."
          className="pl-11 pr-5 py-2.5 bg-surface-gray border border-surface-border rounded-full text-sm w-[320px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-text-disable text-text-light"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5 ml-auto">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-surface-gray border border-surface-border hover:bg-surface-neutral transition-colors text-text-dark">
          <FaBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-warning rounded-full border-2 border-surface-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-surface-border" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-surface-white text-xs font-bold shrink-0">
            JD
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-text-dark leading-tight">{displayName}</p>
            <p className="text-[11px] text-text-disable">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
