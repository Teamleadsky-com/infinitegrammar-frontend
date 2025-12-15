/**
 * POST /api/send-magic-link
 *
 * Generate and send a magic link for passwordless authentication
 */

import { Handler } from '@netlify/functions';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create reusable transporter
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

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { email } = JSON.parse(event.body || '{}');

    if (!email) {
      return createResponse(400, { error: 'Email is required' });
    }

    // Check if user exists
    const users = await sql`
      SELECT id, email, name
      FROM users
      WHERE email = ${email.toLowerCase()}
    `;

    if (users.length === 0) {
      // Don't reveal if user exists for security
      return createResponse(200, {
        message: 'If an account exists with this email, a magic link has been sent.',
      });
    }

    const user = users[0];

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store token in database
    await sql`
      INSERT INTO magic_link_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    // Create magic link URL
    const magicLinkUrl = `${SITE_URL}/verify-magic-link?token=${token}`;

    // Send email with magic link
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: '🔗 Your Magic Link to Infinite Grammar',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Magic Link</h1>
            </div>

            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi${user.name ? ` ${user.name}` : ''},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Click the button below to sign in to your Infinite Grammar account. This link will expire in 15 minutes.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLinkUrl}"
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Sign In to Infinite Grammar
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you didn't request this link, you can safely ignore this email.
              </p>

              <p style="font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                Or copy and paste this link into your browser:<br>
                <a href="${magicLinkUrl}" style="color: #667eea; word-break: break-all;">${magicLinkUrl}</a>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Infinite Grammar - Master German Grammar</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Magic link sent to ${email}`);

    return createResponse(200, {
      message: 'If an account exists with this email, a magic link has been sent.',
    });

  } catch (error: any) {
    console.error('Error sending magic link:', error);
    return handleError(error);
  }
};
