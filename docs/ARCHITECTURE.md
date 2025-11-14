# Архитектура базы данных MojService

## Обзор

MojService использует PostgreSQL через Supabase с архитектурой, построенной на UUID, многоязычности (RU/EN/CZ) и категорийно-специфичных услугах.

## Структура таблиц

### 1. device_categories

**Описание:** Категории устройств для ремонта

**Структура:**
```sql
CREATE TABLE device_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,              -- 'iphone', 'ipad', 'macbook', 'apple-watch'
  name_ru TEXT NOT NULL,                  -- Многоязычное название
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  description_ru TEXT,                    -- Многоязычное описание
  description_en TEXT,
  description_cz TEXT,
  icon TEXT,                              -- Emoji или иконка
  "order" INT DEFAULT 0,                  -- Порядок отображения
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Данные:**
- iphone - iPhone
- ipad - iPad
- macbook - MacBook
- apple-watch - Apple Watch

**Особенности:**
- UUID как primary key
- Slug для URL-friendly идентификации
- Многоязычность через _ru, _en, _cz суффиксы
- Поле order для контроля последовательности

---

### 2. services

**Описание:** Услуги ремонта (категорийно-специфичные)

**Структура:**
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,              -- 'iphone-display-original-prc', 'macbook-battery'
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  description_ru TEXT,
  description_en TEXT,
  description_cz TEXT,
  service_type TEXT DEFAULT 'main',       -- 'main' или 'extra'
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Примеры услуг:**

**iPhone:**
- iphone-display-original-prc - Замена дисплея (оригинал PRC)
- iphone-display-analog - Замена дисплея (аналог)
- iphone-battery - Замена батареи
- iphone-back-glass - Замена заднего стекла
- iphone-camera-main - Замена основной камеры
- iphone-water-damage - Ремонт после попадания жидкости

**MacBook:**
- macbook-display - Замена дисплея
- macbook-battery - Замена батареи
- macbook-keyboard - Замена клавиатуры
- macbook-trackpad - Замена трекпада

**iPad:**
- ipad-display - Замена дисплея
- ipad-battery - Замена батареи
- ipad-charging-port - Замена разъема зарядки

**Apple Watch:**
- apple-watch-display - Замена дисплея
- apple-watch-battery - Замена батареи

**Особенности:**
- Slug содержит префикс категории для уникальности
- Каждая категория имеет свой набор специфичных услуг
- service_type: 'main' (основные) или 'extra' (дополнительные)

---

### 3. category_services

**Описание:** Связь между категориями и услугами (many-to-many)

**Структура:**
```sql
CREATE TABLE category_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,        -- Основная или дополнительная услуга
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, service_id)
);
```

**Назначение:**
- Определяет какие услуги доступны для какой категории
- is_primary разделяет услуги на основные и дополнительные
- UNIQUE constraint предотвращает дубликаты связей

**Использование:**
```sql
-- Получить все услуги для iPhone:
SELECT s.*
FROM services s
INNER JOIN category_services cs ON cs.service_id = s.id
INNER JOIN device_categories dc ON dc.id = cs.category_id
WHERE dc.slug = 'iphone'
ORDER BY s.order;
```

---

### 4. device_models

**Описание:** Модели устройств

**Структура:**
```sql
CREATE TABLE device_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,              -- 'iphone-15-pro-max', 'macbook-air-m3'
  name TEXT NOT NULL,                     -- 'iPhone 15 Pro Max'
  series TEXT,                            -- 'iPhone 15'
  release_year INT,                       -- 2024
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Особенности:**
- Связь с категорией через category_id (UUID)
- Slug для SEO-friendly URL
- is_popular для выделения популярных моделей
- image_url для изображений устройств

---

### 5. prices

**Описание:** Цены на услуги для конкретных моделей

**Структура:**
```sql
CREATE TYPE price_type_enum AS ENUM ('fixed', 'from', 'free', 'on_request');

CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES device_models(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price DECIMAL(10, 2),                   -- Цена в CZK, NULL для 'on_request'
  price_type price_type_enum NOT NULL,    -- Тип цены
  duration_minutes INT,                   -- Длительность ремонта
  warranty_months INT DEFAULT 24,         -- Гарантия (обычно 24 месяца)
  note_ru TEXT,                           -- Многоязычные заметки
  note_en TEXT,
  note_cz TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_id, service_id)
);
```

**Типы цен:**
- `fixed` - Фиксированная цена (отображается как "3999 CZK")
- `from` - Цена от (отображается как "от 2499 CZK")
- `free` - Бесплатно
- `on_request` - По запросу (price = NULL)

**Особенности:**
- Многоязычные заметки для уточнений по цене
- warranty_months - стандартная гарантия 24 месяца
- is_active для временного отключения цен
- UNIQUE constraint по (model_id, service_id)

---

### 6. discounts

**Описание:** Скидки и акции

**Структура:**
```sql
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed_amount', 'bonus');

CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_cz TEXT NOT NULL,
  discount_type discount_type_enum NOT NULL,
  value DECIMAL(10, 2),                   -- Значение скидки (%, CZK, или NULL для bonus)
  conditions_ru TEXT,                     -- Условия получения
  conditions_en TEXT,
  conditions_cz TEXT,
  valid_from TIMESTAMPTZ,                 -- Период действия
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Типы скидок:**
- `percentage` - Процентная скидка (value = 10 → 10%)
- `fixed_amount` - Фиксированная сумма (value = 500 → 500 CZK скидка)
- `bonus` - Бонус (бесплатная услуга, подарок)

**Примеры:**
- Скидка 10% при ремонте 2+ устройств
- Бесплатная диагностика при ремонте
- Гарантия 24 месяца

---

## Миграция со старой архитектуры

### Изменения в категориях

**БЫЛО:**
```typescript
type DeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';
```

**СТАЛО:**
```typescript
type DeviceCategory = 'iphone' | 'ipad' | 'macbook' | 'apple-watch';
```

**Причина:**
- 'mac' → 'macbook' - более точное название (не все Mac - это MacBook)
- 'watch' → 'apple-watch' - полное название продукта Apple

**Обратная совместимость:**
- Редирект /pricelist/mac → /pricelist/macbook
- Редирект /pricelist/watch → /pricelist/apple-watch

---

### Изменения в услугах

**БЫЛО:**
Универсальные услуги для всех категорий:
```typescript
const MAIN_SERVICES = [
  {id: '1', slug: 'diagnostics', name: 'Diagnostics'},
  {id: '2', slug: 'battery-replacement', name: 'Battery replacement'},
  // ... одинаковые для всех категорий
];
```

**СТАЛО:**
Категорийно-специфичные услуги:
```sql
-- iPhone услуги:
INSERT INTO services (slug, ...) VALUES ('iphone-battery', ...);

-- MacBook услуги:
INSERT INTO services (slug, ...) VALUES ('macbook-battery', ...);

-- Связь через category_services:
INSERT INTO category_services (category_id, service_id, ...) VALUES (...);
```

**Преимущества:**
- Более точные названия услуг для каждой категории
- Гибкость: разные услуги для разных категорий
- Возможность одной услуги для нескольких категорий (через many-to-many)

---

### Изменения в ID системе

**БЫЛО:**
```typescript
{id: '1', ...}
{id: '2', ...}
```

**СТАЛО:**
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
```

**Причина:**
- UUID обеспечивает глобальную уникальность
- Защита от конфликтов при репликации
- Невозможность угадать следующий ID

---

## Запросы к БД

### Получить услуги для категории

```typescript
// Frontend code (queries.ts)
export async function getServicesForCategory(categorySlug: DeviceCategory) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      category_services!inner(
        category_id,
        is_primary
      ),
      device_categories!inner(slug)
    `)
    .eq('device_categories.slug', categorySlug)
    .order('order', { ascending: true });

  return data;
}
```

### Получить цены для модели

```typescript
export async function getPricesForModel(modelId: string) {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('model_id', modelId)
    .eq('is_active', true)  // Только активные цены
    .order('service_id');

  return data;
}
```

### Получить модели для категории

```typescript
export async function getModelsForCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('device_models')
    .select('*, device_categories!inner(*)')
    .eq('device_categories.slug', categorySlug)
    .order('release_year', { ascending: false })
    .order('name', { ascending: true });

  return data;
}
```

---

## Многоязычность

### Принцип

Все пользовательские строки хранятся в трех вариантах:
- `*_ru` - Русский (основной)
- `*_en` - English
- `*_cz` - Čeština

### Реализация на фронтенде

```typescript
// i18n.ts
export function getServiceName(
  service: { name_ru: string; name_en: string; name_cz: string },
  locale: 'ru' | 'en' | 'cz' = 'ru'
): string {
  const nameMap = {
    ru: service.name_ru,
    en: service.name_en,
    cz: service.name_cz,
  };
  return nameMap[locale] || service.name_ru;
}
```

### Применение

```tsx
// ServiceRow.tsx
<h3>{getServiceName(service, locale)}</h3>
```

---

## Индексы и производительность

### Рекомендуемые индексы

```sql
-- Быстрый поиск моделей по категории
CREATE INDEX idx_device_models_category_id ON device_models(category_id);

-- Быстрый поиск цен по модели
CREATE INDEX idx_prices_model_id ON prices(model_id);

-- Быстрый поиск связей категория-услуга
CREATE INDEX idx_category_services_category ON category_services(category_id);
CREATE INDEX idx_category_services_service ON category_services(service_id);

-- Быстрая фильтрация активных записей
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX idx_prices_active ON prices(is_active) WHERE is_active = true;
```

---

## Best Practices

### 1. Всегда фильтровать по is_active

```typescript
// ✅ Правильно
.eq('is_active', true)

// ❌ Неправильно - покажет неактивные записи
.select('*')
```

### 2. Использовать slug, а не UUID для URL

```typescript
// ✅ Правильно - SEO friendly
/pricelist/iphone/iphone-15-pro-max

// ❌ Неправильно - не читабельно
/pricelist/550e8400-e29b-41d4-a716-446655440000
```

### 3. Проверять период действия скидок

```typescript
const now = new Date();
const activeDiscounts = discounts.filter(d =>
  d.is_active &&
  (!d.valid_from || new Date(d.valid_from) <= now) &&
  (!d.valid_until || new Date(d.valid_until) >= now)
);
```

### 4. Использовать i18n функции

```typescript
// ✅ Правильно
getServiceName(service, locale)

// ❌ Неправильно - только один язык
service.name_ru
```

---

## Дополнительная информация

- Миграции: `/supabase/migrations/`
- Seed data: `/supabase/migrations/002_seed_data.sql`
- Frontend types: `/src/types/pricelist.ts`, `/src/types/database.ts`
- Queries: `/src/lib/queries.ts`
