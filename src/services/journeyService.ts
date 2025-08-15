import { supabase, Journey } from '../lib/supabase';
import { MicroJob, JobPerformer, JourneyConnection } from '../types';

// Save a complete journey (microjobs, performers, connections)
export async function saveJourney(
  name: string,
  description: string,
  microJobs: MicroJob[],
  jobPerformers: JobPerformer[],
  connections: JourneyConnection[]
): Promise<{ success: boolean; journeyId?: string; error?: string }> {
  try {
    // 1. Create journey
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .insert({ name, description })
      .select()
      .single();

    if (journeyError) throw journeyError;

    const journeyId = journey.id;

    // 2. Insert job performers (use upsert to handle existing IDs)
    const performersData = jobPerformers.map(jp => ({
      id: jp.id,
      name: jp.name,
      group_name: jp.group,
      color: jp.color,
      description: '', // Add default description
    }));

    const { error: performersError } = await supabase
      .from('job_performers')
      .upsert(performersData, { onConflict: 'id' });

    if (performersError) throw performersError;

    // 3. Insert micro jobs
    const microJobsData = microJobs.map(mj => ({
      id: mj.id,
      journey_id: journeyId,
      sequence: mj.sequence || 0,
      job_domain_stage: mj.jobDomainStage,
      main_job: mj.mainJob,
      micro_job: mj.microJob,
      phase: mj.phase,
      high_level_description: mj.highLevelDescription || '',
      detail_description: mj.detailDescription || '',
      product_team: mj.productTeam,
      position_x: mj.position.x,
      position_y: mj.position.y,
    }));

    const { error: microJobsError } = await supabase
      .from('micro_jobs')
      .upsert(microJobsData, { onConflict: 'id' });

    if (microJobsError) throw microJobsError;

    // 4. Insert microjob-performer relationships
    const microJobPerformerData = microJobs.flatMap(mj =>
      mj.jobPerformers.map(performerId => ({
        microjob_id: mj.id,
        job_performer_id: performerId,
      }))
    );

    // Clear existing relationships for this journey's microjobs first
    if (microJobPerformerData.length > 0) {
      const microjobIds = microJobs.map(mj => mj.id);
      await supabase
        .from('microjob_performers')
        .delete()
        .in('microjob_id', microjobIds);

      const { error: relationshipError } = await supabase
        .from('microjob_performers')
        .insert(microJobPerformerData);

      if (relationshipError) throw relationshipError;
    }

    // 5. Insert connections
    if (connections.length > 0) {
      const connectionsData = connections.map(conn => ({
        id: conn.id,
        journey_id: journeyId,
        source_microjob_id: conn.source,
        target_microjob_id: conn.target,
        label: conn.label || '',
        type: conn.type || 'smoothstep',
      }));

      // Clear existing connections for this journey first
      await supabase
        .from('connections')
        .delete()
        .eq('journey_id', journeyId);

      const { error: connectionsError } = await supabase
        .from('connections')
        .insert(connectionsData);

      if (connectionsError) throw connectionsError;
    }

    return { success: true, journeyId };
  } catch (error) {
    console.error('Error saving journey:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Load a journey by ID
export async function loadJourney(journeyId: string): Promise<{
  success: boolean;
  data?: {
    journey: Journey;
    microJobs: MicroJob[];
    jobPerformers: JobPerformer[];
    connections: JourneyConnection[];
  };
  error?: string;
}> {
  try {
    // 1. Get journey
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .select('*')
      .eq('id', journeyId)
      .single();

    if (journeyError) throw journeyError;

    // 2. Get micro jobs
    const { data: microJobsRows, error: microJobsError } = await supabase
      .from('micro_jobs')
      .select('*')
      .eq('journey_id', journeyId)
      .order('sequence');

    if (microJobsError) throw microJobsError;

    // 3. Get job performers
    const { data: jobPerformersRows, error: performersError } = await supabase
      .from('job_performers')
      .select('*');

    if (performersError) throw performersError;

    // 4. Get microjob-performer relationships
    const { data: relationships, error: relationshipsError } = await supabase
      .from('microjob_performers')
      .select('*');

    if (relationshipsError) throw relationshipsError;

    // 5. Get connections
    const { data: connectionsRows, error: connectionsError } = await supabase
      .from('connections')
      .select('*')
      .eq('journey_id', journeyId);

    if (connectionsError) throw connectionsError;

    // Transform data back to frontend types
    const microJobs: MicroJob[] = microJobsRows.map(row => ({
      id: row.id,
      sequence: row.sequence,
      jobDomainStage: row.job_domain_stage,
      mainJob: row.main_job,
      microJob: row.micro_job,
      phase: row.phase,
      highLevelDescription: row.high_level_description || '',
      detailDescription: row.detail_description || '',
      productTeam: row.product_team,
      position: { x: row.position_x, y: row.position_y },
      jobPerformers: relationships
        .filter(rel => rel.microjob_id === row.id)
        .map(rel => rel.job_performer_id),
    }));

    const jobPerformers: JobPerformer[] = jobPerformersRows.map(row => ({
      id: row.id,
      name: row.name,
      group: row.group_name,
      color: row.color,
    }));

    const connections: JourneyConnection[] = connectionsRows.map(row => ({
      id: row.id,
      source: row.source_microjob_id,
      target: row.target_microjob_id,
      label: row.label,
      type: row.type === 'smoothstep' ? 'normal' : row.type as any,
    }));

    return {
      success: true,
      data: {
        journey,
        microJobs,
        jobPerformers,
        connections,
      },
    };
  } catch (error) {
    console.error('Error loading journey:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// List all journeys
export async function listJourneys(): Promise<{
  success: boolean;
  journeys?: Journey[];
  error?: string;
}> {
  try {
    const { data: journeys, error } = await supabase
      .from('journeys')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return { success: true, journeys };
  } catch (error) {
    console.error('Error listing journeys:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Delete a journey and all related data
export async function deleteJourney(journeyId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Supabase will cascade delete all related records due to ON DELETE CASCADE
    const { error } = await supabase
      .from('journeys')
      .delete()
      .eq('id', journeyId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting journey:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Update journey metadata
export async function updateJourneyMetadata(
  journeyId: string,
  name: string,
  description: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('journeys')
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq('id', journeyId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating journey:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
