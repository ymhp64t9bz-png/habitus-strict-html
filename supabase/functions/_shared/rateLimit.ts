/**
 * Simple in-memory rate limiter for edge functions
 * Tracks requests per user per minute
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, maxRequests: number = 10): boolean {
  const now = Date.now();
  const key = userId;
  const record = requestCounts.get(key);
  
  // Clean up old entries periodically
  if (requestCounts.size > 1000) {
    for (const [k, v] of requestCounts.entries()) {
      if (v.resetTime < now) {
        requestCounts.delete(k);
      }
    }
  }
  
  if (!record || record.resetTime < now) {
    // New window
    requestCounts.set(key, {
      count: 1,
      resetTime: now + 60000, // 1 minute
    });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export function sanitizeErrorMessage(error: any): string {
  // Only log full error details server-side
  console.error('Full error:', error);
  
  // Return generic message to client
  return 'Ocorreu um erro ao processar sua solicitação';
}
