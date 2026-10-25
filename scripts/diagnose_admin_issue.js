import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { db } from '../server/db.js';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== 1. SQLite Users with Role = Admin ===');
const sqliteAdmins = db.prepare("SELECT id, email, role, auth_provider, must_change_password FROM users WHERE role = 'admin'").all();
console.log(sqliteAdmins);

console.log('\n=== 2. SQLite User yeshwantha1237@gmail.com ===');
const sqliteYesh = db.prepare("SELECT id, email, role, auth_provider, must_change_password FROM users WHERE email LIKE '%yeshwanth%'").all();
console.log(sqliteYesh);

if (SUPABASE_URL && SERVICE_ROLE_KEY) {
  const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('\n=== 3. Supabase Auth Users ===');
  const { data: { users }, error: uErr } = await sb.auth.admin.listUsers();
  if (uErr) {
    console.error('Error listing Supabase users:', uErr);
  } else {
    for (const u of users) {
      console.log(`- ${u.email} (ID: ${u.id})`);
      console.log(`  app_metadata:`, u.app_metadata);
      console.log(`  user_metadata:`, u.user_metadata);
    }
  }

  console.log('\n=== 4. Supabase Profiles Table ===');
  const { data: profiles, error: pErr } = await sb.from('profiles').select('*');
  if (pErr) {
    console.error('Error selecting profiles:', pErr);
  } else {
    console.log(profiles);
  }
}
