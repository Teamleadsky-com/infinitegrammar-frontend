/**
 * Authentication API utilities
 */

import { trackSignUp, trackLogin } from './analytics';

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8888/api'
  : '/api';

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at?: string;
  last_login?: string;
  stats?: {
    total_exercises_completed: number;
    total_correct_answers: number;
    total_answers: number;
    accuracy: number;
    current_streak: number;
    last_streak_date: string | null;
  };
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth-register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const result = await response.json();

  // Store user in localStorage
  localStorage.setItem('user', JSON.stringify(result.user));
  localStorage.setItem('isLoggedIn', 'true');

  // Track sign_up event in Google Analytics
  trackSignUp(result.user.id, 'email');

  return result;
}

/**
 * Login existing user
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const result = await response.json();

  // Store user in localStorage
  localStorage.setItem('user', JSON.stringify(result.user));
  localStorage.setItem('isLoggedIn', 'true');

  return result;
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  // Also remove legacy keys
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is logged in
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem('isLoggedIn') === 'true' && getCurrentUser() !== null;
}

/**
 * Update user data in localStorage
 */
export function updateUserData(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}
