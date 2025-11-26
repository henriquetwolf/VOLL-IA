import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yqsxgcebdxizwcabpqzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxc3hnY2ViZHhpendjYWJwcXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNTUyOTEsImV4cCI6MjA3OTczMTI5MX0.cQepmA3EMAx2-GfDhT_QqHEExg-G-bPUVmC4bjiktiQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);