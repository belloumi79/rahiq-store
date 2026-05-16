import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcvyhztkhvswwbbzqdrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnloenRraHZzd3diYnpxZHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTIxMjcsImV4cCI6MjA5NDA4ODEyN30.E8DT7XP5F0gxusbB-g3jkXjxpUFRP6OgH1g9GzJUmsQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('categories').select('*');
  console.log('Categories:', data, error);
}

test();
