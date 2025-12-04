import { Injectable, signal, computed } from '@angular/core';
import type { Signal } from '@angular/core';

import { NAVIGATION_ITEMS } from './navigation.constants';

import type { NavigationItem } from './navigation-item.interface';

/**
 * Servicio para gestionar la configuración de navegación
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo se encarga de la configuración de navegación
 * - Open/Closed: Abierto a extensión (puedes agregar filtros) pero cerrado a modificación
 * - Liskov Substitution: Puede ser sustituido por implementaciones mock en testing
 * - Interface Segregation: Expone solo los métodos necesarios
 * - Dependency Inversion: Depende de abstracciones (interfaces) no de implementaciones
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationConfigService {
  private readonly _navigationItems = signal<NavigationItem[]>(NAVIGATION_ITEMS);

  /**
   * Obtiene todos los items de navegación
   */
  public readonly navigationItems: Signal<NavigationItem[]> = computed(() =>
    this._navigationItems(),
  );

  /**
   * Filtra items de navegación basados en permisos del usuario
   * @param userPermissions - Array de keys de permisos del usuario
   */
  public getFilteredByPermissions(userPermissions: string[]): NavigationItem[] {
    return this._filterItemsByPermissions(this._navigationItems(), userPermissions);
  }

  /**
   * Obtiene un item de navegación por su ID
   * @param itemId - ID del item a buscar
   */
  public getItemById(itemId: string | number): NavigationItem | undefined {
    return this._findItemById(this._navigationItems(), itemId);
  }

  /**
   * Obtiene un item de navegación por su ruta
   * @param route - Ruta del item a buscar
   */
  public getItemByRoute(route: string): NavigationItem | undefined {
    return this._findItemByRoute(this._navigationItems(), route);
  }

  /**
   * Actualiza la configuración de navegación (útil para testing o configuraciones dinámicas)
   * @param items - Nuevos items de navegación
   */
  public setNavigationItems(items: NavigationItem[]): void {
    this._navigationItems.set(items);
  }

  /**
   * Filtra recursivamente los items según permisos
   */
  private _filterItemsByPermissions(
    items: NavigationItem[],
    userPermissions: string[],
  ): NavigationItem[] {
    return items
      .filter((item) => {
        // Si no tiene permisos definidos, es accesible para todos
        if (!item.permissions || item.permissions.length === 0) {
          return true;
        }
        // Verificar si el usuario tiene al menos uno de los permisos requeridos
        return item.permissions.some((permission) => userPermissions.includes(permission.key));
      })
      .map((item) => ({
        ...item,
        // Filtrar recursivamente los hijos si existen
        children: item.children
          ? this._filterItemsByPermissions(item.children, userPermissions)
          : undefined,
      }))
      .filter((item) => {
        // Eliminar items que tengan hijos pero todos fueron filtrados
        if (item.children !== undefined) {
          return item.children.length > 0;
        }
        return true;
      });
  }

  /**
   * Busca un item por ID recursivamente
   */
  private _findItemById(
    items: NavigationItem[],
    itemId: string | number,
  ): NavigationItem | undefined {
    for (const item of items) {
      if (item.id === itemId) {
        return item;
      }
      if (item.children) {
        const found = this._findItemById(item.children, itemId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   * Busca un item por ruta recursivamente
   */
  private _findItemByRoute(items: NavigationItem[], route: string): NavigationItem | undefined {
    for (const item of items) {
      if (item.route === route) {
        return item;
      }
      if (item.children) {
        const found = this._findItemByRoute(item.children, route);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }
}
