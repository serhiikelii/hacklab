import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Create a server-side Supabase client for auth operations
// This should be used in Server Components and API routes
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  })
}

// Admin role type from database
export type AdminRole = 'editor' | 'admin' | 'superadmin'

// Admin user type
export interface AdminUser {
  id: string
  user_id: string
  email: string
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
}

/**
 * Check if the current user is an admin
 * @param userId - User ID from auth.uid()
 * @returns true if user is an active admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return false
  }

  return true
}

/**
 * Get admin user details
 * @param userId - User ID from auth.uid()
 * @returns Admin user object or null
 */
export async function getAdminUser(
  userId: string
): Promise<AdminUser | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as AdminUser
}

/**
 * Check if user has specific admin role
 * @param userId - User ID from auth.uid()
 * @param role - Required role ('editor', 'admin', 'superadmin')
 * @returns true if user has the required role or higher
 */
export async function hasAdminRole(
  userId: string,
  role: AdminRole
): Promise<boolean> {
  const adminUser = await getAdminUser(userId)

  if (!adminUser) {
    return false
  }

  // Role hierarchy: superadmin > admin > editor
  const roleHierarchy = {
    editor: 1,
    admin: 2,
    superadmin: 3,
  }

  return roleHierarchy[adminUser.role] >= roleHierarchy[role]
}

/**
 * Update admin last login timestamp
 * @param userId - User ID from auth.uid()
 */
export async function updateAdminLastLogin(userId: string): Promise<void> {
  // Create untyped client to avoid TypeScript inference issues with admins table
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { error } = await supabase
    .from('admins')
    .update({
      last_login_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating admin last login:', error)
  }
}

/**
 * Sign in admin user
 * @param email - Admin email
 * @param password - Admin password
 * @returns Auth session or error
 */
export async function signInAdmin(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { data: null, error }
  }

  if (data.user) {
    // Check if user is an admin
    const isAdminUser = await isAdmin(data.user.id)
    if (!isAdminUser) {
      await supabase.auth.signOut()
      return {
        data: null,
        error: new Error('User is not authorized as admin'),
      }
    }

    // Update last login
    await updateAdminLastLogin(data.user.id)
  }

  return { data, error: null }
}

/**
 * Sign out admin user
 */
export async function signOutAdmin() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
