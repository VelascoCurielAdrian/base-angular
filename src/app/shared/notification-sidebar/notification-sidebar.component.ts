import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import {
  LucideAngularModule,
  X,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-angular';

import { Notification } from '@models/notification.interface';
import { NotificationService } from '@services/notification.service';

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

  @Input() isOpen = false;

  @Output() readonly close = new EventEmitter<void>();

  protected readonly CloseIcon = X;
  protected readonly CheckCheckIcon = CheckCheck;
  protected readonly Trash2Icon = Trash2;
  protected readonly InfoIcon = Info;
  protected readonly CheckCircle2Icon = CheckCircle2;
  protected readonly AlertTriangleIcon = AlertTriangle;
  protected readonly XCircleIcon = XCircle;
  protected readonly ClockIcon = Clock;

  protected readonly notifications = this._notificationService.notifications;

  /**
   * Emite el evento para cerrar la barra lateral.
   */
  protected onClose(): void {
    this.close.emit();
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
      this._router.navigate([notification.actionUrl]);
      this.onClose();
    }
  }

  /**
   * Obtiene el ícono según el tipo de notificación.
   */
  protected getNotificationIcon(type: string) {
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
    if (minutes < 60) {return `Hace ${minutes} min`;}
    if (hours < 24) {return `Hace ${hours}h`;}
    return `Hace ${days}d`;
  }

  /**
   * Limpia todas las notificaciones.
   */
  protected clearAll(): void {
    this._notificationService.clearAll();
  }
}
