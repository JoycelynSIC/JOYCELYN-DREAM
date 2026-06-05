/**
 * KOMPONEN — Tooltip
 * Tooltip hover untuk info tambahan pada ikon, label, atau elemen apapun.
 * Menggunakan state + getBoundingClientRect agar tidak terpotong parent overflow.
 *
 * Props:
 *  content   : string | ReactNode  — isi tooltip
 *  position  : "top" | "bottom" | "left" | "right"  (default "top")
 *  children  : ReactNode           — elemen yang di-hover
 *  className : string
 */
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({
  content,
  position = "top",
  children,
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords]   = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    let top = 0, left = 0;

    if (position === 'top') {
      top  = rect.top + window.scrollY - gap;
      left = rect.left + window.scrollX + rect.width / 2;
    } else if (position === 'bottom') {
      top  = rect.bottom + window.scrollY + gap;
      left = rect.left + window.scrollX + rect.width / 2;
    } else if (position === 'left') {
      top  = rect.top + window.scrollY + rect.height / 2;
      left = rect.left + window.scrollX - gap;
    } else if (position === 'right') {
      top  = rect.top + window.scrollY + rect.height / 2;
      left = rect.right + window.scrollX + gap;
    }
    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    updatePosition();
    setVisible(true);
  };

  const transformMap = {
    top:    'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0%)',
    left:   'translate(-100%, -50%)',
    right:  'translate(0%, -50%)',
  };

  const arrowClasses = {
    top:    "top-full left-1/2 -translate-x-1/2 border-t-[#22285E] border-x-transparent border-b-transparent border-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[#22285E] border-x-transparent border-t-transparent border-4",
    left:   "left-full top-1/2 -translate-y-1/2 border-l-[#22285E] border-y-transparent border-r-transparent border-4",
    right:  "right-full top-1/2 -translate-y-1/2 border-r-[#22285E] border-y-transparent border-l-transparent border-4",
  };

  const bubble = visible ? createPortal(
    <div
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        transform: transformMap[position],
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      className="w-max max-w-[200px] bg-[#22285E] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg"
    >
      {content}
      <span className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {bubble}
    </div>
  );
}
