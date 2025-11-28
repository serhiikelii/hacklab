-- ============================================================================
-- Fix audit trigger to use admins.id instead of auth.uid()
-- ============================================================================
--
-- ПРОБЛЕМА: Trigger log_audit_changes() вставляет auth.uid() (user_id)
--           вместо admins.id (PK) в audit_log.admin_id
--
-- ОШИБКА: Key (admin_id)=(46ac7cf6-6a72-4232-a07e-f448361605c6) is not present in table "admins"
--          46ac7cf6... - это auth.uid() (user_id)
--          59cc5775... - это admins.id (PK) - ПРАВИЛЬНЫЙ!
--
-- РЕШЕНИЕ: Делаем SELECT из admins чтобы получить admins.id по auth.uid()
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id_pk UUID;
BEGIN
  -- ✅ КРИТИЧНО: Получаем admins.id (PK) по auth.uid() (user_id)
  SELECT id INTO admin_id_pk
  FROM public.admins
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1;

  -- Если админ не найден, пропускаем audit (но не блокируем операцию!)
  IF admin_id_pk IS NULL THEN
    -- Лог для отладки
    RAISE WARNING 'Audit skipped: No active admin found for user_id=%', auth.uid();
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Логируем действие в audit_log с правильным admin_id (admins.id)
  INSERT INTO public.audit_log (
    admin_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  ) VALUES (
    admin_id_pk,  -- ✅ Теперь используем admins.id (PK), НЕ auth.uid() (user_id)
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.log_audit_changes() IS
'Триггерная функция для audit логирования. Получает admins.id (PK) по auth.uid() (user_id).';
