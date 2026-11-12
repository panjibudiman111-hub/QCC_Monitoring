/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { ProgressCharts } from './components/ProgressCharts';
import { GroupTable } from './components/GroupTable';
import { GroupDetailDrawer } from './components/GroupDetailDrawer';
import { GoogleSheetModal } from './components/GoogleSheetModal';

import { ProgressStepView } from './views/ProgressStepView';
import { ProgressMakalahView } from './views/ProgressMakalahView';
import { AgendaQccView } from './views/AgendaQccView';
import { KalenderBulananView } from './views/KalenderBulananView';
import { BiodataGroupView } from './views/BiodataGroupView';
import { BiodataMemberView } from './views/BiodataMemberView';
import { PengaturanAkunView } from './views/PengaturanAkunView';

import { NavView, QCCGroup, AgendaItem, CircleMember } from './types/qcc';
import { INITIAL_GROUPS, INITIAL_AGENDAS, INITIAL_MEMBERS } from './data/initialData';
import {
  GOOGLE_SHEET_CSV_URL,
  fetchQccDataFromSheet,
  SheetFetchResult,
} from './services/qccDataService';

const STORAGE_KEY_GROUPS = 'qcc_monitor_groups_v1';
const STORAGE_KEY_AGENDAS = 'qcc_monitor_agendas_v1';
const STORAGE_KEY_SHEET_URL = 'qcc_monitor_sheet_url_v1';

export default function App() {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<QCCGroup | null>(null);

  // Google Sheet integration states
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEET_URL);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return GOOGLE_SHEET_CSV_URL;
  });

  const [isLiveSheet, setIsLiveSheet] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [sheetError, setSheetError] = useState<string | undefined>(undefined);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Load from localStorage or fallback to initial data
  const [groups, setGroups] = useState<QCCGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved groups from localStorage', e);
    }
    return INITIAL_GROUPS;
  });

  const [agendas, setAgendas] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AGENDAS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved agendas', e);
    }
    return INITIAL_AGENDAS;
  });

  const [members] = useState<CircleMember[]>(INITIAL_MEMBERS);

  // Core Data Synchronization function
  const syncDataFromSheet = useCallback(
    async (urlToUse?: string, isManual = false) => {
      const targetUrl = urlToUse !== undefined ? urlToUse : sheetUrl;
      setIsRefreshing(true);
      try {
        const result: SheetFetchResult = await fetchQccDataFromSheet(targetUrl);
        setGroups(result.groups);
        setIsLiveSheet(result.isLive);
        setLastSynced(result.lastSynced);
        setSheetError(result.error);
        return result.isLive;
      } catch (err: any) {
        console.error('Error fetching QCC data from Google Sheet:', err);
        setSheetError(err.message || 'Gagal sinkronisasi data');
        return false;
      } finally {
        setIsRefreshing(false);
      }
    },
    [sheetUrl]
  );

  // Initial load
  useEffect(() => {
    syncDataFromSheet();
  }, [syncDataFromSheet]);

  // Automatic background polling every 60 seconds as requested
  useEffect(() => {
    const POLL_INTERVAL_MS = 60000; // 60 seconds
    const intervalId = setInterval(() => {
      syncDataFromSheet();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [syncDataFromSheet]);

  // Persist local groups whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } catch (e) {
      console.error('Failed to save groups to localStorage', e);
    }
  }, [groups]);

  // Persist agendas
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AGENDAS, JSON.stringify(agendas));
    } catch (e) {
      console.error('Failed to save agendas to localStorage', e);
    }
  }, [agendas]);

  // Persist sheet URL
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHEET_URL, sheetUrl);
    } catch (e) {
      console.error('Failed to save sheet url to localStorage', e);
    }
  }, [sheetUrl]);

  // Check if data is modified from baseline
  const isModified = JSON.stringify(groups) !== JSON.stringify(INITIAL_GROUPS);

  // Handler to update a single group from drawer
  const handleUpdateGroup = (updatedGroup: QCCGroup) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
    setSelectedGroup(updatedGroup);
  };

  // Handler to add agenda
  const handleAddAgenda = (newAgenda: AgendaItem) => {
    setAgendas((prev) => [newAgenda, ...prev]);
  };

  // Handler to save new Sheet URL
  const handleSaveSheetUrl = (newUrl: string) => {
    setSheetUrl(newUrl);
    syncDataFromSheet(newUrl, true);
  };

  // Handler to test fetch in modal
  const handleTestFetchSheet = async (testUrl: string) => {
    return await syncDataFromSheet(testUrl, true);
  };

  // Handler to reset all data back to prompt defaults
  const handleResetData = () => {
    if (window.confirm('Kembalikan semua data ke nilai awal benchmark SMI?')) {
      setGroups(INITIAL_GROUPS);
      setAgendas(INITIAL_AGENDAS);
      setSheetUrl(GOOGLE_SHEET_CSV_URL);
      localStorage.removeItem(STORAGE_KEY_GROUPS);
      localStorage.removeItem(STORAGE_KEY_AGENDAS);
      localStorage.removeItem(STORAGE_KEY_SHEET_URL);
      if (selectedGroup) {
        const found = INITIAL_GROUPS.find((g) => g.id === selectedGroup.id);
        setSelectedGroup(found || null);
      }
    }
  };

  // Handler to export CSV
  const handleExportCsv = () => {
    const headers = [
      'group_code',
      'group_name',
      'badge_color',
      'tema',
      'step_selesai',
      'step_berjalan',
      'progress_step',
      'progress_makalah',
    ];
    const rows = groups.map((g) => {
      const stepBerjalan = g.steps.filter((s) => s.status === 'in_progress').length;
      return [
        g.code,
        `"${g.name}"`,
        `"${g.color}"`,
        `"${(g.fullTheme || g.theme).replace(/"/g, '""')}"`,
        g.stepsCompleted,
        stepBerjalan,
        g.stepProgress,
        g.makalahProgress,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `QCC_Monitor_GoogleSheet_Format_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler to export JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ groups, agendas, members, sheetUrl }, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute(
      'download',
      `QCC_Monitor_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format last synced time
  const formattedLastSynced = lastSynced
    ? lastSynced.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' WIB'
    : 'Menghubungkan...';

  // Filter groups for Dashboard and Views
  const filteredGroups = groups.filter((g) => {
    const q = filterText.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      g.theme.toLowerCase().includes(q) ||
      (g.fullTheme && g.fullTheme.toLowerCase().includes(q)) ||
      g.line.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      {/* 1. Left Sidebar Navigation (260px fixed desktop, slide-out drawer mobile) */}
      <Sidebar
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* 2. Main Content Area */}
      <div className="lg:pl-[260px] flex-1 flex flex-col min-h-screen">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-[1440px] w-full mx-auto pb-12">
          {/* Top Header Section with Refresh Data and Last Synced indicator */}
          <Header
            onOpenMobileMenu={() => setIsOpenMobile(true)}
            filterText={filterText}
            onFilterChange={setFilterText}
            onExportCsv={handleExportCsv}
            onResetData={handleResetData}
            isModified={isModified}
            onRefreshData={() => syncDataFromSheet(sheetUrl, true)}
            isRefreshing={isRefreshing}
            lastSyncedTime={formattedLastSynced}
            isLiveSheet={isLiveSheet}
            sheetError={sheetError}
            onOpenSheetConfig={() => setIsSheetModalOpen(true)}
          />

          {/* Dynamic Content Views */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              {/* B. KPI Summary Cards Row (4 Equal-Width Cards, dynamically bound to Google Sheets data) */}
              <KpiCards groups={groups} />

              {/* C. Data Visualization Charts Row (2 Equal-Width Cards Side-by-Side, dynamically bound) */}
              <ProgressCharts
                groups={groups}
                onSelectGroup={(group) => setSelectedGroup(group)}
              />

              {/* D. Group Comparison Data Table ("Perbandingan per Group", dynamically bound) */}
              <GroupTable
                groups={filteredGroups}
                onSelectGroup={(group) => setSelectedGroup(group)}
              />
            </div>
          )}

          {activeView === 'steps' && (
            <div className="animate-in fade-in duration-300">
              <ProgressStepView
                groups={filteredGroups}
                onSelectGroup={(group) => setSelectedGroup(group)}
              />
            </div>
          )}

          {activeView === 'makalah' && (
            <div className="animate-in fade-in duration-300">
              <ProgressMakalahView
                groups={filteredGroups}
                onSelectGroup={(group) => setSelectedGroup(group)}
              />
            </div>
          )}

          {activeView === 'agenda' && (
            <div className="animate-in fade-in duration-300">
              <AgendaQccView
                agendas={agendas}
                groups={groups}
                onAddAgenda={handleAddAgenda}
              />
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="animate-in fade-in duration-300">
              <KalenderBulananView
                agendas={agendas}
                groups={groups}
              />
            </div>
          )}

          {activeView === 'group-profile' && (
            <div className="animate-in fade-in duration-300">
              <BiodataGroupView
                groups={filteredGroups}
                onSelectGroup={(group) => setSelectedGroup(group)}
              />
            </div>
          )}

          {activeView === 'member-profile' && (
            <div className="animate-in fade-in duration-300">
              <BiodataMemberView
                members={members}
                groups={groups}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="animate-in fade-in duration-300">
              <PengaturanAkunView
                onResetData={handleResetData}
                onExportCsv={handleExportCsv}
                onExportJson={handleExportJson}
                sheetUrl={sheetUrl}
                onUpdateSheetUrl={handleSaveSheetUrl}
                onOpenSheetModal={() => setIsSheetModalOpen(true)}
                isLive={isLiveSheet}
              />
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[#1E293B]/60 bg-[#070A11] px-4 sm:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PT. Sentral Multi Indotama (SMI) &copy; {new Date().getFullYear()} — Quality Control Circle Management System
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Standar PDCA Tahap 1</span>
            <span>·</span>
            <span>8 Active Circles</span>
            <span>·</span>
            <span className="font-mono text-emerald-400">64 Milestones</span>
          </div>
        </footer>
      </div>

      {/* 3. Slide-over Detail Drawer (Opens on row click or chart click) */}
      {selectedGroup && (
        <GroupDetailDrawer
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onUpdateGroup={handleUpdateGroup}
        />
      )}

      {/* 4. Google Sheets Configuration & Testing Modal */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        currentUrl={sheetUrl}
        onSaveUrl={handleSaveSheetUrl}
        onTestFetch={handleTestFetchSheet}
        isLive={isLiveSheet}
        sheetError={sheetError}
      />
    </div>
  );
}
