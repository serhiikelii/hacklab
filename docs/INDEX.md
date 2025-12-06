# 📚 MojService - Быстрый индекс


- **Схема:** `supabase/migrations/001_initial_schema.sql` 
- **Данные:** `supabase/migrations/002_seed_data.sql`
- **Конфигурация:** `.env.local` - Supabase URL и ключи

### Применение миграций
```bash
# Через Supabase Management API (работает с SUPABASE_ACCESS_TOKEN из .env.local)
node scripts/apply-migration-api.mjs
```

**Примечание:** Из-за RLS политик обычные методы (`supabase db push`, прямое подключение через service_role) не работают. Используй Management API через `scripts/apply-migration-api.mjs`.

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
*(Актуальную структуру смотреть в Supabase Dashboard!)*
```
device_categories → device_models → prices ← services
                ↘ category_services ↗
```

## 🛠️ Утилиты и скрипты

### ⚠️ ВАЖНО: Файлы перемещены в архив!
**Дата:** 2025-12-04
**Причина:** Подготовка к production деплою

Все development файлы перемещены в папку `_archive/`:
- **Тесты:** `_archive/tests/` - unit, integration, E2E тесты, coverage, playwright-report
- **Скрипты:** `_archive/scripts/` - все .mjs и .sql скрипты для работы с БД
- **Документация:** `_archive/docs/` - отчеты, анализы, инструкции
- **Конфиги тестов:** `_archive/configs/` - playwright.config.ts, vitest.config.ts, vitest.setup.ts
- **Build артефакты:** `_archive/build-artifacts/` - tsconfig.tsbuildinfo

**Как использовать:** Файлы остались локально в `_archive/`. Подробное описание и инструкции по восстановлению см. в `_archive/README.md`

**Перед production:** Удали всю папку `_archive/` - она уже в .gitignore и не попадет в репозиторий.

### Основные скрипты (теперь в _archive/scripts/):
- **Database:** analyze-db-schema.mjs, check-db-structure.mjs, rebuild-database.mjs
- **Data:** export-all-data.mjs, generate-seed-sql.mjs, fix-model-names-simple.mjs
- **Admin:** check-admin.mjs, test-admin-auth-flow.mjs, verify-admin-access.mjs
- **Testing:** test-frontend-access.mjs, test-audit-from-server-action.mjs

## 🚀 Команды
```bash
npm run dev    # Запуск
npm run build  # Сборка
```
```