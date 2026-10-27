import Fastify from 'fastify';
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const { supabase } = await import('./supabase/client.js');
const {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} = await import('./services/activitiesService.js');

const activityProperties = {
  Name: { type: 'string', nullable: true },
  Location: { type: 'string', nullable: true },
  Category: { type: 'string', nullable: true },
  Description: { type: 'string', nullable: true },
  Tier: { type: 'string', nullable: true },
  Wishlist: { type: 'boolean', nullable: true },
  Completed: { type: 'boolean', nullable: true },
  Image_URL: { type: 'string', nullable: true },
  URL: { type: 'string', nullable: true },
};

const app = Fastify();

// GET all activities
app.get('/activities', async (_request, reply) => {
  const { data, error } = await getActivities();

  if (error) return reply.code(500).send({ error });
  return data;
});

app.post(
  '/activities',
  {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        properties: activityProperties,
      },
    },
  },
  async (request, reply) => {
    const { data, error } = await addActivity(request.body);

    if (error) return reply.code(500).send({ error });
    return reply.code(201).send(data);
  },
);

app.patch(
  '/activities/:id',
  {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        minProperties: 1,
        properties: activityProperties,
      },
    },
  },
  async (request, reply) => {
    const { id } = request.params;
    const { data, error } = await updateActivity(id, request.body);

    if (error) return reply.code(500).send({ error });
    return data;
  },
);

app.delete('/activities/:id', async (request, reply) => {
  const { id } = request.params;
  const { data, error } = await deleteActivity(id);

  if (error) return reply.code(500).send({ error });
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

const port = Number(process.env.PORT || 3000);
await app.listen({ port, host: '0.0.0.0' });
