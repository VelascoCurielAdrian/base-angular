import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { LucideAngularModule, Menu, Search, User, Settings, LogOut, ChevronDown, Bell, Sun, Moon } from 'lucide-angular';

import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
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
  imports: [CommonModule, LucideAngularModule, ConfirmationModalComponent],
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppbarComponent implements OnInit {
  // Servicios
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _theme = inject(ThemeService);

  // Iconos
  protected readonly SearchIcon = Search;
  protected readonly MenuIcon = Menu;
  protected readonly UserIcon = User;
  protected readonly SettingsIcon = Settings;
  protected readonly LogOutIcon = LogOut;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly BellIcon = Bell;
  protected readonly SunIcon = Sun;
  protected readonly MoonIcon = Moon;

  // Inputs
  public readonly isSidebarCollapsed = input<boolean>(false);

  // ViewChild para el input de búsqueda
  protected readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Estado
  protected readonly isSearchFocused = signal(false);
  protected readonly isUserMenuOpen = signal(false);
  protected readonly isMobile = signal(false);
  protected readonly isTablet = signal(false);
  protected readonly isSmallScreen = signal(false);
  protected readonly searchValue = signal('');
  protected readonly isSearchActive = signal(false);
  protected readonly showLogoutModal = signal(false);

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

  // Notificaciones
  protected readonly unreadNotifications = this._notificationService.unreadCount;

  // Tema
  protected readonly isDarkTheme = computed(() => this._theme.currentTheme() === 'dark');

  // Computed para el placeholder del buscador
  protected readonly searchPlaceholder = computed(() => {
    if (this.isMobile()){
      return 'Buscar...';
    }
    if (this.isSmallScreen()) {
      return 'Buscar...';
    }
    return 'Buscar opciones o rutas...';
  });

  // Outputs para comunicación con el padre
  public readonly toggleSidebar = output();
  public readonly searchFocus = output();
  public readonly userMenuStateChange = output<boolean>();
  public readonly toggleNotifications = output();

  /**
   * Maneja el clic en el input de búsqueda
   */
  protected onSearchClick(): void {
    this.isSearchFocused.set(true);
    this.isSearchActive.set(true);
    this.searchFocus.emit();
    this.focusSearchInput();
  }

  /**
   * Maneja la entrada de texto en el buscador
   */
  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    this.searchValue.set(value);
    this.isSearchActive.set(value.length > 0);
  }

  /**
   * Maneja las teclas presionadas en el buscador
   */
  protected onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
      event.preventDefault();
    } else if (event.key === 'Enter' && this.searchValue()) {
      this.performSearch();
      event.preventDefault();
    }
  }

  /**
   * Realiza la búsqueda
   */
  protected performSearch(): void {
    if (this.searchValue().length >= 2) {
      console.log('Performing search:', this.searchValue());
      // Aquí se implementaría la lógica de búsqueda real
    }
  }

  /**
   * Limpia la búsqueda
   */
  protected clearSearch(): void {
    this.searchValue.set('');
    this.isSearchActive.set(false);
    this.resetSearch();
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
    this.searchValue.set('');
    this.isSearchActive.set(false);
    const input = this.searchInputRef();
    if (input) {
      input.nativeElement.value = '';
      input.nativeElement.blur();
    }
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  protected toggleTheme(): void {
    this._theme.toggleTheme();
  }

  /**
   * Cambia el tema desde el menú de usuario
   */
  protected changeTheme(): void {
    this.toggleTheme();
    this.closeUserMenu();
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
    console.log('goToProfile called');
    this.closeUserMenu();
    setTimeout(() => {
      console.log('Navigating to profile');
      void this._router.navigate(['/settings/profile']);
    }, 100);
  }

  /**
   * Navega a la configuración
   */
  protected goToSettings(): void {
    console.log('goToSettings called');
    this.closeUserMenu();
    setTimeout(() => {
      console.log('Navigating to settings');
      void this._router.navigate(['/settings']);
    }, 100);
  }

  /**
   * Abre el modal de confirmación de logout
   */
  protected logout(): void {
    this.closeUserMenu();
    this.showLogoutModal.set(true);
  }

  /**
   * Confirma y ejecuta el cierre de sesión
   */
  protected onConfirmLogout(): void {
    this.showLogoutModal.set(false);
    console.log('Executing logout');
    this._auth.logout()
      .then(() => {
        this._toast.success('Sesión cerrada correctamente');
        void this._router.navigate(['/login']);
      })
      .catch((error: unknown) => {
        this._toast.error('Error al cerrar sesión');
        console.error('Error al cerrar sesión:', error);
      });
  }

  /**
   * Cancela el cierre de sesión
   */
  protected onCancelLogout(): void {
    this.showLogoutModal.set(false);
  }

  /**
   * Detecta clics fuera del menú de usuario para cerrarlo
   */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isUserMenuOpen()) {
      return;
    }

    const target = event.target as HTMLElement;
    const userMenu = target.closest('.appbar__user-menu');

    // Si el clic no fue dentro del menú de usuario, cerrarlo
    if (!userMenu) {
      this.closeUserMenu();
    }
  }

  /**
   * Maneja el resize de la ventana para ajustar el comportamiento responsive
   */
  @HostListener('window:resize', [])
  protected onResize(): void {
    this._updateViewportStatus();
  }

  /**
   * Maneja los atajos de teclado globales
   */
  @HostListener('document:keydown', ['$event'])
  protected onGlobalKeydown(event: KeyboardEvent): void {
    // Ctrl+K o Cmd+K para enfocar el buscador
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      this.onSearchClick();
      event.preventDefault();
    }
  }

  /**
   * Inicializa el estado del viewport
   */
  public ngOnInit(): void {
    this._updateViewportStatus();
  }

  /**
   * Actualiza el estado del viewport basado en el tamaño de pantalla
   */
  private _updateViewportStatus(): void {
    const width = window.innerWidth;
    this.isMobile.set(width <= 768);
    this.isTablet.set(width > 768 && width <= 1024);
    this.isSmallScreen.set(width <= 480);

    // Cerrar el menú de usuario si cambiamos de desktop a mobile
    if (this.isMobile() && this.isUserMenuOpen()) {
      this.closeUserMenu();
    }
  }
}
