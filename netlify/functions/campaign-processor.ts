/**
 * Scheduled function: Campaign Processor
 * Runs every hour to send spaced repetition email reminders.
 *
 * Schedule: "0 * * * *" (every hour at :00)
 *
 * Logic:
 * 1. Check if campaign is enabled
 * 2. Find active schedules due for sending in the current hour
 * 3. Apply guardrails (unsubscribed, paused, already practiced, weekly cap)
 * 4. Render template, send email, log to email_sends
 * 5. Advance schedule to next step or mark completed
 */

import { Handler } from '@netlify/functions';
import { sql } from './_shared/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const SPACED_INTERVALS = [1, 3, 7, 14]; // days after last practice

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

async function getOrCreatePrefToken(userId: string): Promise<string> {
  const existing = await sql`
    SELECT token FROM email_preference_tokens WHERE user_id = ${userId}::uuid
  `;
  if (existing.length > 0) return existing[0].token;

  const token = crypto.randomBytes(32).toString('hex');
  await sql`
    INSERT INTO email_preference_tokens (user_id, token)
    VALUES (${userId}::uuid, ${token})
  `;
  return token;
}

export const handler: Handler = async () => {
  console.log('Campaign processor started');

  try {
    // 1. Check if campaign is enabled
    const configRows = await sql`SELECT * FROM campaign_config WHERE id = 1`;
    const config = configRows[0];
    if (!config?.enabled) {
      console.log('Campaign disabled, skipping');
      return { statusCode: 200, body: 'Campaign disabled' };
    }

    const currentHour = new Date().getUTCHours();
    let processed = 0;
    let sent = 0;
    let skipped = 0;

    // 2. Find all due sends for this hour
    const dueSends = await sql`
      SELECT
        cs.id, cs.user_id, cs.grammar_section_id, cs.last_practice_at,
        cs.step, cs.next_send_at,
        u.email, u.name,
        gs.name as section_name, gs.level, gs.category,
        ep.subscribed, ep.frequency, ep.paused_until
      FROM campaign_schedule cs
      JOIN users u ON cs.user_id = u.id
      JOIN grammar_sections gs ON cs.grammar_section_id = gs.id
      LEFT JOIN email_preferences ep ON cs.user_id = ep.user_id
      WHERE cs.status = 'active'
        AND cs.next_send_at <= NOW()
        AND (cs.preferred_send_hour = ${currentHour} OR cs.preferred_send_hour IS NULL)
      ORDER BY cs.next_send_at ASC
      LIMIT 100
    `;

    console.log(`Found ${dueSends.length} due sends for hour ${currentHour}`);

    // 3. Process each due send
    for (const send of dueSends) {
      processed++;

      try {
        // Guardrail: user unsubscribed
        if (send.subscribed === false) {
          await sql`UPDATE campaign_schedule SET status = 'cancelled', updated_at = NOW() WHERE id = ${send.id}`;
          skipped++;
          continue;
        }

        // Guardrail: user paused
        if (send.frequency === 'paused') {
          if (send.paused_until && new Date(send.paused_until) > new Date()) {
            skipped++;
            continue; // Still paused, skip for now
          }
          // Pause expired, auto-reset
          await sql`
            UPDATE email_preferences SET frequency = 'normal', paused_until = NULL, updated_at = NOW()
            WHERE user_id = ${send.user_id}
          `;
        }

        // Guardrail: user already practiced since scheduled
        const recentPractice = await sql`
          SELECT last_completed_at FROM user_progress
          WHERE user_id = ${send.user_id}::uuid
            AND grammar_section_id = ${send.grammar_section_id}
            AND last_completed_at > ${send.last_practice_at}
        `;
        if (recentPractice.length > 0) {
          // User practiced again, the exercise-completions hook should have
          // already reset the schedule. Cancel this stale entry.
          await sql`UPDATE campaign_schedule SET status = 'cancelled', updated_at = NOW() WHERE id = ${send.id}`;
          skipped++;
          continue;
        }

        // Guardrail: weekly email cap
        const emailsThisWeek = await sql`
          SELECT COUNT(*)::integer as cnt FROM email_sends
          WHERE user_id = ${send.user_id}::uuid
            AND sent_at > NOW() - INTERVAL '7 days'
            AND is_test = false
        `;

        // Determine if comeback mode (inactive 30+ days)
        const daysSincePractice = Math.floor(
          (Date.now() - new Date(send.last_practice_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        const isComeback = daysSincePractice >= config.comeback_mode_after_days;
        const weeklyLimit = isComeback ? config.comeback_max_per_week : config.max_emails_per_week;

        // Also apply reduced frequency if user chose it
        const effectiveLimit = send.frequency === 'reduced'
          ? Math.min(weeklyLimit, 1)
          : weeklyLimit;

        if (emailsThisWeek[0].cnt >= effectiveLimit) {
          skipped++;
          continue;
        }

        // 4. Generate tracking token and render email
        const trackingToken = crypto.randomBytes(16).toString('hex');
        const prefToken = await getOrCreatePrefToken(send.user_id);

        const deepLink = `/exercise?level=${send.level.toLowerCase()}&section=${send.category}&grammar=${send.grammar_section_id}&utm_source=email&utm_medium=campaign&utm_campaign=spaced_repetition&t=${trackingToken}`;
        const preferencesUrl = `${SITE_URL}/email-preferences?token=${prefToken}`;

        // Alternate templates between steps
        const templateSlug = send.step % 2 === 0 ? 'reminder' : 'review';
        const templateRows = await sql`
          SELECT * FROM email_templates WHERE slug = ${templateSlug} AND is_active = true
        `;

        if (templateRows.length === 0) {
          console.error(`Template "${templateSlug}" not found or inactive`);
          skipped++;
          continue;
        }

        const template = templateRows[0];
        const vars = {
          first_name: send.name || 'dort',
          grammar_topic: send.section_name,
          num_questions: '5',
          cta_url: `${SITE_URL}/api/email-track?t=${trackingToken}`,
          preferences_url: preferencesUrl,
        };

        const html = renderTemplate(template.body_html, vars);
        const subject = renderTemplate(template.subject, vars);

        // 5. Send email
        await transporter.sendMail({ from: FROM_EMAIL, to: send.email, subject, html });

        // 6. Log to email_sends
        await sql`
          INSERT INTO email_sends (user_id, template_slug, grammar_section_id, tracking_token, deep_link)
          VALUES (${send.user_id}::uuid, ${templateSlug}, ${send.grammar_section_id}, ${trackingToken}, ${deepLink})
        `;

        // 7. Advance schedule
        const nextStep = send.step + 1;
        if (nextStep >= SPACED_INTERVALS.length) {
          await sql`
            UPDATE campaign_schedule SET status = 'completed', updated_at = NOW()
            WHERE id = ${send.id}
          `;
        } else {
          const nextSendAt = new Date(Date.now() + SPACED_INTERVALS[nextStep] * 24 * 60 * 60 * 1000);
          await sql`
            UPDATE campaign_schedule
            SET step = ${nextStep}, next_send_at = ${nextSendAt}, updated_at = NOW()
            WHERE id = ${send.id}
          `;
        }

        sent++;
        console.log(`✅ Sent "${templateSlug}" to ${send.email} for "${send.section_name}" (step ${send.step})`);

        // Small delay between sends to respect SMTP rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (sendErr) {
        console.error(`❌ Failed to process send ${send.id}:`, sendErr);
        skipped++;
      }
    }

    console.log(`Campaign processor done. Processed: ${processed}, Sent: ${sent}, Skipped: ${skipped}`);
    return { statusCode: 200, body: `Processed: ${processed}, Sent: ${sent}, Skipped: ${skipped}` };

  } catch (error) {
    console.error('Campaign processor error:', error);
    return { statusCode: 500, body: 'Campaign processor failed' };
  }
};
