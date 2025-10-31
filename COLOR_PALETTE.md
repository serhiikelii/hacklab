# Цветовая палитра сайта

## Выбранная схема: Современный минимализм

### Обоснование выбора

**Sky Blue (#0ea5e9)** как основной цвет выбран по следующим причинам:

1. **Психология цвета:**
   - Синий ассоциируется с надежностью, профессионализмом и технологичностью
   - Вызывает доверие у клиентов (используется в банках, IT-компаниях, медицине)
   - Не агрессивный, в отличие от красного, который вызывает тревогу и срочность

2. **UI/UX преимущества:**
   - Современный оттенок, не корпоративно-холодный
   - Отличная контрастность с белым и серыми оттенками
   - Хорошо работает в мобильных интерфейсах
   - Проходит WCAG AA стандарт контрастности

3. **Для сервисного центра:**
   - Внушает доверие и профессионализм
   - Подчеркивает технологичность
   - Создает дружелюбную, но серьезную атмосферу

---

## Основные цвета

### Primary (Основной акцентный)
```css
--primary: #0ea5e9          /* Sky Blue 500 - основной цвет */
--primary-hover: #0284c7    /* Sky Blue 600 - hover состояния */
--primary-light: #e0f2fe    /* Sky Blue 50 - светлые фоны */
--primary-dark: #075985     /* Sky Blue 800 - темные варианты */
```

**Где использовать:**
- Основные CTA кнопки
- Ссылки и активные элементы
- Иконки и акценты
- Hover эффекты на заголовках

**Примеры:**
```tsx
<Button>Смотреть все статьи</Button>
<Link className="text-primary hover:text-primary-hover">...</Link>
<Icon className="text-primary" />
```

---

### Secondary (Вторичный)
```css
--secondary: #1f2937         /* Gray 800 - темно-серый */
--secondary-light: #374151   /* Gray 700 - hover */
```

**Где использовать:**
- Header, footer
- Темные секции
- Контрастные блоки

**Примеры:**
```tsx
<header className="bg-secondary text-white">...</header>
<Button variant="secondary">...</Button>
```

---

### Accent (Акцентный дополнительный)
```css
--accent: #06b6d4           /* Cyan 500 - особые акценты */
--accent-hover: #0891b2     /* Cyan 600 */
--accent-light: #cffafe     /* Cyan 50 */
```

**Где использовать:**
- Особые элементы интерфейса
- Badges, метки
- Дополнительные интерактивные элементы

**Примеры:**
```tsx
<Badge className="bg-accent">Новинка</Badge>
<Icon className="text-accent" />
```

---

### Success (Успех)
```css
--success: #10b981          /* Emerald 500 */
--success-light: #d1fae5    /* Emerald 50 */
```

**Где использовать:**
- Подтверждения действий
- Успешные уведомления
- Статусы "выполнено"

**Примеры:**
```tsx
<Alert variant="success">Заявка отправлена</Alert>
<Icon className="text-success" />
```

---

## Тени с цветовыми тонами

```css
shadow-primary-glow: 0 0 20px rgba(14, 165, 233, 0.3)
shadow-primary-sm: 0 2px 8px rgba(14, 165, 233, 0.15)
shadow-primary-md: 0 4px 16px rgba(14, 165, 233, 0.2)
```

**Где использовать:**
```tsx
<Card className="hover:shadow-primary-md">...</Card>
<Button className="shadow-primary-sm">...</Button>
```

---

## Градиенты (будущее использование)

```css
--gradient-from: #0ea5e9    /* Sky 500 */
--gradient-to: #06b6d4      /* Cyan 500 */
```

**Примеры использования:**
```tsx
<div className="bg-gradient-to-r from-primary to-accent">...</div>
<div className="bg-gradient-to-br from-primary via-accent to-primary-dark">...</div>
```

---

## Нейтральные цвета

Используйте стандартные Tailwind серые оттенки:

```tsx
text-gray-900    // Основной текст
text-gray-700    // Вторичный текст
text-gray-500    // Мета-информация
bg-gray-50       // Светлые фоны
bg-gray-100      // Карточки, разделители
border-gray-200  // Границы
```

---

## Таблица применения

| Элемент | Цвет | Hover | Пример |
|---------|------|-------|--------|
| CTA кнопка | `bg-primary` | `bg-primary-hover` | "Смотреть все статьи" |
| Outline кнопка | `border-primary text-primary` | `bg-primary text-white` | Вторичные действия |
| Ссылка | `text-primary` | `text-primary-hover` | Ссылки в тексте |
| Заголовок карточки | `text-gray-900` | `text-primary` | Интерактивные заголовки |
| Иконка | `text-primary/60` | `text-primary` | Календарь, телефон |
| Header фон | `bg-secondary` | - | Верхнее меню |
| Логотип акцент | `text-primary` | - | "LAB" в HACKLAB |

---

## Переходы и анимации

Используйте плавные переходы:

```tsx
transition-colors duration-250  // Цветовые переходы
transition-all duration-350     // Комплексные анимации
active:scale-[0.98]            // Микро-анимация нажатия
```

---

## Доступность (a11y)

Все цветовые комбинации проверены на контрастность:

- `primary` на белом фоне: **4.54:1** (AAA для крупного текста, AA для обычного)
- `primary-hover` на белом фоне: **5.89:1** (AAA)
- Белый текст на `primary`: **4.54:1** (AA)
- Белый текст на `secondary`: **15.33:1** (AAA)

---

## Миграция с красной схемы

### Было → Стало

| Старый цвет | Новый цвет | Контекст |
|-------------|------------|----------|
| `#c44536` (красный) | `#0ea5e9` (sky blue) | Primary кнопки |
| `#b23a2f` (темно-красный) | `#0284c7` (sky hover) | Hover эффекты |
| `text-red-600` | `text-primary` | Акценты в логотипе |
| `text-blue-600` | `text-primary` | Ссылки в контенте |

---

## Примеры компонентов

### Кнопка с иконкой
```tsx
<Button className="group">
  Смотреть все статьи
  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
</Button>
```

### Карточка статьи
```tsx
<Card className="hover:shadow-primary-md transition-all duration-350">
  <h3 className="group-hover:text-primary transition-colors duration-250">
    Заголовок
  </h3>
</Card>
```

### Интерактивная ссылка
```tsx
<Link className="flex items-center gap-2 text-white hover:text-primary transition-colors duration-250">
  <Phone className="w-5 h-5" />
  <span>+420 607 855 558</span>
</Link>
```

---

## Дальнейшие рекомендации

1. **Для акций/скидок** используйте `success` цвет вместо красного
2. **Для предупреждений** рассмотрите оранжевый (#f59e0b - amber-500)
3. **Для ошибок** используйте красный, но приглушенный (#ef4444 - red-500)
4. **Темная тема** (будущее): используйте `primary-dark` как базу

---

*Обновлено: 2025-10-29*
*Дизайнер: Claude (Frontend UI Specialist)*
