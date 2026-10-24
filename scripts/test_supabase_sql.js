import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function probe() {
  // Try /pg/query or /rest/v1 or auth
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ query: 'SELECT 1 as num;' }),
  });

  console.log('/pg/query status:', res.status);
  try {
    const data = await res.json();
    console.log('/pg/query response:', data);
  } catch {
    console.log('/pg/query not json');
  }
}

probe().catch(console.error);
