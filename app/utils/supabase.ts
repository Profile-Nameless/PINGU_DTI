import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'user' | 'organizer' | 'admin'

export interface UserMetadata {
  role: UserRole
  full_name?: string
  college?: string
  department?: string
  year?: string
}

export interface AuthError {
  message: string
} 