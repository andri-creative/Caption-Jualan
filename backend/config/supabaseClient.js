const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = "https://swrmxxjzpvhpawrpzjpc.supabase.co";
const supabaseKey = "sb_publishable_5DgJRGXw37J9i7N2aA_9ZQ_3aB6VZ5u";

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ SUPABASE_URL atau SUPABASE_KEY belum diset dengan benar di file .env");
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

module.exports = supabase;
