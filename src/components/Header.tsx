import React from 'react';
import { Menu, RotateCcw, Download, Filter, RefreshCw, CheckCircle2, FileSpreadsheet, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  filterText: string;
  onFilterChange: (val: string) => void;
  onExportCsv?: () => void;
  onResetData?: () => void;
  isModified?: boolean;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  lastSyncedTime?: string;
  isLiveSheet?: boolean;
  sheetError?: string;
  onOpenSheetConfig?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  filterText,
  onFilterChange,
  onExportCsv,
  onResetData,
  isModified,
  onRefreshData,
  isRefreshing,
  lastSyncedTime,
  isLiveSheet,
  sheetError,
  onOpenSheetConfig,
}) => {
  return (
    <header className="pt-6 sm:pt-8 pb-5">
      {/* Mobile Top Bar with Hamburger */}
      <div className="flex items-center justify-between pb-4 lg:hidden border-b border-[#1E293B] mb-5">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0D131F] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          PT. Sentral Multi Indotama
        </span>
        <div className="w-6" />
      </div>

      {/* Main Title & Live Sync Controls Block */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Target/Radar Icon with Magnifying Glass Overlay in Red, Orange, Amber gradient */}
          <div className="relative shrink-0 mt-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 p-[1.5px] shadow-lg shadow-orange-500/10">
              <div className="w-full h-full rounded-2xl bg-[#090D17] flex items-center justify-center relative overflow-hidden">
                {/* Radar Concentric Rings */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-11 h-11 rounded-full border border-orange-400/50" />
                  <div className="absolute w-7 h-7 rounded-full border border-orange-400/60" />
                  <div className="absolute w-3 h-3 rounded-full bg-orange-400/40" />
                  <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
                  <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-orange-400/40 to-transparent" />
                </div>

                {/* SVG Target & Magnifying Glass Overlay */}
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 relative z-10"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="11" stroke="url(#paint0_linear)" strokeWidth="2.2" />
                  <circle cx="16" cy="16" r="6.5" stroke="url(#paint1_linear)" strokeWidth="1.8" />
                  <circle cx="16" cy="16" r="2.2" fill="#F97316" />
                  <circle cx="21" cy="21" r="5" stroke="#FFFFFF" strokeWidth="2" fill="#0D131F" fillOpacity="0.4" />
                  <path d="M25 25L30 30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

                  <defs>
                    <linearGradient id="paint0_linear" x1="5" y1="5" x2="27" y2="27" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#EF4444" />
                      <stop offset="0.5" stopColor="#F97316" />
                      <stop offset="1" stopColor="#FBBF24" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="9.5" y1="9.5" x2="22.5" y2="22.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F87171" />
                      <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight">
              Dashboard Progress QCC
            </h1>
            <p className="text-sm sm:text-base font-medium text-[#F97316] mt-0.5 tracking-normal">
              Quality Control Circle
            </p>
          </div>
        </div>

        {/* Top-Right Corner Controls: Live Sync Indicator, Refresh Button & Filters */}
        <div className="flex flex-col items-start lg:items-end gap-2.5">
          {/* Top-right Live Sync Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Data Badge */}
            <button
              onClick={onOpenSheetConfig}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                isLiveSheet
                  ? 'bg-emerald-950/70 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-[#111927] border-[#1E293B] text-slate-300 hover:border-slate-600'
              }`}
              title="Klik untuk mengatur URL Google Sheets CSV"
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${isLiveSheet ? 'text-emerald-400' : 'text-blue-400'}`} />
              <span>{isLiveSheet ? 'Google Sheets Live' : 'Google Sheets Sync'}</span>
            </button>

            {/* Last Synced: [Time] indicator */}
            {lastSyncedTime && (
              <span className="text-[11px] text-[#94A3B8] font-mono tabular-nums bg-[#0D131F] border border-[#1E293B] px-2.5 py-1 rounded-md">
                Last Synced: <strong className="text-slate-200 font-normal">{lastSyncedTime}</strong>
              </span>
            )}

            {/* Subtle Refresh Data Button */}
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0D131F] border border-[#1E293B] text-[11px] font-medium text-slate-200 hover:text-white hover:border-blue-500 hover:bg-[#131D2E] transition-all disabled:opacity-50"
                title="Sinkronkan data sekarang (Polling otomatis setiap 60 detik)"
              >
                <RefreshCw className={`w-3 h-3 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
              </button>
            )}
          </div>

          {/* Secondary Controls: Search, Export CSV, Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search/Filter Input */}
            <div className="relative">
              <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Filter group / tema..."
                className="bg-[#0D131F] border border-[#1E293B] rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors w-40 sm:w-44"
              />
            </div>

            {/* Export CSV */}
            {onExportCsv && (
              <button
                onClick={onExportCsv}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D131F] border border-[#1E293B] text-[11px] font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                title="Unduh Data CSV"
              >
                <Download className="w-3 h-3 text-slate-400" />
                <span>Export CSV</span>
              </button>
            )}

            {/* Reset Benchmark */}
            {isModified && onResetData && (
              <button
                onClick={onResetData}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/60 text-[11px] font-medium text-amber-300 hover:bg-amber-900/50 transition-colors"
                title="Kembalikan data ke nilai awal benchmark SMI"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description Line & Sheet Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-3 text-xs sm:text-sm text-[#94A3B8]">
        <p>
          Perbandingan progress 8 group QCC — 8 Step dan penyelesaian makalah.
        </p>

        {sheetError && (
          <span className="text-[11px] text-amber-400 font-medium">
            * {sheetError}
          </span>
        )}
      </div>

      {/* Full-width subtle horizontal divider line */}
      <div className="w-full h-[1px] bg-[#1E293B] mt-4" />
    </header>
  );
};
