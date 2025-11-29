#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing env variables!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'OK' : 'MISSING')
  process.exit(1)
}

console.log('Connecting to Supabase...')
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log('Clearing audit_log table...')

try {
  // First check how many records
  const { count: totalCount } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact', head: true })

  console.log(`Found records: ${totalCount}`)

  if (totalCount === 0) {
    console.log('Table is already empty!')
    process.exit(0)
  }

  // Delete all records
  const { error } = await supabase
    .from('audit_log')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (error) {
    console.error('ERROR during cleanup:', error)
    process.exit(1)
  }

  // Check result
  const { count: afterCount } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact', head: true })

  console.log(`Table cleared! Deleted records: ${totalCount}`)
  console.log(`Remaining records: ${afterCount}`)
} catch (err) {
  console.error('CRITICAL ERROR:', err)
  process.exit(1)
}
