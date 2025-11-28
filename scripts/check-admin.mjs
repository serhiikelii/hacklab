#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Отсутствуют env переменные!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log('🔍 Проверка таблицы admins...\n')

// Проверяем всех админов
const { data: admins, error } = await supabase
  .from('admins')
  .select('*')

if (error) {
  console.error('❌ Ошибка:', error)
  process.exit(1)
}

console.log(`📊 Найдено администраторов: ${admins?.length || 0}\n`)

if (admins && admins.length > 0) {
  admins.forEach((admin, i) => {
    console.log(`${i + 1}. 👤 Admin:`)
    console.log(`   ID (PK):       ${admin.id}`)
    console.log(`   User ID (FK):  ${admin.user_id}`)
    console.log(`   Email:         ${admin.email}`)
    console.log(`   Role:          ${admin.role}`)
    console.log(`   Active:        ${admin.is_active ? '✅' : '❌'}`)
    console.log()
  })
} else {
  console.log('⚠️  Таблица admins пуста!')
  console.log('   Нужно создать администратора через миграцию или SQL.')
}
