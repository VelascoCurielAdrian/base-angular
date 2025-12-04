import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { NAVIGATION_ITEMS } from '../config/navigation/navigation.constants';

import type { NavigationItem } from '../config/navigation/navigation-item.interface';
import type { Breadcrumb } from '../models/breadcrumb.interface';

/**
 * Servicio para gestionar breadcrumbs dinámicos basados en la navegación
 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  /**
   * Signal que contiene los breadcrumbs actuales
   */
  public readonly breadcrumbs = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._buildBreadcrumbs()),
    ),
    {
      initialValue: this._buildBreadcrumbs(),
    },
  );

  /**
   * Construye los breadcrumbs basándose en la ruta actual
   */
  private _buildBreadcrumbs(): Breadcrumb[] {
    const url = this._router.url.split('?')[0]; // Eliminar query params
    const urlSegments = url.split('/').filter((segment) => segment);

    // Siempre agregar "Inicio" como primer breadcrumb
    const breadcrumbs: Breadcrumb[] = [
      {
        label: 'Inicio',
        url: '/',
      },
    ];

    // Si estamos en la página de inicio, marcarla como activa
    if (urlSegments.length === 0) {
      breadcrumbs[0].isActive = true;
      return breadcrumbs;
    }

    // Construir breadcrumbs basándose en los segmentos de la URL
    let currentPath = '';

    for (let i = 0; i < urlSegments.length; i++) {
      currentPath += `/${urlSegments[i]}`;
      const isLast = i === urlSegments.length - 1;

      // Buscar el item de navegación correspondiente
      const navItem = this._findNavigationItem(currentPath);

      if (navItem) {
        breadcrumbs.push({
          label: navItem.label,
          url: isLast ? undefined : currentPath,
          isActive: isLast,
        });
      } else {
        // Si no se encuentra en la configuración, usar el segmento de la URL
        breadcrumbs.push({
          label: this._formatSegment(urlSegments[i]),
          url: isLast ? undefined : currentPath,
          isActive: isLast,
        });
      }
    }

    return breadcrumbs;
  }

  /**
   * Busca un item de navegación por su ruta
   */
  private _findNavigationItem(route: string): NavigationItem | null {
    for (const item of NAVIGATION_ITEMS) {
      // Verificar el item principal
      if (item.route === route) {
        return item;
      }

      // Verificar los hijos si existen
      if (item.children) {
        for (const child of item.children) {
          if (child.route === route) {
            return child;
          }
        }
      }
    }

    return null;
  }

  /**
   * Formatea un segmento de URL para mostrarlo como label
   * Ejemplo: "cia-propuestas" -> "Cia Propuestas"
   */
  private _formatSegment(segment: string): string {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
