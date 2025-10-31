# Pricelist Components

Компоненты системы прайс-листа для MojService - сервиса по ремонту Apple устройств.

## Обзор

Эта система компонентов предназначена для отображения прайс-листа с ~102 моделями устройств в 4 категориях (iPhone, iPad, Mac, Watch) и 24 типами услуг.

## Компоненты

### 1. DeviceCategoryGrid

Сетка категорий устройств (главная страница прайс-листа).

**Props:**
- `categories?`: CategoryInfo[] - Массив категорий (по умолчанию все 4)
- `onCategorySelect?`: (category: DeviceCategory) => void - Коллбэк при выборе

**Использование:**
```tsx
import { DeviceCategoryGrid } from '@/components/pricelist';

export default function PricelistPage() {
  return <DeviceCategoryGrid />;
}
```

**Функции:**
- ✅ Отображает 4 категории: iPhone, iPad, Mac, Watch
- ✅ Иконки и счетчики моделей
- ✅ Hover эффекты и анимации
- ✅ Responsive дизайн (1-2-4 колонки)
- ✅ Линки на страницы категорий

---

### 2. DeviceModelGrid

Сетка моделей устройств для выбранной категории.

**Props:**
- `category`: DeviceCategory - Категория устройств
- `models`: DeviceModel[] - Массив моделей
- `onModelSelect?`: (model: DeviceModel) => void - Коллбэк при выборе

**Использование:**
```tsx
import { DeviceModelGrid } from '@/components/pricelist';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const models = getModelsForCategory(params.category);

  return (
    <DeviceModelGrid
      category={params.category as DeviceCategory}
      models={models}
    />
  );
}
```

**Функции:**
- ✅ Responsive grid (2-3-4-5-6 колонок)
- ✅ Сортировка: популярные + новые модели сначала
- ✅ Бейджи "Популярно"
- ✅ Поддержка изображений устройств
- ✅ Breadcrumb навигация
- ✅ Линки на страницы моделей

---

### 3. ServicePriceTable

Таблица услуг с ценами для конкретной модели устройства.

**Props:**
- `model`: DeviceModel - Модель устройства
- `services`: Service[] - Массив услуг
- `prices`: ServicePrice[] - Массив цен
- `onReserve?`: (service, model) => void - Коллбэк при бронировании

**Использование:**
```tsx
import { ServicePriceTable } from '@/components/pricelist';

export default function ModelPage({ params }: { params: { slug: string } }) {
  const model = getModelBySlug(params.slug);
  const services = getAllServices();
  const prices = getPricesForModel(model.id);

  return (
    <ServicePriceTable
      model={model}
      services={services}
      prices={prices}
      onReserve={handleReservation}
    />
  );
}
```

**Функции:**
- ✅ Разделение на основные и дополнительные услуги
- ✅ Отображение гарантии (2 года)
- ✅ Информационные карточки
- ✅ Группировка услуг по категориям
- ✅ Интеграция с ServiceRow

---

### 4. ServiceRow

Строка отдельной услуги с ценой и кнопкой бронирования.

**Props:**
- `service`: Service - Услуга
- `price?`: ServicePrice - Цена для конкретной модели
- `onReserve?`: () => void - Коллбэк при нажатии "Забронировать"

**Использование:**
```tsx
import { ServiceRow } from '@/components/pricelist';

export function CustomPriceTable() {
  return (
    <div>
      {services.map(service => (
        <ServiceRow
          key={service.id}
          service={service}
          price={priceMap.get(service.id)}
          onReserve={() => handleReserve(service)}
        />
      ))}
    </div>
  );
}
```

**Функции:**
- ✅ Умное отображение цен (бесплатно/от/фиксированная/по запросу)
- ✅ Длительность ремонта
- ✅ Гарантия
- ✅ Дополнительные заметки
- ✅ Кнопка бронирования с hover эффектами
- ✅ Responsive layout

---

## Типы данных

Все типы находятся в `@/types/pricelist.ts`:

```typescript
// Категории устройств
type DeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';

// Модель устройства
interface DeviceModel {
  id: string;
  slug: string; // URL-friendly
  category: DeviceCategory;
  name: string;
  series?: string;
  releaseYear?: number;
  imageUrl?: string;
  isPopular?: boolean;
}

// Услуга
interface Service {
  id: string;
  slug: string;
  nameEn: string;
  description?: string;
  category: 'main' | 'extra';
  priceType: 'free' | 'fixed' | 'from' | 'on_request';
}

// Цена услуги для модели
interface ServicePrice {
  serviceId: string;
  modelId: string;
  price?: number; // В CZK
  currency: 'CZK';
  duration?: number; // В минутах
  warranty?: number; // В месяцах
  note?: string;
}
```

---

## Константы

Экспортируются из `@/types/pricelist.ts`:

```typescript
import {
  DEVICE_CATEGORIES, // 4 категории с иконками
  MAIN_SERVICES,     // 19 основных услуг
  EXTRA_SERVICES,    // 5 дополнительных услуг
  DISCOUNTS,         // 5 типов скидок
  PRICELIST_STATS,   // Статистика (102 модели, 24 услуги, ~2448 цен)
} from '@/types/pricelist';
```

---

## Структура роутов

```
/cenik-oprav                    → DeviceCategoryGrid (выбор категории)
/cenik-oprav/iphone             → DeviceModelGrid (модели iPhone)
/cenik-oprav/iphone-15-pro-max  → ServicePriceTable (прайс для модели)
```

---

## Стилизация

Компоненты используют:
- **Tailwind CSS** для стилей
- **Responsive grid** (mobile-first)
- **Hover эффекты** и анимации
- **Shadows** и borders для карточек
- **Градиенты** для акцентов

Цветовая схема:
- Primary (кнопки): `green-500`
- Accent: `blue-500/600`
- Text: `gray-900/600/500`
- Backgrounds: `white`, `gray-50/100`

---

## Code Quality & Improvements

### ✅ Реализованные улучшения:
1. **Error Handling** - обработка ошибок загрузки изображений в DeviceModelGrid
2. **Type Safety** - строгие проверки null/undefined для price.price
3. **Accessibility** - aria-labels для интерактивных элементов

### 🔍 Проведен критический анализ кода:
- Архитектура: компоненты следуют React best practices
- Производительность: используется сортировка на клиенте (подходит для ~102 моделей)
- Безопасность: нет XSS уязвимостей, используется безопасный рендеринг React

## Next Steps (будущие улучшения)

1. **Supabase Integration** - подключение к реальной БД
2. **Search & Filters** - поиск по моделям и услугам
3. **Reservation Modal** - модальное окно бронирования
4. **i18n** - поддержка CZ/EN/RU локализаций (структура готова к переводам)
5. **Images** - загрузка реальных изображений устройств
6. **Analytics** - отслеживание популярных услуг
7. **SEO** - метаданные для каждой модели
8. **Unit Tests** - тестирование компонентов с Vitest/Jest

---

## Примеры использования

### Полный пример страницы категории

```tsx
// app/cenik-oprav/[category]/page.tsx
import { DeviceModelGrid, DEVICE_CATEGORIES } from '@/components/pricelist';
import { getModelsForCategory } from '@/lib/pricelist';

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const models = await getModelsForCategory(params.category);

  return (
    <main>
      <DeviceModelGrid
        category={params.category as DeviceCategory}
        models={models}
      />
    </main>
  );
}

// Генерация статических путей
export async function generateStaticParams() {
  return Object.keys(DEVICE_CATEGORIES).map((category) => ({
    category,
  }));
}
```

### Полный пример страницы модели

```tsx
// app/cenik-oprav/[slug]/page.tsx
import { ServicePriceTable } from '@/components/pricelist';
import { getModelBySlug, getServicesForModel } from '@/lib/pricelist';

export default async function ModelPage({
  params,
}: {
  params: { slug: string };
}) {
  const model = await getModelBySlug(params.slug);
  const { services, prices } = await getServicesForModel(model.id);

  return (
    <main>
      <ServicePriceTable
        model={model}
        services={services}
        prices={prices}
        onReserve={async (service, model) => {
          'use server';
          // Server action для бронирования
        }}
      />
    </main>
  );
}
```

---

## Тестирование

Компоненты готовы для тестирования с:
- Mock данными из констант (`MAIN_SERVICES`, `DEVICE_CATEGORIES`)
- Реальными данными из Supabase
- Storybook (при необходимости)

---

## Поддержка

Для вопросов и предложений:
- Archon MCP: используй `mcp__archon__find_tasks` для отслеживания задач
- Documentation: см. документы проекта mojservice в Archon

---

## License

MIT © MojService 2025
