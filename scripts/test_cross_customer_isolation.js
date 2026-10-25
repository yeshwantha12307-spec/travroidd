import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);

async function testBookingIsolation() {
  const ts = Date.now();
  const custA = `userA_${ts}@test.com`;
  const custB = `userB_${ts}@test.com`;
  const pass = 'Password123!Safe';

  const { data: uA } = await supabaseAdmin.auth.admin.createUser({ email: custA, password: pass, email_confirm: true });
  const { data: uB } = await supabaseAdmin.auth.admin.createUser({ email: custB, password: pass, email_confirm: true });

  const { data: authA } = await supabaseAnon.auth.signInWithPassword({ email: custA, password: pass });
  const { data: authB } = await supabaseAnon.auth.signInWithPassword({ email: custB, password: pass });

  const clientA = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${authA.session.access_token}` } },
  });
  const clientB = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${authB.session.access_token}` } },
  });

  // Customer B creates a booking
  const bookingId = `TRV-B${ts.toString().slice(-4)}`;
  const { data: insertedB, error: insErr } = await clientB.from('bookings').insert([{
    id: bookingId,
    user_id: uB.user.id,
    full_name: 'Customer B',
    email: custB,
    phone: '9876543210',
    destination: 'Goa',
    travel_date: '2026-11-01',
    travelers: 2,
    price_per_person: 7999,
    total_amount: 15998,
    status: 'pending'
  }]).select();

  console.log('Customer B inserted booking:', insertedB ? 'SUCCESS' : insErr?.message);

  // Customer A queries all bookings
  const { data: aView } = await clientA.from('bookings').select('*');
  console.log('Customer A query result count:', aView?.length);
  const aSeesB = aView?.some(b => b.id === bookingId);
  console.log('Did Customer A see Customer B booking?:', aSeesB ? 'LEAK!' : 'PROTECTED (NO)');

  // Customer A attempts to update Customer B booking
  const { data: aUpdate, error: aUpErr } = await clientA.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId).select();
  console.log('Customer A update attempt on B booking:', aUpdate?.length ? 'UNAUTHORIZED UPDATE!' : 'DENIED / 0 rows updated');

  // Clean up
  await supabaseAdmin.from('bookings').delete().eq('id', bookingId);
  await supabaseAdmin.auth.admin.deleteUser(uA.user.id);
  await supabaseAdmin.auth.admin.deleteUser(uB.user.id);
  console.log('Cleaned up test data.');
}

testBookingIsolation().catch(console.error);
