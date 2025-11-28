# 🔧 Отчет: Исправление аутентификации админ-панели

**Дата:** 25 ноября 2024
**Задача:** Исправить проблему с сохранением изменений в админ-панели
**Статус:** ✅ Завершено

---

## 📋 Проблема

### Симптомы:
- Админ-панель не сохраняла изменения в таблицах БД
- Операции редактирования цен, изображений, моделей не работали
- В таблице `audit_log` появлялось `admin_id: NULL`
- RLS (Row Level Security) блокировал все операции записи

### Корневая причина:
Новая версия админ-панели использовала API routes (`src/app/api/admin/*`) с неправильным Supabase клиентом:
- Клиент создавался без cookies/session
- БД видела запросы как "анонимные"
- RLS блокировал все write операции
- Audit логи не могли получить `admin_id`

### Важное наблюдение:
**Старая рабочая версия на GitHub НЕ имела папки `src/app/api/admin`** - она работала через Server Actions с аутентифицированным клиентом.

---

## 🛠️ Выполненные исправления

### 1. Удалена неправильная архитектура
```bash
✅ Удалено: src/app/api/admin/
   - upload-model-image/route.ts
   - remove-model-image/route.ts
```

### 2. Создан правильный паттерн: Server Actions
**Файл:** `src/app/actions/images.ts` (новый, 350+ строк)

**Ключевая логика:**
```typescript
'use server'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function uploadModelImage(modelId: string, categorySlug: string, file: File) {
  // 1. Создаем аутентифицированный клиент с cookies
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // 2. Проверяем аутентификацию
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Необходима авторизация' }
  }

  // 3. Используем SERVICE_ROLE_KEY ТОЛЬКО для Storage
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Storage операции через admin клиент
  await supabaseAdmin.storage.from('device-images').upload(filePath, buffer)

  // 4. ✅ КРИТИЧНО: DB операции через аутентифицированный клиент!
  const { error: updateError } = await supabase  // ← НЕ supabaseAdmin!
    .from('device_models')
    .update({ image_url: imageUrl })
    .eq('id', modelId)

  // 5. Audit log работает автоматически благодаря аутентифицированному контексту
  const adminId = await getCurrentAdminId()
  await logAuditEvent({ adminId, action: 'UPLOAD', ... })
}
```

### 3. Исправлены все Server Actions (3 файла)
**Применен единый паттерн во всех `actions.ts`:**

```typescript
'use server'

import { createClient } from '@/lib/supabase-server'

export async function createModel(formData: FormData) {
  try {
    // ✅ Создаем аутентифицированный клиент в начале функции
    const supabase = await createClient()

    // Все операции через этот клиент получают auth контекст
    const { data, error } = await supabase
      .from('device_models')
      .insert(newModel)
      .select()
      .single()

    // Audit логи автоматически получают правильный admin_id
    await logCreate('device_models', data.id, newModel)

    return { success: true, data }
  } catch (error) {
    return { success: false, error: 'Ошибка' }
  }
}
```

**Исправленные файлы:**
- ✅ `src/app/admin/catalog/[category_slug]/models/actions.ts`
- ✅ `src/app/admin/catalog/[category_slug]/services/actions.ts`
- ✅ `src/app/admin/catalog/[category_slug]/models/[id]/actions.ts`

### 4. Исправлены все Server Components (5 файлов)
**Паттерн для `page.tsx`:**

```typescript
import { createClient } from '@/lib/supabase-server'

export default async function ModelsPage({ params }) {
  // ✅ Создаем аутентифицированный клиент
  const supabase = await createClient()

  // Запросы проходят RLS благодаря auth контексту
  const { data: models } = await supabase
    .from('device_models')
    .select('*')
    .eq('category_id', category.id)

  return <div>...</div>
}
```

**Исправленные файлы:**
- ✅ `src/app/admin/catalog/page.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/models/page.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/models/[id]/page.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/services/page.tsx`
- ✅ `src/app/admin/audit/page.tsx`

### 5. Обновлен Client Component
**Файл:** `src/app/admin/catalog/[category_slug]/models/[id]/ImageUploader.tsx`

**До:**
```typescript
// ❌ Неправильно - fetch к API route без auth
const response = await fetch('/api/admin/upload-model-image', {
  method: 'POST',
  body: formData,
})
```

**После:**
```typescript
// ✅ Правильно - прямой вызов Server Action
import { uploadModelImage, removeModelImage } from '@/app/actions/images'

const result = await uploadModelImage(modelId, categorySlug, file)
```

### 6. TypeScript исправления
- ✅ Исправлен импорт `createServerClient` из `@supabase/ssr`
- ✅ Добавлена типизация для cookies handlers
- ✅ Исправлен type cast для `prices` prop
- ✅ Добавлен `const supabase = await createClient()` в `catalog/page.tsx`
- ✅ Очищен `.next` cache
- ✅ TypeScript компилируется без ошибок

---

## 🔍 Глубокая проверка кода

### Проверено на отсутствие старой логики:

**1. ✅ Нет импортов неправильного клиента в админке:**
```bash
grep -r "from '@/lib/supabase'" src/app/admin/
# Результат: 0 файлов (все используют '@/lib/supabase-server')
```

**2. ✅ Нет fetch запросов к `/api/admin`:**
```bash
grep -r "fetch(.*\/api\/admin" src/
# Результат: 0 файлов
```

**3. ✅ Все Server Actions используют createClient():**
```bash
grep -r "const supabase = await createClient()" src/app/admin/
# Результат: 8 файлов - все правильно
```

**4. ✅ SERVICE_ROLE_KEY только для Storage:**
```bash
grep -r "SUPABASE_SERVICE_ROLE_KEY" src/
# Результат: 4 вхождения - только в images.ts для Storage операций
```

**5. ✅ Все формы используют Server Actions:**
- ImageUploader → uploadModelImage, removeModelImage
- AddModelForm → createModel
- EditModelForm → updateModel
- AddPriceForm → addPrice
- PricesTable → updatePrice, deletePrice
- AddServiceForm → createService
- ServiceToggle → toggleServiceActive

**6. ✅ Login и Auth корректны:**
- `login/actions.ts` использует `createServerClient` напрямую
- `admin/actions.ts` использует `createServerClient` для getAdminUser и signOutAction

**7. ✅ Публичное API (для фронтенда) корректно:**
- `src/app/api/categories/route.ts` - READ-ONLY, использует обычный клиент
- `src/app/api/models/route.ts` - READ-ONLY
- `src/app/api/prices/route.ts` - READ-ONLY

---

## 📊 Архитектура решения

### Правильная схема аутентификации:

```
┌─────────────────────────────────────────────────────────────┐
│ Client Component (ImageUploader.tsx)                        │
│ - Вызывает Server Action                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Server Action (images.ts)                                   │
│ 1. createServerClient + cookies → получает session          │
│ 2. supabase.auth.getUser() → проверяет авторизацию         │
│ 3. supabaseAdmin.storage → операции с bucket (SERVICE_KEY)  │
│ 4. supabase.from() → DB операции (с auth контекстом!)      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase Database + RLS                                     │
│ - Видит authenticated user                                  │
│ - RLS policies разрешают операции                           │
│ - Audit triggers получают правильный user_id                │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ audit_log table                                             │
│ - admin_id: 59cc5775-... (правильный ID)                   │
│ - action: 'UPLOAD' | 'CREATE' | 'UPDATE' | 'DELETE'        │
│ - table_name, record_id, old_data, new_data                │
└─────────────────────────────────────────────────────────────┘
```

### Ключевые моменты:

1. **cookies → session → auth context → RLS passes**
2. **SERVICE_ROLE_KEY** используется ТОЛЬКО для Storage bucket
3. **ANON_KEY + cookies** используется для всех DB операций
4. **getCurrentAdminId()** возвращает `admins.id` (PK), НЕ `admins.user_id` (FK)

---

## 🧪 Что нужно протестировать

### Критические сценарии:

1. **Загрузка изображения модели:**
   - Перейти: `/admin/catalog/{category_slug}/models/{id}`
   - Загрузить новое изображение
   - ✅ Ожидание: изображение загружается, `device_models.image_url` обновляется
   - ✅ Проверить: `audit_log` содержит запись с правильным `admin_id`

2. **Создание новой модели:**
   - Перейти: `/admin/catalog/{category_slug}/models`
   - Добавить новую модель
   - ✅ Ожидание: модель создается в БД
   - ✅ Проверить: `audit_log` содержит запись CREATE

3. **Редактирование модели:**
   - Открыть модель на редактирование
   - Изменить название/год/order
   - ✅ Ожидание: изменения сохраняются
   - ✅ Проверить: `audit_log` содержит запись UPDATE с old_data и new_data

4. **Добавление цены:**
   - На странице модели добавить цену для услуги
   - ✅ Ожидание: цена создается в `prices`
   - ✅ Проверить: `audit_log` содержит запись

5. **Обновление цены:**
   - Редактировать существующую цену
   - ✅ Ожидание: изменения сохраняются
   - ✅ Проверить: audit log с old/new данными

6. **Удаление цены:**
   - Удалить цену через таблицу
   - ✅ Ожидание: цена удаляется
   - ✅ Проверить: audit log с action='DELETE'

7. **Управление услугами категории:**
   - Перейти: `/admin/catalog/{category_slug}/services`
   - Добавить/включить/выключить услугу
   - ✅ Ожидание: `category_services` обновляется
   - ✅ Проверить: audit logs

8. **Просмотр audit логов:**
   - Перейти: `/admin/audit`
   - ✅ Ожидание: все операции видны с правильным admin_id и email

### SQL проверка admin_id:

```sql
-- Проверить последние записи audit_log
SELECT
  al.admin_id,
  a.email,
  a.role,
  al.action,
  al.table_name,
  al.created_at
FROM audit_log al
LEFT JOIN admins a ON al.admin_id = a.id
ORDER BY al.created_at DESC
LIMIT 20;

-- ✅ Ожидание: admin_id НЕ NULL, email заполнен
```

---

## 📁 Измененные файлы

### Новые файлы:
- ✅ `src/app/actions/images.ts` (350+ строк)

### Модифицированные файлы:
- ✅ `src/app/admin/catalog/[category_slug]/models/[id]/ImageUploader.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/models/actions.ts`
- ✅ `src/app/admin/catalog/[category_slug]/services/actions.ts`
- ✅ `src/app/admin/catalog/[category_slug]/models/[id]/actions.ts`
- ✅ `src/app/admin/catalog/page.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/models/page.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/models/[id]/page.tsx`
- ✅ `src/app/admin/catalog/[category_slug]/services/page.tsx`
- ✅ `src/app/admin/audit/page.tsx`

### Удаленные файлы:
- ✅ `src/app/api/admin/upload-model-image/route.ts`
- ✅ `src/app/api/admin/remove-model-image/route.ts`
- ✅ `src/app/api/admin/` (вся папка)

### Мусорные файлы (не используются, можно удалить):
- ⚠️ `src/app/actions/upload-image.ts` (старый, НЕ используется)
- ⚠️ `src/components/admin/ImageUpload.tsx` (старый, НЕ используется)

---

## 🎯 Статус задачи

| Пункт | Статус |
|-------|--------|
| Изучить Context7 документацию | ✅ |
| Проанализировать старую версию на GitHub | ✅ |
| Проверить текущий supabase.ts | ✅ |
| Найти где подставляются ID | ✅ |
| Удалить папку api/admin | ✅ |
| Создать Server Actions для изображений | ✅ |
| Исправить ImageUploader | ✅ |
| Исправить 3 файла actions.ts | ✅ |
| Исправить 5 файлов page.tsx | ✅ |
| Исправить TypeScript ошибки | ✅ |
| Очистить Next.js кэш | ✅ |
| Рефлексия кода | ✅ |
| Повторная проверка | ✅ |

---

## 💡 Выводы

### Что было неправильно:
❌ API routes без cookies → нет session → RLS блокирует → admin_id = NULL

### Что сделано правильно:
✅ Server Actions + createServerClient + cookies → есть session → RLS пропускает → admin_id корректный

### Ключевое правило:
**В Next.js App Router для authenticated операций ВСЕГДА использовать:**
1. Server Actions (`'use server'`)
2. `createServerClient` из `@supabase/ssr` с cookies
3. `SERVICE_ROLE_KEY` ТОЛЬКО для Storage
4. `ANON_KEY + cookies` для DB операций (чтобы работал RLS)

---

## 🚀 Следующие шаги

1. **Запустить dev сервер:** `npm run dev`
2. **Протестировать все сценарии** из раздела "Что нужно протестировать"
3. **Проверить audit_log** на наличие admin_id
4. **Если все работает** → git commit + push
5. **Опционально:** Удалить мусорные файлы (upload-image.ts, ImageUpload.tsx)

---

## 🔧 Дополнительное исправление (25.11.2024 - вечер)

### Проблема: Foreign key constraint в audit_log

**Ошибка:**
```
insert or update on table "audit_log" violates foreign key constraint "audit_log_admin_id_fkey"
Key (admin_id)=(46ac7cf6-6a72-4232-a07e-f448361605c6) is not present in table "admins"
```

**Корневая причина:**
- Триггер `log_audit_changes()` в миграции 038 вставлял `auth.uid()` напрямую в `audit_log.admin_id`
- `auth.uid()` возвращает `admins.user_id` (46ac7cf6...)
- Но `audit_log.admin_id` - это foreign key к `admins.id` (59cc5775...)
- Результат: нарушение FK constraint

**Решение:**
- ✅ Создана миграция `040_fix_audit_trigger_admin_id.sql`
- ✅ Триггер теперь делает SELECT из `admins` чтобы получить `admins.id` по `auth.uid()`
- ✅ Вставляет правильный `admins.id` в `audit_log.admin_id`

**Применение:**
```bash
# Через Supabase Management API
curl -X POST https://{project_ref}.supabase.co/rest/v1/rpc/exec_sql \
  -d '{"sql": "CREATE OR REPLACE FUNCTION..."}'
```

**Файлы:**
- ✅ `supabase/migrations/040_fix_audit_trigger_admin_id.sql`
- ✅ `scripts/check-admin.mjs` - проверка admins таблицы
- ✅ `scripts/clear-audit-log.mjs` - очистка старых записей

---

**Отчет подготовлен:** Implementation Engineer
**Дата:** 25.11.2024
**Статус:** Готово к тестированию ✅

