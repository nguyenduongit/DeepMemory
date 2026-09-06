import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://enehanbjjoofswlcawik.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZWhhbmJqam9vZnN3bGNhd2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Mjk1NTgsImV4cCI6MjEwMzUwNTU1OH0.oUW_yA2Beqr1rNqaE8-yS1VgrKK2__uYAVHDUPk6Xvs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
