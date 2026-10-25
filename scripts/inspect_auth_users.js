import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function inspect() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error('Error listing users:', error);
    return;
  }
  console.log(`Found ${data.users.length} users:`);
  for (const u of data.users) {
    console.log(`- ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  app_metadata:`, JSON.stringify(u.app_metadata));
    console.log(`  user_metadata:`, JSON.stringify(u.user_metadata));
    console.log(`  identities:`, u.identities?.map(i => ({ provider: i.provider, identity_data: i.identity_data })));
  }

  // Also query public.profiles
  const { data: profiles, error: pError } = await supabaseAdmin.from('profiles').select('*');
  console.log('\npublic.profiles:');
  if (pError) console.error('Error fetching profiles:', pError);
  else console.log(profiles);
}

inspect().catch(console.error);
