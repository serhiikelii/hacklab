#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Загружаем .env.local
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Отсутствуют env переменные!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

console.log('🔧 Подключение к Supabase...')
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log('🧹 Очистка таблицы audit_log...')

try {
  // Сначала проверим сколько записей
  const { count: totalCount } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact', head: true })

  console.log(`📊 Найдено записей: ${totalCount}`)

  if (totalCount === 0) {
    console.log('✅ Таблица уже пуста!')
    process.exit(0)
  }

  // Удаляем все записи
  const { error } = await supabase
    .from('audit_log')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Удаляем все

  if (error) {
    console.error('❌ Ошибка при очистке:', error)
    process.exit(1)
  }

  // Проверяем результат
  const { count: afterCount } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact', head: true })

  console.log(`✅ Таблица очищена! Удалено записей: ${totalCount}`)
  console.log(`📊 Осталось записей: ${afterCount}`)
} catch (err) {
  console.error('❌ Критическая ошибка:', err)
  process.exit(1)
}
