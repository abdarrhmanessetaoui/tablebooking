import { getToken } from './auth';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE = `${baseUrl.replace(/\/$/, '')}/api`;

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

/**
 * Helper to build full API URLs
 */
export const apiPath = (path) => `${API_BASE}/${path.replace(/^\//, '')}`;
