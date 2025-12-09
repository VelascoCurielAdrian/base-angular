import { Routes } from '@angular/router';

import { authGuard } from '@guards/auth.guard';

import { PRIVATE_ROUTES } from '../config/routes.config';

/**
 * Rutas privadas de la aplicación
 * Requieren autenticación y se cargan dentro del MainLayoutComponent
*/
export const privateRoutes: Routes = [
  {
    path: PRIVATE_ROUTES.HOME,
    loadComponent: () => import('@modules/home/home.component').then((m) => m.HomeComponent),
    data: { breadcrumb: 'Inicio' },
  },
  {
    path: PRIVATE_ROUTES.SETTINGS,
    loadComponent: () => import('@modules/settings/settings.component').then((m) => m.SettingsComponent),
    data: { breadcrumb: 'Configuración' },
  },
  // Agregar más rutas privadas aquí
];

/**
 * Ruta raíz para todas las rutas privadas
 * Usa el MainLayoutComponent como contenedor
 */
export const protectedRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@containers/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: privateRoutes,
  },
];
