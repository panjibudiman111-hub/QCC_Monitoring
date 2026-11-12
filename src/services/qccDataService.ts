/**
 * QCC Monitor Data Service
 * Connects the dashboard to live data published from Google Sheets (CSV).
 */

import { QCCGroup, PDCAStep, MakalahSection } from '../types/qcc';
import { INITIAL_GROUPS } from '../data/initialData';

// 1. DATA SOURCE & CONFIGURATION:
// Replace this placeholder with your published Google Sheets CSV link:
// File -> Share -> Publish to web -> Select Sheet -> Select 'Comma-separated values (.csv)' -> Publish
export const GOOGLE_SHEET_CSV_URL = "YOUR_PUBLISHED_CSV_URL_HERE";

export interface ParsedCsvRow {
  group_code: string;
  group_name: string;
  badge_color: string;
  tema: string;
  step_selesai: number;
  step_berjalan: number;
  progress_step: number;
  progress_makalah: number;
}

export interface SheetFetchResult {
  groups: QCCGroup[];
  isLive: boolean;
  lastSynced: Date;
  error?: string;
  summary: {
    totalCompleted: number;
    totalInProgress: number;
    totalNotStarted: number;
    totalSteps: number;
    avgMakalah: number;
  };
}

/**
 * Standard CSV parser handling quotes, commas, and line breaks
 */
export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip CRLF
      }
      currentRow.push(currentCell.trim());
      if (currentRow.length > 0 && currentRow.some((c) => c !== '')) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Clean numeric string e.g. "31%" -> 31, "1/8" -> 1
 */
function parseCleanNumber(val: any, fallback = 0): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val) return fallback;
  const cleaned = String(val).replace(/%/g, '').split('/')[0].trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? fallback : num;
}

/**
 * Helper to build 8 PDCA Steps for a group based on step_selesai & step_berjalan
 */
function createStepsForGroup(
  stepSelesai: number,
  stepBerjalan: number,
  existingSteps?: PDCAStep[]
): PDCAStep[] {
  const stepTitles = [
    { num: 1, title: 'Menentukan Tema & Sasaran', category: 'Plan' as const },
    { num: 2, title: 'Memahami Situasi & Menetapkan Target', category: 'Plan' as const },
    { num: 3, title: 'Analisa Faktor Penyebab (Fishbone)', category: 'Plan' as const },
    { num: 4, title: 'Rencana Penanggulangan (5W+1H)', category: 'Plan' as const },
    { num: 5, title: 'Pelaksanaan Penanggulangan (Do)', category: 'Do' as const },
    { num: 6, title: 'Evaluasi Hasil & Efektivitas (Check)', category: 'Check' as const },
    { num: 7, title: 'Standarisasi & Pencegahan Terulang', category: 'Action' as const },
    { num: 8, title: 'Rencana Selanjutnya & Kesimpulan', category: 'Action' as const },
  ];

  return stepTitles.map((st, idx) => {
    let status: 'completed' | 'in_progress' | 'not_started' = 'not_started';
    if (idx < stepSelesai) {
      status = 'completed';
    } else if (idx < stepSelesai + stepBerjalan) {
      status = 'in_progress';
    }

    const prev = existingSteps?.[idx];
    return {
      stepNumber: st.num,
      title: st.title,
      category: st.category,
      status,
      pic: prev?.pic || 'Team Circle',
      startDate: status !== 'not_started' ? (prev?.startDate || '2026-10-15') : undefined,
      targetDate: prev?.targetDate || '2026-12-15',
      completionDate: status === 'completed' ? (prev?.completionDate || '2026-11-05') : undefined,
      notes: prev?.notes,
    };
  });
}

/**
 * Helper to build Makalah sections
 */
function createMakalahForGroup(makalahProgress: number): MakalahSection[] {
  const chapters = [
    'BAB I: Menentukan Tema & Sasaran',
    'BAB II: Memahami Situasi & Target',
    'BAB III: Analisa Faktor Penyebab',
    'BAB IV: Rencana Penanggulangan',
    'BAB V: Pelaksanaan Penanggulangan',
    'BAB VI: Evaluasi Hasil',
    'BAB VII: Standarisasi',
    'BAB VIII: Rencana Berikutnya',
  ];

  return chapters.map((title, idx) => {
    const isCompleted = makalahProgress >= (idx + 1) * 12;
    const isDraft = makalahProgress > 0 && idx === 0;
    return {
      chapter: idx + 1,
      title,
      status: isCompleted ? 'approved' : isDraft ? 'draft' : 'not_started',
      progress: isCompleted ? 100 : isDraft ? 50 : 0,
      lastUpdated: isCompleted || isDraft ? '2026-11-10' : undefined,
    };
  });
}

/**
 * Convert parsed CSV rows into QCCGroup entities
 */
export function mapCsvRowsToGroups(rows: string[][]): QCCGroup[] {
  if (rows.length < 2) return INITIAL_GROUPS;

  const header = rows[0].map((h) => h.toLowerCase().trim().replace(/[\s_-]+/g, '_'));

  // Find column indexes
  const colIndex = {
    group_code: header.findIndex((h) => h.includes('code') || h === 'kode' || h === 'g'),
    group_name: header.findIndex((h) => h.includes('name') || h === 'nama' || h === 'group'),
    badge_color: header.findIndex((h) => h.includes('color') || h === 'warna'),
    tema: header.findIndex((h) => h.includes('tema') || h.includes('theme') || h.includes('judul')),
    step_selesai: header.findIndex((h) => h.includes('selesai') || h.includes('completed')),
    step_berjalan: header.findIndex((h) => h.includes('berjalan') || h.includes('progress_step_count') || h.includes('in_progress')),
    progress_step: header.findIndex((h) => h.includes('progress_step') || h.includes('step_pct') || h.includes('%_step')),
    progress_makalah: header.findIndex((h) => h.includes('makalah') || h.includes('paper')),
  };

  const defaultColors = [
    '#2563EB', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1',
  ];

  const parsedGroups: QCCGroup[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length < 2) continue;

    const group_code = (colIndex.group_code >= 0 ? row[colIndex.group_code] : '') || `G${r}`;
    const group_name = (colIndex.group_name >= 0 ? row[colIndex.group_name] : '') || `Group ${r}`;
    const badge_color = (colIndex.badge_color >= 0 ? row[colIndex.badge_color] : '') || defaultColors[(r - 1) % defaultColors.length];
    const tema = (colIndex.tema >= 0 ? row[colIndex.tema] : '') || 'Tema belum diisi';

    const step_selesai = parseCleanNumber(colIndex.step_selesai >= 0 ? row[colIndex.step_selesai] : 0);
    const step_berjalan = parseCleanNumber(colIndex.step_berjalan >= 0 ? row[colIndex.step_berjalan] : 0);
    const progress_step = parseCleanNumber(colIndex.progress_step >= 0 ? row[colIndex.progress_step] : 0);
    const progress_makalah = parseCleanNumber(colIndex.progress_makalah >= 0 ? row[colIndex.progress_makalah] : 0);

    const existingMatch = INITIAL_GROUPS.find(
      (ig) => ig.code.toLowerCase() === group_code.toLowerCase() || ig.name.toLowerCase() === group_name.toLowerCase()
    );

    parsedGroups.push({
      id: existingMatch?.id || `sheet-g${r}`,
      code: group_code.toUpperCase(),
      name: group_name,
      theme: tema,
      fullTheme: existingMatch?.fullTheme || tema,
      line: existingMatch?.line || `Line Production ${r}`,
      department: existingMatch?.department || 'Manufacturing',
      color: badge_color.startsWith('#') ? badge_color : defaultColors[(r - 1) % defaultColors.length],
      leader: existingMatch?.leader || 'Leader Gugus',
      facilitator: existingMatch?.facilitator || 'Fasilitator Mutu (QA)',
      memberCount: existingMatch?.memberCount || 6,
      stepsCompleted: step_selesai,
      stepProgress: progress_step,
      makalahProgress: progress_makalah,
      steps: createStepsForGroup(step_selesai, step_berjalan, existingMatch?.steps),
      makalahSections: createMakalahForGroup(progress_makalah),
    });
  }

  return parsedGroups.length > 0 ? parsedGroups : INITIAL_GROUPS;
}

/**
 * Fetch and parse data from Google Sheets CSV with fallback
 */
export async function fetchQccDataFromSheet(
  customUrl?: string
): Promise<SheetFetchResult> {
  const targetUrl = customUrl || GOOGLE_SHEET_CSV_URL;

  // Check if URL is still the placeholder or empty
  const isPlaceholder =
    !targetUrl ||
    targetUrl === "YOUR_PUBLISHED_CSV_URL_HERE" ||
    targetUrl.trim() === "";

  if (isPlaceholder) {
    // Calculate summary from fallback data
    const totalCompleted = INITIAL_GROUPS.reduce((acc, g) => acc + g.stepsCompleted, 0);
    const totalSteps = INITIAL_GROUPS.length * 8; // 64
    const totalInProgress = INITIAL_GROUPS.reduce((acc, g) => {
      return acc + g.steps.filter((s) => s.status === 'in_progress').length;
    }, 0);
    const totalNotStarted = totalSteps - totalCompleted - totalInProgress;
    const avgMakalah = Math.round(
      INITIAL_GROUPS.reduce((acc, g) => acc + g.makalahProgress, 0) / INITIAL_GROUPS.length
    );

    return {
      groups: INITIAL_GROUPS,
      isLive: false,
      lastSynced: new Date(),
      summary: {
        totalCompleted,
        totalInProgress,
        totalNotStarted,
        totalSteps,
        avgMakalah,
      },
    };
  }

  try {
    // Add cache-busting timestamp to ensure fresh data
    const fetchUrl = targetUrl.includes('?')
      ? `${targetUrl}&_t=${Date.now()}`
      : `${targetUrl}?_t=${Date.now()}`;

    const res = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    }

    const csvText = await res.text();
    const parsedRows = parseCSV(csvText);
    const groups = mapCsvRowsToGroups(parsedRows);

    // Compute dynamic KPI metrics
    const totalCompleted = groups.reduce((acc, g) => acc + g.stepsCompleted, 0);
    const totalSteps = groups.length * 8;
    const totalInProgress = groups.reduce((acc, g) => {
      return acc + g.steps.filter((s) => s.status === 'in_progress').length;
    }, 0);
    const totalNotStarted = Math.max(0, totalSteps - totalCompleted - totalInProgress);
    const avgMakalah = Math.round(
      groups.reduce((acc, g) => acc + g.makalahProgress, 0) / (groups.length || 1)
    );

    return {
      groups,
      isLive: true,
      lastSynced: new Date(),
      summary: {
        totalCompleted,
        totalInProgress,
        totalNotStarted,
        totalSteps,
        avgMakalah,
      },
    };
  } catch (err: any) {
    console.warn('Failed to fetch from Google Sheets CSV, falling back to benchmark data:', err);

    const totalCompleted = INITIAL_GROUPS.reduce((acc, g) => acc + g.stepsCompleted, 0);
    const totalSteps = INITIAL_GROUPS.length * 8;
    const totalInProgress = INITIAL_GROUPS.reduce((acc, g) => {
      return acc + g.steps.filter((s) => s.status === 'in_progress').length;
    }, 0);
    const totalNotStarted = totalSteps - totalCompleted - totalInProgress;
    const avgMakalah = Math.round(
      INITIAL_GROUPS.reduce((acc, g) => acc + g.makalahProgress, 0) / INITIAL_GROUPS.length
    );

    return {
      groups: INITIAL_GROUPS,
      isLive: false,
      lastSynced: new Date(),
      error: err.message || 'Gagal mengambil data dari Google Sheets. Menggunakan data cadangan.',
      summary: {
        totalCompleted,
        totalInProgress,
        totalNotStarted,
        totalSteps,
        avgMakalah,
      },
    };
  }
}
