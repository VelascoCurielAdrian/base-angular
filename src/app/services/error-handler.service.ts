import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { AppError, HttpError } from '@models/error.interface';
import { ErrorType } from '@models/error.interface';

/**
 * Servicio centralizado para el manejo de errores
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  /**
   * Convierte un error desconocido a HttpError tipado
   */
  public toHttpError(error: unknown): HttpError {
    if (error instanceof HttpErrorResponse) {
      return {
        status: error.status,
        statusText: this._getStatusText(error.status),
        message: this._extractMessage(error),
        url: error.url ?? undefined,
        error: error.error as HttpError['error'],
      };
    }

    // Error no HTTP (por ejemplo, error de red)
    return {
      status: 0,
      statusText: 'Unknown Error',
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }

  /**
   * Convierte un error desconocido a AppError tipado
   */
  public toAppError(error: unknown): AppError {
    if (error instanceof HttpErrorResponse) {
      return {
        type: this._getErrorType(error.status),
        message: this._extractMessage(error),
        originalError: error,
        details: {
          status: error.status,
          statusText: this._getStatusText(error.status),
          url: error.url,
        },
      };
    }

    // Error genérico
    return {
      type: ErrorType.UNKNOWN,
      message: error instanceof Error ? error.message : 'Error desconocido',
      originalError: error,
    };
  }

  /**
   * Obtiene un mensaje de error amigable basado en el HttpError
   */
  public getUserMessage(httpError: HttpError): string {
    switch (httpError.status) {
      case 0:
        return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      case 400:
        return httpError.error?.message ?? 'La solicitud contiene errores. Verifique los datos ingresados.';
      case 401:
        return 'Credenciales inválidas. Verifique su usuario y contraseña.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 422:
        return httpError.error?.message ?? 'Error de validación. Verifique los datos ingresados.';
      case 500:
        return 'Error interno del servidor. Intente nuevamente más tarde.';
      case 503:
        return 'Servicio no disponible. Intente nuevamente más tarde.';
      default:
        return httpError.error?.message ?? 'Ocurrió un error inesperado.';
    }
  }

  /**
   * Obtiene un mensaje de error amigable basado en el AppError
   */
  public getAppErrorMessage(appError: AppError): string {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return 'Error de conexión. Verifique su conexión a internet.';
      case ErrorType.UNAUTHORIZED:
        return 'No está autorizado. Inicie sesión nuevamente.';
      case ErrorType.FORBIDDEN:
        return 'No tiene permisos para realizar esta acción.';
      case ErrorType.NOT_FOUND:
        return 'El recurso solicitado no fue encontrado.';
      case ErrorType.VALIDATION:
        return appError.message;
      case ErrorType.SERVER:
        return 'Error del servidor. Intente nuevamente más tarde.';
      default:
        return appError.message;
    }
  }

  /**
   * Determina el tipo de error basado en el código de estado HTTP
   */
  private _getErrorType(status: number): ErrorType {
    if (status === 0) {
      return ErrorType.NETWORK;
    }
    if (status === 401) {
      return ErrorType.UNAUTHORIZED;
    }
    if (status === 403) {
      return ErrorType.FORBIDDEN;
    }
    if (status === 404) {
      return ErrorType.NOT_FOUND;
    }
    if (status === 400 || status === 422) {
      return ErrorType.VALIDATION;
    }
    if (status >= 500) {
      return ErrorType.SERVER;
    }
    return ErrorType.UNKNOWN;
  }

  /**
   * Extrae el mensaje de error de una respuesta HTTP
   */
  private _extractMessage(error: HttpErrorResponse): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.error?.message && typeof error.error.message === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return error.error.message as string;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.error?.error && typeof error.error.error === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return error.error.error as string;
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    return error.message || 'Error desconocido';
  }

  /**
   * Obtiene el texto del estado HTTP basado en el código
   */
  private _getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      0: 'Unknown Error',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
      503: 'Service Unavailable',
    };
    return statusTexts[status] ?? 'Unknown Error';
  }
}
