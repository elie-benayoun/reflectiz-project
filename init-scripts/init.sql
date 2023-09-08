-- Create domains table
CREATE TABLE IF NOT EXISTS domains (
    id serial PRIMARY KEY,
    domain TEXT NOT NULL,
    last_analyzed TIMESTAMP,
    in_progress BOOLEAN DEFAULT FALSE
);

-- Create domains_analysis_history table
CREATE TABLE IF NOT EXISTS domains_analysis_history (
    id serial PRIMARY KEY,
    domain_id INTEGER NOT NULL,
    FOREIGN KEY (domain_id) REFERENCES domains(id),
    run_at TIMESTAMP ,
    whois_data JSON,
    virus_total_data JSON
);

-- Create api_request_history table
CREATE TABLE IF NOT EXISTS api_request_history (
    id serial PRIMARY KEY,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    query JSON,
    body JSON,
    origin TEXT,
    run_at TIMESTAMP
);