import React from 'react';
import {
  LayoutGrid,
  ListChecks,
  FileText,
  CalendarPlus,
  CalendarDays,
  Users,
  UserCheck,
  Key,
  X,
  Building2,
  ChevronRight
} from 'lucide-react';
import { NavView } from '../types/qcc';

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'steps', label: 'Progress Step', icon: ListChecks, badge: '8 Step' },
  { id: 'makalah', label: 'Progress Makalah', icon: FileText, badge: 'Paper' },
  { id: 'agenda', label: 'Agenda QCC', icon: CalendarPlus },
  { id: 'calendar', label: 'Kalender Bulanan', icon: CalendarDays },
  { id: 'group-profile', label: 'Biodata Group', icon: Users, badge: '8 Group' },
  { id: 'member-profile', label: 'Biodata Member', icon: UserCheck },
  { id: 'settings', label: 'Pengaturan Akun', icon: Key },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Fixed 260px on Desktop, Slide-over on Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0A101E] border-r border-[#1E293B] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#1E293B]/70 shrink-0">
          <div className="flex items-center gap-3">
            {/* White rounded rectangular logo badge for "SMI" */}
            <div className="w-11 h-10 rounded-lg bg-white flex flex-col items-center justify-center shadow-md shrink-0">
              <span className="text-[#0A101E] font-black tracking-tight text-xs leading-none">PT. SMI</span>
              <span className="text-[#2563EB] font-bold text-[8px] tracking-widest mt-0.5">QC</span>
            </div>

            {/* Title & Tracked-out Subtitle */}
            <div className="flex flex-col">
              <span className="text-white font-bold text-[17px] leading-tight tracking-tight">
                QCC Monitor
              </span>
              <span className="text-[#94A3B8] text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5">
                TAHAP 1
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
          <div>
            <div className="px-3 mb-2.5">
              <span className="text-[#94A3B8] text-[11px] font-semibold tracking-[0.16em] uppercase">
                NAVIGASI
              </span>
            </div>

            <nav className="space-y-1" aria-label="Main Navigation">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-[#172554] text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-[#0D1527]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && !isActive && (
                      <span className="text-[10px] font-medium text-slate-400 font-mono">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-blue-300 shrink-0 opacity-80" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Corporate Footer Badge */}
        <div className="p-4 border-t border-[#1E293B]/70 bg-[#070D18] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#111C33] border border-[#1E293B] flex items-center justify-center text-slate-300 shrink-0">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">
                PT. Sentral Multi Indotama
              </span>
              <span className="text-slate-400 text-[10px] truncate">
                Quality Steering Committee
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
