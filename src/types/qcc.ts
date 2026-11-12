export type StepStatus = 'completed' | 'in_progress' | 'not_started';

export interface PDCAStep {
  stepNumber: number;
  title: string;
  category: 'Plan' | 'Do' | 'Check' | 'Action';
  status: StepStatus;
  pic: string;
  startDate?: string;
  targetDate?: string;
  completionDate?: string;
  notes?: string;
}

export interface MakalahSection {
  chapter: number;
  title: string;
  status: 'approved' | 'in_review' | 'draft' | 'not_started';
  progress: number; // 0 - 100
  lastUpdated?: string;
}

export interface QCCGroup {
  id: string;
  code: string; // G1 - G8
  name: string; // BLUESMI, HEXAGONAL, etc.
  theme: string;
  fullTheme: string;
  line: string;
  department: string;
  color: string;
  leader: string;
  facilitator: string;
  memberCount: number;
  stepsCompleted: number; // 0 - 8
  stepProgress: number; // e.g. 31%
  makalahProgress: number; // e.g. 12%
  steps: PDCAStep[];
  makalahSections: MakalahSection[];
}

export interface AgendaItem {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Meeting Rutin' | 'Gemba Walk' | 'Presentasi Tahap 1' | 'Konsultasi Fasilitator';
  status: 'Scheduled' | 'Completed' | 'Delayed';
  pic: string;
}

export interface CircleMember {
  id: string;
  nik: string;
  name: string;
  groupId: string;
  groupName: string;
  role: 'Leader' | 'Fasilitator' | 'Sekretaris' | 'Notulen' | 'Member';
  department: string;
  phone: string;
  email: string;
}

export type NavView = 
  | 'dashboard'
  | 'steps'
  | 'makalah'
  | 'agenda'
  | 'calendar'
  | 'group-profile'
  | 'member-profile'
  | 'settings';
