import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Flag, Clock } from 'lucide-react';
import { AgendaItem, QCCGroup } from '../types/qcc';

interface KalenderBulananViewProps {
  agendas: AgendaItem[];
  groups: QCCGroup[];
}

export const KalenderBulananView: React.FC<KalenderBulananViewProps> = ({ agendas, groups }) => {
  const [currentMonth, setCurrentMonth] = useState('November 2026');

  // Days in November 2026 (Starts on Sunday Nov 1)
  const daysInNov = Array.from({ length: 30 }, (_, i) => i + 1);

  // Key Milestones
  const milestones: { [day: number]: { label: string; color: string } } = {
    5: { label: 'Audit Step 1 Selesai', color: 'bg-emerald-600' },
    14: { label: 'Meeting BLUESMI (Fishbone)', color: 'bg-blue-600' },
    15: { label: 'Gemba Walk HEXAGONAL', color: 'bg-emerald-600' },
    16: { label: 'Konsultasi QCC ABS', color: 'bg-amber-600' },
    17: { label: 'Data Cycle Time Group 4', color: 'bg-red-600' },
    18: { label: 'Review Group 5', color: 'bg-purple-600' },
    25: { label: 'Presentasi Progres Tahap 1', color: 'bg-orange-500' },
    30: { label: 'Review Mid-Term QA', color: 'bg-indigo-600' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
            KALENDER BULANAN
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Jadwal Siklus QCC — {currentMonth}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pemantauan timeline penyelesaian 8 Step & batas pengumpulan berkas risalah.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <div className="flex items-center bg-[#0D131F] border border-[#1E293B] rounded-lg p-1">
            <button
              onClick={() => setCurrentMonth(currentMonth === 'November 2026' ? 'Oktober 2026' : 'November 2026')}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-white">{currentMonth}</span>
            <button
              onClick={() => setCurrentMonth(currentMonth === 'November 2026' ? 'Desember 2026' : 'November 2026')}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl overflow-hidden shadow-xs">
        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-[#1E293B] bg-[#0A0F1A]/80 text-center text-xs font-semibold text-[#94A3B8] py-2.5">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#1E293B]/60 text-xs">
          {daysInNov.map((day) => {
            const milestone = milestones[day];
            const isToday = day === 12;

            return (
              <div
                key={day}
                className={`min-h-[90px] p-2 flex flex-col justify-between transition-colors ${
                  isToday ? 'bg-blue-950/20' : 'hover:bg-[#111928]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-wider">
                      Hari Ini
                    </span>
                  )}
                </div>

                {milestone ? (
                  <div
                    className={`${milestone.color} text-white rounded p-1 text-[10px] font-medium leading-tight mt-1 truncate shadow-xs`}
                    title={milestone.label}
                  >
                    {milestone.label}
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
