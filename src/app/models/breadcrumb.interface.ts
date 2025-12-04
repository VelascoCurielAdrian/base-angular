/**
 * Interfaz para representar un elemento de breadcrumb
 */
export interface Breadcrumb {
  /**
   * Etiqueta visible del breadcrumb
   */
  label: string;

  /**
   * URL asociada al breadcrumb
   * Si es undefined, el breadcrumb no será clickeable
   */
  url?: string;

  /**
   * Indica si es el breadcrumb activo (actual)
   */
  isActive?: boolean;
}
