import { FaChevronRight, FaHome } from 'react-icons/fa';

export default function PageHeader({ title, breadcrumb, children }) {
  const crumbs = Array.isArray(breadcrumb)
    ? breadcrumb
    : breadcrumb
    ? [breadcrumb]
    : [];

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left: title + breadcrumb */}
      <div>
        <h2 className="text-xl font-black text-text-dark tracking-tight leading-tight">
          {title}
        </h2>
        {crumbs.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <FaHome className="text-primary text-[10px]" />
            {crumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <FaChevronRight className="text-text-disable text-[9px]" />
                <span
                  className={`text-[11px] font-medium ${
                    index === crumbs.length - 1
                      ? 'text-primary font-bold'
                      : 'text-text-disable'
                  }`}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: action buttons */}
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}
