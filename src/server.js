import Fastify from 'fastify';
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const { supabase } = await import('./supabase/client.js');

const app = Fastify();

// GET all activities
app.get('/activities', async () => {
  const { data, error } = await supabase
    .from('Activity')
    .select('*');

  if (error) return { error };
  return data;
});

// GET activity by ID
app.get('/activities/:id', async (req) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('Activity')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { error };
  return data;
});

app.listen({ port: 3000 });
