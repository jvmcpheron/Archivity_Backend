# Archivity Backend

## Getting Started

1. npm install
2. set up .env with supabase key and supabase service role key
3. node src/server.js
4. check http://localhost:3000/activities in the browser

## Deploying to Render

Create a Render Web Service for this backend, using `npm install` as the build
command and `npm start` as the start command. Add `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` in the service's environment variables. The server
binds to `0.0.0.0` and uses Render's `PORT` value (falling back to port 3000
locally).

## Activities caching

Successful activity-list reads are cached in the backend process for 30 seconds.
Concurrent cache misses share one Supabase request, and successful activity
inserts invalidate the cache. Failed reads are not cached, so they can recover
as soon as the database is available. Restarting the backend also clears its
in-memory cache.
