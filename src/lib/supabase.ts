import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Journey {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MicroJobRow {
  id: string;
  journey_id: string;
  sequence: number;
  job_domain_stage: string;
  main_job: string;
  micro_job: string;
  high_level_description?: string;
  detail_description?: string;
  product_team: string;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export interface JobPerformerRow {
  id: string;
  name: string;
  group: string;
  color: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MicroJobPerformerRow {
  microjob_id: string;
  job_performer_id: string;
}

export interface ConnectionRow {
  id: string;
  journey_id: string;
  source_microjob_id: string;
  target_microjob_id: string;
  label?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

