import React, { useState } from 'react';
import { UserCheck, Search, Mail, Phone, Building2, ShieldCheck, User } from 'lucide-react';
import { CircleMember, QCCGroup } from '../types/qcc';

interface BiodataMemberViewProps {
  members: CircleMember[];
  groups: QCCGroup[];
}

export const BiodataMemberView: React.FC<BiodataMemberViewProps> = ({
  members,
  groups,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup =
      selectedGroupFilter === 'ALL' || m.groupId === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#94A3B8]">
            DATA PERSONEL GUGUS
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Biodata Member QCC
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar ketua kelompok, fasilitator, sekretaris, dan anggota aktif circle PT. Sentral Multi Indotama.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, NIK, peran..."
              className="bg-[#0D131F] border border-[#1E293B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-48 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="bg-[#0D131F] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
          >
            <option value="ALL">Semua Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code} - {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const group = groups.find((g) => g.id === member.groupId);

          return (
            <div
              key={member.id}
              className="bg-[#0D131F] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between hover:border-[#334155] transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#162238] border border-[#1E293B] flex items-center justify-center text-blue-400 font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {member.name}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {member.nik}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      member.role === 'Leader'
                        ? 'bg-blue-950/90 text-blue-300 border border-blue-800/50'
                        : member.role === 'Fasilitator'
                        ? 'bg-purple-950/90 text-purple-300 border border-purple-800/50'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 border-t border-[#1E293B]/60 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Group Circle:</span>
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      {group && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                      )}
                      {member.groupName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Departemen:</span>
                    <span className="text-slate-300">{member.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Telepon:</span>
                    <span className="font-mono text-slate-300">{member.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
