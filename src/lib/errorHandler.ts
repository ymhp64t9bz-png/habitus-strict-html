/**
 * Sanitizes authentication and API errors to prevent information leakage
 * Maps known error patterns to user-friendly messages
 */
export function sanitizeAuthError(error: any): string {
  const errorMessage = error?.message || String(error);
  
  const knownErrors: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Por favor, confirme seu email',
    'User already registered': 'Este email já está cadastrado',
    'already registered': 'Este email já está cadastrado',
    'Invalid email': 'Email inválido',
    'Password should be at least': 'A senha deve ter pelo menos 6 caracteres',
    'User not found': 'Usuário não encontrado',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',
  };
  
  // Check for known error patterns
  for (const [pattern, message] of Object.entries(knownErrors)) {
    if (errorMessage.includes(pattern)) {
      return message;
    }
  }
  
  // Default generic message for unknown errors
  return 'Ocorreu um erro. Por favor, tente novamente.';
}

/**
 * Logs errors appropriately based on environment
 * Only logs to console in development mode
 */
export function logError(context: string, error: any): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  // In production, this could send to a monitoring service
  // like Sentry, LogRocket, etc.
}
