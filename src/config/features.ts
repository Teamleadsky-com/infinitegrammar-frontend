/**
 * Feature Flags Configuration
 *
 * Centralized feature toggles for the application
 */

/**
 * EXERCISES_MAINTENANCE_MODE
 *
 * When enabled (true):
 * - Hides all exercises from visitors
 * - Shows a "coming soon" waitlist modal instead
 * - Allows users to sign up to be notified when exercises are ready
 * - No pricing is mentioned in the modal
 *
 * When disabled (false):
 * - Normal exercise flow - users can access and practice exercises
 *
 * Use this flag when improving exercise quality and you don't want
 * visitors to see work-in-progress exercises.
 */
export const EXERCISES_MAINTENANCE_MODE = true;
