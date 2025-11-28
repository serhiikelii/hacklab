-- Migration 039: Ensure category_services and other tables have RLS policies
-- Date: 2025-11-24
-- Author: Implementation Engineer
-- Description: Пересоздание политик для category_services, device_categories, discounts
--
-- Проблема: На скрине видно что политик для category_services нет

-- ============================================================================
-- 1. ПРОВЕРКА И УДАЛЕНИЕ СТАРЫХ ПОЛИТИК
-- ============================================================================

-- category_services
DROP POLICY IF EXISTS "Admins and Superadmins can insert category_services" ON category_services;
DROP POLICY IF EXISTS "Admins and Superadmins can update category_services" ON category_services;
DROP POLICY IF EXISTS "Admins and Superadmins can delete category_services" ON category_services;
DROP POLICY IF EXISTS "Public read access for category_services" ON category_services;

-- device_categories
DROP POLICY IF EXISTS "Admins and Superadmins can insert device_categories" ON device_categories;
DROP POLICY IF EXISTS "Admins and Superadmins can update device_categories" ON device_categories;
DROP POLICY IF EXISTS "Admins and Superadmins can delete device_categories" ON device_categories;
DROP POLICY IF EXISTS "Public read access for device_categories" ON device_categories;

-- discounts
DROP POLICY IF EXISTS "Admins and Superadmins can insert discounts" ON discounts;
DROP POLICY IF EXISTS "Admins and Superadmins can update discounts" ON discounts;
DROP POLICY IF EXISTS "Admins and Superadmins can delete discounts" ON discounts;
DROP POLICY IF EXISTS "Public read access for discounts" ON discounts;

-- ============================================================================
-- 2. УБЕДИТЬСЯ ЧТО RLS ВКЛЮЧЕН
-- ============================================================================
ALTER TABLE category_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. СОЗДАТЬ PUBLIC READ ПОЛИТИКИ (для анонимных пользователей)
-- ============================================================================

-- category_services - публичное чтение активных связей
CREATE POLICY "Public read access for category_services"
ON category_services
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- device_categories - публичное чтение всех категорий
CREATE POLICY "Public read access for device_categories"
ON device_categories
FOR SELECT
TO anon, authenticated
USING (true);

-- discounts - публичное чтение активных скидок
CREATE POLICY "Public read access for discounts"
ON discounts
FOR SELECT
TO anon, authenticated
USING (active = true);

-- ============================================================================
-- 4. СОЗДАТЬ ADMIN WRITE ПОЛИТИКИ (для аутентифицированных админов)
-- ============================================================================

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
-- 5. ПРОВЕРКА РЕЗУЛЬТАТА
-- ============================================================================
DO $$
DECLARE
  policy_count INTEGER;
  policy_name TEXT;
BEGIN
  -- Подсчитываем политики для category_services
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'category_services';

  RAISE NOTICE '✅ Migration 039 completed';
  RAISE NOTICE '📊 category_services has % policies', policy_count;

  IF policy_count < 4 THEN
    RAISE WARNING '⚠️  Expected at least 4 policies for category_services, found only %', policy_count;
  ELSE
    RAISE NOTICE '✅ All policies created successfully!';
  END IF;

  -- Показать все политики
  RAISE NOTICE '📋 Policies for category_services:';
  FOR policy_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'category_services'
  LOOP
    RAISE NOTICE '  - %', policy_name;
  END LOOP;
END $$;
