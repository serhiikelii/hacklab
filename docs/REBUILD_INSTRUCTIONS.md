# 🔄 MojService - Инструкция по ребилду БД

**Дата:** 2025-11-30
**Цель:** Полный ребилд БД с чистой консолидированной схемой и актуальными данными

---

## 📋 Что подготовлено

### ✅ SQL Файлы:
1. **`supabase/migrations/rebuild/001_initial_schema_rebuild.sql`**
   - 8 таблиц с полной структурой
   - 3 ENUM типа
   - 20+ индексов
   - 3 функции (is_admin, log_audit_changes, update_updated_at)
   - 6 триггеров updated_at
   - 6 триггеров audit_log
   - Все RLS политики
   - View category_services_view

2. **`supabase/migrations/rebuild/002_seed_data_rebuild.sql`**
   - 4 категории
   - 111 моделей (с обновленными названиями iPad/MacBook)
   - 15 услуг
   - 24 связи category_services (с полем order)
   - 606 цен
   - 3 скидки
   - **Всего: 763 INSERT операции**

### ✅ Экспортированные данные:
- **`data/db-export.json`** - полный бэкап текущих данных

### ✅ Скрипты:
- `scripts/export-all-data.mjs` - экспорт данных
- `scripts/generate-seed-sql.mjs` - генерация SQL из JSON
- `scripts/check-current-data.mjs` - проверка данных

---

## ⚠️ КРИТИЧЕСКИЕ ПРЕДУПРЕЖДЕНИЯ

### 1. **Storage bucket НЕ трогать!**
   - Bucket `device-images` остается нетронутым
   - Все картинки моделей сохраняются
   - Только ребилд таблиц БД, НЕ storage

### 2. **Админы создаются отдельно!**
   - Таблица `admins` будет пустая после seed
   - Админов создаем через Supabase Auth UI
   - Потом добавляем вручную в таблицу `admins`

### 3. **Модели с обновленными названиями**
   - iPad и MacBook модели теперь с годами
   - Формат: `"MacBook Pro 13" (2017) (A1706,A1708)"`
   - Изменения уже в seed файле

---

## 🚀 ПЛАН РЕБИЛДА (Пошаговая инструкция)

### ВАРИАНТ A: Через Supabase Dashboard (Рекомендуется)

#### Шаг 1: Backup текущей БД
```bash
# Запустить на локальной машине
cd C:\Users\prose\Automation\projects\mojservice

# Данные уже экспортированы в data/db-export.json
# Дополнительно можно сделать SQL dump через Supabase Dashboard:
# Dashboard → Database → Backups → Create Backup
```

#### Шаг 2: Удалить старые таблицы (через SQL Editor)
```sql
-- ⚠️ ВНИМАНИЕ: Это удалит ВСЕ данные!
-- Убедитесь что бэкап создан!

BEGIN;

-- Drop triggers first
DROP TRIGGER IF EXISTS audit_device_models ON device_models CASCADE;
DROP TRIGGER IF EXISTS audit_prices ON prices CASCADE;
DROP TRIGGER IF EXISTS audit_services ON services CASCADE;
DROP TRIGGER IF EXISTS audit_device_categories ON device_categories CASCADE;
DROP TRIGGER IF EXISTS audit_category_services ON category_services CASCADE;
DROP TRIGGER IF EXISTS audit_discounts ON discounts CASCADE;

DROP TRIGGER IF EXISTS update_device_categories_updated_at ON device_categories CASCADE;
DROP TRIGGER IF EXISTS update_device_models_updated_at ON device_models CASCADE;
DROP TRIGGER IF EXISTS update_services_updated_at ON services CASCADE;
DROP TRIGGER IF EXISTS update_category_services_updated_at ON category_services CASCADE;
DROP TRIGGER IF EXISTS update_prices_updated_at ON prices CASCADE;
DROP TRIGGER IF EXISTS update_discounts_updated_at ON discounts CASCADE;

-- Drop view
DROP VIEW IF EXISTS category_services_view CASCADE;

-- Drop tables (in order, respecting FK constraints)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS category_services CASCADE;
DROP TABLE IF EXISTS device_models CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS device_categories CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS log_audit_changes() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop ENUMs
DROP TYPE IF EXISTS service_type_enum CASCADE;
DROP TYPE IF EXISTS price_type_enum CASCADE;
DROP TYPE IF EXISTS discount_type_enum CASCADE;

COMMIT;
```

#### Шаг 3: Применить схему (001_initial_schema_rebuild.sql)
```bash
# В Supabase Dashboard → SQL Editor → New Query
# Скопировать ВЕСЬ контент из:
# supabase/migrations/rebuild/001_initial_schema_rebuild.sql
# Нажать RUN
```

#### Шаг 4: Применить seed данные (002_seed_data_rebuild.sql)
```bash
# В Supabase Dashboard → SQL Editor → New Query
# Скопировать ВЕСЬ контент из:
# supabase/migrations/rebuild/002_seed_data_rebuild.sql
# Нажать RUN

# Это займет ~10-30 секунд (763 INSERT операции)
```

#### Шаг 5: Создать админов
```bash
# 1. Создать пользователей через Supabase Auth:
# Dashboard → Authentication → Add User

# Email 1: serhii.kelii@gmail.com
# Email 2: proservicemenupo@gmail.com

# 2. Добавить в таблицу admins через SQL Editor:
INSERT INTO admins (user_id, email, role, is_active, created_by)
VALUES
  (
    (SELECT id FROM auth.users WHERE email = 'serhii.kelii@gmail.com'),
    'serhii.kelii@gmail.com',
    'superadmin',
    TRUE,
    NULL
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'proservicemenupo@gmail.com'),
    'proservicemenupo@gmail.com',
    'admin',
    TRUE,
    (SELECT id FROM auth.users WHERE email = 'serhii.kelii@gmail.com')
  );
```

#### Шаг 6: Валидация данных
```bash
# Запустить скрипт проверки
cd C:\Users\prose\Automation\projects\mojservice
node scripts/check-current-data.mjs

# Ожидаемые результаты:
# ✅ Categories: 4
# ✅ Models: 111
# ✅ Services: 15
# ✅ Category-Services: 24
# ✅ Prices: 606
# ✅ Discounts: 3
# ✅ Admins: 2
```

---

### ВАРИАНТ B: Через scripts/apply-migration-api.mjs

```bash
# 1. Скопировать файлы в основную папку миграций
cp supabase/migrations/rebuild/001_initial_schema_rebuild.sql supabase/migrations/100_initial_schema_rebuild.sql
cp supabase/migrations/rebuild/002_seed_data_rebuild.sql supabase/migrations/101_seed_data_rebuild.sql

# 2. Применить через API
node scripts/apply-migration-api.mjs supabase/migrations/100_initial_schema_rebuild.sql
node scripts/apply-migration-api.mjs supabase/migrations/101_seed_data_rebuild.sql
```

---

## ✅ Проверка после ребилда

### 1. Проверка структуры:
```sql
-- Проверить таблицы
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Должно быть 8 таблиц:
-- admins, audit_log, category_services, device_categories,
-- device_models, discounts, prices, services
```

### 2. Проверка данных:
```sql
SELECT 'device_categories' as table_name, COUNT(*) as count FROM device_categories
UNION ALL
SELECT 'device_models', COUNT(*) FROM device_models
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'category_services', COUNT(*) FROM category_services
UNION ALL
SELECT 'prices', COUNT(*) FROM prices
UNION ALL
SELECT 'discounts', COUNT(*) FROM discounts
UNION ALL
SELECT 'admins', COUNT(*) FROM admins;

-- Ожидаемые результаты:
-- device_categories:  4
-- device_models:      111
-- services:           15
-- category_services:  24
-- prices:             606
-- discounts:          3
-- admins:             2
```

### 3. Проверка обновленных названий моделей:
```sql
-- Проверить что iPad/MacBook модели имеют года
SELECT
  dc.slug as category,
  COUNT(*) as total,
  COUNT(CASE WHEN dm.name ~ '\(\d{4}\)' THEN 1 END) as with_year
FROM device_models dm
JOIN device_categories dc ON dm.category_id = dc.id
WHERE dc.slug IN ('ipad', 'macbook')
GROUP BY dc.slug;

-- Ожидаемо:
-- ipad:    total=31, with_year=31
-- macbook: total=29, with_year=29
```

### 4. Проверка RLS:
```sql
-- Проверить что RLS включен
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Все таблицы должны иметь rowsecurity = TRUE
```

### 5. Проверка функций:
```sql
-- Проверить is_admin()
SELECT is_admin();

-- Если вы залогинены как админ → должно вернуть TRUE
-- Если нет → FALSE
```

---

## 🔄 Rollback (если что-то пошло не так)

### Вариант 1: Восстановить из Supabase Backup
```bash
# Dashboard → Database → Backups
# Выбрать последний бэкап ДО ребилда
# Нажать Restore
```

### Вариант 2: Восстановить из JSON
```bash
# Использовать data/db-export.json
# Применить старые миграции обратно
```

---

## 📝 Что изменилось после ребилда

### ✅ Улучшения:
1. **Чистая схема** - одна консолидированная миграция вместо 18
2. **Обновленные названия** - iPad/MacBook модели с годами и A-номерами
3. **Исправлен audit_log** - правильный маппинг admin_id
4. **Исправлен is_admin()** - добавлен SECURITY DEFINER
5. **Исправлен category_services** - поле order работает корректно
6. **Актуальные данные** - 606 цен, 111 моделей

### 📊 Статистика:
- **Удалено:** 18 старых миграций
- **Создано:** 2 новых файла (001_schema + 002_seed)
- **Данных:** 763 INSERT операции
- **Размер seed:** ~200KB

---

## 🚨 Важные моменты

### 1. Storage bucket
- ❌ НЕ удаляем `device-images`
- ✅ Все картинки остаются на месте
- ✅ URL в `device_models.image_url` будут работать

### 2. Админы
- ❌ НЕ включены в seed файл
- ✅ Создаются через Auth UI + ручной INSERT
- ✅ После seed таблица `admins` будет пустая

### 3. Миграции
- ❌ Старые 18 файлов больше НЕ применяются
- ✅ Новые 2 файла - источник истины
- ✅ История миграций будет чистая

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверить логи в Supabase Dashboard → Logs
2. Запустить `node scripts/check-current-data.mjs`
3. Проверить RLS политики
4. Проверить что Storage bucket не поврежден

---

**Документ создан:** 2025-11-30
**Implementation Engineer**
**Готов к применению**
