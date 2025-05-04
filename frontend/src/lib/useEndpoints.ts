// src/lib/useEndpoints.ts

export const LOGIN_PATH = process.env.NEXT_PUBLIC_LOGIN_PATH || '/api/auth/signin';
export const LOGOUT_PATH = process.env.NEXT_PUBLIC_LOGOUT_PATH || '/api/auth/signout';
export const CALLBACK_PATH = process.env.NEXT_PUBLIC_CALLBACK_PATH || '/api/auth/callback';
export const PROFILE_PATH = process.env.NEXT_PUBLIC_PROFILE_PATH || '/api/auth/me';
export const DASHBOARD_PATH = '/dashboard';
export const ONBOARDING_PATH = '/onboarding';
export const PROFILE_PAGE_PATH = '/profile';
