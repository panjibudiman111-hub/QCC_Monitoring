import React, { useState } from 'react';
import { Key, RotateCcw, Download, Shield, Save, CheckCircle2, Building, User, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface PengaturanAkunViewProps {
  onResetData: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  sheetUrl?: string;
  onUpdateSheetUrl?: (url: string) => void;
  onOpenSheetModal?: () => void;
  isLive?: boolean;
}

export const PengaturanAkunView: React.FC<PengaturanAkunViewProps> = ({
  onResetData,
  onExportCsv,
  onExportJson,
  sheetUrl,
  onUpdateSheetUrl,
  onOpenSheetModal,
  isLive,
}) => {
  const [userName, setUserName] = useState('Panji Budiman');
  const [userRole, setUserRole] = useState('Quality Assurance & QCC Steering Committee');
  const [companyName, setCompanyName] = useState('PT. Sentral Multi Indotama (SMI)');
  const [plantLocation, setPlantLocation] = useState('Plant Cikarang - Jawa Barat');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]">
        <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
          PENGATURAN SISTEM & PROFIL
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">
          Pengaturan Akun & Data QCC
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Konfigurasi akun pengawas mutu, preferensi tampilan, serta sinkronisasi database monitoring.
        </p>
      </div>

      {/* Google Sheets Live Data Source Section */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Sumber Data Google Sheets (Live CSV)</span>
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
            }`}
          >
            {isLive ? '● Terhubung ke Google Sheet' : '○ Menggunakan Benchmark Data SMI'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Data QCC dashboard dapat disinkronkan secara otomatis setiap 60 detik dari Google Sheets yang dipublikasikan ke format CSV.
        </p>

        <div className="p-3.5 bg-[#080C14] border border-[#1E293B] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">
              URL Google Sheets CSV Saat Ini:
            </span>
            <p className="font-mono text-slate-300 truncate mt-0.5 text-[11px]">
              {sheetUrl || 'YOUR_PUBLISHED_CSV_URL_HERE'}
            </p>
          </div>
          {onOpenSheetModal && (
            <button
              onClick={onOpenSheetModal}
              className="px-3.5 py-2 rounded-lg bg-[#142036] hover:bg-[#1a2b4a] border border-blue-800/50 text-blue-300 font-semibold transition-colors shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Kelola Koneksi CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Profil Pengguna & Penanggung Jawab Mutu</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Jabatan / Peran QCC</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nama Perusahaan</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lokasi Plant / Pabrik</label>
              <input
                type="text"
                value={plantLocation}
                onChange={(e) => setPlantLocation(e.target.value)}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
            {savedSuccess ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Pengaturan profil berhasil disimpan
              </span>
            ) : (
              <span className="text-slate-400">
                Data profil tersimpan pada sesi peramban ini.
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Management Section */}
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Pengelolaan Data & Backup</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Unduh salinan berkas pelaporan QCC atau kembalikan seluruh metrik 8 group ke nilai awal benchmark PT. Sentral Multi Indotama.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onExportCsv}
            className="p-4 rounded-xl bg-[#080C14] border border-[#1E293B] hover:border-slate-600 transition-colors flex flex-col items-center justify-center text-center group"
          >
            <Download className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-white">Unduh Berkas CSV</span>
            <span className="text-[10px] text-slate-400 mt-1">Data 8 Group & Metrik</span>
          </button>

          <button
            onClick={onExportJson}
            className="p-4 rounded-xl bg-[#080C14] border border-[#1E293B] hover:border-slate-600 transition-colors flex flex-col items-center justify-center text-center group"
          >
            <Download className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-white">Cadangkan JSON</span>
            <span className="text-[10px] text-slate-400 mt-1">Struktur lengkap database</span>
          </button>

          <button
            onClick={onResetData}
            className="p-4 rounded-xl bg-[#1A0F0F] border border-red-900/40 hover:border-red-700/60 transition-colors flex flex-col items-center justify-center text-center group"
          >
            <RotateCcw className="w-5 h-5 text-red-400 mb-2 group-hover:-rotate-90 transition-transform" />
            <span className="text-xs font-semibold text-red-300">Reset Benchmark SMI</span>
            <span className="text-[10px] text-red-400/80 mt-1">Kembali ke nilai awal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
