import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, computed } from '@angular/core';
import { Router } from '@angular/router';

import {
  LucideAngularModule,
  X,
  CheckCheck,
  Trash2,
  Info,
  Clock,
  Check,
  AlignEndVertical,
  CircleAlert,
} from 'lucide-angular';

import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';

import { Notification } from '@models/notification.interface';

@Component({
  selector: 'app-notification-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSidebarComponent {
  private readonly _notificationService = inject(NotificationService);
  private readonly _router = inject(Router);
  private readonly _theme = inject(ThemeService);

  @Input() public isOpen = false;

  @Output() public readonly closeSidebarNotification = new EventEmitter<void>();

  protected readonly CloseIcon = X;
  protected readonly CheckCheckIcon = CheckCheck;
  protected readonly Trash2Icon = Trash2;
  protected readonly InfoIcon = Info;
  protected readonly CheckCircle2Icon = Check;
  protected readonly AlertTriangleIcon = AlignEndVertical;
  protected readonly XCircleIcon = CircleAlert;
  protected readonly ClockIcon = Clock;
  protected readonly notifications = this._notificationService.notifications;

  // Tema
  protected readonly isDarkTheme = computed(() => this._theme.currentTheme() === 'dark');

  /**
   * Emite el evento para cerrar la barra lateral.
   */
  protected onClose(): void {
    this.closeSidebarNotification.emit();
  }

  /**
   * Marca todas las notificaciones como leídas.
   */
  protected markAllAsRead(): void {
    this._notificationService.markAllAsRead();
  }

  /**
   * Marca una notificación como leída.
   */
  protected markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this._notificationService.markAsRead(notification.id);
    }
  }

  /**
   * Elimina una notificación.
   */
  protected removeNotification(event: Event, id: string): void {
    event.stopPropagation();
    this._notificationService.removeNotification(id);
  }

  /**
   * Maneja el clic en una notificación.
   */
  protected onNotificationClick(notification: Notification): void {
    this.markAsRead(notification);
    if (notification.actionUrl) {
      void this._router.navigate([notification.actionUrl]);
      this.onClose();
    }
  }

  /**
   * Obtiene el ícono según el tipo de notificación.
   */
  protected getNotificationIcon(type: string): typeof Info {
    switch (type) {
      case 'success':
        return this.CheckCircle2Icon;
      case 'warning':
        return this.AlertTriangleIcon;
      case 'error':
        return this.XCircleIcon;
      default:
        return this.InfoIcon;
    }
  }

  /**
   * Formatea el tiempo relativo de la notificación.
   */
  protected getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {return 'Ahora';}
    if (minutes < 60) {return `Hace ${minutes.toString()} min`;}
    if (hours < 24) {return `Hace ${hours.toString()}h`;}
    return `Hace ${days.toString()}d`;
  }

  /**
   * Limpia todas las notificaciones.
   */
  protected clearAll(): void {
    this._notificationService.clearAll();
  }
}
