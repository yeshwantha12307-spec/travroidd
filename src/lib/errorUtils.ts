import { toast } from 'sonner';

/**
 * Checks whether a candidate string is valid, non-empty, and free of object coercion strings.
 */
function isValidErrorMessage(str: unknown): str is string {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length === 0) return false;
  if (trimmed === '[object Object]' || trimmed.includes('[object Object]')) return false;
  if (trimmed === 'null' || trimmed === 'undefined') return false;
  return true;
}

/**
 * Safe error message extraction utility.
 * Guarantees that notifications and UI error displays NEVER render raw objects or '[object Object]'.
 */
export function extractErrorMessage(
  err: unknown,
  fallback = 'An unexpected error occurred. Please try again.'
): string {
  if (!err) return fallback;

  // Direct string errors
  if (isValidErrorMessage(err)) {
    return err.trim();
  }

  // Standard Error instances
  if (err instanceof Error) {
    if (isValidErrorMessage(err.message)) {
      return err.message.trim();
    }
  }

  // Object payloads ({ message, error, details, hint, error_description, msg, title })
  if (typeof err === 'object') {
    const record = err as Record<string, any>;

    // 1. Direct message property
    if (isValidErrorMessage(record.message)) {
      return record.message.trim();
    }

    // 2. Direct error property
    if (isValidErrorMessage(record.error)) {
      return record.error.trim();
    }

    // 3. Nested error object e.g. { error: { message: '...' } }
    if (record.error && typeof record.error === 'object') {
      const nestedMsg = extractErrorMessage(record.error, '');
      if (isValidErrorMessage(nestedMsg)) {
        return nestedMsg;
      }
    }

    // 4. Supabase / PostgREST details & hint properties
    if (isValidErrorMessage(record.details)) {
      return record.details.trim();
    }

    if (isValidErrorMessage(record.hint)) {
      return record.hint.trim();
    }

    // 5. OAuth / Auth standard properties
    if (isValidErrorMessage(record.error_description)) {
      return record.error_description.trim();
    }

    // 6. Common alternate field names
    if (isValidErrorMessage(record.msg)) {
      return record.msg.trim();
    }

    if (isValidErrorMessage(record.title)) {
      return record.title.trim();
    }

    if (isValidErrorMessage(record.statusText)) {
      return record.statusText.trim();
    }

    // 7. Check for nested data property e.g. axios/fetch error response
    if (record.data && typeof record.data === 'object') {
      const dataMsg = extractErrorMessage(record.data, '');
      if (isValidErrorMessage(dataMsg)) {
        return dataMsg;
      }
    }
  }

  return fallback;
}

/**
 * Extract human-readable error from parsed JSON API response
 */
export function extractApiError(
  data: any,
  fallback = 'Request failed. Please try again.'
): string {
  if (!data) return fallback;
  return extractErrorMessage(data, fallback);
}

/**
 * Safe toast wrapper that guarantees Sonner is never passed an object or '[object Object]'.
 */
export function safeToastError(
  err: unknown,
  fallback = 'An unexpected error occurred. Please try again.'
): void {
  const message = extractErrorMessage(err, fallback);
  toast.error(message);
}

/**
 * Diagnostic logger for development environments.
 * Logs structured diagnostic information while sanitizing sensitive credentials,
 * access tokens, database secrets, and private customer identifiers.
 */
export function logDiagnostic(action: string, error: unknown): void {
  // Only log diagnostic details in development
  const isDev = Boolean(import.meta.env?.DEV);

  if (!isDev) return;

  try {
    let sanitized: Record<string, any> = {};
    if (error instanceof Error) {
      sanitized = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      };
    } else if (typeof error === 'object' && error !== null) {
      const record = error as Record<string, any>;
      sanitized = {
        message: record.message,
        code: record.code,
        details: record.details,
        hint: record.hint,
        status: record.status,
      };
      // Strip sensitive fields
      delete sanitized.password;
      delete sanitized.token;
      delete sanitized.access_token;
      delete sanitized.refresh_token;
      delete sanitized.key;
      delete sanitized.secret;
    } else {
      sanitized = { raw: String(error) };
    }

    console.warn(`[Travoidd Diagnostic: ${action}]`, sanitized);
  } catch {
    // Fail silently in logger
  }
}
