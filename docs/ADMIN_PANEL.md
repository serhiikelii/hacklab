# Админ-панель MojService

## Реализация

### Архитектура
- **Auth**: Supabase Auth с @supabase/ssr для корректной работы cookies в Next.js App Router
- **Роли**: editor, admin, superadmin (enum в БД)
- **Защита**: RLS политики, rate limiting, audit logging

### Структура БД
```sql
-- Таблица администраторов
admins (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  email TEXT,
  role admin_role_enum,
  is_active BOOLEAN
)

-- Audit log для отслеживания изменений
audit_log (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admins,
  action TEXT,
  table_name TEXT,
  old_data JSONB,
  new_data JSONB
)

-- Rate limiting для защиты от brute-force
login_attempts (
  email TEXT,
  ip_address TEXT,
  success BOOLEAN,
  attempted_at TIMESTAMP
)
```

### Server Actions (src/app/admin/)
```typescript
// login/actions.ts - аутентификация с rate limiting
loginAction(formData) {
  1. Проверка rate limit (5 попыток/15мин)
  2. signInWithPassword()
  3. Проверка прав в admins таблице
  4. Запись попытки логина
}

// actions.ts - работа с сессией
getAdminUser() - получение данных админа
signOutAction() - выход из системы
```

### RLS Политики

**Проблема**: Циклическая зависимость
```sql
-- ❌ Проблема: is_admin() запрашивает admins,
-- но сама политика на admins использует is_admin()
CREATE POLICY ON admins USING (is_admin());
```

**Решение**: SECURITY DEFINER + простые политики
```sql
-- ✅ Функция с SECURITY DEFINER обходит RLS
CREATE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  -- Ключевое решение!
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
      AND is_active = true
  );
END;
$$;

-- Политики на admins - простые, без рекурсии
CREATE POLICY "Service role full access" ON admins
  FOR ALL TO service_role USING (true);

CREATE POLICY "Authenticated can read active admins" ON admins
  FOR SELECT TO authenticated USING (is_active = true);

-- Политики на рабочих таблицах используют is_admin()
CREATE POLICY "Admins can insert device_models" ON device_models
  FOR INSERT TO authenticated WITH CHECK (is_admin());
```

### Rate Limiting
```sql
-- Функция проверки лимитов
check_rate_limit(p_email TEXT) RETURNS BOOLEAN
-- Лимиты: 5 попыток на email, 10 на IP за 15 минут

record_login_attempt(p_email, p_success, p_ip, p_user_agent)
```

### Audit Logging
```sql
-- Триггеры на всех основных таблицах
CREATE TRIGGER audit_device_models
  AFTER INSERT OR UPDATE OR DELETE ON device_models
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Функция с обработкой ошибок
CREATE FUNCTION log_audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Логирует admin_id, action, old_data, new_data
  -- Безопасно обрабатывает случай когда admin_id = NULL
END;
$$;
```

## Создание первого админа

**Проблема**: Нельзя создать через SQL - неправильный хеш пароля

**Решение**: Admin API
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, serviceRoleKey)

// 1. Создать в auth.users
const { data } = await supabase.auth.admin.createUser({
  email: 'admin@example.com',
  password: 'SecurePassword123',
  email_confirm: true
})

// 2. Добавить в admins таблицу
await supabase.from('admins').insert({
  user_id: data.user.id,
  email: data.user.email,
  role: 'superadmin',
  is_active: true
})
```

## Ключевые моменты

1. **@supabase/ssr обязателен** для Next.js App Router - без него сессии не сохраняются
2. **SECURITY DEFINER** решает проблему циклических RLS зависимостей
3. **Admin API** - единственный способ создать пользователей с правильным хешем пароля
4. **Server Actions** - безопасный способ работы с auth на сервере
5. **Rate limiting + Audit log** - обязательная защита админ-панели

## Миграции
- `015_admin_auth_setup.sql` - базовая инфраструктура
- `016_rate_limiting_setup.sql` - защита от brute-force
- `019_fix_admin_rls_cycle.sql` - SECURITY DEFINER для is_admin()
- `024_restore_admins_rls.sql` - правильные политики на admins
- `026_fix_rls_policies_final.sql` - убрана рекурсия
- `027_restore_admin_write_policies.sql` - INSERT/UPDATE/DELETE для админов
