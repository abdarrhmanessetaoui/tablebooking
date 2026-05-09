import { getToken } from './auth';

export const API_BASE = 'http://localhost:8000/api';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

/**
 * Helper to build full API URLs
 */
export const apiPath = (path) => `${API_BASE}/${path.replace(/^\//, '')}`;
