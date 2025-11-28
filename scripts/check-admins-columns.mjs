import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Проверка колонок admins...\n')

const { data, error } = await supabase.from('admins').select('*').limit(1)

if (error) {
  console.error('Ошибка:', error)
} else if (data && data.length > 0) {
  console.log('Колонки в таблице admins:')
  Object.keys(data[0]).forEach(col => console.log(`  - ${col}`))
} else {
  console.log('Таблица пустая')
}
