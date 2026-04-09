import { createClient } from '@supabase/supabase-js';

// Menggunakan nilai yang diberikan langsung untuk memastikan koneksi berhasil
const supabaseUrl = 'https://vcilycmqgvoxpnytwkyx.supabase.co';
const supabaseAnonKey = 'sb_publishable_E4RP-ad0YxnXF3AoBZF7Qg_QKe2TdJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
