/**
 * Configuración de rutas públicas de la aplicación
 * Estas rutas no requieren autenticación
 */
export const PUBLIC_ROUTES = {
  LOGIN: 'login',
} as const;

/**
 * Configuración de rutas privadas de la aplicación
 * Estas rutas requieren autenticación y usan el layout principal
 */
export const PRIVATE_ROUTES = {
  HOME: '',
  ABOUT: 'about',
  SETTINGS: 'settings',
  CIA: 'cia',
} as const;

/**
 * Configuración de rutas de error
 */
export const ERROR_ROUTES = {
  NOT_FOUND: '**',
} as const;

/**
 * Tipo para todas las rutas públicas
 */
export type PublicRoute = (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES];

/**
 * Tipo para todas las rutas privadas
 */
export type PrivateRoute = (typeof PRIVATE_ROUTES)[keyof typeof PRIVATE_ROUTES];
