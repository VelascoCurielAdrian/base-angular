import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import { ArrowRight, Clock, LucideAngularModule, Search } from 'lucide-angular';

import { SearchService } from '@services/search.service';

import type { SearchResult } from '../../models/search-result.interface';

/**
 * Componente Overlay de Búsqueda usando CDK Portal
 *
 * Principios SOLID aplicados:
 * - SRP: Solo maneja la UI del overlay de búsqueda
 * - OCP: Extensible para agregar nuevas funcionalidades de búsqueda
 * - DIP: Depende del SearchService (abstracción) para la lógica de búsqueda
 *
 * Usa CDK Portal para renderizar el contenido fuera del DOM hierarchy,
 * evitando problemas de z-index y permitiendo mejor control del overlay.
 */
@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [CommonModule, PortalModule, OverlayModule, LucideAngularModule],
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchOverlayComponent implements OnDestroy {
  private readonly _overlay = inject(Overlay);
  private readonly _searchService = inject(SearchService);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  // Iconos
  protected readonly SearchIcon = Search;
  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly ClockIcon = Clock;

  // Portal y Overlay
  protected readonly portalContent = viewChild.required<TemplateRef<unknown>>('portalContent');
  private _overlayRef: OverlayRef | null = null;
  private _portal: TemplatePortal | null = null;

  // Referencias
  protected readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Estado
  public readonly isOpen = signal(false);
  private readonly _searchQuery = signal('');
  private readonly _searchResults = signal<SearchResult[]>([]);
  private readonly _selectedIndex = signal(0);
  private readonly _isSearching = signal(false);
  private readonly _recentSearches = signal<SearchResult[]>([]);

  // Getters para usar en la plantilla (evitar llamar señales directamente)
  protected get searchQuery(): string {
    return this._searchQuery();
  }

  protected get searchResults(): SearchResult[] {
    return this._searchResults();
  }

  protected get selectedIndex(): number {
    return this._selectedIndex();
  }

  protected get isSearching(): boolean {
    return this._isSearching();
  }

  protected get recentSearches(): SearchResult[] {
    return this._recentSearches();
  }

  // Effect para actualizar resultados cuando cambia la query
  constructor() {
    effect(() => {
      const query = this._searchQuery();
      if (query.trim().length >= 2) {
        this._performSearch(query);
      } else {
        this._searchResults.set([]);
        this._selectedIndex.set(0);
      }
    });
  }

  /**
   * Abre el overlay de búsqueda
   */
  public open(): void {
    if (this.isOpen()) {
      return;
    }

    // Crear estrategia de posición
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .top('10vh');

    // Crear el overlay
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: 'search-overlay-backdrop',
      positionStrategy,
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });

    // Crear y adjuntar el portal al overlay
    this._portal = new TemplatePortal(
      this.portalContent(),
      this._viewContainerRef,
    );
    this._overlayRef.attach(this._portal);

    // Cerrar al hacer clic en el backdrop
    this._overlayRef.backdropClick().subscribe(() => {
      this.close();
    });

    // Enfocar el input después de un breve delay
    setTimeout(() => {
      this._focusSearchInput();
    }, 100);

    this.isOpen.set(true);
  }

  /**
   * Cierra el overlay de búsqueda
   */
  public close(): void {
    if (!this.isOpen()) {
      return;
    }

    this._overlayRef?.detach();
    this._overlayRef?.dispose();
    this._overlayRef = null;
    this._portal = null;

    this._searchQuery.set('');
    this._searchResults.set([]);
    this._selectedIndex.set(0);
    this.isOpen.set(false);
  }

  /**
   * Maneja cambios en el input de búsqueda
   */
  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._searchQuery.set(value);
  }

  /**
   * Realiza la búsqueda
   */
  private _performSearch(query: string): void {
    this._isSearching.set(true);
    const results = this._searchService.search(query);
    this._searchResults.set(results);
    this._isSearching.set(false);
    this._selectedIndex.set(0);
  }

  /**
   * Navega a un resultado
   */
  protected navigateToResult(result: SearchResult): void {
    void this._searchService.navigateToResult(result);
    this._addToRecentSearches(result);
    this.close();
  }

  /**
   * Maneja el evento de teclado
   */
  protected onKeyDown(event: KeyboardEvent): void {
    const results = this._searchResults();
    const currentIndex = this._selectedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < results.length - 1) {
          this._selectedIndex.set(currentIndex + 1);
          this._scrollToSelected();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          this._selectedIndex.set(currentIndex - 1);
          this._scrollToSelected();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (results[currentIndex]) {
          this.navigateToResult(results[currentIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  /**
   * Selecciona un resultado con el mouse
   */
  protected selectResult(index: number): void {
    this._selectedIndex.set(index);
  }

  /**
   * Enfoca el input de búsqueda
   */
  private _focusSearchInput(): void {
    const input = this.searchInputRef();
    if (input) {
      input.nativeElement.focus();
    }
  }

  /**
   * Hace scroll al resultado seleccionado
   */
  private _scrollToSelected(): void {
    setTimeout(() => {
      const selected = document.querySelector('.search-result--selected');
      if (selected) {
        selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  /**
   * Agrega un resultado a búsquedas recientes
   */
  private _addToRecentSearches(result: SearchResult): void {
    const recent = this._recentSearches();
    const filtered = recent.filter(r => r.id !== result.id);
    this._recentSearches.set([result, ...filtered].slice(0, 5));
  }

  public ngOnDestroy(): void {
    this.close();
  }
}
