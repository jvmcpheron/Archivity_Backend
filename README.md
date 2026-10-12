# Archivity Backend

## Getting Started

1. npm install
2. set up .env with supabase key and supabase service role key
3. node src/server.js
4. check http://localhost:3000/activities in the browser

## Activities caching

Successful activity-list reads are cached in the backend process for 30 seconds.
Concurrent cache misses share one Supabase request, and successful activity
inserts invalidate the cache. Failed reads are not cached, so they can recover
as soon as the database is available. Restarting the backend also clears its
in-memory cache.
