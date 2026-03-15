-- Page views tracking table
create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  ip_hash text,
  user_agent text,
  referrer text,
  visited_at timestamptz not null default now()
);

-- Index for fast aggregation queries
create index if not exists page_views_visited_at_idx on page_views (visited_at);
create index if not exists page_views_path_idx on page_views (path);

-- No RLS needed — inserts go via service role from API route
-- Admins read via service role too
