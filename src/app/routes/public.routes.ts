import { Routes } from '@angular/router';

import { LoginComponent } from '@modules/auth/login.component';

import { loginGuard } from '@guards/login.guard';

import { PUBLIC_ROUTES } from '../config/routes.config';

/**
 * Rutas públicas de la aplicación
 * No requieren autenticación
 */
export const publicRoutes: Routes = [
  {
    path: PUBLIC_ROUTES.LOGIN,
    component: LoginComponent,
    canActivate: [loginGuard],
    title: 'Iniciar Sesión',
  },
];
