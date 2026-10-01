import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');

export const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
