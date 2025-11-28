import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Checking admins table...\n')

const { data, error } = await supabase
  .from('admins')
  .select('*')

if (error) {
  console.error('Error:', error)
} else {
  console.log('Admins:', JSON.stringify(data, null, 2))
}
