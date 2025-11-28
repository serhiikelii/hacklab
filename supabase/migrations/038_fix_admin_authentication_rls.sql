-- Migration 038: Fix Admin Authentication and RLS Policies
-- Date: 2025-11-24
-- Author: Implementation Engineer
-- Description: Исправление проблемы "permission denied for table device_models"
--
-- Проблемы:
-- 1. Функция is_admin() не определена (используется в политиках 027)
-- 2. RLS политики сравнивают auth.uid() с колонкой id вместо user_id
-- 3. Политики проверяют только роль 'admin', но в БД используется 'superadmin'
-- 4. Функция log_audit_changes не имеет SECURITY DEFINER (admin_id = NULL в логах)
--
-- Решение основано на docs/AUTHENTICATE_PRABLEM.md

-- ============================================================================
-- 1. СОЗДАТЬ ФУНКЦИЮ is_admin()
-- ============================================================================
-- Эта функция проверяет, является ли текущий пользователь админом
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER  -- КРИТИЧНО: выполняется с правами владельца функции
SET search_path = public
AS $$
BEGIN
  -- Проверяем, есть ли текущий user_id в таблице admins с активной ролью
  RETURN EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()  -- ВАЖНО: сравниваем с user_id, НЕ с id
      AND is_active = true
      AND role IN ('admin', 'superadmin')  -- ВАЖНО: обе роли
  );
END;
$$;

-- Комментарий для документации
COMMENT ON FUNCTION public.is_admin() IS 'Проверяет, является ли текущий аутентифицированный пользователь активным админом (admin или superadmin)';

-- ============================================================================
-- 2. ИСПРАВИТЬ ФУНКЦИЮ log_audit_changes (добавить SECURITY DEFINER)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- КРИТИЧНО: без этого auth.uid() возвращает NULL
SET search_path = public
AS $$
DECLARE
  admin_uuid UUID;
BEGIN
  -- Получаем UUID админа из auth.uid()
  admin_uuid := auth.uid();

  -- Логируем действие в audit_log
  INSERT INTO public.audit_log (
    admin_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  ) VALUES (
    admin_uuid,  -- Теперь будет корректный UUID, не NULL
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.log_audit_changes() IS 'Триггерная функция для логирования изменений в таблицах с сохранением admin_id';

-- ============================================================================
-- 3. УДАЛИТЬ СТАРЫЕ НЕКОРРЕКТНЫЕ RLS ПОЛИТИКИ
-- ============================================================================

-- device_models
DROP POLICY IF EXISTS "Admins can insert device_models" ON device_models;
DROP POLICY IF EXISTS "Admins can update device_models" ON device_models;
DROP POLICY IF EXISTS "Admins can delete device_models" ON device_models;

-- prices
DROP POLICY IF EXISTS "Admins can insert prices" ON prices;
DROP POLICY IF EXISTS "Admins can update prices" ON prices;
DROP POLICY IF EXISTS "Admins can delete prices" ON prices;

-- services
DROP POLICY IF EXISTS "Admins can insert services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;

-- device_categories
DROP POLICY IF EXISTS "Admins can insert device_categories" ON device_categories;
DROP POLICY IF EXISTS "Admins can update device_categories" ON device_categories;
DROP POLICY IF EXISTS "Admins can delete device_categories" ON device_categories;

-- category_services
DROP POLICY IF EXISTS "Admins can insert category_services" ON category_services;
DROP POLICY IF EXISTS "Admins can update category_services" ON category_services;
DROP POLICY IF EXISTS "Admins can delete category_services" ON category_services;

-- discounts
DROP POLICY IF EXISTS "Admins can insert discounts" ON discounts;
DROP POLICY IF EXISTS "Admins can update discounts" ON discounts;
DROP POLICY IF EXISTS "Admins can delete discounts" ON discounts;

-- ============================================================================
-- 4. СОЗДАТЬ ПРАВИЛЬНЫЕ RLS ПОЛИТИКИ (согласно docs/AUTHENTICATE_PRABLEM.md)
-- ============================================================================
-- Паттерн:
-- 1. Используем исправленную функцию is_admin()
-- 2. Функция проверяет user_id (НЕ id)
-- 3. Функция проверяет обе роли: 'admin' И 'superadmin'

-- ========== device_models ==========
CREATE POLICY "Admins and Superadmins can insert device_models"
ON device_models
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can update device_models"
ON device_models
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can delete device_models"
ON device_models
FOR DELETE
TO authenticated
USING (is_admin());

-- ========== prices ==========
CREATE POLICY "Admins and Superadmins can insert prices"
ON prices
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can update prices"
ON prices
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can delete prices"
ON prices
FOR DELETE
TO authenticated
USING (is_admin());

-- ========== services ==========
CREATE POLICY "Admins and Superadmins can insert services"
ON services
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can update services"
ON services
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can delete services"
ON services
FOR DELETE
TO authenticated
USING (is_admin());

-- ========== device_categories ==========
CREATE POLICY "Admins and Superadmins can insert device_categories"
ON device_categories
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can update device_categories"
ON device_categories
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can delete device_categories"
ON device_categories
FOR DELETE
TO authenticated
USING (is_admin());

-- ========== category_services ==========
CREATE POLICY "Admins and Superadmins can insert category_services"
ON category_services
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can update category_services"
ON category_services
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can delete category_services"
ON category_services
FOR DELETE
TO authenticated
USING (is_admin());

-- ========== discounts ==========
CREATE POLICY "Admins and Superadmins can insert discounts"
ON discounts
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can update discounts"
ON discounts
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins and Superadmins can delete discounts"
ON discounts
FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- 5. ПЕРЕСОЗДАТЬ ТРИГГЕРЫ audit_log (на случай если были проблемы)
-- ============================================================================

-- Удаляем старые триггеры
DROP TRIGGER IF EXISTS audit_device_models_changes ON device_models;
DROP TRIGGER IF EXISTS audit_prices_changes ON prices;
DROP TRIGGER IF EXISTS audit_services_changes ON services;
DROP TRIGGER IF EXISTS audit_device_categories_changes ON device_categories;
DROP TRIGGER IF EXISTS audit_category_services_changes ON category_services;
DROP TRIGGER IF EXISTS audit_discounts_changes ON discounts;

-- Создаём новые триггеры с исправленной функцией
CREATE TRIGGER audit_device_models_changes
  AFTER INSERT OR UPDATE OR DELETE ON device_models
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_prices_changes
  AFTER INSERT OR UPDATE OR DELETE ON prices
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_services_changes
  AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_device_categories_changes
  AFTER INSERT OR UPDATE OR DELETE ON device_categories
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_category_services_changes
  AFTER INSERT OR UPDATE OR DELETE ON category_services
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_discounts_changes
  AFTER INSERT OR UPDATE OR DELETE ON discounts
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- ============================================================================
-- 6. ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ RLS ПОЛИТИК
-- ============================================================================
-- Согласно Context7 документации Supabase: индексы критичны для RLS производительности

-- Индекс для быстрого поиска админов по user_id (используется в is_admin())
CREATE INDEX IF NOT EXISTS idx_admins_user_id_active
ON admins(user_id, is_active, role)
WHERE is_active = true;

-- Индекс для audit_log по admin_id (для быстрых запросов истории действий)
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id
ON audit_log(admin_id, created_at DESC);

-- ============================================================================
-- ЗАВЕРШЕНО
-- ============================================================================

-- Вывести информацию о миграции
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 038 completed successfully';
  RAISE NOTICE '📋 Created function: is_admin() with SECURITY DEFINER';
  RAISE NOTICE '📋 Fixed function: log_audit_changes() with SECURITY DEFINER';
  RAISE NOTICE '🔒 Updated RLS policies for 6 tables (device_models, prices, services, device_categories, category_services, discounts)';
  RAISE NOTICE '🚀 Created performance indexes for admins and audit_log';
  RAISE NOTICE '⚠️  IMPORTANT: Test admin panel now - should work without "permission denied" errors';
  RAISE NOTICE '⚠️  IMPORTANT: New audit_log entries should have admin_id filled (not NULL)';
END $$;
