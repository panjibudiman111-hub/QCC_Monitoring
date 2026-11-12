import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';
import { Activity, FileText } from 'lucide-react';
import { QCCGroup } from '../types/qcc';

interface ProgressChartsProps {
  groups: QCCGroup[];
  onSelectGroup?: (group: QCCGroup) => void;
}

// Custom Tooltip Component for Dark Mode
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    return (
      <div className="bg-[#090E17] border border-[#1E293B] p-2.5 rounded-lg shadow-xl text-xs z-50">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-white">{data.name}</span>
          <span className="text-slate-400 font-mono text-[11px]">({data.code})</span>
        </div>
        <div className="text-slate-300">
          Progres: <span className="font-bold text-white font-mono">{value}%</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate">
          {data.line}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Label for Vertical Bar (Crisp white percentage above bar)
const renderCustomVerticalBarLabel = (props: any) => {
  const { x, y, width, value } = props;
  if (x === undefined || y === undefined || width === undefined) return null;
  return (
    <text
      x={x + width / 2}
      y={Math.max(y - 6, 14)}
      fill="#FFFFFF"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fontFamily="JetBrains Mono, monospace"
    >
      {value ?? 0}%
    </text>
  );
};

// Custom Label for Horizontal Bar (Crisp white percentage to the right of bar)
const renderCustomHorizontalBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  if (x === undefined || y === undefined || width === undefined || height === undefined) return null;
  return (
    <text
      x={x + width + 8}
      y={y + height / 2 + 4}
      fill="#FFFFFF"
      textAnchor="start"
      fontSize="11"
      fontWeight="700"
      fontFamily="JetBrains Mono, monospace"
    >
      {value ?? 0}%
    </text>
  );
};

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  groups,
  onSelectGroup,
}) => {
  // Data formatted for vertical bar chart
  const stepChartData = groups.map((g) => ({
    id: g.id,
    code: g.code,
    name: g.name,
    line: g.line,
    color: g.color,
    value: g.stepProgress,
    group: g,
  }));

  // Data formatted for horizontal bar chart (Top to bottom as ordered: BLUESMI down to Group 8)
  const makalahChartData = [...groups].reverse().map((g) => ({
    id: g.id,
    code: g.code,
    name: g.name,
    line: g.line,
    color: g.color,
    value: g.makalahProgress,
    group: g,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Left Card: Vertical Bar Chart ("Progress 8 Step per Group") */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-[12px] p-5 sm:p-6 flex flex-col justify-between shadow-xs">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
              PERBANDINGAN • 8 STEP
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Progress 8 Step per Group
            </h2>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#111927] border border-[#1E293B] flex items-center justify-center shrink-0 text-[#64748B]">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-[280px] sm:h-[300px] w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={260}>
            <BarChart
              data={stepChartData}
              margin={{ top: 25, right: 10, left: -15, bottom: 25 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#1E293B"
                opacity={0.8}
              />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: '#1E293B' }}
                tickLine={false}
                tick={{
                  fill: '#94A3B8',
                  fontSize: 11,
                  fontWeight: 500,
                }}
                interval={0}
                angle={-22}
                textAnchor="end"
                height={40}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={{ stroke: '#1E293B' }}
                tickLine={false}
                tick={{
                  fill: '#94A3B8',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
                isAnimationActive={false}
                onClick={(entry: any) => {
                  if (onSelectGroup && entry.group) {
                    onSelectGroup(entry.group);
                  }
                }}
                className="cursor-pointer transition-opacity hover:opacity-85"
              >
                {stepChartData.map((entry) => (
                  <Cell key={`cell-step-${entry.id}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" content={renderCustomVerticalBarLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Helper Note */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]/60 text-[11px] text-[#94A3B8]">
          <span>Skala Capaian Tahapan QCC</span>
          <span className="text-slate-400">Klik bar untuk melihat rincian</span>
        </div>
      </div>

      {/* 2. Right Card: Horizontal Bar Chart ("Progress Penyelesaian Makalah") */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-[12px] p-5 sm:p-6 flex flex-col justify-between shadow-xs">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
              PERBANDINGAN • MAKALAH
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Progress Penyelesaian Makalah
            </h2>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#111927] border border-[#1E293B] flex items-center justify-center shrink-0 text-[#64748B]">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-[280px] sm:h-[300px] w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={260}>
            <BarChart
              data={makalahChartData}
              layout="vertical"
              margin={{ top: 10, right: 35, left: 20, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#1E293B"
                opacity={0.8}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={{ stroke: '#1E293B' }}
                tickLine={false}
                tick={{
                  fill: '#94A3B8',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                unit="%"
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={{ stroke: '#1E293B' }}
                tickLine={false}
                tick={{
                  fill: '#CBD5E1',
                  fontSize: 11,
                  fontWeight: 600,
                }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
                maxBarSize={18}
                isAnimationActive={false}
                onClick={(entry: any) => {
                  if (onSelectGroup && entry.group) {
                    onSelectGroup(entry.group);
                  }
                }}
                className="cursor-pointer transition-opacity hover:opacity-85"
              >
                {makalahChartData.map((entry) => (
                  <Cell key={`cell-makalah-${entry.id}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" content={renderCustomHorizontalBarLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Helper Note */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]/60 text-[11px] text-[#94A3B8]">
          <span>Risalah QCC Bab I – Bab VIII</span>
          <span className="text-slate-400">Target submit: 15 Des 2026</span>
        </div>
      </div>
    </div>
  );
};
