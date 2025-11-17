-- Migration 021: Temporarily disable ALL audit triggers to test auth
-- Hypothesis: audit_log triggers cause issues during auth flow

-- Disable all audit triggers
ALTER TABLE device_models DISABLE TRIGGER audit_device_models;
ALTER TABLE prices DISABLE TRIGGER audit_prices;
ALTER TABLE services DISABLE TRIGGER audit_services;
ALTER TABLE device_categories DISABLE TRIGGER audit_device_categories;

-- NOTE: After testing, if this helps, we'll fix the triggers properly
-- If this doesn't help either, the problem is in Supabase Auth configuration itself
