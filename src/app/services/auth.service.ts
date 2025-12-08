import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';

import type { LoginResponse, Module, Permission, VerifyResponse, UserSession, PermissionNode } from '@models/auth.interface';
import type { HttpError } from '@models/error.interface';

import { ApiHttpClient } from './api-http-client.service';
import { ErrorHandlerService } from './error-handler.service';
import { GlobalLoadingService } from './global-loading.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly account: WritableSignal<string | null> = signal<string | null>(null);
  public readonly user: WritableSignal<UserSession | null> = signal<UserSession | null>(null);
  public readonly permissions: WritableSignal<Module[]> = signal<Module[]>([]);
  public readonly isInitialized: WritableSignal<boolean> = signal<boolean>(true);

  public get currentAccount(): string | null {
    return this.account();
  }

  public get currentUser(): UserSession | null {
    return this.user();
  }

  constructor(
    private readonly _api: ApiHttpClient = inject(ApiHttpClient),
    private readonly _router: Router = inject(Router),
    private readonly _errorHandler: ErrorHandlerService = inject(ErrorHandlerService),
    private readonly _globalLoading: GlobalLoadingService = inject(GlobalLoadingService),
  ) {
    // Verificar sesión al inicializar
    void this._initializeAuth();
  }

  /**
   * Inicializa la autenticación verificando la sesión en el backend
   */
  private async _initializeAuth(): Promise<void> {
    this._globalLoading.show();
    try {
      const isValid = await this.verifySession();

      if (!isValid) {
        this.isInitialized.set(true);
      }
    } catch (error) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      console.error('Error al inicializar autenticación:', httpError.message);
      this._clearAuth();
      this.isInitialized.set(true);
    } finally {
      this._globalLoading.hide();
    }
  }

  /**
   * Verifica la sesión actual con el backend
   */
  public async verifySession(): Promise<boolean> {
    try {
      const response = await this._api.get<VerifyResponse>(environment.api.endpoints.verify);

      // La sesión es válida, cargar datos del usuario si están disponibles
      const userData = this.user();

      if (userData && userData.user_id === response.data.session.sub) {
        return true;
      }

      this.account.set(response.data.session.username);
      this.user.set(response.data.session);
      return true;
    } catch (error) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      console.error('Error al verificar sesión:', httpError.message);
      this._clearAuth();
      return false;
    }
  }

  /**
   * Login con credenciales usando API REST
   */
  public async loginWithCredentials(username: string, password: string): Promise<LoginResponse> {
    this._globalLoading.show();
    try {
      const response = await this._api.post<LoginResponse>(
        environment.api.endpoints.login,
        { username, password },
      );

      // Validar respuestas
      const userData = response.data.user;

      // Actualizar señales reactivas
      this.account.set(userData.username);
      this.user.set(userData);
      this.permissions.set(userData.permissions);

      return response;
    } catch (error) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      throw new Error(httpError.message);
    } finally {
      this._globalLoading.hide();
    }
  }

  /**
   * Cerrar sesión
   */
  public async logout(): Promise<void> {
    this._globalLoading.show();
    try {
      await this._api.post(environment.api.endpoints.logout, {});
    } catch (error) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      throw new Error(httpError.message);
    } finally {
      this._clearAuth();
      this._globalLoading.hide();
      void this._router.navigate(['/login']);
    }
  }

  /**
   * Limpia todos los datos de autenticación
   */
  private _clearAuth(): void {
    this.account.set(null);
    this.user.set(null);
    this.permissions.set([]);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  public isAuthenticated(): boolean {
    return !!this.currentAccount && !!this.currentUser;
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param moduleKey Key del módulo (ej: 'users', 'profiles')
   * @param permissionKey Key del permiso (ej: 'create', 'view', 'edit')
   * @param subModuleKey Key opcional del submódulo (ej: 'user-management')
   */
  public hasPermission(moduleKey: string, permissionKey: string, subModuleKey?: string ): boolean {
    const modules = this.permissions();

    if (modules.length === 0) {
      return false;
    }

    const module = modules.find(m => m.key === moduleKey);

    if (!module) {
      return false;
    }

    // Si se especifica submódulo, buscar en children
    if (subModuleKey && module.children) {
      const subModule = module.children.find(sm => sm.key === subModuleKey);
      if (!subModule) {
        return false;
      }
      return subModule.permissions.some(p => p.key === permissionKey);
    }

    // Buscar el permiso en el módulo principal
    return module.permissions.some(p => p.key === permissionKey);
  }

  /**
   * Obtiene todos los permisos de un módulo
   */
  public getModulePermissions(moduleKey: string): Permission[] {
    const modules = this.permissions();
    const module = modules.find(m => m.key === moduleKey);
    return module?.permissions ?? [];
  }

  /**
   * Verifica si el usuario tiene acceso a un módulo
   */
  public hasModuleAccess(moduleKey: string): boolean {
    const modules = this.permissions();
    return modules.some(m => m.key === moduleKey);
  }

  /**
   * Obtiene información completa del usuario
   */
  public getUserInfo(): {
    fullName: string;
    email: string;
    phone: string;
    userName: string;
    avatar: string;
    permissions: PermissionNode[] } | null {
    const userData = this.currentUser;

    if (!userData) {
      return null;
    }

    return {
      fullName: `${userData.first_name} ${userData.last_name}`.trim(),
      email: userData.email,
      userName: userData.username,
      phone: userData.phone_number?.toString() ?? '',
      avatar: userData.avatar_url ?? '/assets/img/default-avatar.png',
      permissions: userData.permissions,
    };
  }
}
