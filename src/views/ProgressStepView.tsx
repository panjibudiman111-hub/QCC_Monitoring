import React from 'react';
import { CheckCircle2, Clock, CircleDashed, ListChecks, HelpCircle } from 'lucide-react';
import { QCCGroup } from '../types/qcc';

interface ProgressStepViewProps {
  groups: QCCGroup[];
  onSelectGroup: (group: QCCGroup) => void;
}

const PDCA_STEPS = [
  '1. Tema & Sasaran',
  '2. Target Situasi',
  '3. Analisa Sebab',
  '4. Rencana Tindakan',
  '5. Pelaksanaan',
  '6. Evaluasi Hasil',
  '7. Standarisasi',
  '8. Kesimpulan',
];

export const ProgressStepView: React.FC<ProgressStepViewProps> = ({
  groups,
  onSelectGroup,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
            MATRIKS 8 STEP PDCA
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Status Eksekusi 8 Langkah QCC
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Matriks pemetaan perkembangan tiap tahapan pemecahan masalah mutu (P-D-C-A) untuk 8 group.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs bg-[#0D131F] border border-[#1E293B] px-3.5 py-2 rounded-lg self-start">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Berjalan</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <CircleDashed className="w-3.5 h-3.5" />
            <span>Belum Mulai</span>
          </div>
        </div>
      </div>

      {/* Grid Matrix Table */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-[12px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0F1A]/80 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                <th className="py-3 px-4 w-[180px] sticky left-0 bg-[#0A0F1A] z-10">Group QCC</th>
                {PDCA_STEPS.map((step, idx) => (
                  <th key={idx} className="py-3 px-2.5 text-center text-[10px]">
                    {step}
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-xs">
              {groups.map((group) => (
                <tr
                  key={group.id}
                  onClick={() => onSelectGroup(group)}
                  className="hover:bg-[#131D2E] cursor-pointer transition-colors"
                >
                  {/* Group Column (Sticky left) */}
                  <td className="py-3 px-4 sticky left-0 bg-[#0D131F] group-hover:bg-[#131D2E] z-10 border-r border-[#1E293B]/60">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-[6px] flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.code}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{group.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{group.line}</span>
                      </div>
                    </div>
                  </td>

                  {/* 8 Step Matrix Cells */}
                  {group.steps.map((step) => {
                    const isDone = step.status === 'completed';
                    const isInProg = step.status === 'in_progress';

                    return (
                      <td key={step.stepNumber} className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          {isDone ? (
                            <span
                              className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-center text-emerald-400"
                              title={`Step ${step.stepNumber}: Selesai`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          ) : isInProg ? (
                            <span
                              className="w-7 h-7 rounded-lg bg-amber-950/70 border border-amber-600/50 flex items-center justify-center text-amber-400"
                              title={`Step ${step.stepNumber}: Sedang Berjalan`}
                            >
                              <Clock className="w-4 h-4" />
                            </span>
                          ) : (
                            <span
                              className="w-7 h-7 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center text-slate-600"
                              title={`Step ${step.stepNumber}: Belum Mulai`}
                            >
                              <CircleDashed className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Total Progress */}
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-white font-mono text-xs">
                      {group.stepsCompleted}/8
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono ml-2">
                      ({group.stepProgress}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
