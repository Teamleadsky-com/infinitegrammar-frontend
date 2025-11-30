/**
 * Shared Database Connection Utility for Netlify Functions
 */

import { neon } from '@neondatabase/serverless';

// Get database URL from environment
const getDatabaseUrl = () => {
  // Netlify automatically provides DATABASE_URL if Neon integration is enabled
  const dbUrl = process.env.DATABASE_URL ||
                process.env.NETLIFY_DATABASE_URL ||
                process.env.NETLIFY_DATABASE_URL_UNPOOLED;

  if (!dbUrl) {
    throw new Error('Database URL not found in environment variables');
  }

  return dbUrl;
};

// Create database connection
export const sql = neon(getDatabaseUrl());

// Helper to handle CORS
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Helper to create API response
export const createResponse = (statusCode: number, body: any) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    body: JSON.stringify(body),
  };
};

// Helper to handle errors
export const handleError = (error: any) => {
  console.error('API Error:', error);
  return createResponse(500, {
    error: 'Internal server error',
    message: error.message || 'An unexpected error occurred',
  });
};
