// JTBD Journey Map Types

export interface JobPerformer {
  id: string;
  name: string;
  color: string;
  group: string; // taxonomy group
  description?: string;
}

export interface MicroJob {
  id: string;
  jobDomainStage: string;
  mainJob: string;
  microJob: string;
  jobPerformers: string[]; // JobPerformer IDs
  highLevelDescription: string;
  detailDescription: string;
  productTeam: string;
  phase: string; // Added phase column
  position: { x: number; y: number };
  sequence?: number;
  notes?: string;
}

export interface JourneyConnection {
  id: string;
  source: string; // MicroJob ID
  target: string; // MicroJob ID
  type: 'normal' | 'feedback' | 'conditional';
  label?: string;
  notes?: string; // explanation for non-linear connections
}

export interface JourneyMap {
  id: string;
  name: string;
  description: string;
  microJobs: MicroJob[];
  connections: JourneyConnection[];
  jobPerformers: JobPerformer[];
  productTeams: string[];
  createdAt: Date;
  updatedAt: Date;
}

// React Flow compatible types
export interface MicroJobNodeData extends Record<string, unknown> {
  microJob: MicroJob;
  jobPerformers: JobPerformer[];
  isHighlighted: boolean;
  isTeamHighlighted: boolean;
  isSelected?: boolean; // Added for node selection
  onExpandChange?: (isExpanded: boolean) => void; // Added for z-index management
}

// CSV Import types
export interface CSVMicroJobRow {
  sequence: number;
  micro_job: string;
  main_job: string;
  domain: string;
  phase: string; // Added phase column
  high_level_description: string;
  detail_description: string;
  job_performer: string; // comma-separated names
  job_performer_group?: string; // comma-separated groups (optional)
  product_team: string;
}

// UI State types
export interface FilterState {
  selectedJobPerformers: string[];
  selectedGroups: string[];
  selectedTeams: string[];
  selectedDomains: string[];
  selectedPhases: string[]; // Added phase filter
}

export interface SearchResult {
  type: 'job_performer' | 'micro_job' | 'main_job' | 'stage';
  id: string;
  title: string;
  description: string;
  relevance: number;
}