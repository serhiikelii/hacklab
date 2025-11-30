# 🗄️ MojService - Полный анализ структуры БД

**Дата анализа:** 2025-11-29
**Цель:** Документация текущего состояния БД для подготовки к ребилду
**Источники:** API Supabase + Миграции + TypeScript типы

---

## 📊 ОБЩАЯ ИНФОРМАЦИЯ

**База данных:** Supabase PostgreSQL
**ORM:** Prisma (не используется активно, работа напрямую через Supabase Client)
**Применение миграций:** Через Supabase Management API (`scripts/apply-migration-api.mjs`)

⚠️ **КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ:**
Текущая структура БД в Supabase отличается от локальных файлов миграций! Миграции неполные и применялись частично. **ВСЕГДА проверяйте структуру через Supabase Dashboard/Table Editor!**

---

## 📋 ТАБЛИЦЫ (8 основных)

### 1. `device_categories` - Категории устройств
**Назначение:** Типы устройств Apple (iPhone, iPad, MacBook, Apple Watch)

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `slug` | TEXT UNIQUE | URL-friendly ID (iphone, ipad, macbook, apple-watch) |
| `name_ru` | TEXT | Название RU |
| `name_en` | TEXT | Название EN |
| `name_cz` | TEXT | Название CZ |
| `icon` | TEXT | Иконка (nullable) |
| `order` | INTEGER | Порядок отображения |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `idx_device_categories_slug` на `slug`
- `idx_device_categories_order` на `order`

**Данные:** 4 записи (iphone, ipad, macbook, apple-watch)

---

### 2. `device_models` - Модели устройств
**Назначение:** Конкретные модели устройств каждой категории

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `category_id` | UUID | FK → device_categories.id (ON DELETE CASCADE) |
| `slug` | TEXT UNIQUE | URL-friendly ID модели |
| `name` | TEXT | Название модели (напр. "iPhone 16 Pro Max") |
| `series` | TEXT | Серия (напр. "iPhone 16") |
| `image_url` | TEXT | URL картинки в Supabase Storage |
| `release_year` | INTEGER | Год релиза |
| `order` | INTEGER | Порядок отображения внутри категории |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `idx_device_models_category_id` на `category_id`
- `idx_device_models_slug` на `slug`
- `idx_device_models_series` на `series`
- `idx_device_models_order` на `order`
- `idx_device_models_release_year` на `release_year DESC`

**Количество моделей по категориям** (из миграций 003, 005, 011):
- **iPhone:** ~38 моделей (от iPhone 17 Pro Max до iPhone SE 2020)
- **iPad:** ~31 модель (iPad Pro, iPad Air, iPad mini, iPad)
- **MacBook:** ~30 моделей (MacBook Pro, MacBook Air, MacBook)
- **Apple Watch:** ~15 моделей (Ultra, SE, Series 4-9)

**Всего:** ~114 моделей

---

### 3. `services` - Услуги ремонта
**Назначение:** Справочник услуг (универсальные + специфичные для категорий)

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `slug` | TEXT UNIQUE | URL-friendly ID |
| `name_ru` | TEXT | Название RU |
| `name_en` | TEXT | Название EN |
| `name_cz` | TEXT | Название CZ |
| `description_ru` | TEXT | Описание RU |
| `description_en` | TEXT | Описание EN |
| `description_cz` | TEXT | Описание CZ |
| `service_type` | ENUM | 'main' или 'extra' |
| `order` | INTEGER | Порядок сортировки (template/default) |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `idx_services_slug` на `slug`
- `idx_services_type` на `service_type`
- `idx_services_order` на `order`

**ENUM Types:**
```sql
CREATE TYPE service_type_enum AS ENUM ('main', 'extra');
```

**Типы услуг (после миграции 036 - унификация):**

**Универсальные услуги** (работают для всех категорий):
- `battery-replacement` - Замена аккумулятора
- `water-damage-recovery` - Восстановление от повреждения водой
- `display-replacement` - Замена дисплея
- `glass-replacement` - Замена стекла (iPad, Watch)
- `digitizer-replacement` - Замена сенсора (iPad, Watch)
- `charging-port-replacement` - Замена разъема зарядки (iPad)

**Специфичные для iPhone:**
- `iphone-display-original-prc` - Замена дисплея оригинал PRC
- `iphone-back-glass` - Замена заднего стекла
- `iphone-housing` - Замена корпуса
- `iphone-camera-main` - Замена основной камеры
- `iphone-charging-cable` - Замена шлейфа зарядки

**Специфичные для MacBook:**
- `macbook-keyboard` - Замена клавиатуры
- `macbook-thermal-paste` - Чистка, замена термопасты

**Специфичные для Watch:**
- `watch-nfc` - Восстановление NFC

---

### 4. `category_services` - Связь категорий и услуг (Many-to-Many)
**Назначение:** Какие услуги доступны для каких категорий

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `category_id` | UUID | FK → device_categories.id (ON DELETE CASCADE) |
| `service_id` | UUID | FK → services.id (ON DELETE CASCADE) |
| `is_active` | BOOLEAN | Активность связи |
| `order` | INTEGER | **ДОБАВЛЕНО В МИГРАЦИИ 041** Порядок услуги для конкретной категории |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `idx_category_services_category_id` на `category_id`
- `idx_category_services_service_id` на `service_id`
- `idx_category_services_active` на `is_active`
- `idx_category_services_order` на `order`

**Уникальность:**
```sql
UNIQUE(category_id, service_id)
```

⚠️ **ВАЖНОЕ ИЗМЕНЕНИЕ (миграция 041):**
- **Раньше:** Использовался `services.order` для сортировки
- **Сейчас:** Используется `category_services.order` для разного порядка в разных категориях
- **Логика:** `services.order` = template/default, `category_services.order` = actual

---

### 5. `prices` - Цены услуг для моделей
**Назначение:** Прайс-лист (модель + услуга = цена)

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `model_id` | UUID | FK → device_models.id (ON DELETE CASCADE) |
| `service_id` | UUID | FK → services.id (ON DELETE CASCADE) |
| `price` | DECIMAL(10,2) | Цена в CZK |
| `price_type` | ENUM | 'fixed', 'from', 'free', 'on_request' |
| `duration_minutes` | INTEGER | Длительность ремонта (минуты) |
| `warranty_months` | INTEGER | Гарантия (месяцы), DEFAULT 24 |
| `note_ru` | TEXT | Примечание RU |
| `note_en` | TEXT | Примечание EN |
| `note_cz` | TEXT | Примечание CZ |
| `is_active` | BOOLEAN | **НЕТ В СХЕМЕ!** (была удалена) |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `idx_prices_model_id` на `model_id`
- `idx_prices_service_id` на `service_id`
- `idx_prices_price_type` на `price_type`

**Уникальность:**
```sql
UNIQUE(model_id, service_id)
```

**ENUM Types:**
```sql
CREATE TYPE price_type_enum AS ENUM ('fixed', 'from', 'free', 'on_request');
```

⚠️ **КРИТИЧЕСКАЯ ПРОБЛЕМА (миграция 036):**
- Миграция 036 **УДАЛИЛА ВСЕ ЦЕНЫ** (DELETE FROM prices)
- Цены должны были быть пересозданы через функцию `insert_prices_for_series()` (миграция 034)
- **Текущее состояние цен НЕИЗВЕСТНО** - нужно проверить через API!

---

### 6. `discounts` - Скидки и акции
**Назначение:** Промо-акции и скидки

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `name_ru` | TEXT | Название RU |
| `name_en` | TEXT | Название EN |
| `name_cz` | TEXT | Название CZ |
| `discount_type` | ENUM | 'percentage', 'fixed', 'bonus' |
| `value` | DECIMAL(10,2) | Значение скидки |
| `conditions_ru` | TEXT | Условия RU |
| `conditions_en` | TEXT | Условия EN |
| `conditions_cz` | TEXT | Условия CZ |
| `active` | BOOLEAN | Активность, DEFAULT TRUE |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

**Индексы:**
- `idx_discounts_active` на `active`

**ENUM Types:**
```sql
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed', 'bonus');
```

**Seed данные (из 002_seed_data.sql):**
- Скидка 10% при ремонте 2+ устройств
- Бесплатная диагностика при ремонте
- Гарантия 24 месяца

---

### 7. `admins` - Администраторы системы
**Назначение:** Управление доступом к админ-панели

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key (НЕ auth.uid!) |
| `user_id` | UUID | auth.uid() из Supabase Auth |
| `email` | TEXT | Email администратора |
| `role` | ENUM | 'editor', 'admin', 'superadmin' |
| `is_active` | BOOLEAN | Активность, DEFAULT TRUE |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |
| `created_by` | UUID | Кто создал админа |
| `last_login_at` | TIMESTAMP | Последний вход |

**Индексы:**
- `idx_admins_user_id_active` на `(user_id, is_active, role) WHERE is_active = true`

⚠️ **ВАЖНО:**
- `admins.id` - Primary Key (UUID)
- `admins.user_id` - FK к auth.users (auth.uid())
- **НЕ ПУТАТЬ!** RLS политики проверяют `user_id = auth.uid()`, НЕ `id`

---

### 8. `audit_log` - Журнал действий админов
**Назначение:** Аудит всех изменений в БД админами

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Primary Key |
| `admin_id` | UUID | FK → admins.id (**НЕ auth.uid()!**) |
| `action` | TEXT | INSERT/UPDATE/DELETE |
| `table_name` | TEXT | Название таблицы |
| `record_id` | UUID | ID записи |
| `old_data` | JSON | Данные до изменения |
| `new_data` | JSON | Данные после изменения |
| `created_at` | TIMESTAMP | Дата действия |

**Индексы:**
- `idx_audit_log_admin_id` на `(admin_id, created_at DESC)`

⚠️ **КРИТИЧЕСКИЙ БАГ (исправлен в миграции 040):**
- Trigger `log_audit_changes()` вставлял `auth.uid()` (user_id) вместо `admins.id` (PK)
- Миграция 040 исправила: теперь делается `SELECT id FROM admins WHERE user_id = auth.uid()`

---

## 🔒 ROW LEVEL SECURITY (RLS) ПОЛИТИКИ

### Общие принципы:
1. **Public read** - Все пользователи (включая анонимных) могут читать данные прайс-листа
2. **Admin write** - Только админы могут изменять данные через функцию `is_admin()`
3. **Service role** - Полный доступ для service_role (используется в server actions)

---

### RLS Policies для основных таблиц:

#### `device_categories`, `device_models`, `services`, `category_services`, `prices`, `discounts`

**READ (SELECT) - Public:**
```sql
CREATE POLICY "Public read access for [table]"
ON [table]
FOR SELECT
USING (true);
```

**WRITE (INSERT/UPDATE/DELETE) - Admins only:**
```sql
CREATE POLICY "Admins and Superadmins can insert/update/delete [table]"
ON [table]
FOR INSERT/UPDATE/DELETE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

---

#### `admins` table (миграция 026):

**Service role - Full access:**
```sql
CREATE POLICY "Service role full access"
ON admins
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

**Authenticated users - Read active admins:**
```sql
CREATE POLICY "Authenticated can read active admins"
ON admins
FOR SELECT
TO authenticated
USING (is_active = true);
```

**Users - Update own last_login:**
```sql
CREATE POLICY "Users can update own last_login"
ON admins
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

---

## ⚙️ ФУНКЦИИ И ТРИГГЕРЫ

### 1. `update_updated_at_column()` - Автообновление updated_at
**Тип:** Trigger Function
**Назначение:** Обновляет `updated_at` при UPDATE

**Применяется к таблицам:**
- device_categories
- device_models
- services
- category_services
- prices
- discounts

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. `is_admin()` - Проверка прав админа
**Тип:** SECURITY DEFINER Function
**Назначение:** Проверяет, является ли текущий пользователь админом

**Исправлено в миграции 038:**
- Добавлен `SECURITY DEFINER` (критично!)
- Проверяет `user_id = auth.uid()` (НЕ `id`!)
- Проверяет обе роли: `'admin'` И `'superadmin'`

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'superadmin')
  );
END;
$$;
```

---

### 3. `log_audit_changes()` - Логирование изменений
**Тип:** Trigger Function (SECURITY DEFINER)
**Назначение:** Записывает все изменения в audit_log

**Исправлено в миграции 040:**
- Теперь корректно получает `admins.id` (PK) по `auth.uid()` (user_id)
- Не блокирует операцию, если админ не найден

```sql
CREATE OR REPLACE FUNCTION public.log_audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id_pk UUID;
BEGIN
  SELECT id INTO admin_id_pk
  FROM public.admins
  WHERE user_id = auth.uid() AND is_active = true
  LIMIT 1;

  IF admin_id_pk IS NULL THEN
    RAISE WARNING 'Audit skipped: No active admin found for user_id=%', auth.uid();
    RETURN COALESCE(NEW, OLD);
  END IF;

  INSERT INTO public.audit_log (admin_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    admin_id_pk,
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;
```

**Триггеры (применяются к):**
- device_models
- prices
- services
- device_categories
- category_services
- discounts

---

### 4. `get_universal_service_id()` - Получение ID универсальной услуги
**Тип:** Helper Function (миграция 034)
**Назначение:** Маппинг типа услуги → универсальный slug

**Параметры:**
- `p_category_slug TEXT` - категория устройства
- `p_service_type TEXT` - тип услуги ('battery', 'display', etc.)

**Возвращает:** UUID service_id

**Примеры маппинга:**
- `'battery'` → `'battery-replacement'`
- `'display'` → `'display-replacement'`
- `'display-original-prc'` → `'iphone-display-original-prc'` (iPhone-specific)

---

### 5. `insert_prices_for_series()` - Массовая вставка цен
**Тип:** Helper Function (миграция 034)
**Назначение:** Создание цен для всех моделей серии

**Параметры:**
- `p_series TEXT` - название серии (напр. "iPhone 16")
- `p_category_slug TEXT` - slug категории
- `p_prices JSONB` - JSON с ценами {"battery": 2170, "display": 5700, ...}

**Возвращает:** INT (количество вставленных записей)

**Пример использования:**
```sql
SELECT insert_prices_for_series(
  'iPhone 16',
  'iphone',
  '{"display-original-prc": 6470, "display": 5470, "battery": 2070}'::jsonb
);
```

---

## 📊 VIEW: `category_services_view`

**Назначение:** Оптимизированное представление для получения услуг категории

**Структура:**
```sql
SELECT
  cs.id,
  cs.category_id,
  dc.slug as category_slug,
  dc.name_ru as category_name_ru,
  dc.name_en as category_name_en,
  dc.name_cz as category_name_cz,
  cs.service_id,
  s.slug as service_slug,
  s.name_ru as service_name_ru,
  s.name_en as service_name_en,
  s.name_cz as service_name_cz,
  s.service_type,
  cs."order" as order,  -- Изменено в миграции 041!
  cs.is_active,
  cs.created_at,
  cs.updated_at
FROM category_services cs
JOIN device_categories dc ON cs.category_id = dc.id
JOIN services s ON cs.service_id = s.id
```

⚠️ **ВАЖНОЕ ИЗМЕНЕНИЕ (миграция 041):**
- **Раньше:** `s."order" as service_order`
- **Сейчас:** `cs."order" as order`

**Permissions:**
```sql
GRANT SELECT ON category_services_view TO anon, authenticated;
```

---

## 🎯 КЛЮЧЕВЫЕ ИЗМЕНЕНИЯ В ИСТОРИИ МИГРАЦИЙ

### Миграция 003, 005, 011 - Добавление моделей
- **003:** iPhone (38 моделей) + iPad (31 модель)
- **005:** Apple Watch (15 моделей)
- **011:** MacBook (30 моделей)

### Миграция 036 - Унификация услуг (КРИТИЧЕСКАЯ!)
**Что сделано:**
- Удалены все category-specific услуги (`iphone-battery`, `ipad-battery`, etc.)
- Созданы универсальные услуги (`battery-replacement`, `display-replacement`, etc.)
- **УДАЛЕНЫ ВСЕ ЦЕНЫ!** (DELETE FROM prices)
- Пересозданы связи `category_services` с универсальными услугами

**Последствия:**
- Таблица `prices` была опустошена
- Цены должны были быть восстановлены через функции из миграции 034

### Миграция 038 - Исправление RLS для админов
**Проблемы:**
- Функция `is_admin()` не была определена
- RLS сравнивала `auth.uid()` с `admins.id` вместо `admins.user_id`
- Проверялась только роль `'admin'`, но не `'superadmin'`

**Решение:**
- Создана функция `is_admin()` с `SECURITY DEFINER`
- Исправлены все RLS политики
- Добавлены индексы для производительности

### Миграция 040 - Исправление audit_log
**Проблема:**
- Trigger вставлял `auth.uid()` (user_id) вместо `admins.id` (PK)
- FK constraint нарушался

**Решение:**
- Добавлен `SELECT id FROM admins WHERE user_id = auth.uid()`
- Теперь используется корректный `admins.id`

### Миграция 041 - Порядок услуг в категориях
**Проблема:**
- Одинаковый порядок услуг для всех категорий

**Решение:**
- Добавлено поле `category_services.order`
- VIEW обновлен для использования `cs.order` вместо `s.order`

---

## 🖼️ STORAGE (Supabase)

### Бакет для картинок моделей:
**Название:** `device-images` (Public)

**Структура папок:**
```
device-images/
├── apple-watch/    (картинки Apple Watch)
├── ipad/           (картинки iPad)
├── iphone/         (картинки iPhone)
└── macbook/        (картинки MacBook)
```

**Формат URL:**
```
https://[project-id].supabase.co/storage/v1/object/public/device-images/[category]/[image-name]
```

**Примеры:**
- `https://xxx.supabase.co/storage/v1/object/public/device-images/iphone/iphone-16-pro-max.png`
- `https://xxx.supabase.co/storage/v1/object/public/device-images/macbook/macbook-air-m3.png`

**Политика доступа:** Public bucket (анонимное чтение разрешено)

**Примечание:** В `device_models.image_url` хранятся полные URL картинок

---

## ✅ АКТУАЛЬНОЕ СОСТОЯНИЕ БД (Проверено 2025-11-29)

### 📊 Текущие данные (через API):

| Таблица | Записей | Статус | Детали |
|---------|---------|--------|--------|
| **device_categories** | **4** | ✅ OK | iphone, ipad, macbook, apple-watch |
| **device_models** | **111** | ✅ OK | iPhone: 36, iPad: 31, MacBook: 29, Watch: 15 |
| **services** | **15** | ✅ OK | Все `service_type = 'main'` |
| **category_services** | **24** | ✅ OK | Поле `order` заполнено корректно |
| **prices** | **606** | ✅ OK | Цены восстановлены (миграция 037) |
| **discounts** | **3** | ✅ OK | Стандартные промо |
| **admins** | **2** | ✅ OK | 1 superadmin + 1 admin |
| **audit_log** | **0** | ⚠️ | Пустая (логи еще не накапливались) |

### 👥 Администраторы:

| Email | Role | is_active | created_at |
|-------|------|-----------|------------|
| serhii.kelii@gmail.com | **superadmin** | TRUE | 2025-11-27 12:49:43 |
| proservicemenupo@gmail.com | **admin** | TRUE | 2025-11-27 20:11:13 |

### 🔍 Детали по услугам (15 записей):

**Универсальные услуги:**
- `battery-replacement` - Замена аккумулятора (для всех категорий)
- `water-damage-recovery` - Восстановление от воды (iPhone, iPad)
- `display-replacement` - Замена дисплея (для всех)
- `glass-replacement` - Замена стекла (iPad, Watch)
- `digitizer-replacement` - Замена сенсора (iPad, Watch)
- `charging-port-replacement` - Замена разъема зарядки (iPad)

**iPhone-специфичные:**
- `iphone-display-original-prc` - Дисплей оригинал PRC
- `iphone-back-glass` - Заднее стекло
- `iphone-housing` - Корпус
- `iphone-camera-main` - Основная камера
- `iphone-charging-cable` - Шлейф зарядки

**MacBook-специфичные:**
- `macbook-keyboard` - Клавиатура
- `macbook-thermal-paste` - Термопаста

**Watch-специфичные:**
- `watch-nfc` - NFC

### 📊 Распределение цен по категориям:
Всего **606 записей** в таблице `prices` (модель × услуга)

### ✅ Подтверждения:
- ✅ Поле `category_services.order` заполнено (миграция 041 сработала)
- ✅ Цены присутствуют (миграция 037 восстановила после удаления в 036)
- ✅ Все модели на месте (111 из 114 ожидаемых - небольшое расхождение нормально)
- ✅ Storage bucket структурирован по категориям

---

## 🚀 ПЛАН РЕБИЛДА БД

### ✅ Что уже проверено:
- ✅ Структура БД изучена (8 таблиц, все колонки, индексы, FK)
- ✅ Актуальные данные получены через API (606 цен, 111 моделей, 15 услуг)
- ✅ Storage bucket проверен (`device-images` с 4 папками)
- ✅ Админы подтверждены (2 записи: superadmin + admin)
- ✅ RLS политики и функции задокументированы
- ✅ Все миграции проанализированы (18 файлов)

### 📋 Шаги для ребилда:

#### 1. Backup текущих данных
```bash
# Бэкап миграций
mkdir supabase/migrations/backup
cp supabase/migrations/*.sql supabase/migrations/backup/

# Экспорт текущих цен (606 записей)
node scripts/export-current-prices.mjs > data/prices-backup.json
```

#### 2. Создать консолидированную initial migration
**Файл:** `supabase/migrations/001_initial_schema_rebuild.sql`

**Включить:**
- ✅ 8 таблиц (device_categories, device_models, services, category_services, prices, discounts, admins, audit_log)
- ✅ 3 ENUM типа (service_type_enum, price_type_enum, discount_type_enum)
- ✅ Все индексы (20+ индексов)
- ✅ Все FK constraints с ON DELETE CASCADE
- ✅ 3 функции (is_admin, log_audit_changes, update_updated_at_column)
- ✅ 6 триггеров updated_at
- ✅ 6 триггеров audit_log
- ✅ Все RLS policies (public read + admin write)
- ✅ VIEW category_services_view
- ✅ GRANT permissions

#### 3. Создать seed файл с актуальными данными
**Файл:** `supabase/migrations/002_seed_data_rebuild.sql`

**Включить:**
- ✅ 4 категории (с правильным order: 1-4)
- ✅ 111 моделей (iPhone: 36, iPad: 31, MacBook: 29, Watch: 15)
- ✅ 15 услуг (универсальные + специфичные)
- ✅ 24 связи category_services (с полем `order`)
- ✅ 606 цен (экспортировать из текущей БД!)
- ✅ 3 скидки (стандартные промо)
- ⚠️ 2 админа (создавать вручную через Auth UI, НЕ в миграции!)

#### 4. Helper функции для цен (опционально)
**Файл:** `supabase/migrations/003_price_helpers.sql`
- `get_universal_service_id()`
- `insert_prices_for_series()`

#### 5. Валидация после ребилда
```bash
# Проверить количество записей
node scripts/check-current-data.mjs

# Сравнить с ожидаемыми:
# Categories: 4
# Models: 111
# Services: 15
# Category-Services: 24
# Prices: 606
# Discounts: 3
```

### ⚠️ КРИТИЧЕСКИЕ МОМЕНТЫ:

1. **Админы НЕ в seed!**
   - Создаются через Supabase Auth UI
   - Потом добавляются в таблицу `admins` вручную или через SQL Editor

2. **Цены экспортировать!**
   - 606 записей из текущей БД
   - Формат: JSON или SQL INSERT

3. **Storage bucket сохранить!**
   - Бакет `device-images` НЕ трогать
   - Только пересоздать таблицы БД

4. **Поле `category_services.order`**
   - ОБЯЗАТЕЛЬНО включить в initial schema
   - Заполнить в seed из текущих значений

5. **Миграции 038, 040, 041 критичны!**
   - Функция `is_admin()` с SECURITY DEFINER
   - Trigger `log_audit_changes()` с правильным admin_id
   - Поле `category_services.order`
   - ВАЖНО! последние изменения в названиях вот информация каким образом била сделано:
     - scripts/analyze-ipad-macbook-names.mjs - анализ названий
     - scripts/fix-model-names.sql - SQL скрипт исправления
     - Применено через scripts/apply-migration-api.mjs


### 📝 Следующий шаг:
**Создать детальный план ребилда** со всеми SQL скриптами

---

**Документ обновлен:** 2025-11-29 23:35
**Implementation Engineer**
**Анализ основан на:** 18 миграций + проверка API + Storage Dashboard
