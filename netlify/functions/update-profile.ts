/**
 * POST /api/update-profile
 *
 * Update user profile (name, email, password)
 *
 * Request body:
 * {
 *   userId: string,
 *   name?: string,
 *   email?: string,
 *   currentPassword?: string,  // required if changing password
 *   newPassword?: string
 * }
 */

import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { sql, createResponse, handleError, corsHeaders } from './_shared/db';
import { sendPasswordChangeNotification, sendEmailChangeNotification } from './_shared/email';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const { userId, name, email, currentPassword, newPassword } = JSON.parse(event.body);

    if (!userId) {
      return createResponse(400, { error: 'User ID is required' });
    }

    // Fetch current user data
    const userResult = await sql`
      SELECT id, email, name, password_hash
      FROM users
      WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return createResponse(404, { error: 'User not found' });
    }

    const currentUser = userResult[0];
    const updates: any = {};

    // Update name if provided
    if (name !== undefined) {
      updates.name = name;
    }

    // Update email if provided
    if (email !== undefined && email !== currentUser.email) {
      // Check if new email is already taken
      const emailCheck = await sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase()} AND id != ${userId}
      `;

      if (emailCheck.length > 0) {
        return createResponse(409, { error: 'Email already in use' });
      }

      updates.email = email.toLowerCase();
    }

    // Update password if provided
    if (newPassword) {
      // Validate current password
      if (!currentPassword) {
        return createResponse(400, { error: 'Current password is required to change password' });
      }

      if (!currentUser.password_hash) {
        return createResponse(400, { error: 'No password set for this account' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password_hash);

      if (!isPasswordValid) {
        return createResponse(401, { error: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword.length < 8) {
        return createResponse(400, { error: 'New password must be at least 8 characters long' });
      }

      // Hash new password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      updates.password_hash = passwordHash;
    }

    // If no updates, return early
    if (Object.keys(updates).length === 0) {
      return createResponse(200, {
        success: true,
        message: 'No changes to update',
        user: {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        },
      });
    }

    // Execute update
    let updateResult;

    if (updates.password_hash && updates.email && updates.name !== undefined) {
      // Update all three
      updateResult = await sql`
        UPDATE users
        SET name = ${updates.name}, email = ${updates.email}, password_hash = ${updates.password_hash}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    } else if (updates.password_hash && updates.email) {
      // Update email and password
      updateResult = await sql`
        UPDATE users
        SET email = ${updates.email}, password_hash = ${updates.password_hash}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    } else if (updates.password_hash && updates.name !== undefined) {
      // Update name and password
      updateResult = await sql`
        UPDATE users
        SET name = ${updates.name}, password_hash = ${updates.password_hash}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    } else if (updates.email && updates.name !== undefined) {
      // Update name and email
      updateResult = await sql`
        UPDATE users
        SET name = ${updates.name}, email = ${updates.email}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    } else if (updates.password_hash) {
      // Update password only
      updateResult = await sql`
        UPDATE users
        SET password_hash = ${updates.password_hash}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    } else if (updates.email) {
      // Update email only
      updateResult = await sql`
        UPDATE users
        SET email = ${updates.email}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    } else if (updates.name !== undefined) {
      // Update name only
      updateResult = await sql`
        UPDATE users
        SET name = ${updates.name}
        WHERE id = ${userId}
        RETURNING id, email, name, created_at, last_login
      `;
    }

    const updatedUser = updateResult[0];

    // Send email notifications (don't fail update if email fails)
    if (updates.email) {
      try {
        await sendEmailChangeNotification(currentUser.email, updates.email, updatedUser.name);
      } catch (emailError) {
        console.error('Failed to send email change notification:', emailError);
        // Continue anyway - don't fail the update
      }
    }

    if (updates.password_hash) {
      try {
        await sendPasswordChangeNotification(updatedUser.email, updatedUser.name);
      } catch (emailError) {
        console.error('Failed to send password change notification:', emailError);
        // Continue anyway - don't fail the update
      }
    }

    return createResponse(200, {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        created_at: updatedUser.created_at,
        last_login: updatedUser.last_login,
      },
    });

  } catch (error) {
    return handleError(error);
  }
};
