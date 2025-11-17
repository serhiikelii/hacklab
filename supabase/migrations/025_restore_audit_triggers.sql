-- Migration 025: Restore audit triggers
-- Now that auth is working with @supabase/ssr, we can restore audit triggers

-- Re-enable all audit triggers
ALTER TABLE device_models ENABLE TRIGGER audit_device_models;
ALTER TABLE prices ENABLE TRIGGER audit_prices;
ALTER TABLE services ENABLE TRIGGER audit_services;
ALTER TABLE device_categories ENABLE TRIGGER audit_device_categories;
