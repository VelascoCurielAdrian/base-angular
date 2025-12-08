import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { firstValueFrom, type Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { HttpError } from '@models/error.interface';

import { ErrorHandlerService } from './error-handler.service';

/**
 * Opciones para las peticiones HTTP
 */
export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  context?: HttpContext;
  reportProgress?: boolean;
  withCredentials?: boolean;
  useBaseUrl?: boolean; // Si es true, usa environment.api.baseUrl
}

/**
 * Cliente HTTP personalizado similar a Axios
 * Proporciona una interfaz simplificada con manejo de errores integrado
 * y configuración global de credenciales
 */
@Injectable({ providedIn: 'root' })
export class ApiHttpClient {
  private readonly _http = inject(HttpClient);
  private readonly _errorHandler = inject(ErrorHandlerService);

  /**
   * Construye la URL completa
   */
  private _buildUrl(endpoint: string, useBaseUrl = true): string {
    if (!useBaseUrl || endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    return `${environment.api.baseUrl}${endpoint}`;
  }

  /**
   * Prepara las opciones HTTP removiendo propiedades personalizadas
   */
  private _prepareOptions(options?: ApiRequestOptions): Omit<ApiRequestOptions, 'useBaseUrl'> {
    if (!options) {
      return { withCredentials: true };
    }
    const { useBaseUrl, ...httpOptions } = options;
    void useBaseUrl; // Marca como usada intencionalmente
    return {
      ...httpOptions,
      withCredentials: options.withCredentials ?? true,
    };
  }

  /**
   * Maneja errores de forma centralizada
   */
  private _handleError(error: unknown): never {
    const httpError: HttpError = this._errorHandler.toHttpError(error);
    console.error('HTTP Error:', httpError);
    throw new Error(httpError.message);
  }

  /**
   * GET request
   */
  public async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this._buildUrl(endpoint, options?.useBaseUrl);
      const httpOptions = this._prepareOptions(options);
      const response = await firstValueFrom(this._http.get<T>(url, httpOptions));
      return response;
    } catch (error: unknown) {
      return this._handleError(error);
    }
  }

  /**
   * GET request que retorna Observable (útil para streams de datos)
   */
  public get$<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this._buildUrl(endpoint, options?.useBaseUrl);
    const httpOptions = this._prepareOptions(options);
    return this._http.get<T>(url, httpOptions).pipe(
      catchError((error: unknown) => {
        return this._handleError(error);
      }),
    );
  }

  /**
   * POST request
   */
  public async post<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this._buildUrl(endpoint, options?.useBaseUrl);
      const httpOptions = this._prepareOptions(options);
      const response = await firstValueFrom(this._http.post<T>(url, body, httpOptions));
      return response;
    } catch (error: unknown) {
      return this._handleError(error);
    }
  }

  /**
   * POST request que retorna Observable
   */
  public post$<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this._buildUrl(endpoint, options?.useBaseUrl);
    const httpOptions = this._prepareOptions(options);
    return this._http.post<T>(url, body, httpOptions).pipe(
      catchError((error: unknown) => {
        return this._handleError(error);
      }),
    );
  }

  /**
   * PUT request
   */
  public async put<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this._buildUrl(endpoint, options?.useBaseUrl);
      const httpOptions = this._prepareOptions(options);
      const response = await firstValueFrom(this._http.put<T>(url, body, httpOptions));
      return response;
    } catch (error: unknown) {
      return this._handleError(error);
    }
  }

  /**
   * PUT request que retorna Observable
   */
  public put$<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this._buildUrl(endpoint, options?.useBaseUrl);
    const httpOptions = this._prepareOptions(options);
    return this._http.put<T>(url, body, httpOptions).pipe(
      catchError((error: unknown) => {
        return this._handleError(error);
      }),
    );
  }

  /**
   * PATCH request
   */
  public async patch<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this._buildUrl(endpoint, options?.useBaseUrl);
      const httpOptions = this._prepareOptions(options);
      const response = await firstValueFrom(this._http.patch<T>(url, body, httpOptions));
      return response;
    } catch (error: unknown) {
      return this._handleError(error);
    }
  }

  /**
   * PATCH request que retorna Observable
   */
  public patch$<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this._buildUrl(endpoint, options?.useBaseUrl);
    const httpOptions = this._prepareOptions(options);
    return this._http.patch<T>(url, body, httpOptions).pipe(
      catchError((error: unknown) => {
        return this._handleError(error);
      }),
    );
  }

  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    try {
      const url = this._buildUrl(endpoint, options?.useBaseUrl);
      const httpOptions = this._prepareOptions(options);
      const response = await firstValueFrom(this._http.delete<T>(url, httpOptions));
      return response;
    } catch (error: unknown) {
      return this._handleError(error);
    }
  }

  /**
   * DELETE request que retorna Observable
   */
  public delete$<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this._buildUrl(endpoint, options?.useBaseUrl);
    const httpOptions = this._prepareOptions(options);
    return this._http.delete<T>(url, httpOptions).pipe(
      catchError((error: unknown) => {
        return this._handleError(error);
      }),
    );
  }

  /**
   * Request genérico para casos especiales
   */
  public async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options?: ApiRequestOptions & { body?: unknown },
  ): Promise<T> {
    try {
      const url = this._buildUrl(endpoint, options?.useBaseUrl);
      const httpOptions = this._prepareOptions(options);
      const response = await firstValueFrom(this._http.request<T>(method, url, httpOptions));
      return response;
    } catch (error: unknown) {
      return this._handleError(error);
    }
  }
}
