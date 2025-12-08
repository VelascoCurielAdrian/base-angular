/**
 * Representa un error HTTP estandarizado
 */
export interface HttpError {
  status: number;
  statusText: string;
  message: string;
  url?: string;
  error?: ApiErrorResponse;
}

/**
 * Estructura de la respuesta de error de la API
 */
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  code?: string;
}

/**
 * Tipos de errores específicos de la aplicación
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error de aplicación estandarizado
 */
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  details?: Record<string, unknown>;
}
