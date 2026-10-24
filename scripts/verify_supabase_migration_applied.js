import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);

async function checkMigration() {
  console.log('====================================================');
  console.log(' SUPABASE SQL MIGRATION APPLICATION AUDIT (READ-ONLY)');
  console.log('====================================================\n');

  const tables = ['profiles', 'bookings', 'enquiries'];
  const tableStatus = {};

  for (const table of tables) {
    const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
    if (error) {
      tableStatus[table] = {
        exists: false,
        error: error.message,
        code: error.code,
      };
    } else {
      tableStatus[table] = {
        exists: true,
        recordCountPreview: data.length,
      };
    }
  }

  console.log('Table existence in Supabase public schema:');
  for (const [table, status] of Object.entries(tableStatus)) {
    if (status.exists) {
      console.log(`  [EXISTS] Table "${table}" is present.`);
    } else {
      console.log(`  [NOT FOUND] Table "${table}": ${status.error} (Code: ${status.code})`);
    }
  }

  const allTablesExist = Object.values(tableStatus).every((s) => s.exists);

  console.log('\nMigration Applied Status:');
  if (allTablesExist) {
    console.log('  VERIFIED: All tables exist in Supabase.');
  } else {
    console.log('  NOT APPLIED: The SQL migration (20261024_init_schema_and_rls.sql) has NOT yet been run in the Supabase Dashboard SQL Editor.');
    console.log('  Evidence: PostgREST schema cache returned "Could not find table public.<name> in schema cache".');
  }

  // Check auth user in auth.users
  console.log('\nAuth User State in Supabase Auth:');
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) {
    console.log('  Error querying auth.users:', usersError.message);
  } else {
    const adminUser = usersData.users.find((u) => u.email === 'admin@travroidd.com');
    if (adminUser) {
      console.log(`  [EXISTS] admin@travroidd.com (ID: ${adminUser.id})`);
      console.log('  app_metadata:', JSON.stringify(adminUser.app_metadata));
      console.log('  user_metadata:', JSON.stringify(adminUser.user_metadata));
    } else {
      console.log('  [NOT FOUND] admin@travroidd.com does not exist in auth.users.');
    }
  }
}

checkMigration().catch(console.error);
