import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zntgtcpalrfefwzntije.supabase.co';
const supabaseKey = 'sb_publishable_JUBag4x9yx1YK0jXr8eMOQ_zNVYRGX3';

export const supabase = createClient(supabaseUrl, supabaseKey);