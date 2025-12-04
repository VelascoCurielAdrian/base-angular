import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationConfigService } from '../config/navigation';

import type { NavigationItem } from '../config/navigation/navigation-item.interface';
import type { SearchResult } from '../models/search-result.interface';

/**
 * Servicio responsable de la búsqueda de opciones de navegación
 *
 * Principios SOLID aplicados:
 * - SRP (Single Responsibility): Solo se encarga de buscar y filtrar items
 * - OCP (Open/Closed): Extensible para agregar nuevos criterios de búsqueda
 * - DIP (Dependency Inversion): Depende de abstracciones (NavigationConfigService)
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _navigationConfigService = inject(NavigationConfigService);
  private readonly _router = inject(Router);

  /**
   * Busca items de navegación según el término de búsqueda
   * @param query - Término de búsqueda
   * @returns Array de resultados ordenados por relevancia
   */
  public search(query: string): SearchResult[] {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const normalizedQuery = this._normalizeString(query);
    const allItems = this._flattenNavigationItems(this._navigationConfigService.navigationItems());

    return allItems
      .filter(item => this._matchesQuery(item, normalizedQuery))
      .map(item => this._mapToSearchResult(item))
      .sort((a, b) => this._calculateRelevance(b, normalizedQuery) - this._calculateRelevance(a, normalizedQuery))
      .slice(0, 10); // Limitar a 10 resultados
  }

  /**
   * Navega a una ruta desde un resultado de búsqueda
   */
  public navigateToResult(result: SearchResult): Promise<boolean> {
    if (!result.route) {
      return Promise.resolve(false);
    }
    return this._router.navigate([result.route]);
  }

  /**
   * Aplana la estructura jerárquica de items de navegación
   */
  private _flattenNavigationItems(
    items: NavigationItem[],
    parentBreadcrumb = '',
  ): { item: NavigationItem; breadcrumb: string }[] {
    const flattened: { item: NavigationItem; breadcrumb: string }[] = [];

    for (const item of items) {
      const currentBreadcrumb = parentBreadcrumb
        ? `${parentBreadcrumb} > ${item.label}`
        : item.label;

      // Solo agregar items con ruta definida
      if (item.route) {
        flattened.push({ item, breadcrumb: currentBreadcrumb });
      }

      // Procesar hijos recursivamente
      if (item.children && item.children.length > 0) {
        flattened.push(
          ...this._flattenNavigationItems(item.children, currentBreadcrumb),
        );
      }
    }

    return flattened;
  }

  /**
   * Verifica si un item coincide con la búsqueda
   */
  private _matchesQuery(
    itemData: { item: NavigationItem; breadcrumb: string },
    normalizedQuery: string,
  ): boolean {
    const { item, breadcrumb } = itemData;
    const searchableText = [
      item.label,
      item.name,
      item.key,
      breadcrumb,
      item.route,
    ]
      .filter((text): text is string => Boolean(text))
      .map(text => this._normalizeString(text))
      .join(' ');

    return searchableText.includes(normalizedQuery);
  }

  /**
   * Convierte un NavigationItem a SearchResult
   */
  private _mapToSearchResult(itemData: { item: NavigationItem; breadcrumb: string }): SearchResult {
    const { item, breadcrumb } = itemData;
    return {
      id: item.id,
      label: item.label,
      route: item.route,
      icon: item.icon as never,
      breadcrumb,
      description: item.name,
    };
  }

  /**
   * Calcula la relevancia de un resultado (mayor = más relevante)
   */
  private _calculateRelevance(result: SearchResult, normalizedQuery: string): number {
    const normalizedLabel = this._normalizeString(result.label);
    let score = 0;

    // Coincidencia exacta en el label (mayor puntuación)
    if (normalizedLabel === normalizedQuery) {
      score += 100;
    }

    // Comienza con el término de búsqueda
    if (normalizedLabel.startsWith(normalizedQuery)) {
      score += 50;
    }

    // Contiene el término de búsqueda
    if (normalizedLabel.includes(normalizedQuery)) {
      score += 25;
    }

    // Coincidencia en el breadcrumb
    if (this._normalizeString(result.breadcrumb).includes(normalizedQuery)) {
      score += 10;
    }

    return score;
  }

  /**
   * Normaliza un string para búsqueda (lowercase, sin acentos)
   */
  private _normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
