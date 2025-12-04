import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppbarComponent } from '@shared/appbar/appbar.component';
import { SearchOverlayComponent } from '@shared/search-overlay/search-overlay.component';
import { SidebarComponent } from '@shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from '@shared/breadcrumb/breadcrumb.component';

import { AuthService } from '@services/auth.service';

import { NavigationConfigService } from '../../config/navigation';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AppbarComponent, SearchOverlayComponent, BreadcrumbComponent],
  template: `
    <div class="layout">
      <!-- Overlay para móviles cuando el sidebar está abierto -->
      @if (!isSidebarCollapsed() && isMobileView()) {
        <div class="layout__overlay" (click)="onToggleSidebar()"></div>
      }

      <app-sidebar
        [navigationItems]="navigationItems()"
        [userName]="currentUser()"
        [isCollapsed]="isSidebarCollapsed()"
        (toggleCollapse)="onToggleSidebar()"
        (logout)="onLogout()"
      />
      <div class="layout__main" [class.layout__main--sidebar-collapsed]="isSidebarCollapsed()">
        <app-appbar
          [isSidebarCollapsed]="isSidebarCollapsed()"
          (toggleSidebar)="onToggleSidebar()"
          (searchFocus)="onSearchFocus()"
        />
        <main class="layout__content">
          <app-breadcrumb />
          <router-outlet />
        </main>
      </div>
    </div>
    <app-search-overlay />
  `,
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _navigationConfigService = inject(NavigationConfigService);

  protected readonly isInitialized = this._authService.isInitialized;
  protected readonly currentUser = this._authService.account;
  protected readonly navigationItems = this._navigationConfigService.navigationItems;

  protected readonly isSidebarCollapsed = signal(false);
  private readonly _mobileBreakpoint = 768;

  // ViewChild para el componente de búsqueda
  protected readonly searchOverlay = viewChild<SearchOverlayComponent>(SearchOverlayComponent);

  public ngOnInit(): void {
    this._checkScreenSize();
  }

  /**
   * Verifica el tamaño de la pantalla y ajusta el sidebar automáticamente
   */
  private _checkScreenSize(): void {
    const isMobile = window.innerWidth <= this._mobileBreakpoint;
    this.isSidebarCollapsed.set(isMobile);
  }

  /**
   * Verifica si estamos en vista móvil
   */
  protected isMobileView(): boolean {
    return window.innerWidth <= this._mobileBreakpoint;
  }

  /**
   * Detecta cambios en el tamaño de la ventana
   */
  @HostListener('window:resize')
  protected onResize(): void {
    this._checkScreenSize();
  }

  protected onToggleSidebar(): void {
    this.isSidebarCollapsed.update((value: boolean) => !value);
  }

  protected onLogout(): void {
    this._authService.logout();
  }

  protected onSearchFocus(): void {
    const overlay = this.searchOverlay();
    if (overlay) {
      overlay.open();
    }
  }

  /**
   * Maneja el atajo de teclado Ctrl+K para abrir la búsqueda
   */
  @HostListener('window:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.onSearchFocus();
    }
  }
}
