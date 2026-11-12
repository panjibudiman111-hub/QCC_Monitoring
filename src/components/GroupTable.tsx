import React from 'react';
import { ExternalLink, ChevronRight, HelpCircle } from 'lucide-react';
import { QCCGroup } from '../types/qcc';

interface GroupTableProps {
  groups: QCCGroup[];
  onSelectGroup: (group: QCCGroup) => void;
}

export const GroupTable: React.FC<GroupTableProps> = ({ groups, onSelectGroup }) => {
  return (
    <div className="bg-[#0D131F] border border-[#1E293B] rounded-[12px] overflow-hidden shadow-xs">
      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
            TABEL • RINGKASAN GROUP
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Perbandingan per Group
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Klik baris untuk melihat checklist 8-Step & edit risalah</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-[#1E293B] text-[11px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8] bg-[#0A0F1A]/70">
              <th className="py-3 px-5 w-[20%]">Group</th>
              <th className="py-3 px-5 w-[35%]">Tema</th>
              <th className="py-3 px-5 w-[13%]">Step Selesai</th>
              <th className="py-3 px-5 w-[16%]">Progress Step</th>
              <th className="py-3 px-5 w-[16%]">Progress Makalah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60 text-sm">
            {groups.map((group) => {
              return (
                <tr
                  key={group.id}
                  onClick={() => onSelectGroup(group)}
                  className="group hover:bg-[#131D2E] cursor-pointer transition-colors"
                >
                  {/* Column 1: Group (20%) */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {/* Colored rounded square badge 24x24px, 6px radius */}
                      <div
                        className="w-6 h-6 rounded-[6px] flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.code}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {group.name}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {group.line}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Tema (35%) */}
                  <td className="py-3.5 px-5">
                    <div className="relative group/tooltip max-w-[320px] lg:max-w-[420px]">
                      <p
                        className="text-[#CBD5E1] text-xs sm:text-sm truncate"
                        title={group.fullTheme || group.theme}
                      >
                        {group.theme}
                      </p>

                      {/* Tooltip on hover */}
                      <div className="absolute left-0 bottom-full mb-1 hidden group-hover/tooltip:block z-30 w-72 p-2 bg-[#05080E] border border-[#1E293B] rounded-md shadow-2xl text-[11px] text-slate-200 pointer-events-none">
                        <span className="font-semibold text-orange-400 block mb-0.5">Tema Lengkap:</span>
                        {group.fullTheme || group.theme}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Step Selesai (13%) */}
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-white text-sm font-mono tabular-nums">
                      {group.stepsCompleted}/8
                    </span>
                  </td>

                  {/* Column 4: Progress Step (16%) */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {/* Horizontal pill progress bar (6px height, #1E293B track, emerald green #10B981) */}
                      <div className="flex-1 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#10B981] transition-all duration-300"
                          style={{ width: `${Math.min(group.stepProgress, 100)}%` }}
                        />
                      </div>
                      {/* Muted gray percentage on the right */}
                      <span className="text-xs text-[#94A3B8] font-mono tabular-nums w-8 text-right font-medium">
                        {group.stepProgress}%
                      </span>
                    </div>
                  </td>

                  {/* Column 5: Progress Makalah (16%) */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {/* Horizontal pill progress bar (6px height, #1E293B track, royal blue fill #3B82F6) */}
                      <div className="flex-1 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#3B82F6] transition-all duration-300"
                          style={{ width: `${Math.min(group.makalahProgress, 100)}%` }}
                        />
                      </div>
                      {/* Muted gray percentage on the right */}
                      <span className="text-xs text-[#94A3B8] font-mono tabular-nums w-8 text-right font-medium">
                        {group.makalahProgress}%
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
