# Migration Guide - Frontend to New DB Architecture

Пошаговое руководство по миграции фронтенда на новую архитектуру БД.

## 📋 Оглавление

- [Обзор миграции](#обзор-миграции)
- [Подготовка](#подготовка)
- [Фазы миграции](#фазы-миграции)
- [Тестирование](#тестирование)
- [Развертывание](#развертывание)
- [Откат изменений](#откат-изменений)

---

## Обзор миграции

### Что меняется

1. **Категории:** `'mac'` → `'macbook'`, `'watch'` → `'apple-watch'`
2. **Услуги:** Универсальные → Категорийно-специфичные
3. **ID:** String → UUID
4. **Названия полей:** camelCase → snake_case
5. **Данные:** Hardcoded константы → Supabase БД

### Время выполнения

**Оценка:** 13-20 часов работы

- Подготовка: 2-3 часа
- Обновление типов: 1-2 часа
- Обновление queries: 2-3 часа
- Обновление компонентов: 2-3 часа
- Обновление роутинга: 1-2 часа
- Тестирование: 2-3 часа
- Документация: 1-2 часа
- Деплой: 0.5-1 час

---

## Подготовка

### Шаг 1: Создание резервной копии

```bash
# Создать ветку для backup
git checkout -b backup/pre-db-migration

# Закоммитить текущее состояние
git add .
git commit -m "backup: save state before DB migration"

# Отправить на сервер
git push origin backup/pre-db-migration
```

### Шаг 2: Создание рабочей ветки

```bash
# Вернуться на main
git checkout main

# Создать ветку для миграции
git checkout -b feature/db-architecture-migration
```

### Шаг 3: Проверка зависимостей

```bash
# Установить/обновить зависимости
npm install

# Проверить что проект собирается
npm run build

# Запустить dev сервер
npm run dev
```

### Шаг 4: Подготовка документации

Создайте директорию для документов:

```bash
mkdir -p docs
```

---

## Фазы миграции

### ФАЗА 1: Обновление типов (1-2 часа)

#### 1.1 src/types/pricelist.ts

**Приоритет: 🔴 КРИТИЧЕСКИЙ**

1. Откройте `src/types/pricelist.ts`

2. Обновите DeviceCategory:
```typescript
- export type DeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';
+ export type DeviceCategory = 'iphone' | 'ipad' | 'macbook' | 'apple-watch';
```

3. Обновите Service интерфейс:
```typescript
export interface Service {
  id: string;
  slug: string;
- nameEn: string;
+ name_en: string;
- nameCz: string;
+ name_cz: string;
- nameRu: string;
+ name_ru: string;
  description_en?: string | null;
  description_cz?: string | null;
  description_ru?: string | null;
+ category_id?: string;
  category: 'main' | 'extra';
- priceType: PriceType;
+ price_type: PriceType;
  duration_minutes?: number | null;
}
```

4. Обновите ServicePrice интерфейс:
```typescript
export interface ServicePrice {
  serviceId: string;
  modelId: string;
  price?: number | null;
+ price_type?: PriceType;
  currency: 'CZK';
  duration?: number | null;
- warranty?: number | null;
+ warranty_months?: number | null;
- note?: string | null;
+ note_ru?: string | null;
+ note_en?: string | null;
+ note_cz?: string | null;
+ is_active?: boolean;
}
```

5. Обновите DeviceModel интерфейс:
```typescript
export interface DeviceModel {
  id: string;
  slug: string;
  category: DeviceCategory;
  name: string;
  series?: string | null;
- releaseYear?: number;
+ release_year?: number | null;
- imageUrl?: string;
+ image_url?: string | null;
- isPopular?: boolean;
+ is_popular?: boolean;
}
```

6. Добавьте новый интерфейс CategoryService:
```typescript
export interface CategoryService {
  id: string;
  category_id: string;
  service_id: string;
  is_primary: boolean;
  created_at: string;
}
```

7. Обновите Discount:
```typescript
export interface Discount {
  id: string;
- name: string;
+ name_ru: string;
+ name_en: string;
+ name_cz: string;
  type: 'percentage' | 'fixed' | 'bonus';
  value: string;
- description?: string;
- conditions?: string;
+ conditions_ru?: string;
+ conditions_en?: string;
+ conditions_cz?: string;
+ valid_from?: string | null;
+ valid_until?: string | null;
+ is_active?: boolean;
}
```

8. Пометьте устаревшие константы как deprecated:
```typescript
/**
 * @deprecated Все данные теперь загружаются из Supabase БД.
 * Используйте queries.ts для получения актуальных данных.
 */
export const MAIN_SERVICES: Service[] = [...];

/**
 * @deprecated Все данные теперь загружаются из Supabase БД.
 * Используйте queries.ts для получения актуальных данных.
 */
export const EXTRA_SERVICES: Service[] = [...];

/**
 * @deprecated Все данные теперь загружаются из Supabase БД.
 * Используйте queries.ts для получения актуальных данных.
 */
export const DEVICE_CATEGORIES: Record<DeviceCategory, CategoryInfo> = {...};
```

9. **Проверка:**
```bash
npm run build
# Должны появиться ошибки TypeScript - это нормально, будем исправлять дальше
```

---

#### 1.2 src/types/database.ts

1. Добавьте CategoryService:
```typescript
export interface CategoryService {
  id: string;
  category_id: string;
  service_id: string;
  is_primary: boolean;
  created_at: string;
}
```

2. Обновите Price (если есть):
```typescript
export interface Price {
  id: string;
  model_id: string;
  service_id: string;
  price: number | null;
  price_type: PriceType;
  duration_minutes: number | null;
  warranty_months: number | null;
+ note_ru?: string | null;
+ note_en?: string | null;
+ note_cz?: string | null;
+ is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### ФАЗА 2: Обновление queries (2-3 часа)

#### 2.1 src/lib/queries.ts

1. Обновите transformService:
```typescript
function transformService(dbService: DBService): Service {
  return {
    id: dbService.id,
    slug: dbService.slug,
-   nameEn: dbService.name_en,
+   name_en: dbService.name_en,
-   nameCz: dbService.name_cz,
+   name_cz: dbService.name_cz,
-   nameRu: dbService.name_ru,
+   name_ru: dbService.name_ru,
    description_en: dbService.description_en || undefined,
    description_cz: dbService.description_cz || undefined,
    description_ru: dbService.description_ru || undefined,
    category: dbService.service_type,
-   priceType: 'fixed',
+   price_type: 'fixed',
  };
}
```

2. Обновите transformPrice:
```typescript
function transformPrice(dbPrice: DBPrice): ServicePrice {
  return {
    serviceId: dbPrice.service_id,
    modelId: dbPrice.model_id,
    price: dbPrice.price || undefined,
+   price_type: dbPrice.price_type,
    currency: 'CZK',
    duration: dbPrice.duration_minutes || undefined,
-   warranty: dbPrice.warranty_months || 24,
+   warranty_months: dbPrice.warranty_months || 24,
-   note: dbPrice.note || undefined,
+   note_ru: dbPrice.note_ru || undefined,
+   note_en: dbPrice.note_en || undefined,
+   note_cz: dbPrice.note_cz || undefined,
+   is_active: dbPrice.is_active ?? true,
  };
}
```

3. Обновите transformDeviceModel:
```typescript
function transformDeviceModel(dbModel: any): DeviceModel {
+ const categorySlugMap: Record<string, DeviceCategory> = {
+   'iphone': 'iphone',
+   'ipad': 'ipad',
+   'macbook': 'macbook',
+   'mac': 'macbook',
+   'apple-watch': 'apple-watch',
+   'watch': 'apple-watch',
+ };

+ const categorySlug = dbModel.device_categories?.slug || 'iphone';
+ const mappedCategory = categorySlugMap[categorySlug] || categorySlug;

  return {
    id: dbModel.id,
    slug: dbModel.slug,
-   category: dbModel.device_categories?.slug || 'iphone' as DeviceCategory,
+   category: mappedCategory as DeviceCategory,
    name: dbModel.name,
    series: dbModel.series || undefined,
-   releaseYear: dbModel.release_year || undefined,
+   release_year: dbModel.release_year || undefined,
-   imageUrl: dbModel.image_url || undefined,
+   image_url: dbModel.image_url || undefined,
-   isPopular: false,
+   is_popular: dbModel.is_popular || false,
  };
}
```

4. Добавьте новую функцию getServicesForCategory:
```typescript
/**
 * Get services for a specific category with category_services relationship
 */
export async function getServicesForCategory(
  categorySlug: DeviceCategory
): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        category_services!inner(
          category_id,
          is_primary
        ),
        device_categories!inner(
          slug
        )
      `)
      .eq('device_categories.slug', categorySlug)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching services for category:', error);
      return [];
    }

    return data ? data.map(transformService) : [];
  } catch (error) {
    console.error('Unexpected error in getServicesForCategory:', error);
    return [];
  }
}
```

5. Обновите getPricesForModel (добавьте фильтр по is_active):
```typescript
export async function getPricesForModel(modelId: string): Promise<ServicePrice[]> {
  try {
    // ... существующая валидация ...

    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('model_id', modelId)
+     .eq('is_active', true)
      .order('service_id');

    // ... остальной код ...
  }
}
```

6. **Проверка:**
```bash
npm run build
# Ошибок должно стать меньше
```

---

### ФАЗА 3: Обновление компонентов (2-3 часа)

#### 3.1 src/components/pricelist/DeviceModelGrid.tsx

1. Обновите getCategoryName:
```typescript
function getCategoryName(category: DeviceCategory): string {
  const names: Record<DeviceCategory, string> = {
    iphone: 'iPhone',
    ipad: 'iPad',
-   mac: 'MacBook',
+   macbook: 'MacBook',
-   watch: 'Apple Watch',
+   'apple-watch': 'Apple Watch',
  };
  return names[category];
}
```

2. Обновите сортировку моделей:
```typescript
const sortedModels = [...models].sort((a, b) => {
- if (a.isPopular && !b.isPopular) return -1;
+ if (a.is_popular && !b.is_popular) return -1;
- if (!a.isPopular && b.isPopular) return 1;
+ if (!a.is_popular && b.is_popular) return 1;

- const yearA = a.releaseYear || 0;
+ const yearA = a.release_year || 0;
- const yearB = b.releaseYear || 0;
+ const yearB = b.release_year || 0;
  return yearB - yearA;
});
```

---

#### 3.2 src/components/pricelist/ServiceRow.tsx

1. Обновите отображение названия:
```typescript
<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
- {service.nameRu || service.nameEn}
+ {service.name_ru || service.name_en}
</h3>

{service.description_ru && (
  <p className="text-sm text-gray-600 mb-2">{service.description_ru}</p>
)}
```

2. Обновите отображение гарантии:
```typescript
- {price?.warranty && (
+ {price?.warranty_months && (
  <span className="flex items-center">
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
-   {price.warranty} мес. гарантия
+   {price.warranty_months} мес. гарантия
  </span>
)}
```

3. Добавьте многоязычность для заметок:
```typescript
// Добавьте функцию для получения заметки
function getNote(price: ServicePrice | undefined, locale: 'ru' | 'en' | 'cz' = 'ru'): string | null {
  if (!price) return null;
  if (locale === 'ru') return price.note_ru || null;
  if (locale === 'en') return price.note_en || null;
  if (locale === 'cz') return price.note_cz || null;
  return price.note_ru || null;
}

// Используйте в компоненте:
- {price?.note && (
+ {getNote(price, locale) && (
  <span className="text-gray-400 italic">
-   {price.note}
+   {getNote(price, locale)}
  </span>
)}
```

4. Обновите PriceDisplay для использования price_type:
```typescript
function PriceDisplay({ service, price }: PriceDisplayProps) {
  if (!price) {
    return <div className="text-gray-400 text-sm">Уточняйте</div>;
  }

- if (service.priceType === 'free') {
+ if (service.price_type === 'free') {
    return <div className="text-green-600 font-bold text-lg">БЕСПЛАТНО</div>;
  }

- if (service.priceType === 'on_request') {
+ if (service.price_type === 'on_request') {
    return <div className="text-gray-700 font-semibold text-base">По запросу</div>;
  }

- if (service.priceType === 'from' && price.price !== undefined && price.price !== null) {
+ if (service.price_type === 'from' && price.price !== undefined && price.price !== null) {
    return (
      <div>
        <div className="text-xs text-gray-500 mb-0.5">от</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatPrice(price.price)} {price.currency}
        </div>
      </div>
    );
  }

- if (service.priceType === 'fixed' && price.price !== undefined && price.price !== null) {
+ if (service.price_type === 'fixed' && price.price !== undefined && price.price !== null) {
    return (
      <div className="text-2xl font-bold text-gray-900">
        {formatPrice(price.price)} {price.currency}
      </div>
    );
  }

  return <div className="text-gray-400 text-sm">Уточняйте</div>;
}
```

---

#### 3.3 src/components/pricelist/CategoryNavigation.tsx

1. Обновите массив категорий:
```typescript
- const categories: DeviceCategory[] = ['iphone', 'ipad', 'mac', 'watch'];
+ const categories: DeviceCategory[] = ['iphone', 'ipad', 'macbook', 'apple-watch'];
```

2. Обновите getCategoryInfo:
```typescript
const getCategoryInfo = (category: DeviceCategory) => {
  const info: Record<DeviceCategory, { name: string; icon: string }> = {
    iphone: { name: 'iPhone', icon: '📱' },
    ipad: { name: 'iPad', icon: '📱' },
-   mac: { name: 'MacBook', icon: '💻' },
+   macbook: { name: 'MacBook', icon: '💻' },
-   watch: { name: 'Apple Watch', icon: '⌚' },
+   'apple-watch': { name: 'Apple Watch', icon: '⌚' },
  };
  return info[category];
};
```

---

### ФАЗА 4: Обновление роутинга (1-2 часа)

#### 4.1 src/app/pricelist/[category]/page.tsx

1. Добавьте редирект со старых категорий:
```typescript
import { redirect } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
+ // Редирект со старых категорий на новые
+ const categoryRedirects: Record<string, DeviceCategory> = {
+   'mac': 'macbook',
+   'watch': 'apple-watch',
+ };

+ const category = params.category as DeviceCategory;
+ const redirectTo = categoryRedirects[category];
+
+ if (redirectTo) {
+   redirect(`/pricelist/${redirectTo}`);
+ }

  // Валидация категории
  const validCategories: DeviceCategory[] = [
    'iphone',
    'ipad',
-   'mac',
+   'macbook',
-   'watch',
+   'apple-watch',
  ];

  if (!validCategories.includes(category)) {
    notFound();
  }

  // ... остальной код
}
```

---

#### 4.2 src/app/pricelist/[category]/[model]/page.tsx

Аналогичные изменения для страниц моделей.

---

### ФАЗА 5: Обновление mock data (1 час)

#### 5.1 src/lib/mockData.ts

1. Обновите категории:
```typescript
// Найдите и замените:
- category: 'mac' as DeviceCategory
+ category: 'macbook' as DeviceCategory

- category: 'watch' as DeviceCategory
+ category: 'apple-watch' as DeviceCategory
```

2. Обновите поля моделей:
```typescript
// Используйте sed или массовую замену в редакторе:
- releaseYear
+ release_year

- imageUrl
+ image_url

- isPopular
+ is_popular
```

3. Обновите услуги под категорийную структуру (опционально):
```typescript
// Создайте отдельные массивы для каждой категории
const iphoneServices: Service[] = [...];
const macbookServices: Service[] = [...];
const ipadServices: Service[] = [...];
const appleWatchServices: Service[] = [...];
```

---

## Тестирование

### Шаг 1: Build проверка

```bash
npm run build
```

**Ожидаемый результат:** Сборка проходит без ошибок TypeScript.

---

### Шаг 2: Запуск dev сервера

```bash
npm run dev
```

Откройте http://localhost:3000

---

### Шаг 3: Ручное тестирование

#### Тест 1: Навигация по категориям

- [ ] Открыть /pricelist
- [ ] Кликнуть на iPhone → проверить URL /pricelist/iphone
- [ ] Кликнуть на iPad → проверить URL /pricelist/ipad
- [ ] Кликнуть на MacBook → проверить URL /pricelist/macbook
- [ ] Кликнуть на Apple Watch → проверить URL /pricelist/apple-watch

#### Тест 2: Редиректы (backward compatibility)

- [ ] Открыть /pricelist/mac
  - Должен редиректить на /pricelist/macbook
- [ ] Открыть /pricelist/watch
  - Должен редиректить на /pricelist/apple-watch

#### Тест 3: Загрузка данных

- [ ] Открыть любую категорию
- [ ] Проверить что модели загружаются
- [ ] Выбрать модель
- [ ] Проверить что услуги и цены загружаются

#### Тест 4: Отображение цен

- [ ] Проверить что warranty_months отображается
- [ ] Проверить что note отображается (если есть)
- [ ] Проверить price_type ('free', 'fixed', 'from', 'on_request')

#### Тест 5: Многоязычность

- [ ] Переключить язык на EN
- [ ] Проверить что названия услуг меняются
- [ ] Переключить на CZ
- [ ] Переключить обратно на RU

#### Тест 6: Responsive дизайн

- [ ] Desktop: 1920x1080
- [ ] Tablet: 768x1024
- [ ] Mobile: 375x667

---

### Шаг 4: Автоматизированные тесты (если есть)

```bash
npm run test
```

---

## Развертывание

### Шаг 1: Финальная сборка

```bash
# Финальная проверка
npm run build

# Линтинг
npm run lint
```

---

### Шаг 2: Коммит изменений

```bash
git add .

git commit -m "feat: migrate frontend to new DB architecture

- Update DeviceCategory types (mac → macbook, watch → apple-watch)
- Add category-specific services support via category_services
- Update queries with proper JOIN relationships
- Add multilingual notes support (note_ru/en/cz)
- Add price filtering by is_active
- Add URL redirects for backward compatibility
- Update all field names from camelCase to snake_case
- Create comprehensive documentation

BREAKING CHANGES:
- URL /pricelist/mac → /pricelist/macbook (auto redirect)
- URL /pricelist/watch → /pricelist/apple-watch (auto redirect)
- Removed hardcoded constants (MAIN_SERVICES, EXTRA_SERVICES)
- Field names changed: nameEn → name_en, priceType → price_type, etc.

Refs: cbcdc153-684d-4670-9fd2-8243bf4870c1
"
```

---

### Шаг 3: Push и создание PR

```bash
# Push ветки
git push origin feature/db-architecture-migration

# Создайте Pull Request через GitHub UI
```

**Название PR:**
```
feat: Migrate frontend to new database architecture
```

**Описание PR:**
```markdown
## 📊 Что изменено

Полная миграция фронтенда под новую архитектуру БД с UUID, категорийно-специфичными услугами и обновленными типами.

## 🔴 Breaking Changes

- DeviceCategory: 'mac' → 'macbook', 'watch' → 'apple-watch'
- ServicePrice: добавлены note_ru/en/cz, is_active
- Удалены константы: MAIN_SERVICES, EXTRA_SERVICES
- Изменены имена полей: camelCase → snake_case

## ✅ Backward Compatibility

- ✅ Автоматические редиректы: /pricelist/mac → /pricelist/macbook
- ✅ Fallback на mock data если Supabase недоступен
- ✅ Маппинг старых категорий на новые

## 📋 Тестирование

- [x] TypeScript build проходит
- [x] Все категории открываются
- [x] Редиректы работают
- [x] Многоязычность работает
- [x] Цены загружаются из БД
- [x] Responsive дизайн проверен

## 📚 Документация

- docs/ARCHITECTURE.md - архитектура БД
- docs/BREAKING_CHANGES.md - breaking changes
- docs/MIGRATION_GUIDE.md - руководство по миграции
- README.md обновлен

## 🔗 Связанные задачи

Archon task: cbcdc153-684d-4670-9fd2-8243bf4870c1
```

---

### Шаг 4: Code Review и Merge

1. Дождитесь review
2. Исправьте комментарии если есть
3. Получите approval
4. Merge в main

```bash
git checkout main
git merge feature/db-architecture-migration
git push origin main
```

---

### Шаг 5: Production Deployment

Если используете Vercel/Netlify:
- Деплой произойдет автоматически после push в main

Если ручной деплой:
```bash
npm run build
# Загрузите build на production сервер
```

---

## Откат изменений

Если что-то пошло не так:

### Вариант 1: Откат через git

```bash
# Вернуться на backup ветку
git checkout backup/pre-db-migration

# Создать новую ветку от backup
git checkout -b hotfix/rollback-db-migration

# Push на production
git push origin hotfix/rollback-db-migration -f
```

### Вариант 2: Revert коммита

```bash
# Найти SHA коммита миграции
git log --oneline

# Создать revert
git revert <migration-commit-sha>

# Push
git push origin main
```

---

## Полезные команды

### Проверка TypeScript ошибок

```bash
npm run build
```

### Поиск использований старых типов

```bash
# Поиск 'mac' как категории
grep -r "'mac'" src/

# Поиск 'watch' как категории
grep -r "'watch'" src/

# Поиск camelCase полей
grep -r "\.nameEn" src/
grep -r "\.priceType" src/
grep -r "\.releaseYear" src/
grep -r "\.isPopular" src/
```

### Массовая замена (sed)

```bash
# macOS/Linux
find src/ -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\.nameEn/\.name_en/g'

# Windows (Git Bash)
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.nameEn/\.name_en/g' {} +
```

---

## Часто задаваемые вопросы

**Q: Что делать если build не проходит?**

A: Проверьте TypeScript ошибки:
```bash
npm run build 2>&1 | grep "error TS"
```
Исправьте ошибки по одной, начиная с типов.

---

**Q: Старые ссылки перестанут работать?**

A: Нет, настроены редиректы:
- /pricelist/mac → /pricelist/macbook
- /pricelist/watch → /pricelist/apple-watch

---

**Q: Можно ли сделать миграцию постепенно?**

A: Да, но рекомендуется делать все сразу для избежания несовместимостей.

Если нужно постепенно:
1. Сначала типы
2. Затем queries
3. Затем компоненты
4. Наконец роутинг

---

**Q: Как проверить что данные из БД загружаются?**

A: Откройте DevTools → Network → XHR
Должны быть запросы к Supabase:
```
https://[project].supabase.co/rest/v1/services?...
https://[project].supabase.co/rest/v1/prices?...
```

---

## Поддержка

При проблемах:
1. Проверьте docs/BREAKING_CHANGES.md
2. Проверьте docs/ARCHITECTURE.md
3. Откатитесь на backup ветку если критично
4. Создайте issue с подробным описанием проблемы

---

**Дата создания:** 2024-11-05

**Версия документа:** 1.0.0
