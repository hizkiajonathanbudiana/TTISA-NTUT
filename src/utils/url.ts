/**
 * Get the application base URL based on environment
 * Falls back to window.location.origin if not set in environment variables
 */
export const getAppUrl = (): string => {
  // Try to get from environment variable first
  const envUrl = import.meta.env.VITE_APP_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback to window.location.origin if available (client-side)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Final fallback for server-side or when window is not available
  return 'https://ttisa-ntut.vercel.app';
};

/**
 * Get full URL by combining app URL with path
 */
export const getFullUrl = (path: string = ''): string => {
  const baseUrl = getAppUrl();
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};