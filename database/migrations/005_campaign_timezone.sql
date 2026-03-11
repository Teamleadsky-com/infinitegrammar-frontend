-- ================================================
-- Migration 005: Add timezone to campaign_schedule
-- preferred_send_hour is now a LOCAL hour in the user's timezone
-- ================================================

-- Add timezone column (IANA timezone string, e.g. 'Europe/Berlin')
ALTER TABLE campaign_schedule ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Default existing schedules to Europe/Berlin (German learning app)
UPDATE campaign_schedule SET timezone = 'Europe/Berlin' WHERE timezone IS NULL;

-- Recalculate preferred_send_hour for active schedules:
-- Convert from UTC-based hour to local hour in Europe/Berlin.
-- For existing rows, preferred_send_hour was stored as a UTC hour.
-- CET = UTC+1, CEST = UTC+2. Since we can't know which was intended,
-- use +1 (CET) as a safe default for the conversion.
UPDATE campaign_schedule
SET preferred_send_hour = (preferred_send_hour + 1) % 24
WHERE status = 'active'
  AND preferred_send_hour IS NOT NULL;
