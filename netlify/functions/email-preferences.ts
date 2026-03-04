/**
 * GET/POST /api/email-preferences
 *
 * Token-based email preference management (no login required).
 * GET ?token=X          — returns current preferences
 * GET ?token=X&action=pause       — quick pause from email footer
 * GET ?token=X&action=unsubscribe — quick unsubscribe from email footer
 * POST { token, action, frequency? } — update preferences
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};
      const token = params.token;

      if (!token) {
        return createResponse(400, { error: 'Token is required' });
      }

      // Look up token
      const tokenRows = await sql`
        SELECT ept.user_id, u.email, u.name,
               ep.subscribed, ep.frequency, ep.paused_until
        FROM email_preference_tokens ept
        JOIN users u ON ept.user_id = u.id
        LEFT JOIN email_preferences ep ON ept.user_id = ep.user_id
        WHERE ept.token = ${token}
      `;

      if (tokenRows.length === 0) {
        return createResponse(404, { error: 'Invalid token' });
      }

      const row = tokenRows[0];

      // Handle quick actions from email footer links
      const action = params.action;
      if (action === 'pause') {
        const pausedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await sql`
          INSERT INTO email_preferences (user_id, frequency, paused_until, updated_at)
          VALUES (${row.user_id}, 'paused', ${pausedUntil}, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            frequency = 'paused',
            paused_until = ${pausedUntil},
            updated_at = NOW()
        `;
        return createResponse(200, {
          success: true,
          action: 'paused',
          paused_until: pausedUntil.toISOString(),
        });
      }

      if (action === 'unsubscribe') {
        await sql`
          INSERT INTO email_preferences (user_id, subscribed, updated_at)
          VALUES (${row.user_id}, false, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            subscribed = false,
            updated_at = NOW()
        `;
        await sql`
          UPDATE campaign_schedule SET status = 'cancelled', updated_at = NOW()
          WHERE user_id = ${row.user_id} AND status = 'active'
        `;
        return createResponse(200, { success: true, action: 'unsubscribed' });
      }

      // Mask email for privacy
      const emailParts = row.email.split('@');
      const maskedEmail = emailParts[0].substring(0, 2) + '***@' + emailParts[1];

      return createResponse(200, {
        email: maskedEmail,
        name: row.name,
        subscribed: row.subscribed ?? true,
        frequency: row.frequency ?? 'normal',
        paused_until: row.paused_until,
      });
    }

    if (event.httpMethod === 'POST') {
      const { token, action, frequency } = JSON.parse(event.body || '{}');

      if (!token || !action) {
        return createResponse(400, { error: 'Token and action are required' });
      }

      // Look up token
      const tokenRows = await sql`
        SELECT user_id FROM email_preference_tokens WHERE token = ${token}
      `;

      if (tokenRows.length === 0) {
        return createResponse(404, { error: 'Invalid token' });
      }

      const userId = tokenRows[0].user_id;

      switch (action) {
        case 'unsubscribe':
          await sql`
            INSERT INTO email_preferences (user_id, subscribed, updated_at)
            VALUES (${userId}, false, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
              subscribed = false,
              updated_at = NOW()
          `;
          await sql`
            UPDATE campaign_schedule SET status = 'cancelled', updated_at = NOW()
            WHERE user_id = ${userId} AND status = 'active'
          `;
          break;

        case 'resubscribe':
          await sql`
            INSERT INTO email_preferences (user_id, subscribed, frequency, paused_until, updated_at)
            VALUES (${userId}, true, 'normal', NULL, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
              subscribed = true,
              frequency = 'normal',
              paused_until = NULL,
              updated_at = NOW()
          `;
          break;

        case 'pause_week': {
          const pausedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await sql`
            INSERT INTO email_preferences (user_id, frequency, paused_until, updated_at)
            VALUES (${userId}, 'paused', ${pausedUntil}, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
              frequency = 'paused',
              paused_until = ${pausedUntil},
              updated_at = NOW()
          `;
          break;
        }

        case 'change_frequency':
          if (!frequency || !['normal', 'reduced'].includes(frequency)) {
            return createResponse(400, { error: 'Valid frequency required: normal or reduced' });
          }
          await sql`
            INSERT INTO email_preferences (user_id, frequency, paused_until, updated_at)
            VALUES (${userId}, ${frequency}, NULL, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
              frequency = ${frequency},
              paused_until = NULL,
              updated_at = NOW()
          `;
          break;

        default:
          return createResponse(400, { error: 'Invalid action' });
      }

      return createResponse(200, { success: true, action });
    }

    return createResponse(405, { error: 'Method not allowed' });

  } catch (error) {
    return handleError(error);
  }
};
