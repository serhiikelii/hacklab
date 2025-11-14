# 📚 MojService - Быстрый индекс

## 🗄️ База данных
- **Схема:** `supabase/migrations/001_initial_schema.sql`
- **Данные:** `supabase/migrations/002_seed_data.sql`
- **Архитектура:** `docs/ARCHITECTURE.md`
- **Конфигурация:** `.env.local` - Supabase URL и ключи
- **Проверка связи:** `node check-db.mjs` - Тест подключения к БД

### Применение миграций
```bash
# Через Supabase Management API (работает с SUPABASE_ACCESS_TOKEN из .env.local)
node apply-migration-api.mjs
```

**Примечание:** Из-за RLS политик обычные методы (`supabase db push`, прямое подключение через service_role) не работают. Используй Management API через `apply-migration-api.mjs`.

## 🔧 Типы
- `src/types/database.ts` - Типы БД
- `src/types/pricelist.ts` - Типы прайс-листа

## 📚 Библиотеки
- `src/lib/supabase.ts` - Supabase клиент
- `src/lib/queries.ts` - Запросы к БД
- `src/lib/i18n.ts` - Многоязычность (RU/EN/CZ)

## 📱 Роуты
- `src/app/pricelist/[category]/page.tsx` - Список моделей
- `src/app/pricelist/[category]/[model]/page.tsx` - Цены модели

## 🎨 Компоненты прайс-листа
- `src/components/pricelist/ServicePriceTable.tsx` - Таблица цен
- `src/components/pricelist/DeviceModelGrid.tsx` - Сетка моделей

## 📊 Структура БД
```
device_categories → device_models → prices ← services
                ↘ category_services ↗
```

## 🚀 Команды
```bash
npm run dev    # Запуск
npm run build  # Сборка
```
