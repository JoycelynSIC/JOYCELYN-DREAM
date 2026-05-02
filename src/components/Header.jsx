import { FaBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/':           'Dashboard',
  '/analytics':  'Analytics',
  '/schedule':   'Jadwal',
  '/inventory':  'Persediaan',
  '/customers':  'Pelanggan',
  '/orders':     'Pesanan',
  '/error/400':  'Error 400',
  '/error/401':  'Error 401',
  '/error/403':  'Error 403',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Na_store.id';

  // Ambil nama dari localStorage jika sudah login via API
  const storedName = localStorage.getItem('name');
  const storedUsername = localStorage.getItem('username');
  const displayName = storedName || 'Asril Ibrahim';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="px-6 py-4 flex justify-between items-center bg-soft border-b border-secondary">
      <h1 className="text-lg font-black text-gray-700 tracking-tight">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 bg-white border border-secondary rounded-2xl flex items-center justify-center hover:border-primary transition-colors">
          <FaBell className="text-gray-400 text-sm" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[9px] font-black text-white flex items-center justify-center">5</span>
        </button>

        <div className="flex items-center gap-2.5 bg-white border border-secondary rounded-2xl px-3 py-2 hover:border-primary transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-on-primary font-black text-xs shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 leading-tight">{displayName}</p>
            <p className="text-[10px] text-gray-400">{storedUsername || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
