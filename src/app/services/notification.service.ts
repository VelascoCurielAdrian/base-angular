import { Injectable, signal, computed } from '@angular/core';

import { Notification, NotificationType } from '@models/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  public readonly notifications = this._notifications.asReadonly();
  public readonly unreadCount = computed(() => this._notifications().filter(n => !n.isRead).length);

  constructor() {
    // Agregar algunas notificaciones de ejemplo
    this._addExampleNotifications();
  }

  // Ejemplo de notificaciones iniciales
  private _addExampleNotifications(): void {
    const examples: Notification[] = [
      {
        id: '1',
        title: 'Bienvenido',
        message: 'Tu cuenta ha sido configurada correctamente.',
        type: 'success',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        isRead: false,
      },
      {
        id: '2',
        title: 'Nueva actualización',
        message: 'Hay una nueva versión disponible del sistema.',
        type: 'info',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        isRead: false,
        actionUrl: '/settings',
        actionLabel: 'Ver detalles',
      },
      {
        id: '3',
        title: 'Advertencia',
        message: 'Tu sesión expirará en 10 minutos.',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        isRead: false,
      },
    ];

    this._notifications.set(examples);
  }

  public addNotification(
    title: string,
    message: string,
    type: NotificationType = 'info',
    actionUrl?: string,
    actionLabel?: string,
  ): void {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      isRead: false,
      actionUrl,
      actionLabel,
    };

    this._notifications.update(notifications => [notification, ...notifications]);
  }

  public markAsRead(id: string): void {
    this._notifications.update(notifications =>
      notifications.map(n => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  public markAllAsRead(): void {
    this._notifications.update(notifications => notifications.map(n => ({ ...n, isRead: true })));
  }

  public removeNotification(id: string): void {
    this._notifications.update(notifications => notifications.filter(n => n.id !== id));
  }

  public clearAll(): void {
    this._notifications.set([]);
  }
}
