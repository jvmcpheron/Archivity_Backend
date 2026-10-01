import Fastify from 'fastify';
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const { supabase } = await import('./supabase/client.js');
const { getActivities, addActivity } = await import('./services/activitiesService.js');

const app = Fastify();

// GET all activities
app.get('/activities', async (_request, reply) => {
  const { data, error } = await getActivities();

  if (error) return reply.code(500).send({ error });
  return data;
});

app.post('/activities', async (request, reply) => {
  const { data, error } = await addActivity(request.body);

  if (error) return reply.code(500).send({ error });
  return reply.code(201).send(data);
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
