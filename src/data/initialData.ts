import { QCCGroup, AgendaItem, CircleMember, PDCAStep, MakalahSection } from '../types/qcc';

const PDCA_STEP_TITLES = [
  { num: 1, title: 'Menentukan Tema & Sasaran', category: 'Plan' as const },
  { num: 2, title: 'Memahami Situasi & Menetapkan Target', category: 'Plan' as const },
  { num: 3, title: 'Analisa Faktor Penyebab (Fishbone)', category: 'Plan' as const },
  { num: 4, title: 'Rencana Penanggulangan (5W+1H)', category: 'Plan' as const },
  { num: 5, title: 'Pelaksanaan Penanggulangan (Do)', category: 'Do' as const },
  { num: 6, title: 'Evaluasi Hasil & Efektivitas (Check)', category: 'Check' as const },
  { num: 7, title: 'Standarisasi & Pencegahan Terulang', category: 'Action' as const },
  { num: 8, title: 'Rencana Selanjutnya & Kesimpulan', category: 'Action' as const },
];

const MAKALAH_CHAPTERS = [
  { chapter: 1, title: 'BAB I: Menentukan Tema & Sasaran' },
  { chapter: 2, title: 'BAB II: Memahami Situasi & Target' },
  { chapter: 3, title: 'BAB III: Analisa Faktor Penyebab' },
  { chapter: 4, title: 'BAB IV: Rencana Penanggulangan' },
  { chapter: 5, title: 'BAB V: Pelaksanaan Penanggulangan' },
  { chapter: 6, title: 'BAB VI: Evaluasi Hasil' },
  { chapter: 7, title: 'BAB VII: Standarisasi' },
  { chapter: 8, title: 'BAB VIII: Rencana Berikutnya' },
];

function generateSteps(
  completedCount: number,
  inProgressIndices: number[],
  pics: string[]
): PDCAStep[] {
  return PDCA_STEP_TITLES.map((step, idx) => {
    let status: 'completed' | 'in_progress' | 'not_started' = 'not_started';
    if (idx < completedCount) {
      status = 'completed';
    } else if (inProgressIndices.includes(idx)) {
      status = 'in_progress';
    }
    return {
      stepNumber: step.num,
      title: step.title,
      category: step.category,
      status,
      pic: pics[idx % pics.length] || 'Team Circle',
      startDate: status !== 'not_started' ? '2026-10-15' : undefined,
      targetDate: '2026-12-15',
      completionDate: status === 'completed' ? '2026-11-05' : undefined,
      notes: status === 'completed' ? 'Disetujui Fasilitator & QA Committee' : undefined,
    };
  });
}

function generateMakalah(progressPercentage: number): MakalahSection[] {
  return MAKALAH_CHAPTERS.map((ch, idx) => {
    let status: 'approved' | 'in_review' | 'draft' | 'not_started' = 'not_started';
    let progress = 0;
    if (progressPercentage >= 12 && idx === 0) {
      status = 'approved';
      progress = 100;
    } else if (progressPercentage > 0 && idx === 0) {
      status = 'draft';
      progress = 50;
    }
    return {
      chapter: ch.chapter,
      title: ch.title,
      status,
      progress,
      lastUpdated: progress > 0 ? '2026-11-10' : undefined,
    };
  });
}

export const INITIAL_GROUPS: QCCGroup[] = [
  {
    id: 'g1',
    code: 'G1',
    name: 'BLUESMI',
    theme: 'Menanggulangi Problem Delay Instalasi di line 9 unit ...',
    fullTheme: 'Menanggulangi Problem Delay Instalasi di Line 9 Unit Sub-Assembly Chassis untuk Meningkatkan Output Harian',
    line: 'Line 9 Unit Assembly',
    department: 'Produksi Sub-Assembly',
    color: '#2563EB',
    leader: 'Hendra Saputra',
    facilitator: 'Bambang Irawan (QA)',
    memberCount: 7,
    stepsCompleted: 1, // 1/8
    stepProgress: 31,  // 31%
    makalahProgress: 12, // 12%
    steps: generateSteps(1, [1, 2], ['Hendra', 'Rian', 'Fajar', 'Dedi', 'Budi', 'Agus', 'Hendra', 'Fajar']),
    makalahSections: generateMakalah(12),
  },
  {
    id: 'g2',
    code: 'G2',
    name: 'HEXAGONAL',
    theme: 'Menanggulangi part Reject di line 7',
    fullTheme: 'Menanggulangi Part Reject di Line 7 Machining Stamping dengan Metode Poka-Yoke Sensor',
    line: 'Line 7 Machining',
    department: 'Machining & Stamping',
    color: '#10B981',
    leader: 'Aris Munandar',
    facilitator: 'Siti Rahma (QC)',
    memberCount: 6,
    stepsCompleted: 1, // 1/8
    stepProgress: 31,  // 31%
    makalahProgress: 0,
    steps: generateSteps(1, [1, 2], ['Aris', 'Wawan', 'Surya', 'Teguh', 'Indra', 'Eko', 'Aris', 'Wawan']),
    makalahSections: generateMakalah(0),
  },
  {
    id: 'g3',
    code: 'G3',
    name: 'QCC ABS',
    theme: 'Mengurangi Terjadi nya Missing Part',
    fullTheme: 'Mengurangi Terjadinya Missing Part pada Buffer Kitting Line Finishing',
    line: 'Line Finishing & Packing',
    department: 'Logistik & Assembly',
    color: '#F59E0B',
    leader: 'Rudi Hartono',
    facilitator: 'Joko Susilo (PPIC)',
    memberCount: 8,
    stepsCompleted: 0, // 0/8
    stepProgress: 6,   // 6%
    makalahProgress: 0,
    steps: generateSteps(0, [0], ['Rudi', 'Deni', 'Yusuf', 'Ilham', 'Anton', 'Bayu', 'Rudi', 'Deni']),
    makalahSections: generateMakalah(0),
  },
  {
    id: 'g4',
    code: 'G4',
    name: 'Group 4',
    theme: 'Tema Group 4 - Diisi oleh group',
    fullTheme: 'Tema Group 4 - Optimalisasi Cycle Time Line 4 Welding Robot',
    line: 'Line 4 Welding',
    department: 'Body Welding',
    color: '#EF4444',
    leader: 'Ahmad Fauzi',
    facilitator: 'Nur Hidayat (Maintenance)',
    memberCount: 6,
    stepsCompleted: 0, // 0/8
    stepProgress: 13,  // 13%
    makalahProgress: 0,
    steps: generateSteps(0, [0, 1], ['Ahmad', 'Reza', 'Gilang', 'Rifki', 'Farhan', 'Ahmad', 'Reza', 'Gilang']),
    makalahSections: generateMakalah(0),
  },
  {
    id: 'g5',
    code: 'G5',
    name: 'Group 5',
    theme: 'Tema Group 5 - Diisi oleh group',
    fullTheme: 'Tema Group 5 - Pengurangan Downtime Penggantian Dies Line Press 2',
    line: 'Line Press 2',
    department: 'Press Shop',
    color: '#8B5CF6',
    leader: 'Wahyu Nugroho',
    facilitator: 'Dwi Prasetyo (Produksi)',
    memberCount: 7,
    stepsCompleted: 1, // 1/8
    stepProgress: 13,  // 13%
    makalahProgress: 0,
    steps: generateSteps(1, [1], ['Wahyu', 'Dani', 'Lukman', 'Arief', 'Hadi', 'Wahyu', 'Dani', 'Lukman']),
    makalahSections: generateMakalah(0),
  },
  {
    id: 'g6',
    code: 'G6',
    name: 'Group 6',
    theme: 'Tema Group 6 - Diisi oleh group',
    fullTheme: 'Tema Group 6 - Efisiensi Pemakaian Paint Thinner Line Coating Primer',
    line: 'Line Coating Primer',
    department: 'Painting & Surface',
    color: '#EC4899',
    leader: 'Cahyo Wibowo',
    facilitator: 'Tri Martono (EHS & QC)',
    memberCount: 5,
    stepsCompleted: 0, // 0/8
    stepProgress: 6,   // 6%
    makalahProgress: 0,
    steps: generateSteps(0, [0], ['Cahyo', 'Imron', 'Taufik', 'Slamet', 'Cahyo', 'Imron', 'Taufik', 'Slamet']),
    makalahSections: generateMakalah(0),
  },
  {
    id: 'g7',
    code: 'G7',
    name: 'Group 7',
    theme: 'Tema Group 7 - Diisi oleh group',
    fullTheme: 'Tema Group 7 - Pengendalian Suhu Ruang Curing Oven Line 3',
    line: 'Line 3 Curing',
    department: 'Quality Assurance',
    color: '#14B8A6',
    leader: 'Sugeng Riyadi',
    facilitator: 'Bambang Irawan (QA)',
    memberCount: 6,
    stepsCompleted: 0, // 0/8
    stepProgress: 0,   // 0%
    makalahProgress: 0,
    steps: generateSteps(0, [], ['Sugeng', 'Danang', 'Yanto', 'Gatot', 'Sugeng', 'Danang', 'Yanto', 'Gatot']),
    makalahSections: generateMakalah(0),
  },
  {
    id: 'g8',
    code: 'G8',
    name: 'Group 8',
    theme: 'Tema Group 8 - Diisi oleh group',
    fullTheme: 'Tema Group 8 - Pencegahan Goresan Packaging Unit Ekspor',
    line: 'Line Final Inspection',
    department: 'Quality Control Final',
    color: '#6366F1',
    leader: 'Panji Prasetya',
    facilitator: 'Siti Rahma (QC)',
    memberCount: 7,
    stepsCompleted: 0, // 0/8
    stepProgress: 6,   // 6%
    makalahProgress: 0,
    steps: generateSteps(0, [0], ['Panji', 'Kurniawan', 'Dimas', 'Tomi', 'Panji', 'Kurniawan', 'Dimas', 'Tomi']),
    makalahSections: generateMakalah(0),
  },
];

export const INITIAL_AGENDAS: AgendaItem[] = [
  {
    id: 'ag-1',
    groupId: 'g1',
    groupName: 'BLUESMI',
    title: 'Review Analisa Faktor Penyebab (Step 3 Fishbone Diagram)',
    date: '2026-11-14',
    time: '14:00 - 15:30 WIB',
    location: 'Meeting Room Lt. 2 / Gemba Line 9',
    type: 'Meeting Rutin',
    status: 'Scheduled',
    pic: 'Hendra Saputra',
  },
  {
    id: 'ag-2',
    groupId: 'g2',
    groupName: 'HEXAGONAL',
    title: 'Trial Sensor Poka-Yoke bersama Maintenance & QC',
    date: '2026-11-15',
    time: '09:00 - 11:00 WIB',
    location: 'Line 7 Machining Shop',
    type: 'Gemba Walk',
    status: 'Scheduled',
    pic: 'Aris Munandar',
  },
  {
    id: 'ag-3',
    groupId: 'g3',
    groupName: 'QCC ABS',
    title: 'Bimbingan Step 1: Penentuan Tema & Stratifikasi Pareto',
    date: '2026-11-16',
    time: '10:30 - 12:00 WIB',
    location: 'QA Training Center',
    type: 'Konsultasi Fasilitator',
    status: 'Scheduled',
    pic: 'Rudi Hartono',
  },
  {
    id: 'ag-4',
    groupId: 'g4',
    groupName: 'Group 4',
    title: 'Pengumpulan Data Siklus Waktu Welding Robot',
    date: '2026-11-17',
    time: '13:00 - 14:30 WIB',
    location: 'Area Robotika Line 4',
    type: 'Meeting Rutin',
    status: 'Scheduled',
    pic: 'Ahmad Fauzi',
  },
  {
    id: 'ag-5',
    groupId: 'g5',
    groupName: 'Group 5',
    title: 'Evaluasi Langkah 2: Target Reduksi Waktu Dies Change',
    date: '2026-11-18',
    time: '15:00 - 16:30 WIB',
    location: 'Ruang Diskusi Press Shop',
    type: 'Meeting Rutin',
    status: 'Scheduled',
    pic: 'Wahyu Nugroho',
  },
  {
    id: 'ag-6',
    groupId: 'g1',
    groupName: 'BLUESMI',
    title: 'Presentasi Progres Tahap 1 di Hadapan Steering Committee',
    date: '2026-11-25',
    time: '08:30 - 10:00 WIB',
    location: 'Auditorium SMI Lt. 3',
    type: 'Presentasi Tahap 1',
    status: 'Scheduled',
    pic: 'Hendra Saputra',
  },
];

export const INITIAL_MEMBERS: CircleMember[] = [
  {
    id: 'm-1',
    nik: 'SMI-18021',
    name: 'Hendra Saputra',
    groupId: 'g1',
    groupName: 'BLUESMI',
    role: 'Leader',
    department: 'Produksi Sub-Assembly',
    phone: '0812-9843-1101',
    email: 'hendra.s@smi-indonesia.co.id',
  },
  {
    id: 'm-2',
    nik: 'SMI-14002',
    name: 'Bambang Irawan',
    groupId: 'g1',
    groupName: 'BLUESMI',
    role: 'Fasilitator',
    department: 'Quality Assurance',
    phone: '0811-2244-5500',
    email: 'bambang.i@smi-indonesia.co.id',
  },
  {
    id: 'm-3',
    nik: 'SMI-20104',
    name: 'Rian Prasetyo',
    groupId: 'g1',
    groupName: 'BLUESMI',
    role: 'Sekretaris',
    department: 'Produksi Sub-Assembly',
    phone: '0813-7744-8899',
    email: 'rian.p@smi-indonesia.co.id',
  },
  {
    id: 'm-4',
    nik: 'SMI-19045',
    name: 'Aris Munandar',
    groupId: 'g2',
    groupName: 'HEXAGONAL',
    role: 'Leader',
    department: 'Machining & Stamping',
    phone: '0856-4422-3311',
    email: 'aris.m@smi-indonesia.co.id',
  },
  {
    id: 'm-5',
    nik: 'SMI-16012',
    name: 'Siti Rahma',
    groupId: 'g2',
    groupName: 'HEXAGONAL',
    role: 'Fasilitator',
    department: 'Quality Control',
    phone: '0812-3355-6677',
    email: 'siti.r@smi-indonesia.co.id',
  },
  {
    id: 'm-6',
    nik: 'SMI-21034',
    name: 'Rudi Hartono',
    groupId: 'g3',
    groupName: 'QCC ABS',
    role: 'Leader',
    department: 'Logistik & Assembly',
    phone: '0818-0911-2233',
    email: 'rudi.h@smi-indonesia.co.id',
  },
  {
    id: 'm-7',
    nik: 'SMI-19088',
    name: 'Ahmad Fauzi',
    groupId: 'g4',
    groupName: 'Group 4',
    role: 'Leader',
    department: 'Body Welding',
    phone: '0821-3344-5566',
    email: 'ahmad.f@smi-indonesia.co.id',
  },
  {
    id: 'm-8',
    nik: 'SMI-18090',
    name: 'Wahyu Nugroho',
    groupId: 'g5',
    groupName: 'Group 5',
    role: 'Leader',
    department: 'Press Shop',
    phone: '0877-2233-4455',
    email: 'wahyu.n@smi-indonesia.co.id',
  },
  {
    id: 'm-9',
    nik: 'SMI-22019',
    name: 'Cahyo Wibowo',
    groupId: 'g6',
    groupName: 'Group 6',
    role: 'Leader',
    department: 'Painting & Surface',
    phone: '0852-1122-3344',
    email: 'cahyo.w@smi-indonesia.co.id',
  },
  {
    id: 'm-10',
    nik: 'SMI-17031',
    name: 'Sugeng Riyadi',
    groupId: 'g7',
    groupName: 'Group 7',
    role: 'Leader',
    department: 'Quality Assurance',
    phone: '0813-9988-7766',
    email: 'sugeng.r@smi-indonesia.co.id',
  },
  {
    id: 'm-11',
    nik: 'SMI-20055',
    name: 'Panji Prasetya',
    groupId: 'g8',
    groupName: 'Group 8',
    role: 'Leader',
    department: 'Quality Control Final',
    phone: '0812-4455-6677',
    email: 'panji.p@smi-indonesia.co.id',
  },
];
