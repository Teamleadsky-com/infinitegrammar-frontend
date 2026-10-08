/**
 * /api/admin-excluded-users
 *
 * Accounts left out of every learner-based analytics number (analytics_excluded_users).
 * GET    - list excluded accounts
 * POST   - {email, note?}: exclude the account with exactly this email (404 if none)
 * DELETE - {userId}: remove an account from the list
 *
 * Accounts are added by exact email only: there is no user search, so the endpoint
 * never lists users who are not already excluded.
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';

const list = () => sql`
  SELECT x.user_id, coalesce(x.email, u.email) AS email, x.note, x.added_at, x.added_by
  FROM analytics_excluded_users x
  LEFT JOIN users u ON u.id = x.user_id
  ORDER BY x.added_at
`;

const toAccount = (r: any) => ({
  userId: r.user_id,
  email: r.email,
  note: r.note,
  addedAt: r.added_at,
  addedBy: r.added_by,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const rows = await list();
      return createResponse(200, { accounts: rows.map(toAccount) });
    }

    if (event.httpMethod === 'POST') {
      const { email, note } = JSON.parse(event.body || '{}');
      const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';
      if (!normalized) {
        return createResponse(400, { error: 'Email is required' });
      }

      const users = await sql`SELECT id, email FROM users WHERE lower(email) = ${normalized} LIMIT 1`;
      if (users.length === 0) {
        return createResponse(404, { error: 'No account with this email' });
      }

      await sql`
        INSERT INTO analytics_excluded_users (user_id, email, note, added_by)
        VALUES (${users[0].id}, ${users[0].email}, ${note || null}, 'admin panel')
        ON CONFLICT (user_id) DO UPDATE SET note = EXCLUDED.note
        RETURNING user_id
      `;
      const rows = await list();
      return createResponse(200, { accounts: rows.map(toAccount) });
    }

    if (event.httpMethod === 'DELETE') {
      const { userId } = JSON.parse(event.body || '{}');
      if (!userId) {
        return createResponse(400, { error: 'userId is required' });
      }

      await sql`DELETE FROM analytics_excluded_users WHERE user_id = ${userId}::uuid RETURNING user_id`;
      const rows = await list();
      return createResponse(200, { accounts: rows.map(toAccount) });
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    return handleError(error);
  }
};
