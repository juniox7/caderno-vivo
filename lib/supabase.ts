import { createClient } from '@supabase/supabase-js';

// Usamos um fallback genérico apenas para evitar que a Vercel quebre durante o "build" (compilação)
// se as variáveis ainda não tiverem sido configuradas no painel da Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Usamos a SERVICE_ROLE_KEY porque essas chamadas sempre acontecerão no servidor (Server Components ou API Routes)
// que já são protegidas pela autenticação do Clerk.
export const supabase = createClient(supabaseUrl, supabaseKey);
