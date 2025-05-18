// Supabase client config
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zpcdnbdjptnydqelxieb.supabase.co'; // TODO: Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY2RuYmRqcHRueWRxZWx4aWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjUxNjQsImV4cCI6MjA2MzEwMTE2NH0.M4VR4_jkFdjLbwh9y8GpSBi8H3q7EVblNQxck5_DyaY'; // TODO: Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
