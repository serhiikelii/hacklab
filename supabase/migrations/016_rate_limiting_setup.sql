-- Migration: Rate limiting for admin login
-- Creates login_attempts table and helper functions for brute-force protection

-- 1. Create login_attempts table
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT false,
  user_agent TEXT
);

-- 2. Create index for fast lookups
CREATE INDEX idx_login_attempts_email_time ON login_attempts(email, attempted_at DESC);
CREATE INDEX idx_login_attempts_ip_time ON login_attempts(ip_address, attempted_at DESC);

-- 3. Enable RLS on login_attempts
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- 4. RLS policy for login_attempts (only admins can view)
CREATE POLICY "Admins can view login attempts"
  ON login_attempts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('admin', 'superadmin')
    )
  );

-- 5. Allow service_role to insert login attempts (for API routes)
CREATE POLICY "Service role can insert login attempts"
  ON login_attempts
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 6. Create function to check rate limit
-- Returns TRUE if login is allowed, FALSE if rate limited
-- Checks last 15 minutes for failed attempts
CREATE OR REPLACE FUNCTION check_rate_limit(p_email TEXT, p_ip_address TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  failed_attempts_count INT;
  email_attempts INT;
  ip_attempts INT;
BEGIN
  -- Count failed attempts for this email in last 15 minutes
  SELECT COUNT(*) INTO email_attempts
  FROM login_attempts
  WHERE email = p_email
    AND attempted_at > NOW() - INTERVAL '15 minutes'
    AND success = false;

  -- If IP provided, also check IP-based rate limiting
  IF p_ip_address IS NOT NULL THEN
    SELECT COUNT(*) INTO ip_attempts
    FROM login_attempts
    WHERE ip_address = p_ip_address
      AND attempted_at > NOW() - INTERVAL '15 minutes'
      AND success = false;

    -- Block if either email OR IP exceeded limit (5 attempts)
    IF email_attempts >= 5 OR ip_attempts >= 10 THEN
      RETURN false;
    END IF;
  ELSE
    -- Only email check
    IF email_attempts >= 5 THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. Create function to record login attempt
-- Should be called from API route after each login attempt
CREATE OR REPLACE FUNCTION record_login_attempt(
  p_email TEXT,
  p_success BOOLEAN,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO login_attempts (email, success, ip_address, user_agent, attempted_at)
  VALUES (p_email, p_success, p_ip_address, p_user_agent, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to get remaining attempts
-- Returns number of attempts left before rate limit
CREATE OR REPLACE FUNCTION get_remaining_attempts(p_email TEXT)
RETURNS INT AS $$
DECLARE
  failed_count INT;
BEGIN
  SELECT COUNT(*) INTO failed_count
  FROM login_attempts
  WHERE email = p_email
    AND attempted_at > NOW() - INTERVAL '15 minutes'
    AND success = false;

  RETURN GREATEST(5 - failed_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. Create function to get time until rate limit expires
-- Returns interval until user can try again
CREATE OR REPLACE FUNCTION get_rate_limit_reset_time(p_email TEXT)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  oldest_attempt TIMESTAMPTZ;
BEGIN
  SELECT MIN(attempted_at) INTO oldest_attempt
  FROM login_attempts
  WHERE email = p_email
    AND attempted_at > NOW() - INTERVAL '15 minutes'
    AND success = false;

  IF oldest_attempt IS NULL THEN
    RETURN NOW(); -- No failed attempts, can login now
  END IF;

  RETURN oldest_attempt + INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 10. Create cleanup function to delete old login attempts
-- Should be run periodically (e.g., daily via cron)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Grant permissions
GRANT SELECT ON public.login_attempts TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION record_login_attempt(TEXT, BOOLEAN, TEXT, TEXT) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION get_remaining_attempts(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_rate_limit_reset_time(TEXT) TO authenticated, anon;

-- 12. Add comment for documentation
COMMENT ON TABLE login_attempts IS 'Tracks login attempts for rate limiting and security monitoring';
COMMENT ON FUNCTION check_rate_limit IS 'Checks if a login attempt should be allowed based on email and IP rate limiting (5 attempts per email, 10 per IP in 15 minutes)';
COMMENT ON FUNCTION record_login_attempt IS 'Records a login attempt for rate limiting and audit purposes';
COMMENT ON FUNCTION get_remaining_attempts IS 'Returns the number of login attempts remaining before rate limit';
COMMENT ON FUNCTION get_rate_limit_reset_time IS 'Returns the timestamp when the rate limit will reset';
