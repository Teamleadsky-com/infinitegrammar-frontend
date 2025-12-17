/**
 * Google Analytics utilities
 * Using GA4 Measurement Protocol API
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-569909YP8G';
const API_SECRET = import.meta.env.VITE_GA_API_SECRET;

/**
 * Send a sign_up event to Google Analytics
 */
export async function trackSignUp(userId: string, method: 'email' | 'magic_link' = 'email'): Promise<void> {
  // Skip if API secret is not configured
  if (!API_SECRET) {
    console.warn('GA_API_SECRET not configured, skipping analytics event');
    return;
  }

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: userId,
        events: [{
          name: 'sign_up',
          params: {
            method: method === 'magic_link' ? 'Magic Link' : 'Email',
          }
        }]
      })
    });

    console.log('✅ GA sign_up event sent:', { userId, method });
  } catch (error) {
    // Don't throw errors for analytics failures
    console.error('Failed to send GA sign_up event:', error);
  }
}

/**
 * Send a login event to Google Analytics
 */
export async function trackLogin(userId: string, method: 'email' | 'magic_link' = 'email'): Promise<void> {
  // Skip if API secret is not configured
  if (!API_SECRET) {
    console.warn('GA_API_SECRET not configured, skipping analytics event');
    return;
  }

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: userId,
        events: [{
          name: 'login',
          params: {
            method: method === 'magic_link' ? 'Magic Link' : 'Email',
          }
        }]
      })
    });

    console.log('✅ GA login event sent:', { userId, method });
  } catch (error) {
    // Don't throw errors for analytics failures
    console.error('Failed to send GA login event:', error);
  }
}
