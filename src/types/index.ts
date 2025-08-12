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
  position: { x: number; y: number };
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
}

// CSV Import types
export interface CSVMicroJobRow {
  job_domain_stage: string;
  main_job: string;
  micro_job: string;
  job_performers: string; // comma-separated names
  high_level_description: string;
  detail_description: string;
  product_team: string;
  notes?: string;
}

// UI State types
export interface FilterState {
  selectedJobPerformer: string | null;
  selectedTeam: string | null;
  selectedStage: string | null;
}

export interface SearchResult {
  type: 'job_performer' | 'micro_job' | 'main_job' | 'stage';
  id: string;
  title: string;
  description: string;
  relevance: number;
}