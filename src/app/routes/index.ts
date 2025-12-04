import { Routes } from '@angular/router';

import { protectedRoutes } from './private.routes';
import { publicRoutes } from './public.routes';

/**
 * Configuración principal de rutas de la aplicación
 * Combina rutas públicas y privadas en un solo array
 */
export const routes: Routes = [
  ...publicRoutes,
  ...protectedRoutes,
  // Ruta wildcard para manejar 404
  {
    path: '**',
    loadComponent: () =>
      import('@modules/errors/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Página no encontrada',
  },
];
