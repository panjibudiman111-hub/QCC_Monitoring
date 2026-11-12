import React, { useState } from 'react';
import { CalendarPlus, Clock, MapPin, User, CheckCircle2, Plus, Calendar } from 'lucide-react';
import { AgendaItem, QCCGroup } from '../types/qcc';

interface AgendaQccViewProps {
  agendas: AgendaItem[];
  groups: QCCGroup[];
  onAddAgenda: (newAgenda: AgendaItem) => void;
}

export const AgendaQccView: React.FC<AgendaQccViewProps> = ({
  agendas,
  groups,
  onAddAgenda,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || 'g1');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('10:00 - 11:30 WIB');
  const [location, setLocation] = useState('Meeting Room Quality Lt. 2');
  const [type, setType] = useState<AgendaItem['type']>('Meeting Rutin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const g = groups.find((grp) => grp.id === selectedGroup);
    const newAgenda: AgendaItem = {
      id: `ag-${Date.now()}`,
      groupId: selectedGroup,
      groupName: g ? g.name : 'QCC Group',
      title,
      date,
      time,
      location,
      type,
      status: 'Scheduled',
      pic: g ? g.leader : 'Circle Leader',
    };
    onAddAgenda(newAgenda);
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
            JADWAL & KEGIATAN
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Agenda Kegiatan QCC
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Jadwal pertemuan rutin, gemba walk lini produksi, dan presentasi milestone komite mutu.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda QCC</span>
        </button>
      </div>

      {/* Agenda List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agendas.map((item) => {
          const group = groups.find((g) => g.id === item.groupId);
          return (
            <div
              key={item.id}
              className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between hover:border-[#334155] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {group && (
                      <span
                        className="w-5 h-5 rounded-[4px] text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.code}
                      </span>
                    )}
                    <span className="font-bold text-white text-xs">
                      {item.groupName}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#131E30] text-blue-300 border border-blue-900/40">
                    {item.type}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white leading-snug mb-3">
                  {item.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{item.date}</span>
                    <span className="text-slate-600">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-[11px]">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>PIC: {item.pic}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terkonfirmasi
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Tahap 1
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Tambah Agenda Pertemuan QCC</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Group QCC</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.code} - {g.name} ({g.line})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Judul / Topik Agenda</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Analisa Fishbone Diagram Step 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Waktu</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Lokasi / Lini Produksi</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Jenis Pertemuan</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg p-2.5 text-white"
                >
                  <option value="Meeting Rutin">Meeting Rutin</option>
                  <option value="Gemba Walk">Gemba Walk</option>
                  <option value="Konsultasi Fasilitator">Konsultasi Fasilitator</option>
                  <option value="Presentasi Tahap 1">Presentasi Tahap 1</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
