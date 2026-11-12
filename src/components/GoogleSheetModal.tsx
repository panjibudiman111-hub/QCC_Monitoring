import React, { useState } from 'react';
import { X, FileSpreadsheet, ExternalLink, Check, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { https://docs.google.com/spreadsheets/d/e/2PACX-1vTQuaFeX2eBkpadIEjCQQYR_GLPULV03AvNiFdfLynFnsRTSsU532d8TgzQb_gHW668UAgfLAoQz_RB/pub?gid=0&single=true&output=csv } from '../services/qccDataService';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (newUrl: string) => void;
  onTestFetch: (url: string) => Promise<boolean>;
  isLive: boolean;
  sheetError?: string;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onTestFetch,
  isLive,
  sheetError,
}) => {
  if (!isOpen) return null;

  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const sampleCsvData = `group_code,group_name,badge_color,tema,step_selesai,step_berjalan,progress_step,progress_makalah
G1,BLUESMI,#2563EB,Menanggulangi Problem Delay Instalasi di line 9 unit ...,1,2,31,12
G2,HEXAGONAL,#10B981,Menanggulangi part Reject di line 7,1,2,31,0
G3,QCC ABS,#F59E0B,Mengurangi Terjadi nya Missing Part,0,1,6,0
G4,Group 4,#EF4444,Tema Group 4 - Diisi oleh group,0,2,13,0
G5,Group 5,#8B5CF6,Tema Group 5 - Diisi oleh group,1,1,13,0
G6,Group 6,#EC4899,Tema Group 6 - Diisi oleh group,0,1,6,0
G7,Group 7,#14B8A6,Tema Group 7 - Diisi oleh group,0,0,0,0
G8,Group 8,#6366F1,Tema Group 8 - Diisi oleh group,0,1,6,0`;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await onTestFetch(inputUrl);
      if (ok) {
        setTestResult({
          success: true,
          message: 'Koneksi Berhasil! Data 8 group berhasil di-parse dan disinkronkan ke dashboard.',
        });
      } else {
        setTestResult({
          success: false,
          message: 'Gagal mengambil CSV. Pastikan Google Sheet sudah di-Publish to web dalam format CSV.',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Koneksi gagal.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveUrl(inputUrl);
    onClose();
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleCsvData);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 sm:p-6 w-full max-w-xl shadow-2xl relative text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Integrasi Google Sheets Live CSV
              </h3>
              <p className="text-[11px] text-slate-400">
                Hubungkan dashboard ke spreadsheet online PT. Sentral Multi Indotama
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input URL */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Google Sheet Published CSV URL:
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv"
              className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white font-mono text-[11px] focus:outline-hidden focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Default kode: <code className="text-slate-400">src/services/qccDataService.ts &gt; GOOGLE_SHEET_CSV_URL</code>
            </span>
          </div>

          {/* Test & Status Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleTest}
              disabled={testing || !inputUrl || inputUrl === "YOUR_PUBLISHED_CSV_URL_HERE"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142036] border border-blue-800/50 text-blue-300 font-medium hover:bg-[#1a2b4a] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Menguji...' : 'Uji Koneksi CSV'}</span>
            </button>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                isLive
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
              }`}
            >
              {isLive ? '● Live Connected' : '○ Menggunakan Fallback Benchmark'}
            </span>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-lg border text-[11px] ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                  : 'bg-red-950/40 border-red-800/50 text-red-300'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3 space-y-2 mb-4">
          <span className="font-semibold text-orange-400 block">
            Langkah Mempublikasikan Google Sheet ke Format CSV:
          </span>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>Buka spreadsheet Google Sheets Anda.</li>
            <li>Klik menu <strong className="text-white">File</strong> &gt; <strong className="text-white">Share</strong> &gt; <strong className="text-white">Publish to web</strong>.</li>
            <li>Pilih Sheet yang bersangkutan, ganti format dari Web page menjadi <strong className="text-white">Comma-separated values (.csv)</strong>.</li>
            <li>Klik <strong className="text-white">Publish</strong>, lalu salin URL yang dihasilkan ke kolom input di atas.</li>
          </ol>
        </div>

        {/* Template Schema */}
        <div className="border border-[#1E293B] rounded-lg p-3 bg-[#080C14]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-300">
              Format Kolom CSV yang Diperlukan:
            </span>
            <button
              onClick={handleCopyTemplate}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
            >
              {copiedTemplate ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTemplate ? 'Tersalin!' : 'Salin Template'}</span>
            </button>
          </div>
          <p className="font-mono text-[10px] text-slate-400 bg-[#05080E] p-2 rounded border border-[#1E293B] overflow-x-auto">
            group_code, group_name, badge_color, tema, step_selesai, step_berjalan, progress_step, progress_makalah
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1E293B]">
          <button
            onClick={() => {
              setInputUrl("YOUR_PUBLISHED_CSV_URL_HERE");
              onSaveUrl("YOUR_PUBLISHED_CSV_URL_HERE");
            }}
            className="text-[11px] text-slate-400 hover:text-white"
          >
            Reset ke Default
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
            >
              Simpan URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
