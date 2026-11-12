import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  CircleDashed,
  User,
  Users,
  MapPin,
  FileText,
  Calendar,
  Save,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { QCCGroup, StepStatus } from '../types/qcc';

interface GroupDetailDrawerProps {
  group: QCCGroup;
  onClose: () => void;
  onUpdateGroup: (updatedGroup: QCCGroup) => void;
}

export const GroupDetailDrawer: React.FC<GroupDetailDrawerProps> = ({
  group,
  onClose,
  onUpdateGroup,
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'makalah' | 'info'>('steps');
  const [editableGroup, setEditableGroup] = useState<QCCGroup>(() => JSON.parse(JSON.stringify(group)));
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Synchronize if group changes externally
  useEffect(() => {
    setEditableGroup(JSON.parse(JSON.stringify(group)));
  }, [group]);

  // Handle toggling step status
  const handleToggleStepStatus = (stepIndex: number, newStatus: StepStatus) => {
    const updatedSteps = [...editableGroup.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      status: newStatus,
      completionDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    };

    // Recalculate completed count and progress percentage
    const completedCount = updatedSteps.filter((s) => s.status === 'completed').length;
    const inProgressCount = updatedSteps.filter((s) => s.status === 'in_progress').length;

    // Standard formula: completed = 12.5% each (100 / 8), in_progress adds ~6% partial credit
    const computedProgress = Math.min(
      100,
      Math.round((completedCount / 8) * 100 + inProgressCount * 6)
    );

    const updated = {
      ...editableGroup,
      steps: updatedSteps,
      stepsCompleted: completedCount,
      stepProgress: computedProgress,
    };

    setEditableGroup(updated);
  };

  // Handle updating Makalah progress
  const handleMakalahSlider = (newProgress: number) => {
    const updated = {
      ...editableGroup,
      makalahProgress: newProgress,
    };
    setEditableGroup(updated);
  };

  // Handle updating Theme text
  const handleThemeChange = (newTheme: string) => {
    setEditableGroup({
      ...editableGroup,
      theme: newTheme,
      fullTheme: newTheme,
    });
  };

  // Save changes back to parent & localStorage
  const handleSaveAll = () => {
    onUpdateGroup(editableGroup);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#0A101E] border-l border-[#1E293B] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#1E293B] bg-[#070C16] shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0"
                style={{ backgroundColor: editableGroup.color }}
              >
                {editableGroup.code}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {editableGroup.name}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#131D2E] text-blue-300 border border-blue-900/40">
                    {editableGroup.line}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editableGroup.department} • Leader: {editableGroup.leader}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
              aria-label="Tutup panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1E293B]/70">
            <div className="bg-[#0D1424] border border-[#1E293B] p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#94A3B8] tracking-wider uppercase">
                  PROGRESS 8 STEP
                </span>
                <div className="text-xl font-bold text-white font-mono mt-0.5">
                  {editableGroup.stepProgress}%
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2 py-1 rounded-md">
                {editableGroup.stepsCompleted}/8 Selesai
              </span>
            </div>

            <div className="bg-[#0D1424] border border-[#1E293B] p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#94A3B8] tracking-wider uppercase">
                  PROGRESS MAKALAH
                </span>
                <div className="text-xl font-bold text-white font-mono mt-0.5">
                  {editableGroup.makalahProgress}%
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-400 font-mono bg-blue-950/60 border border-blue-800/40 px-2 py-1 rounded-md">
                Bab I - VIII
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('steps')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors text-center ${
                activeTab === 'steps'
                  ? 'bg-[#172554] text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1729]'
              }`}
            >
              Checklist 8-Step PDCA
            </button>
            <button
              onClick={() => setActiveTab('makalah')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors text-center ${
                activeTab === 'makalah'
                  ? 'bg-[#172554] text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1729]'
              }`}
            >
              Naskah Makalah
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors text-center ${
                activeTab === 'info'
                  ? 'bg-[#172554] text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1729]'
              }`}
            >
              Info & Tema
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: 8-STEP PDCA CHECKLIST */}
          {activeTab === 'steps' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Daftar Tahapan Metodologi QCC (PDCA)</span>
                <span className="text-[11px] text-emerald-400">Pilih status per tahapan</span>
              </div>

              {editableGroup.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-[#091515] border-emerald-900/50'
                        : isInProgress
                        ? 'bg-[#181308] border-amber-900/50'
                        : 'bg-[#0D131F] border-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Step Number Badge */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isInProgress
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {step.stepNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              {step.category} • Step {step.stepNumber}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white mt-0.5 leading-snug">
                            {step.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                            <span>PIC: <strong className="text-slate-300 font-normal">{step.pic}</strong></span>
                            {step.targetDate && (
                              <span>Target: <span className="font-mono text-slate-400">{step.targetDate}</span></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Switcher Buttons */}
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Status:</span>

                      <button
                        onClick={() => handleToggleStepStatus(idx, 'completed')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                            : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesai</span>
                      </button>

                      <button
                        onClick={() => handleToggleStepStatus(idx, 'in_progress')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          isInProgress
                            ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                            : 'bg-slate-800/80 text-slate-400 hover:text-amber-300'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>Berjalan</span>
                      </button>

                      <button
                        onClick={() => handleToggleStepStatus(idx, 'not_started')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                          !isCompleted && !isInProgress
                            ? 'bg-slate-700 text-white font-semibold'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <CircleDashed className="w-3 h-3" />
                        <span>Belum Mulai</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: PROGRESS MAKALAH */}
          {activeTab === 'makalah' && (
            <div className="space-y-5">
              <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Penyelesaian Makalah / Naskah
                  </label>
                  <span className="text-base font-bold text-blue-400 font-mono">
                    {editableGroup.makalahProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={editableGroup.makalahProgress}
                  onChange={(e) => handleMakalahSlider(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-[#1E293B] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0% (Drafting Awal)</span>
                  <span>50% (Bab IV Penanggulangan)</span>
                  <span>100% (Final Siap Cetak)</span>
                </div>
              </div>

              {/* Chapter Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Struktur Bab Makalah Risalah
                </h4>
                {editableGroup.makalahSections.map((sec) => (
                  <div
                    key={sec.chapter}
                    className="p-3 rounded-lg bg-[#0D131F] border border-[#1E293B] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-xs font-medium text-slate-200 block">
                          {sec.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sec.chapter === 1 && editableGroup.makalahProgress > 0
                            ? 'Naskah terverifikasi fasilitator'
                            : 'Belum diunggah'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        editableGroup.makalahProgress >= sec.chapter * 12
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {editableGroup.makalahProgress >= sec.chapter * 12 ? 'Selesai' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INFO & TEMA */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tema QCC (Judul Proyek Kaizen)
                </label>
                <textarea
                  rows={3}
                  value={editableGroup.fullTheme || editableGroup.theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="w-full bg-[#0D131F] border border-[#1E293B] rounded-lg p-3 text-sm text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0D131F] border border-[#1E293B]">
                  <span className="text-slate-400 block mb-1">Fasilitator QCC</span>
                  <span className="font-semibold text-white">{editableGroup.facilitator}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D131F] border border-[#1E293B]">
                  <span className="text-slate-400 block mb-1">Jumlah Anggota</span>
                  <span className="font-semibold text-white">{editableGroup.memberCount} Personel</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D131F] border border-[#1E293B]">
                  <span className="text-slate-400 block mb-1">Area Kerja</span>
                  <span className="font-semibold text-white">{editableGroup.line}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D131F] border border-[#1E293B]">
                  <span className="text-slate-400 block mb-1">Departemen</span>
                  <span className="font-semibold text-white">{editableGroup.department}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#1E293B] bg-[#070C16] flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs">
            {isSavedNotice ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Perubahan berhasil disimpan!
              </span>
            ) : (
              <span className="text-slate-400">
                Pembaruan akan langsung ter-update di dashboard.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0D131F] border border-[#1E293B] hover:border-slate-600 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
