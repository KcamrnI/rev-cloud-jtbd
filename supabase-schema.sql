-- Supabase Database Schema for Rev-Cloud-JTBD
-- Run this in your Supabase SQL Editor to create the tables

-- 1. Journeys table (main journey maps)
CREATE TABLE journeys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Job Performers table (people/roles)
CREATE TABLE job_performers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL, -- hex color like #3B82F6
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Micro Jobs table (individual tasks/steps)
CREATE TABLE micro_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    job_domain_stage VARCHAR(255) NOT NULL,
    main_job VARCHAR(255) NOT NULL,
    micro_job VARCHAR(255) NOT NULL,
    phase VARCHAR(255) NOT NULL,
    high_level_description TEXT,
    detail_description TEXT,
    product_team VARCHAR(255) NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Junction table for micro jobs and job performers (many-to-many)
CREATE TABLE microjob_performers (
    microjob_id UUID REFERENCES micro_jobs(id) ON DELETE CASCADE,
    job_performer_id UUID REFERENCES job_performers(id) ON DELETE CASCADE,
    PRIMARY KEY (microjob_id, job_performer_id)
);

-- 5. Connections table (edges between micro jobs)
CREATE TABLE connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
    source_microjob_id UUID REFERENCES micro_jobs(id) ON DELETE CASCADE,
    target_microjob_id UUID REFERENCES micro_jobs(id) ON DELETE CASCADE,
    label VARCHAR(255),
    type VARCHAR(50) DEFAULT 'smoothstep',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_micro_jobs_journey_id ON micro_jobs(journey_id);
CREATE INDEX idx_micro_jobs_sequence ON micro_jobs(sequence);
CREATE INDEX idx_connections_journey_id ON connections(journey_id);
CREATE INDEX idx_connections_source ON connections(source_microjob_id);
CREATE INDEX idx_connections_target ON connections(target_microjob_id);

-- RLS (Row Level Security) - Enable when you add authentication
-- ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE micro_jobs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE job_performers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE microjob_performers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

