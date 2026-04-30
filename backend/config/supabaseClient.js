const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ SUPABASE_URL atau SUPABASE_KEY belum diset dengan benar di file .env");
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

module.exports = supabase;
