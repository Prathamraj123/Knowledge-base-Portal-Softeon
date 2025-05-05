// API configuration for different environments

// Function to determine the base API URL
export function getApiBaseUrl(): string {
  // For Netlify deployment
  if (window.location.hostname.includes('.netlify.app') || 
      window.location.hostname.includes('.netlify.com')) {
    return '/.netlify/functions';
  }
  
  // For local development with combined Express + Vite setup
  return '/api';
}

// Function to construct full API URL
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  
  // If using Netlify functions, we need to adjust the path
  if (baseUrl.includes('.netlify/functions')) {
    // Strip "/api" prefix for Netlify function calls
    const cleanEndpoint = endpoint.startsWith('/api/') 
      ? endpoint.substring(4) 
      : endpoint;
      
    return `${baseUrl}/server${cleanEndpoint}`;
  }
  
  // Otherwise return the normal URL
  return endpoint;
}