# Breaking Changes - Database Migration

Этот документ описывает критические изменения при миграции на новую архитектуру БД.

## 🚨 Критические изменения URL

### Категории устройств

**БЫЛО:**
- `/pricelist/mac`
- `/pricelist/watch`

**СТАЛО:**
- `/pricelist/macbook`
- `/pricelist/apple-watch`

**Обратная совместимость:**
✅ Автоматические редиректы настроены:
- `/pricelist/mac` → `/pricelist/macbook` (301 redirect)
- `/pricelist/watch` → `/pricelist/apple-watch` (301 redirect)

**Действия:**
- Обновите все внутренние ссылки на новые URL
- Внешние ссылки будут работать через редирект
- Обновите sitemap.xml если используется

---

## 📝 Изменения в TypeScript типах

### DeviceCategory

**БЫЛО:**
```typescript
type DeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';
```

**СТАЛО:**
```typescript
type DeviceCategory = 'iphone' | 'ipad' | 'macbook' | 'apple-watch';
```

**Действия:**
- Обновите все hardcoded значения 'mac' → 'macbook'
- Обновите все hardcoded значения 'watch' → 'apple-watch'
- Проверьте switch/case statements
- Проверьте объекты Record<DeviceCategory, ...>

---

### Service

**БЫЛО:**
```typescript
interface Service {
  id: string;
  slug: string;
  nameEn: string;
  nameCz: string;
  nameRu: string;
  priceType: PriceType;
  category: 'main' | 'extra';
}
```

**СТАЛО:**
```typescript
interface Service {
  id: string; // UUID
  slug: string;
  name_en: string;        // ⚠️ Изменено: nameEn → name_en
  name_cz: string;        // ⚠️ Изменено: nameCz → name_cz
  name_ru: string;        // ⚠️ Изменено: nameRu → name_ru
  description_en?: string | null;
  description_cz?: string | null;
  description_ru?: string | null;
  category_id?: string;   // ⚠️ Новое: UUID категории
  category: 'main' | 'extra';
  price_type: PriceType;  // ⚠️ Изменено: priceType → price_type
  duration_minutes?: number | null;
}
```

**Действия:**
- Замените все `service.nameEn` → `service.name_en`
- Замените все `service.nameCz` → `service.name_cz`
- Замените все `service.nameRu` → `service.name_ru`
- Замените все `service.priceType` → `service.price_type`

---

### ServicePrice

**БЫЛО:**
```typescript
interface ServicePrice {
  serviceId: string;
  modelId: string;
  price?: number | null;
  currency: 'CZK';
  duration?: number | null;
  warranty?: number | null;  // ⚠️ Изменено
  note?: string | null;       // ⚠️ Изменено
}
```

**СТАЛО:**
```typescript
interface ServicePrice {
  serviceId: string;  // UUID
  modelId: string;    // UUID
  price?: number | null;
  price_type?: PriceType;
  currency: 'CZK';
  duration?: number | null;
  warranty_months?: number | null;  // ⚠️ warranty → warranty_months
  note_ru?: string | null;          // ⚠️ note → note_ru/en/cz
  note_en?: string | null;
  note_cz?: string | null;
  is_active?: boolean;              // ⚠️ Новое
}
```

**Действия:**
- Замените `price.warranty` → `price.warranty_months`
- Замените `price.note` → `price.note_ru` (или используйте i18n функцию)
- Учитывайте `price.is_active` при фильтрации

---

### DeviceModel

**БЫЛО:**
```typescript
interface DeviceModel {
  id: string;
  slug: string;
  category: DeviceCategory;
  name: string;
  releaseYear?: number;  // ⚠️ Изменено
  imageUrl?: string;     // ⚠️ Изменено
  isPopular?: boolean;   // ⚠️ Изменено
}
```

**СТАЛО:**
```typescript
interface DeviceModel {
  id: string;  // UUID
  slug: string;
  category: DeviceCategory;
  name: string;
  series?: string | null;
  release_year?: number | null;   // ⚠️ releaseYear → release_year
  image_url?: string | null;      // ⚠️ imageUrl → image_url
  is_popular?: boolean;           // ⚠️ isPopular → is_popular
}
```

**Действия:**
- Замените `model.releaseYear` → `model.release_year`
- Замените `model.imageUrl` → `model.image_url`
- Замените `model.isPopular` → `model.is_popular`

---

### Discount

**БЫЛО:**
```typescript
interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bonus';
  value: string;
  description?: string;
  conditions?: string;
}
```

**СТАЛО:**
```typescript
interface Discount {
  id: string;  // UUID
  name_ru: string;                    // ⚠️ name → name_ru/en/cz
  name_en: string;
  name_cz: string;
  type: 'percentage' | 'fixed' | 'bonus';
  value: string;
  conditions_ru?: string;             // ⚠️ Многоязычные условия
  conditions_en?: string;
  conditions_cz?: string;
  valid_from?: string | null;         // ⚠️ Новое
  valid_until?: string | null;        // ⚠️ Новое
  is_active?: boolean;                // ⚠️ Новое
}
```

**Действия:**
- Замените `discount.name` → `discount.name_ru` (или используйте i18n)
- Замените `discount.conditions` → `discount.conditions_ru`
- Проверяйте период действия через valid_from/valid_until

---

## 🗑️ Удаленные константы

### Что удалено из pricelist.ts

```typescript
// ❌ Удалено:
export const MAIN_SERVICES: Service[] = [...];
export const EXTRA_SERVICES: Service[] = [...];
export const DEVICE_CATEGORIES: Record<DeviceCategory, CategoryInfo> = {...};
export const DISCOUNTS: Discount[] = [...];
export const PRICELIST_STATS = {...};
```

**Причина:**
Данные теперь загружаются из Supabase БД, а не из hardcoded констант.

**Замена:**

```typescript
// ✅ Вместо MAIN_SERVICES:
import { getServicesForCategory } from '@/lib/queries';
const services = await getServicesForCategory('iphone');

// ✅ Вместо DEVICE_CATEGORIES:
import { getCategories } from '@/lib/queries';
const categories = await getCategories();

// ✅ Вместо DISCOUNTS:
import { getActiveDiscounts } from '@/lib/queries';
const discounts = await getActiveDiscounts();
```

**Действия:**
- Замените все использования констант на вызовы queries
- Удалите импорты удаленных констант
- Обновите тесты

---

## 🏗️ Архитектурные изменения

### 1. ID система: String → UUID

**БЫЛО:**
```typescript
const service = {id: '1', ...};
const model = {id: '42', ...};
```

**СТАЛО:**
```typescript
const service = {id: '550e8400-e29b-41d4-a716-446655440000', ...};
const model = {id: '7c9e6679-7425-40de-944b-e07fc1f90ae7', ...};
```

**Действия:**
- НЕ используйте hardcoded ID в коде
- Используйте slug для идентификации в URL
- Получайте ID из БД, не угадывайте

---

### 2. Услуги: Универсальные → Категорийно-специфичные

**БЫЛО:**
Одна услуга "Battery replacement" для всех категорий.

**СТАЛО:**
Отдельные услуги для каждой категории:
- `iphone-battery` - Замена батареи iPhone
- `macbook-battery` - Замена батареи MacBook
- `ipad-battery` - Замена батареи iPad
- `apple-watch-battery` - Замена батареи Apple Watch

**Действия:**
- Используйте category_services для фильтрации
- Учитывайте slug с префиксом категории
- Не ожидайте универсальных услуг

---

### 3. Связь категории и услуг: Direct → Many-to-Many

**БЫЛО:**
Прямая связь через константы.

**СТАЛО:**
Таблица category_services (many-to-many):

```sql
CREATE TABLE category_services (
  category_id UUID REFERENCES device_categories(id),
  service_id UUID REFERENCES services(id),
  is_primary BOOLEAN,
  ...
);
```

**Действия:**
- Используйте JOIN через category_services
- Учитывайте is_primary для разделения на main/extra

---

## 📊 Миграция запросов

### Получение услуг

**БЫЛО:**
```typescript
import { MAIN_SERVICES } from '@/types/pricelist';
const services = MAIN_SERVICES;
```

**СТАЛО:**
```typescript
import { getServicesForCategory } from '@/lib/queries';
const services = await getServicesForCategory('iphone');
```

---

### Получение моделей

**БЫЛО:**
```typescript
const models = DEVICE_CATEGORIES.iphone.models;
```

**СТАЛО:**
```typescript
import { getModelsForCategory } from '@/lib/queries';
const models = await getModelsForCategory('iphone');
```

---

### Получение цен

**БЫЛО:**
```typescript
const prices = mockData.getPricesForModel(modelId);
```

**СТАЛО:**
```typescript
import { getPricesForModel } from '@/lib/queries';
const prices = await getPricesForModel(modelId);
// Теперь из БД, а не из мока
```

---

## ✅ Чеклист миграции для разработчиков

### Обновление кода

- [ ] Заменить 'mac' → 'macbook' во всем коде
- [ ] Заменить 'watch' → 'apple-watch' во всем коде
- [ ] Обновить все поля с camelCase на snake_case:
  - [ ] nameEn/Cz/Ru → name_en/cz/ru
  - [ ] priceType → price_type
  - [ ] releaseYear → release_year
  - [ ] imageUrl → image_url
  - [ ] isPopular → is_popular
- [ ] Заменить константы на вызовы queries
- [ ] Удалить импорты удаленных констант
- [ ] Обновить switch/case с DeviceCategory
- [ ] Обновить Record<DeviceCategory, ...> объекты

### Обновление запросов

- [ ] Добавить JOIN с category_services где нужно
- [ ] Фильтровать по is_active
- [ ] Использовать slug вместо ID в URL
- [ ] Проверять период действия скидок

### Тестирование

- [ ] npm run build проходит без ошибок
- [ ] Все категории открываются
- [ ] Редиректы mac/watch работают
- [ ] Многоязычность работает
- [ ] Данные из БД загружаются корректно
- [ ] Fallback на mock data работает

### Внешние интеграции

Если вы используете API этого сайта:

- [ ] Обновите URL категорий
- [ ] Обновите типы данных (TypeScript definitions)
- [ ] Учитывайте новую структуру услуг
- [ ] Проверьте backward compatibility

---

## 🆘 Поддержка

При проблемах с миграцией:

1. Проверьте консоль браузера на ошибки TypeScript
2. Проверьте логи сервера Supabase
3. Используйте mock data для локальной разработки
4. См. docs/ARCHITECTURE.md для деталей БД

---

**Дата миграции:** 2024-11-05

**Версия:** 2.0.0 (Breaking Changes)
