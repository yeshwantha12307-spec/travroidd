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

async function revokeUnauthorizedAdmin() {
  console.log('--- Step 1: Revoking admin privileges from yeshwantha1237@gmail.com in Supabase ---');

  // 1. Get user
  const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing users:', listErr);
    process.exit(1);
  }

  const targetUser = users.find((u) => u.email?.toLowerCase() === 'yeshwantha1237@gmail.com');
  if (!targetUser) {
    console.log('User yeshwantha1237@gmail.com not found in auth.users.');
  } else {
    console.log(`Found user: ${targetUser.email} (ID: ${targetUser.id})`);
    console.log('Current app_metadata:', targetUser.app_metadata);
    console.log('Current user_metadata:', targetUser.user_metadata);

    // Update app_metadata and user_metadata to remove admin role
    const newAppMeta = { ...targetUser.app_metadata, role: 'customer' };
    const newUserMeta = { ...targetUser.user_metadata, role: 'customer' };

    const { data: updatedUser, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      {
        app_metadata: newAppMeta,
        user_metadata: newUserMeta,
      }
    );

    if (updateErr) {
      console.error('Error updating auth.users:', updateErr);
    } else {
      console.log('Successfully demoted yeshwantha1237@gmail.com in auth.users.');
      console.log('New app_metadata:', updatedUser.user.app_metadata);
      console.log('New user_metadata:', updatedUser.user.user_metadata);
    }

    // 2. Update public.profiles
    const { data: pData, error: pErr } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'customer', updated_at: new Date().toISOString() })
      .eq('id', targetUser.id);

    if (pErr) {
      console.error('Error updating profiles table:', pErr);
    } else {
      console.log('Successfully updated public.profiles for yeshwantha1237@gmail.com to role: customer');
    }
  }

  // Also ensure ONLY admin@travroidd.com has role admin in profiles
  console.log('\n--- Step 2: Enforcing role in public.profiles table ---');
  const { data: allProfiles, error: profErr } = await supabaseAdmin.from('profiles').select('*');
  if (profErr) {
    console.error('Error selecting profiles:', profErr);
  } else {
    console.log('All profiles currently in database:');
    for (const p of allProfiles) {
      if (p.email?.toLowerCase() !== 'admin@travroidd.com' && p.role === 'admin') {
        console.warn(`WARNING: Found unauthorized admin profile: ${p.email}. Demoting to customer...`);
        await supabaseAdmin.from('profiles').update({ role: 'customer' }).eq('id', p.id);
        console.log(`Demoted ${p.email} to customer in profiles.`);
      } else {
        console.log(`- ${p.email}: ${p.role}`);
      }
    }
  }

  // 3. Verify final state
  console.log('\n--- Step 3: Verification of final user states ---');
  const { data: { users: verifyUsers } } = await supabaseAdmin.auth.admin.listUsers();
  for (const u of verifyUsers) {
    console.log(`- ${u.email}: app_metadata.role = "${u.app_metadata?.role}", user_metadata.role = "${u.user_metadata?.role}"`);
  }
}

revokeUnauthorizedAdmin().catch(console.error);
