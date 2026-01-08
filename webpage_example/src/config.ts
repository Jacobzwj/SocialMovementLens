// Configures the API base URL based on environment
// In local development (Vite), this is empty string "" to leverage the proxy in vite.config.ts
// In production, this can be set via VITE_API_URL environment variable

// Fix TS error by casting import.meta to any or defining the interface
const env = (import.meta as any).env;
export const API_BASE_URL = env.VITE_API_URL || '';

export const getApiUrl = (endpoint: string) => {
    // Ensure no double slashes if base url ends with /
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
};
