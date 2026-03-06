import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Client à utiliser dans les composants React côté navigateur
export const createClient = () => createClientComponentClient()
