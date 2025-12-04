import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { LucideAngularModule, Menu, Search } from 'lucide-angular';

/**
 * Componente AppBar principal de la aplicación
 *
 * Principios SOLID aplicados:
 * - SRP: Solo se encarga de la presentación del AppBar y delega la búsqueda
 * - OCP: Extensible mediante outputs para eventos
 * - LSP: Puede ser reemplazado por variantes sin afectar el comportamiento
 * - ISP: Expone solo las interfaces necesarias (eventos y métodos públicos)
 * - DIP: Depende de abstracciones mediante inyección de dependencias
 */
@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppbarComponent {
  // Iconos
  protected readonly SearchIcon = Search;
  protected readonly MenuIcon = Menu;

  // Inputs
  public readonly isSidebarCollapsed = input<boolean>(false);

  // ViewChild para el input de búsqueda
  protected readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Estado
  protected readonly isSearchFocused = signal(false);

  // Outputs para comunicación con el padre
  public readonly toggleSidebar = output();
  public readonly searchFocus = output();

  /**
   * Maneja el clic en el input de búsqueda
   */
  protected onSearchClick(): void {
    this.isSearchFocused.set(true);
    this.searchFocus.emit();
  }

  /**
   * Maneja el clic en el botón de menú
   */
  protected onMenuClick(): void {
    this.toggleSidebar.emit();
  }

  /**
   * Enfoca programáticamente el input de búsqueda
   */
  public focusSearchInput(): void {
    const input = this.searchInputRef();
    if (input) {
      input.nativeElement.focus();
    }
  }

  /**
   * Resetea el estado del input de búsqueda
   */
  public resetSearch(): void {
    this.isSearchFocused.set(false);
    const input = this.searchInputRef();
    if (input) {
      input.nativeElement.value = '';
      input.nativeElement.blur();
    }
  }
}
