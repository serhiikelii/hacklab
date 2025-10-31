/**
 * Простой скрипт для обновления категории в Supabase через REST API
 */

const SUPABASE_URL = 'https://leiornbrnenbaabeqawk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaW9ybmJybmVuYmFhYmVxYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU4ODQ1MCwiZXhwIjoyMDc3MTY0NDUwfQ.vN_S0ib5x1aIqJC7BzDylxIt929zvascaZdxitTRUDA';

async function updateWatchCategory() {
  try {
    console.log('Обновление категории watch...');

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/device_categories?slug=eq.watch`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name_en: 'Apple Watch',
          name_cz: 'Apple Watch',
          name_ru: 'Apple Watch'
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${error}`);
    }

    const data = await response.json();
    console.log('✅ Категория успешно обновлена:', data);
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error);
    process.exit(1);
  }
}

updateWatchCategory();
