import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente Modal de Confirmación Genérico y Reutilizable
 *
 * Este es un componente de presentación (Dumb Component) que muestra un modal
 * de confirmación personalizable para cualquier acción que requiera confirmación del usuario.
 *
 * @example
 * ```html
 * <app-confirmation-modal
 *   [isVisible]="showLogoutModal"
 *   [title]="'Confirmar salida'"
 *   [message]="'¿Estás seguro de que deseas cerrar sesión?'"
 *   [primaryActionText]="'Sí, cerrar sesión'"
 *   [secondaryActionText]="'Cancelar'"
 *   (confirm)="onConfirmLogout()"
 *   (cancel)="onCancelLogout()">
 * </app-confirmation-modal>
 * ```
 */
@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  /**
   * Controla la visibilidad del modal
   */
  @Input() public isVisible = false;

  /**
   * Título principal del modal
   */
  @Input() public title = 'Confirmar acción';

  /**
   * Mensaje o descripción de la acción a confirmar
   */
  @Input() public message = '¿Estás seguro de que deseas continuar?';

  /**
   * Texto del botón de acción primaria (confirmación)
   */
  @Input() public primaryActionText = 'Confirmar';

  /**
   * Texto del botón de acción secundaria (cancelar)
   */
  @Input() public secondaryActionText = 'Cancelar';

  /**
   * Evento emitido cuando el usuario confirma la acción
   */
  @Output() public confirm = new EventEmitter<void>();

  /**
   * Evento emitido cuando el usuario cancela o cierra el modal
   */
  @Output() public cancelled = new EventEmitter<void>();

  /**
   * Maneja el clic en el botón de confirmación
   */
  public onConfirm(): void {
    this.confirm.emit();
  }

  /**
   * Maneja el clic en el botón de cancelación
   */
  public onCancel(): void {
    this.cancelled.emit();
  }

  /**
   * Maneja el clic en el overlay (fondo oscuro)
   * Cierra el modal como si fuera una cancelación
   */
  public onOverlayClick(): void {
    this.cancelled.emit();
  }

  /**
   * Previene que el clic dentro del modal cierre el overlay
   */
  public onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
