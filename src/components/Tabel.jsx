/**
 * KOMPONEN 7 — Table + TableRow
 * Tabel data generik dengan header kolom dinamis.
 *
 * Penggunaan:
 *   <Table headers={['Nama','Email','Status']} cols={3}>
 *     <TableRow cols={3}>
 *       <span>Joycelyn</span>
 *       <span>joy@mail.com</span>
 *       <Badge status="Gold" />
 *     </TableRow>
 *   </Table>
 *
 * Props Table:
 *  headers   : string[]
 *  cols      : number — jumlah kolom grid (default = headers.length)
 *  className : string
 *
 * Props TableRow:
 *  cols      : number
 *  onClick   : fn
 *  className : string
 */

export function Table({ headers = [], cols, children, className = "" }) {
  const gridCols = cols ?? headers.length;
  const gridClass = `grid gap-4 px-4`;

  return (
    <div className={`overflow-x-auto scrollbar-hide ${className}`}>
      <div style={{ minWidth: `${gridCols * 140}px` }}>
        {/* Header */}
        <div
          className={`${gridClass} pb-3 border-b border-[#E4E4E7]`}
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {headers.map((h, i) => (
            <p key={i} className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">
              {h}
            </p>
          ))}
        </div>

        {/* Body */}
        <div className="mt-1 space-y-0.5">{children}</div>
      </div>
    </div>
  );
}

export function TableRow({ cols = 5, onClick, children, className = "" }) {
  return (
    <div
      onClick={onClick}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      className={`
        grid gap-4 items-center px-4 py-3 rounded-xl
        hover:bg-[#F4F4F5] transition-all
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Table;
