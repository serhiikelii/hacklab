import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔌 Тестирование подключения к Supabase...\n')

  try {
    // Проверка подключения
    const { data: categories, error: categoriesError } = await supabase
      .from('device_categories')
      .select('*')
      .limit(1)

    if (categoriesError) {
      console.error('❌ Ошибка при запросе к таблице device_categories:', categoriesError.message)
      console.log('\n⚠️  Возможно, таблицы еще не созданы. Используйте миграцию из supabase/migrations/20251024_initial_schema.sql\n')
      return
    }

    console.log('✅ Подключение к Supabase успешно!')
    console.log(`📊 Количество категорий: ${categories?.length || 0}`)

    // Проверка структуры таблиц
    const { data: models } = await supabase
      .from('device_models')
      .select('*')
      .limit(1)

    const { data: services } = await supabase
      .from('services')
      .select('*')
      .limit(1)

    const { data: prices } = await supabase
      .from('prices')
      .select('*')
      .limit(1)

    console.log(`📱 Количество моделей: ${models?.length || 0}`)
    console.log(`🛠️  Количество услуг: ${services?.length || 0}`)
    console.log(`💰 Количество цен: ${prices?.length || 0}`)

    if (categories && categories.length > 0) {
      console.log('\n📋 Пример категории:')
      console.log(JSON.stringify(categories[0], null, 2))
    }

    console.log('\n✨ База данных готова к использованию!')
  } catch (error) {
    console.error('❌ Неожиданная ошибка:', error)
  }
}

testConnection()
