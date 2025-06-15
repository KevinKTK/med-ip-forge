-- Drop existing tables to ensure a clean slate if running the full script
DROP TABLE IF EXISTS patents CASCADE;
DROP TABLE IF EXISTS funding_contracts CASCADE;
DROP TABLE IF EXISTS staking_pools CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

-- First create artists table (no dependencies)
create table artists (
                         id bigint primary key generated always as identity,
                         name text not null,
                         avatar text,
                         genre text not null,
                         verified boolean not null default false,
                         wallet_address text,
                         total_raised numeric not null default 0,
                         completed_projects integer not null default 0,
                         followers integer not null default 0,
                         rating numeric not null default 0,
                         current_project text,
                         bio text,
                         created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                         updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Then create projects table (depends on artists, but for circular dependencies, FKs to staking_pools and funding_contracts are added later)
create table projects (
                          id bigint primary key generated always as identity,
                          title text not null,
                          artist_id bigint references artists(id) not null,
                          category text not null,
                          target_funding numeric not null,
                          current_funding numeric not null default 0,
                          staking_apy numeric not null,
                          time_remaining text not null,
                          description text not null,
                          risk_level text not null,
                          milestones integer not null,
                          completed_milestones integer not null default 0,
                          status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
                          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Then create staking_pools table (project_id FK will be added later)
create table staking_pools (
                               id bigint primary key generated always as identity,
                               project_id bigint, -- Temporarily nullable for initial creation
                               name text not null,
                               description text not null,
                               contract_address text not null,
                               deployer_address text not null,
                               deployment_date timestamp with time zone not null,
                               apy numeric not null,
                               lockup_periods integer[] not null,
                               total_staked numeric not null default 0,
                               total_stakers integer not null default 0,
                               is_active boolean not null default true,
                               asset_type text not null default 'IP',
                               current_completion numeric not null default 0,
                               total_pool_size numeric not null default 0,
                               available_capacity numeric not null default 0,
                               risk_level text not null,
                               created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                               updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create funding_contracts table (project_id FK will be added later)
create table funding_contracts (
                                   id bigint primary key generated always as identity,
                                   project_id bigint, -- Remains nullable for initial creation
                                   contract_address text not null unique,
                                   deployer_address text not null,
                                   deployment_date timestamp with time zone not null,
                                   max_funding numeric not null,
                                   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                                   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create patents table with corrected data types and project_id included
create table patents (
                         id uuid default uuid_generate_v4() primary key,
                         created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                         artist_id bigint not null,
                         project_id bigint,
                         filing_date timestamp with time zone not null,
                         title text not null,
                         description text not null,
                         ip_id text, -- Corrected type from bigint to text
                         ip_asset_address text, -- Corrected type from bigint to text
                         ip_asset_id text, -- Corrected type from bigint to text
                         ip_asset_chain bigint, -- This remains bigint for chain ID
                         patent_number text, -- Corrected type from bigint to text
                         category text not null,
                         ip_metadata_uri text not null,
                         ip_metadata_hash text not null,
                         nft_metadata_uri text not null,
                         nft_metadata_hash text not null,
                         license_terms_ids text[],
                         transaction_hash text,
                         status text not null
);

-- Add foreign key constraints after all tables are created

-- For staking_pools: Add FK to projects and set NOT NULL
alter table staking_pools
    add constraint fk_staking_pools_project_id
        foreign key (project_id) references projects(id);

alter table staking_pools alter column project_id set not null;

-- For funding_contracts: Add FK to projects
alter table funding_contracts
    add constraint fk_funding_contracts_project_id
        foreign key (project_id) references projects(id);

-- For patents: Add FKs to projects and artists
alter table patents
    add constraint fk_patents_project_id
        foreign key (project_id) references projects(id);

-- If project_id in patents should be NOT NULL, uncomment the line below:
-- alter table patents alter column project_id set not null;

alter table patents
    add constraint fk_patents_artist_id
        foreign key (artist_id) references artists(id);

-- Add staking_pool_id to projects and its FK
alter table projects
    add column staking_pool_id bigint;

alter table projects
    add constraint fk_projects_staking_pool_id
        foreign key (staking_pool_id) references staking_pools(id);

-- Add funding_contract_id to projects and its FK
alter table projects
    add column funding_contract_id bigint;

alter table projects
    add constraint fk_projects_funding_contract_id
        foreign key (funding_contract_id) references funding_contracts(id);

-- Create indexes for faster lookups
create index idx_projects_artist_id on projects(artist_id);
create index idx_staking_pools_project_id on staking_pools(project_id);
create index idx_patents_project_id on patents(project_id);
create index idx_patents_artist_id on patents(artist_id);
create index idx_projects_staking_pool_id on projects(staking_pool_id);
create index idx_projects_funding_contract_id on projects(funding_contract_id);
create index idx_funding_contracts_project_id on funding_contracts(project_id);