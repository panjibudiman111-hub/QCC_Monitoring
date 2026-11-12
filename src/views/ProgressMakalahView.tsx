import React from 'react';
import { FileText, CheckCircle2, Clock, Upload, Download, Eye, Award } from 'lucide-react';
import { QCCGroup } from '../types/qcc';

interface ProgressMakalahViewProps {
  groups: QCCGroup[];
  onSelectGroup: (group: QCCGroup) => void;
}

export const ProgressMakalahView: React.FC<ProgressMakalahViewProps> = ({
  groups,
  onSelectGroup,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
            DOKUMEN & RISALAH QCC
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Progress Penyelesaian Makalah
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Status penyusunan berkas naskah risalah Bab I – Bab VIII untuk sertifikasi Tahap 1.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <div className="px-3 py-1.5 rounded-lg bg-[#0D131F] border border-[#1E293B] text-xs text-slate-300">
            Batas Pengumpulan: <strong className="text-orange-400">15 Desember 2026</strong>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((group) => {
          const isStarted = group.makalahProgress > 0;
          return (
            <div
              key={group.id}
              className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between hover:border-[#334155] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-[6px] text-white font-bold text-xs flex items-center justify-center"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.code}
                    </span>
                    <span className="font-bold text-white text-sm">{group.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isStarted
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-800/50'
                        : 'bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    {isStarted ? 'Drafting' : 'Belum Mulai'}
                  </span>
                </div>

                <p className="text-xs text-[#CBD5E1] line-clamp-2 min-h-[32px] mb-4">
                  {group.theme}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Capaian Naskah:</span>
                    <span className="font-mono font-bold text-blue-400">{group.makalahProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E293B] overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${group.makalahProgress}%` }}
                    />
                  </div>
                </div>

                {/* Chapter breakdown preview */}
                <div className="text-[11px] text-slate-400 space-y-1 border-t border-[#1E293B]/70 pt-3">
                  <div className="flex justify-between">
                    <span>Bab I (Tema & Target):</span>
                    <span className={group.makalahProgress >= 12 ? 'text-emerald-400' : 'text-slate-500'}>
                      {group.makalahProgress >= 12 ? 'Lengkap' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bab II - IV (Analisa):</span>
                    <span className="text-slate-500">
                      {group.makalahProgress >= 40 ? 'Lengkap' : 'Menunggu'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectGroup(group)}
                className="w-full mt-4 py-2 rounded-lg bg-[#111A2C] hover:bg-[#182640] border border-blue-900/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Buka Editor Risalah</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
