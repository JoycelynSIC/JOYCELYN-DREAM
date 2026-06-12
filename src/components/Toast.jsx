import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaTrash, FaEdit, FaTimes, FaExclamationCircle } from 'react-icons/fa';

/* ─────────────────────────────────────────────────────────────
   Komponen Toast tunggal
───────────────────────────────────────────────────────────── */
function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const configs = {
    success: {
      bg: 'bg-white border-[#00B5AD]/30',
      icon: <FaCheckCircle className="text-[#00B5AD] text-base shrink-0" />,
      bar: 'bg-[#00B5AD]',
    },
    delete: {
      bg: 'bg-white border-[#F24E1E]/30',
      icon: <FaTrash className="text-[#F24E1E] text-base shrink-0" />,
      bar: 'bg-[#F24E1E]',
    },
    update: {
      bg: 'bg-white border-[#9E4BDC]/30',
      icon: <FaEdit className="text-[#9E4BDC] text-base shrink-0" />,
      bar: 'bg-[#9E4BDC]',
    },
    error: {
      bg: 'bg-white border-[#F24E1E]/30',
      icon: <FaExclamationCircle className="text-[#F24E1E] text-base shrink-0" />,
      bar: 'bg-[#F24E1E]',
    },
  };

  const cfg = configs[toast.type] ?? configs.success;
  const duration = toast.duration ?? 3000;

  return (
    <div
      className={`
        relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]
        ${cfg.bg} border rounded-2xl shadow-lg px-4 py-3.5 overflow-hidden
        transition-all duration-300
        ${exiting ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
    >
      {/* Icon */}
      <div className="mt-0.5">{cfg.icon}</div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-black text-[#22285E] leading-tight">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs text-[#71717A] mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 300); }}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#22285E] transition-colors shrink-0 mt-0.5"
      >
        <FaTimes className="text-[10px]" />
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] ${cfg.bar} rounded-full`}
        style={{ animation: `toast-shrink ${duration}ms linear forwards` }}
      />

      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Container Toast (render semua toast sekaligus)
───────────────────────────────────────────────────────────── */
export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 items-end">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────
   Custom hook: useToast
   Cara pakai:
     const { toasts, showToast, removeToast } = useToast();
     showToast({ type: 'success', title: 'Berhasil!', message: 'Produk disimpan.' });
     <ToastContainer toasts={toasts} onRemove={removeToast} />
───────────────────────────────────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ type = 'success', title, message, duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}
