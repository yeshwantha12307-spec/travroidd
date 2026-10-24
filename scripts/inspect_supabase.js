import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function inspect() {
  console.log(`Connecting to Supabase project at ${SUPABASE_URL}...`);

  // 1. Inspect existing Auth users
  console.log('\n--- 1. Auth Users ---');
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) {
    console.error('Error listing users:', usersError);
  } else {
    console.log(`Found ${usersData.users.length} user(s):`);
    for (const u of usersData.users) {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Metadata:`, u.user_metadata);
    }
  }

  // 2. Check public tables
  console.log('\n--- 2. Public Tables & Data ---');
  const tables = ['profiles', 'bookings', 'enquiries', 'destinations'];
  for (const table of tables) {
    const { data, error } = await supabaseAdmin.from(table).select('*').limit(5);
    if (error) {
      console.log(`Table "${table}": Error / Not found (${error.message})`);
    } else {
      console.log(`Table "${table}": Accessible, record count (preview): ${data.length}`);
      if (data.length > 0) {
        console.log(`Sample row from ${table}:`, data[0]);
      }
    }
  }
}

inspect().catch(console.error);
