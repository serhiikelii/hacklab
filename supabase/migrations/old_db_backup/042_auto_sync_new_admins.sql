-- Migration 042: Auto-sync new admins from auth.users to public.admins
-- Цель: Автоматически создавать запись в public.admins при регистрации через Supabase Email Invite

-- =====================================================
-- 1. Создаем функцию для автоматического добавления админа
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Важно! Функция выполняется с правами владельца (postgres)
SET search_path = public
AS $$
BEGIN
  -- Логируем для отладки
  RAISE LOG 'Trigger handle_new_user_signup: New user created with id=%', NEW.id;

  -- Проверяем, не существует ли уже запись в public.admins
  IF EXISTS (SELECT 1 FROM public.admins WHERE user_id = NEW.id) THEN
    RAISE LOG 'Admin already exists for user_id=%', NEW.id;
    RETURN NEW;
  END IF;

  -- Вставляем нового админа в public.admins
  INSERT INTO public.admins (
    user_id,
    email,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,                    -- user_id из auth.users
    NEW.email,                 -- email из auth.users
    'admin',                   -- роль по умолчанию
    true,                      -- активен по умолчанию
    NOW(),
    NOW()
  );

  RAISE LOG 'Successfully created admin record for user_id=%', NEW.id;
  RETURN NEW;
END;
$$;

-- =====================================================
-- 2. Создаем триггер на INSERT в auth.users
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

-- =====================================================
-- 3. Синхронизируем СУЩЕСТВУЮЩИХ пользователей из auth.users
-- =====================================================
-- Вставляем только тех, кто еще не в admins
INSERT INTO public.admins (user_id, email, role, is_active, created_at, updated_at)
SELECT
  au.id,
  au.email,
  'admin',
  true,
  NOW(),
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.admins a WHERE a.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- Комментарии для документации
-- =====================================================
COMMENT ON FUNCTION public.handle_new_user_signup() IS
'Автоматически создает запись в public.admins при регистрации нового пользователя через Supabase Auth (Email Invite)';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS
'Вызывает handle_new_user_signup() после INSERT в auth.users для автоматической синхронизации с public.admins';
