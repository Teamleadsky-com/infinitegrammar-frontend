/**
 * GET /api/email-track?t=TRACKING_TOKEN
 *
 * Click tracking redirect. When a user clicks the CTA in a campaign email,
 * this records the click and redirects to the exercise deep link.
 */

import { Handler } from '@netlify/functions';
import { sql, handleError, corsHeaders } from './_shared/db';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method not allowed',
    };
  }

  try {
    const trackingToken = event.queryStringParameters?.t;

    if (!trackingToken) {
      // Redirect to homepage if no token
      return {
        statusCode: 302,
        headers: { Location: '/', ...corsHeaders },
        body: '',
      };
    }

    // Look up the send record
    const rows = await sql`
      SELECT deep_link, clicked_at FROM email_sends WHERE tracking_token = ${trackingToken}
    `;

    if (rows.length === 0) {
      // Invalid token, redirect to homepage
      return {
        statusCode: 302,
        headers: { Location: '/', ...corsHeaders },
        body: '',
      };
    }

    const send = rows[0];

    // Record click if not already recorded
    if (!send.clicked_at) {
      await sql`
        UPDATE email_sends SET clicked_at = NOW() WHERE tracking_token = ${trackingToken}
      `;
    }

    // Redirect to the exercise deep link
    return {
      statusCode: 302,
      headers: { Location: send.deep_link, ...corsHeaders },
      body: '',
    };

  } catch (error) {
    console.error('Email track error:', error);
    // On error, redirect to homepage rather than showing an error
    return {
      statusCode: 302,
      headers: { Location: '/', ...corsHeaders },
      body: '',
    };
  }
};
