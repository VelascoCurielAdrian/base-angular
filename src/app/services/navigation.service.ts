import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PUBLIC_ROUTES, PRIVATE_ROUTES } from '../config/routes.config';

/**
 * Servicio para gestionar la navegación de forma centralizada
 * Proporciona métodos type-safe para navegar entre rutas
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly _router = inject(Router);

  /**
   * Navega a una ruta pública
   */
  public navigateToPublic(route: keyof typeof PUBLIC_ROUTES, queryParams?: Record<string, string>): Promise<boolean> {
    const path = PUBLIC_ROUTES[route];
    return this._router.navigate([path], { queryParams });
  }

  /**
   * Navega a una ruta privada
   */
  public navigateToPrivate(route: keyof typeof PRIVATE_ROUTES, queryParams?: Record<string, string>): Promise<boolean> {
    const path = PRIVATE_ROUTES[route];
    return this._router.navigate([path], { queryParams });
  }

  /**
   * Navega al login
   */
  public goToLogin(): Promise<boolean> {
    return this.navigateToPublic('LOGIN');
  }

  /**
   * Navega al home
   */
  public goToHome(): Promise<boolean> {
    return this.navigateToPrivate('HOME');
  }

  /**
   * Navega a la página "Acerca de"
   */
  public goToAbout(): Promise<boolean> {
    return this.navigateToPrivate('ABOUT');
  }

  /**
   * Navega a configuración
   */
  public goToSettings(): Promise<boolean> {
    return this.navigateToPrivate('SETTINGS');
  }

  /**
   * Navega hacia atrás en el historial
   */
  public goBack(): void {
    window.history.back();
  }

  /**
   * Obtiene la URL actual
   */
  public getCurrentUrl(): string {
    return this._router.url;
  }

  /**
   * Verifica si una ruta está activa
   */
  public isRouteActive(route: string): boolean {
    return this._router.isActive(route, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
