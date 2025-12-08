import { Injectable, signal } from '@angular/core';

import type { Toast, ToastType } from '@models/toast.interface';

/**
 * Servicio para mostrar notificaciones toast
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  public readonly toasts = signal<Toast[]>([]);

  /**
   * Muestra un toast
   */
  public show(message: string, type: ToastType = 'info', duration = 5000): void {
    const id = `toast-${Date.now().toString()}-${Math.random().toString()}`;
    const toast: Toast = { id, message, type, duration };

    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  /**
   * Muestra un toast de éxito
   */
  public success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Muestra un toast de error
   */
  public error(message: string, duration = 6000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Muestra un toast de advertencia
   */
  public warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Muestra un toast informativo
   */
  public info(message: string, duration = 4000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Remueve un toast por su ID
   */
  public remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Limpia todos los toasts
   */
  public clear(): void {
    this.toasts.set([]);
  }
}
