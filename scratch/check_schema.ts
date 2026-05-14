
import { createClient } from '@supabase/supabase-base';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('Error fetching order:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columns in orders table:', Object.keys(data[0]));
  } else {
    console.log('No orders found to inspect columns.');
  }
}

checkSchema();
