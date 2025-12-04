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
    path: PRIVATE_ROUTES.ABOUT,
    loadComponent: () => import('@modules/about/about.component').then((m) => m.AboutComponent),
    data: { breadcrumb: 'Acerca de' },
  },
  {
    path: PRIVATE_ROUTES.SETTINGS,
    loadComponent: () => import('@modules/settings/settings.component').then((m) => m.SettingsComponent),
    data: { breadcrumb: 'Configuración' },
  },
  {
    path: PRIVATE_ROUTES.CIA,
    data: { breadcrumb: 'Cia' },
    children: [
      {
        path: 'propuestas',
        loadComponent: () => import('@modules/cia-propuestas/cia-propuestas').then((m) => m.CiaPropuestas),
        data: { breadcrumb: 'Propuestas' },
      },
      {
        path: 'reportes',
        loadComponent: () => import('@modules/cia-reportes/cia-reportes').then((m) => m.CiaReportes),
        data: { breadcrumb: 'Reportes' },
      },
      {
        path: 'auditoria',
        loadComponent: () => import('@modules/cia-propuestas/cia-propuestas').then((m) => m.CiaPropuestas),
        data: { breadcrumb: 'Auditoría' },
      },
    ],
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
