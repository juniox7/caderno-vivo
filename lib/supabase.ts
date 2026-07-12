import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usamos a SERVICE_ROLE_KEY porque essas chamadas sempre acontecerão no servidor (Server Components ou API Routes)
// que já são protegidas pela autenticação do Clerk.
export const supabase = createClient(supabaseUrl, supabaseKey);
