-- ================================================
-- Migration 003: Email Campaign System
-- Spaced repetition email reminders for grammar practice
-- ================================================

-- ================================================
-- TABLE: email_preferences
-- User email notification preferences (GDPR)
-- ================================================
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  subscribed BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'normal',        -- 'normal', 'reduced', 'paused'
  paused_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_preferences_user ON email_preferences(user_id);

-- ================================================
-- TABLE: email_preference_tokens
-- Long-lived tokens for passwordless preference access
-- ================================================
CREATE TABLE email_preference_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_pref_tokens_token ON email_preference_tokens(token);
CREATE INDEX idx_email_pref_tokens_user ON email_preference_tokens(user_id);

-- ================================================
-- TABLE: email_templates
-- Editable campaign email templates
-- ================================================
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed the two default templates
INSERT INTO email_templates (slug, subject, body_html) VALUES
(
  'reminder',
  '2-Minute-Übung: {{grammar_topic}} (weitermachen?)',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">2-Minute-Übung</h1>
  </div>
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hallo {{first_name}},</p>
    <p style="font-size: 16px;">kurze Erinnerung an dein letztes Thema: <strong>{{grammar_topic}}</strong>. Mach jetzt eine 2-Minuten-Übung ({{num_questions}} Lücken) und festige es direkt.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{cta_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">👉 Hier starten</a>
    </div>
    <p style="font-size: 14px; color: #666;">Tipp: Wenn du heute 1 Runde machst, bleibt dein Fortschritt stabil – und die nächsten Übungen werden leichter.</p>
    <p style="font-size: 16px;">Viel Spaß!<br>Infinite Grammar</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
    <p>Infinite Grammar – Deutsche Grammatik meistern</p>
    <p><a href="{{preferences_url}}" style="color: #667eea;">E-Mail-Einstellungen</a> · <a href="{{preferences_url}}&action=pause" style="color: #667eea;">1 Woche pausieren</a> · <a href="{{preferences_url}}&action=unsubscribe" style="color: #667eea;">Abmelden</a></p>
  </div>
</body>
</html>'
),
(
  'review',
  'Eine Mini-Wiederholung zu {{grammar_topic}} – 5 Lücken, fertig',
  '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Mini-Wiederholung</h1>
  </div>
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi {{first_name}},</p>
    <p style="font-size: 16px;">du hast zuletzt <strong>{{grammar_topic}}</strong> geübt. Hier ist eine schnelle Wiederholung – {{num_questions}} Lücken, dann bist du durch:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{cta_url}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">✅ Jetzt üben</a>
    </div>
    <p style="font-size: 14px; color: #666;">Warum das hilft: Kurze Wiederholungen in Abständen verbessern das Erinnern – ohne lange Sessions.</p>
    <p style="font-size: 16px;">Bis gleich!<br>Infinite Grammar</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
    <p>Infinite Grammar – Deutsche Grammatik meistern</p>
    <p><a href="{{preferences_url}}" style="color: #667eea;">E-Mail-Einstellungen</a> · <a href="{{preferences_url}}&action=pause" style="color: #667eea;">1 Woche pausieren</a> · <a href="{{preferences_url}}&action=unsubscribe" style="color: #667eea;">Abmelden</a></p>
  </div>
</body>
</html>'
);

-- ================================================
-- TABLE: campaign_schedule
-- Per-user per-section spaced repetition state
-- step: 0=+1d, 1=+3d, 2=+7d, 3=+14d
-- ================================================
CREATE TABLE campaign_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grammar_section_id TEXT NOT NULL REFERENCES grammar_sections(id) ON DELETE CASCADE,
  last_practice_at TIMESTAMP NOT NULL,
  step INTEGER NOT NULL DEFAULT 0,
  next_send_at TIMESTAMP NOT NULL,
  preferred_send_hour INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, grammar_section_id)
);

CREATE INDEX idx_campaign_schedule_next ON campaign_schedule(next_send_at) WHERE status = 'active';
CREATE INDEX idx_campaign_schedule_user ON campaign_schedule(user_id);

-- ================================================
-- TABLE: email_sends
-- Log of every campaign email sent, with funnel tracking
-- ================================================
CREATE TABLE email_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_slug TEXT NOT NULL,
  grammar_section_id TEXT REFERENCES grammar_sections(id),
  tracking_token TEXT NOT NULL UNIQUE,
  deep_link TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  clicked_at TIMESTAMP,
  exercise_started_at TIMESTAMP,
  exercise_completed_at TIMESTAMP,
  is_test BOOLEAN DEFAULT false
);

CREATE INDEX idx_email_sends_token ON email_sends(tracking_token);
CREATE INDEX idx_email_sends_user ON email_sends(user_id, sent_at DESC);
CREATE INDEX idx_email_sends_sent ON email_sends(sent_at);

-- ================================================
-- TABLE: campaign_config
-- Singleton row for global campaign settings
-- ================================================
CREATE TABLE campaign_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN DEFAULT false,
  max_emails_per_week INTEGER DEFAULT 2,
  comeback_mode_after_days INTEGER DEFAULT 30,
  comeback_max_per_week INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO campaign_config (enabled) VALUES (false);
