import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hjshvmjiloisoweiiurk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc2h2bWppbG9pc293ZWlpdXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNTY4OTYsImV4cCI6MjA3OTczMjg5Nn0.EH4y38efoPlqV_G6c_BEg-qhcKfkOwT1zMMwsJq8rp4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);