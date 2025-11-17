'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('[SERVER] Login attempt for:', email)

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting errors in server action
            console.error('[SERVER] Error setting cookie:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.error('[SERVER] Error removing cookie:', error)
          }
        },
      },
    }
  )

  // STEP 1: Check rate limit
  const { data: rateLimitCheck, error: rateLimitError } = await supabase.rpc(
    'check_rate_limit',
    { p_email: email }
  )

  console.log('[SERVER] Rate limit check:', { allowed: rateLimitCheck, error: rateLimitError?.message })

  if (rateLimitError) {
    console.error('[SERVER] Rate limit check failed:', rateLimitError)
    // Continue with login even if rate limit check fails (fail open for availability)
  }

  if (rateLimitCheck === false) {
    // Get reset time for user feedback
    const { data: resetTime } = await supabase.rpc('get_rate_limit_reset_time', {
      p_email: email,
    })

    const timeUntilReset = resetTime
      ? Math.ceil((new Date(resetTime).getTime() - new Date().getTime()) / 1000 / 60)
      : 15

    console.log('[SERVER] Rate limit exceeded for:', email, 'Reset in:', timeUntilReset, 'minutes')

    return {
      error: `Слишком много попыток входа. Попробуйте снова через ${timeUntilReset} минут.`,
      rateLimited: true
    }
  }

  // STEP 2: Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log('[SERVER] Auth result:', {
    success: !authError,
    userId: authData?.user?.id,
    error: authError?.message
  })

  // STEP 3: Record login attempt
  const loginSuccess = !authError && !!authData.user
  await supabase.rpc('record_login_attempt', {
    p_email: email,
    p_success: loginSuccess,
    p_ip_address: null, // IP would be captured from headers in production
    p_user_agent: null, // User agent from headers
  })

  if (authError) {
    console.log('[SERVER] Login failed - recording attempt')
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Ошибка аутентификации' }
  }

  // STEP 4: Check if user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('id, role, is_active')
    .eq('user_id', authData.user.id)
    .eq('is_active', true)
    .single()

  console.log('[SERVER] Admin check:', {
    found: !!adminData,
    role: adminData?.role,
    error: adminError?.message,
    errorCode: adminError?.code,
    details: adminError?.details
  })

  if (adminError || !adminData) {
    // User is not an admin - sign them out
    await supabase.auth.signOut()

    // Record failed admin check (update the successful login attempt to failure)
    await supabase.rpc('record_login_attempt', {
      p_email: email,
      p_success: false,
      p_ip_address: null,
      p_user_agent: null,
    })

    return { error: `У вас нет прав администратора` }
  }

  console.log('[SERVER] Login successful for:', email, 'Role:', adminData.role)

  // Success - redirect will happen in the component
  return { success: true }
}
