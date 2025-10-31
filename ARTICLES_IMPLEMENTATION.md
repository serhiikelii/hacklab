# Реализация секции статей

## Что было создано

### 1. Типы TypeScript
**Файл:** `src/types/article.ts`

Определен интерфейс `Article` с полями:
- `id` - уникальный идентификатор
- `slug` - URL-friendly идентификатор для динамических роутов
- `title` - заголовок статьи
- `excerpt` - краткое описание (превью)
- `content` - полный текст статьи в HTML формате
- `image` - путь к изображению
- `publishedAt` - дата публикации

### 2. Данные статей
**Файл:** `src/data/articles.ts`

Создан массив из 3 статей на тему ремонта телефонов:
1. "5 признаков того, что пора менять батарею iPhone"
2. "Как защитить экран смартфона от повреждений"
3. "Что делать, если телефон упал в воду"

Каждая статья содержит полноценный контент с:
- Структурированным HTML-контентом
- Заголовками разных уровней
- Списками рекомендаций
- Профессиональными советами

### 3. Компоненты

#### ArticlesSection
**Файл:** `src/components/sections/ArticlesSection.tsx`

Секция для главной страницы, показывающая 3 последние статьи:
- Responsive сетка (1 колонка на мобильных, 2 на планшете, 3 на десктопе)
- Карточки с изображением, заголовком, превью и датой
- Hover эффекты на карточках
- Кнопка "Смотреть все статьи" ведущая на `/articles`
- Форматирование даты на русском языке

**Используемые UI компоненты:**
- `Card` - для карточек статей
- `Button` - для кнопки навигации
- Иконки `Calendar`, `ArrowRight` из lucide-react
- `Link` и `Image` из Next.js

### 4. Страницы

#### Страница всех статей
**Файл:** `src/app/articles/page.tsx`

Полная страница со всеми статьями:
- Header и Footer
- Хлебные крошки для навигации
- Responsive сетка всех статей
- Метаданные для SEO

#### Страница отдельной статьи
**Файл:** `src/app/articles/[slug]/page.tsx`

Динамическая страница для просмотра полной статьи:
- Использует динамический роут `[slug]`
- `generateStaticParams()` для SSG всех статей
- `generateMetadata()` для SEO
- Хлебные крошки для навигации
- Полное изображение статьи
- Стилизованный контент с HTML
- Кнопка возврата к списку статей

#### 404 страница для статей
**Файл:** `src/app/articles/[slug]/not-found.tsx`

Пользовательская страница 404 для несуществующих статей.

### 5. Стили

**Файл:** `src/app/globals.css`

Добавлены стили для контента статей в `@layer components`:
- `.article-content h3` - заголовки 3 уровня
- `.article-content h4` - заголовки 4 уровня
- `.article-content p` - параграфы
- `.article-content ul/ol` - списки
- `.article-content li` - элементы списков
- `.article-content strong` - жирный текст
- `.article-content a` - ссылки

Все стили используют Tailwind CSS классы через `@apply`.

### 6. Обновление главной страницы

**Файл:** `src/app/page.tsx`

Добавлена секция `ArticlesSection` между `CommonIssues` и `BenefitsSection`.

**Новый порядок секций:**
1. HeroSection
2. CommonIssues
3. **ArticlesSection** ← новая секция
4. BenefitsSection
5. ServiceSection
6. ContactSection

### 7. Структура директорий

Создана директория для изображений статей:
```
public/
  images/
    articles/
      README.md  ← инструкции по добавлению изображений
```

## Как добавить новую статью

1. Откройте файл `src/data/articles.ts`
2. Добавьте новый объект в массив `articles`:

```typescript
{
  id: "4",
  slug: "your-article-slug",
  title: "Заголовок статьи",
  excerpt: "Краткое описание для превью",
  content: `
    <p>Первый параграф...</p>
    <h3>Заголовок</h3>
    <p>Еще текст...</p>
    <ul>
      <li>Пункт списка</li>
    </ul>
  `,
  image: "/images/articles/your-image.jpg",
  publishedAt: "2025-10-29",
}
```

3. Добавьте изображение в `public/images/articles/`
4. Статья автоматически появится на всех страницах

## Как добавить изображения

1. Подготовьте 3 изображения для существующих статей:
   - `iphone-battery.jpg` (батарея iPhone)
   - `screen-protection.jpg` (защитное стекло)
   - `water-damage.jpg` (попадание влаги)

2. Скопируйте их в `public/images/articles/`

3. Рекомендуемые параметры:
   - Размер: 1200x800 px
   - Формат: JPG или PNG
   - Соотношение: 16:9 или 3:2

## Особенности реализации

### Accessibility
- Semantic HTML элементы (`article`, `nav`, `time`)
- Правильные ARIA атрибуты для навигации
- Alt текст для изображений
- Keyboard navigation поддерживается через `Link`

### Performance
- Используется Next.js Image для оптимизации изображений
- Static Site Generation (SSG) для всех страниц статей
- `line-clamp` для ограничения текста в превью

### SEO
- Динамические метаданные для каждой статьи
- Правильная структура заголовков (h1, h2, h3)
- Semantic HTML
- Хлебные крошки для навигации

### UX
- Плавные hover эффекты на карточках
- Responsive дизайн для всех размеров экранов
- Понятная навигация с кнопками "Назад"
- Читабельная типографика

## Созданные файлы

1. `src/types/article.ts` - типы TypeScript
2. `src/data/articles.ts` - данные статей
3. `src/components/sections/ArticlesSection.tsx` - компонент секции
4. `src/app/articles/page.tsx` - страница всех статей
5. `src/app/articles/[slug]/page.tsx` - страница отдельной статьи
6. `src/app/articles/[slug]/not-found.tsx` - 404 страница
7. `src/app/globals.css` - обновлены стили
8. `src/app/page.tsx` - обновлена главная страница
9. `public/images/articles/README.md` - инструкции

## Следующие шаги

1. Добавить реальные изображения в `public/images/articles/`
2. Запустить проект: `npm run dev`
3. Проверить страницы:
   - Главная: `http://localhost:3000`
   - Все статьи: `http://localhost:3000/articles`
   - Отдельная статья: `http://localhost:3000/articles/5-priznakov-zameny-batarei-iphone`

## Требования к окружению

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- lucide-react (для иконок)

Все зависимости уже установлены в проекте.
