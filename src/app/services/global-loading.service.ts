import { Injectable, signal } from '@angular/core';

/**
 * Servicio para controlar el loading global de la aplicación
 */
@Injectable({ providedIn: 'root' })
export class GlobalLoadingService {
  public readonly isLoading = signal<boolean>(false);

  /**
   * Muestra el loading global
   */
  public show(): void {
    this.isLoading.set(true);
  }

  /**
   * Oculta el loading global
   */
  public hide(): void {
    this.isLoading.set(false);
  }
}
