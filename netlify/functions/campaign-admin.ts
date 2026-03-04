/**
 * GET/POST /api/campaign-admin
 *
 * Admin-only campaign management endpoint.
 * GET  — returns config, templates, funnel stats, preference counts
 * POST — toggle campaign, update config, update template, send test email
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'aleksandr.zuravliov1@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'Infinite Grammar <info@infinitegrammar.de>';
const SITE_URL = process.env.SITE_URL || 'https://www.infinitegrammar.de';

function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] || match);
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const adminEmail = event.queryStringParameters?.admin_email;
      if (adminEmail !== ADMIN_EMAIL) {
        return createResponse(403, { error: 'Forbidden' });
      }

      // Get campaign config
      const config = await sql`SELECT * FROM campaign_config WHERE id = 1`;

      // Get templates
      const templates = await sql`
        SELECT id, slug, subject, body_html, is_active, updated_at
        FROM email_templates ORDER BY slug
      `;

      // Get funnel stats
      const funnel = await sql`
        SELECT
          COUNT(*) as total_sent,
          COUNT(clicked_at) as total_clicked,
          COUNT(exercise_started_at) as total_started,
          COUNT(exercise_completed_at) as total_completed
        FROM email_sends WHERE is_test = false
      `;

      // Get funnel stats for last 7 days
      const funnelWeek = await sql`
        SELECT
          COUNT(*) as total_sent,
          COUNT(clicked_at) as total_clicked,
          COUNT(exercise_started_at) as total_started,
          COUNT(exercise_completed_at) as total_completed
        FROM email_sends
        WHERE is_test = false AND sent_at > NOW() - INTERVAL '7 days'
      `;

      // Get funnel stats for last 30 days
      const funnelMonth = await sql`
        SELECT
          COUNT(*) as total_sent,
          COUNT(clicked_at) as total_clicked,
          COUNT(exercise_started_at) as total_started,
          COUNT(exercise_completed_at) as total_completed
        FROM email_sends
        WHERE is_test = false AND sent_at > NOW() - INTERVAL '30 days'
      `;

      // Get preference counts
      const prefCounts = await sql`
        SELECT
          COUNT(*) FILTER (WHERE subscribed = false) as unsubscribed,
          COUNT(*) FILTER (WHERE frequency = 'paused' AND (paused_until IS NULL OR paused_until > NOW())) as paused,
          COUNT(*) FILTER (WHERE frequency = 'reduced') as reduced_frequency
        FROM email_preferences
      `;

      // Get active schedule count
      const scheduleCount = await sql`
        SELECT COUNT(*) as active_schedules FROM campaign_schedule WHERE status = 'active'
      `;

      return createResponse(200, {
        config: config[0] || { enabled: false, max_emails_per_week: 2, comeback_mode_after_days: 30, comeback_max_per_week: 1 },
        templates,
        funnel: {
          all: funnel[0],
          week: funnelWeek[0],
          month: funnelMonth[0],
        },
        preferences: prefCounts[0] || { unsubscribed: 0, paused: 0, reduced_frequency: 0 },
        activeSchedules: parseInt(scheduleCount[0]?.active_schedules || '0', 10),
      });
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { admin_email, action } = body;

      if (admin_email !== ADMIN_EMAIL) {
        return createResponse(403, { error: 'Forbidden' });
      }

      switch (action) {
        case 'toggle_campaign': {
          const result = await sql`
            UPDATE campaign_config
            SET enabled = NOT enabled, updated_at = NOW()
            WHERE id = 1
            RETURNING enabled
          `;
          return createResponse(200, { success: true, enabled: result[0].enabled });
        }

        case 'update_config': {
          const { max_emails_per_week, comeback_mode_after_days, comeback_max_per_week } = body;
          await sql`
            UPDATE campaign_config SET
              max_emails_per_week = COALESCE(${max_emails_per_week}, max_emails_per_week),
              comeback_mode_after_days = COALESCE(${comeback_mode_after_days}, comeback_mode_after_days),
              comeback_max_per_week = COALESCE(${comeback_max_per_week}, comeback_max_per_week),
              updated_at = NOW()
            WHERE id = 1
          `;
          return createResponse(200, { success: true });
        }

        case 'update_template': {
          const { template_id, subject, body_html } = body;
          if (!template_id) {
            return createResponse(400, { error: 'template_id is required' });
          }
          await sql`
            UPDATE email_templates SET
              subject = COALESCE(${subject}, subject),
              body_html = COALESCE(${body_html}, body_html),
              updated_at = NOW()
            WHERE id = ${template_id}
          `;
          return createResponse(200, { success: true });
        }

        case 'send_test': {
          const { test_email, template_slug } = body;
          if (!test_email) {
            return createResponse(400, { error: 'test_email is required' });
          }

          // Pick a random grammar section
          const sections = await sql`
            SELECT gs.id, gs.name, gs.level, gs.category
            FROM grammar_sections gs
            WHERE gs.is_active = true
            ORDER BY RANDOM() LIMIT 1
          `;

          if (sections.length === 0) {
            return createResponse(400, { error: 'No grammar sections available' });
          }

          const section = sections[0];
          const slug = template_slug || 'reminder';

          // Get template
          const templates = await sql`
            SELECT * FROM email_templates WHERE slug = ${slug}
          `;
          if (templates.length === 0) {
            return createResponse(400, { error: 'Template not found' });
          }

          const template = templates[0];
          const trackingToken = crypto.randomBytes(16).toString('hex');
          const deepLink = `/exercise?level=${section.level.toLowerCase()}&section=${section.category}&grammar=${section.id}&utm_source=email&utm_medium=campaign&utm_campaign=test&t=${trackingToken}`;

          const vars = {
            first_name: 'Test User',
            grammar_topic: section.name,
            num_questions: '5',
            cta_url: `${SITE_URL}/api/email-track?t=${trackingToken}`,
            preferences_url: `${SITE_URL}/email-preferences?token=test`,
          };

          const html = renderTemplate(template.body_html, vars);
          const subject = renderTemplate(template.subject, vars);

          await transporter.sendMail({
            from: FROM_EMAIL,
            to: test_email,
            subject: `[TEST] ${subject}`,
            html,
          });

          // Log as test send
          await sql`
            INSERT INTO email_sends (user_id, template_slug, grammar_section_id, tracking_token, deep_link, is_test)
            SELECT u.id, ${slug}, ${section.id}, ${trackingToken}, ${deepLink}, true
            FROM users u WHERE u.email = ${ADMIN_EMAIL}
            LIMIT 1
          `;

          return createResponse(200, {
            success: true,
            message: `Test email sent to ${test_email}`,
            template: slug,
            section: section.name,
          });
        }

        default:
          return createResponse(400, { error: 'Invalid action' });
      }
    }

    return createResponse(405, { error: 'Method not allowed' });

  } catch (error) {
    return handleError(error);
  }
};
