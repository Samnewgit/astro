// Security middleware for Astro
import type { APIContext, MiddlewareHandler } from 'astro';

/**
 * Rate limiting configuration for API endpoints
 */
interface RateLimitBucket {
  count: number;
  lastReset: number;
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitBucket>();

const RATE_LIMIT_CONFIG = {
  maxRequests: 20, // Maximum requests per timeWindow
  timeWindow: 60 * 60 * 1000, // 1 hour in milliseconds
  apiPaths: ['/api/'], // Paths to apply rate limiting
};

// Get client IP (with proxy support)
function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return '127.0.0.1'; // Fallback for local development
}

// Check if a request exceeds rate limits
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const bucket = rateLimitStore.get(clientIP) || { count: 0, lastReset: now };
  
  // Reset counter if time window has passed
  if (now - bucket.lastReset > RATE_LIMIT_CONFIG.timeWindow) {
    bucket.count = 0;
    bucket.lastReset = now;
  }
  
  // Check if limit is reached
  if (bucket.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return false;
  }
  
  // Increment counter and update store
  bucket.count++;
  rateLimitStore.set(clientIP, bucket);
  
  return true;
}

// Security headers to add to all responses
const securityHeaders = {
  // Prevent XSS attacks
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;",
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Enable XSS protection in older browsers
  'X-XSS-Protection': '1; mode=block',
  // Control how much information is sent in the Referer header
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Restrict access to browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// API-specific error response
function createAPIErrorResponse(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ 
      error: message 
    }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const clientIP = getClientIP(request);
  
  // Apply rate limiting to API endpoints
  if (RATE_LIMIT_CONFIG.apiPaths.some(path => url.pathname.startsWith(path))) {
    if (!checkRateLimit(clientIP)) {
      return createAPIErrorResponse(
        429, 
        'Rate limit exceeded. Please try again later.'
      );
    }
    
    // Log API request (in production, use proper logging)
    console.log(`API Request: ${url.pathname} from ${clientIP}`);
  }
  
  // Set security headers
  const response = await next();
  const newResponse = new Response(response.body, response);
  
  // Add security headers to all responses
  for (const [key, value] of Object.entries(securityHeaders)) {
    newResponse.headers.set(key, value);
  }
  
  return newResponse;
}; 