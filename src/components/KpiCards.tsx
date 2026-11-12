import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileBarChart2 } from 'lucide-react';
import { QCCGroup } from '../types/qcc';

interface KpiCardsProps {
  groups: QCCGroup[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ groups }) => {
  // Compute dynamically from current groups data
  const totalCompletedSteps = groups.reduce((acc, g) => acc + g.stepsCompleted, 0);
  const totalSteps = groups.length * 8; // 8 * 8 = 64

  const totalInProgressSteps = groups.reduce((acc, g) => {
    return acc + g.steps.filter((s) => s.status === 'in_progress').length;
  }, 0);

  const totalNotStartedSteps = groups.reduce((acc, g) => {
    return acc + g.steps.filter((s) => s.status === 'not_started').length;
  }, 0);

  const avgMakalah = Math.round(
    groups.reduce((acc, g) => acc + g.makalahProgress, 0) / (groups.length || 1)
  );

  const cards = [
    {
      id: 'step-selesai',
      label: 'STEP SELESAI',
      value: `${totalCompletedSteps}/${totalSteps}`,
      subLabel: `${Math.round((totalCompletedSteps / totalSteps) * 100)}% dari total target`,
      iconBadgeBg: 'bg-[#064E3B]/30 border border-[#10B981]/20',
      iconColor: 'text-[#10B981]',
      icon: CheckCircle2,
    },
    {
      id: 'step-berjalan',
      label: 'STEP BERJALAN',
      value: `${totalInProgressSteps}`,
      subLabel: 'Sedang dalam eksekusi',
      iconBadgeBg: 'bg-[#78350F]/30 border border-[#F59E0B]/20',
      iconColor: 'text-[#F59E0B]',
      icon: Clock,
    },
    {
      id: 'step-belum-mulai',
      label: 'STEP BELUM MULAI',
      value: `${totalNotStartedSteps}`,
      subLabel: 'Menunggu tahapan sebelumnya',
      iconBadgeBg: 'bg-[#7F1D1D]/30 border border-[#EF4444]/20',
      iconColor: 'text-[#EF4444]',
      icon: AlertCircle,
    },
    {
      id: 'rata-rata-makalah',
      label: 'RATA-RATA MAKALAH',
      value: `${avgMakalah}%`,
      subLabel: 'Penyelesaian naskah risalah',
      iconBadgeBg: 'bg-[#1E3A8A]/30 border border-[#3B82F6]/20',
      iconColor: 'text-[#3B82F6]',
      icon: FileBarChart2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-[#0D131F] border border-[#1E293B] rounded-[12px] p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#334155] shadow-xs"
          >
            {/* Top row: Label + Rounded square badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
                {card.label}
              </span>
              <div
                className={`w-9 h-9 rounded-lg ${card.iconBadgeBg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            {/* Bottom row: Large bold white metric value */}
            <div className="mt-4">
              <div className="text-3xl sm:text-[34px] font-bold text-white tracking-tight font-mono tabular-nums">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {card.subLabel}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
