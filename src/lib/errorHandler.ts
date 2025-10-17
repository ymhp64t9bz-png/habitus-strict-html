/**
 * Sanitizes authentication and API errors to prevent information disclosure
 * Maps known error patterns to user-friendly messages
 */
export function sanitizeAuthError(error: any): string {
  if (!error?.message) {
    return 'Ocorreu um erro. Por favor, tente novamente.';
  }

  const knownErrors: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Por favor, confirme seu email',
    'User already registered': 'Este email já está cadastrado',
    'already registered': 'Este email já está cadastrado',
    'Invalid email': 'Email inválido',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'User not found': 'Usuário não encontrado',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',
  };

  // Check for known error patterns
  for (const [pattern, message] of Object.entries(knownErrors)) {
    if (error.message.includes(pattern)) {
      return message;
    }
  }

  // Log detailed error in development mode only
  if (import.meta.env.DEV) {
    console.error('[Auth Error]:', error);
  }

  // Return generic message for unknown errors
  return 'Ocorreu um erro. Por favor, tente novamente.';
}

/**
 * Sanitizes general API errors to prevent internal details exposure
 */
export function sanitizeApiError(error: any, context?: string): string {
  // Log to console only in development
  if (import.meta.env.DEV) {
    console.error(`[API Error${context ? ` - ${context}` : ''}]:`, error);
  }

  // Never expose internal error details in production
  return 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.';
}
