# Решение проблем с кэшированием и отказоустойчивостью

## БАГ 1: Не все цены отображаются на фронтенде

### Проблема
- **Модель:** Apple Watch SE 2 44mm
- **URL:** http://localhost:3000/pricelist/apple-watch/apple-watch-se-2-44mm
- **Симптомы:** В БД добавлено 3 цены, на фронте отображается только 1
- **Причина:** Изменения не подтягиваются даже после npm run dev, только на следующий день

### Найденная причина
В файле `src/lib/queries.ts:216-251` функция `getPricesForModel` использует `unstable_cache` с **одним статичным ключом для всех моделей**:

```typescript
export const getPricesForModel = unstable_cache(
  async (modelId: string) => { /* ... */ },
  ['prices-by-model'], // ❌ ПРОБЛЕМА: один ключ для ВСЕХ моделей!
  { revalidate: 1800 }
);
```

**Результат:**
- Все модели получают данные первой закэшированной модели
- Apple Watch SE 2 44mm показывает цены другой модели
- Кэш живет 30 минут, поэтому изменения видны только на следующий день

### Решение
Убрать `unstable_cache` для `getPricesForModel`:

```typescript
export async function getPricesForModel(modelId: string): Promise<ServicePrice[]> {
  try {
    if (!modelId || typeof modelId !== 'string') {
      console.error('Invalid modelId parameter');
      return [];
    }

    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return [];
    }

    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('model_id', modelId)
      .order('service_id');

    if (error) {
      console.error('Error fetching prices:', error);
      return [];
    }

    return data ? data.map(transformPrice) : [];
  } catch (error) {
    console.error('Unexpected error in getPricesForModel:', error);
    return [];
  }
}
```

**Плюсы:**
- Простое решение
- Всегда актуальные данные
- Next.js автоматически дедуплицирует запросы в рамках одного рендера

---

## БАГ 2: Сайт зависает при падении Supabase (КРИТИЧНО!)

### Проблема
Обнаружено при тестировании: когда Supabase недоступен:
- **Главная страница загружается несколько минут**
- Сайт полностью непригоден для использования
- Все страницы зависают на `fetch failed`

### Причины
- Middleware пытается проверить авторизацию через Supabase при каждом запросе
- Нет таймаутов для fetch запросов
- Нет fallback-режима при недоступности БД
- Next.js блокируется на async операциях с Supabase

---

## Предложения решений

### 1. Добавить таймауты для Supabase клиента (ПРИОРИТЕТ 1)

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_TIMEOUT = 5000; // 5 секунд

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url, options = {}) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT);

        return fetch(url, {
          ...options,
          signal: controller.signal
        }).finally(() => clearTimeout(timeout));
      }
    }
  }
);
```

### 2. Отключить auth middleware для публичных страниц (ПРИОРИТЕТ 1)

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const isPublicPage = request.nextUrl.pathname.startsWith('/pricelist') ||
                       request.nextUrl.pathname === '/';

  // Публичные страницы доступны без проверки auth
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Проверка auth только для /admin
  const supabase = createServerClient(/* ... */);
  // ...existing auth logic...
}
```

### 3. Graceful degradation в queries (ПРИОРИТЕТ 2)

```typescript
// src/lib/queries.ts
export async function getPricesForModel(modelId: string) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning empty data');
      return [];
    }

    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('model_id', modelId);

    if (error) {
      console.error('Error fetching prices:', error);
      return []; // Вернуть пустой массив вместо краша
    }

    return data?.map(transformPrice) || [];
  } catch (error) {
    console.error('DB unavailable, returning empty data:', error);
    return []; // Fallback при падении БД
  }
}
```

### 4. Static Site Generation для публичных страниц (ПРИОРИТЕТ 3)

```typescript
// src/app/pricelist/[category]/[model]/page.tsx
export async function generateStaticParams() {
  // Генерировать статические страницы для всех моделей при build
  const categories = await getCategories();
  const params = [];

  for (const category of categories) {
    const models = await getModelsForCategory(category.slug);
    for (const model of models) {
      params.push({
        category: category.slug,
        model: model.slug
      });
    }
  }

  return params;
}

// Revalidate every hour
export const revalidate = 3600;
```

---

## План действий

### Немедленно (когда Supabase заработает):
1. ✅ Исправить баг с кэшированием цен (убрать unstable_cache из getPricesForModel)
2. ✅ Добавить таймауты для Supabase клиента
3. ✅ Отключить auth middleware для публичных страниц

### В ближайшее время:
4. Добавить graceful degradation во все query функции
5. Добавить loading states и error boundaries в UI
6. Протестировать работу сайта при недоступности БД

### Долгосрочно:
7. Рассмотреть ISR/SSG для публичного контента
8. Добавить мониторинг доступности Supabase
9. Настроить retry logic с exponential backoff

---

## Статус

**БАГ 1:** ✅ Решение готово, ждет тестирования
**БАГ 2:** 💡 Предложения готовы, требуют имплементации

**Блокер:** Supabase недоступен, невозможно протестировать исправления

**Дата анализа:** 2025-12-08
