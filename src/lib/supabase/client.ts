// ⚠️ ARCHIVO DESHABILITADO EN MODO DEMO
// La autenticación de Supabase ya no se usa

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
