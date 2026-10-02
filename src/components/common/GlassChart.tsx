import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, Sparkles, Filter, Calendar } from 'lucide-react';

interface ChartPoint {
  date: string;
  value: number;
  secondaryValue: number;
  label: string;
}

interface GlassChartProps {
  title?: string;
  subtitle?: string;
  metricLabel?: string;
  timeframeDefault?: '7D' | '30D' | '24H' | 'ALL';
  className?: string;
}

export const GlassChart: React.FC<GlassChartProps> = ({
  title = 'Balance Liquidity & Volume Flow',
  subtitle = 'Real-time settlement throughput and ledger clearing velocity',
  metricLabel = '$148,290.40',
  timeframeDefault = '7D',
  className = '',
}) => {
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D' | 'ALL'>(timeframeDefault);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const dataSets: Record<string, ChartPoint[]> = {
    '24H': [
      { date: '00:00', value: 3400, secondaryValue: 2800, label: 'Early Settlement' },
      { date: '04:00', value: 2900, secondaryValue: 2400, label: 'Batch Sync' },
      { date: '08:00', value: 4800, secondaryValue: 3900, label: 'Market Open' },
      { date: '12:00', value: 7200, secondaryValue: 5600, label: 'Peak Midday Flow' },
      { date: '16:00', value: 8900, secondaryValue: 6900, label: 'High Velocity' },
      { date: '20:00', value: 6400, secondaryValue: 5100, label: 'Evening Clearance' },
      { date: 'Now', value: 9240, secondaryValue: 7400, label: 'Active Pipeline' },
    ],
    '7D': [
      { date: 'Mon', value: 14200, secondaryValue: 11000, label: 'Treasury Rebalance' },
      { date: 'Tue', value: 18400, secondaryValue: 14200, label: 'USDT Top-Up Batch' },
      { date: 'Wed', value: 16100, secondaryValue: 12800, label: 'Node Pass Dispatches' },
      { date: 'Thu', value: 24800, secondaryValue: 19400, label: 'Token Release Peak' },
      { date: 'Fri', value: 28900, secondaryValue: 22600, label: 'Record Clearing Day' },
      { date: 'Sat', value: 21500, secondaryValue: 17800, label: 'Syndicate Volume' },
      { date: 'Sun', value: 31200, secondaryValue: 25100, label: 'Weekly Settlement' },
    ],
    '30D': [
      { date: 'Week 1', value: 68000, secondaryValue: 52000, label: 'Initial Sprint' },
      { date: 'Week 2', value: 94000, secondaryValue: 76000, label: 'Enterprise Influx' },
      { date: 'Week 3', value: 112000, secondaryValue: 89000, label: 'Market Surge' },
      { date: 'Week 4', value: 148290, secondaryValue: 118000, label: 'Current Peak High' },
    ],
    'ALL': [
      { date: 'Q1 2026', value: 180000, secondaryValue: 140000, label: 'Genesis Rollout' },
      { date: 'Q2 2026', value: 390000, secondaryValue: 310000, label: 'Global Mesh Beta' },
      { date: 'Q3 2026', value: 740000, secondaryValue: 620000, label: 'Syndicate Expansion' },
      { date: 'Q4 2026', value: 1180000, secondaryValue: 980000, label: 'Present Trajectory' },
    ],
  };

  const activeData = dataSets[timeframe];
  const maxValue = Math.max(...activeData.map((d) => d.value)) * 1.15;
  const minValue = Math.min(...activeData.map((d) => d.secondaryValue)) * 0.85;

  // Chart SVG Coordinates Math (viewBox: 0 0 600 240)
  const width = 600;
  const height = 240;
  const paddingX = 35;
  const paddingY = 30;

  const points = activeData.map((item, idx) => {
    const x = paddingX + (idx / (activeData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((item.value - minValue) / (maxValue - minValue)) * (height - paddingY * 2);
    return { x, y, ...item };
  });

  // Generate smooth SVG curve path
  const curvePath = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = a[i - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (point.x - prev.x) / 2;
    const cpy2 = point.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
  }, '');

  // Fill area path (closed curve to bottom)
  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Secondary dashed line
  const secondaryPoints = activeData.map((item, idx) => {
    const x = paddingX + (idx / (activeData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((item.secondaryValue - minValue) / (maxValue - minValue)) * (height - paddingY * 2);
    return { x, y };
  });

  const secondaryCurvePath = secondaryPoints.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = a[i - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (point.x - prev.x) / 2;
    const cpy2 = point.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
  }, '');

  const activeHoverPoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className={`liquid-glass-card rounded-[34px] sm:rounded-[38px] p-6 sm:p-8 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-[1.5px] bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30">
              LEDGER TELEMETRY
            </span>
            <span className="text-white/40">·</span>
            <span className="text-xs text-white/60">Live Stream</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            {title}
          </h3>
          <p className="text-xs text-white/50">{subtitle}</p>
        </div>

        {/* Timeframe selector tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel-subtle border border-white/10 self-start sm:self-auto">
          {(['24H', '7D', '30D', 'ALL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t);
                setHoverIndex(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeframe === t
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* High-level Metric Stat Highlight */}
      <div className="flex flex-wrap items-baseline gap-4 mb-5 pb-4 border-b border-white/10 relative z-10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
            Aggregated Clearance
          </span>
          <span className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight font-mono tabular-nums">
            ${activeHoverPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 flex items-center gap-1 shadow-lg">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% Velocity</span>
          </span>

          <span className="text-xs text-white/50 font-mono hidden sm:inline">
            Status: <strong className="text-amber-300">Synchronized</strong>
          </span>
        </div>

        {activeHoverPoint && (
          <div className="ml-auto text-right hidden md:block">
            <span className="text-[10px] text-white/40 block">Period Focus</span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              {activeHoverPoint.date} · {activeHoverPoint.label}
            </span>
          </div>
        )}
      </div>

      {/* SVG Interactive Spline Wave Chart inside Liquid Glass Plate */}
      <div className="liquid-glass-plate p-3 sm:p-5 relative w-full h-64 sm:h-76">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Amber-Orange Glowing Gradient */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#f97316" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0b0c10" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Stroke Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid guide lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={paddingX}
              y1={paddingY + ratio * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={paddingY + ratio * (height - paddingY * 2)}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Secondary Baseline Curve */}
          <path
            d={secondaryCurvePath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />

          {/* Primary Spline Curve */}
          <path
            d={curvePath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-500"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoverIndex === idx || (hoverIndex === null && idx === points.length - 1);
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
              >
                {/* Invisible larger hover hitbox */}
                <circle cx={p.x} cy={p.y} r={18} fill="transparent" />

                {/* Point ring */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-ping"
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={isHovered ? '#ffffff' : '#fbbf24'}
                  stroke="#12141d"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Frosted Glass Tooltip on Active Node */}
        {activeHoverPoint && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-200 z-30"
            style={{
              left: `${(activeHoverPoint.x / width) * 100}%`,
              top: `${(activeHoverPoint.y / height) * 100}%`,
              marginTop: '-12px',
            }}
          >
            <div className="glass-bubble px-3 py-2 rounded-2xl shadow-2xl text-center border border-white/40 backdrop-blur-xl whitespace-nowrap">
              <span className="text-[10px] text-white/60 font-mono block">
                {activeHoverPoint.date}
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                ${activeHoverPoint.value.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom X-Axis Labels */}
      <div className="flex justify-between items-center px-4 pt-2 text-[11px] font-mono text-white/50 border-t border-white/5 mt-2">
        {points.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setHoverIndex(idx)}
            className={`transition-colors ${
              hoverIndex === idx ? 'text-amber-300 font-bold' : 'hover:text-white'
            }`}
          >
            {p.date}
          </button>
        ))}
      </div>
    </div>
  );
};
