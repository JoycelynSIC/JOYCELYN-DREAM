/**
 * KOMPONEN 14 — DonutChart
 * Recharts donut - bersih, jelas, efek hover proper.
 */
import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';

/* ── Active Shape: pakai Sector bawaan Recharts, tidak ada SVG manual ── */
function renderActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 2}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ filter: 'drop-shadow(0 0 8px ' + fill + 'aa)' }}
    />
  );
}

/* ── Tooltip: putih solid, garis kiri berwarna, teks jelas ── */
function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const seg = payload[0];
  const color = seg.payload.color;
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e4e4e7',
      borderLeft: '5px solid ' + color,
      borderRadius: '10px',
      padding: '10px 16px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
      fontFamily: 'Poppins, sans-serif',
      minWidth: '130px',
      pointerEvents: 'none',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
        <span style={{
          width:'10px', height:'10px', borderRadius:'50%',
          background: color, display:'inline-block', flexShrink:0,
        }} />
        <span style={{ fontSize:'11px', fontWeight:600, color:'#3f3f46' }}>
          {seg.name}
        </span>
      </div>
      <span style={{ fontSize:'22px', fontWeight:900, color: color, lineHeight:1 }}>
        {seg.value}%
      </span>
    </div>
  );
}

/* ── Komponen utama ── */
export default function DonutChart({ title, subtitle, segments = [], center }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const largest = segments.length
    ? segments.reduce((a, b) => (b.value > a.value ? b : a))
    : null;

  const hovered = activeIdx !== null ? segments[activeIdx] : null;
  const centerColor = hovered ? hovered.color : '#22285E';
  const centerValue = hovered ? hovered.value : (largest ? largest.value : 0);
  const centerLabel = center || (largest ? largest.label : '');

  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(158,75,220,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(34,40,94,0.07)'; }}
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)',
        border: '1.5px solid #e4e4e7',
        borderRadius: '20px',
        padding: '18px 20px 16px',
        boxShadow: '0 2px 16px rgba(34,40,94,0.07)',
        fontFamily: 'Poppins, sans-serif',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Blob dekorasi */}
      <div style={{
        position:'absolute', top:'-28px', right:'-28px',
        width:'90px', height:'90px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle, rgba(158,75,220,0.09) 0%, transparent 70%)',
      }} />

      {/* Header */}
      {(title || subtitle) && (
        <div style={{ marginBottom:'14px', position:'relative', zIndex:1 }}>
          {title && (
            <p style={{ margin:0, fontSize:'13px', fontWeight:800, color:'#22285E' }}>
              {title}
            </p>
          )}
          {subtitle && (
            <p style={{ margin:'3px 0 0', fontSize:'10px', fontWeight:500, color:'#a1a1aa' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:'16px', position:'relative', zIndex:1 }}>

        {/* Donut */}
        <div style={{ position:'relative', width:'148px', height:'148px', flexShrink:0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="label"
                cx="50%" cy="50%"
                innerRadius={46}
                outerRadius={64}
                paddingAngle={3}
                strokeWidth={0}
                animationBegin={0}
                animationDuration={750}
                activeIndex={activeIdx !== null ? activeIdx : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, i) => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {segments.map((seg, i) => (
                  <Cell
                    key={i}
                    fill={seg.color}
                    opacity={activeIdx === null || activeIdx === i ? 1 : 0.3}
                    style={{ transition:'opacity 0.2s', cursor:'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<PieTooltip />}
                isAnimationActive={false}
                wrapperStyle={{ zIndex: 50, outline:'none' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center teks */}
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            pointerEvents:'none', userSelect:'none',
          }}>
            <span style={{
              fontSize:'21px', fontWeight:900, lineHeight:1,
              color: centerColor,
              transition:'color 0.2s',
            }}>
              {centerValue}%
            </span>
            <span style={{
              fontSize:'9px', fontWeight:600, color:'#71717a',
              marginTop:'5px', textAlign:'center',
              maxWidth:'58px', lineHeight:1.3,
            }}>
              {hovered ? hovered.label : centerLabel}
            </span>
          </div>
        </div>

        {/* Legenda */}
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'9px' }}>
          {segments.map((seg, i) => {
            const isActive = activeIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{ cursor:'default' }}
              >
                {/* Label row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'5px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'7px', minWidth:0, flex:1 }}>
                    <span style={{
                      display:'inline-block', flexShrink:0,
                      width:'10px', height:'10px', borderRadius:'50%',
                      background: seg.color,
                      boxShadow: isActive ? '0 0 7px ' + seg.color : 'none',
                      transform: isActive ? 'scale(1.3)' : 'scale(1)',
                      transition:'transform 0.2s, box-shadow 0.2s',
                    }} />
                    <span style={{
                      fontSize:'10px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#22285E' : '#52525b',
                      overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis',
                      transition:'color 0.15s',
                    }}>
                      {seg.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize:'11px', fontWeight:800,
                    color: seg.color,
                    marginLeft:'6px', flexShrink:0,
                  }}>
                    {seg.value}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width:'100%', height:'5px', borderRadius:'99px', background:'#f0f0f4', overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:'99px',
                    width: seg.value + '%',
                    background: seg.color,
                    opacity: activeIdx === null || isActive ? 1 : 0.25,
                    boxShadow: isActive ? '0 0 7px ' + seg.color + '88' : 'none',
                    transition:'opacity 0.2s, box-shadow 0.2s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
