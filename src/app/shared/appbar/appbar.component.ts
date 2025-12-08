import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { LucideAngularModule, Menu, Search, User, Settings, LogOut, ChevronDown } from 'lucide-angular';

import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';

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
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppbarComponent {
  // Servicios
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);

  // Iconos
  protected readonly SearchIcon = Search;
  protected readonly MenuIcon = Menu;
  protected readonly UserIcon = User;
  protected readonly SettingsIcon = Settings;
  protected readonly LogOutIcon = LogOut;
  protected readonly ChevronDownIcon = ChevronDown;

  // Inputs
  public readonly isSidebarCollapsed = input<boolean>(false);

  // ViewChild para el input de búsqueda
  protected readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Estado
  protected readonly isSearchFocused = signal(false);
  protected readonly isUserMenuOpen = signal(false);

  // Datos del usuario
  protected readonly user = computed(() => this._auth.user());
  protected readonly userName = computed(() => {
    const user = this.user();
    if (!user) {
      return 'Usuario';
    }
    return `${user.first_name} ${user.last_name}`.trim() || user.username;
  });
  protected readonly userInitials = computed(() => {
    const user = this.user();
    if (!user) {return 'U';}
    const firstInitial = user.first_name[0] || '';
    const lastInitial = user.last_name[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || user.username[0].toUpperCase();
  });

  // Outputs para comunicación con el padre
  public readonly toggleSidebar = output();
  public readonly searchFocus = output();
  public readonly userMenuStateChange = output<boolean>();

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

  /**
   * Alterna el menú de usuario
   */
  protected toggleUserMenu(): void {
    this.isUserMenuOpen.update(value => {
      const newValue = !value;
      this.userMenuStateChange.emit(newValue);
      return newValue;
    });
  }

  /**
   * Cierra el menú de usuario
   */
  protected closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
    this.userMenuStateChange.emit(false);
  }

  /**
   * Método público para cerrar el menú desde el padre
   */
  public closeMenu(): void {
    this.closeUserMenu();
  }

  /**
   * Navega al perfil del usuario
   */
  protected goToProfile(): void {
    this.closeUserMenu();
    void this._router.navigate(['/settings/profile']);
  }

  /**
   * Navega a la configuración
   */
  protected goToSettings(): void {
    this.closeUserMenu();
    void this._router.navigate(['/settings']);
  }

  /**
   * Cierra la sesión del usuario
   */
  protected async logout(): Promise<void> {
    this.closeUserMenu();
    try {
      await this._auth.logout();
      this._toast.success('Sesión cerrada correctamente');
      void this._router.navigate(['/login']);
    } catch (error) {
      this._toast.error('Error al cerrar sesión');
      console.error('Error al cerrar sesión:', error);
    }
  }
}
