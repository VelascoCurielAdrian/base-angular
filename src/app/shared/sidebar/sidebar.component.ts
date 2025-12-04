import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  LucideAngularModule,
  LucideIconData,
  PanelLeft,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  File,
  Circle,
  User,
  LogOut,
} from 'lucide-angular';

import type { NavigationItem } from '../../config/navigation';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public readonly navigationItems = input.required<NavigationItem[]>();
  public readonly userName = input<string | null>(null);
  public readonly isCollapsed = input<boolean>(false);

  public readonly toggleCollapse = output();
  public readonly logout = output();

  // Iconos del sistema (UI)
  protected readonly icons = {
    PanelLeft,
    PanelLeftClose,
    ChevronDown,
    ChevronRight,
    FolderOpen,
    File,
    Circle,
    User,
    LogOut,
  };

  // Estado de expansión de items
  protected readonly _expandedItems = signal<Set<string | number>>(new Set());

  // Computed para el icono del toggle
  protected readonly toggleIcon = computed(() =>
    this.isCollapsed() ? this.icons.PanelLeft : this.icons.PanelLeftClose,
  );

  // Verificar si un item está expandido
  protected isItemExpanded(itemId: string | number): boolean {
    return this._expandedItems().has(itemId);
  }

  // Toggle expansion de un item
  protected toggleItemExpansion(item: { id: string | number }, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const expanded = new Set(this._expandedItems());
    console.log(expanded);
    if (expanded.has(item.id)) {
      expanded.delete(item.id);
    } else {
      expanded.add(item.id);
    }
    this._expandedItems.set(expanded);
  }

  // Verificar si un item tiene children
  protected hasChildren(item: NavigationItem & { children?: NavigationItem[] }): boolean {
    return !!item.children && item.children.length > 0;
  }

  // Obtener el label del item (compatibilidad con 'name' o 'label')
  protected getItemLabel(item: Required<Pick<NavigationItem, 'label' | 'name'>>): string {
    return item.label;
  }

  // Verificar si debe mostrar el link o solo el expand
  protected shouldShowLink(item: NavigationItem): boolean {
    return !!item.route;
  }

  // Obtener el icono del item o un icono por defecto
  protected getIcon(item: NavigationItem, _defaultIcon: keyof typeof this.icons): LucideIconData {
    // Los items ahora vienen con el icono correcto de Lucide desde la configuración
    return item.icon;
  }

  // Obtener el icono de expansión para un item
  protected getExpandIcon(itemId: string | number): LucideIconData {
    return this.isItemExpanded(itemId) ? this.icons.ChevronDown : this.icons.ChevronRight;
  }

  // Verificar si un item padre está expandido y el sidebar no está colapsado
  protected isItemExpandedAndSidebarOpen(itemId: string | number): boolean {
    return this.isItemExpanded(itemId) && !this.isCollapsed();
  }
}
