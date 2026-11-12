import React from 'react';
import { Users, User, MapPin, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { QCCGroup } from '../types/qcc';

interface BiodataGroupViewProps {
  groups: QCCGroup[];
  onSelectGroup: (group: QCCGroup) => void;
}

export const BiodataGroupView: React.FC<BiodataGroupViewProps> = ({
  groups,
  onSelectGroup,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]">
        <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
          STRUKTUR ORGANISASI CIRCLE
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">
          Biodata 8 Group QCC
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Profil lengkap gugus kendali mutu, susunan kepengurusan circle, serta lini produksi PT. Sentral Multi Indotama.
        </p>
      </div>

      {/* 8 Groups Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((group) => {
          return (
            <div
              key={group.id}
              className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between hover:border-[#334155] transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.code}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{group.name}</h3>
                      <span className="text-[11px] text-slate-400">{group.department}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#141E30] text-blue-300 border border-blue-900/40">
                    {group.stepsCompleted}/8 Selesai
                  </span>
                </div>

                {/* Theme Box */}
                <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3 my-3">
                  <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider block mb-1">
                    Tema QCC:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {group.fullTheme || group.theme}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 my-3">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">Circle Leader</span>
                    <span className="text-white font-medium">{group.leader}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">Fasilitator</span>
                    <span className="text-white font-medium">{group.facilitator}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">Lini Kerja</span>
                    <span className="text-white font-medium">{group.line}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">Jumlah Anggota</span>
                    <span className="text-white font-medium">{group.memberCount} Personel</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-3 border-t border-[#1E293B]/70 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Step: <strong className="text-emerald-400">{group.stepProgress}%</strong></span>
                  <span className="text-slate-400">Makalah: <strong className="text-blue-400">{group.makalahProgress}%</strong></span>
                </div>
                <button
                  onClick={() => onSelectGroup(group)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>Detail & Edit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
