/**
 * Email sending utilities using SMTP (Microsoft 365)
 *
 * To use this instead of Resend:
 * 1. Rename this file to email.ts (backup the current email.ts first)
 * 2. Set these environment variables in Netlify:
 *    - SMTP_HOST=smtp.office365.com
 *    - SMTP_PORT=587
 *    - SMTP_USER=info@infinitegrammar.de
 *    - SMTP_PASS=[your Microsoft 365 password or app password]
 *    - FROM_EMAIL=Infinite Grammar <info@infinitegrammar.de>
 */

import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'Infinite Grammar <info@infinitegrammar.de>';

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, name: string | null): Promise<void> {
  const displayName = name || 'there';

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Infinite Grammar! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Infinite Grammar!</h1>
            </div>

            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${displayName},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Thanks for signing up! You're now ready to start learning German with endless interactive grammar exercises.
              </p>

              <p style="font-size: 16px; margin-bottom: 30px;">
                Practice at your own pace across all CEFR levels (A1-C1) and track your progress as you master German grammar.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.SITE_URL || 'https://infinitegrammar.com'}/exercise"
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Start Learning Now
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                Need help? Reply to this email or visit our support page.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Infinite Grammar - Master German Grammar</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    throw error;
  }
}

/**
 * Send password change notification
 */
export async function sendPasswordChangeNotification(email: string, name: string | null): Promise<void> {
  const displayName = name || 'there';
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: '🔒 Your password has been changed',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #667eea;">
              <h2 style="color: #333; margin-top: 0;">Password Changed</h2>

              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${displayName},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                This is a confirmation that your password was successfully changed on <strong>${timestamp}</strong>.
              </p>

              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">
                  <strong>⚠️ Didn't make this change?</strong><br>
                  If you didn't change your password, please contact our support team immediately.
                </p>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                This is an automated security notification. For your protection, we send this email whenever your password is changed.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Infinite Grammar - Master German Grammar</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Password change notification sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send password change notification to ${email}:`, error);
    throw error;
  }
}

/**
 * Send email change notification to both old and new email addresses
 */
export async function sendEmailChangeNotification(
  oldEmail: string,
  newEmail: string,
  name: string | null
): Promise<void> {
  const displayName = name || 'there';
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  try {
    // Send notification to OLD email address
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: oldEmail,
      subject: '📧 Your email address has been changed',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #667eea;">
              <h2 style="color: #333; margin-top: 0;">Email Address Changed</h2>

              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${displayName},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Your Infinite Grammar account email was changed on <strong>${timestamp}</strong>:
              </p>

              <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Previous email:</strong> ${oldEmail}</p>
                <p style="margin: 5px 0;"><strong>New email:</strong> ${newEmail}</p>
              </div>

              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">
                  <strong>⚠️ Didn't make this change?</strong><br>
                  If you didn't change your email address, please contact our support team immediately.
                </p>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                This is an automated security notification sent to your previous email address.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Infinite Grammar - Master German Grammar</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email change notification sent to old email: ${oldEmail}`);

    // Send confirmation to NEW email address
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: newEmail,
      subject: '✅ Your email address has been updated',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #28a745;">
              <h2 style="color: #28a745; margin-top: 0;">✓ Email Updated Successfully</h2>

              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${displayName},</p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Your Infinite Grammar account email has been successfully updated to <strong>${newEmail}</strong>.
              </p>

              <p style="font-size: 16px; margin-bottom: 20px;">
                All future notifications will be sent to this email address.
              </p>

              <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #0c5460;">
                  <strong>ℹ️ Good to know:</strong><br>
                  You can still log in with your password. Only the email address has changed.
                </p>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                This is a confirmation sent to your new email address.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Infinite Grammar - Master German Grammar</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Email change confirmation sent to new email: ${newEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email change notifications:`, error);
    throw error;
  }
}
